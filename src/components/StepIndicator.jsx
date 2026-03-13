import { Check } from 'lucide-react'
import { cn } from '../lib/utils'

const STEPS = ['Session', 'Schedule', 'Checkout']

export default function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {STEPS.map((label, i) => {
        const step = i + 1
        const done = step < current
        const active = step === current
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                done ? 'bg-primary-500 text-white' :
                active ? 'bg-primary-500 text-white ring-4 ring-primary-100' :
                'bg-gray-100 text-gray-400'
              )}>
                {done ? <Check className="w-4 h-4" /> : step}
              </div>
              <span className={cn('text-xs mt-1 font-medium', active ? 'text-primary-600' : done ? 'text-gray-500' : 'text-gray-300')}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('w-12 h-0.5 mx-2 mb-4 transition-all', done ? 'bg-primary-400' : 'bg-gray-200')} />
            )}
          </div>
        )
      })}
    </div>
  )
}
