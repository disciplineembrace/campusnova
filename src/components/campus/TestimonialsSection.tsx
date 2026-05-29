'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

interface Review {
  id: string
  rating: number
  comment: string
  reviewer: {
    name: string
    college: string | null
  }
}

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews?limit=6')
        if (res.ok) {
          const data = await res.json()
          setReviews(data.reviews || [])
        }
      } catch {
        // Reviews not available yet
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  // Don't render section if no reviews exist
  if (!loading && reviews.length === 0) {
    return null
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 font-heading">
            What Students <span className="gradient-text">Say</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Hear from students who saved thousands using CampusNova
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((t, i) => (
            <motion.div
              key={t.id}
              className="p-6 rounded-2xl card-premium glow-hover relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Quote className="w-10 h-10 text-brand/10 absolute top-4 right-4" />
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star
                    key={si}
                    className={`w-4 h-4 ${si < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-4">&ldquo;{t.comment}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-purple flex items-center justify-center text-white text-sm font-bold ring-2 ring-brand/10">
                  {t.reviewer.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.reviewer.name}</p>
                  <p className="text-xs text-muted-foreground">{t.reviewer.college || 'Student'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
