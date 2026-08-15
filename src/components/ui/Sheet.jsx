import { forwardRef } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cva } from 'class-variance-authority'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

export const Sheet = DialogPrimitive.Root
export const SheetTrigger = DialogPrimitive.Trigger
export const SheetClose = DialogPrimitive.Close
export const SheetPortal = DialogPrimitive.Portal

export const SheetOverlay = forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-foreground/40 backdrop-blur-[2px] data-[state=open]:animate-fade-in', className)}
    {...props}
  />
))
SheetOverlay.displayName = 'SheetOverlay'

const sheetVariants = cva(
  'fixed z-50 flex flex-col gap-4 bg-card p-6 shadow-popover border-border transition ease-in-out data-[state=closed]:duration-200 data-[state=open]:duration-300',
  {
    variants: {
      side: {
        right: 'inset-y-0 right-0 h-full w-full max-w-md border-l data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right',
        bottom: 'inset-x-0 bottom-0 max-h-[90vh] rounded-t-2xl border-t data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom',
      },
    },
    defaultVariants: { side: 'right' },
  }
)

export const SheetContent = forwardRef(({ side = 'right', className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground opacity-70 transition-opacity hover:opacity-100 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = 'SheetContent'

export const SheetHeader = ({ className, ...props }) => (
  <div className={cn('flex flex-col gap-1.5', className)} {...props} />
)
export const SheetFooter = ({ className, ...props }) => (
  <div className={cn('mt-auto flex flex-col-reverse gap-2 pt-4 border-t border-border sm:flex-row sm:justify-end', className)} {...props} />
)

export const SheetTitle = forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn('text-h3 text-foreground', className)} {...props} />
))
SheetTitle.displayName = 'SheetTitle'

export const SheetDescription = forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
))
SheetDescription.displayName = 'SheetDescription'
