import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Check if onboarding is complete
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed, family_id')
      .eq('id', user.id)
      .single()

    if (profile?.onboarding_completed && profile?.family_id) {
      redirect('/dashboard')
    } else {
      redirect('/onboarding')
    }
  }

  // Not logged in - show landing page or redirect to login
  redirect('/login')
}
