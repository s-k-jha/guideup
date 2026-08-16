import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '../../lib/utils'

const RATING_LABEL = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Great', 5: 'Excellent' }

export default function StarRating({ value, onChange, size = 'md' }) {
  const [hovered, setHovered] = useState(0)
  const starSize = size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'
  const active = hovered || value

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHovered(n)}
            className="p-0.5 transition-transform duration-150 hover:scale-110 active:scale-95"
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                starSize,
                'transition-colors duration-150',
                active >= n ? 'fill-primary-500 text-primary-500' : 'fill-transparent text-muted-foreground/40'
              )}
            />
          </button>
        ))}
      </div>
      <span className={cn('text-xs font-medium w-12 transition-opacity', active ? 'text-primary-600 opacity-100' : 'opacity-0')}>
        {RATING_LABEL[active]}
      </span>
    </div>
  )
}
