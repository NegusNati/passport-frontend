import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

import analytics from '@/shared/lib/analytics'

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
  // Check if running as installed PWA
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  const isIosStandalone =
    'standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true

  return isStandalone || isIosStandalone
}

export function PWAInstallProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isStandalone, setIsStandalone] = useState(isRunningStandalone())
  const [platform] = useState<Platform>(detectPlatform())

  useEffect(() => {
    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      if (import.meta.env.DEV) {
        console.log('[PWA] Install prompt available')
      }
    }

    // Listen for successful installation
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

    // Check standalone status on display mode change
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
  }, [platform])

  const promptInstall = async (): Promise<InstallResult> => {
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

      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null)
      }

      return choiceResult.outcome
    } catch (error) {
      console.error('[PWA] Install prompt error:', error)
      return 'unavailable'
    }
  }

  const value: PWAInstallContextValue = {
    canInstall: !!deferredPrompt && !isStandalone,
    isStandalone,
    platform,
    promptInstall,
  }

  return <PWAInstallContext.Provider value={value}>{children}</PWAInstallContext.Provider>
}

export function usePWAInstall(): PWAInstallContextValue {
  const context = useContext(PWAInstallContext)
  
  if (!context) {
    throw new Error('usePWAInstall must be used within PWAInstallProvider')
  }
  
  return context
}
