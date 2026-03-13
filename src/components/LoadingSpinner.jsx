import { cn } from '../lib/utils'

export default function LoadingSpinner({ className, size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className={cn('flex items-center justify-center py-12', className)}>
      <div className={cn('border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin', sizes[size])} />
    </div>
  )
}
