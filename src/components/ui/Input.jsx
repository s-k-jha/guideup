import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const Input = forwardRef(({ className, type = 'text', icon: Icon, error, ...props }, ref) => {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      )}
      <input
        type={type}
        ref={ref}
        aria-invalid={error ? 'true' : undefined}
        className={cn(
          'flex h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground/70',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          Icon && 'pl-10',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        {...props}
      />
    </div>
  )
})
Input.displayName = 'Input'

export default Input
