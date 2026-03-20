export const GRACE_PERIOD_DAYS = 7

export function isPremiumTier(tier: string | null | undefined): boolean {
  return tier === 'premium' || tier === 'lifetime'
}

export function isInGracePeriod(expiresAt: string | null | undefined): boolean {
  if (!expiresAt) return false
  const expiry = new Date(expiresAt)
  const now = new Date()
  if (expiry >= now) return false // not expired yet
  const msInDay = 1000 * 60 * 60 * 24
  const daysSinceExpiry = (now.getTime() - expiry.getTime()) / msInDay
  return daysSinceExpiry <= GRACE_PERIOD_DAYS
}

export function gracePeriodDaysRemaining(expiresAt: string | null | undefined): number {
  if (!expiresAt) return 0
  const expiry = new Date(expiresAt)
  const now = new Date()
  if (expiry >= now) return 0
  const msInDay = 1000 * 60 * 60 * 24
  const daysSinceExpiry = (now.getTime() - expiry.getTime()) / msInDay
  const remaining = Math.ceil(GRACE_PERIOD_DAYS - daysSinceExpiry)
  return Math.max(0, remaining)
}
