import { createContext, forwardRef, useContext, useId } from 'react'
import { Controller, FormProvider, useFormContext } from 'react-hook-form'
import { cn } from '../../lib/utils'
import Label from './Label'

export const Form = FormProvider

const FormFieldContext = createContext({})

export function FormField({ ...props }) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const FormItemContext = createContext({})

function useFormField() {
  const fieldContext = useContext(FormFieldContext)
  const itemContext = useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()
  const fieldState = getFieldState(fieldContext.name, formState)
  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

export const FormItem = forwardRef(({ className, ...props }, ref) => {
  const id = useId()
  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('space-y-1.5', className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = 'FormItem'

export const FormLabel = forwardRef(({ className, required, ...props }, ref) => {
  const { error, formItemId } = useFormField()
  return (
    <Label
      ref={ref}
      required={required}
      className={cn(error && 'text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = 'FormLabel'

export const FormControl = forwardRef(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
  return (
    <div
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = 'FormControl'

export const FormDescription = forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()
  return <p ref={ref} id={formDescriptionId} className={cn('text-xs text-muted-foreground', className)} {...props} />
})
FormDescription.displayName = 'FormDescription'

export const FormMessage = forwardRef(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? '') : children
  if (!body) return null
  return (
    <p ref={ref} id={formMessageId} className={cn('text-xs font-medium text-destructive', className)} {...props}>
      {body}
    </p>
  )
})
FormMessage.displayName = 'FormMessage'

export { useFormField }
