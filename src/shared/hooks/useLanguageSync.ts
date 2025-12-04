import { useSearch } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/i18n/config'

const supportedCodes = SUPPORTED_LANGUAGES.map((l) => l.code)

/**
 * Updates the URL search param without triggering a navigation.
 * Uses History API for a lightweight update.
 */
function updateUrlLangParam(lang: string) {
  const url = new URL(window.location.href)
  url.searchParams.set('lang', lang)
  window.history.replaceState({}, '', url.toString())
}

/**
 * Hook that syncs the URL `?lang=` search param with i18next.
 * - On mount: reads `?lang=` from URL and sets i18n language
 * - On language change: updates URL search param
 *
 * Call this hook once in the root layout or AppShell.
 */
export function useLanguageSync() {
  const { i18n } = useTranslation()

  // Get lang from URL search params (safe access)
  let urlLang: string | undefined
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const search = useSearch({ strict: false }) as any
    urlLang = search?.lang
  } catch {
    // useSearch may throw if not inside router context during SSR
  }

  // On mount: sync URL lang to i18n
  useEffect(() => {
    if (urlLang && supportedCodes.includes(urlLang as SupportedLanguage)) {
      if (i18n.language !== urlLang) {
        i18n.changeLanguage(urlLang)
        try {
          localStorage.setItem('i18nextLng', urlLang)
        } catch {
          // ignore
        }
      }
    } else if (!urlLang) {
      // No lang in URL - check localStorage or use default
      const stored = localStorage.getItem('i18nextLng')
      const langToUse =
        stored && supportedCodes.includes(stored as SupportedLanguage) ? stored : DEFAULT_LANGUAGE

      // Update URL with detected language (without full page reload)
      if (langToUse !== DEFAULT_LANGUAGE || stored) {
        updateUrlLangParam(langToUse)
      }
    }
  }, [urlLang, i18n])

  // Listen for i18n language changes and update URL
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      // Update URL search param when language changes via LanguageSwitcher
      updateUrlLangParam(lng)
    }

    i18n.on('languageChanged', handleLanguageChange)
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  return i18n.language
}

export default useLanguageSync
