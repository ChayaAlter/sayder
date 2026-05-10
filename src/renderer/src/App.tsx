import { useMemo, useState } from 'react'
import {
  getMonth,
  getTodayHDate,
  nextMonth as getNextMonth,
  previousMonth as getPreviousMonth
} from './domain/hebrewCalendar'
import type { CalendarDay } from './domain/hebrewCalendar'
import { Hero } from './components/calendar/Hero'
import { MonthGrid } from './components/calendar/MonthGrid'
import { MonthNavigator } from './components/calendar/MonthNavigator'
import { DayDetail } from './components/calendar/DayDetail'

export default function App() {
  const todayHDate = useMemo(() => getTodayHDate(), [])

  const [viewYear, setViewYear] = useState<number>(todayHDate.getFullYear())
  const [viewMonth, setViewMonth] = useState<number>(todayHDate.getMonth())

  const month = useMemo(() => getMonth(viewYear, viewMonth), [viewYear, viewMonth])

  const todayInMonth = month.days.find((d) => d.isToday) ?? null
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(todayInMonth)

  // If we navigate to a different month, keep the previously selected day if it
  // is still in this month, otherwise default to either today (if visible) or
  // the first day of the month.
  const effectiveSelectedDay: CalendarDay | null = (() => {
    if (selectedDay) {
      const match = month.days.find(
        (d) => d.gregorianDate.getTime() === selectedDay.gregorianDate.getTime()
      )
      if (match) return match
    }
    return todayInMonth ?? month.days[0] ?? null
  })()

  const handlePrevious = () => {
    const prev = getPreviousMonth(viewYear, viewMonth)
    setViewYear(prev.year)
    setViewMonth(prev.month)
  }

  const handleNext = () => {
    const next = getNextMonth(viewYear, viewMonth)
    setViewYear(next.year)
    setViewMonth(next.month)
  }

  const handleToday = () => {
    setViewYear(todayHDate.getFullYear())
    setViewMonth(todayHDate.getMonth())
    setSelectedDay(null) // will resolve to today via the effective selector
  }

  const handleSelect = (day: CalendarDay) => {
    setSelectedDay(day)
  }

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-[1200px] mx-auto">
      <div className="space-y-6">
        {effectiveSelectedDay && <Hero day={effectiveSelectedDay} />}

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="card p-5 md:p-6 space-y-4">
            <MonthNavigator
              month={month}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onToday={handleToday}
            />
            <MonthGrid
              month={month}
              selectedDay={effectiveSelectedDay}
              onSelectDay={handleSelect}
            />
          </div>

          {effectiveSelectedDay && <DayDetail day={effectiveSelectedDay} />}
        </div>
      </div>
    </div>
  )
}
