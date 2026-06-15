import Razorpay from 'razorpay'
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import Payment from '@/lib/db/models/Payment'
import { CONTACT_ACCESS_PLAN, PAYMENT_PLANS } from '@/lib/utils/contactAccess'
import { createPhonePeCheckout, hasPhonePeConfig } from '@/lib/payments/phonepe'
import { getAuthenticatedUser } from '@/lib/security/auth'
import { enforceRateLimit } from '@/lib/security/rateLimit'
import { paymentOrderSchema, validationError } from '@/lib/security/validation'

const razorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

const hasRazorpayKeys = () => Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
const shouldUseDummy = (request) =>
  process.env.NODE_ENV !== 'production' && (
    request.headers.get('x-use-dummy-razorpay') === 'true' ||
    request.headers.get('x-use-dummy-phonepe') === 'true' ||
    process.env.DUMMY_RAZORPAY === 'true' ||
    process.env.DUMMY_PHONEPE === 'true'
  )

export async function POST(request) {
  const limited = enforceRateLimit(request, 'payment-order', { limit: 20, windowMs: 15 * 60 * 1000 })
  if (limited) return limited

  try {
    await connectDB()

    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ success: false, message: 'Login required' }, { status: 401 })
    }

    const parsed = paymentOrderSchema.safeParse(await request.json().catch(() => ({ planType: CONTACT_ACCESS_PLAN })))
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: validationError(parsed.error) }, { status: 400 })
    }
    const { provider, planType } = parsed.data

    const plan = PAYMENT_PLANS[planType]
    if (!plan) {
      return NextResponse.json({ success: false, message: 'Unsupported payment plan' }, { status: 400 })
    }

    if (!plan.roles.includes(user.role)) {
      return NextResponse.json(
        { success: false, message: `${plan.description} is not available for this account type` },
        { status: 403 }
      )
    }

    const amount = plan.amount
    const providerConfigured = provider === 'razorpay' ? hasRazorpayKeys() : hasPhonePeConfig()
    const useDummy = shouldUseDummy(request)
    if (!providerConfigured && !useDummy) {
      return NextResponse.json({ success: false, message: 'Payment provider is unavailable' }, { status: 503 })
    }
    const merchantOrderId = provider === 'phonepe' ? `phonepe_order_${Date.now()}` : null
    const phonePeOrder = provider === 'phonepe' && !useDummy
      ? await createPhonePeCheckout({ user, amount, merchantOrderId, request })
      : null
    const order = provider === 'razorpay' && !useDummy
      ? await razorpay().orders.create({
          amount: amount * 100,
          currency: 'INR',
          receipt: `${plan.receiptPrefix}_${user._id}_${Date.now()}`.slice(0, 40),
          notes: {
            userId: String(user._id),
            planType,
          },
        })
      : provider === 'phonepe'
        ? {
          id: useDummy ? `dummy_phonepe_order_${Date.now()}` : merchantOrderId,
          amount: amount * 100,
          currency: 'INR',
          status: 'created',
          redirectUrl: useDummy
            ? null
            : phonePeOrder?.redirectUrl || null,
          raw: phonePeOrder,
        }
        : {
          id: `dummy_order_${Date.now()}`,
          amount: amount * 100,
          currency: 'INR',
          receipt: `dummy_${plan.receiptPrefix}_${Date.now()}`,
          status: 'created',
        }

    const payment = await Payment.create({
      userId: user._id,
      amount,
      currency: 'INR',
      planType,
      paymentMethod: provider,
      transactionId: `${provider}_${order.id}`,
      status: 'pending',
      razorpayOrderId: order.id,
      metadata: {
        description: plan.description,
        accessDays: plan.days,
        provider,
        phonePeRedirectUrl: order.redirectUrl || undefined,
        phonePeOrderId: phonePeOrder?.phonePeOrderId || undefined,
        phonePeExpireAt: phonePeOrder?.expireAt || undefined,
        phonePeState: phonePeOrder?.status || undefined,
      },
    })

    return NextResponse.json({
      success: true,
      provider,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
      isDummy: useDummy,
      order,
      paymentId: payment._id,
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
