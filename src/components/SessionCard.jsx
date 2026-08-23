import { Clock, IndianRupee, Check, Flame } from 'lucide-react'
import { cn } from '../lib/utils'
import { getSessionVisual } from '../lib/sessionVisuals'

export default function SessionCard({ session, selected, onSelect, pricePerMinute, index = 0 }) {
  const { icon: Icon, bg, text } = getSessionVisual(session.title, index)

  return (
    <button
      type="button"
      onClick={() => onSelect(session)}
      aria-pressed={selected}
      className={cn(
        'relative w-full text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 group',
        selected
          ? 'border-2 border-primary-500 bg-primary-50/50 shadow-card-hover'
          : 'border border-border bg-card hover:border-primary-300 hover:shadow-card-hover'
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', bg)}>
          <Icon className={cn('w-5 h-5', text)} />
        </div>
        <span
          className={cn(
            'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-150',
            selected ? 'bg-primary-500 border-primary-500' : 'border-border bg-card group-hover:border-primary-300'
          )}
        >
          {selected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
        </span>
      </div>

      <h3 className="font-semibold text-base leading-tight text-foreground mb-1.5">{session.title}</h3>

      {session.description && (
        <p className="text-sm text-muted-foreground mb-3 leading-snug line-clamp-2">{session.description}</p>
      )}

      <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          {session.durationMinutes} min
        </span>
        <span className="flex items-center gap-0.5 text-base font-bold text-foreground">
          <IndianRupee className="w-3.5 h-3.5" />
          {session.price}
        </span>
        {pricePerMinute && <span className="text-xs text-muted-foreground/70">₹{pricePerMinute.toFixed(2)}/min</span>}
        {session.isPromo && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            <Flame className="w-3 h-3" /> Most Popular
          </span>
        )}
      </div>
    </button>
  )
}
