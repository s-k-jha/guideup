import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Briefcase } from 'lucide-react'
import { getPublicMentors } from '../../api/mentors'
import { Section, Container, SectionHeading } from '../layout/PageContainer'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar'
import { Skeleton } from '../ui/Skeleton'
import Button from '../ui/Button'

export default function MentorPanelPreview() {
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublicMentors()
      .then((data) => setMentors(data.slice(0, 4)))
      .catch(() => setMentors([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && mentors.length === 0) return null

  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Meet the panel"
          title="Real engineers, not generic interviewers"
          description="A mentor is assigned to your session after booking — here are some of the people on our panel."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-6 text-center">
                  <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-3.5 w-2/3 mx-auto mb-2" />
                  <Skeleton className="h-3 w-1/2 mx-auto" />
                </div>
              ))
            : mentors.map((m) => (
                <Link
                  key={m.slug}
                  to={`/mentors/${m.slug}`}
                  className="rounded-2xl border border-border bg-card p-6 text-center hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Avatar className="h-16 w-16 mx-auto mb-4">
                    <AvatarImage src={m.photoUrl} alt={m.name} />
                    <AvatarFallback className="text-lg">{m.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="font-semibold text-foreground text-sm">{m.name}</div>
                  {(m.role || m.company) && (
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
                      <Briefcase className="w-3 h-3" />
                      {[m.role, m.company].filter(Boolean).join(' · ')}
                    </div>
                  )}
                </Link>
              ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" asChild>
            <Link to="/mentors">
              See the full panel
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  )
}
