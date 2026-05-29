'use client'

import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Rocket, BookOpen, Users, Library, GraduationCap } from 'lucide-react'
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
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-navy dark:via-background dark:to-navy-light" />
      <div className="absolute inset-0 bg-pattern opacity-40" />

      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-[10%] w-72 h-72 bg-brand/10 rounded-full blur-[100px] dark:bg-brand/5" />
      <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-purple/10 rounded-full blur-[120px] dark:bg-purple/5" />

      {/* Floating elements */}
      <motion.div
        className="absolute top-28 left-[8%] hidden lg:block"
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-16 h-20 rounded-2xl bg-gradient-to-br from-brand to-brand-light dark:from-brand dark:to-purple flex items-center justify-center shadow-xl shadow-brand/20 animate-pulse-glow">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-44 right-[8%] hidden lg:block"
        animate={{ y: [0, -20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <div className="w-14 h-18 rounded-2xl bg-gradient-to-br from-purple to-purple-light dark:from-purple dark:to-purple-light flex items-center justify-center shadow-xl shadow-purple/20 p-3">
          <Rocket className="w-8 h-8 text-white" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-[15%] hidden lg:block"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan to-cyan-light flex items-center justify-center shadow-xl shadow-cyan/20">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand/10 text-brand text-sm font-medium mb-6 border border-brand/20">
              <Sparkles className="w-4 h-4" />
              India&apos;s Premium Student Ecosystem
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 font-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          >
            Buy & Sell Old Books{' '}
            <br className="hidden sm:block" />
            <span className="gradient-text">Directly With Students</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          >
            India&apos;s most trusted student marketplace for books, notes, and study essentials. Save up to 70% on textbooks with zero middleman.
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
              <span className="flex items-center gap-2">
                Start Selling
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
            <Button
              onClick={() => setCurrentPage('explore')}
              variant="outline"
              className="h-12 px-8 text-base font-semibold rounded-xl border-2 border-brand/30 text-brand hover:bg-brand/5 w-full sm:w-auto"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Explore Books
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
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand/10 to-purple/10 flex items-center justify-center border border-brand/10">
                  <stat.icon className="w-5 h-5 text-brand" />
                </div>
                <div className="text-left">
                  <p className="text-xl font-bold text-foreground font-heading">{stat.value}</p>
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
