import { createFileRoute } from '@tanstack/react-router'
import { CalendarPage } from '@/features/calendar/components/CalendarPage'

export const Route = createFileRoute('/calendar')({
  component: CalendarPage,
})
