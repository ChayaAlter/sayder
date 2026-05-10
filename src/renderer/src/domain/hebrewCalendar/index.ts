import { HDate, HebrewCalendar, Locale, flags, months } from '@hebcal/core'

// Hebrew locale is applied per-call by passing { locale: 'he' } to
// HebrewCalendar.calendar() and Locale.gettext(id, 'he').

export type EventCategory =
  | 'rosh-chodesh'
  | 'yom-tov'
  | 'chol-hamoed'
  | 'fast-major'
  | 'fast-minor'
  | 'minor-holiday'
  | 'modern'
  | 'parsha'
  | 'special-shabbat'
  | 'other'

export interface CalendarEvent {
  name: string
  category: EventCategory
}

export interface CalendarDay {
  hdate: HDate
  gregorianDate: Date
  hebrewDayLetter: string
  hebrewDayNumber: number
  gregorianDay: number
  gregorianMonthShort: string
  dayOfWeek: number
  isToday: boolean
  isShabbat: boolean
  isErevShabbat: boolean
  events: CalendarEvent[]
  parsha?: string
}

export interface HebrewMonth {
  hebrewYear: number
  hebrewMonth: number
  hebrewMonthName: string
  hebrewYearLetter: string
  isLeapYear: boolean
  daysInMonth: number
  days: CalendarDay[]
  weeks: (CalendarDay | null)[][]
}

const HEBREW_MONTH_ORDER_REGULAR: number[] = [
  months.TISHREI,
  months.CHESHVAN,
  months.KISLEV,
  months.TEVET,
  months.SHVAT,
  months.ADAR_I,
  months.NISAN,
  months.IYYAR,
  months.SIVAN,
  months.TAMUZ,
  months.AV,
  months.ELUL
]

const HEBREW_MONTH_ORDER_LEAP: number[] = [
  months.TISHREI,
  months.CHESHVAN,
  months.KISLEV,
  months.TEVET,
  months.SHVAT,
  months.ADAR_I,
  months.ADAR_II,
  months.NISAN,
  months.IYYAR,
  months.SIVAN,
  months.TAMUZ,
  months.AV,
  months.ELUL
]

const GREGORIAN_MONTH_SHORT_HE = [
  'ינו',
  'פבר',
  'מרץ',
  'אפר',
  'מאי',
  'יונ',
  'יול',
  'אוג',
  'ספט',
  'אוק',
  'נוב',
  'דצמ'
]

function isSameGregorianDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function categorizeEvent(mask: number): EventCategory {
  if (mask & flags.PARSHA_HASHAVUA) return 'parsha'
  if (mask & flags.MAJOR_FAST) return 'fast-major'
  if (mask & flags.MINOR_FAST) return 'fast-minor'
  if (mask & flags.ROSH_CHODESH) return 'rosh-chodesh'
  if (mask & flags.CHOL_HAMOED) return 'chol-hamoed'
  if (mask & flags.SPECIAL_SHABBAT) return 'special-shabbat'
  if (mask & flags.CHAG) return 'yom-tov'
  if (mask & flags.MINOR_HOLIDAY) return 'minor-holiday'
  if (mask & flags.MODERN_HOLIDAY) return 'modern'
  return 'other'
}

export function getTodayHDate(): HDate {
  return new HDate(new Date())
}

export function getMonthName(hebrewYear: number, hebrewMonth: number): string {
  return HDate.getMonthName(hebrewMonth, hebrewYear)
}

export function getMonthNameHebrew(hebrewYear: number, hebrewMonth: number): string {
  const englishName = HDate.getMonthName(hebrewMonth, hebrewYear)
  // hebcal exposes Hebrew translations via Locale.gettext
  return Locale.gettext(englishName, 'he')
}

export function formatHebrewYear(hebrewYear: number): string {
  // Render the year using Hebrew letters with apostrophe + double-quote convention.
  // hebcal's gematriya() returns plain letters; we add the standard punctuation ourselves
  // for the typical "תשפ"ז" presentation.
  // For simplicity we delegate to HDate.renderGematriya() of a known date in the year.
  const sample = new HDate(1, months.TISHREI, hebrewYear)
  // sample renders like: "א' תשרי תשפ"ז" – take last segment.
  const rendered = sample.renderGematriya(true)
  const parts = rendered.split(' ')
  return parts[parts.length - 1] ?? String(hebrewYear)
}

export function formatHebrewDayLetter(hdate: HDate): string {
  // renderGematriya returns the full date "כ"ז כסלו תשפ"ז". We only want the day part.
  const rendered = hdate.renderGematriya(true)
  return rendered.split(' ')[0] ?? String(hdate.getDate())
}

export function formatHebrewDate(hdate: HDate): string {
  return hdate.renderGematriya(true)
}

export function formatHebrewDateWithDayOfWeek(hdate: HDate): string {
  const dayNames = [
    'יום ראשון',
    'יום שני',
    'יום שלישי',
    'יום רביעי',
    'יום חמישי',
    'יום שישי',
    'שבת'
  ]
  const dayName = dayNames[hdate.getDay()] ?? ''
  return `${dayName}, ${hdate.renderGematriya(true)}`
}

