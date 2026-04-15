export type NetworkConditions = {
  isOnline: boolean
  effectiveType: string
  saveData: boolean
  isConstrained: boolean
  preferManualSearch: boolean
  allowsPrefetch: boolean
  prefetchBudget: number
  searchDebounceMs: number
  searchMinCharacters: number
}

type BrowserConnection = {
  effectiveType?: string
  saveData?: boolean
  addEventListener?: (type: string, listener: EventListenerOrEventListenerObject) => void
  removeEventListener?: (type: string, listener: EventListenerOrEventListenerObject) => void
}

function getConnection(): BrowserConnection | null {
  if (typeof navigator === 'undefined') return null

  const nav = navigator as Navigator & {
    connection?: BrowserConnection
    mozConnection?: BrowserConnection
    webkitConnection?: BrowserConnection
  }

  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection ?? null
}

export function readNetworkConditions(): NetworkConditions {
  if (typeof navigator === 'undefined') {
    return {
      isOnline: true,
      effectiveType: 'unknown',
      saveData: false,
      isConstrained: false,
      preferManualSearch: false,
      allowsPrefetch: true,
      prefetchBudget: 2,
      searchDebounceMs: 350,
      searchMinCharacters: 3,
    }
  }

  const connection = getConnection()
  const effectiveType = connection?.effectiveType ?? 'unknown'
  const saveData = Boolean(connection?.saveData)
  const isOnline = navigator.onLine
  const isVerySlow = effectiveType === 'slow-2g' || effectiveType === '2g'
  const isSlow = isVerySlow || effectiveType === '3g'
  const isConstrained = !isOnline || saveData || isVerySlow
  const preferManualSearch = !isOnline || saveData || isVerySlow

  return {
    isOnline,
    effectiveType,
    saveData,
    isConstrained,
    preferManualSearch,
    allowsPrefetch: isOnline && !saveData && !isVerySlow,
    prefetchBudget: !isOnline || saveData ? 0 : isSlow ? 1 : 3,
    searchDebounceMs: preferManualSearch ? 700 : isSlow ? 450 : 300,
    searchMinCharacters: preferManualSearch ? 4 : 3,
  }
}

export function getNetworkConnectionForListeners() {
  return getConnection()
}
