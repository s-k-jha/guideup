import { Rocket, Users, CheckCircle2 } from 'lucide-react'
import { Section, Container, SectionHeading } from '../layout/PageContainer'

const STEPS = [
  {
    icon: Rocket,
    title: 'Real interview simulation',
    text: 'A structured, realistic technical interview — not a casual chat.',
  },
  {
    icon: Users,
    title: 'Multi-domain interview panel',
    text: 'Engineers across DSA, full-stack development, AI/ML, and system design.',
  },
  {
    icon: CheckCircle2,
    title: 'Detailed, actionable feedback',
    text: 'Know exactly what to fix before your next real interview.',
  },
]

export default function HowItWorks() {
  return (
    <Section className="bg-secondary/30">
      <Container>
        <SectionHeading eyebrow="How it works" title="How GuideUp mock interviews work" />

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.title} className="bg-card p-7 rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-shadow duration-200">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.text}</p>
              </div>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
