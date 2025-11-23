import { createLazyFileRoute } from '@tanstack/react-router'

import { PassportsPage } from '@/features/passports/components/PassportsPage'

export const Route = createLazyFileRoute('/passports/')({
  component: PassportsPage,
})
