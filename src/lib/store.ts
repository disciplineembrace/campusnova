import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name: string
  phone?: string | null
  college?: string | null
  city?: string | null
  avatar?: string | null
  isVerified: boolean
  isAdmin: boolean
  isBanned: boolean
  rating: number
  totalSales: number
  whatsapp?: string | null
}

export type PageType = 'home' | 'explore' | 'product' | 'sell' | 'login' | 'profile' | 'wishlist' | 'admin' | 'terms' | 'privacy'

interface AppState {
  currentPage: PageType
  setCurrentPage: (page: PageType) => void
  selectedProductId: string | null
  setSelectedProductId: (id: string | null) => void
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  darkMode: boolean
  toggleDarkMode: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string | null
  setSelectedCategory: (cat: string | null) => void
  wishlist: string[]
  toggleWishlist: (id: string) => void
  setWishlist: (ids: string[]) => void
  notifications: number
  isSeeded: boolean
  setIsSeeded: (val: boolean) => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (val: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentPage: 'home' as PageType,
      setCurrentPage: (page: PageType) => set({ currentPage: page, mobileMenuOpen: false }),
      selectedProductId: null,
      setSelectedProductId: (id: string | null) => set({ selectedProductId: id }),
      currentUser: null,
      setCurrentUser: (user: User | null) => set({ currentUser: user }),
      darkMode: false,
      toggleDarkMode: () => {
        const newMode = !get().darkMode
        set({ darkMode: newMode })
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', newMode)
        }
      },
      searchQuery: '',
      setSearchQuery: (query: string) => set({ searchQuery: query }),
      selectedCategory: null,
      setSelectedCategory: (cat: string | null) => set({ selectedCategory: cat }),
      wishlist: [],
      toggleWishlist: (id: string) => {
        const current = get().wishlist
        if (current.includes(id)) {
          set({ wishlist: current.filter(wid => wid !== id) })
        } else {
          set({ wishlist: [...current, id] })
        }
      },
      setWishlist: (ids: string[]) => set({ wishlist: ids }),
      notifications: 3,
      isSeeded: false,
      setIsSeeded: (val: boolean) => set({ isSeeded: val }),
      mobileMenuOpen: false,
      setMobileMenuOpen: (val: boolean) => set({ mobileMenuOpen: val }),
    }),
    {
      name: 'campusnova-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        darkMode: state.darkMode,
        wishlist: state.wishlist,
        isSeeded: state.isSeeded,
      }),
    }
  )
)

export const CATEGORIES = [
  { id: 'medical', name: 'Medical', icon: 'Stethoscope', color: 'from-rose-500 to-pink-500' },
  { id: 'engineering', name: 'Engineering', icon: 'Wrench', color: 'from-blue-600 to-cyan-500' },
  { id: 'school', name: 'School (11-12th)', icon: 'GraduationCap', color: 'from-violet-500 to-purple-600' },
  { id: 'neet-jee', name: 'NEET / JEE', icon: 'Target', color: 'from-orange-500 to-red-500' },
  { id: 'upsc', name: 'UPSC / GPSC', icon: 'Landmark', color: 'from-teal-500 to-emerald-600' },
  { id: 'law', name: 'Law', icon: 'Scale', color: 'from-slate-700 to-gray-800' },
  { id: 'commerce', name: 'Commerce', icon: 'Calculator', color: 'from-emerald-500 to-green-600' },
  { id: 'hostel', name: 'Hostel Essentials', icon: 'Bed', color: 'from-pink-500 to-fuchsia-500' },
  { id: 'notes', name: 'Notes & PDFs', icon: 'FileText', color: 'from-amber-500 to-yellow-500' },
] as const

export const INDIAN_CITIES = [
  'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata',
  'Hyderabad', 'Pune', 'Jaipur', 'Lucknow', 'Ahmedabad',
  'Chandigarh', 'Bhopal', 'Indore', 'Nagpur', 'Kochi',
  'Coimbatore', 'Vizag', 'Surat', 'Varanasi', 'Guwahati'
] as const

export const CONDITIONS = ['Like New', 'Good', 'Fair', 'Poor'] as const

export const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'] as const

export function formatINR(amount: number): string {
  const numStr = amount.toString()
  let lastThree = numStr.substring(numStr.length - 3)
  const otherNumbers = numStr.substring(0, numStr.length - 3)
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree
  return '₹' + formatted
}
