import type { CalendarDay } from '@/domain/hebrewCalendar'

interface DayCellProps {
  day: CalendarDay | null
  isSelected: boolean
  onClick: (day: CalendarDay) => void
}

export function DayCell({ day, isSelected, onClick }: DayCellProps) {
  if (!day) {
    return <div className="min-h-[60px]" aria-hidden="true" />
  }

  const baseClass =
    'relative min-h-[60px] rounded-lg px-1.5 py-1 text-right transition-all border overflow-hidden flex flex-col'

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

  // Hebcal returns parsha events as "פרשת <name>". In tight cells the prefix
  // is redundant (every Shabbat cell would repeat it), so we drop it for the
  // cell display while keeping the full string for the hover title.
  const fullEventLabel = primaryEvent ? primaryEvent.name : day.parsha ?? ''
  const cellEventLabel = fullEventLabel.replace(/^פרשת\s+/, '')

  const gregorianClass = isSelected ? 'text-white/50' : 'text-ink-500/60'

  return (
    <button
      type="button"
      onClick={() => onClick(day)}
      className={`${baseClass} ${stateClass}`}
    >
      <div className="flex items-start justify-between gap-1 min-w-0">
        {/* Fixed-width, right-aligned slot so all day-letter variants
            (`א'`, `י"א`, `כ"ז`, `ל'`) land at the same right edge. */}
        <span className="font-display font-bold text-base leading-none shrink-0 inline-block min-w-[1.75rem] text-right tabular-nums">
          {day.hebrewDayLetter}
        </span>
        <span className={`text-[9px] leading-none pt-0.5 shrink-0 ${gregorianClass}`}>
          {day.gregorianDay}
        </span>
      </div>

      {cellEventLabel && (
        <div
          className={`mt-0.5 text-[10px] leading-tight line-clamp-2 break-words ${eventColor} text-right`}
          title={fullEventLabel}
        >
          {cellEventLabel}
        </div>
      )}
    </button>
  )
}
