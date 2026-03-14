import { Clock, IndianRupee, ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '../lib/utils'

export default function SessionCard({
  session,
  selected,
  onSelect,
  pricePerMinute,
  onClick
}) {

  return (
    <button
      onClick={() => onSelect(session)}
      className={cn(
        'relative w-full text-left p-3 rounded-xl border-2 transition-all duration-200 shadow-card group overflow-visible',
        selected
          ? 'border-primary-500 bg-primary-50 shadow-card-hover'
          : 'border-gray-100 bg-white hover:border-primary-200 hover:shadow-card-hover'
      )}
    >

      {/* Floating Coupon Ribbon */}
      <div className="absolute -top-3 right-3 z-10">
        <div className="flex items-center gap-1 bg-green-100 text-green-700 text-[11px] font-semibold px-3 py-1 rounded-full border border-green-200 shadow-sm">
          <Sparkles className="w-2 h-2" />  
          USE CODE: GUIDEUP50 • 50% OFF
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">

        {/* Left Content */}
        <div className="flex-1">

          {/* Title */}
          <h3
            className={cn(
              'font-semibold text-base leading-tight',
              selected ? 'text-primary-700' : 'text-gray-900'
            )}
          >
            {session.title}
          </h3>

          {/* Description */}
          {session.description && (
            <p className="text-sm text-gray-500 mt-1 mb-3 leading-snug">
              {session.description}
            </p>
          )}

          {/* Session Details */}
          <div className="flex items-center gap-4">

            {/* Duration */}
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              {session.durationMinutes} min
            </span>

            {/* Price */}
            <span
              className={cn(
                'flex items-center gap-1 text-base font-bold',
                selected ? 'text-primary-600' : 'text-gray-900'
              )}
            >
              <IndianRupee className="w-4 h-4" />
              {session.price}
            </span>

            {/* Per Minute */}
            {pricePerMinute && (
              <span className="text-xs text-gray-400">
                ₹{pricePerMinute.toFixed(2)}/min
              </span>
            )}

          </div>

        </div>

        {/* Arrow Button */}
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0',
            selected
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-400 group-hover:bg-primary-100 group-hover:text-primary-500'
          )}
        >
          <ArrowRight className="w-4 h-4" 
          onClick={onClick}
          />
        </div>

      </div>

    </button>
  )
}