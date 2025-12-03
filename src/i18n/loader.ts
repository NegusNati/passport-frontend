/**
 * i18n utilities for route loaders
 *
 * These helpers enable eager loading of translation namespaces
 * in TanStack Router loaders, ensuring translations are ready
 * before the component renders.
 */

import i18n from './index'
import type { I18nNamespace } from './types'

/**
 * Load translation namespaces in a route loader.
 * This ensures translations are available before the route renders,
 * preventing flash of untranslated content.
 *
 * @param namespaces - Array of namespace names to load
 * @returns Promise that resolves when all namespaces are loaded
 *
 * @example
 * // In a route file (e.g., routes/index.tsx)
 * import { loadI18nNamespaces } from '@/i18n/loader'
 *
 * export const Route = createFileRoute('/')({
 *   loader: async ({ context }) => {
 *     await loadI18nNamespaces(['landing'])
 *     // ... other loader logic
 *   },
 * })
 */
export async function loadI18nNamespaces(namespaces: I18nNamespace[]): Promise<void> {
  // Filter out already loaded namespaces to avoid redundant loads
  const namespacesToLoad = namespaces.filter((ns) => !i18n.hasLoadedNamespace(ns))

  if (namespacesToLoad.length === 0) {
    return
  }

  await i18n.loadNamespaces(namespacesToLoad)
}

/**
 * Preload common namespaces needed across most routes.
 * Call this in the root route loader to ensure base translations
 * are always available.
 *
 * @example
 * // In routes/__root.tsx
 * export const Route = createRootRoute({
 *   loader: async () => {
 *     await preloadCommonNamespaces()
 *   },
 * })
 */
export async function preloadCommonNamespaces(): Promise<void> {
  await loadI18nNamespaces(['common'])
}

/**
 * Check if a namespace is already loaded.
 * Useful for conditional loading logic.
 *
 * @param namespace - The namespace to check
 * @returns true if the namespace is loaded
 */
export function isNamespaceLoaded(namespace: I18nNamespace): boolean {
  return i18n.hasLoadedNamespace(namespace)
}

/**
 * Get the current language.
 * Useful in loaders where useTranslation hook isn't available.
 *
 * @returns The current i18n language code
 */
export function getCurrentLanguage(): string {
  return i18n.language
}
