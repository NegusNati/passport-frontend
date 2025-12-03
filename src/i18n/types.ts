/**
 * Type-safe i18n configuration for react-i18next
 *
 * This module provides TypeScript types for translation keys,
 * ensuring compile-time safety when using the `t()` function.
 */

import type advertisements_en from './locales/en/advertisements.json'
import type articles_en from './locales/en/articles.json'
import type auth_en from './locales/en/auth.json'
import type calendar_en from './locales/en/calendar.json'
import type common_en from './locales/en/common.json'
import type errors_en from './locales/en/errors.json'
import type landing_en from './locales/en/landing.json'
import type passports_en from './locales/en/passports.json'

// Define the resources structure using English as the source of truth
export interface I18nResources {
  advertisements: typeof advertisements_en
  articles: typeof articles_en
  calendar: typeof calendar_en
  common: typeof common_en
  landing: typeof landing_en
  auth: typeof auth_en
  errors: typeof errors_en
  passports: typeof passports_en
}

// Namespace keys
export type I18nNamespace = keyof I18nResources

// All available namespaces
export const i18nNamespaces: I18nNamespace[] = ['common', 'landing', 'auth', 'errors', 'passports', 'articles', 'calendar', 'advertisements']

// Augment react-i18next types for type-safe translations
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: I18nResources
  }
}

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: I18nResources
  }
}

/**
 * Helper type to get all keys from a namespace
 * Usage: type CommonKeys = TranslationKeys<'common'>
 */
export type TranslationKeys<NS extends I18nNamespace> = keyof I18nResources[NS]

/**
 * Helper type for nested translation keys (dot notation)
 * Recursively generates all possible dot-notation paths
 */
type NestedKeyOf<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], `${Prefix}${K}.`>
        : `${Prefix}${K}`
    }[keyof T & string]
  : never

export type CommonTranslationKey = NestedKeyOf<typeof common_en>
export type LandingTranslationKey = NestedKeyOf<typeof landing_en>
export type AuthTranslationKey = NestedKeyOf<typeof auth_en>
export type ErrorsTranslationKey = NestedKeyOf<typeof errors_en>
export type PassportsTranslationKey = NestedKeyOf<typeof passports_en>
export type ArticlesTranslationKey = NestedKeyOf<typeof articles_en>
export type CalendarTranslationKey = NestedKeyOf<typeof calendar_en>
export type AdvertisementsTranslationKey = NestedKeyOf<typeof advertisements_en>
