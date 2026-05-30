'use client'

/**
 * LanguageSwitcher — A responsive, accessible language selector dropdown.
 *
 * Features:
 *   - Shows current language with flag and label
 *   - Dropdown with all supported languages
 *   - Persists selection to localStorage via TranslationContext
 *   - Closes on outside click / Escape key
 *   - Responsive: compact on mobile, full on desktop
 *   - Smooth animations
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/TranslationContext'
import { type Locale, LOCALE_LABELS, LOCALE_FLAGS, SUPPORTED_LOCALES } from '@/lib/i18n'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }
  }, [open])

  // Close dropdown on Escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const handleSelect = useCallback((newLocale: Locale) => {
    setLocale(newLocale)
    setOpen(false)
  }, [setLocale])

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-sm font-medium
          text-muted-foreground hover:text-foreground hover:bg-muted/60
          transition-all duration-200 border border-transparent hover:border-border"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4 shrink-0" />
        <span className="hidden sm:inline text-xs">{LOCALE_FLAGS[locale]} {LOCALE_LABELS[locale]}</span>
        <span className="sm:hidden text-xs">{LOCALE_FLAGS[locale]}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1.5 z-50 min-w-[160px] rounded-xl
              bg-background border border-border shadow-lg shadow-black/10
              overflow-hidden py-1"
            role="listbox"
          >
            {SUPPORTED_LOCALES.map((loc) => {
              const isSelected = loc === locale
              return (
                <button
                  key={loc}
                  onClick={() => handleSelect(loc)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm
                    transition-colors duration-150
                    ${isSelected
                      ? 'bg-brand/10 text-brand font-semibold'
                      : 'text-foreground hover:bg-muted/60'
                    }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="text-base leading-none">{LOCALE_FLAGS[loc]}</span>
                  <span className="flex-1 text-left">{LOCALE_LABELS[loc]}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-brand shrink-0" />}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
