import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  CheckCircle2,
  IndianRupee,
  CalendarClock,
  Users2,
  Award,
  ArrowRight,
  ShieldCheck,
  Headphones,
} from 'lucide-react'
import { submitMentorApplication } from '../api/mentors'
import Seo from '../lib/seo'
import { Container, Section } from '../components/layout/PageContainer'
import { Card } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../components/ui/Form'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/Select'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/Accordion'

const BENEFITS = [
  { icon: IndianRupee, title: 'Get paid for your time', text: 'Earn per mock interview you conduct — no long-term commitment required.' },
  { icon: CalendarClock, title: 'Your own schedule', text: 'Accept sessions that fit around your work — mentor as much or as little as you like.' },
  { icon: Users2, title: 'Give back, visibly', text: 'Help students avoid the mistakes you made early in your own career.' },
]

const FLOATING_CALLOUTS = [
  { icon: CalendarClock, title: 'Flexible schedule', text: 'Work when you want', position: 'left-[3%] top-[18%]' },
  { icon: IndianRupee, title: 'Earn for your time', text: 'Get paid for every mock interview', position: 'left-[6%] bottom-[14%]' },
  { icon: Users2, title: 'Impact lives', text: 'Help students build confidence', position: 'right-[4%] top-[16%]' },
  { icon: Award, title: 'Visible recognition', text: 'Top mentors get featured', position: 'right-[6%] bottom-[18%]' },
]

const FAQS = [
  { q: 'Who can apply?', a: 'Working software engineers and industry professionals with at least 1-2 years of relevant experience.' },
  { q: 'How much time does it take?', a: "Sessions are 30-60 minutes. You choose your availability — there's no minimum commitment." },
  { q: 'How do payments work?', a: "You're paid per mock interview you conduct. Payouts are processed regularly to your registered bank account." },
  { q: 'What topics can I mentor on?', a: 'DSA, system design, resume reviews, HR rounds — whatever domain matches your own experience.' },
  { q: 'Can I choose my own availability?', a: 'Yes. You mark yourself available and accept sessions only when they fit your schedule.' },
]

const EXPERIENCE_OPTIONS = [
  { value: '1', label: '1-2 years' },
  { value: '3', label: '3-5 years' },
  { value: '6', label: '6-10 years' },
  { value: '10', label: '10+ years' },
]

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Valid phone number required'),
  domain: z.string().min(2, 'Primary domain is required'),
  experienceYears: z.string().min(1, 'Select your experience'),
  company: z.string().min(1, 'Current company is required'),
  linkedinUrl: z.string().optional(),
})

export default function BecomeMentorPage() {
  const [submitted, setSubmitted] = useState(false)

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', phone: '', domain: '', experienceYears: '', company: '', linkedinUrl: '' },
  })

  const scrollToForm = () => {
    document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const onSubmit = async (data) => {
    try {
      await submitMentorApplication({
        ...data,
        experienceYears: data.experienceYears ? Number(data.experienceYears) : undefined,
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

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-background to-background" />
        <div className="absolute -top-24 left-[10%] w-72 h-72 bg-primary-200/40 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute top-10 right-[8%] w-96 h-96 bg-primary-100/50 rounded-full blur-[100px] pointer-events-none" />

        {FLOATING_CALLOUTS.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.title} className={`hidden xl:flex absolute ${item.position} items-start gap-2.5 bg-card border border-border rounded-xl shadow-popover px-3.5 py-3 w-48`}>
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-foreground leading-tight">{item.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{item.text}</div>
              </div>
            </div>
          )
        })}

        <Container className="relative pt-10 sm:pt-14 pb-16 sm:pb-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-card border border-border px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-primary-600 mb-6 shadow-xs">
              <Users2 className="w-3.5 h-3.5" />
              Become a Mentor
            </div>

            <h1 className="text-h1 lg:text-display font-display text-foreground text-balance mb-5">
              Working engineer? Help students avoid their{' '}
              <span className="relative inline-block text-primary-600">
                early mistakes.
                <svg
                  className="absolute left-0 -bottom-1.5 w-full h-2.5 text-primary-300"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M2 8C40 2 100 2 198 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="text-body-lg text-muted-foreground max-w-lg mx-auto mb-8 text-balance">
              Join GuideUp's interview panel, conduct mock interviews on your own schedule, and get paid for your time.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-5">
              <Button size="lg" onClick={scrollToForm}>
                Become a Mentor <ArrowRight className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">No fees. No long-term commitment.</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Benefits strip */}
      <div className="bg-secondary/30 py-12 sm:py-16">
        <Container>
          <Card className="p-0 overflow-hidden">
            <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
              {BENEFITS.map((b) => (
                <div key={b.title} className="p-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                    <b.icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1.5">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </Container>
      </div>

      {/* FAQ + Apply form */}
      <Section className="pt-12 sm:pt-16">
        <Container>
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <span className="w-1 h-5 bg-primary-500 rounded-full" />
                <h2 className="text-h3 text-foreground">Frequently asked questions</h2>
              </div>

              <Accordion type="single" collapsible className="bg-card rounded-2xl border border-border px-6">
                {FAQS.map((item) => (
                  <AccordionItem key={item.q} value={item.q}>
                    <AccordionTrigger>{item.q}</AccordionTrigger>
                    <AccordionContent>{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="flex items-center gap-3 bg-secondary/40 rounded-2xl p-5 mt-6">
                <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shrink-0">
                  <Headphones className="w-4.5 h-4.5 text-primary-600" />
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-foreground">Still have questions?</div>
                  <div className="text-muted-foreground">
                    Email us at{' '}
                    <a href="mailto:support@guideup.in" className="text-primary-600 font-medium hover:underline">
                      support@guideup.in
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <Card id="apply-form" className="p-6 sm:p-8 scroll-mt-24">
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
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-h3 text-foreground">Apply to become a mentor</h3>
                      <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-success">
                        <ShieldCheck className="w-3.5 h-3.5" /> 100% Secure
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Full Name</FormLabel>
                          <FormControl><Input placeholder="Enter your full name" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Email</FormLabel>
                          <FormControl><Input type="email" placeholder="Enter your email" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Phone</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <span className="flex items-center px-3 h-11 rounded-l-lg border border-r-0 border-input bg-secondary/50 text-sm text-foreground/80 font-medium shrink-0">
                                +91
                              </span>
                              <Input type="tel" placeholder="Enter your phone number" className="rounded-l-none" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="domain" render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Primary Domain</FormLabel>
                          <FormControl><Input placeholder="e.g. DSA, System Design, HR" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="experienceYears" render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Years of Experience</FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger error={!!form.formState.errors.experienceYears}>
                                <SelectValue placeholder="Select experience" />
                              </SelectTrigger>
                              <SelectContent>
                                {EXPERIENCE_OPTIONS.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="company" render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Current Company</FormLabel>
                          <FormControl><Input placeholder="Enter your company" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="linkedinUrl" render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn Profile <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                        <FormControl><Input placeholder="https://linkedin.com/in/yourprofile" {...field} /></FormControl>
                      </FormItem>
                    )} />

                    {form.formState.errors.root && (
                      <p className="text-sm text-destructive text-center">{form.formState.errors.root.message}</p>
                    )}

                    <Button type="submit" loading={form.formState.isSubmitting} className="w-full h-12">
                      Submit Application <ArrowRight className="w-4 h-4" />
                    </Button>

                    <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Your information is safe with us and will never be shared.
                    </p>
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
