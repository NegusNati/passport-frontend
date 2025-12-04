// Import type augmentations (side effect - registers types with i18next)
import './types'

// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './config'
import advertisements_am from './locales/am/advertisements.json'
// Import all language resources
import articles_am from './locales/am/articles.json'
import auth_am from './locales/am/auth.json'
import calendar_am from './locales/am/calendar.json'
import common_am from './locales/am/common.json'
import errors_am from './locales/am/errors.json'
import landing_am from './locales/am/landing.json'
import passports_am from './locales/am/passports.json'
import advertisements_en from './locales/en/advertisements.json'
import articles_en from './locales/en/articles.json'
import auth_en from './locales/en/auth.json'
import calendar_en from './locales/en/calendar.json'
import common_en from './locales/en/common.json'
import errors_en from './locales/en/errors.json'
import landing_en from './locales/en/landing.json'
import passports_en from './locales/en/passports.json'
import advertisements_om from './locales/om/advertisements.json'
import articles_om from './locales/om/articles.json'
import auth_om from './locales/om/auth.json'
import calendar_om from './locales/om/calendar.json'
import common_om from './locales/om/common.json'
import errors_om from './locales/om/errors.json'
import landing_om from './locales/om/landing.json'
import passports_om from './locales/om/passports.json'
import advertisements_ti from './locales/ti/advertisements.json'
import articles_ti from './locales/ti/articles.json'
import auth_ti from './locales/ti/auth.json'
import calendar_ti from './locales/ti/calendar.json'
import common_ti from './locales/ti/common.json'
import errors_ti from './locales/ti/errors.json'
import landing_ti from './locales/ti/landing.json'
import passports_ti from './locales/ti/passports.json'

// Restore language from localStorage if available
const storedLang = typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') : null
const initialLang =
  storedLang && SUPPORTED_LANGUAGES.some((l) => l.code === storedLang)
    ? storedLang
    : DEFAULT_LANGUAGE

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources: {
    en: {
      advertisements: advertisements_en,
      articles: articles_en,
      calendar: calendar_en,
      common: common_en,
      landing: landing_en,
      auth: auth_en,
      errors: errors_en,
      passports: passports_en,
    },
    am: {
      advertisements: advertisements_am,
      articles: articles_am,
      calendar: calendar_am,
      common: common_am,
      landing: landing_am,
      auth: auth_am,
      errors: errors_am,
      passports: passports_am,
    },
    om: {
      advertisements: advertisements_om,
      articles: articles_om,
      calendar: calendar_om,
      common: common_om,
      landing: landing_om,
      auth: auth_om,
      errors: errors_om,
      passports: passports_om,
    },
    ti: {
      advertisements: advertisements_ti,
      articles: articles_ti,
      calendar: calendar_ti,
      common: common_ti,
      landing: landing_ti,
      auth: auth_ti,
      errors: errors_ti,
      passports: passports_ti,
    },
  },
  lng: initialLang,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
  ns: [
    'common',
    'landing',
    'auth',
    'errors',
    'passports',
    'articles',
    'calendar',
    'advertisements',
  ],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

export default i18n
export * from './loader'
