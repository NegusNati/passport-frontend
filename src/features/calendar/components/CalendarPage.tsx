import { ChevronLeft, ChevronRight } from 'lucide-react'
import { addDays, ethiopicToJdn, today as getToday, weekdayFromJdn } from 'negus-ethiopic-gregorian'
import type { Highlight } from 'negus-ethiopic-gregorian/highlights'
import { getHighlightsForDay, getHighlightsForMonth } from 'negus-ethiopic-gregorian/highlights'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

import ethiopic_numbers_pattern from '@/assets/landingImages/ethiopiac_num_pattern.svg'
import ethiopic_numbers from '@/assets/landingImages/number.webp'
import { AdSlot } from '@/shared/ui/ad-slot'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Seo } from '@/shared/ui/Seo'

import {
  ETHIOPIAN_MONTHS,
  type EthiopicDate,
  formatEthiopianDate,
  formatGregorianDate,
  GEEZ_NUMERAL_TABLE,
  getCalendarMatrix,
  getDaysInEthiopianMonth,
  toGeezNumeral,
  toGregorian,
  WEEKDAYS,
} from '../lib/calendar-utils'

const YEAR_WINDOW = 60

function useTodayEthiopianDate(): EthiopicDate {
  return React.useMemo(() => getToday('ethiopic') as EthiopicDate, [])
}

function createYearOptions(centerYear: number) {
  const start = Math.max(1, centerYear - YEAR_WINDOW)
  const end = centerYear + YEAR_WINDOW
  const years: number[] = []
  for (let year = start; year <= end; year += 1) {
    years.push(year)
  }
  return years
}

function isSameDate(a: EthiopicDate, b: EthiopicDate) {
  return a.year === b.year && a.month === b.month && a.day === b.day
}

function clampDayWithinMonth(date: EthiopicDate): EthiopicDate {
  const maxDay = getDaysInEthiopianMonth(date.year, date.month)
  if (date.day <= maxDay) return date
  return { ...date, day: maxDay }
}

function formatHighlightCategory(category?: Highlight['category']) {
  if (!category) return ''
  return `${category.charAt(0).toUpperCase()}${category.slice(1)}`
}

function formatHighlightTag(tag: string) {
  return tag
    .split('-')
    .map((segment) => `${segment.charAt(0).toUpperCase()}${segment.slice(1)}`)
    .join(' ')
}

type CalendarCell = {
  date: EthiopicDate
  gregorian: ReturnType<typeof toGregorian>
  isCurrentMonth: boolean
}

