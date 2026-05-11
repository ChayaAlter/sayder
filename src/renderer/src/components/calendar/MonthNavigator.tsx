import type { HebrewMonth } from '@/domain/hebrewCalendar'

interface MonthNavigatorProps {
  month: HebrewMonth
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
}

export function MonthNavigator({ month, onPrevious, onNext, onToday }: MonthNavigatorProps) {
  return (
    <div className="flex items-center justify-between gap-4 shrink-0">
      <button
        type="button"
        onClick={onPrevious}
        className="w-8 h-8 rounded-full hover:bg-parchment-200/60 transition-colors text-ink-700 text-xl leading-none"
        aria-label="חודש קודם"
      >
        ‹
      </button>

      <div className="text-center">
        <div className="font-display font-semibold text-xl text-ink-900 leading-tight">
          {month.hebrewMonthName} {month.hebrewYearLetter}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToday}
          className="px-3 py-1.5 rounded-lg bg-royal-700 text-white text-sm font-medium hover:bg-royal-600 transition-colors"
        >
          היום
        </button>
        <button
          type="button"
          onClick={onNext}
          className="w-8 h-8 rounded-full hover:bg-parchment-200/60 transition-colors text-ink-700 text-xl leading-none"
          aria-label="חודש הבא"
        >
          ›
        </button>
      </div>
    </div>
  )
}
