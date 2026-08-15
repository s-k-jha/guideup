import { forwardRef } from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Circle } from 'lucide-react'
import { cn } from '../../lib/utils'

export const RadioGroup = forwardRef(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root ref={ref} className={cn('grid gap-2.5', className)} {...props} />
))
RadioGroup.displayName = 'RadioGroup'

export const RadioGroupItem = forwardRef(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'aspect-square h-[18px] w-[18px] rounded-full border border-input text-primary shadow-xs transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'data-[state=checked]:border-primary',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <Circle className="h-2.5 w-2.5 fill-primary text-primary" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
))
RadioGroupItem.displayName = 'RadioGroupItem'
