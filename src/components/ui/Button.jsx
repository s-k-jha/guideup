import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary-600',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border',
        outline: 'border border-input bg-card hover:bg-secondary text-foreground',
        ghost: 'hover:bg-secondary text-foreground',
        link: 'text-primary underline-offset-4 hover:underline p-0 h-auto font-medium',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 px-4 text-[13px]',
        lg: 'h-12 px-7 text-base',
        icon: 'h-10 w-10 shrink-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const Button = forwardRef(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), 'w-auto', className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {children}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export default Button
