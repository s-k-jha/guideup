import { useEffect } from 'react'
import Seo, { SITE_URL } from '../lib/seo'
import Hero from '../components/marketing/Hero'
import TrustBar from '../components/marketing/TrustBar'
import ProblemSection from '../components/marketing/ProblemSection'
import HowItWorks from '../components/marketing/HowItWorks'
import SessionsPricing from '../components/marketing/SessionsPricing'
import MentorPanelPreview from '../components/marketing/MentorPanelPreview'
import WhyGuideUp from '../components/marketing/WhyGuideUp'
import ResourcesPreview from '../components/marketing/ResourcesPreview'
import BecomeMentorCTA from '../components/marketing/BecomeMentorCTA'
import FAQ from '../components/marketing/FAQ'
import FinalCTA from '../components/marketing/FinalCTA'

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'GuideUp',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  description: 'GuideUp helps Indian college students practice real technical mock interviews with working engineers.',
  founder: { '@type': 'Person', name: 'Shivam Kumar' },
}

export default function LandingPage() {
  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'landing_view', { page: 'landing' })
    }
  }, [])

  return (
    <>
      <Seo
        title="Practice Real Technical Interviews & Crack Placements"
        description="GuideUp helps students practice real technical mock interviews with expert engineers. Gain real interview experience and crack internships and tech placements with confidence."
        path="/"
        jsonLd={organizationJsonLd}
      />
      <Hero />
      <TrustBar />
      <ProblemSection />
      <HowItWorks />
      <SessionsPricing />
      <MentorPanelPreview />
      <WhyGuideUp />
      <ResourcesPreview />
      <BecomeMentorCTA />
      <FAQ />
      <FinalCTA />
    </>
  )
}
