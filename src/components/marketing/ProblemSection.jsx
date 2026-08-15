import { Section, Container, SectionHeading } from '../layout/PageContainer'

const STEPS = [
  {
    title: 'First interview: shock',
    text: 'Confusion about format, expectations, and how deep the questions actually go.',
  },
  {
    title: 'Second interview: realization',
    text: 'You start to see how much preparation this really takes — and how little you did.',
  },
  {
    title: 'Third interview: confidence',
    text: 'By now you understand the pattern. GuideUp gets you here before placements start.',
  },
]

export default function ProblemSection() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Why GuideUp exists"
          title="Most students learn how interviews work only after losing real opportunities"
          description="A single bad first interview shouldn't cost you the internship you were counting on."
        />

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.title} className="rounded-xl border border-border bg-card p-6">
              <span className="inline-flex w-8 h-8 rounded-full bg-primary-50 text-primary-600 font-display font-bold text-sm items-center justify-center mb-4">
                {i + 1}
              </span>
              <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>

        <p className="text-center mt-12 text-lg text-foreground/80 max-w-2xl mx-auto text-balance">
          GuideUp helps you go through that curve <span className="font-semibold text-foreground">before</span> a
          real placement is on the line.
        </p>
      </Container>
    </Section>
  )
}
