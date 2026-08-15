import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const Textarea = forwardRef(({ className, error, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      aria-invalid={error ? 'true' : undefined}
      className={cn(
        'flex min-h-[100px] w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground/70',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-destructive focus-visible:ring-destructive',
        className
      )}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

export default Textarea
