export function isPremiumTier(tier: string | null | undefined): boolean {
  return tier === 'premium' || tier === 'lifetime'
}
