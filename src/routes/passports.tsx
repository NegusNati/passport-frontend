import { createFileRoute } from '@tanstack/react-router'
import { PassportsPage } from '@/features/passports/components/PassportsPage'

export const Route = createFileRoute('/passports')({
  component: PassportsPage,
})
