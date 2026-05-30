'use client'

import { motion } from 'framer-motion'
import { Shield, PiggyBank, MessageSquare, Users, Upload, Search } from 'lucide-react'

const FEATURES = [
  { icon: Shield, title: 'No Middleman', description: 'Connect directly with students. No commissions, no hidden fees, no markup.', color: 'from-blue-600 to-purple' },
  { icon: PiggyBank, title: 'Save 70%+', description: 'Save up to 70% on textbooks. Why buy new when you can get the same knowledge for less?', color: 'from-purple to-purple-light' },
  { icon: MessageSquare, title: 'Direct Contact', description: 'Chat with sellers directly on WhatsApp. Instant communication, zero delay.', color: 'from-emerald to-cyan' },
  { icon: Users, title: 'Trusted Community', description: 'Verified students from real colleges. Every listing is from a genuine student.', color: 'from-brand to-cyan' },
  { icon: Upload, title: 'Easy Selling', description: 'List your books in under 2 minutes. Just fill in the details and you\'re live!', color: 'from-cyan to-purple' },
  { icon: Search, title: 'Smart Search', description: 'Find exactly what you need by category, college, course, or city. Smart filters.', color: 'from-purple-light to-brand' },
]

export default function WhyChooseSection() {
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
            Why Students <span className="gradient-text">Love EduCampusHub</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Built by students, for students. Every feature designed to make your life easier.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="p-6 rounded-2xl card-premium glow-hover group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4, scale: 1.01 }}
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-md group-hover:shadow-lg transition-shadow`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 font-heading">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
