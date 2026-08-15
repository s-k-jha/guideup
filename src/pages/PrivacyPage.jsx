import Seo from '../lib/seo'
import { Container, Section } from '../components/layout/PageContainer'
import Breadcrumb from '../components/ui/Breadcrumb'

const SECTIONS = [
  {
    title: 'Information We Collect',
    body: 'We collect your name, email address, phone number, and any other information you provide while booking an interview session.',
  },
  {
    title: 'How We Use Your Information',
    body: 'Your information is used to manage bookings, send confirmation and reminder emails, assign a mentor, and improve our services.',
  },
  {
    title: 'Payment Information',
    body: 'Payments are processed securely via Razorpay. GuideUp does not store your card or payment credentials.',
  },
  {
    title: 'Data Protection',
    body: 'We take reasonable technical and organizational measures to protect your information from unauthorized access, alteration, or disclosure.',
  },
  {
    title: 'Contact Us',
    body: 'If you have questions about this privacy policy or how your data is handled, write to us at support@guideup.in.',
  },
]

export default function PrivacyPage() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        description="How GuideUp collects, uses, and protects your personal information."
        path="/privacy"
      />
      <Section className="py-12 sm:py-16">
        <Container className="max-w-3xl">
          <Breadcrumb items={[{ label: 'Privacy Policy' }]} className="mb-6" />
          <h1 className="text-h1 font-display text-foreground mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground mb-10">
            GuideUp respects your privacy and is committed to protecting your personal information.
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
