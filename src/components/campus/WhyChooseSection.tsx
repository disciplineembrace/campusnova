'use client'

import { motion } from 'framer-motion'
import { Shield, PiggyBank, MessageSquare, Users, Upload, Search } from 'lucide-react'

const FEATURES = [
  { icon: Shield, title: 'No Middleman', description: 'Connect directly with students. No commissions, no hidden fees, no markup.', color: 'from-blue-500 to-cyan-500' },
  { icon: PiggyBank, title: 'Save Money', description: 'Save up to 70% on textbooks. Why buy new when you can get the same knowledge for less?', color: 'from-emerald-500 to-teal-500' },
  { icon: MessageSquare, title: 'Direct Contact', description: 'Chat with sellers directly on WhatsApp. Instant communication, zero delay.', color: 'from-green-500 to-emerald-500' },
  { icon: Users, title: 'Trusted Community', description: 'Verified students from real colleges. Every listing is from a genuine student.', color: 'from-purple-500 to-violet-500' },
  { icon: Upload, title: 'Easy Selling', description: 'List your books in under 2 minutes. Just fill in the details and you\'re live!', color: 'from-orange-500 to-amber-500' },
  { icon: Search, title: 'Fast Search', description: 'Find exactly what you need by category, college, course, or city. Smart filters.', color: 'from-pink-500 to-rose-500' },
]

export default function WhyChooseSection() {
  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Why Choose <span className="gradient-text">CampusBazaar</span>?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Built by students, for students. Every feature designed to make your life easier.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="p-6 rounded-2xl bg-card border border-border hover:border-brand/20 hover:shadow-md transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-shadow`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
