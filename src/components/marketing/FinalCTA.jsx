import { useNavigate } from 'react-router-dom'
import { Rocket, ArrowRight } from 'lucide-react'
import { Section, Container } from '../layout/PageContainer'
import Button from '../ui/Button'

export default function FinalCTA() {
  const navigate = useNavigate()
  return (
    <Section className="bg-primary-600 text-white">
      <Container className="max-w-2xl text-center">
        <Rocket className="w-10 h-10 mx-auto mb-6 text-primary-100" />
        <h2 className="text-h2 font-display mb-4 text-balance">Prepare for the interview before it happens</h2>
        <p className="text-primary-100 mb-8 text-balance">
          Gain real technical interview experience and walk into placements with confidence.
        </p>
        <Button size="lg" variant="secondary" onClick={() => navigate('/sessions')} className="bg-white text-primary-700 hover:bg-primary-50">
          Book Your Mock Interview
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Container>
    </Section>
  )
}
