import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, ArrowRight } from 'lucide-react'
import { getPublicMentors } from '../api/mentors'
import Seo from '../lib/seo'
import { Container, Section, SectionHeading } from '../components/layout/PageContainer'
import { Card } from '../components/ui/Card'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { SkeletonCard } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/States'

export default function MentorsPage() {
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublicMentors().then(setMentors).catch(() => setMentors([])).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Seo
        title="Meet Our Interview Panel"
        description="Meet the working engineers on GuideUp's mock interview panel — real experience across DSA, system design, web development, and AI/ML."
        path="/mentors"
      />
      <Section className="pt-10 sm:pt-14">
        <Container>
          <SectionHeading
            align="left"
            eyebrow="Our panel"
            title="Real engineers, not generic interviewers"
            description="Every GuideUp mock interview is conducted by a working professional. Book a session and a mentor from this panel is assigned to you."
          />

          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!loading && mentors.length === 0 && (
            <EmptyState title="Panel details coming soon" description="We're adding mentor profiles — check back shortly, or book a session directly." />
          )}

          {!loading && mentors.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {mentors.map((m) => (
                <Link key={m.slug} to={`/mentors/${m.slug}`}>
                  <Card hover className="p-6 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={m.photoUrl} alt={m.name} />
                        <AvatarFallback className="text-lg">{m.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground truncate">{m.name}</div>
                        {(m.role || m.company) && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                            <Briefcase className="w-3 h-3 shrink-0" />
                            {[m.role, m.company].filter(Boolean).join(' · ')}
                          </div>
                        )}
                      </div>
                    </div>
                    {m.bio && <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">{m.bio}</p>}
                    {m.domains?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {m.domains.slice(0, 3).map((d) => <Badge key={d} size="sm">{d}</Badge>)}
                      </div>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link to="/sessions">
                Book a Mock Interview <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
