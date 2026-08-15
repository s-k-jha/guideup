import { forwardRef } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
export const DialogPortal = DialogPrimitive.Portal

export const DialogOverlay = forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-foreground/40 backdrop-blur-[2px] data-[state=open]:animate-fade-in', className)}
    {...props}
  />
))
DialogOverlay.displayName = 'DialogOverlay'

export const DialogContent = forwardRef(({ className, children, hideClose, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-popover',
        'data-[state=open]:animate-scale-in',
        className
      )}
      {...props}
    >
      {children}
      {!hideClose && (
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground opacity-70 transition-opacity hover:opacity-100 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = 'DialogContent'

export const DialogHeader = ({ className, ...props }) => (
  <div className={cn('flex flex-col gap-1.5 mb-4', className)} {...props} />
)
export const DialogFooter = ({ className, ...props }) => (
  <div className={cn('flex flex-col-reverse gap-2 mt-6 sm:flex-row sm:justify-end', className)} {...props} />
)

export const DialogTitle = forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn('text-h3 text-foreground', className)} {...props} />
))
DialogTitle.displayName = 'DialogTitle'

export const DialogDescription = forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
))
DialogDescription.displayName = 'DialogDescription'
