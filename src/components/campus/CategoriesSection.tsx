'use client'

import { motion } from 'framer-motion'
import { Stethoscope, Wrench, GraduationCap, Target, Landmark, Scale, Calculator, Bed, FileText } from 'lucide-react'
import { useAppStore, CATEGORIES } from '@/lib/store'

const ICON_MAP: Record<string, React.ElementType> = {
  Stethoscope, Wrench, GraduationCap, Target, Landmark, Scale, Calculator, Bed, FileText,
}

export default function CategoriesSection() {
  const { setCurrentPage, setSelectedCategory } = useAppStore()

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentPage('explore')
  }

  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Browse by <span className="gradient-text">Category</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Find exactly what you need from textbooks to hostel essentials
          </p>
        </motion.div>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3 sm:gap-4">
          {CATEGORIES.map((cat, i) => {
            const Icon = ICON_MAP[cat.icon] || FileText
            return (
              <motion.button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-card border border-border hover:border-brand/30 hover:shadow-md transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                  <Icon className="w-6 h-6 text-white" />
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
