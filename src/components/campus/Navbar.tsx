'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Search, Sun, Moon, Menu, X, Heart, User, LogOut, ChevronDown } from 'lucide-react'
import { useAppStore, type PageType } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const NAV_ITEMS: { label: string; page: PageType }[] = [
  { label: 'Home', page: 'home' },
  { label: 'Explore', page: 'explore' },
  { label: 'Sell', page: 'sell' },
]

export default function Navbar() {
  const { currentPage, setCurrentPage, darkMode, toggleDarkMode, currentUser, setCurrentUser, wishlist, mobileMenuOpen, setMobileMenuOpen, searchQuery, setSearchQuery, setSelectedCategory } = useAppStore()
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSelectedCategory(null)
      setCurrentPage('explore')
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setProfileOpen(false)
    setCurrentPage('home')
  }

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass border-b border-border/50 shadow-sm'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setCurrentPage('home')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-blue-700 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Campus<span className="gradient-text">Bazaar</span>
              </span>
            </motion.div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.page}
                  onClick={() => setCurrentPage(item.page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === item.page
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center gap-2">
              {/* Search */}
              <form onSubmit={handleSearch} className="relative">
                {searchOpen ? (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="flex items-center"
                  >
                    <Input
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search books, notes..."
                      className="h-9 pr-8 text-sm"
                      autoFocus
                      onBlur={() => { if (!searchQuery) setSearchOpen(false) }}
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      <Search className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </motion.div>
                ) : (
                  <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} className="h-9 w-9">
                    <Search className="w-4 h-4" />
                  </Button>
                )}
              </form>

              {/* Dark Mode Toggle */}
              <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="h-9 w-9">
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage('wishlist')}
                className="h-9 w-9 relative"
              >
                <Heart className="w-4 h-4" />
                {wishlist.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-brand text-white border-0">
                    {wishlist.length}
                  </Badge>
                )}
              </Button>

              {/* Profile / Login */}
              {currentUser ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="h-9 gap-2 px-2"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand to-blue-700 flex items-center justify-center text-white text-xs font-bold">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium max-w-[80px] truncate hidden lg:block">{currentUser.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        className="absolute right-0 mt-1 w-52 rounded-xl bg-card border border-border shadow-lg overflow-hidden z-50"
                      >
                        <div className="p-3 border-b border-border">
                          <p className="text-sm font-semibold text-foreground">{currentUser.name}</p>
                          <p className="text-xs text-muted-foreground">{currentUser.college || currentUser.email}</p>
                        </div>
                        <div className="p-1">
                          <button
                            onClick={() => { setCurrentPage('profile'); setProfileOpen(false) }}
                            className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted flex items-center gap-2"
                          >
                            <User className="w-4 h-4" /> My Profile
                          </button>
                          <button
                            onClick={() => { setCurrentPage('wishlist'); setProfileOpen(false) }}
                            className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted flex items-center gap-2"
                          >
                            <Heart className="w-4 h-4" /> Wishlist
                          </button>
                          {currentUser.isAdmin && (
                            <button
                              onClick={() => { setCurrentPage('admin'); setProfileOpen(false) }}
                              className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted flex items-center gap-2"
                            >
                              <BookOpen className="w-4 h-4" /> Admin Panel
                            </button>
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted text-destructive flex items-center gap-2"
                          >
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Button
                  onClick={() => setCurrentPage('login')}
                  className="h-9 btn-gradient text-white border-0 text-sm"
                  size="sm"
                >
                  Login
                </Button>
              )}
            </div>

            {/* Mobile Right Section */}
            <div className="flex md:hidden items-center gap-1">
              <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="h-9 w-9">
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage('wishlist')}
                className="h-9 w-9 relative"
              >
                <Heart className="w-4 h-4" />
                {wishlist.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-brand text-white border-0">
                    {wishlist.length}
                  </Badge>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="h-9 w-9"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-card shadow-xl"
            >
              <div className="pt-20 px-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mb-4">
                  <Input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search books, notes..."
                    className="h-10"
                  />
                </form>

                {/* Mobile Nav Links */}
                <div className="space-y-1">
                  {NAV_ITEMS.map(item => (
                    <button
                      key={item.page}
                      onClick={() => setCurrentPage(item.page)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        currentPage === item.page
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border space-y-1">
                  {currentUser ? (
                    <>
                      <div className="px-4 py-3 mb-2">
                        <p className="text-sm font-semibold">{currentUser.name}</p>
                        <p className="text-xs text-muted-foreground">{currentUser.college || currentUser.email}</p>
                      </div>
                      <button
                        onClick={() => setCurrentPage('profile')}
                        className="w-full text-left px-4 py-3 rounded-xl text-sm hover:bg-muted flex items-center gap-3"
                      >
                        <User className="w-4 h-4" /> My Profile
                      </button>
                      <button
                        onClick={() => setCurrentPage('wishlist')}
                        className="w-full text-left px-4 py-3 rounded-xl text-sm hover:bg-muted flex items-center gap-3"
                      >
                        <Heart className="w-4 h-4" /> Wishlist
                      </button>
                      {currentUser.isAdmin && (
                        <button
                          onClick={() => setCurrentPage('admin')}
                          className="w-full text-left px-4 py-3 rounded-xl text-sm hover:bg-muted flex items-center gap-3"
                        >
                          <BookOpen className="w-4 h-4" /> Admin Panel
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 rounded-xl text-sm text-destructive hover:bg-muted flex items-center gap-3"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setCurrentPage('login')}
                      className="w-full btn-gradient text-white border-0"
                    >
                      Login / Sign Up
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click-away for profile dropdown */}
      {profileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
      )}
    </>
  )
}
