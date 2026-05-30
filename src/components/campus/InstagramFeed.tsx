'use client'

import { motion } from 'framer-motion'
import { Instagram, Heart, MessageCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

const INSTAGRAM_POSTS = [
  { id: 1, caption: '📚 NEET Books Collection - Save 60%', gradient: 'from-brand to-accent' },
  { id: 2, caption: '🎓 Engineering Textbooks at ₹99', gradient: 'from-accent to-purple-light' },
  { id: 3, caption: '✨ GSEB Board Books - Gujarati Medium', gradient: 'from-cyan to-brand' },
  { id: 4, caption: '📖 Handwritten Notes by Toppers', gradient: 'from-emerald to-cyan' },
  { id: 5, caption: '🏷️ UPSC Study Material Bundle', gradient: 'from-brand to-emerald' },
  { id: 6, caption: '💡 Tips: Sell Your Old Books in 3 Steps', gradient: 'from-purple-light to-accent' },
]

export default function InstagramFeed() {
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
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 text-sm font-medium mb-4 border border-purple-500/20">
            <Instagram className="w-4 h-4 text-pink-500" />
            @educampushubofficial
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 font-heading">
            Follow Us on <span className="gradient-text">Instagram</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Stay updated with latest book deals, study tips, and campus stories. Join our growing community!
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
          {INSTAGRAM_POSTS.map((post, i) => (
            <motion.a
              key={post.id}
              href="https://www.instagram.com/educampushubofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              {/* Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} flex items-center justify-center`}>
                <span className="text-4xl opacity-30">📚</span>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex items-center gap-3 text-white text-sm">
                  <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> Like</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> Comment</span>
                </div>
              </div>

              {/* Instagram icon */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Instagram className="w-4 h-4 text-white drop-shadow-lg" />
              </div>
            </motion.a>
          ))}
        </div>

        <div className="text-center">
          <a
            href="https://www.instagram.com/educampushubofficial"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white border-0 h-11 px-6 rounded-xl font-semibold hover:opacity-90 transition-opacity">
              <Instagram className="w-4 h-4 mr-2" />
              Follow @educampushubofficial
              <ExternalLink className="w-3 h-3 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
