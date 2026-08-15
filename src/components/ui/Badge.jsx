import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary-50 text-primary-700 border-primary-100',
        secondary: 'bg-secondary text-secondary-foreground border-transparent',
        outline: 'bg-transparent text-foreground border-border',
        success: 'bg-success/10 text-success border-success/20',
        destructive: 'bg-destructive/10 text-destructive border-destructive/20',
        warning: 'bg-amber-50 text-amber-700 border-amber-200',
      },
      size: {
        default: 'text-xs px-2.5 py-1',
        sm: 'text-[11px] px-2 py-0.5',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export default function Badge({ className, variant, size, ...props }) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
}
