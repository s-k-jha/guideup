import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Code2, Boxes, Brain, GitBranch, Clock, IndianRupee, ArrowRight } from 'lucide-react'
import { getSessions } from '../../api/sessions'
import { Section, Container, SectionHeading } from '../layout/PageContainer'
import { Skeleton } from '../ui/Skeleton'
import Button from '../ui/Button'

const ICONS = [Code2, Boxes, Brain, GitBranch]

export default function SessionsPricing() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSessions()
      .then((data) => setSessions(data.slice(0, 4)))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && sessions.length === 0) return null

  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Sessions & pricing"
          title="Pick the round you want to practice"
          description="Transparent, affordable pricing in INR — no subscriptions, no hidden fees."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-6">
                  <Skeleton className="h-10 w-10 rounded-xl mb-5" />
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            : sessions.map((s, i) => {
                const Icon = ICONS[i % ICONS.length]
                return (
                  <button
                    key={s._id}
                    onClick={() => navigate('/sessions')}
                    className="text-left rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-5 group-hover:bg-primary-100 transition-colors">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 leading-snug">{s.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {s.durationMinutes} min
                      </span>
                      <span className="flex items-center gap-0.5 font-semibold text-foreground">
                        <IndianRupee className="w-3.5 h-3.5" /> {s.price}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-primary-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Book this round <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                )
              })}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" onClick={() => navigate('/sessions')}>
            View all sessions
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Container>
    </Section>
  )
}
