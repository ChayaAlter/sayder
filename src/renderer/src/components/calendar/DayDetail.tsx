import type { CalendarDay } from '@/domain/hebrewCalendar'
import { getNextShabbatParsha } from '@/domain/hebrewCalendar'

interface DayDetailProps {
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

const DAY_OF_WEEK_HE = [
  'יום ראשון',
  'יום שני',
  'יום שלישי',
  'יום רביעי',
  'יום חמישי',
  'יום שישי',
  'יום שבת'
]

function formatGregorian(d: Date): string {
  return `${d.getDate()} ${GREGORIAN_FULL_MONTHS_HE[d.getMonth()]} ${d.getFullYear()}`
}

const CATEGORY_LABELS: Record<string, string> = {
  'rosh-chodesh': 'ראש חודש',
  'yom-tov': 'יום טוב',
  'chol-hamoed': 'חול המועד',
  'fast-major': 'תענית',
  'fast-minor': 'תענית',
  'minor-holiday': 'מועד',
  'modern': 'יום עיון',
  'special-shabbat': 'שבת מיוחדת',
  'parsha': 'פרשת השבוע',
  'other': 'אירוע'
}

export function DayDetail({ day }: DayDetailProps) {
  // For non-Shabbat days, show the upcoming parsha as informational context.
  const upcomingParsha = day.isShabbat ? undefined : getNextShabbatParsha(day.hdate)

  return (
    <div className="card p-4 space-y-4 overflow-y-auto min-h-0">
      <div>
        <div className="text-xs text-ink-500 uppercase tracking-wider">פרטי היום</div>
        <h2 className="font-display font-bold text-lg text-ink-900 mt-0.5">
          {DAY_OF_WEEK_HE[day.dayOfWeek]}
        </h2>
        <p className="text-ink-500/70 text-[11px] mt-0.5">{formatGregorian(day.gregorianDate)}</p>
      </div>

      {(day.events.length > 0 || day.parsha) && (
        <div className="space-y-1.5">
          <div className="text-xs text-ink-500 uppercase tracking-wider">אירועי היום</div>
          <ul className="space-y-1">
            {day.events.map((ev, idx) => (
              <li key={idx} className="flex items-baseline gap-2 flex-wrap">
                <span className="text-royal-600 text-sm">●</span>
                <span className="text-ink-900 text-sm">{ev.name}</span>
                <span className="text-ink-500 text-xs">({CATEGORY_LABELS[ev.category] ?? 'אירוע'})</span>
              </li>
            ))}
            {day.parsha && (
              <li className="flex items-baseline gap-2 flex-wrap">
                <span className="text-gold-600 text-sm">●</span>
                <span className="text-ink-900 text-sm font-medium">{day.parsha}</span>
                <span className="text-ink-500 text-xs">({CATEGORY_LABELS['parsha']})</span>
              </li>
            )}
          </ul>
        </div>
      )}

      {upcomingParsha && (
        <div className="space-y-1 pt-3 border-t border-parchment-200">
          <div className="text-xs text-ink-500 uppercase tracking-wider">פרשת השבוע הקרובה</div>
          <p className="text-ink-900 text-sm font-medium">{upcomingParsha}</p>
        </div>
      )}

      <div className="pt-3 border-t border-parchment-200">
        <p className="text-xs text-ink-500 italic">
          כאן יופיע מידע על תכניות הלימוד שלך (יתווסף בשלב הבא).
        </p>
      </div>
    </div>
  )
}
