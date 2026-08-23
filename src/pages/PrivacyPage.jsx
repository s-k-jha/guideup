import { Sparkles, Landmark, Cookie } from 'lucide-react'
import Seo from '../lib/seo'
import { Container, Section } from '../components/layout/PageContainer'
import Breadcrumb from '../components/ui/Breadcrumb'

const CALLOUT_ICON = { ai: Sparkles, bank: Landmark, cookies: Cookie }
const CALLOUT_LABEL = {
  ai: 'Chat messages may reach an AI provider',
  bank: 'Sensitive financial data',
  cookies: 'Cookies & tracking',
}

const SECTIONS = [
  {
    id: 'scope',
    title: '1. Scope of This Policy',
    paragraphs: [
      'This Privacy Policy explains what personal information GuideUp collects when you use guideup.in (the "Platform"), how we use it, who we share it with, and the choices you have. It applies to Users, Mentors, and mentor applicants.',
    ],
  },
  {
    id: 'who-we-are',
    title: '1.1 Who We Are',
    paragraphs: [
      'GuideUp is an independently operated platform founded and run by Shivam Kumar Jha (Software Engineer). GuideUp is not currently incorporated or registered as a private limited company, LLP, or other registered business entity. "GuideUp", "we", "us", and "our" in this Policy refer to the individual(s) who build, maintain, and operate the Platform.',
    ],
  },
  {
    id: 'collect',
    title: '2. Information We Collect',
    paragraphs: ['We collect information in a few different ways:'],
    bullets: [
      'Information you give us directly — your name, email address, phone number, and, if you apply to mentor, your role, company, years of experience, college, domain of expertise, LinkedIn profile, and a short introduction.',
      'Information created by using the Platform — session bookings, chat messages sent through Live Chat, ratings and written feedback you leave for a Mentor or the Platform, and wallet transaction history.',
      'Payment status information from Razorpay confirming whether a payment succeeded — GuideUp never receives or stores your card, UPI, or net-banking credentials directly.',
      'Basic usage information collected automatically through Google Analytics, such as pages visited and general device/browser information (see Section 6).',
    ],
  },
  {
    id: 'mentor-financial',
    title: '2.1 Mentor Payout Information',
    highlight: 'bank',
    paragraphs: [
      'If you register as a Mentor and become eligible for payouts, we collect your bank account holder name, account number, IFSC code, and/or UPI ID. This information is collected and used solely to process payments owed to you for Sessions or chats you\'ve conducted, is stored separately from general profile data, and is not shared with Users, other Mentors, or any third party except a payment processor strictly to complete a payout.',
    ],
  },
  {
    id: 'chat-ai',
    title: '3. How Live Chat Messages Are Processed',
    highlight: 'ai',
    paragraphs: [
      'When you use the "Talk to a Mentor" Live Chat feature, your messages may be sent to a third-party AI provider — currently Anthropic and/or OpenAI, depending on which is configured at the time — so that an AI system can generate a response under the Mentor\'s persona, as described in our Terms & Conditions.',
      'These providers process your message content to generate a reply; GuideUp does not control how long these third parties retain data on their own infrastructure beyond what their own policies state. Chat transcripts are also stored on GuideUp\'s own servers to maintain your chat history, allow the human Mentor to review the conversation, and to improve the quality of our services, including the AI system itself, on an anonymized or aggregated basis where feasible.',
      'Do not share information in a chat that you would not want processed by an automated system — for example, avoid pasting sensitive documents, passwords, or identity numbers into a chat message.',
    ],
  },
  {
    id: 'use',
    title: '4. How We Use Your Information',
    bullets: [
      'To create and manage your account, and to authenticate you when you log in.',
      'To process bookings, payments, wallet top-ups, and to send confirmation, reminder, and receipt emails.',
      'To assign a Mentor to a Session, and to enable Live Chat, including the AI-assisted responses described in Section 3.',
      'To respond to support requests and grievances.',
      'To detect and prevent fraud, including abuse of free-chat or discount offers through duplicate accounts.',
      'To understand how the Platform is used and improve it, using aggregated analytics.',
      'To comply with legal obligations, such as maintaining payment records.',
    ],
  },
  {
    id: 'cookies',
    title: '5. Cookies & Similar Technologies',
    highlight: 'cookies',
    paragraphs: [
      'Your login session is kept using your browser\'s local storage, not a tracking cookie — signing out or clearing site data on your device ends that session.',
      'The Platform loads Google Analytics (Google\'s "gtag.js") on every page to help us understand how the site is used. Google Analytics sets its own cookies and collects information such as pages viewed, general device and browser type, and approximate location. This data is governed by Google\'s own privacy practices. You can block or delete these cookies through your browser settings, or use a browser extension that opts you out of Google Analytics, without affecting your ability to log in or use core features of the Platform.',
    ],
  },
  {
    id: 'sharing',
    title: '6. How We Share Your Information',
    paragraphs: ['We do not sell your personal information. We share it only as needed to run the Platform:'],
    bullets: [
      'With Razorpay, to process payments and top-ups.',
      'With our email delivery provider, to send booking confirmations, reminders, and receipts to your email address.',
      'With Anthropic and/or OpenAI, to generate AI-assisted responses in Live Chat, as described in Section 3.',
      'With Google, through Google Analytics, for aggregated usage analytics as described in Section 5.',
      'With the Mentor assigned to your Session or chat, to the extent necessary for them to conduct it (name and relevant session details — not your payment credentials).',
      'When required by law, regulation, legal process, or to protect the rights, property, or safety of GuideUp, our Users, or the public.',
    ],
  },
  {
    id: 'retention',
    title: '7. Data Retention',
    paragraphs: [
      'We retain account, booking, and transaction information for as long as your account is active and for a reasonable period afterward, to meet accounting, legal, and dispute-resolution needs. Chat transcripts are retained to maintain your chat history and improve the Platform, unless you request deletion under Section 8 and we are not otherwise required to keep them.',
    ],
  },
  {
    id: 'rights',
    title: '8. Your Rights & Choices',
    bullets: [
      'You can request a copy of the personal information we hold about you.',
      'You can ask us to correct inaccurate information, or to delete your account and associated personal data, subject to records we are legally or contractually required to retain (such as completed payment records).',
      'You can opt out of non-essential marketing emails at any time using the unsubscribe link, without affecting transactional emails needed for bookings you\'ve made.',
      'To exercise any of these rights, write to grievance@guideup.in.',
    ],
  },
  {
    id: 'security',
    title: '9. Data Security',
    paragraphs: [
      'We take reasonable technical and organizational measures — such as encrypted connections and access controls — to protect your information from unauthorized access, alteration, or disclosure. No method of storage or transmission over the internet is completely secure, and we cannot guarantee absolute security.',
    ],
  },
  {
    id: 'children',
    title: '10. Children\'s Privacy',
    paragraphs: [
      'The Platform is intended for users aged 16 and above, consistent with our Terms & Conditions. We do not knowingly collect personal information from children under 16. If you believe a child has provided us with personal information, contact us at grievance@guideup.in and we will take appropriate action.',
    ],
  },
  {
    id: 'transfers',
    title: '11. International Data Transfers',
    paragraphs: [
      'Some of our service providers — including Anthropic, OpenAI, Google, and our email and hosting providers — may process data on servers located outside India. By using the Platform, you consent to your information being processed in these locations, subject to the protections described in this Policy.',
    ],
  },
  {
    id: 'changes',
    title: '12. Changes to This Policy',
    paragraphs: [
      'We may update this Privacy Policy from time to time to reflect changes to the Platform or applicable law. We will update the "Last updated" date below when we do. Continued use of the Platform after changes are posted means you accept the revised Policy.',
    ],
  },
  {
    id: 'contact',
    title: '13. Grievance Officer & Contact',
    paragraphs: [
      'Questions about this Privacy Policy, or requests relating to your personal data, can be sent to our Grievance Officer.',
      'Grievance Officer: Shivam Kumar Jha\nDesignation: Founder, GuideUp\nEmail: grievance@guideup.in',
    ],
  },
]

