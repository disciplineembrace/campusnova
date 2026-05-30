/**
 * EduCampusHub — Internationalization (i18n) Module
 *
 * Supports: English (en), Gujarati (gu), Hindi (hi)
 * Default: English
 * Persists selection in localStorage under key "educampushub-lang"
 *
 * Usage:
 *   import { useTranslation } from '@/lib/i18n'
 *   const { t, locale, setLocale } = useTranslation()
 *   <p>{t('nav.item.home')}</p>
 *   <p>{t('explore.listingsCount', { total: 42 })}</p>
 */

export type Locale = 'en' | 'gu' | 'hi'

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  gu: 'ગુજરાતી',
  hi: 'हिन्दी',
}

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: '🇬🇧',
  gu: '🇮🇳',
  hi: '🇮🇳',
}

export const DEFAULT_LOCALE: Locale = 'en'

export const SUPPORTED_LOCALES: Locale[] = ['en', 'gu', 'hi']

/** localStorage key for persisting language preference */
export const LANG_STORAGE_KEY = 'educampushub-lang'

/**
 * Resolve a nested key like "nav.item.home" from an object.
 * Returns undefined if the path doesn't exist.
 */
export function resolve(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split('.')
  let current: unknown = obj
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[key]
  }
  return typeof current === 'string' ? current : undefined
}

/**
 * Interpolate template variables like "{name}" in a string.
 * Example: interpolate("Hello, {name}!", { name: "Ravi" }) → "Hello, Ravi!"
 */
export function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const val = vars[key]
    return val !== undefined ? String(val) : `{${key}}`
  })
}
