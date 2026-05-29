'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, ChevronDown, BookOpen, MapPin, ArrowUpDown, Heart, MessageCircle, BadgeCheck, Flame, Star, Eye } from 'lucide-react'
import { useAppStore, formatINR, CATEGORIES, INDIAN_CITIES, CONDITIONS, SEMESTERS } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

interface Listing {
  id: string
  title: string
  description: string
  originalPrice: number
  sellingPrice: number
  category: string
  course: string | null
  semester: string | null
  city: string
  condition: string
  whatsappNumber: string
  isFeatured: boolean
  isUrgent: boolean
  isVerified: boolean
  views: number
  seller: { id: string; name: string; college: string | null; isVerified: boolean; rating: number }
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price ↑' },
  { value: 'price-high', label: 'Price ↓' },
  { value: 'popular', label: 'Popular' },
]

export default function ExplorePage() {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, wishlist, toggleWishlist, setCurrentPage, setSelectedProductId } = useAppStore()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('newest')
  const [city, setCity] = useState('all')
  const [condition, setCondition] = useState('all')
  const [semester, setSemester] = useState('all')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const fetchListings = useCallback(async (pageNum: number, reset = false) => {
    setLoading(reset)
    try {
      const params = new URLSearchParams()
      params.set('page', pageNum.toString())
      params.set('limit', '12')
      params.set('sortBy', sortBy)
      if (searchQuery) params.set('search', searchQuery)
      if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory)
      if (city && city !== 'all') params.set('city', city)
      if (condition && condition !== 'all') params.set('condition', condition)
      if (semester && semester !== 'all') params.set('semester', semester)

      const res = await fetch(`/api/listings?${params}`)
      const data = await res.json()
      if (reset) {
        setListings(data.listings || [])
      } else {
        setListings(prev => [...prev, ...(data.listings || [])])
      }
      setTotal(data.total || 0)
      setHasMore(data.page < data.pages)
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedCategory, sortBy, city, condition, semester])

  useEffect(() => {
    setPage(1)
    fetchListings(1, true)
  }, [fetchListings])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchListings(nextPage)
  }

  const clearFilters = () => {
    setSelectedCategory(null)
    setCity('all')
    setCondition('all')
    setSemester('all')
    setSearchQuery('')
  }

  const activeFilters = [selectedCategory, city !== 'all' ? city : null, condition !== 'all' ? condition : null, semester !== 'all' ? semester : null].filter(Boolean)

  const handleCardClick = (id: string) => {
    setSelectedProductId(id)
    setCurrentPage('product')
  }

  const cat = CATEGORIES.find(c => c.id === selectedCategory)

  return (
    <div className="pt-20 pb-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 font-heading">
            {cat ? cat.name : 'Explore'} <span className="gradient-text">Books</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            {total > 0 ? `${total} listings found` : 'Search for books, notes, and more'}
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3 mb-6"
        >
          <div className="flex-1 search-modern rounded-xl flex items-center">
            <Search className="ml-3 w-4 h-4 text-muted-foreground shrink-0" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search books, notes, courses..."
              className="h-11 border-0 bg-transparent focus-visible:ring-0 pl-3"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="mr-3">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="h-11 px-4 rounded-xl gap-2 relative shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
            {activeFilters.length > 0 && (
              <Badge className="absolute -top-1.5 -right-1.5 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-brand text-white border-0">
                {activeFilters.length}
              </Badge>
            )}
          </Button>
        </motion.div>

        {/* Sort pills */}
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                sortBy === opt.value
                  ? 'bg-brand text-white shadow-md shadow-brand/20'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map(f => (
              <Badge key={f} variant="secondary" className="gap-1 py-1 px-3 rounded-full">
                {f}
                <button onClick={() => {
                  if (f === selectedCategory) setSelectedCategory(null)
                  if (f === city) setCity('all')
                  if (f === condition) setCondition('all')
                  if (f === semester) setSemester('all')
                }}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground h-6">
              Clear all
            </Button>
          </div>
        )}

        {/* Filters Panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="p-5 rounded-2xl card-premium grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Category</label>
                  <Select value={selectedCategory || 'all'} onValueChange={v => setSelectedCategory(v === 'all' ? null : v)}>
                    <SelectTrigger className="h-9 rounded-xl"><SelectValue placeholder="All Categories" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {CATEGORIES.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">City</label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="h-9 rounded-xl"><SelectValue placeholder="All Cities" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      {INDIAN_CITIES.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Condition</label>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger className="h-9 rounded-xl"><SelectValue placeholder="Any Condition" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Condition</SelectItem>
                      {CONDITIONS.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Semester</label>
                  <Select value={semester} onValueChange={setSemester}>
                    <SelectTrigger className="h-9 rounded-xl"><SelectValue placeholder="Any Semester" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Semester</SelectItem>
                      {SEMESTERS.map(s => (
                        <SelectItem key={s} value={s}>{s} Sem</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Grid */}
        {loading && listings.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card-premium overflow-hidden">
                <Skeleton className="aspect-[4/3]" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No listings found</h3>
            <p className="text-muted-foreground text-sm mb-6">Try adjusting your search or filters</p>
            <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {listings.map((listing, i) => {
                const isWishlisted = wishlist.includes(listing.id)
                const savings = listing.originalPrice > 0 ? Math.round(((listing.originalPrice - listing.sellingPrice) / listing.originalPrice) * 100) : 0
                const lcat = CATEGORIES.find(c => c.id === listing.category)
                const conditionColor: Record<string, string> = {
                  'Like New': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                  'Good': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                  'Fair': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                  'Poor': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                }

                return (
                  <motion.div
                    key={listing.id}
                    className="group card-premium glow-hover overflow-hidden cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    whileHover={{ y: -6 }}
                    onClick={() => handleCardClick(listing.id)}
                  >
                    <div className={`relative aspect-[4/3] bg-gradient-to-br ${lcat?.color || 'from-gray-400 to-gray-500'} flex items-center justify-center`}>
                      <BookOpen className="w-12 h-12 text-white/60" />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {listing.isFeatured && <Badge className="bg-amber-500 text-white border-0 text-[10px] px-2 py-0.5 rounded-full"><Star className="w-3 h-3 mr-0.5" />Featured</Badge>}
                        {listing.isUrgent && <Badge className="bg-red-500 text-white border-0 text-[10px] px-2 py-0.5 rounded-full"><Flame className="w-3 h-3 mr-0.5" />Urgent</Badge>}
                        {listing.isVerified && <Badge className="bg-emerald-500 text-white border-0 text-[10px] px-2 py-0.5 rounded-full"><BadgeCheck className="w-3 h-3 mr-0.5" />Verified</Badge>}
                      </div>
                      <motion.button
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-black/50 flex items-center justify-center backdrop-blur-sm"
                        whileTap={{ scale: 0.85 }}
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(listing.id) }}
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'}`} />
                      </motion.button>
                      {savings > 0 && (
                        <div className="absolute bottom-3 left-3">
                          <Badge className="bg-emerald-500 text-white border-0 text-xs font-bold rounded-full px-2.5">Save {savings}%</Badge>
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white/80 text-xs">
                        <Eye className="w-3 h-3" /> {listing.views}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-brand transition-colors">{listing.title}</h3>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-lg font-bold text-brand">{formatINR(listing.sellingPrice)}</span>
                        {listing.originalPrice > 0 && <span className="text-xs text-muted-foreground line-through">{formatINR(listing.originalPrice)}</span>}
                      </div>
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge variant="secondary" className={`text-[10px] rounded-full ${conditionColor[listing.condition] || ''}`}>{listing.condition}</Badge>
                        <Badge variant="secondary" className="text-[10px] gap-1 rounded-full"><MapPin className="w-2.5 h-2.5" />{listing.city}</Badge>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand to-purple flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                            {listing.seller.name.charAt(0)}
                          </div>
                          <p className="text-xs font-medium text-foreground truncate">{listing.seller.name}</p>
                        </div>
                        <a href={`https://wa.me/91${listing.whatsappNumber}?text=Hi! I saw your listing "${listing.title}" on CampusNova`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                          <Button size="sm" className="h-7 bg-emerald-500 hover:bg-emerald-600 text-white border-0 text-xs px-3 gap-1 rounded-full">
                            <MessageCircle className="w-3 h-3" /> Chat
                          </Button>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-8">
                <Button variant="outline" onClick={loadMore} className="rounded-xl px-8">
                  <ChevronDown className="w-4 h-4 mr-2" /> Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
