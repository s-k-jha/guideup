import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Briefcase, Linkedin, ArrowRight, Clock } from 'lucide-react'
import { getPublicMentorBySlug } from '../api/mentors'
import Seo, { absoluteUrl } from '../lib/seo'
import { Container, Section } from '../components/layout/PageContainer'
import Breadcrumb from '../components/ui/Breadcrumb'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { LoadingState, ErrorState } from '../components/ui/States'

export default function MentorProfilePage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [mentor, setMentor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    getPublicMentorBySlug(slug)
      .then(setMentor)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <Container className="py-20">
        <LoadingState label="Loading profile…" />
      </Container>
    )
  }

  if (notFound || !mentor) {
    return (
      <Container className="py-20">
        <ErrorState
          title="Mentor not found"
          description="This profile may have been removed or the link is incorrect."
          onRetry={() => navigate('/mentors')}
        />
      </Container>
    )
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: mentor.name,
    jobTitle: mentor.role || undefined,
    worksFor: mentor.company ? { '@type': 'Organization', name: mentor.company } : undefined,
    description: mentor.bio || undefined,
    url: absoluteUrl(`/mentors/${mentor.slug}`),
  }

  return (
    <>
      <Seo
        title={mentor.name}
        description={mentor.bio || `${mentor.name} is part of GuideUp's mock interview panel.`}
        path={`/mentors/${mentor.slug}`}
        image={mentor.photoUrl}
        type="profile"
        jsonLd={jsonLd}
      />
      <Section className="pt-8 sm:pt-12">
        <Container className="max-w-3xl">
          <Breadcrumb items={[{ label: 'Mentors', href: '/mentors' }, { label: mentor.name }]} className="mb-6" />

          <Card className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <Avatar className="h-24 w-24 shrink-0">
                <AvatarImage src={mentor.photoUrl} alt={mentor.name} />
                <AvatarFallback className="text-2xl">{mentor.name?.[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h1 className="text-h2 font-display text-foreground mb-1">{mentor.name}</h1>
                {(mentor.role || mentor.company) && (
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-3">
                    <Briefcase className="w-4 h-4" />
                    {[mentor.role, mentor.company].filter(Boolean).join(' at ')}
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {mentor.experienceYears != null && <Badge variant="secondary">{mentor.experienceYears}+ yrs experience</Badge>}
                  {mentor.domains?.map((d) => <Badge key={d}>{d}</Badge>)}
                </div>
                {mentor.linkedinUrl && (
                  <a href={mentor.linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:underline">
                    <Linkedin className="w-4 h-4" /> LinkedIn Profile
                  </a>
                )}
              </div>
            </div>

            {mentor.bio && (
              <p className="mt-6 text-foreground/80 leading-relaxed border-t border-border pt-6">{mentor.bio}</p>
            )}

            {mentor.skills?.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-sm font-semibold text-foreground mb-2.5">Areas of expertise</div>
                <div className="flex flex-wrap gap-1.5">
                  {mentor.skills.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
                </div>
              </div>
            )}
          </Card>

          <div className="mt-6 rounded-xl border border-primary-100 bg-primary-50 p-5 flex items-center gap-4 flex-wrap">
            <Clock className="w-5 h-5 text-primary-600 shrink-0" />
            <p className="text-sm text-primary-800 flex-1 min-w-[200px]">
              A mentor is matched to your session after booking — book a slot and {mentor.name.split(' ')[0]} may be your interviewer.
            </p>
            <Button asChild>
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
