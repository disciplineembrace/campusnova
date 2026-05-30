'use client'

/**
 * TranslationContext — React Context for i18n state management.
 *
 * Provides:
 *   - t(key, vars?)  — translate a key with optional interpolation
 *   - locale          — current active locale
 *   - setLocale(l)    — change the active locale (persists to localStorage)
 *   - translations    — raw translation object for the current locale
 *
 * Wrap your app with <TranslationProvider> to enable translations.
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import {
  type Locale,
  DEFAULT_LOCALE,
  LANG_STORAGE_KEY,
  SUPPORTED_LOCALES,
  resolve,
  interpolate,
} from './index'

// Lazy-loaded translation modules
import { translations as en } from './locales/en'
import { translations as gu } from './locales/gu'
import { translations as hi } from './locales/hi'

const TRANSLATION_MAP: Record<Locale, Record<string, unknown>> = { en, gu, hi }

interface TranslationContextValue {
  /** Current active locale */
  locale: Locale
  /** Change the active locale (persists to localStorage) */
  setLocale: (locale: Locale) => void
  /** Translate a dot-separated key, with optional variable interpolation */
  t: (key: string, vars?: Record<string, string | number>) => string
  /** Raw translation object for the current locale */
  translations: Record<string, unknown>
}

const TranslationContext = createContext<TranslationContextValue | null>(null)

/**
 * Read the persisted locale from localStorage.
 * Returns the stored value if it's a supported locale, otherwise the default.
 */
function getPersistedLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY)
    if (stored && SUPPORTED_LOCALES.includes(stored as Locale)) {
      return stored as Locale
    }
  } catch {
    // localStorage may not be available
  }
  return DEFAULT_LOCALE
}

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)
  const [mounted, setMounted] = useState(false)

  // Hydrate from localStorage after mount
  useEffect(() => {
    setLocaleState(getPersistedLocale())
    setMounted(true)
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    if (!SUPPORTED_LOCALES.includes(newLocale)) return
    setLocaleState(newLocale)
    try {
      localStorage.setItem(LANG_STORAGE_KEY, newLocale)
    } catch {
      // Silently fail if localStorage is unavailable
    }
    // Update html lang attribute for SEO / accessibility
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale
    }
  }, [])

  // Set the html lang attribute on mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
    }
  }, [locale])

  const translations = useMemo(() => TRANSLATION_MAP[locale], [locale])

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      // Try the current locale first
      let value = resolve(translations, key)
      // Fallback to English if the key is missing
      if (value === undefined && locale !== 'en') {
        value = resolve(TRANSLATION_MAP.en, key)
      }
      // Final fallback: return the key itself
      if (value === undefined) return key
      return interpolate(value, vars)
    },
    [translations, locale]
  )

  // Avoid hydration mismatch: render with default locale on server,
  // then switch to persisted locale on client
  const contextValue = useMemo(
    () => ({ locale, setLocale, t, translations }),
    [locale, setLocale, t, translations]
  )

  // On first render before mount, use default locale to avoid hydration issues
  if (!mounted) {
    const defaultTranslations = TRANSLATION_MAP[DEFAULT_LOCALE]
    const defaultT = (key: string, vars?: Record<string, string | number>): string => {
      const value = resolve(defaultTranslations, key)
      if (value === undefined) return key
      return interpolate(value, vars)
    }
    return (
      <TranslationContext.Provider
        value={{ locale: DEFAULT_LOCALE, setLocale, t: defaultT, translations: defaultTranslations }}
      >
        {children}
      </TranslationContext.Provider>
    )
  }

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  )
}

/**
 * useTranslation — Hook to access the translation context.
 * Must be used within a <TranslationProvider>.
 *
 * @example
 * const { t, locale, setLocale } = useTranslation()
 * <h1>{t('nav.item.home')}</h1>
 * <p>{t('explore.listingsCount', { total: 42 })}</p>
 */
export function useTranslation(): TranslationContextValue {
  const ctx = useContext(TranslationContext)
  if (!ctx) {
    throw new Error('useTranslation must be used within a <TranslationProvider>')
  }
  return ctx
}
