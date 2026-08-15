import { Check } from 'lucide-react'
import { cn } from '../lib/utils'

const STEPS = ['Session', 'Schedule', 'Checkout']

export default function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-2 py-5" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={STEPS.length}>
      {STEPS.map((label, i) => {
        const step = i + 1
        const done = step < current
        const active = step === current
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200',
                  done ? 'bg-primary text-primary-foreground' :
                  active ? 'bg-primary text-primary-foreground shadow-brand-ring' :
                  'bg-secondary text-muted-foreground'
                )}
              >
                {done ? <Check className="w-4 h-4" /> : step}
              </div>
              <span className={cn('text-xs mt-1.5 font-medium', active ? 'text-primary-600' : done ? 'text-foreground/60' : 'text-muted-foreground/50')}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('w-10 sm:w-14 h-0.5 mx-2 mb-4 transition-all duration-300', done ? 'bg-primary-400' : 'bg-border')} />
            )}
          </div>
        )
      })}
    </div>
  )
}
