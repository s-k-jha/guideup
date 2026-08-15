import Seo from '../lib/seo'
import { Container, Section } from '../components/layout/PageContainer'
import Breadcrumb from '../components/ui/Breadcrumb'

const SECTIONS = [
  {
    title: 'Session Cancellation',
    body: 'If you cancel your session at least 24 hours before the scheduled time, you may request a reschedule at no extra cost.',
  },
  {
    title: 'Refund Eligibility',
    body: 'Refunds are provided when a session could not be conducted due to a technical or operational issue on our side.',
  },
  {
    title: 'Non-Refundable Cases',
    body: 'Once a session has been completed, payments are non-refundable. No-shows without prior notice are also non-refundable.',
  },
  {
    title: 'Contact for Refund Requests',
    body: 'For refund or rescheduling requests, write to us at support@guideup.in with your order reference.',
  },
]

export default function RefundPage() {
  return (
    <>
      <Seo
        title="Refund & Cancellation Policy"
        description="GuideUp's cancellation and refund policy for mock interview session bookings."
        path="/refund"
      />
      <Section className="py-12 sm:py-16">
        <Container className="max-w-3xl">
          <Breadcrumb items={[{ label: 'Refund Policy' }]} className="mb-6" />
          <h1 className="text-h1 font-display text-foreground mb-3">Refund & Cancellation Policy</h1>
          <p className="text-muted-foreground mb-10">
            At GuideUp, we strive to provide valuable mock interview experiences. Here's how cancellations and refunds work.
          </p>
          <div className="space-y-8">
            {SECTIONS.map((s) => (
              <div key={s.title}>
                <h2 className="text-h3 text-foreground mb-2">{s.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="text-caption text-muted-foreground mt-10">Last updated: {new Date().getFullYear()}</p>
        </Container>
      </Section>
    </>
  )
}
