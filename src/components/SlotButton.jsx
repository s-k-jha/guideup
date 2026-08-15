import { cn } from '../lib/utils'

export default function SlotButton({ time, available, selected, onSelect }) {
  return (
    <button
      type="button"
      disabled={!available}
      aria-pressed={selected}
      onClick={() => available && onSelect(time)}
      className={cn(
        'py-2.5 px-2 rounded-lg text-sm font-medium transition-all duration-150 border',
        available && selected
          ? 'bg-primary text-primary-foreground border-primary shadow-xs'
          : available
          ? 'bg-card text-foreground border-border hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50'
          : 'bg-secondary/50 text-muted-foreground/50 border-transparent cursor-not-allowed line-through'
      )}
    >
      {time}
    </button>
  )
}
