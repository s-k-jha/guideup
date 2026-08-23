import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react'
import { Section, Container } from '../layout/PageContainer'
import Button from '../ui/Button'
import { Avatar, AvatarFallback } from '../ui/Avatar'

const NAMES = ['Priya', 'Arjun', 'Sneha', 'Rohit']

export default function TalkToMentorPromo() {
  return (
    <Section>
      <Container>
        <div className="rounded-3xl border border-border bg-gradient-to-br from-primary-50 via-card to-card p-8 sm:p-12 grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-card border border-border px-3 py-1 rounded-full text-xs font-medium text-foreground/80 mb-5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-primary-500" />
              Need something right now?
            </span>
            <h2 className="text-h2 font-display text-foreground text-balance mb-4">
              The senior you never had,
              <span className="block text-primary-600">online right now</span>
            </h2>
            <p className="text-muted-foreground max-w-md mb-7 text-balance">
              Not ready to book? Just talk. DSA doubts, resume panic, 2 AM spirals —
              first chat's free.
            </p>
            <Button size="lg" asChild>
              <Link to="/talk-to-mentor">
                Talk to a Mentor
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Mentors online
              </span>
              <span className="flex items-center gap-1.5 text-xs text-success font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Live
              </span>
            </div>
            <div className="space-y-3">
              {NAMES.map((name) => (
                <div key={name} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs">{name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-card" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{name}</span>
                  <span className="ml-auto text-xs text-success font-semibold">Online</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-success" /> First chat free, no card needed
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
