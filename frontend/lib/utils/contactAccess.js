export const CONTACT_ACCESS_AMOUNT = 9
export const CONTACT_ACCESS_DAYS = 365
export const CONTACT_ACCESS_PLAN = 'contact_access_yearly'
export const OFFER_ACCESS_USER_PLAN = 'offer_access_user_yearly'
export const OFFER_ACCESS_VENDOR_PLAN = 'offer_access_vendor_yearly'
export const OFFER_POST_VENDOR_PLAN = 'offer_post_vendor_yearly'
export const BANNER_POST_MONTHLY_PLAN = 'banner_post_monthly'
export const SUBSCRIPTION_MONTHLY_PLAN = 'subscription_monthly'
export const OFFER_TIER_7DAYS = 'offer_tier_7days'
export const OFFER_TIER_30DAYS = 'offer_tier_30days'
export const OFFER_TIER_365DAYS = 'offer_tier_365days'
export const VENDOR_OFFER_POST_LIMIT = 5
export const VENDOR_BANNER_POST_LIMIT = 2

export const PAYMENT_PLANS = {
  [CONTACT_ACCESS_PLAN]: {
    amount: 9,
    days: 365,
    roles: ['user'],
    receiptPrefix: 'contact',
    description: 'Yearly vendor contact access',
  },
  [OFFER_ACCESS_USER_PLAN]: {
    amount: 9,
    days: 365,
    roles: ['user'],
    receiptPrefix: 'offer_user',
    description: 'Yearly offer page access for customers',
  },
  [OFFER_ACCESS_VENDOR_PLAN]: {
    amount: 49,
    days: 365,
    roles: ['vendor'],
    receiptPrefix: 'offer_vendor',
    description: 'Yearly offer page access for vendors',
  },
  [OFFER_POST_VENDOR_PLAN]: {
    amount: 99,
    days: 365,
    roles: ['vendor'],
    receiptPrefix: 'offer_post',
    description: 'Yearly vendor offer posting access',
  },
  [BANNER_POST_MONTHLY_PLAN]: {
    amount: 399,
    days: 30,
    roles: ['vendor'],
    receiptPrefix: 'banner_post',
    description: 'Monthly homepage banner promotion',
  },
  [SUBSCRIPTION_MONTHLY_PLAN]: {
    amount: 11,
    days: 30,
    roles: ['user', 'vendor'],
    receiptPrefix: 'sub_monthly',
    description: 'Monthly subscription for platform access',
  },
  [OFFER_TIER_7DAYS]: {
    amount: 39,
    days: 7,
    roles: ['vendor'],
    receiptPrefix: 'off_7d',
    description: '7 Days Offer Post',
  },
  [OFFER_TIER_30DAYS]: {
    amount: 199,
    days: 30,
    roles: ['vendor'],
    receiptPrefix: 'off_30d',
    description: '30 Days Offer Post',
  },
  [OFFER_TIER_365DAYS]: {
    amount: 399,
    days: 365,
    roles: ['vendor'],
    receiptPrefix: 'off_365d',
    description: '365 Days Offer Post',
  },
}

export function getPlanExpiry(currentExpiry, days) {
  const now = Date.now()
  const current = currentExpiry ? new Date(currentExpiry).getTime() : 0
  const startsAt = current > now ? current : now
  return new Date(startsAt + days * 24 * 60 * 60 * 1000)
}

export function getContactAccessExpiry(currentExpiry) {
  return getPlanExpiry(currentExpiry, CONTACT_ACCESS_DAYS)
}

export function hasActiveContactAccess(user) {
  if (!user) return false
  if (['admin', 'vendor'].includes(user.role)) return true
  return Boolean(user.contactAccessExpiresAt && new Date(user.contactAccessExpiresAt).getTime() > Date.now())
}

export function hasActiveOfferAccess(user) {
  if (!user) return false
  if (user.role === 'admin') return true
  return Boolean(user.offerAccessExpiresAt && new Date(user.offerAccessExpiresAt).getTime() > Date.now())
}

export function hasActiveOfferPostAccess(user) {
  if (!user) return false
  if (user.role === 'admin') return true
  return Boolean(user.offerPostExpiresAt && new Date(user.offerPostExpiresAt).getTime() > Date.now())
}

export function hasActiveBannerPostAccess(user) {
  if (!user) return false
  if (user.role === 'admin') return true
  return Boolean(user.bannerPostExpiresAt && new Date(user.bannerPostExpiresAt).getTime() > Date.now())
}

export function toAuthUser(user) {
  const hasContactAccess = hasActiveContactAccess(user)
  const hasOfferAccess = hasActiveOfferAccess(user)
  const hasOfferPostAccess = hasActiveOfferPostAccess(user)
  const hasBannerPostAccess = hasActiveBannerPostAccess(user)

  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    isVerified: user.isVerified,
    profileImage: user.profileImage || null,
    address: user.address || '',
    contactAccessExpiresAt: user.contactAccessExpiresAt || null,
    offerAccessExpiresAt: user.offerAccessExpiresAt || null,
    offerPostExpiresAt: user.offerPostExpiresAt || null,
    bannerPostExpiresAt: user.bannerPostExpiresAt || null,
    hasContactAccess,
    hasOfferAccess,
    hasOfferPostAccess,
    hasBannerPostAccess,
    subscriptionActive: user.subscriptionActive || false,
    subscriptionExpiry: user.subscriptionExpiry || null,
    subscriptionPlan: user.subscriptionPlan || 'none',
  }
}

export function redactVendorContact(vendor, canViewContact) {
  const data = typeof vendor.toObject === 'function' ? vendor.toObject() : { ...vendor }

  if (canViewContact) {
    data.canViewContact = true
    data.contactAccessRequired = false
    return data
  }

  if (Object.prototype.hasOwnProperty.call(data, 'phone')) data.phone = null
  if (Object.prototype.hasOwnProperty.call(data, 'contactNumber')) data.contactNumber = null
  data.canViewContact = false
  data.contactAccessRequired = true
  return data
}
