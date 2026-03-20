import { redirect } from 'next/navigation'

/**
 * Redirect to the new ready page.
 * Kept for backward compatibility.
 */
export default function OnboardingComplete() {
  redirect('/onboarding/ready')
}
