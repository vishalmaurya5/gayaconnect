export const CONTACT_ACCESS_AMOUNT = 9;
export const CONTACT_ACCESS_DAYS = 365;

export const getContactAccessExpiry = (currentExpiry) => {
  const now = Date.now();
  const current = currentExpiry ? new Date(currentExpiry).getTime() : 0;
  const startsAt = current > now ? current : now;
  return new Date(startsAt + CONTACT_ACCESS_DAYS * 24 * 60 * 60 * 1000);
};

export const hasActiveContactAccess = (user) => {
  if (!user) return false;
  if (['admin', 'vendor'].includes(user.role)) return true;
  return Boolean(user.contactAccessExpiresAt && new Date(user.contactAccessExpiresAt).getTime() > Date.now());
};

export const toAuthUser = (user) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  contactAccessExpiresAt: user.contactAccessExpiresAt || null,
  hasContactAccess: hasActiveContactAccess(user),
});

export const redactVendorContact = (vendor, canViewContact) => {
  const data = typeof vendor.toObject === 'function' ? vendor.toObject() : { ...vendor };

  if (canViewContact) {
    data.canViewContact = true;
    data.contactAccessRequired = false;
    return data;
  }

  data.contactNumber = null;
  data.canViewContact = false;
  data.contactAccessRequired = true;
  return data;
};