function CalloutBadge({ type }) {
  const Icon = CALLOUT_ICON[type]
  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-200 rounded-full px-3 py-1 w-fit mb-3">
      <Icon className="w-3.5 h-3.5" />
      {CALLOUT_LABEL[type]}
    </div>
  )
}

export default function PrivacyPage() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        description="How GuideUp collects, uses, and protects your personal information, including how AI-assisted live chat messages are handled."
        path="/privacy"
      />
      <Section className="py-12 sm:py-16">
        <Container className="max-w-3xl">
          <Breadcrumb items={[{ label: 'Privacy Policy' }]} className="mb-6" />
          <h1 className="text-h1 font-display text-foreground mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground mb-6">
            GuideUp respects your privacy. This page explains what we collect, including how chat
            messages can reach an AI provider, and what choices you have.
          </p>

          <nav className="rounded-2xl border border-border bg-secondary/30 p-5 mb-10">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">On this page</div>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
              {SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="text-sm text-foreground/80 hover:text-primary-600 transition-colors truncate">
                  {s.title}
                </a>
              ))}
            </div>
          </nav>

          <div className="space-y-10">
            {SECTIONS.map((s) => (
              <div key={s.id} id={s.id} className="scroll-mt-24">
                {s.highlight && <CalloutBadge type={s.highlight} />}
                <h2 className="text-h3 text-foreground mb-2">{s.title}</h2>
                <div
                  className={
                    s.highlight
                      ? 'rounded-xl border border-primary-100 bg-primary-50/50 p-4 sm:p-5 space-y-3'
                      : 'space-y-3'
                  }
                >
                  {s.paragraphs?.map((p, i) => (
                    <p key={i} className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {p}
                    </p>
                  ))}
                  {s.bullets && (
                    <ul className="space-y-2">
                      {s.bullets.map((b, i) => (
                        <li key={i} className="text-sm text-muted-foreground leading-relaxed flex gap-2.5">
                          <span className="text-primary-500 mt-1.5 shrink-0">&bull;</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="text-caption text-muted-foreground mt-10">Last updated: {new Date().getFullYear()}</p>
        </Container>
      </Section>
    </>
  )
}