export function isHebrewLeapYear(hebrewYear: number): boolean {
  return HDate.isLeapYear(hebrewYear)
}

export function daysInHebrewMonth(hebrewYear: number, hebrewMonth: number): number {
  return HDate.daysInMonth(hebrewMonth, hebrewYear)
}

export function nextMonth(
  hebrewYear: number,
  hebrewMonth: number
): { year: number; month: number } {
  const order = isHebrewLeapYear(hebrewYear)
    ? HEBREW_MONTH_ORDER_LEAP
    : HEBREW_MONTH_ORDER_REGULAR
  const currentIndex = order.indexOf(hebrewMonth)
  if (currentIndex < 0) {
    // unknown month – defensively fall back to next Hebrew month numerically
    return { year: hebrewYear, month: hebrewMonth + 1 }
  }
  if (currentIndex === order.length - 1) {
    // wrapping past Elul → Tishrei of next year
    return { year: hebrewYear + 1, month: months.TISHREI }
  }
  return { year: hebrewYear, month: order[currentIndex + 1] }
}

export function previousMonth(
  hebrewYear: number,
  hebrewMonth: number
): { year: number; month: number } {
  const order = isHebrewLeapYear(hebrewYear)
    ? HEBREW_MONTH_ORDER_LEAP
    : HEBREW_MONTH_ORDER_REGULAR
  const currentIndex = order.indexOf(hebrewMonth)
  if (currentIndex < 0) {
    return { year: hebrewYear, month: hebrewMonth - 1 }
  }
  if (currentIndex === 0) {
    // wrapping back to Elul of previous year
    return { year: hebrewYear - 1, month: months.ELUL }
  }
  return { year: hebrewYear, month: order[currentIndex - 1] }
}

export function getMonth(hebrewYear: number, hebrewMonth: number): HebrewMonth {
  const today = new Date()
  const daysCount = daysInHebrewMonth(hebrewYear, hebrewMonth)
  const firstHDate = new HDate(1, hebrewMonth, hebrewYear)
  const lastHDate = new HDate(daysCount, hebrewMonth, hebrewYear)

  // Bulk-fetch all events for the month (holidays + parsha).
  const events = HebrewCalendar.calendar({
    start: firstHDate,
    end: lastHDate,
    sedrot: true,
    noHolidays: false,
    candlelighting: false,
    locale: 'he'
  })

  const eventsByDay = new Map<number, CalendarEvent[]>()
  for (const ev of events) {
    const day = ev.getDate().getDate()
    const list = eventsByDay.get(day) ?? []
    list.push({
      name: ev.render('he'),
      category: categorizeEvent(ev.getFlags())
    })
    eventsByDay.set(day, list)
  }

  const days: CalendarDay[] = []
  for (let d = 1; d <= daysCount; d++) {
    const hdate = new HDate(d, hebrewMonth, hebrewYear)
    const greg = hdate.greg()
    const dayEvents = eventsByDay.get(d) ?? []
    const parshaEvent = dayEvents.find((e) => e.category === 'parsha')

    days.push({
      hdate,
      gregorianDate: greg,
      hebrewDayLetter: formatHebrewDayLetter(hdate),
      hebrewDayNumber: d,
      gregorianDay: greg.getDate(),
      gregorianMonthShort: GREGORIAN_MONTH_SHORT_HE[greg.getMonth()] ?? '',
      dayOfWeek: hdate.getDay(),
      isToday: isSameGregorianDate(greg, today),
      isShabbat: hdate.getDay() === 6,
      isErevShabbat: hdate.getDay() === 5,
      events: dayEvents.filter((e) => e.category !== 'parsha'),
      parsha: parshaEvent?.name
    })
  }

  // Build week rows. Each row has 7 cells indexed by day-of-week 0..6 where
  // 0 = Sunday (יום ראשון) and 6 = Shabbat.
  const weeks: (CalendarDay | null)[][] = []
  let currentWeek: (CalendarDay | null)[] = new Array(7).fill(null)
  const firstDayOfWeek = days[0]!.dayOfWeek
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek[i] = null
  }
  for (const day of days) {
    currentWeek[day.dayOfWeek] = day
    if (day.dayOfWeek === 6) {
      weeks.push(currentWeek)
      currentWeek = new Array(7).fill(null)
    }
  }
  if (currentWeek.some((c) => c !== null)) {
    weeks.push(currentWeek)
  }

  return {
    hebrewYear,
    hebrewMonth,
    hebrewMonthName: getMonthNameHebrew(hebrewYear, hebrewMonth),
    hebrewYearLetter: formatHebrewYear(hebrewYear),
    isLeapYear: isHebrewLeapYear(hebrewYear),
    daysInMonth: daysCount,
    days,
    weeks
  }
}

export function getNextShabbatParsha(fromHDate: HDate): string | undefined {
  const startGreg = fromHDate.greg()
  const endGreg = new Date(startGreg)
  endGreg.setDate(endGreg.getDate() + 8)
  const events = HebrewCalendar.calendar({
    start: fromHDate,
    end: new HDate(endGreg),
    sedrot: true,
    noHolidays: true,
    locale: 'he'
  })
  const parsha = events.find((e) => e.getFlags() & flags.PARSHA_HASHAVUA)
  return parsha?.render('he')
}
