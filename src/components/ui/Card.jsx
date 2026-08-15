import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

export const Card = forwardRef(({ className, hover = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border border-border bg-card text-card-foreground shadow-card',
      hover && 'transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5',
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

export const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col gap-1.5 p-5 sm:p-6', className)} {...props} />
))
CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-h3 text-card-foreground', className)} {...props} />
))
CardTitle.displayName = 'CardTitle'

export const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
))
CardDescription.displayName = 'CardDescription'

export const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-5 pt-0 sm:p-6 sm:pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center p-5 pt-0 sm:p-6 sm:pt-0', className)} {...props} />
))
CardFooter.displayName = 'CardFooter'