function createDateKey(date: EthiopicDate) {
  return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`
}

function stripEra(date: EthiopicDate): EthiopicDate {
  return { year: date.year, month: date.month, day: date.day }
}

function buildWeekCells(
  anchorDate: EthiopicDate,
  contextYear: number,
  contextMonth: number,
): { startDate: EthiopicDate; endDate: EthiopicDate; cells: CalendarCell[] } {
  const anchorJdn = ethiopicToJdn(anchorDate.year, anchorDate.month, anchorDate.day)
  const anchorWeekday = (weekdayFromJdn(anchorJdn) + 6) % 7
  const weekStartRaw = addDays(anchorDate, -anchorWeekday, 'ethiopic')
  const weekStart = stripEra(weekStartRaw)

  const cells: CalendarCell[] = []
  for (let offset = 0; offset < 7; offset += 1) {
    const next = addDays(weekStart, offset, 'ethiopic')
    const normalized = stripEra(next)
    cells.push({
      date: normalized,
      gregorian: toGregorian(normalized),
      isCurrentMonth: normalized.year === contextYear && normalized.month === contextMonth,
    })
  }

  const weekEnd = cells[cells.length - 1]?.date ?? weekStart

  return {
    startDate: weekStart,
    endDate: weekEnd,
    cells,
  }
}

function formatWeekRange(cells: CalendarCell[], useGeezDigits: boolean) {
  if (!cells.length) return ''
  const first = cells[0].date
  const last = cells[cells.length - 1].date
  const firstMonthName = ETHIOPIAN_MONTHS[first.month - 1]?.amharic ?? ''
  const lastMonthName = ETHIOPIAN_MONTHS[last.month - 1]?.amharic ?? ''
  const firstDay = useGeezDigits ? toGeezNumeral(first.day) : first.day
  const lastDay = useGeezDigits ? toGeezNumeral(last.day) : last.day
  const firstYear = useGeezDigits ? toGeezNumeral(first.year) : first.year
  const lastYear = useGeezDigits ? toGeezNumeral(last.year) : last.year

  const sameMonth = first.month === last.month && first.year === last.year
  const sameYear = first.year === last.year

  if (sameMonth) {
    return `${firstMonthName} ${firstDay} – ${lastDay}, ${firstYear}`
  }

  if (sameYear) {
    return `${firstMonthName} ${firstDay} – ${lastMonthName} ${lastDay}, ${firstYear}`
  }

  return `${firstMonthName} ${firstDay}, ${firstYear} – ${lastMonthName} ${lastDay}, ${lastYear}`
}

export function CalendarPage() {
  const { t } = useTranslation('calendar')
  const today = useTodayEthiopianDate()
  const [viewYear, setViewYear] = React.useState(today.year)
  const [viewMonth, setViewMonth] = React.useState(today.month)
  const [selectedDate, setSelectedDate] = React.useState<EthiopicDate>(today)
  const [useGeezDigits, setUseGeezDigits] = React.useState(true)
  const [viewMode, setViewMode] = React.useState<'month' | 'week'>('month')
  const [shouldFlashCard, setShouldFlashCard] = React.useState(false)
  const selectedCardRef = React.useRef<HTMLDivElement | null>(null)
  const flashTimeoutRef = React.useRef<number | null>(null)

  const focusSelectedCard = React.useCallback(() => {
    if (typeof window === 'undefined') return
    if (flashTimeoutRef.current) {
      window.clearTimeout(flashTimeoutRef.current)
    }
    setShouldFlashCard(true)
    selectedCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    selectedCardRef.current?.focus({ preventScroll: true })
    flashTimeoutRef.current = window.setTimeout(() => {
      setShouldFlashCard(false)
      flashTimeoutRef.current = null
    }, 1200)
  }, [])

  React.useEffect(
    () => () => {
      if (typeof window === 'undefined') return
      if (flashTimeoutRef.current) {
        window.clearTimeout(flashTimeoutRef.current)
      }
    },
    [],
  )

  const handleSelectDate = React.useCallback(
    (nextDate: EthiopicDate) => {
      const sanitized = stripEra(nextDate)
      setSelectedDate(sanitized)
      focusSelectedCard()
    },
    [focusSelectedCard],
  )

  React.useEffect(() => {
    if (viewMode !== 'month') return
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
  }, [viewMonth, viewYear, viewMode])

  React.useEffect(() => {
    if (viewMode !== 'week') return
    setViewYear(selectedDate.year)
    setViewMonth(selectedDate.month)
  }, [viewMode, selectedDate.year, selectedDate.month])

  function handleViewModeChange(mode: 'month' | 'week') {
    if (mode === viewMode) return
    setViewMode(mode)
    if (mode === 'week') {
      setViewYear(selectedDate.year)
      setViewMonth(selectedDate.month)
    }
    focusSelectedCard()
  }

  const monthCells = React.useMemo(
    () => getCalendarMatrix(viewYear, viewMonth),
    [viewYear, viewMonth],
  )
  const years = React.useMemo(() => createYearOptions(viewYear), [viewYear])

  const selectedGregorian = React.useMemo(() => toGregorian(selectedDate), [selectedDate])
  const selectedHighlights = React.useMemo(
    () => getHighlightsForDay(selectedDate, 'ethiopic'),
    [selectedDate],
  )
  const monthHighlights = React.useMemo(() => {
    const highlights = getHighlightsForMonth(viewYear, viewMonth, 'ethiopic').filter(
      (highlight) => highlight.calendar === 'ethiopic',
    )
    return highlights.sort((a, b) => a.day - b.day)
  }, [viewYear, viewMonth])
  const monthHighlightLookup = React.useMemo(() => {
    const lookup = new Map<string, Highlight[]>()
    monthHighlights.forEach((highlight) => {
      const key = createDateKey({ year: viewYear, month: highlight.month, day: highlight.day })
      const list = lookup.get(key) ?? []
      list.push(highlight)
      lookup.set(key, list)
    })
    return lookup
  }, [monthHighlights, viewYear])
  const weekView = React.useMemo(() => {
    if (viewMode !== 'week') return null
    return buildWeekCells(selectedDate, viewYear, viewMonth)
  }, [viewMode, selectedDate, viewYear, viewMonth])
  const visibleCells = viewMode === 'month' ? monthCells : (weekView?.cells ?? monthCells)
  const visibleHighlightLookup = React.useMemo(() => {
    if (viewMode === 'week' && weekView) {
      const lookup = new Map<string, Highlight[]>()
      weekView.cells.forEach(({ date }) => {
        const key = createDateKey(date)
        const items = getHighlightsForDay(date, 'ethiopic')
        if (items.length) {
          lookup.set(key, items)
        }
      })
      return lookup
    }
    return monthHighlightLookup
  }, [viewMode, weekView, monthHighlightLookup])
  const weekHighlights = React.useMemo(() => {
    if (viewMode !== 'week' || !weekView)
      return [] as Array<{ highlight: Highlight; date: EthiopicDate }>
    const entries: Array<{ highlight: Highlight; date: EthiopicDate }> = []
    const seen = new Set<string>()
    weekView.cells.forEach(({ date }) => {
      const items = getHighlightsForDay(date, 'ethiopic')
      items.forEach((item) => {
        const key = `${item.id}-${createDateKey(date)}`
        if (seen.has(key)) return
        seen.add(key)
        entries.push({ highlight: item, date })
      })
    })
    entries.sort(
      (a, b) =>
        ethiopicToJdn(a.date.year, a.date.month, a.date.day) -
        ethiopicToJdn(b.date.year, b.date.month, b.date.day),
    )
    return entries
  }, [viewMode, weekView])
  const selectedWeekday = React.useMemo(() => {
    const index =
      (weekdayFromJdn(ethiopicToJdn(selectedDate.year, selectedDate.month, selectedDate.day)) + 6) %
      7
    return WEEKDAYS[index]
  }, [selectedDate])
  const weekRangeLabel = React.useMemo(() => {
    if (viewMode !== 'week' || !weekView) return ''
    return formatWeekRange(weekView.cells, useGeezDigits)
  }, [viewMode, weekView, useGeezDigits])

  function goToToday() {
    setViewYear(today.year)
    setViewMonth(today.month)
    handleSelectDate(today)
    setUseGeezDigits(true)
  }

  function goToPreviousMonth() {
    if (viewMode === 'week') {
      const previous = stripEra(addDays(selectedDate, -7, 'ethiopic'))
      setViewYear(previous.year)
      setViewMonth(previous.month)
      handleSelectDate(previous)
      return
    }

    setViewMonth((current) => {
      if (current === 1) {
        setViewYear((year) => year - 1)
        return 13
      }
      return current - 1
    })
  }

  function goToNextMonth() {
    if (viewMode === 'week') {
      const next = stripEra(addDays(selectedDate, 7, 'ethiopic'))
      setViewYear(next.year)
      setViewMonth(next.month)
      handleSelectDate(next)
      return
    }

    setViewMonth((current) => {
      if (current === 13) {
        setViewYear((year) => year + 1)
        return 1
      }
      return current + 1
    })
  }

  return (
    <section className="relative py-14 sm:py-20">
      <Seo title={t('seo.title')} description={t('seo.description')} path="/calendar" />
      <div className="absolute bottom-[240rem] left-0 z-0 ml-2 translate-y-1/4 transform opacity-60 md:hidden md:opacity-90">
        <img
          src={ethiopic_numbers_pattern}
          alt="logo"
          className="h-150 w-150"
          width="600"
          height="600"
        />
      </div>
      <div className="absolute bottom-[160rem] left-0 z-0 ml-2 translate-y-1/4 transform opacity-60 md:opacity-90">
        <img
          src={ethiopic_numbers_pattern}
          alt="logo"
          className="h-150 w-150"
          width="600"
          height="600"
        />
      </div>
      <div className="absolute bottom-[60rem] left-0 z-0 ml-2 translate-y-1/4 transform opacity-60 md:opacity-90">
        <img src={ethiopic_numbers} alt="logo" className="h-150 w-150" width="600" height="600" />
      </div>
      <div className="absolute inset-0" aria-hidden />
      <div
        className="teal-blob-left top-[-10rem] left-[-16rem] h-[24rem] w-[28rem] md:top-[-12rem] md:left-[-20rem]"
        aria-hidden
      />
      <div
        className="teal-blob-right top-[-2rem] right-[-12rem] h-[22rem] w-[30rem] md:right-[-16rem]"
        aria-hidden
      />
      <Container className="relative z-[1] flex flex-col gap-8">
        <header className="border-border/60 rounded-2xl border bg-white/60 px-5 py-6 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-transparent sm:px-8 sm:py-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {t('header.title')}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                {t('header.description')}
              </p>
            </div>
            <div className="min-w-[220px]">
              <Select
                value={useGeezDigits ? 'geez' : 'arabic'}
                onValueChange={(v) => setUseGeezDigits(v === 'geez')}
              >
                <SelectTrigger className="bg-muted/80 backdrop-blur-sm">
                  <SelectValue placeholder={t('digits.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geez">{t('digits.geez')}</SelectItem>
                  <SelectItem value="arabic">{t('digits.arabic')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]">
          <div className="border-border/60 rounded-2xl border bg-transparent p-6 shadow-sm backdrop-blur-lg supports-[backdrop-filter]:bg-transparent">
            <div className="flex flex-col gap-6 p-5 sm:p-8">
              {/* Month navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={t('navigation.previousMonth')}
                  onClick={goToPreviousMonth}
                  leftIcon={<ChevronLeft className="h-4 w-4" />}
                >
                  <span className="sr-only">{t('navigation.previous')}</span>
                </Button>
                <div
                  className={
                    viewMode === 'month'
                      ? 'text-primary text-lg font-semibold'
                      : 'text-foreground text-base font-semibold'
                  }
                >
                  {viewMode === 'month' ? (
                    <>
                      {ETHIOPIAN_MONTHS[viewMonth - 1]?.amharic}
                      <span className="text-foreground/70 ml-2 align-middle text-base">
                        {useGeezDigits ? toGeezNumeral(viewYear) : viewYear}
                      </span>
                    </>
                  ) : (
                    <span>{weekRangeLabel}</span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={t('navigation.nextMonth')}
                  onClick={goToNextMonth}
                  rightIcon={<ChevronRight className="h-4 w-4" />}
                >
                  <span className="sr-only">{t('navigation.next')}</span>
                </Button>
              </div>
              <div className="bg-border/50 h-px w-full" />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div
                  role="group"
                  aria-label={t('viewMode.label')}
                  className="bg-muted/40 inline-flex rounded-full p-1 text-xs font-semibold"
                >
                  <button
                    type="button"
                    onClick={() => handleViewModeChange('month')}
                    aria-pressed={viewMode === 'month'}
                    className={[
                      'focus-visible:ring-primary focus-visible:ring-offset-background rounded-full px-3 py-1 transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                      viewMode === 'month'
                        ? 'bg-primary text-primary-foreground shadow'
                        : 'text-muted-foreground hover:text-foreground',
                    ].join(' ')}
                  >
                    {t('viewMode.month')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleViewModeChange('week')}
                    aria-pressed={viewMode === 'week'}
                    className={[
                      'focus-visible:ring-primary focus-visible:ring-offset-background rounded-full px-3 py-1 transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                      viewMode === 'week'
                        ? 'bg-primary text-primary-foreground shadow'
                        : 'text-muted-foreground hover:text-foreground',
                    ].join(' ')}
                  >
                    {t('viewMode.week')}
                  </button>
                </div>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  {t('actions.today')}
                </Button>
              </div>

              {viewMode === 'month' ? (
                <div className="hidden items-center gap-3 sm:flex">
                  <span className="text-muted-foreground text-xs font-medium tracking-[0.25em] uppercase">
                    {t('selectors.monthLabel')}
                  </span>
                  <Select
                    value={String(viewMonth)}
                    onValueChange={(value) => setViewMonth(Number(value))}
                  >
                    <SelectTrigger
                      id="month-select"
                      className="border-input bg-background focus:ring-ring h-9 w-[11rem] rounded-md border px-4 text-sm shadow-sm focus:ring-2 focus:outline-none"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ETHIOPIAN_MONTHS.map((month) => (
                        <SelectItem key={month.number} value={String(month.number)}>
                          {month.english} · {month.amharic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground text-xs font-medium tracking-[0.25em] uppercase">
                    {t('selectors.yearLabel')}
                  </span>
                  <Select
                    value={String(viewYear)}
                    onValueChange={(value) => setViewYear(Number(value))}
                  >
                    <SelectTrigger
                      id="year-select"
                      className="border-input bg-background focus:ring-ring h-9 w-[8rem] rounded-md border px-4 text-sm shadow-sm focus:ring-2 focus:outline-none"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => {
                        const label = useGeezDigits
                          ? `${toGeezNumeral(year)} · ${year}`
                          : `${year} · ${toGeezNumeral(year)}`
                        return (
                          <SelectItem key={year} value={String(year)}>
                            {label}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              <div className="space-y-3">
                <div className="text-muted-foreground grid grid-cols-7 gap-1 text-center text-xs font-medium tracking-[0.2em] uppercase">
                  {WEEKDAYS.map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {visibleCells.map(({ date, gregorian, isCurrentMonth }) => {
                    const isToday = isSameDate(date, today)
                    const isSelected = isSameDate(date, selectedDate)
                    const showGeez = useGeezDigits && date.day > 0
                    const dayDisplay = showGeez ? toGeezNumeral(date.day) : String(date.day)
                    const gregDate = new Date(
                      Date.UTC(gregorian.year, gregorian.month - 1, gregorian.day),
                    )
                    const gregDay = gregDate.getUTCDate()
                    const highlightList = visibleHighlightLookup.get(createDateKey(date)) ?? []
                    const hasHighlights = highlightList.length > 0
                    const highlightNames = hasHighlights
                      ? highlightList.map((item) => item.name).join(', ')
                      : undefined
                    const ariaLabel = `${formatEthiopianDate(date, false)}${
                      highlightNames ? `. Holidays: ${highlightNames}` : ''
                    }`
                    const buttonClasses = [
                      'focus-visible:ring-ring relative flex min-h-[72px] flex-col justify-between rounded-xl border px-2 py-2 text-left text-sm transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground shadow'
                        : isToday
                          ? 'border-border bg-muted/70'
                          : 'border-border bg-card/70 hover:bg-muted/80',
                      !isCurrentMonth && !isSelected ? 'text-muted-foreground' : '',
                      hasHighlights && !isSelected ? 'ring-1 ring-primary/40' : '',
                    ]

                    return (
                      <button
                        key={`${date.year}-${date.month}-${date.day}`}
                        type="button"
                        onClick={() => handleSelectDate({ ...date })}
                        className={buttonClasses.filter(Boolean).join(' ')}
                        aria-pressed={isSelected}
                        aria-label={ariaLabel}
                      >
                        {hasHighlights ? (
                          <span
                            aria-hidden
                            className={`absolute top-2 right-2 size-2 rounded-full ${
                              isSelected ? 'bg-primary-foreground' : 'bg-primary'
                            }`}
                          />
                        ) : null}

                        <span className="text-base leading-tight font-medium">{dayDisplay}</span>
                        <div className="mt-auto flex items-center justify-between gap-2 text-[11px] font-medium">
                          <span
                            className={
                              isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'
                            }
                          >
                            {gregDay}
                          </span>
                          {hasHighlights ? (
                            <span
                              className={
                                isSelected ? 'text-primary-foreground/80' : 'text-primary/70'
                              }
                              aria-hidden
                              title={highlightNames}
                            >
                              •
                            </span>
                          ) : null}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            {/* Holidays glass card */}
            <div className="border-border/60 rounded-2xl border bg-transparent p-6 shadow-sm backdrop-blur-lg supports-[backdrop-filter]:bg-transparent">
              <h3 className="text-foreground text-base font-semibold tracking-tight">
                {viewMode === 'month' ? t('holidays.titleMonth') : t('holidays.titleWeek')}
              </h3>
              <div className="mt-4 space-y-3">
                {viewMode === 'month' ? (
                  monthHighlights.length ? (
                    monthHighlights.map((highlight) => (
                      <div
                        key={`${highlight.id}-${highlight.day}`}
                        className="bg-muted text-foreground flex items-start gap-3 rounded-xl px-3 py-3"
                      >
                        <div className="bg-primary text-primary-foreground grid size-10 place-items-center rounded-lg font-bold">
                          {useGeezDigits ? toGeezNumeral(highlight.day) : highlight.day}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm leading-tight font-semibold">{highlight.name}</p>
                          <p className="text-muted-foreground text-xs leading-tight">
                            {highlight.amharicName}
                          </p>
                          {highlight.category ? (
                            <span className="text-primary/80 text-[11px] font-medium tracking-wide">
                              {formatHighlightCategory(highlight.category)}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">{t('holidays.noHolidaysMonth')}</p>
                  )
                ) : weekHighlights.length ? (
                  weekHighlights.map(({ highlight, date }) => (
                    <div
                      key={`${highlight.id}-${createDateKey(date)}`}
                      className="bg-muted text-foreground flex items-start gap-3 rounded-xl px-3 py-3"
                    >
                      <div className="bg-primary text-primary-foreground grid size-10 place-items-center rounded-lg font-bold">
                        {useGeezDigits ? toGeezNumeral(date.day) : date.day}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm leading-tight font-semibold">{highlight.name}</p>
                        <p className="text-muted-foreground text-xs leading-tight">
                          {highlight.amharicName}
                        </p>
                        <p className="text-muted-foreground text-xs leading-tight">
                          {formatEthiopianDate(date, useGeezDigits)}
                        </p>
                        {highlight.category ? (
                          <span className="text-primary/80 text-[11px] font-medium tracking-wide">
                            {formatHighlightCategory(highlight.category)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">{t('holidays.noHolidaysWeek')}</p>
                )}
              </div>
            </div>

            {/* Selected date glass card */}
            <div
              ref={selectedCardRef}
              tabIndex={-1}
              className={[
                'border-border/60 focus-visible:ring-primary rounded-2xl border bg-transparent p-6 shadow-sm backdrop-blur-lg transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2 supports-[backdrop-filter]:bg-transparent',
                shouldFlashCard ? 'ring-primary ring-2 ring-offset-2' : '',
              ].join(' ')}
            >
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.35em] uppercase">
                {t('selectedDate.label')}
              </p>
              <h3 className="text-foreground mt-2 text-lg font-semibold tracking-tight">
                {formatEthiopianDate(selectedDate, useGeezDigits)}
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {selectedWeekday} · {formatGregorianDate(selectedGregorian)}
              </p>
              <div className="text-muted-foreground mt-4 space-y-2 text-sm">
                {selectedHighlights.length ? (
                  selectedHighlights.map((highlight) => (
                    <div
                      key={`${highlight.id}-${highlight.day}`}
                      className="border-border bg-muted/60 rounded-lg border px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-foreground text-sm leading-tight font-semibold">
                          {highlight.name}
                        </p>
                        {highlight.category ? (
                          <span className="text-primary/80 text-[11px] font-medium tracking-wide">
                            {formatHighlightCategory(highlight.category)}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-muted-foreground mt-1 text-sm leading-tight">
                        {highlight.amharicName}
                      </p>
                      {highlight.tags?.length ? (
                        <div className="text-muted-foreground mt-3 flex flex-wrap gap-1">
                          {highlight.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-primary/10 text-primary/80 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase"
                            >
                              {formatHighlightTag(tag)}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <p>{t('selectedDate.noHighlights')}</p>
                )}
              </div>
            </div>
            <AdSlot
              orientation="vertical"
              className="bg-secondary supports-[backdrop-filter]:bg-secondary min-h-[18rem] rounded-2xl backdrop-blur-lg"
              preset="sponsored"
            />
          </aside>
        </div>

        <AdSlot
          orientation="horizontal"
          className="bg-secondary supports-[backdrop-filter]:bg-secondary min-h-[12rem] rounded-2xl backdrop-blur-lg"
          preset="sponsored"
        />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
          <section
            id="geez-numbers"
            className="border-border/60 rounded-2xl border bg-transparent p-6 shadow-sm backdrop-blur-lg supports-[backdrop-filter]:bg-transparent"
          >
            <div className="flex flex-col gap-6 p-6 sm:p-8">
              <header className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">{t('geezNumbers.title')}</h2>
                <p className="text-muted-foreground text-sm">{t('geezNumbers.description1')}</p>
                <p className="text-muted-foreground text-sm">{t('geezNumbers.description2')}</p>
              </header>

              {/* small hint line */}
              <div className="text-primary/80 -mt-2 text-right text-sm italic">
                {t('geezNumbers.tapHint')}
              </div>

              {/* data table with separated rows */}
              <div className="overflow-x-auto">
                <table className="w-full border-separate [border-spacing:0_10px] text-sm">
                  <thead>
                    <tr className="text-muted-foreground text-left text-xs tracking-[0.25em] uppercase">
                      <th className="bg-secondary/60 px-4 py-3 first:rounded-l-lg last:rounded-r-lg">
                        {t('geezNumbers.tableHeaders.number')}
                      </th>
                      <th className="bg-secondary/60 px-4 py-3">
                        {t('geezNumbers.tableHeaders.symbol')}
                      </th>
                      <th className="bg-secondary/60 px-4 py-3 first:rounded-l-lg last:rounded-r-lg">
                        {t('geezNumbers.tableHeaders.amharicName')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {GEEZ_NUMERAL_TABLE.map((row) => (
                      <tr key={row.value}>
                        <td className="bg-secondary/30 text-foreground/90 px-4 py-3 first:rounded-l-lg last:rounded-r-lg">
                          {row.value.toLocaleString('en-US')}
                        </td>
                        <td className="bg-secondary/30 text-foreground px-4 py-3 text-lg font-semibold">
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
                              } catch {
                                // no-op if speech synthesis not available
                              }
                            }}
                            aria-label={t('geezNumbers.pronounceAriaLabel', { name: row.name })}
                          >
                            <span className="text-foreground font-medium">{row.name}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* examples */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold tracking-tight">
                  {t('geezNumbers.examplesTitle')}
                </h3>
                <ul className="text-foreground/80 list-disc pl-6 text-sm">
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
            <div className="border-border/60 rounded-2xl border bg-transparent p-6 shadow-sm backdrop-blur-lg supports-[backdrop-filter]:bg-transparent">
              <h3 className="text-foreground text-base font-semibold tracking-tight">
                {t('readingTips.title')}
              </h3>
              <p className="mt-2">{t('readingTips.tip1')}</p>
              <p className="mt-2">{t('readingTips.tip2')}</p>
            </div>
            <AdSlot
              orientation="vertical"
              className="bg-secondary supports-[backdrop-filter]:bg-secondary min-h-[18rem] w-full rounded-2xl backdrop-blur-lg"
              preset="sponsored"
            />
          </aside>
        </div>
      </Container>
    </section>
  )
}

export default CalendarPage
