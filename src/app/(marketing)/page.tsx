import { Hero } from '@/components/marketing/Hero'
import { ProblemSolution } from '@/components/marketing/ProblemSolution'
import { Features } from '@/components/marketing/Features'
import { ContentPreview } from '@/components/marketing/ContentPreview'
import { HowItWorks } from '@/components/marketing/HowItWorks'
import { Testimonials } from '@/components/marketing/Testimonials'
import { Pricing } from '@/components/marketing/Pricing'
import { FinalCTA } from '@/components/marketing/FinalCTA'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <ProblemSolution />
      <Features />
      <ContentPreview />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FinalCTA />
    </>
  )
}
