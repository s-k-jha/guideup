import { useNavigate } from 'react-router-dom'
import { ArrowRight, Star, Clock, IndianRupee, CheckCircle2 } from 'lucide-react'
import { Container } from '../layout/PageContainer'
import Button from '../ui/Button'

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/60 via-background to-background" />
      <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(#111_1px,transparent_1px),linear-gradient(90deg,#111_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      <Container className="relative py-14 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-card border border-border px-3.5 py-1.5 rounded-full text-xs font-medium text-foreground/80 mb-6 shadow-xs">
              <Star className="w-3.5 h-3.5 fill-primary-500 text-primary-500" />
              500+ mock interviews conducted with real engineers
            </div>

            <h1 className="text-h1 lg:text-display font-display text-foreground text-balance mb-5">
              Practice real technical interviews
              <span className="block text-primary-600">before placements begin</span>
            </h1>

            <p className="text-body-lg text-muted-foreground max-w-lg mb-8 text-balance">
              Stuck between DSA, system design, and what recruiters actually ask?
              Book a 1:1 mock interview with a working engineer and walk in
              knowing exactly what to expect.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" onClick={() => navigate('/sessions')}>
                Book a Mock Interview
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/mentors')}>
                Meet Our Interviewers
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" /> 1:1 &amp; confidential
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" /> Real engineers, not scripts
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" /> Detailed feedback
              </span>
            </div>
          </div>

          {/* Product preview card — real UI, not a stock photo */}
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-tr from-primary-100/60 to-transparent rounded-[2rem] blur-2xl -z-10" />
            <div className="rounded-2xl border border-border bg-card shadow-popover p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Choose a session</span>
                <span className="text-xs text-muted-foreground">Step 1 of 3</span>
              </div>

              <div className="space-y-3">
                {[
                  { title: 'DSA Mock Interview', mins: 45, price: 499, selected: true },
                  { title: 'System Design Round', mins: 60, price: 799, selected: false },
                  { title: 'Resume + HR Round', mins: 30, price: 349, selected: false },
                ].map((s) => (
                  <div
                    key={s.title}
                    className={
                      s.selected
                        ? 'rounded-xl border-2 border-primary-500 bg-primary-50 p-4'
                        : 'rounded-xl border border-border bg-secondary/30 p-4'
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={s.selected ? 'font-semibold text-primary-800 text-sm' : 'font-semibold text-foreground text-sm'}>
                          {s.title}
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {s.mins} min
                          </span>
                          <span className="flex items-center gap-0.5 font-semibold text-foreground">
                            <IndianRupee className="w-3 h-3" /> {s.price}
                          </span>
                        </div>
                      </div>
                      {s.selected && (
                        <span className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 h-11 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                Continue
              </div>
            </div>
          </div>
        </div>
      </Container>

      <div className="sr-only">
        GuideUp is a platform where Indian college students practice real technical mock
        interviews with experienced engineers, preparing for software engineering placements,
        internships, and coding interviews through realistic interview simulations and detailed feedback.
      </div>
    </section>
  )
}
