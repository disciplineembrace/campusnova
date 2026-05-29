'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Home, LayoutGrid, PlusCircle, BookOpen, Brain } from 'lucide-react'
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
import TermsPage from '@/components/campus/TermsPage'
import PrivacyPage from '@/components/campus/PrivacyPage'
import BookReaderPage from '@/components/campus/BookReaderPage'
import LearningDashboard from '@/components/campus/LearningDashboard'
import SavedMaterialsPage from '@/components/campus/SavedMaterialsPage'
import CategoryExplorerPage from '@/components/campus/CategoryExplorerPage'

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
  terms: TermsPage,
  privacy: PrivacyPage,
  reader: BookReaderPage,
  dashboard: LearningDashboard,
  saved: SavedMaterialsPage,
  categories: CategoryExplorerPage,
}

const MOBILE_NAV_ITEMS = [
  { icon: Home, label: 'Home', page: 'home' as PageType },
  { icon: LayoutGrid, label: 'Categories', page: 'categories' as PageType },
  { icon: PlusCircle, label: 'Sell', page: 'sell' as PageType, isCenter: true },
  { icon: BookOpen, label: 'Reader', page: 'reader' as PageType },
  { icon: Brain, label: 'Dashboard', page: 'dashboard' as PageType },
]

function MobileBottomNav() {
  const { currentPage, setCurrentPage, currentUser } = useAppStore()

  if (currentPage === 'reader') return null

  const handleNavClick = (page: PageType) => {
    if (page === 'dashboard' && !currentUser) {
      setCurrentPage('login')
    } else {
      setCurrentPage(page)
    }
  }

  const getActivePage = (page: PageType) => {
    if (page === 'home') return currentPage === 'home'
    if (page === 'categories') return currentPage === 'categories' || currentPage === 'explore'
    if (page === 'reader') return currentPage === 'reader'
    if (page === 'dashboard') return currentPage === 'dashboard' || currentPage === 'profile' || currentPage === 'saved' || currentPage === 'wishlist'
    return currentPage === page
  }

  return (
    <div className="mobile-nav fixed bottom-0 left-0 right-0 z-50 md:hidden safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {MOBILE_NAV_ITEMS.map(item => {
          const isActive = getActivePage(item.page)

          if (item.isCenter) {
            return (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className="relative -mt-6 flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-full btn-gradient flex items-center justify-center shadow-lg shadow-brand/30">
                  <PlusCircle className="w-7 h-7 text-white" />
                </div>
                <span className="text-[10px] font-medium text-brand mt-1">Sell</span>
              </button>
            )
          }

          return (
            <button
              key={item.page}
              onClick={() => handleNavClick(item.page)}
              className="flex flex-col items-center gap-0.5 py-1 px-3 min-w-[48px]"
            >
              <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-brand' : 'text-muted-foreground'}`} />
              <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-brand' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-brand mt-0.5" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function CampusNova() {
  const { currentPage, darkMode } = useAppStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const PageComponent = PAGE_COMPONENTS[currentPage] || HomePage

  // Hide navbar and footer in reader mode for immersive reading
  const isReaderMode = currentPage === 'reader'

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!isReaderMode && <Navbar />}
      <main className="flex-1 pb-20 md:pb-0">
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
      {!isReaderMode && <Footer />}
      <MobileBottomNav />
    </div>
  )
}
