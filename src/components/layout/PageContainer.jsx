import { cn } from '../../lib/utils'

export function Container({ className, ...props }) {
  return <div className={cn('container', className)} {...props} />
}

export function Section({ className, ...props }) {
  return <section className={cn('py-16 sm:py-20 lg:py-24', className)} {...props} />
}

export function SectionHeading({ eyebrow, title, description, align = 'center', className }) {
  return (
    <div
      className={cn(
        'max-w-2xl mb-12 sm:mb-16',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {eyebrow && (
        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary-600 mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="text-h2 font-display text-foreground text-balance">{title}</h2>
      {description && <p className="mt-4 text-body-lg text-muted-foreground text-balance">{description}</p>}
    </div>
  )
}
