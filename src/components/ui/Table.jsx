import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

export const Table = forwardRef(({ className, ...props }, ref) => (
  <div className="w-full overflow-x-auto rounded-xl border border-border">
    <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
  </div>
))
Table.displayName = 'Table'

export const TableHeader = forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('bg-secondary/60 [&_tr]:border-b border-border', className)} {...props} />
))
TableHeader.displayName = 'TableHeader'

export const TableBody = forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
))
TableBody.displayName = 'TableBody'

export const TableRow = forwardRef(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn('border-b border-border transition-colors hover:bg-secondary/40', className)} {...props} />
))
TableRow.displayName = 'TableRow'

export const TableHead = forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn('h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wide text-muted-foreground', className)}
    {...props}
  />
))
TableHead.displayName = 'TableHead'

export const TableCell = forwardRef(({ className, ...props }, ref) => (
  <td ref={ref} className={cn('p-4 align-middle', className)} {...props} />
))
TableCell.displayName = 'TableCell'
