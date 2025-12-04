import { Globe } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/i18n/config'
import { cn } from '@/lib/utils'
import { loadEthiopicFont, preloadEthiopicFont, requiresEthiopicFont } from '@/shared/lib/fonts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

// Short codes for compact display
const LANGUAGE_SHORT_CODES: Record<SupportedLanguage, string> = {
  en: 'EN',
  am: 'AM',
  om: 'OM',
  ti: 'TI',
}

interface LanguageSwitcherProps {
  className?: string
  /** Compact mode shows short codes (EN, AM, etc.) in a smaller trigger */
  compact?: boolean
}

function renderLanguageItems(useShortLabels: boolean) {
  return SUPPORTED_LANGUAGES.map((l) => (
    <SelectItem
      key={l.code}
      value={l.code}
      className={!useShortLabels && (l.code === 'am' || l.code === 'ti') ? 'font-ethiopic' : ''}
    >
      {useShortLabels ? LANGUAGE_SHORT_CODES[l.code] : l.nativeName}
    </SelectItem>
  ))
}

export function LanguageSwitcher({ className, compact = false }: LanguageSwitcherProps) {
  const { i18n } = useTranslation()
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(
    (i18n.language as SupportedLanguage) || 'en',
  )

  // Sync state when i18n language changes externally
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLang(lng as SupportedLanguage)
      // Apply font-ethiopic class immediately for visual feedback
      if (requiresEthiopicFont(lng)) {
        document.documentElement.classList.add('font-ethiopic')
        // Load the Ethiopic font in background (non-blocking)
        loadEthiopicFont().catch(() => {
          // Font load failed silently - class is already applied
        })
      } else {
        document.documentElement.classList.remove('font-ethiopic')
      }
    }
    i18n.on('languageChanged', handleLanguageChange)
    // Apply initial class if needed
    handleLanguageChange(i18n.language)
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  const handleChange = useCallback(
    (lng: string) => {
      const lang = lng as SupportedLanguage
      i18n.changeLanguage(lang)
      try {
        localStorage.setItem('i18nextLng', lang)
      } catch {
        // ignore localStorage errors
      }
    },
    [i18n],
  )

  // Preload Ethiopic font when user hovers over the language switcher
  // This improves perceived performance when switching to Amharic/Tigrinya
  const handleMouseEnter = () => {
    preloadEthiopicFont()
  }

  const isEthiopicLang = currentLang === 'am' || currentLang === 'ti'

  if (compact) {
    return (
      <Select aria-label="Select language" value={currentLang} onValueChange={handleChange}>
        <SelectTrigger
          className={cn(
            'h-8 w-auto min-w-[2.5rem] px-1 text-xs font-bold',
            'justify-center',
            isEthiopicLang && 'font-ethiopic',
            className,
          )}
          onMouseEnter={handleMouseEnter}
          onFocus={handleMouseEnter}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>{renderLanguageItems(true)}</SelectContent>
      </Select>
    )
  }

  return (
    <Select aria-label="Select language" value={currentLang} onValueChange={handleChange}>
      <SelectTrigger
        className={cn(
          'relative h-9 w-auto pr-2 pl-8 text-sm font-medium',
          isEthiopicLang && 'font-ethiopic',
          className,
        )}
        onMouseEnter={handleMouseEnter}
        onFocus={handleMouseEnter}
      >
        <Globe className="text-muted-foreground pointer-events-none absolute left-2 h-4 w-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>{renderLanguageItems(false)}</SelectContent>
    </Select>
  )
}
