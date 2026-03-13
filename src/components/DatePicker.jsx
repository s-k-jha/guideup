import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/utils'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function toYMD(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
}

export default function DatePicker({ selected, onSelect }) {
  const today = new Date()
  today.setHours(0,0,0,0)

  const [view, setView] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const prevMonth = () => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))
  const nextMonth = () => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))

  const firstDay = view.getDay()
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <span className="font-semibold text-gray-900 text-sm">
          {MONTHS[view.getMonth()]} {view.getFullYear()}
        </span>
        <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(d => <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const date = new Date(view.getFullYear(), view.getMonth(), day)
          const ymd = toYMD(date)
          const isPast = date < today
          const isSelected = selected === ymd
          const isToday = toYMD(today) === ymd
          return (
            <button
              key={day}
              disabled={isPast}
              onClick={() => !isPast && onSelect(ymd)}
              className={cn(
                'aspect-square rounded-lg text-sm font-medium transition-all',
                isSelected ? 'bg-primary-500 text-white' :
                isToday ? 'border-2 border-primary-400 text-primary-600' :
                isPast ? 'text-gray-300 cursor-not-allowed' :
                'hover:bg-primary-50 hover:text-primary-600 text-gray-700'
              )}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
