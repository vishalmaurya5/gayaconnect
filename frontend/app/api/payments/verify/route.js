import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import Payment from '@/lib/db/models/Payment'
import {
  BANNER_POST_MONTHLY_PLAN,
  CONTACT_ACCESS_PLAN,
  OFFER_ACCESS_USER_PLAN,
  OFFER_ACCESS_VENDOR_PLAN,
  OFFER_POST_VENDOR_PLAN,
  SUBSCRIPTION_MONTHLY_PLAN,
  PAYMENT_PLANS,
  getContactAccessExpiry,
  getPlanExpiry,
  toAuthUser,
} from '@/lib/utils/contactAccess'
import { getPhonePeCheckoutStatus } from '@/lib/payments/phonepe'
import { getAuthenticatedUser } from '@/lib/security/auth'
import { enforceRateLimit } from '@/lib/security/rateLimit'

const hasRazorpayKeys = () => Boolean(process.env.RAZORPAY_KEY_SECRET)
const isDummyPayment = (orderId, signature) =>
  process.env.NODE_ENV !== 'production' &&
  (String(orderId || '').startsWith('dummy_order_') || String(orderId || '').startsWith('dummy_phonepe_order_')) &&
  signature === 'dummy_signature'

function applyPaymentPlan(user, planType) {
  const plan = PAYMENT_PLANS[planType]

  if (planType === CONTACT_ACCESS_PLAN) {
    user.contactAccessPurchasedAt = new Date()
    user.contactAccessExpiresAt = getContactAccessExpiry(user.contactAccessExpiresAt)
  } else if ([OFFER_ACCESS_USER_PLAN, OFFER_ACCESS_VENDOR_PLAN].includes(planType)) {
    user.offerAccessPurchasedAt = new Date()
    user.offerAccessExpiresAt = getPlanExpiry(user.offerAccessExpiresAt, plan?.days || 365)
  } else if (planType === OFFER_POST_VENDOR_PLAN) {
    user.offerPostPurchasedAt = new Date()
    user.offerPostExpiresAt = getPlanExpiry(user.offerPostExpiresAt, plan?.days || 365)
  } else if (planType === SUBSCRIPTION_MONTHLY_PLAN) {
    user.subscriptionActive = true
    user.subscriptionPlan = 'monthly'
    user.subscriptionExpiry = getPlanExpiry(user.subscriptionExpiry, plan?.days || 30)
  }
}

export async function POST(request) {
  const limited = enforceRateLimit(request, 'payment-verify', { limit: 30, windowMs: 15 * 60 * 1000 })
  if (limited) return limited

  try {
    await connectDB()

    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ success: false, message: 'Login required' }, { status: 401 })
    }

    const {
      provider = 'razorpay',
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      phonepe_order_id,
    } = await request.json()

    if (provider === 'phonepe') {
      const orderId = phonepe_order_id || razorpay_order_id
      const payment = await Payment.findOne({ userId: user._id, razorpayOrderId: orderId })
      if (!payment) {
        return NextResponse.json({ success: false, message: 'Payment record not found' }, { status: 404 })
      }

      if (!isDummyPayment(orderId, razorpay_signature)) {
        const status = await getPhonePeCheckoutStatus(orderId)
        const state = status.state || status.data?.state || status.status
        if (!['COMPLETED', 'SUCCESS', 'PAYMENT_SUCCESS'].includes(String(state).toUpperCase())) {
          return NextResponse.json({ success: false, message: 'PhonePe payment is not successful yet', status }, { status: 400 })
        }
        payment.metadata = { ...(payment.metadata || {}), phonePeStatus: status }
      }

      payment.razorpayPaymentId = razorpay_payment_id || `phonepe_payment_${Date.now()}`
      payment.razorpaySignature = razorpay_signature || 'phonepe_status_verified'
      payment.status = 'success'
      await payment.save()

      applyPaymentPlan(user, payment.planType)
      await user.save()

      return NextResponse.json({
        success: true,
        payment,
        user: toAuthUser(user),
        message: 'PhonePe payment verified and access activated',
      })
    }

    const dummyPayment = isDummyPayment(razorpay_order_id, razorpay_signature)
    if (!dummyPayment && !hasRazorpayKeys()) {
      return NextResponse.json({ success: false, message: 'Payment provider is unavailable' }, { status: 503 })
    }

    const expectedSignature = dummyPayment
      ? 'dummy_signature'
      : crypto
          .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, message: 'Invalid payment signature' }, { status: 400 })
    }

    const payment = await Payment.findOne({
      userId: user._id,
      razorpayOrderId: razorpay_order_id,
    })

    if (!payment) {
      return NextResponse.json({ success: false, message: 'Payment record not found' }, { status: 404 })
    }

    payment.razorpayPaymentId = razorpay_payment_id
    payment.razorpaySignature = razorpay_signature
    payment.status = 'success'
    await payment.save()

    applyPaymentPlan(user, payment.planType)
    await user.save()

    return NextResponse.json({
      success: true,
      payment,
      user: toAuthUser(user),
      message: 'Payment verified and access activated',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
