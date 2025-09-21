import * as React from 'react'
import { Button } from '@/shared/ui/button'
import { AdSlot } from '@/shared/ui/ad-slot'
import {
  ETHIOPIAN_MONTHS,
  GEEZ_NUMERAL_TABLE,
  WEEKDAYS,
  formatEthiopianDate,
  formatGregorianDate,
  getCalendarMatrix,
  getDaysInEthiopianMonth,
  toEthiopian,
  toGeezNumeral,
  toGregorian,
  type EthiopicDate,
} from '../lib/calendar-utils'

const yearOptionsRange = 6

function useTodayEthiopianDate() {
  return React.useMemo(() => toEthiopian(new Date()), [])
}

function createYearOptions(currentYear: number) {
  const years: number[] = []
  for (let offset = -2; offset <= yearOptionsRange; offset += 1) {
    years.push(currentYear + offset)
  }
  return years
}

function getObservances(date: EthiopicDate) {
  const items: Array<{ title: string; description: string }> = []
  if (date.month === 1 && date.day === 1) {
    items.push({
      title: 'Ethiopian New Year (Enkutatash)',
      description: 'Marks the start of the Ethiopian year on Meskerem 1, often celebrated with fresh flowers and family gatherings.',
    })
  }
  if (date.month === 13 && date.day === 6) {
    items.push({
      title: 'Leap Day',
      description: 'Pagume receives a 6th day during Ethiopian leap years, aligning the calendar with the solar cycle.',
    })
  }
  return items
}

function isSameDate(a: EthiopicDate, b: EthiopicDate) {
  return a.year === b.year && a.month === b.month && a.day === b.day
}

function clampDayWithinMonth(date: EthiopicDate): EthiopicDate {
  const maxDay = getDaysInEthiopianMonth(date.year, date.month)
  if (date.day <= maxDay) return date
  return { ...date, day: maxDay }
}

