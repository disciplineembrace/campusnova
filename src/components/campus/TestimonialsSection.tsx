'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const TESTIMONIALS = [
  { name: 'Aarav Mehta', college: 'IIT Delhi', review: 'Sold all my JEE books within 3 days! The WhatsApp connect feature is a game changer. No more posting on random WhatsApp groups.', rating: 5 },
  { name: 'Shreya Reddy', college: 'AIIMS Delhi', review: 'Got Campbell Biology at 60% off. The seller was from my own college! CampusNova understands what students need.', rating: 5 },
  { name: 'Karan Patel', college: 'NLU Bangalore', review: 'Finally a platform where I can find law books easily. The bare acts I needed were listed by a senior. Saved me so much money!', rating: 4 },
  { name: 'Divya Sharma', college: 'BITS Pilani', review: 'The category filters are so helpful. Found exactly the commerce books I needed for my semester exams. Highly recommend!', rating: 5 },
  { name: 'Rohan Gupta', college: 'IIT Bombay', review: 'I made ₹8,000 selling my old GATE prep material. The process was super smooth. Just listed and got messages on WhatsApp.', rating: 5 },
  { name: 'Ananya Singh', college: 'JNU Delhi', review: 'UPSC prep is expensive enough. Finding Spectrum and Laxmikanth at half price was a blessing. Verified sellers give confidence.', rating: 4 },
]

export default function TestimonialsSection() {
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
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
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
              <p className="text-sm text-foreground/80 leading-relaxed mb-4">&ldquo;{t.review}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-purple flex items-center justify-center text-white text-sm font-bold ring-2 ring-brand/10">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.college}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
