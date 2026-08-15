import { Section, Container, SectionHeading } from '../layout/PageContainer'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/Accordion'

const FAQS = [
  {
    q: 'Who conducts the mock interviews?',
    a: 'Working engineers and industry professionals from our interview panel. A mentor is assigned to your specific session after your booking is confirmed.',
  },
  {
    q: 'How do I pick which mentor takes my interview?',
    a: "You choose the type of session (DSA, system design, HR round, etc.) and a slot — GuideUp assigns a suitable mentor from the panel and shares the meeting link over email before your session.",
  },
  {
    q: 'What if I need to reschedule?',
    a: 'Cancel or reschedule up to 24 hours before your slot at no extra cost. See our Refund & Cancellation Policy for details.',
  },
  {
    q: 'Is my interview confidential?',
    a: 'Yes. Every session is 1:1 and confidential — recordings or notes are not shared with anyone outside GuideUp.',
  },
  {
    q: 'How is this different from a paid interview prep course?',
    a: "There's no bundle or subscription. You pay per session and book only the round you actually want to practice.",
  },
]

export default function FAQ() {
  return (
    <Section className="bg-secondary/30">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Common questions" />
        <Accordion type="single" collapsible className="bg-card rounded-2xl border border-border px-6">
          {FAQS.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Section>
  )
}
