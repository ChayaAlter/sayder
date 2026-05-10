import type { CalendarDay, HebrewMonth } from '@/domain/hebrewCalendar'
import { DayCell } from './DayCell'

interface MonthGridProps {
  month: HebrewMonth
  selectedDay: CalendarDay | null
  onSelectDay: (day: CalendarDay) => void
}

const DAYS_OF_WEEK_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

export function MonthGrid({ month, selectedDay, onSelectDay }: MonthGridProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-2">
        {DAYS_OF_WEEK_HE.map((name, idx) => (
          <div
            key={name}
            className={`text-center text-xs font-medium py-2 ${
              idx === 6 ? 'text-royal-700' : 'text-ink-500'
            }`}
          >
            {name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {month.weeks.map((week, weekIdx) =>
          week.map((day, dayIdx) => (
            <DayCell
              key={`${weekIdx}-${dayIdx}`}
              day={day}
              isSelected={
                day != null &&
                selectedDay != null &&
                day.gregorianDate.getTime() === selectedDay.gregorianDate.getTime()
              }
              onClick={onSelectDay}
            />
          ))
        )}
      </div>
    </div>
  )
}
