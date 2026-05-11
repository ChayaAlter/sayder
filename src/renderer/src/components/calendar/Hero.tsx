import type { CalendarDay } from '@/domain/hebrewCalendar'
import { formatHebrewDate, formatHebrewDateWithDayOfWeek } from '@/domain/hebrewCalendar'

interface HeroProps {
  day: CalendarDay
}

function formatGregorianCompact(d: Date): string {
  // Compact numeric form keeps the Gregorian date visually marginal.
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`
}

export function Hero({ day }: HeroProps) {
  const headlineDate = formatHebrewDate(day.hdate)
  const dayOfWeekLine = formatHebrewDateWithDayOfWeek(day.hdate).split(',')[0]
  const gregorianLine = formatGregorianCompact(day.gregorianDate)

  return (
    <div className="bg-royal-700 text-white rounded-2xl px-6 py-2 shadow-card shrink-0">
      <div className="text-center">
        <h1 className="font-display font-bold text-xl md:text-2xl tracking-wide leading-tight">
          {headlineDate}
        </h1>
        <p className="text-xs text-white/75 mt-0.5">
          <span>{dayOfWeekLine}</span>
          {day.parsha && (
            <>
              <span className="mx-2 opacity-50">•</span>
              <span className="text-gold-400 font-medium">{day.parsha}</span>
            </>
          )}
          <span className="mx-2 opacity-40">·</span>
          <span className="text-white/45 text-[11px]">{gregorianLine}</span>
        </p>
      </div>
    </div>
  )
}
