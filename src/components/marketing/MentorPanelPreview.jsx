import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Briefcase, CheckCircle2, Users } from 'lucide-react'
import { getPublicMentors } from '../../api/mentors'
import { Section, Container, SectionHeading } from '../layout/PageContainer'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar'
import Badge from '../ui/Badge'
import { Skeleton } from '../ui/Skeleton'
import Button from '../ui/Button'

export default function MentorPanelPreview() {
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublicMentors()
      .then(setMentors)
      .catch(() => setMentors([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && mentors.length === 0) return null

  const featured = mentors.slice(0, 4)
  const remaining = mentors.slice(4, 8)
  const remainingCount = Math.max(0, mentors.length - 4)

  return (
    <Section className="relative overflow-hidden">
      <div className="absolute -top-32 right-[-10%] w-[28rem] h-[28rem] bg-primary-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-[-10%] w-80 h-80 bg-primary-50 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative">
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
            : featured.map((m) => (
                <Link
                  key={m.slug}
                  to={`/mentors/${m.slug}`}
                  className="group relative rounded-2xl border border-border bg-card p-6 pt-7 text-center overflow-hidden hover:border-primary-200 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary-300 via-primary-500 to-primary-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative w-fit mx-auto mb-4">
                    <Avatar className="h-16 w-16 ring-4 ring-primary-50 group-hover:ring-primary-100 transition-colors duration-300">
                      <AvatarImage src={m.photoUrl} alt={m.name} />
                      <AvatarFallback className="text-lg">{m.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary-600 border-2 border-card flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                    </span>
                  </div>

                  <div className="font-semibold text-foreground text-sm">{m.name}</div>
                  {(m.role || m.company) && (
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
                      <Briefcase className="w-3 h-3 shrink-0" />
                      <span className="truncate">{[m.role, m.company].filter(Boolean).join(' · ')}</span>
                    </div>
                  )}
                  {m.domains?.[0] && (
                    <div className="mt-3">
                      <Badge size="sm">{m.domains[0]}</Badge>
                    </div>
                  )}
                </Link>
              ))}
        </div>

        {!loading && (
          <div className="flex flex-col items-center gap-5 mt-12">
            {remainingCount > 0 && (
              <div className="inline-flex items-center gap-3 bg-card border border-border px-4 py-2 rounded-full shadow-xs">
                <div className="flex items-center -space-x-2.5">
                  {remaining.map((m) => (
                    <Avatar key={m.slug} className="h-7 w-7 ring-2 ring-card">
                      <AvatarImage src={m.photoUrl} alt={m.name} />
                      <AvatarFallback className="text-[10px]">{m.name?.[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                  {remainingCount > remaining.length && (
                    <span className="h-7 w-7 rounded-full ring-2 ring-card bg-primary-100 text-primary-700 text-[10px] font-semibold flex items-center justify-center">
                      +{remainingCount - remaining.length}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium text-foreground/80 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary-600" />
                  {remainingCount} more engineer{remainingCount === 1 ? '' : 's'} on the panel
                </span>
              </div>
            )}

            <Button variant="outline" size="lg" asChild>
              <Link to="/mentors">
                See the full panel
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        )}
      </Container>
    </Section>
  )
}
