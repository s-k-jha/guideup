import { Link } from 'react-router-dom'
import { AlertTriangle, Sparkles, ShieldOff } from 'lucide-react'
import Seo from '../lib/seo'
import { Container, Section } from '../components/layout/PageContainer'
import Breadcrumb from '../components/ui/Breadcrumb'

const CALLOUT_ICON = { ai: Sparkles, outcome: AlertTriangle, liability: ShieldOff }
const CALLOUT_LABEL = {
  ai: 'Read this before using live chat',
  outcome: 'No outcome guarantee',
  liability: 'Liability is limited',
}

const SECTIONS = [
  {
    id: 'acceptance',
    title: '1. Acceptance of these Terms',
    paragraphs: [
      "These Terms & Conditions (\"Terms\") form a binding agreement between you (\"you\", \"User\") and GuideUp (\"GuideUp\", \"we\", \"us\", \"our\"), the operator of the website and services available at guideup.in (the \"Platform\"). By creating an account, booking a session, starting a chat, making a payment, or otherwise using the Platform, you confirm that you have read, understood, and agree to be bound by these Terms, our Privacy Policy, and our Refund & Cancellation Policy.",
      'If you do not agree to these Terms, you must not access or use the Platform.',
    ],
  },
  {
    id: 'who-we-are',
    title: '1.1 Who You Are Contracting With',
    paragraphs: [
      'GuideUp is an independently operated platform founded and run by Shivam Kumar Jha (Software Engineer) to help Indian college students prepare for placements. GuideUp is not, at this time, incorporated or registered as a private limited company, LLP, or any other registered business entity. "GuideUp", "we", "us", and "our" in these Terms refer to the individual(s) who build, maintain, and operate the Platform under the GuideUp name.',
      'This does not affect your rights under these Terms or applicable Indian law. Payments are processed through Razorpay, and any agreement you enter into for a Session or Live Chat is with the individual(s) operating GuideUp, not with a separate corporate entity.',
    ],
  },
  {
    id: 'definitions',
    title: '2. Definitions',
    bullets: [
      '"Session" or "Mock Interview Session" means a scheduled, paid 1:1 mock interview booked through the Sessions/booking flow and conducted by a human Mentor.',
      '"Talk to a Mentor" or "Live Chat" means the on-demand, real-time chat feature where a User connects instantly with a Mentor profile.',
      '"Mentor" means any individual whose name, photograph, or persona appears on the Platform as available for Sessions or Live Chat, including engineers, industry professionals, and members of GuideUp\'s own founding, leadership, or operating team who choose to mentor on the Platform.',
      '"Wallet" means the prepaid balance a User may hold on the Platform to pay for Live Chat.',
      '"Content" means any text, message, feedback, rating, or other material submitted by a User or generated during a Session or chat.',
    ],
  },
  {
    id: 'services',
    title: '3. Description of Services',
    paragraphs: [
      'GuideUp offers two distinct services, and the way each one works is different. Please read both parts of this section carefully — using either service means you accept how it actually works, as described here.',
    ],
  },
  {
    id: 'sessions-service',
    title: '3.1 Mock Interview Sessions',
    paragraphs: [
      'Sessions are conducted by real, human Mentors. A Mentor may be a working engineer, industry professional, independent contractor, or a member of GuideUp\'s own founders, co-founders, employees, or leadership team who is qualified to mentor in that domain — GuideUp does not represent that Mentors are exclusively third-party contractors.',
      'Mentors are assigned to a Session at GuideUp\'s sole discretion after booking. You are not guaranteed a specific named Mentor, a specific level of seniority beyond what is stated on their profile, or continuity of the same Mentor across multiple Sessions.',
      'A single Mentor may conduct Sessions for multiple different Users, on the same day or across different days, and may hold multiple Sessions in general. There is no exclusivity, either for a Mentor to a User or for a time slot beyond what is confirmed at booking.',
    ],
  },
  {
    id: 'chat-service',
    title: '3.2 Talk to a Mentor (Live Chat)',
    highlight: 'ai',
    paragraphs: [
      'The Live Chat feature is designed to give you an instant response, any time, without waiting for a human to become available. To make this possible, messages you send through Live Chat may be answered, in whole or in part, by an artificial intelligence (AI) system operating under the display name, photograph, role, and persona of the Mentor profile you are chatting with.',
      'GuideUp does not represent or guarantee that every message in Live Chat is typed in real time by the named human being. Whether a given chat is handled by AI or by the human Mentor directly is determined by GuideUp and may change without individual notice. This is a deliberate feature of the Platform, not a malfunction, error, or attempt to deceive.',
      'By starting a Live Chat, you acknowledge and accept that responses may be AI-generated under a Mentor\'s persona, and you agree that this disclosure satisfies any requirement — legal, contractual, or otherwise — that you be informed you may be interacting with an automated system. Content shared in Live Chat is for guidance and preparation purposes only, as described in Section 5.',
    ],
  },
  {
    id: 'eligibility',
    title: '4. Eligibility & Accounts',
    bullets: [
      'You must be at least 16 years old to create an account. If you are under 18, you confirm that a parent or guardian is aware of and supervises your use of the Platform, including any payments.',
      'You must provide accurate, current, and complete information when registering and keep it up to date.',
      'You are responsible for maintaining the confidentiality of your account and for all activity that happens under it. Notify us immediately at support@guideup.in if you suspect unauthorized use.',
      'One account per person. GuideUp may suspend duplicate or fraudulently created accounts, including accounts created to repeatedly claim first-chat-free or discounted offers.',
    ],
  },
  {
    id: 'nature-of-service',
    title: '5. Educational Purpose Only — No Outcome Guarantee',
    highlight: 'outcome',
    paragraphs: [
      'Sessions and Live Chat are preparatory and educational in nature. They are meant to help you practice, get feedback, and become more comfortable with interview formats and career questions.',
      'GuideUp does not guarantee, promise, or represent that using the Platform will result in an internship, job offer, placement, promotion, higher grades, or any other specific outcome. Real hiring decisions are made solely by third-party employers based on factors entirely outside GuideUp\'s knowledge or control, including your own preparation, the employer\'s process, and market conditions at the time.',
      'Feedback, ratings, and advice given by a Mentor (human or AI-assisted) reflect that Mentor\'s personal opinion or the AI system\'s output at that time. It is not professional, legal, financial, or career-guaranteed advice, and GuideUp is not responsible for decisions you make based on it.',
    ],
  },
  {
    id: 'payments',
    title: '6. Payments, Pricing & Wallet',
    bullets: [
      'All payments are processed securely through Razorpay. GuideUp does not store your card, UPI, or bank credentials on its own servers.',
      'Session and chat pricing shown on the Platform is subject to change at any time; the price confirmed at the time of your booking or chat confirmation is what applies to that transaction.',
      'Wallet balance is used to pay for Live Chat. Wallet balance is non-transferable to another account and is not redeemable for cash, except where GuideUp agrees to a refund under the Refund & Cancellation Policy.',
      'Free-first-chat and discounted-second-chat offers are limited to one redemption per User across the Platform (not per Mentor). GuideUp may detect, reverse, or deny offers used through duplicate accounts, automation, or other abuse, and may recover the value of any offer obtained fraudulently.',
      'Coupons are subject to their own validity period, usage limits, and eligibility conditions, and may be modified, restricted, or withdrawn by GuideUp at any time without prior notice, except for coupons already successfully applied to a completed transaction.',
    ],
  },
  {
    id: 'cancellation',
    title: '7. Cancellations & Refunds',
    paragraphs: [
      'Cancellations, rescheduling, and refund eligibility for Sessions are governed by our ',
    ],
    link: { label: 'Refund & Cancellation Policy', href: '/refund' },
    paragraphsAfterLink: ['. Live Chat is billed per chat once you connect with a Mentor and is non-refundable once the chat has started, except where required by law or where GuideUp determines a genuine technical failure prevented the chat from taking place.'],
  },
  {
    id: 'conduct',
    title: '8. Session & Chat Conduct',
    bullets: [
      'Do not record, screen-record, screenshot, or redistribute a Session or Live Chat without the consent of everyone involved, except for your own personal, non-commercial reference.',
      'Treat Mentors and other Users respectfully. Harassment, hate speech, threats, or abusive language toward a Mentor, GuideUp staff, or another User will result in immediate suspension without refund.',
      'Do not use a Session or Live Chat to have someone else complete work on your behalf that you will then present as your own in an actual, real-time job interview or assessment — the Platform exists for practice and preparation, not for live impersonation during a real hiring process.',
      'GuideUp may end a Session or chat early, and may do so without a refund, if it determines these Terms are being violated.',
    ],
  },
  {
    id: 'prohibited',
    title: '9. Prohibited Uses',
    paragraphs: ['You agree that you will not, and will not attempt to:'],
    bullets: [
      'Use the Platform for any unlawful purpose, or in a way that violates any applicable local, state, national, or international law.',
      'Impersonate any person or entity, or misrepresent your affiliation with a person or entity, including claiming to be a Mentor or GuideUp staff member.',
      'Scrape, crawl, reverse-engineer, decompile, or otherwise attempt to extract the Platform\'s source code, underlying models, prompts, or the logic behind mentor-matching, pricing, or the AI system referenced in Section 3.2.',
      'Use bots, scripts, or other automated means to create accounts, book Sessions, start chats, or claim promotional offers.',
      'Upload or transmit any content that is defamatory, obscene, infringing, or that violates another person\'s privacy or intellectual property rights.',
      'Attempt to prompt-inject, jailbreak, or otherwise manipulate the AI system used in Live Chat into behaving outside its intended purpose, or use it to generate content unrelated to interview and career preparation.',
      'Share your account credentials with, or transact on behalf of, any other person.',
      'Resell, sublicense, or commercially exploit access to the Platform without GuideUp\'s prior written consent.',
    ],
  },
  {
    id: 'ip',
    title: '10. Intellectual Property',
    paragraphs: [
      'The Platform, including its design, branding, question banks, feedback frameworks, and underlying software, is owned by GuideUp and protected by applicable intellectual property laws. Nothing in these Terms transfers any of that ownership to you.',
      'You retain ownership of Content you personally submit (such as your resume details or chat messages), but you grant GuideUp a worldwide, royalty-free, non-exclusive license to use, store, and process that Content to provide, maintain, and improve the Platform, including the AI system referenced in Section 3.2, on an anonymized or aggregated basis.',
    ],
  },
  {
    id: 'third-party',
    title: '11. Third-Party Services',
    paragraphs: [
      'The Platform relies on third-party providers for functions such as payment processing (Razorpay), email delivery, and hosting. GuideUp is not responsible for outages, errors, or data handling by these third parties beyond what is required by applicable law, though we select providers we consider reputable and secure.',
    ],
  },
  {
    id: 'disclaimers',
    title: '12. Disclaimers',
    paragraphs: [
      'The Platform is provided on an "as is" and "as available" basis. To the maximum extent permitted by law, GuideUp disclaims all warranties, express or implied, including any warranty of uninterrupted, timely, secure, or error-free operation, and any warranty regarding the accuracy, completeness, or usefulness of Mentor feedback or AI-generated responses.',
    ],
  },
  {
    id: 'liability',
    title: '13. Limitation of Liability',
    highlight: 'liability',
    paragraphs: [
      'To the maximum extent permitted under applicable law, GuideUp, its founders, employees, and Mentors will not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, opportunities, or data, arising from your use of, or inability to use, the Platform — including any outcome of a job or internship application.',
      "GuideUp's total aggregate liability to you for any claim arising from these Terms or your use of the Platform will not exceed the total amount you paid to GuideUp in the six (6) months immediately before the event giving rise to the claim.",
      'Nothing in these Terms limits any liability that cannot be excluded or limited under applicable Indian law.',
    ],
  },
  {
    id: 'indemnity',
    title: '14. Indemnification',
    paragraphs: [
      'You agree to indemnify and hold GuideUp, its founders, employees, and Mentors harmless from any claim, demand, loss, or expense (including reasonable legal fees) arising from your violation of these Terms, your violation of any law, or your infringement of any third party\'s rights.',
    ],
  },
  {
    id: 'mentors',
    title: '15. Mentor Relationship',
    paragraphs: [
      'Unless separately agreed in writing, Mentors engage with GuideUp as independent contractors or platform partners, not as employees of GuideUp, even where a Mentor is also a founder, co-founder, or team member of GuideUp acting in that capacity. GuideUp facilitates the connection between Users and Mentors but does not guarantee the specific content of advice a Mentor gives.',
    ],
  },
  {
    id: 'termination',
    title: '16. Suspension & Termination',
    paragraphs: [
      'GuideUp may suspend or terminate your account, with or without notice, if we reasonably believe you have violated these Terms, engaged in fraud or abuse, or posed a risk to other Users, Mentors, or the Platform. Amounts already paid for completed Sessions or chats are not refunded on termination for cause.',
    ],
  },
  {
    id: 'grievance',
    title: '17. Grievance Redressal',
    paragraphs: [
      'In accordance with the Information Technology Act, 2000 and the rules made thereunder, any complaints or concerns regarding Content on the Platform may be addressed to our Grievance Officer at the contact details below. We aim to acknowledge grievances within a reasonable time and resolve them as promptly as possible.',
      'Grievance Officer: Shivam Kumar Jha\nDesignation: Founder, GuideUp\nEmail: grievance@guideup.in',
    ],
  },
  {
    id: 'law',
    title: '18. Governing Law & Jurisdiction',
    paragraphs: [
      'These Terms are governed by the laws of India. Subject to Section 19 (Dispute Resolution), the courts located in Delhi, India shall have exclusive jurisdiction over any dispute arising from these Terms or your use of the Platform.',
    ],
  },
  {
    id: 'disputes',
    title: '19. Dispute Resolution',
    paragraphs: [
      'If a dispute arises, we ask that you first contact us at support@guideup.in so we can try to resolve it informally. If it cannot be resolved informally within 30 days, either party may pursue the matter through the courts identified in Section 18, or through arbitration if the parties separately agree to that in writing.',
    ],
  },
  {
    id: 'misc',
    title: '20. Force Majeure, Severability & Entire Agreement',
    bullets: [
      'GuideUp is not liable for any failure or delay caused by events beyond its reasonable control, including internet or power outages, natural disasters, or third-party service failures.',
      'If any provision of these Terms is found unenforceable, the remaining provisions will continue in full force.',
      'These Terms, together with our Privacy Policy and Refund & Cancellation Policy, form the entire agreement between you and GuideUp regarding the Platform.',
    ],
  },
  {
    id: 'changes',
    title: '21. Changes to These Terms',
    paragraphs: [
      'GuideUp may update these Terms from time to time to reflect changes to the Platform, our services, or applicable law. We will update the "Last updated" date below when we do. Continued use of the Platform after changes are posted means you accept the revised Terms.',
    ],
  },
  {
    id: 'contact',
    title: '22. Contact Us',
    paragraphs: ['Questions about these Terms can be sent to support@guideup.in.'],
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

export default function TermsPage() {
  return (
    <>
      <Seo
        title="Terms & Conditions"
        description="Terms and conditions for using GuideUp's mock interview and mentor chat platform, including how our AI-assisted live chat works."
        path="/terms"
      />
      <Section className="py-12 sm:py-16">
        <Container className="max-w-3xl">
          <Breadcrumb items={[{ label: 'Terms & Conditions' }]} className="mb-6" />
          <h1 className="text-h1 font-display text-foreground mb-3">Terms & Conditions</h1>
          <p className="text-muted-foreground mb-6">
            Welcome to GuideUp. These Terms explain how our mock interview Sessions and Live Chat
            actually work, including where AI is involved, and what you're agreeing to by using them.
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
                      {s.link && i === s.paragraphs.length - 1 && (
                        <>
                          <Link to={s.link.href} className="text-primary-600 font-medium hover:underline">
                            {s.link.label}
                          </Link>
                          {s.paragraphsAfterLink?.[0]}
                        </>
                      )}
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
