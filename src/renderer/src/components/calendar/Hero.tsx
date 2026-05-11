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

  // On Shabbat (or any day) we may have both holiday/special-shabbat events
  // AND a parsha. Render every event in white, parsha in gold, separated by
  // bullets — keeping the order produced by the domain wrapper (yom-tov →
  // chol-hamoed → fasts → rosh-chodesh → special-shabbat → parsha).
  const heroEvents: { name: string; isParsha: boolean }[] = [
    ...day.events.map((ev) => ({ name: ev.name, isParsha: false })),
    ...(day.parsha ? [{ name: day.parsha, isParsha: true }] : [])
  ]

  return (
    <div className="bg-royal-700 text-white rounded-2xl px-6 py-2 shadow-card shrink-0">
      <div className="text-center">
        <h1 className="font-display font-bold text-xl md:text-2xl tracking-wide leading-tight">
          {headlineDate}
        </h1>
        <p className="text-xs text-white/75 mt-0.5">
          <span>{dayOfWeekLine}</span>
          {heroEvents.map((ev, idx) => (
            <span key={idx}>
              <span className="mx-2 opacity-50">•</span>
              <span
                className={
                  ev.isParsha
                    ? 'text-gold-400 font-medium'
                    : 'text-white font-medium'
                }
              >
                {ev.name}
              </span>
            </span>
          ))}
          <span className="mx-2 opacity-40">·</span>
          <span className="text-white/45 text-[11px]">{gregorianLine}</span>
        </p>
      </div>
    </div>
  )
}
