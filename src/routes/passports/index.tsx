import { createFileRoute } from '@tanstack/react-router'
import { PassportsPage } from '@/features/passports/components/PassportsPage'

// Index route: renders at /passports
export const Route = createFileRoute('/passports/')({
  component: PassportsPage,
})


