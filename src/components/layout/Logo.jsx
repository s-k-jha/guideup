import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

export default function Logo({ className }) {
  return (
    <Link to="/" className={cn('flex items-center gap-2 shrink-0', className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm">
        G
      </span>
      <span className="font-display font-bold text-lg text-foreground tracking-tight">
        GuideUp
      </span>
    </Link>
  )
}
