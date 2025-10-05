import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'

import shaderUrl from '@/assets/landingImages/shader_bg.svg?url'
import { AdSlot } from '@/shared/ui/ad-slot'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

import {
  ETHIOPIAN_MONTHS,
  type EthiopicDate,
  formatEthiopianDate,
  formatGregorianDate,
  GEEZ_NUMERAL_TABLE,
  getCalendarMatrix,
  getDaysInEthiopianMonth,
  toEthiopian,
  toGeezNumeral,
  toGregorian,
  WEEKDAYS,
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
      description:
        'Marks the start of the Ethiopian year on Meskerem 1, often celebrated with fresh flowers and family gatherings.',
    })
  }
  if (date.month === 13 && date.day === 6) {
    items.push({
      title: 'Leap Day',
      description:
        'Pagume receives a 6th day during Ethiopian leap years, aligning the calendar with the solar cycle.',
    })
  }
  return items
}

// Minimal month holiday samples – extend with more entries as needed
function getMonthHolidays(year: number, month: number) {
  const items: Array<{ day: number; title: string }> = []
  if (month === 1) {
    items.push({ day: 1, title: 'Ethiopian New Year' })
    items.push({ day: 17, title: 'Meskel' })
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
      return {
        year: viewYear,
        month: viewMonth,
        day: Math.min(prev.day, getDaysInEthiopianMonth(viewYear, viewMonth)),
      }
    })
  }, [viewMonth, viewYear])

  const calendarCells = React.useMemo(
    () => getCalendarMatrix(viewYear, viewMonth),
    [viewYear, viewMonth],
  )
  const years = React.useMemo(() => createYearOptions(today.year), [today.year])

  const selectedGregorian = React.useMemo(() => toGregorian(selectedDate), [selectedDate])
  const observances = React.useMemo(() => getObservances(selectedDate), [selectedDate])
  const monthHolidays = React.useMemo(() => getMonthHolidays(viewYear, viewMonth), [viewYear, viewMonth])

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
    <section className="relative py-14 sm:py-20"
    style={{
      backgroundImage: `url("${shaderUrl}")`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: '100%'
    }}
    >
      <div className="teal-hero absolute inset-0" aria-hidden />
      <div className="teal-blob-left left-[-16rem] top-[-10rem] h-[24rem] w-[28rem] md:left-[-20rem] md:top-[-12rem]" aria-hidden />
      <div className="teal-blob-right right-[-12rem] top-[-2rem] h-[22rem] w-[30rem] md:right-[-16rem]" aria-hidden />
      <Container className="relative z-[1] flex flex-col gap-8">
        <header className="border-border/60 bg-white/60 supports-[backdrop-filter]:bg-transparent backdrop-blur-md rounded-2xl border px-5 py-6 shadow-sm sm:px-8 sm:py-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ethiopian Calendar</h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Check out the date, holidays and wengalat
              </p>
            </div>
            <div className="min-w-[220px]">
              <Select value={useGeezDigits ? 'geez' : 'arabic'} onValueChange={(v) => setUseGeezDigits(v === 'geez')}>
                <SelectTrigger className="bg-white/80 backdrop-blur-sm">
                  <SelectValue placeholder="Use Geeʼz Numbers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geez">Use Geeʼz Numbers</SelectItem>
                  <SelectItem value="arabic">Use Arabic Numbers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]">
          <div className="border-border/60 bg-white/60 supports-[backdrop-filter]:bg-white/40 backdrop-blur-lg text-card-foreground rounded-3xl border shadow-sm">
            <div className="flex flex-col gap-6 p-5 sm:p-8">
              {/* Month navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Previous month"
                  onClick={goToPreviousMonth}
                  leftIcon={<ChevronLeft className="h-4 w-4" />}
                >
                  <span className="sr-only">Previous</span>
                </Button>
                <div className="text-primary text-lg font-semibold">
                  {ETHIOPIAN_MONTHS[viewMonth - 1]?.amharic}
                  <span className="text-foreground/70 ml-2 align-middle text-base">
                    {useGeezDigits ? toGeezNumeral(viewYear) : viewYear}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Next month"
                  onClick={goToNextMonth}
                  rightIcon={<ChevronRight className="h-4 w-4" />}
                >
                  <span className="sr-only">Next</span>
                </Button>
              </div>
              <div className="bg-border/50 h-px w-full" />

              <div className="hidden items-center gap-3 sm:flex">
                <label
                  htmlFor="month-select"
                  className="text-muted-foreground text-xs font-medium tracking-[0.25em] uppercase"
                >
                  Month
                </label>
                <select
                  id="month-select"
                  value={viewMonth}
                  onChange={(event) => setViewMonth(Number(event.target.value))}
                  className="border-input bg-background focus:ring-ring rounded-md border px-4 py-2 text-sm shadow-sm focus:ring-2 focus:outline-none"
                >
                  {ETHIOPIAN_MONTHS.map((month) => (
                    <option key={month.number} value={month.number}>
                      {month.english} · {month.amharic}
                    </option>
                  ))}
                </select>

                  <label
                    htmlFor="year-select"
                    className="text-muted-foreground text-xs font-medium tracking-[0.25em] uppercase"
                  >
                    Year
                  </label>
                  <select
                  id="year-select"
                  value={viewYear}
                  onChange={(event) => setViewYear(Number(event.target.value))}
                  className="border-input bg-background focus:ring-ring rounded-md border px-4 py-2 text-sm shadow-sm focus:ring-2 focus:outline-none"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {useGeezDigits ? toGeezNumeral(year) : year}
                    </option>
                  ))}
                </select>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
              </div>

              <div className="space-y-3">
                <div className="text-muted-foreground grid grid-cols-7 gap-1 text-center text-xs font-medium tracking-[0.2em] uppercase">
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
                    const gregDate = new Date(
                      Date.UTC(gregorian.year, gregorian.month - 1, gregorian.day),
                    )
                    const gregDay = gregDate.getUTCDate()

                    return (
                      <button
                        key={`${date.year}-${date.month}-${date.day}`}
                        type="button"
                        onClick={() => setSelectedDate({ ...date })}
                        className={[
                          'focus-visible:ring-ring relative flex min-h-[72px] flex-col justify-between rounded-xl px-2 py-2 text-left text-sm transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                          isSelected
                            ? 'border-primary bg-primary text-primary-foreground shadow'
                            : isToday
                              ? 'border-border bg-muted/70'
                              : 'border-border bg-card/70 hover:bg-muted/80',
                          !isCurrentMonth && !isSelected ? 'text-muted-foreground' : '',
                        ].join(' ')}
                        aria-pressed={isSelected}
                      >
                        <span className="text-base leading-tight font-medium">{dayDisplay}</span>
                        <span
                          className={`text-[11px] font-medium ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}
                        >
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
            {/* Holidays glass card */}
            <div className="border-border/60 bg-transparent supports-[backdrop-filter]:bg-transparent backdrop-blur-lg rounded-2xl border p-6 shadow-sm">
              <h3 className="text-foreground text-base font-semibold tracking-tight">Holidays this month</h3>
              <div className="mt-4 space-y-3">
                {monthHolidays.length ? (
                  monthHolidays.map((h) => (
                    <div key={h.title} className="bg-muted text-foreground flex items-center gap-3 rounded-xl px-3 py-3">
                      <div className="bg-primary text-primary-foreground grid size-10 place-items-center rounded-lg font-bold">
                        {useGeezDigits ? toGeezNumeral(h.day) : h.day}
                      </div>
                      <span className="text-sm font-medium">{h.title}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No holidays this month</p>
                )}
              </div>
            </div>

            {/* Selected date glass card */}
            <div className="border-border/60 bg-white/60 supports-[backdrop-filter]:bg-white/40 backdrop-blur-lg rounded-2xl border p-6 shadow-sm">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.35em] uppercase">
                Selected date
              </p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
                {formatEthiopianDate(selectedDate, useGeezDigits)}
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {formatGregorianDate(selectedGregorian)}
              </p>
              <div className="text-muted-foreground mt-4 space-y-2 text-sm">
                {observances.length ? (
                  observances.map((item) => (
                    <div key={item.title} className="border-border bg-muted/60 rounded-lg border px-4 py-3">
                      <p className="text-foreground text-sm font-semibold">{item.title}</p>
                      <p className="text-muted-foreground mt-1 text-sm">{item.description}</p>
                    </div>
                  ))
                ) : (
                  <p>No major calendar highlights on this date.</p>
                )}
              </div>
            </div>
            <AdSlot orientation="vertical" className="min-h-[18rem] rounded-2xl bg-secondary supports-[backdrop-filter]:bg-secondary backdrop-blur-lg" preset="sponsored" />

          </aside>
        </div>

        <AdSlot orientation="horizontal" className="min-h-[12rem] rounded-2xl bg-secondary supports-[backdrop-filter]:bg-secondary backdrop-blur-lg " preset="sponsored" />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
          <section className="border-border/60 bg-white/60 supports-[backdrop-filter]:bg-white/40 backdrop-blur-lg rounded-2xl border shadow-sm">
            <div className="flex flex-col gap-6 p-6 sm:p-8">
              <header className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">Geeʼz Numbering System</h2>
                <p className="text-muted-foreground text-sm">
                  Amharic has its own traditional number system that is still used in some cultural
                  and liturgical contexts. It’s different from the “Arabic numerals” (0–9) that are
                  common worldwide.
                </p>
                <p className="text-muted-foreground text-sm">
                  Here are the basic Amharic numerals (፩–፼):
                </p>
              </header>

              {/* small hint line */}
              <div className="text-primary/80 -mt-2 text-right text-sm italic">
                tap the Amharic name to hear pronunciation ↘︎
              </div>

              {/* data table with separated rows */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-separate [border-spacing:0_10px]">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      <th className="bg-secondary/60 px-4 py-3 first:rounded-l-lg last:rounded-r-lg">Number</th>
                      <th className="bg-secondary/60 px-4 py-3">Symbol</th>
                      <th className="bg-secondary/60 px-4 py-3 first:rounded-l-lg last:rounded-r-lg">Amharic Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GEEZ_NUMERAL_TABLE.map((row) => (
                      <tr key={row.value}>
                        <td className="bg-secondary/30 px-4 py-3 first:rounded-l-lg last:rounded-r-lg text-foreground/90">
                          {row.value.toLocaleString('en-US')}
                        </td>
                        <td className="bg-secondary/30 px-4 py-3 text-lg font-semibold text-foreground">
                          {row.symbol}
                        </td>
                        <td className="bg-secondary/30 px-4 py-3 first:rounded-l-lg last:rounded-r-lg">
                          <button
                            type="button"
                            className="hover:text-primary focus:text-primary focus:outline-none"
                            onClick={() => {
                              const am = row.name.split('(')[0].trim()
                              try {
                                const u = new SpeechSynthesisUtterance(am)
                                u.lang = 'am-ET'
                                window.speechSynthesis?.speak(u)
                              } catch (_) {
                                // no-op if speech synthesis not available
                              }
                            }}
                            aria-label={`Pronounce ${row.name}`}
                          >
                            <span className="font-medium text-foreground">{row.name}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* examples */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold tracking-tight">Example Numbers</h3>
                <ul className="list-disc pl-6 text-sm text-foreground/80">
                  {[2025, 187, 50000].map((value) => (
                    <li key={value} className="">
                      {value.toLocaleString('en-US')} →
                      <span className="ml-1 font-semibold"> {toGeezNumeral(value)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-6">
          
            <div className="border-border/60 bg-white/60 supports-[backdrop-filter]:bg-white/40 backdrop-blur-lg rounded-2xl border p-6 text-sm text-muted-foreground shadow-sm">
              <h3 className="text-foreground text-base font-semibold tracking-tight">
                Reading tips
              </h3>
              <p className="mt-2">
                Combine Geeʼz numerals from largest value to smallest. ፳፻፲፫ = 2013 EC: ፳ (20) × ፻
                (100) gives 2000, then ፲፫ adds 13.
              </p>
              <p className="mt-2">
                Pagume includes only five days—six on leap years—so it is perfect for highlighting
                seasonal content before the Ethiopian New Year.
              </p>
            </div>
            <AdSlot orientation="vertical" className="w-full min-h-[18rem] rounded-2xl bg-secondary supports-[backdrop-filter]:bg-secondary backdrop-blur-lg" preset="sponsored" />

          </aside>
        </div>
      </Container>
    </section>
  )
}

export default CalendarPage
