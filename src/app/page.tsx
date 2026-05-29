'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore, type PageType } from '@/lib/store'
import Navbar from '@/components/campus/Navbar'
import Footer from '@/components/campus/Footer'
import HeroSection from '@/components/campus/HeroSection'
import CategoriesSection from '@/components/campus/CategoriesSection'
import FeaturedListings from '@/components/campus/FeaturedListings'
import WhyChooseSection from '@/components/campus/WhyChooseSection'
import TestimonialsSection from '@/components/campus/TestimonialsSection'
import AppDownloadSection from '@/components/campus/AppDownloadSection'
import ExplorePage from '@/components/campus/ExplorePage'
import ProductDetailPage from '@/components/campus/ProductDetailPage'
import SellProductPage from '@/components/campus/SellProductPage'
import LoginPage from '@/components/campus/LoginPage'
import ProfilePage from '@/components/campus/ProfilePage'
import WishlistPage from '@/components/campus/WishlistPage'
import AdminDashboard from '@/components/campus/AdminDashboard'
import TermsPage from '@/components/campus/TermsPage'
import PrivacyPage from '@/components/campus/PrivacyPage'

function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedListings />
      <WhyChooseSection />
      <TestimonialsSection />
      <AppDownloadSection />
    </div>
  )
}

const PAGE_COMPONENTS: Record<PageType, React.ComponentType> = {
  home: HomePage,
  explore: ExplorePage,
  product: ProductDetailPage,
  sell: SellProductPage,
  login: LoginPage,
  profile: ProfilePage,
  wishlist: WishlistPage,
  admin: AdminDashboard,
  terms: TermsPage,
  privacy: PrivacyPage,
}

export default function CampusBazaar() {
  const { currentPage, darkMode, isSeeded, setIsSeeded } = useAppStore()
  const [seeding, setSeeding] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    if (isSeeded) return
    const checkAndSeed = async () => {
      setSeeding(true)
      try {
        const checkRes = await fetch('/api/seed')
        const checkData = await checkRes.json()
        if (checkData.isSeeded) {
          setIsSeeded(true)
          return
        }
        const seedRes = await fetch('/api/seed', { method: 'POST' })
        const seedData = await seedRes.json()
        if (seedData.seeded) {
          setIsSeeded(true)
        }
      } catch (err) {
        console.error('Seed error:', err)
      } finally {
        setSeeding(false)
      }
    }
    checkAndSeed()
  }, [isSeeded, setIsSeeded])

  const PageComponent = PAGE_COMPONENTS[currentPage] || HomePage

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <PageComponent />
          </motion.div>
        </AnimatePresence>
      </main>
      {currentPage !== 'admin' && <Footer />}
    </div>
  )
}
