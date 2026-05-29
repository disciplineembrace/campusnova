'use client'

import { BookOpen, Instagram, Linkedin, Twitter, Mail, Heart } from 'lucide-react'
import { useAppStore, type PageType } from '@/lib/store'

const FOOTER_LINKS = {
  'Quick Links': [
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
  'Legal': [
    { label: 'Privacy Policy', page: 'privacy' as PageType },
    { label: 'Terms & Conditions', page: 'terms' as PageType },
  ],
}

export default function Footer() {
  const { setCurrentPage, setSelectedCategory } = useAppStore()

  const handleLinkClick = (page: PageType, category?: string) => {
    if (category) setSelectedCategory(category)
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-navy dark:bg-navy-light text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-blue-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                Campus<span className="text-blue-400">Bazaar</span>
              </span>
            </div>
            <p className="text-sm text-blue-200/70 leading-relaxed mb-4">
              India&apos;s trusted student marketplace for buying and selling old books, notes, and study essentials directly with fellow students.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">{title}</h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleLinkClick(link.page, 'category' in link ? link.category : undefined)}
                      className="text-sm text-blue-200/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-blue-200/50">
            © 2025 CampusBazaar. All rights reserved.
          </p>
          <p className="text-xs text-blue-200/50 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> in India
          </p>
        </div>
      </div>
    </footer>
  )
}
