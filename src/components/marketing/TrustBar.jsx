import { Users, ShieldCheck, Briefcase, MessageCircle } from 'lucide-react'
import { Container } from '../layout/PageContainer'

// TODO: confirm these numbers before shipping — they're factual claims,
// not decoration.
const STATS = [
  { icon: Users, value: '50K+', label: 'Students helped', bg: 'bg-primary-50', text: 'text-primary-600' },
  { icon: ShieldCheck, value: '4.9/5', label: 'Average rating', bg: 'bg-success/10', text: 'text-success' },
  { icon: Briefcase, value: '500+', label: 'Top companies', bg: 'bg-purple-50', text: 'text-purple-600' },
  { icon: MessageCircle, value: '20K+', label: 'Interviews conducted', bg: 'bg-blue-50', text: 'text-blue-600' },
]

export default function TrustBar() {
  return (
    <div className="py-6 sm:py-8">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {STATS.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.text}`} />
                </div>
                <div>
                  <div className="text-lg font-display font-bold text-foreground leading-none">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </div>
  )
}
