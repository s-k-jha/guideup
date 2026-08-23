import { useNavigate } from 'react-router-dom'
import { Search, MessageCircle, CheckCircle2, ArrowRight } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

function Connector() {
  return (
    <div className="hidden md:flex items-center justify-center px-1 relative z-0">
      <div className="w-full border-t border-dashed border-primary-300" />
      <span className="absolute w-6 h-6 rounded-full border border-primary-300 bg-card flex items-center justify-center shrink-0">
        <ArrowRight className="w-3 h-3 text-primary-500" />
      </span>
    </div>
  )
}

export default function HeroFlowPreview() {
  const navigate = useNavigate()

  return (
    <div className="mt-4 rounded-3xl border border-border bg-card shadow-popover p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <span className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
          <span className="w-1 h-4 bg-primary-500 rounded-full" />
          How it works
        </span>
        <span className="flex items-center gap-1.5 text-xs text-success font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          Mentors online now
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2rem_1fr_2rem_1fr] gap-4 md:gap-0 items-stretch mb-8">
        {/* Step 1 — browse */}
        <div className="rounded-2xl border border-border bg-secondary/30 p-5">
          <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center mb-3">
            <Search className="w-4 h-4 text-white" />
          </div>
          <div className="font-semibold text-foreground text-sm mb-1">Browse mentors</div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            See who's online and pick the mentor that fits your goal.
          </p>
        </div>

        <Connector />

        {/* Step 2 — connect */}
        <div className="rounded-2xl border-2 border-primary-500 bg-primary-50 p-5">
          <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center mb-3">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-primary-800 text-sm">Connect with Priya</span>
            <Badge variant="success" size="sm">Free</Badge>
          </div>
          <p className="text-xs text-primary-800/70 leading-relaxed">
            Tap connect — no forms, no scheduling.
          </p>
        </div>

        <Connector />

        {/* Step 3 — chat ready */}
        <div className="rounded-2xl border border-success/30 bg-success/5 p-5">
          <div className="w-9 h-9 rounded-full bg-success flex items-center justify-center mb-3">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <div className="font-semibold text-foreground text-sm mb-1">You're connected</div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ask anything and get real, useful answers.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button size="lg" onClick={() => navigate('/sessions')}>
          Book a Mock Interview
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button size="lg" variant="outline" onClick={() => navigate('/talk-to-mentor')}>
          Talk to a Mentor
        </Button>
      </div>
    </div>
  )
}
