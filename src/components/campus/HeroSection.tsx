'use client'

import { motion } from 'framer-motion'
import { BookOpen, ArrowRight, ShoppingBag, GraduationCap, Users, Library } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'

const STATS = [
  { icon: Users, label: 'Students', value: '10,000+' },
  { icon: Library, label: 'Books Listed', value: '5,000+' },
  { icon: GraduationCap, label: 'Colleges', value: '100+' },
]

export default function HeroSection() {
  const { setCurrentPage } = useAppStore()

  return (
    <section className="relative overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-navy dark:via-background dark:to-navy-light" />
      <div className="absolute inset-0 bg-pattern opacity-40" />

      {/* Floating elements */}
      <motion.div
        className="absolute top-24 left-[10%] hidden lg:block"
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-800 dark:to-blue-900 flex items-center justify-center shadow-lg">
          <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-300" />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-40 right-[8%] hidden lg:block"
        animate={{ y: [0, -20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <div className="w-14 h-18 rounded-lg bg-gradient-to-br from-emerald-200 to-emerald-300 dark:from-emerald-800 dark:to-emerald-900 flex items-center justify-center shadow-lg p-3">
          <GraduationCap className="w-8 h-8 text-emerald-600 dark:text-emerald-300" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-[15%] hidden lg:block"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 dark:from-amber-800 dark:to-orange-900 flex items-center justify-center shadow-lg">
          <ShoppingBag className="w-6 h-6 text-amber-700 dark:text-amber-300" />
        </div>
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 text-brand text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
              India&apos;s #1 Student Marketplace
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          >
            Buy & Sell Old Books{' '}
            <span className="gradient-text">Directly With Students</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          >
            India&apos;s trusted student marketplace for books, notes, and study essentials. Save up to 70% on textbooks. No middleman, no hassle.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          >
            <Button
              onClick={() => setCurrentPage('sell')}
              className="btn-gradient text-white border-0 h-12 px-8 text-base font-semibold rounded-xl w-full sm:w-auto"
            >
              Sell Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => setCurrentPage('explore')}
              variant="outline"
              className="h-12 px-8 text-base font-semibold rounded-xl border-2 w-full sm:w-auto"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Browse Books
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
          >
            {STATS.map(stat => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-brand" />
                </div>
                <div className="text-left">
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
