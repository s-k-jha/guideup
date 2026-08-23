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
        <h2 className="text-h2 font-display mb-4 text-balance">Placement season won't wait for you to feel ready</h2>
        <p className="text-primary-100 mb-8 text-balance">
          Skipped prep shows. Interviewers notice. Get the rehearsal you never had.
        </p>
        <Button size="lg" variant="secondary" onClick={() => navigate('/sessions')} className="bg-white text-primary-700 hover:bg-primary-50">
          Book Your Mock Interview
          <ArrowRight className="w-4 h-4" />
        </Button>
        <p className="text-xs text-primary-100/80 mt-4">
          Not ready to book? <button onClick={() => navigate('/talk-to-mentor')} className="underline underline-offset-2 hover:text-white">Talk to a mentor free</button> first.
        </p>
      </Container>
    </Section>
  )
}
