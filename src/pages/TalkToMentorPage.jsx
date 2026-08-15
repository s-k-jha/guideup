import { useEffect, useMemo, useRef, useState } from 'react'
import { MessageCircle, ShieldCheck } from 'lucide-react'
import { getTalkMentors, getChatPricing } from '../api/chatOrders'
import { useAuth } from '../context/AuthContext'
import { useAuthDialog } from '../context/AuthDialogContext'
import Seo from '../lib/seo'
import { Container, Section, SectionHeading } from '../components/layout/PageContainer'
import TalkMentorCard from '../components/mentorship/TalkMentorCard'
import ConnectDialog from '../components/mentorship/ConnectDialog'
import Button from '../components/ui/Button'
import { SkeletonCard } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/States'

const INITIAL_COUNT = 10

export default function TalkToMentorPage() {
  const { isAuthenticated } = useAuth()
  const { requireAuth } = useAuthDialog()
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pricingMap, setPricingMap] = useState({})
  const requestedRef = useRef(new Set())

  useEffect(() => {
    getTalkMentors().then(setMentors).catch(() => setMentors([])).finally(() => setLoading(false))
  }, [])

  const visibleMentors = useMemo(
    () => (showAll ? mentors : mentors.slice(0, INITIAL_COUNT)),
    [mentors, showAll]
  )

  // For signed-in users, fetch each visible mentor's real tier (first-free /
  // second-discount / fully-paid) so the card shows the price that mentor
  // will actually charge this student, not just a generic marketing default.
  useEffect(() => {
    if (!isAuthenticated) return
    const toFetch = visibleMentors.filter((m) => !requestedRef.current.has(m._id))
    if (toFetch.length === 0) return

    toFetch.forEach((mentor) => {
      requestedRef.current.add(mentor._id)
      getChatPricing(mentor._id)
        .then((data) => setPricingMap((prev) => ({ ...prev, [mentor._id]: data })))
        .catch(() => requestedRef.current.delete(mentor._id))
    })
  }, [isAuthenticated, visibleMentors])

  // Signing out should drop stale per-user pricing so the next login refetches.
  useEffect(() => {
    if (!isAuthenticated) {
      setPricingMap({})
      requestedRef.current.clear()
    }
  }, [isAuthenticated])

  const handleConnect = (mentor) => {
    requireAuth(() => {
      setSelectedMentor(mentor)
      setDialogOpen(true)
    })
  }

  return (
    <>
      <Seo
        title="Talk to a Mentor"
        description="Connect instantly with a GuideUp mentor for quick career advice — your first chat is free."
        path="/talk-to-mentor"
      />
      <Section className="pt-10 sm:pt-14">
        <Container>
          <SectionHeading
            align="left"
            eyebrow="Instant chat"
            title="Talk to a mentor right now"
            description="Quick 2-minute chats for career questions, resume doubts, or interview nerves — your first chat with any mentor is free."
          />

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 -mt-6">
            <ShieldCheck className="w-4 h-4 text-success" />
            Sign in required to connect — your chat history and offers are tracked per mentor.
          </div>

          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!loading && mentors.length === 0 && (
            <EmptyState
              icon={MessageCircle}
              title="No mentors available right now"
              description="We're onboarding mentors for instant chats — check back shortly."
            />
          )}

          {!loading && mentors.length > 0 && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {visibleMentors.map((mentor) => (
                  <TalkMentorCard
                    key={mentor.slug}
                    mentor={mentor}
                    pricing={pricingMap[mentor._id]}
                    onConnect={handleConnect}
                  />
                ))}
              </div>

              {!showAll && mentors.length > INITIAL_COUNT && (
                <div className="text-center mt-10">
                  <Button variant="outline" size="lg" onClick={() => setShowAll(true)}>
                    View More Mentors ({mentors.length - INITIAL_COUNT} more)
                  </Button>
                </div>
              )}
            </>
          )}
        </Container>
      </Section>

      <ConnectDialog mentor={selectedMentor} open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
