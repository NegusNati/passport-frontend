import { Globe } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/i18n/config'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n } = useTranslation()
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(
    (i18n.language as SupportedLanguage) || 'en'
  )

  // Sync state when i18n language changes externally
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLang(lng as SupportedLanguage)
      // Apply font-ethiopic class to document for Ge'ez script languages
      if (lng === 'am' || lng === 'ti') {
        document.documentElement.classList.add('font-ethiopic')
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

  const change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lng = e.target.value as SupportedLanguage
    i18n.changeLanguage(lng)
    try {
      localStorage.setItem('i18nextLng', lng)
    } catch {
      // ignore localStorage errors
    }
  }

  return (
    <div className={cn('relative inline-flex items-center', className)}>
      <Globe className="text-muted-foreground pointer-events-none absolute left-2 h-4 w-4" />
      <select
        aria-label="Select language"
        className={cn(
          'bg-background text-foreground border-input hover:bg-accent focus:ring-ring',
          'h-9 appearance-none rounded-md border py-1 pr-8 pl-8 text-sm font-medium',
          'cursor-pointer transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none',
          // Apply ethiopic font for Ge'ez script languages
          (currentLang === 'am' || currentLang === 'ti') && 'font-ethiopic'
        )}
        value={currentLang}
        onChange={change}
      >
        {SUPPORTED_LANGUAGES.map((l) => (
          <option
            key={l.code}
            value={l.code}
            className={l.code === 'am' || l.code === 'ti' ? 'font-ethiopic' : ''}
          >
            {l.nativeName}
          </option>
        ))}
      </select>
      <svg
        className="text-muted-foreground pointer-events-none absolute right-2 h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )
}
