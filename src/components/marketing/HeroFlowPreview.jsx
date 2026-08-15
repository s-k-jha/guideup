import { Search, MessageCircle, CheckCircle2, Sparkles } from 'lucide-react'
import { Avatar, AvatarFallback } from '../ui/Avatar'
import Badge from '../ui/Badge'

const NAMES = ['Priya', 'Arjun', 'Sneha', 'Rohit']

const STEPS = [
  {
    icon: Search,
    label: 'Step 1',
    title: 'Browse mentors online now',
  },
  {
    icon: MessageCircle,
    label: 'Step 2',
    title: 'Connect instantly — first chat free',
  },
  {
    icon: CheckCircle2,
    label: 'Step 3',
    title: "You're chatting with your mentor",
  },
]

export default function HeroFlowPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-gradient-to-tr from-primary-100/60 to-transparent rounded-[2rem] blur-2xl -z-10" />
      <div className="rounded-2xl border border-border bg-card shadow-popover p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">How it works</span>
          <span className="flex items-center gap-1.5 text-xs text-success font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Mentors online now
          </span>
        </div>

        {/* Step 1 — browse */}
        <div className="rounded-xl border border-border bg-secondary/30 p-4 mb-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
              <Search className="w-3.5 h-3.5 text-primary-600" />
            </div>
            <span className="text-sm font-semibold text-foreground">Browse mentors online now</span>
          </div>
          <div className="flex items-center gap-2">
            {NAMES.map((name) => (
              <div key={name} className="relative">
                <Avatar className="h-9 w-9 border-2 border-card">
                  <AvatarFallback className="text-xs">{name[0]}</AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-card" />
              </div>
            ))}
            <span className="text-xs text-muted-foreground ml-1">+21 more</span>
          </div>
        </div>

        {/* Step 2 — connect */}
        <div className="rounded-xl border-2 border-primary-500 bg-primary-50 p-4 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center shrink-0">
                <MessageCircle className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-primary-800">Connect with Priya</div>
                <div className="flex items-center gap-1 text-[11px] text-success font-medium mt-0.5">
                  <Sparkles className="w-3 h-3" /> First chat free
                </div>
              </div>
            </div>
            <Badge variant="success" size="sm">FREE</Badge>
          </div>
        </div>

        {/* Step 3 — chat ready */}
        <div className="rounded-xl border border-success/30 bg-success/5 p-4 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-success flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-foreground">You're connected — chat ready</span>
        </div>
      </div>
    </div>
  )
}
