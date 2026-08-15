import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function Breadcrumb({ items = [], className }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center flex-wrap gap-1.5 text-sm', className)}>
      <Link to="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
        <Home className="h-3.5 w-3.5" />
        <span className="sr-only">Home</span>
      </Link>
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
            {isLast || !item.href ? (
              <span className="text-foreground font-medium truncate max-w-[220px]" aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </span>
            ) : (
              <Link to={item.href} className="text-muted-foreground hover:text-primary transition-colors truncate max-w-[220px]">
                {item.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
