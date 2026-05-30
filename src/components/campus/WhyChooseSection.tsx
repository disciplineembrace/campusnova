'use client'

import { motion } from 'framer-motion'
import { Shield, PiggyBank, MessageSquare, Users, Upload, Search } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/TranslationContext'

const FEATURES = [
  { icon: Shield, key: 'noMiddleman', color: 'from-blue-600 to-purple' },
  { icon: PiggyBank, key: 'save70', color: 'from-purple to-purple-light' },
  { icon: MessageSquare, key: 'directContact', color: 'from-emerald to-cyan' },
  { icon: Users, key: 'trustedCommunity', color: 'from-brand to-cyan' },
  { icon: Upload, key: 'easySelling', color: 'from-cyan to-purple' },
  { icon: Search, key: 'smartSearch', color: 'from-purple-light to-brand' },
]

export default function WhyChooseSection() {
  const { t } = useTranslation()

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
            {t('whyChoose.heading.prefix')} <span className="gradient-text">{t('whyChoose.heading.highlight')}</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t('whyChoose.subheading')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.key}
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
              <h3 className="text-lg font-semibold text-foreground mb-2 font-heading">{t(`whyChoose.feature.${feature.key}.title`)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(`whyChoose.feature.${feature.key}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
