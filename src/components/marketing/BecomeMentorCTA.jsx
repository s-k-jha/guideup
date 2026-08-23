import { Link } from 'react-router-dom'
import { ArrowRight, GraduationCap } from 'lucide-react'
import { Section, Container } from '../layout/PageContainer'
import Button from '../ui/Button'

export default function BecomeMentorCTA() {
  return (
    <Section>
      <Container>
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8 sm:gap-10">
          <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center shrink-0">
            <GraduationCap className="w-7 h-7 text-primary-600" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-h3 text-foreground mb-2">Working engineer? Help students avoid your early mistakes.</h2>
            <p className="text-muted-foreground max-w-xl">
              Your schedule. Your pace. Get paid per session.
            </p>
          </div>
          <Button size="lg" variant="outline" asChild className="shrink-0">
            <Link to="/become-a-mentor">
              Become a Mentor
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  )
}
