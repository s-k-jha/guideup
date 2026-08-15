import { Clock, IndianRupee, CheckCircle2 } from 'lucide-react'
import { cn } from '../lib/utils'

export default function SessionCard({ session, selected, onSelect, pricePerMinute }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(session)}
      aria-pressed={selected}
      className={cn(
        'relative w-full text-left p-4 sm:p-5 rounded-xl border transition-all duration-200 group',
        selected
          ? 'border-primary-500 bg-primary-50/60 shadow-card-hover ring-1 ring-primary-200'
          : 'border-border bg-card hover:border-primary-300 hover:shadow-card-hover'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {session.isPromo && (
            <span className="inline-block text-[11px] font-semibold uppercase tracking-wide text-primary-600 mb-1.5">
              Popular choice
            </span>
          )}

          <h3 className={cn('font-semibold text-base leading-tight', selected ? 'text-primary-800' : 'text-foreground')}>
            {session.title}
          </h3>

          {session.description && (
            <p className="text-sm text-muted-foreground mt-1.5 mb-3 leading-snug line-clamp-2">
              {session.description}
            </p>
          )}

          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {session.durationMinutes} min
            </span>

            <span className={cn('flex items-center gap-0.5 text-base font-bold', selected ? 'text-primary-700' : 'text-foreground')}>
              <IndianRupee className="w-4 h-4" />
              {session.price}
            </span>

            {pricePerMinute && (
              <span className="text-xs text-muted-foreground/70">₹{pricePerMinute.toFixed(2)}/min</span>
            )}
          </div>
        </div>

        <span
          className={cn(
            'w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-150',
            selected ? 'bg-primary-500 border-primary-500' : 'border-border bg-card group-hover:border-primary-300'
          )}
        >
          {selected && <CheckCircle2 className="w-4 h-4 text-white" />}
        </span>
      </div>
    </button>
  )
}
