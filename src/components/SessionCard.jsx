import { Clock, IndianRupee, ArrowRight } from 'lucide-react'
import { cn } from '../lib/utils'

export default function SessionCard({ session, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(session)}
      className={cn(
        'w-full text-left p-5 rounded-xl border-2 transition-all duration-200 shadow-card group',
        selected
          ? 'border-primary-500 bg-primary-50 shadow-card-hover'
          : 'border-gray-100 bg-white hover:border-primary-200 hover:shadow-card-hover'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className={cn('font-semibold text-base leading-tight mb-3', selected ? 'text-primary-700' : 'text-gray-900')}>
            {session.title}
          </h3>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              {session.durationMinutes} min
            </span>
            <span className={cn('flex items-center gap-1 text-base font-bold', selected ? 'text-primary-600' : 'text-gray-900')}>
              <IndianRupee className="w-4 h-4" />
              {session.price}
            </span>
          </div>
        </div>
        <div className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0',
          selected ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-primary-100 group-hover:text-primary-500'
        )}>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </button>
  )
}
