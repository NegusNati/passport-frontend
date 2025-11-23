import { createLazyFileRoute } from '@tanstack/react-router'

import { CalendarPage } from '@/features/calendar/components/CalendarPage'

export const Route = createLazyFileRoute('/calendar')({
  component: CalendarPage,
})
