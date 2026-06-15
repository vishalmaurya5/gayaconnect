import { getAuthenticatedUser } from './auth'

export async function checkSubscription(request) {
  const user = await getAuthenticatedUser(request)
  if (!user) {
    return { error: 'Unauthorized', status: 401 }
  }

  // Check if subscription exists and is active
  if (!user.subscriptionActive || !user.subscriptionExpiry) {
    return { error: 'Subscription required', status: 403 }
  }

  // Check if expired
  if (new Date(user.subscriptionExpiry).getTime() < Date.now()) {
    user.subscriptionActive = false;
    await user.save();
    return { error: 'Subscription expired', status: 403 }
  }

  return { user }
}
