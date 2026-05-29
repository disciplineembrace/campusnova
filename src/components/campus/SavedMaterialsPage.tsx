'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bookmark, Heart, BookOpen, FileText, Trash2, Filter } from 'lucide-react'
import { useAppStore, CATEGORIES, formatINR } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'

interface Listing {
  id: string
  title: string
  sellingPrice: number
  originalPrice: number
  category: string
  condition: string
  city: string
  isDigital: boolean
  listingType: string
  views: number
  seller: { name: string; college: string | null; isVerified: boolean; rating: number }
}

export default function SavedMaterialsPage() {
  const { savedMaterials, toggleSavedMaterial, wishlist, toggleWishlist, bookmarks, toggleBookmark, setCurrentPage, setSelectedProductId } = useAppStore()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('saved')

  const allIds = [...new Set([...savedMaterials, ...wishlist, ...bookmarks])]

  useEffect(() => {
    const fetchListings = async () => {
      if (allIds.length === 0) {
        setListings([])
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const results = await Promise.all(
          allIds.map(id => fetch(`/api/listings?id=${id}`).then(r => r.json()).then(d => d.listing).catch(() => null))
        )
        setListings(results.filter(Boolean) as Listing[])
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [savedMaterials.length, wishlist.length, bookmarks.length])

  const handleCardClick = (id: string) => {
    setSelectedProductId(id)
    setCurrentPage('product')
  }

  const getIdsForTab = () => {
    if (activeTab === 'saved') return savedMaterials
    if (activeTab === 'wishlist') return wishlist
    return bookmarks
  }

  const filteredListings = listings.filter(l => getIdsForTab().includes(l.id))

  const emptyMessages = {
    saved: { title: 'No Saved Materials', desc: 'Save books and notes to access them quickly' },
    wishlist: { title: 'Wishlist is Empty', desc: 'Add items you want to buy to your wishlist' },
    bookmarks: { title: 'No Bookmarks', desc: 'Bookmark reading materials to continue later' },
  }

  return (
    <div className="pt-20 pb-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 font-heading">
            My <span className="gradient-text">Collection</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            {allIds.length} items in your collection
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="saved" className="gap-1.5 rounded-xl">
              <Bookmark className="w-3.5 h-3.5" /> Saved ({savedMaterials.length})
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="gap-1.5 rounded-xl">
              <Heart className="w-3.5 h-3.5" /> Wishlist ({wishlist.length})
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="gap-1.5 rounded-xl">
              <BookOpen className="w-3.5 h-3.5" /> Bookmarks ({bookmarks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-52 rounded-2xl" />
                ))}
              </div>
            ) : filteredListings.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Bookmark className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{emptyMessages[activeTab as keyof typeof emptyMessages].title}</h3>
                <p className="text-muted-foreground text-sm mb-6">{emptyMessages[activeTab as keyof typeof emptyMessages].desc}</p>
                <Button onClick={() => setCurrentPage('explore')} className="btn-gradient text-white border-0 rounded-xl">
                  <span>Explore Listings</span>
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredListings.map((listing, i) => {
                  const cat = CATEGORIES.find(c => c.id === listing.category)
                  const savings = listing.originalPrice > 0 ? Math.round(((listing.originalPrice - listing.sellingPrice) / listing.originalPrice) * 100) : 0
                  const isSaved = savedMaterials.includes(listing.id)
                  const isWishlisted = wishlist.includes(listing.id)
                  const isBookmarked = bookmarks.includes(listing.id)

                  return (
                    <motion.div
                      key={listing.id}
                      className="group card-premium glow-hover overflow-hidden cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -4 }}
                      onClick={() => handleCardClick(listing.id)}
                    >
                      <div className={`relative aspect-[4/3] bg-gradient-to-br ${cat?.color || 'from-gray-400 to-gray-500'} flex items-center justify-center`}>
                        <BookOpen className="w-10 h-10 text-white/50" />
                        {listing.isDigital && (
                          <Badge className="absolute top-2 left-2 digital-pulse bg-cyan text-white border-0 text-[9px] px-1.5 py-0.5 rounded-full">
                            Digital
                          </Badge>
                        )}
                        {listing.listingType === 'giveaway' && (
                          <Badge className="absolute top-2 left-2 bg-emerald-500 text-white border-0 text-[9px] px-1.5 py-0.5 rounded-full">FREE</Badge>
                        )}
                        {savings > 0 && (
                          <Badge className="absolute bottom-2 left-2 bg-emerald-500 text-white border-0 text-xs font-bold rounded-full px-2">
                            Save {savings}%
                          </Badge>
                        )}
                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                          {isSaved && (
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleSavedMaterial(listing.id) }}
                              className="w-7 h-7 rounded-full bg-white/80 dark:bg-black/50 flex items-center justify-center backdrop-blur-sm"
                            >
                              <Bookmark className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            </button>
                          )}
                          {isWishlisted && (
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleWishlist(listing.id) }}
                              className="w-7 h-7 rounded-full bg-white/80 dark:bg-black/50 flex items-center justify-center backdrop-blur-sm"
                            >
                              <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                            </button>
                          )}
                          {isBookmarked && (
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleBookmark(listing.id) }}
                              className="w-7 h-7 rounded-full bg-white/80 dark:bg-black/50 flex items-center justify-center backdrop-blur-sm"
                            >
                              <BookOpen className="w-3.5 h-3.5 fill-brand text-brand" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-foreground text-sm leading-snug mb-1 line-clamp-2 group-hover:text-brand transition-colors">
                          {listing.title}
                        </h3>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-base font-bold text-brand">{listing.listingType === 'giveaway' ? 'FREE' : formatINR(listing.sellingPrice)}</span>
                          {listing.originalPrice > 0 && listing.listingType !== 'giveaway' && (
                            <span className="text-xs text-muted-foreground line-through">{formatINR(listing.originalPrice)}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-[9px] rounded-full">{listing.condition}</Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive rounded-lg"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (activeTab === 'saved') toggleSavedMaterial(listing.id)
                              else if (activeTab === 'wishlist') toggleWishlist(listing.id)
                              else toggleBookmark(listing.id)
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
