import { forwardRef } from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { cva } from 'class-variance-authority'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { cn } from '../../lib/utils'

export const ToastProvider = ToastPrimitive.Provider

export const ToastViewport = forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:max-w-[400px]',
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = 'ToastViewport'

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border p-4 shadow-popover transition-all data-[state=open]:animate-fade-up data-[swipe=end]:animate-out',
  {
    variants: {
      variant: {
        default: 'bg-card border-border text-card-foreground',
        success: 'bg-card border-success/20 text-card-foreground',
        destructive: 'bg-card border-destructive/20 text-card-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

const icons = { success: CheckCircle2, destructive: AlertCircle, default: Info }
const iconColors = { success: 'text-success', destructive: 'text-destructive', default: 'text-primary' }

export const Toast = forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const Icon = icons[variant]
  return (
    <ToastPrimitive.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props}>
      <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', iconColors[variant])} />
      <div className="flex-1 min-w-0">{props.children}</div>
    </ToastPrimitive.Root>
  )
})
Toast.displayName = 'Toast'

export const ToastTitle = forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Title ref={ref} className={cn('text-sm font-semibold text-foreground', className)} {...props} />
))
ToastTitle.displayName = 'ToastTitle'

export const ToastDescription = forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground mt-0.5', className)} {...props} />
))
ToastDescription.displayName = 'ToastDescription'

export const ToastClose = forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn('absolute right-2.5 top-2.5 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', className)}
    toast-close=""
    {...props}
  >
    <X className="h-3.5 w-3.5" />
  </ToastPrimitive.Close>
))
ToastClose.displayName = 'ToastClose'

export const ToastAction = ToastPrimitive.Action
