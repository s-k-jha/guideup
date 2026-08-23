import { useEffect, useState } from 'react'
import { Section, Container, SectionHeading } from '../layout/PageContainer'
import { cn } from '../../lib/utils'

const STAGES = [
  { emoji: '😳', label: 'Shock', text: 'First interview blindsided you.' },
  { emoji: '😮‍💨', label: 'Reality check', text: 'Prep takes way more than YouTube.' },
  { emoji: '💪', label: 'Confidence', text: 'Now you know exactly what to expect.' },
]

export default function ProblemSection() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % STAGES.length), 3200)
    return () => clearInterval(id)
  }, [])

  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Why GuideUp exists"
          title="IIT kids get this from seniors. You get it from us."
          description="One bad first interview shouldn't cost you the internship."
        />

        <div className="max-w-xl mx-auto">
          <div className="grid grid-cols-3 gap-3 mb-5">
            {STAGES.map((stage, i) => (
              <button
                key={stage.label}
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={cn(
                  'flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all duration-300',
                  active === i
                    ? 'border-primary-500 bg-primary-50 shadow-card-hover scale-[1.03]'
                    : 'border-border bg-card opacity-60 hover:opacity-100'
                )}
              >
                <span className="text-3xl leading-none">{stage.emoji}</span>
                <span className={cn('text-xs font-semibold', active === i ? 'text-primary-700' : 'text-foreground')}>
                  {stage.label}
                </span>
              </button>
            ))}
          </div>

          <div className="text-center rounded-2xl bg-secondary/40 px-6 py-5">
            <p key={active} className="text-lg font-semibold text-foreground animate-fade-in">
              {STAGES[active].text}
            </p>
          </div>
        </div>

        <p className="text-center mt-8 text-base text-foreground/80 max-w-lg mx-auto text-balance">
          GuideUp gets you to <span className="font-semibold text-foreground">💪 confidence</span> — before a real
          placement is on the line. Akele nahi.
        </p>
      </Container>
    </Section>
  )
}
