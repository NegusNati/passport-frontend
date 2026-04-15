import { useEffect, useState } from 'react'

import {
  getNetworkConnectionForListeners,
  type NetworkConditions,
  readNetworkConditions,
} from '@/shared/lib/network'

export function useNetworkConditions(): NetworkConditions {
  const [conditions, setConditions] = useState<NetworkConditions>(() => readNetworkConditions())

  useEffect(() => {
    const update = () => {
      setConditions(readNetworkConditions())
    }

    const connection = getNetworkConnectionForListeners()

    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    connection?.addEventListener?.('change', update)

    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
      connection?.removeEventListener?.('change', update)
    }
  }, [])

  return conditions
}
