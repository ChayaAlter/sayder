import type { CalendarDay } from '@/domain/hebrewCalendar'
import { formatHebrewDate, formatHebrewDateWithDayOfWeek } from '@/domain/hebrewCalendar'

interface HeroProps {
  day: CalendarDay
}

const GREGORIAN_FULL_MONTHS_HE = [
  'בינואר',
  'בפברואר',
  'במרץ',
  'באפריל',
  'במאי',
  'ביוני',
  'ביולי',
  'באוגוסט',
  'בספטמבר',
  'באוקטובר',
  'בנובמבר',
  'בדצמבר'
]

function formatGregorian(d: Date): string {
  return `${d.getDate()} ${GREGORIAN_FULL_MONTHS_HE[d.getMonth()]} ${d.getFullYear()}`
}

export function Hero({ day }: HeroProps) {
  const headlineDate = formatHebrewDate(day.hdate)
  const dayOfWeekLine = formatHebrewDateWithDayOfWeek(day.hdate).split(',')[0]
  const gregorianLine = formatGregorian(day.gregorianDate)

  return (
    <div className="bg-royal-700 text-white rounded-2xl px-8 py-6 shadow-card">
      <div className="text-center space-y-1">
        <h1 className="font-display font-bold text-3xl md:text-4xl tracking-wide">
          {headlineDate}
        </h1>
        <p className="text-base md:text-lg text-white/80">
          {dayOfWeekLine}
          <span className="mx-2 opacity-60">•</span>
          {gregorianLine}
        </p>
        {day.parsha && (
          <p className="text-sm md:text-base text-gold-400 font-medium pt-1">
            פרשת {day.parsha.replace(/^פרשת\s+/, '')}
          </p>
        )}
      </div>
    </div>
  )
}
