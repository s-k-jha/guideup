import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, IndianRupee, CalendarClock, Users2, ArrowRight } from 'lucide-react'
import { submitMentorApplication } from '../api/mentors'
import Seo from '../lib/seo'
import { Container, Section, SectionHeading } from '../components/layout/PageContainer'
import { Card } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../components/ui/Form'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/Accordion'

const BENEFITS = [
  { icon: IndianRupee, title: 'Get paid for your time', text: 'Earn per mock interview you conduct — no long-term commitment required.' },
  { icon: CalendarClock, title: 'Your own schedule', text: 'Accept sessions that fit around your work — mentor as much or as little as you like.' },
  { icon: Users2, title: 'Give back, visibly', text: "Help students avoid the mistakes you made early in your own career." },
]

const FAQS = [
  { q: 'Who can apply?', a: 'Working software engineers and industry professionals with at least 1-2 years of relevant experience.' },
  { q: 'How much time does it take?', a: 'Sessions are 30-60 minutes. You choose your availability — there is no minimum commitment.' },
  { q: 'How does the application process work?', a: "Submit the form below. Our team reviews applications and reaches out over email if there's a fit." },
]

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Valid phone number required'),
  currentRole: z.string().optional(),
  company: z.string().optional(),
  experienceYears: z.string().optional(),
  college: z.string().optional(),
  domain: z.string().min(2, 'Primary domain is required'),
  linkedinUrl: z.string().optional(),
  introduction: z.string().max(1000).optional(),
  mentorshipTopics: z.string().optional(),
  availability: z.string().optional(),
})

export default function BecomeMentorPage() {
  const [submitted, setSubmitted] = useState(false)

  const form = useForm({ resolver: zodResolver(schema), defaultValues: { name: '', email: '', phone: '', domain: '' } })

  const onSubmit = async (data) => {
    try {
      await submitMentorApplication({
        ...data,
        experienceYears: data.experienceYears ? Number(data.experienceYears) : undefined,
        expertise: data.mentorshipTopics ? data.mentorshipTopics.split(',').map((s) => s.trim()).filter(Boolean) : [],
      })
      setSubmitted(true)
    } catch {
      form.setError('root', { message: 'Something went wrong. Please try again.' })
    }
  }

  return (
    <>
      <Seo
        title="Become a Mentor"
        description="Join GuideUp's interview panel. Conduct mock technical interviews on your schedule and help Indian college students prepare for placements."
        path="/become-a-mentor"
      />

      <Section className="pt-10 sm:pt-14 pb-0">
        <Container className="text-center max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 mb-3 inline-block">Become a Mentor</span>
          <h1 className="text-h1 font-display text-foreground text-balance mb-4">
            Working engineer? Help students avoid your early mistakes.
          </h1>
          <p className="text-body-lg text-muted-foreground text-balance">
            Join GuideUp's interview panel, conduct mock interviews on your own schedule, and get paid for your time.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {BENEFITS.map((b) => (
              <div key={b.title} className="rounded-2xl border border-border bg-card p-6">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                  <b.icon className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-1.5">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-start">
            <div>
              <SectionHeading align="left" title="Frequently asked questions" className="mb-8" />
              <Accordion type="single" collapsible className="bg-card rounded-2xl border border-border px-6">
                {FAQS.map((item) => (
                  <AccordionItem key={item.q} value={item.q}>
                    <AccordionTrigger>{item.q}</AccordionTrigger>
                    <AccordionContent>{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <Card className="p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-7 h-7 text-success" />
                  </div>
                  <h3 className="text-h3 text-foreground mb-2">Application received</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    Thank you for applying. Our team will review your profile and reach out over email if there's a fit.
                  </p>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <h3 className="text-h3 text-foreground mb-1">Apply to mentor</h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Full Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Email</FormLabel>
                          <FormControl><Input type="email" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Phone</FormLabel>
                          <FormControl><Input type="tel" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="domain" render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Primary Domain</FormLabel>
                          <FormControl><Input placeholder="DSA, System Design…" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="currentRole" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Role</FormLabel>
                          <FormControl><Input placeholder="SDE-2" {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="company" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="experienceYears" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience (years)</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="linkedinUrl" render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn URL</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="mentorshipTopics" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topics you can mentor on <span className="text-muted-foreground font-normal">(comma separated)</span></FormLabel>
                        <FormControl><Input placeholder="DSA, React, System Design" {...field} /></FormControl>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="availability" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Availability</FormLabel>
                        <FormControl><Input placeholder="Weekday evenings, weekends…" {...field} /></FormControl>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="introduction" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short introduction</FormLabel>
                        <FormControl><Textarea placeholder="Tell us a bit about yourself and why you'd like to mentor" {...field} /></FormControl>
                      </FormItem>
                    )} />

                    {form.formState.errors.root && (
                      <p className="text-sm text-destructive text-center">{form.formState.errors.root.message}</p>
                    )}

                    <Button type="submit" loading={form.formState.isSubmitting} className="w-full h-12">
                      Submit Application <ArrowRight className="w-4 h-4" />
                    </Button>
                  </form>
                </Form>
              )}
            </Card>
          </div>
        </Container>
      </Section>
    </>
  )
}
