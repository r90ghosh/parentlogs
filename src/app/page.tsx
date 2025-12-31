import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Hero } from '@/components/marketing/Hero'
import { ProblemSolution } from '@/components/marketing/ProblemSolution'
import { Features } from '@/components/marketing/Features'
import { ContentPreview } from '@/components/marketing/ContentPreview'
import { HowItWorks } from '@/components/marketing/HowItWorks'
import { Testimonials } from '@/components/marketing/Testimonials'
import { Pricing } from '@/components/marketing/Pricing'
import { FinalCTA } from '@/components/marketing/FinalCTA'
import { Header } from '@/components/marketing/Header'
import { Footer } from '@/components/marketing/Footer'

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

  // Not logged in - show landing page
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />
      <main className="flex-1">
        <Hero />
        <ProblemSolution />
        <Features />
        <ContentPreview />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
