import { createLazyFileRoute } from '@tanstack/react-router'

import { LandingPage } from '@/features/landing/components/LandingPage'

export const Route = createLazyFileRoute('/')({
  component: LandingPage,
})
