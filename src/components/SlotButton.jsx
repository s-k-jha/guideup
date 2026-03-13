import { cn } from '../lib/utils'

export default function SlotButton({ time, available, selected, onSelect }) {
  return (
    <button
      disabled={!available}
      onClick={() => available && onSelect(time)}
      className={cn(
        'py-3 px-2 rounded-lg text-sm font-medium transition-all duration-150 border',
        available && selected
          ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
          : available
          ? 'bg-white text-gray-800 border-gray-200 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50'
          : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through'
      )}
    >
      {time}
    </button>
  )
}