export function CalendarPage() {
  const today = useTodayEthiopianDate()
  const [viewYear, setViewYear] = React.useState(today.year)
  const [viewMonth, setViewMonth] = React.useState(today.month)
  const [selectedDate, setSelectedDate] = React.useState<EthiopicDate>(today)
  const [useGeezDigits, setUseGeezDigits] = React.useState(true)

  React.useEffect(() => {
    setSelectedDate((prev) => {
      if (prev.year === viewYear && prev.month === viewMonth) {
        return clampDayWithinMonth(prev)
      }
      return { year: viewYear, month: viewMonth, day: Math.min(prev.day, getDaysInEthiopianMonth(viewYear, viewMonth)) }
    })
  }, [viewMonth, viewYear])

  const calendarCells = React.useMemo(() => getCalendarMatrix(viewYear, viewMonth), [viewYear, viewMonth])
  const years = React.useMemo(() => createYearOptions(today.year), [today.year])

  const selectedGregorian = React.useMemo(() => toGregorian(selectedDate), [selectedDate])
  const observances = React.useMemo(() => getObservances(selectedDate), [selectedDate])

  function goToToday() {
    setViewYear(today.year)
    setViewMonth(today.month)
    setSelectedDate(today)
    setUseGeezDigits(true)
  }

  function goToPreviousMonth() {
    setViewMonth((current) => {
      if (current === 1) {
        setViewYear((year) => year - 1)
        return 13
      }
      return current - 1
    })
  }

  function goToNextMonth() {
    setViewMonth((current) => {
      if (current === 13) {
        setViewYear((year) => year + 1)
        return 1
      }
      return current + 1
    })
  }

  return (
    <section className="bg-neutral-50 py-14 sm:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-400">Planner</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ethiopian Calendar</h1>
          <p className="max-w-2xl text-sm text-neutral-600 sm:text-base">
            Explore every Ethiopian month, keep track of leap years, and quickly swap between Geez numerals and familiar Arabic digits.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]">
          <div className="border border-neutral-200 bg-white shadow-sm">
            <div className="flex flex-col gap-6 p-5 sm:p-8">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold tracking-tight">{ETHIOPIAN_MONTHS[viewMonth - 1]?.english} {viewYear}</h2>
                  <p className="text-sm text-neutral-500">
                    Switch months, jump back to today, or display dates using the ancient Geez numeral system.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 ">
                  <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToNextMonth}>
                    Next
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">Month</label>
                  <select
                    value={viewMonth}
                    onChange={(event) => setViewMonth(Number(event.target.value))}
                    className=" border border-neutral-200 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  >
                    {ETHIOPIAN_MONTHS.map((month) => (
                      <option key={month.number} value={month.number} >
                        {month.english} · {month.amharic}
                      </option>
                    ))}
                  </select>

                  <label className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">Year</label>
                  <select
                    value={viewYear}
                    onChange={(event) => setViewYear(Number(event.target.value))}
                    className=" border border-neutral-200 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {useGeezDigits ? toGeezNumeral(year) : year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs font-medium">
                  <span className="px-3 py-1 text-neutral-500">Digits</span>
                  <button
                    type="button"
                    onClick={() => setUseGeezDigits(true)}
                    className={` px-3 py-1 transition ${useGeezDigits ? 'bg-neutral-900 rounded-full text-white shadow-sm' : 'text-neutral-600 hover:text-neutral-900'}`}
                  >
                    Geez ፩፪፫
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseGeezDigits(false)}
                    className={`px-3 py-1 transition ${!useGeezDigits ? 'bg-neutral-900 rounded-full text-white shadow-sm' : 'text-neutral-600 hover:text-neutral-900'}`}
                  >
                    Arabic 1 2 3
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
                  {WEEKDAYS.map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {calendarCells.map(({ date, gregorian, isCurrentMonth }) => {
                    const isToday = isSameDate(date, today)
                    const isSelected = isSameDate(date, selectedDate)
                    const showGeez = useGeezDigits && date.day > 0
                    const dayDisplay = showGeez ? toGeezNumeral(date.day) : String(date.day)
                    const gregDate = new Date(Date.UTC(gregorian.year, gregorian.month - 1, gregorian.day))
                    const gregDay = gregDate.getUTCDate()

                    return (
                      <button
                        key={`${date.year}-${date.month}-${date.day}`}
                        type="button"
                    onClick={() => setSelectedDate({ ...date })}
                        className={[
                          'relative flex min-h-[72px] flex-col justify-between  px-2 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2',
                          isSelected
                            ? 'border-neutral-900 bg-neutral-900 text-white shadow '
                            : isToday
                              ? 'border-neutral-900/60 bg-neutral-50'
                              : 'border-neutral-200 bg-white hover:bg-neutral-50',
                          !isCurrentMonth && !isSelected ? 'text-neutral-300' : '',
                        ].join(' ')}
                        aria-pressed={isSelected}
                      >
                        <span className="text-base font-medium leading-tight">
                          {dayDisplay}
                        </span>
                        <span className={`text-[11px] font-medium ${isSelected ? 'text-white/80' : 'text-neutral-400'}`}>
                          {gregDay}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <AdSlot orientation="vertical" className="min-h-[18rem]" preset="sponsored" />

            <div className=" border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-400">Selected date</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-neutral-900">
                {formatEthiopianDate(selectedDate, useGeezDigits)}
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                {formatGregorianDate(selectedGregorian)}
              </p>
              <div className="mt-4 space-y-2 text-sm text-neutral-600">
                {observances.length ? (
                  observances.map((item) => (
                    <div key={item.title} className=" border border-neutral-200 bg-neutral-50 px-4 py-3">
                      <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
                      <p className="mt-1 text-sm text-neutral-600">{item.description}</p>
                    </div>
                  ))
                ) : (
                  <p>No major calendar highlights on this date.</p>
                )}
              </div>
            </div>
          </aside>
        </div>

        <AdSlot orientation="horizontal" className="min-h-[12rem]" preset="sponsored" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
          <section className=" border border-neutral-200 bg-white shadow-sm">
            <div className="flex flex-col gap-6 p-6 sm:p-8">
              <header className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">Geeʼz Numbering System</h2>
                <p className="text-sm text-neutral-600">
                  Geeʼz numerals were introduced in the 4th century CE and remain in daily use across Ethiopian Orthodox texts and calendars. Each
                  glyph represents a whole number, with digits combined from 1 to 10, 100, and 10,000 to build larger values.
                </p>
              </header>

              <div className="overflow-hidden  border border-neutral-200">
                <table className="min-w-full divide-y divide-neutral-200 text-sm">
                  <thead className="bg-neutral-50 text-left text-xs uppercase tracking-[0.25em] text-neutral-500">
                    <tr>
                      <th className="px-4 py-3">Number</th>
                      <th className="px-4 py-3">Symbol</th>
                      <th className="px-4 py-3">Amharic name</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 bg-white">
                    {GEEZ_NUMERAL_TABLE.map((row) => (
                      <tr key={row.value}>
                        <td className="px-4 py-3 text-neutral-700">{row.value.toLocaleString('en-US')}</td>
                        <td className="px-4 py-3 text-lg font-semibold text-neutral-900">{row.symbol}</td>
                        <td className="px-4 py-3 text-neutral-600">{row.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold tracking-tight">Example Numbers</h3>
                <ul className="grid gap-2 text-sm text-neutral-600 sm:grid-cols-2">
                  {[29, 123, 2017, 10000].map((value) => (
                    <li key={value} className="flex items-center justify-between  border border-neutral-200 bg-neutral-50 px-4 py-3">
                      <span className="font-semibold text-neutral-900">{toGeezNumeral(value)}</span>
                      <span>= {value.toLocaleString('en-US')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-6">
            <AdSlot orientation="vertical" className="min-h-[18rem]" preset="sponsored" />
            <div className=" border border-neutral-200 bg-white p-6 shadow-sm text-sm text-neutral-600">
              <h3 className="text-base font-semibold tracking-tight text-neutral-900">Reading tips</h3>
              <p className="mt-2">
                Combine Geeʼz numerals from largest value to smallest. ፳፻፲፫ = 2013 EC: ፳ (20) × ፻ (100) gives 2000, then ፲፫ adds 13.
              </p>
              <p className="mt-2">
                Pagume includes only five days—six on leap years—so it is perfect for highlighting seasonal content before the Ethiopian New Year.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default CalendarPage
