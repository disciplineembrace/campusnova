'use client'

import { motion } from 'framer-motion'
import { Stethoscope, Wrench, GraduationCap, Target, Scale, FileText, PenTool, Tablet, Notebook, Package, BookOpen, BookMarked } from 'lucide-react'
import { useAppStore, CATEGORIES } from '@/lib/store'

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen, BookMarked, GraduationCap, Stethoscope, Wrench, Scale, Target, FileText,
  PenTool, Tablet, Notebook, Package,
}

export default function CategoriesSection() {
  const { setCurrentPage, setSelectedCategory } = useAppStore()

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentPage('explore')
  }

  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 font-heading">
            Browse by <span className="gradient-text">Category</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Find exactly what you need from textbooks to study kits
          </p>
        </motion.div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 md:pb-0 md:grid md:grid-cols-5 lg:grid-cols-7">
          {CATEGORIES.map((cat, i) => {
            const Icon = ICON_MAP[cat.icon] || FileText
            return (
              <motion.button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="flex flex-col items-center gap-2.5 p-4 sm:p-5 rounded-2xl card-premium glow-hover group min-w-[100px] md:min-w-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-foreground text-center leading-tight">{cat.name}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
