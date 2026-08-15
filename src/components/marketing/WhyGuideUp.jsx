import { X, Check } from 'lucide-react'
import { Section, Container, SectionHeading } from '../layout/PageContainer'

const OTHERS = ['₹2,000–20,000 bootcamp-style programs', 'Long multi-week commitments', 'Often theoretical, not interview-realistic']
const GUIDEUP = ['Pay per session, starting under ₹500', 'Book a single round whenever you need it', 'Real interview format with working engineers']

export default function WhyGuideUp() {
  return (
    <Section className="bg-secondary/30">
      <Container>
        <SectionHeading eyebrow="Why students choose GuideUp" title="Built to fit how students actually prepare" />

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-card p-7 rounded-2xl border border-border">
            <div className="font-semibold text-foreground mb-5">Typical interview prep programs</div>
            <ul className="space-y-3">
              {OTHERS.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <X className="w-4 h-4 text-destructive/70 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-primary-600 text-white p-7 rounded-2xl shadow-card-hover">
            <div className="font-semibold mb-5">GuideUp mock interviews</div>
            <ul className="space-y-3">
              {GUIDEUP.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-primary-50">
                  <Check className="w-4 h-4 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  )
}
