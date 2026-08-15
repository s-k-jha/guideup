import Seo from '../lib/seo'
import { Container, Section } from '../components/layout/PageContainer'
import Breadcrumb from '../components/ui/Breadcrumb'

const SECTIONS = [
  {
    title: '1. Our Service',
    body: 'GuideUp provides mock interview sessions conducted by experienced engineers to help students prepare for technical interviews and placements.',
  },
  {
    title: '2. Booking',
    body: 'You can book an interview session through our website. Once a session is confirmed, booking details are sent to your registered email address.',
  },
  {
    title: '3. Payments',
    body: 'Payments for sessions are processed securely through Razorpay. GuideUp does not store your card or payment details on its own servers.',
  },
  {
    title: '4. Your Responsibility',
    body: 'You must provide accurate information while booking a session and join at the scheduled time. Repeated no-shows may affect eligibility for future bookings.',
  },
  {
    title: '5. Changes to These Terms',
    body: 'GuideUp may update these terms from time to time. Continued use of the platform after changes means you accept the revised terms.',
  },
]

export default function TermsPage() {
  return (
    <>
      <Seo
        title="Terms & Conditions"
        description="Terms and conditions for using GuideUp's mock interview booking platform."
        path="/terms"
      />
      <Section className="py-12 sm:py-16">
        <Container className="max-w-3xl">
          <Breadcrumb items={[{ label: 'Terms & Conditions' }]} className="mb-6" />
          <h1 className="text-h1 font-display text-foreground mb-3">Terms & Conditions</h1>
          <p className="text-muted-foreground mb-10">
            Welcome to GuideUp. By accessing or using our platform, you agree to the following terms.
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
