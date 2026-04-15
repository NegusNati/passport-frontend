import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { analytics } from '@/shared/lib/analytics'

type Platform = 'ios' | 'android' | 'desktop' | 'unknown'
type InstallResult = 'accepted' | 'dismissed' | 'unavailable'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface PWAInstallContextValue {
  canInstall: boolean
  isStandalone: boolean
  platform: Platform
  promptInstall: () => Promise<InstallResult>
  registerInterest: () => () => void
}

const PWAInstallContext = createContext<PWAInstallContextValue | null>(null)

function detectPlatform(): Platform {
  const ua = navigator.userAgent.toLowerCase()

  if (/(iphone|ipad|ipod)/i.test(ua)) {
    return 'ios'
  }

  if (/android/i.test(ua)) {
    return 'android'
  }

  return 'desktop'
}

function isRunningStandalone(): boolean {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  const isIosStandalone =
    'standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true

  return isStandalone || isIosStandalone
}

export function PWAInstallProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isStandalone, setIsStandalone] = useState(isRunningStandalone())
  const [platform] = useState<Platform>(detectPlatform())
  const [interestedConsumers, setInterestedConsumers] = useState(0)

  useEffect(() => {
    if (interestedConsumers === 0) {
      setDeferredPrompt(null)
      return
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)

      if (import.meta.env.DEV) {
        console.log('[PWA] Install prompt available')
      }
    }

    const handleAppInstalled = () => {
      setIsStandalone(true)
      setDeferredPrompt(null)

      analytics.capture('pwa_install_completed', {
        platform,
        timestamp: new Date().toISOString(),
      })

      if (import.meta.env.DEV) {
        console.log('[PWA] App installed successfully')
      }
    }

    const displayModeQuery = window.matchMedia('(display-mode: standalone)')
    const handleDisplayModeChange = () => {
      setIsStandalone(isRunningStandalone())
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    displayModeQuery.addEventListener('change', handleDisplayModeChange)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      displayModeQuery.removeEventListener('change', handleDisplayModeChange)
    }
  }, [interestedConsumers, platform])

  const promptInstall = useCallback(async (): Promise<InstallResult> => {
    if (!deferredPrompt) {
      if (import.meta.env.DEV) {
        console.warn('[PWA] Install prompt not available')
      }
      return 'unavailable'
    }

    try {
      analytics.capture('pwa_install_prompt_shown', {
        platform,
        timestamp: new Date().toISOString(),
      })

      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice

      analytics.capture('pwa_install_user_choice', {
        outcome: choiceResult.outcome,
        platform,
        timestamp: new Date().toISOString(),
      })

      setDeferredPrompt(null)
      return choiceResult.outcome
    } catch (error) {
      console.error('[PWA] Install prompt error:', error)
      return 'unavailable'
    }
  }, [deferredPrompt, platform])

  const registerInterest = useCallback(() => {
    setInterestedConsumers((current) => current + 1)

    return () => {
      setInterestedConsumers((current) => Math.max(0, current - 1))
    }
  }, [])

  const value = useMemo<PWAInstallContextValue>(
    () => ({
      canInstall: !!deferredPrompt && !isStandalone,
      isStandalone,
      platform,
      promptInstall,
      registerInterest,
    }),
    [deferredPrompt, isStandalone, platform, promptInstall, registerInterest],
  )

  return <PWAInstallContext.Provider value={value}>{children}</PWAInstallContext.Provider>
}

export function usePWAInstall(): Omit<PWAInstallContextValue, 'registerInterest'> {
  const context = useContext(PWAInstallContext)

  if (!context) {
    throw new Error('usePWAInstall must be used within PWAInstallProvider')
  }

  const registerInterest = context.registerInterest

  useEffect(() => registerInterest(), [registerInterest])

  return {
    canInstall: context.canInstall,
    isStandalone: context.isStandalone,
    platform: context.platform,
    promptInstall: context.promptInstall,
  }
}
