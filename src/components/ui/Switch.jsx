import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const Switch = forwardRef(({ className, checked, onCheckedChange, disabled, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onCheckedChange?.(!checked)}
    className={cn(
      'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      checked ? 'bg-primary' : 'bg-secondary',
      className
    )}
    {...props}
  >
    <span
      className={cn(
        'inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform',
        checked ? 'translate-x-5' : 'translate-x-0.5'
      )}
    />
  </button>
))
Switch.displayName = 'Switch'

export default Switch
