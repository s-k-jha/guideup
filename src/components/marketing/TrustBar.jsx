import { Container } from '../layout/PageContainer'

const STATS = [
  { value: '500+', label: 'Mock interviews conducted' },
  { value: '20+', label: 'Colleges represented' },
  { value: '4.9★', label: 'Average session rating' },
  { value: '40+', label: 'Working engineers on panel' },
]

export default function TrustBar() {
  return (
    <div className="border-y border-border bg-secondary/30">
      <Container className="py-8 sm:py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-display font-bold text-foreground">{stat.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}
