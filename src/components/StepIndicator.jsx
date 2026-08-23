import { Check } from 'lucide-react'
import { cn } from '../lib/utils'

const STEPS = [
  { label: 'Session', description: 'Choose your practice round' },
  { label: 'Schedule', description: 'Pick a date & time' },
  { label: 'Checkout', description: 'Complete your booking' },
]

export default function StepIndicator({ current, showDescriptions = false, align = 'center' }) {
  return (
    <div
      className={cn('flex items-start gap-2 py-5', align === 'left' ? 'justify-start' : 'justify-center')}
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={STEPS.length}
    >
      {STEPS.map(({ label, description }, i) => {
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
              <span className={cn('text-xs mt-1.5 font-semibold', active ? 'text-primary-600' : done ? 'text-foreground/60' : 'text-muted-foreground/50')}>
                {label}
              </span>
              {showDescriptions && (
                <span className="hidden sm:block text-[11px] text-muted-foreground/70 mt-0.5 text-center">
                  {description}
                </span>
              )}
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('w-10 sm:w-20 h-0.5 mx-2 mb-5 self-center transition-all duration-300', done ? 'bg-primary-400' : 'bg-border')} />
            )}
          </div>
        )
      })}
    </div>
  )
}
