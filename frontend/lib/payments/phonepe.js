import {
  Env,
  MetaInfo,
  PrefillUserLoginDetails,
  StandardCheckoutClient,
  StandardCheckoutPayRequest,
} from '@phonepe-pg/pg-sdk-node'

export function hasPhonePeConfig() {
  return Boolean(process.env.PHONEPE_CLIENT_ID && process.env.PHONEPE_CLIENT_SECRET)
}

export function getPhonePeClient() {
  const clientId = process.env.PHONEPE_CLIENT_ID
  const clientSecret = process.env.PHONEPE_CLIENT_SECRET
  const clientVersion = Number(process.env.PHONEPE_CLIENT_VERSION || 1)
  const env = process.env.PHONEPE_ENV === 'production' ? Env.PRODUCTION : Env.SANDBOX

  if (!clientId || !clientSecret) {
    throw new Error('PhonePe credentials are not configured')
  }

  return StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env)
}

function getPrefillUserLoginDetails(user) {
  const digits = String(user?.phone || '').replace(/\D/g, '')
  const phoneNumber = digits.length >= 10 ? digits.slice(-10) : ''

  if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
    return null
  }

  return PrefillUserLoginDetails.builder()
    .phoneNumber(phoneNumber)
    .build()
}

export async function createPhonePeCheckout({ user, amount, merchantOrderId, request }) {
  const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const redirectUrl = `${origin}/phonepe-return?orderId=${merchantOrderId}`
  const amountInPaise = Math.round(amount * 100)
  const metaInfo = MetaInfo.builder()
    .udf1(String(user._id))
    .udf2('contact_access_yearly')
    .udf3(user.email || '')
    .build()
  const prefillUserLoginDetails = getPrefillUserLoginDetails(user)
  const payRequestBuilder = StandardCheckoutPayRequest.builder()
    .merchantOrderId(merchantOrderId)
    .amount(amountInPaise)
    .metaInfo(metaInfo)
    .redirectUrl(redirectUrl)
    .message('Gaya Seva contact access')
    .expireAfter(1200)

  if (prefillUserLoginDetails) {
    payRequestBuilder.prefillUserLoginDetails(prefillUserLoginDetails)
  }

  const payRequest = payRequestBuilder.build()

  const response = await getPhonePeClient().pay(payRequest)
  const checkoutPageUrl = response.redirectUrl || response.redirect_url
  const phonePeOrderId = response.orderId || response.order_id
  const expireAt = response.expireAt || response.expire_at

  return {
    id: merchantOrderId,
    amount: amountInPaise,
    currency: 'INR',
    status: String(response.state || 'created').toLowerCase(),
    redirectUrl: checkoutPageUrl,
    phonePeOrderId,
    expireAt,
    raw: response,
  }
}

export async function getPhonePeCheckoutStatus(merchantOrderId) {
  return getPhonePeClient().getOrderStatus(merchantOrderId)
}
