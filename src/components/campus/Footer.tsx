'use client'

import { Sparkles, Instagram, Linkedin, Twitter, Mail, Heart } from 'lucide-react'
import { useAppStore, type PageType } from '@/lib/store'

const FOOTER_LINKS = {
  'About': [
    { label: 'Browse Books', page: 'explore' as PageType },
    { label: 'Sell Your Books', page: 'sell' as PageType },
    { label: 'Wishlist', page: 'wishlist' as PageType },
    { label: 'Login', page: 'login' as PageType },
  ],
  'Categories': [
    { label: 'Medical', page: 'explore' as PageType, category: 'medical' },
    { label: 'Engineering', page: 'explore' as PageType, category: 'engineering' },
    { label: 'NEET / JEE', page: 'explore' as PageType, category: 'neet-jee' },
    { label: 'UPSC / GPSC', page: 'explore' as PageType, category: 'upsc' },
  ],
  'Support': [
    { label: 'Privacy Policy', page: 'privacy' as PageType },
    { label: 'Terms & Conditions', page: 'terms' as PageType },
  ],
  'Connect': [],
} as const

export default function Footer() {
  const { setCurrentPage, setSelectedCategory } = useAppStore()

  const handleLinkClick = (page: PageType, category?: string) => {
    if (category) setSelectedCategory(category)
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-navy dark:bg-navy-light text-white mt-auto relative">
      {/* Gradient top border */}
      <div className="h-1 bg-gradient-to-r from-brand via-purple to-cyan" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-purple flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-heading">
                Campus<span className="gradient-text">Nova</span>
              </span>
            </div>
            <p className="text-sm text-blue-200/70 leading-relaxed mb-6 max-w-sm">
              India&apos;s premium student ecosystem for buying and selling old books, notes, and study essentials directly with fellow students.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-brand/30 transition-all hover:shadow-lg hover:shadow-brand/10">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-brand/30 transition-all hover:shadow-lg hover:shadow-brand/10">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-brand/30 transition-all hover:shadow-lg hover:shadow-brand/10">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-brand/30 transition-all hover:shadow-lg hover:shadow-brand/10">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider font-heading">{title}</h3>
              {title === 'Connect' ? (
                <div className="space-y-2.5">
                  <p className="text-sm text-blue-200/70">support@campusnova.in</p>
                  <p className="text-sm text-blue-200/70">Mumbai, India</p>
                </div>
              ) : (
                <ul className="space-y-2.5">
                  {links.map(link => (
                    <li key={link.label}>
                      <button
                        onClick={() => handleLinkClick(link.page, 'category' in link ? link.category : undefined)}
                        className="text-sm text-blue-200/70 hover:text-white transition-colors hover:translate-x-1 inline-block"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-blue-200/50">
            © 2025 CampusNova. All rights reserved.
          </p>
          <p className="text-xs text-blue-200/50 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> in India
          </p>
        </div>
      </div>
    </footer>
  )
}
