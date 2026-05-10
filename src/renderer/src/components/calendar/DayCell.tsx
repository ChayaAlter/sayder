import type { CalendarDay } from '@/domain/hebrewCalendar'

interface DayCellProps {
  day: CalendarDay | null
  isSelected: boolean
  onClick: (day: CalendarDay) => void
}

export function DayCell({ day, isSelected, onClick }: DayCellProps) {
  if (!day) {
    return <div className="aspect-[6/5] min-h-[80px]" aria-hidden="true" />
  }

  const baseClass =
    'relative aspect-[6/5] min-h-[80px] rounded-lg p-2 text-right transition-all border'

  let stateClass = 'bg-white border-parchment-200/70 hover:border-royal-500 hover:shadow-card'
  if (day.isShabbat) {
    stateClass = 'bg-parchment-200/70 border-parchment-300/60 hover:border-royal-500'
  }
  if (day.isToday && !isSelected) {
    stateClass = 'bg-white border-2 border-gold-500 hover:border-gold-600'
  }
  if (isSelected) {
    stateClass = 'bg-royal-700 text-white border-royal-700 shadow-card'
  }

  const primaryEvent = day.events[0]
  const eventColor = (() => {
    if (isSelected) return 'text-white/90'
    if (!primaryEvent) return ''
    switch (primaryEvent.category) {
      case 'yom-tov':
        return 'text-gold-600'
      case 'rosh-chodesh':
        return 'text-emerald-700'
      case 'fast-major':
      case 'fast-minor':
        return 'text-stone-500'
      case 'chol-hamoed':
        return 'text-emerald-700'
      case 'modern':
        return 'text-royal-600'
      case 'special-shabbat':
      case 'minor-holiday':
      default:
        return 'text-royal-600'
    }
  })()

  return (
    <button
      type="button"
      onClick={() => onClick(day)}
      className={`${baseClass} ${stateClass}`}
    >
      <div className="flex items-start justify-between">
        <span
          className={`text-[10px] ${
            isSelected ? 'text-white/70' : 'text-ink-500'
          }`}
        >
          {day.gregorianDay} {day.gregorianMonthShort}
        </span>
        <span className="font-display font-bold text-lg leading-none">
          {day.hebrewDayLetter}
        </span>
      </div>

      {(primaryEvent || day.parsha) && (
        <div className={`mt-1 text-[10px] leading-tight ${eventColor} text-right`}>
          {primaryEvent ? primaryEvent.name : `פרשת ${day.parsha?.replace(/^פרשת\s+/, '')}`}
        </div>
      )}
    </button>
  )
}
