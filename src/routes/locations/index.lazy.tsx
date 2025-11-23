import { createLazyFileRoute } from '@tanstack/react-router'

import { LocationsDirectoryPage } from '@/features/passports/components/LocationsDirectoryPage'

export const Route = createLazyFileRoute('/locations/')({
  component: LocationsDirectoryPage,
})
