import { AlertTriangle, Inbox, Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import Button from './Button'

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center px-6 py-14', className)}>
      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ErrorState({ title = 'Something went wrong', description = 'Please try again in a moment.', onRetry, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center px-6 py-14', className)}>
      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-5 h-5 text-destructive" />
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-5">
          Try again
        </Button>
      )}
    </div>
  )
}

export function LoadingState({ label = 'Loading…', className, size = 'md' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' }
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-14', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizes[size])} />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  )
}
