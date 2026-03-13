import { cn } from '../lib/utils'

export default function PrimaryButton({ children, className, loading, variant = 'default', ...props }) {
  const base = 'h-12 w-full rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    default: 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm hover:shadow-md active:scale-[0.98]',
    outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 bg-white',
    ghost:   'text-gray-600 hover:bg-gray-100 bg-transparent',
    danger:  'bg-red-500 hover:bg-red-600 text-white',
  }
  return (
    <button className={cn(base, variants[variant], className)} disabled={loading || props.disabled} {...props}>
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : children}
    </button>
  )
}
