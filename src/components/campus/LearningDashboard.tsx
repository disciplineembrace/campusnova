'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, FileText, Download, Flame, TrendingUp, Clock, Bookmark, BookMarked, PenTool, Library, Sparkles, ArrowRight, Target, Brain, Zap } from 'lucide-react'
import { useAppStore, CATEGORIES, formatINR } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

interface Listing {
  id: string
  title: string
  sellingPrice: number
  category: string
  isDigital: boolean
  listingType: string
  views: number
  images: string
  seller: { name: string; college: string | null }
}

export default function LearningDashboardPage() {
  const { currentUser, setCurrentPage, setSelectedProductId, setSelectedCategory, recentlyViewed, savedMaterials, readingProgress, bookmarks } = useAppStore()
  const [recentListings, setRecentListings] = useState<Listing[]>([])
  const [recommendedListings, setRecommendedListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recentRes, recRes] = await Promise.all([
          fetch('/api/listings?limit=6&sortBy=popular'),
          fetch('/api/listings?limit=6&sortBy=newest'),
        ])
        const recentData = await recentRes.json()
        const recData = await recRes.json()
        setRecentListings(recentData.listings || [])
        setRecommendedListings(recData.listings || [])
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = [
    { icon: BookOpen, label: 'Books Reading', value: Object.keys(readingProgress).length, color: 'from-brand to-purple', change: 'Active' },
    { icon: Bookmark, label: 'Saved Materials', value: savedMaterials.length, color: 'from-amber-500 to-orange-500', change: 'Active' },
    { icon: BookMarked, label: 'Bookmarks', value: bookmarks.length, color: 'from-emerald-500 to-green-600', change: 'Saved' },
    { icon: Clock, label: 'Recently Viewed', value: recentlyViewed.length, color: 'from-rose-500 to-pink-500', change: 'Items' },
  ]

  const studyProgress = [
    { subject: 'Keep exploring', progress: savedMaterials.length > 0 ? 30 : 10, color: 'bg-brand' },
  ]

  const quickActions = [
    { icon: FileText, label: 'Browse Notes', page: 'explore' as const, category: 'notes-pdfs', color: 'from-cyan to-brand' },
    { icon: BookMarked, label: 'Read E-books', page: 'explore' as const, category: 'ebooks', color: 'from-violet-500 to-purple-600' },
    { icon: PenTool, label: 'Handwritten Notes', page: 'explore' as const, category: 'handwritten', color: 'from-pink-500 to-rose-500' },
    { icon: Library, label: 'Sell Old Books', page: 'sell' as const, category: null, color: 'from-amber-500 to-orange-500' },
  ]

  const handleListingClick = (id: string) => {
    setSelectedProductId(id)
    setCurrentPage('product')
  }

  const handleQuickAction = (page: string, category: string | null) => {
    if (category) setSelectedCategory(category)
    setCurrentPage(page as 'explore' | 'sell')
  }

  return (
    <div className="pt-20 pb-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-purple flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-heading">
                Learning <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                {currentUser ? `Welcome back, ${currentUser.name.split(' ')[0]}!` : 'Track your learning journey'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card-premium glow-hover p-4 sm:p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <Badge variant="secondary" className="text-[10px] rounded-full">{stat.change}</Badge>
              </div>
              <p className="text-2xl font-bold text-foreground font-heading">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4 font-heading">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickActions.map(action => (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action.page, action.category)}
                className="p-4 rounded-2xl card-premium glow-hover flex flex-col items-center gap-3 text-center group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-foreground">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Study Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground font-heading">Study Progress</h2>
            <Badge variant="secondary" className="gap-1 rounded-full">
              <TrendingUp className="w-3 h-3" /> This Week
            </Badge>
          </div>
          <Card className="p-5 card-premium">
            <div className="space-y-4">
              {studyProgress.map(subject => (
                <div key={subject.subject}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-foreground">{subject.subject}</span>
                    <span className="text-xs text-muted-foreground">{subject.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${subject.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Continue Reading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground font-heading flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand" /> Continue Reading
              </h2>
            </div>
            {Object.keys(readingProgress).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(readingProgress).slice(0, 4).map(([id, page]) => (
                  <button
                    key={id}
                    onClick={() => { setSelectedProductId(id); setCurrentPage('reader') }}
                    className="w-full p-4 rounded-2xl card-premium glow-hover flex items-center gap-4 text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand to-purple flex items-center justify-center shrink-0">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-brand transition-colors">
                        Study Material #{id.slice(-4)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={Math.min(page * 4, 100)} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground">Page {page}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-brand transition-colors" />
                  </button>
                ))}
              </div>
            ) : (
              <Card className="p-6 card-premium text-center">
                <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-3">No reading in progress</p>
                <Button size="sm" onClick={() => setCurrentPage('explore')} className="btn-gradient text-white border-0 rounded-xl">
                  <span className="flex items-center gap-1.5">Browse E-books <ArrowRight className="w-3 h-3" /></span>
                </Button>
              </Card>
            )}
          </motion.div>

          {/* Saved Materials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground font-heading flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-500" /> Saved Materials
              </h2>
              {savedMaterials.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setCurrentPage('saved')} className="text-xs text-brand rounded-xl">
                  View All
                </Button>
              )}
            </div>
            {savedMaterials.length > 0 ? (
              <div className="space-y-3">
                {savedMaterials.slice(0, 4).map(id => (
                  <button
                    key={id}
                    onClick={() => handleListingClick(id)}
                    className="w-full p-4 rounded-2xl card-premium glow-hover flex items-center gap-4 text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
                      <Bookmark className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-brand transition-colors">
                        Saved Item #{id.slice(-4)}
                      </p>
                      <p className="text-xs text-muted-foreground">Tap to view details</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-brand transition-colors" />
                  </button>
                ))}
              </div>
            ) : (
              <Card className="p-6 card-premium text-center">
                <Bookmark className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-3">No saved materials yet</p>
                <Button size="sm" onClick={() => setCurrentPage('explore')} className="btn-gradient text-white border-0 rounded-xl">
                  <span>Explore & Save</span>
                </Button>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Recommended for You */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground font-heading flex items-center gap-2">
              <Sparkles className="w-5 h-5 ai-badge rounded-lg text-white p-0.5" />
              Recommended for You
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setCurrentPage('explore')} className="text-xs text-brand rounded-xl">
              See All
            </Button>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {recommendedListings.map((listing) => {
                const cat = CATEGORIES.find(c => c.id === listing.category)
                return (
                  <button
                    key={listing.id}
                    onClick={() => handleListingClick(listing.id)}
                    className="card-premium glow-hover overflow-hidden text-left group"
                  >
                    <div className={`aspect-[4/3] bg-gradient-to-br ${cat?.color || 'from-gray-400 to-gray-500'} flex items-center justify-center relative`}>
                      <BookOpen className="w-8 h-8 text-white/50" />
                      {listing.isDigital && (
                        <Badge className="absolute top-2 right-2 digital-pulse bg-cyan text-white border-0 text-[9px] px-1.5 py-0.5 rounded-full">
                          Digital
                        </Badge>
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-medium text-foreground line-clamp-2 group-hover:text-brand transition-colors">{listing.title}</p>
                      <p className="text-xs font-bold text-brand mt-1">{listing.listingType === 'giveaway' ? 'FREE' : formatINR(listing.sellingPrice)}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Trending Now */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground font-heading flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> Trending Now
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentListings.slice(0, 3).map((listing, i) => {
              const cat = CATEGORIES.find(c => c.id === listing.category)
              return (
                <button
                  key={listing.id}
                  onClick={() => handleListingClick(listing.id)}
                  className="p-4 rounded-2xl card-premium glow-hover flex items-center gap-4 text-left group"
                >
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-2xl font-bold text-muted-foreground/20">#{i + 1}</span>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat?.color || 'from-gray-400 to-gray-500'} flex items-center justify-center`}>
                      <Target className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate group-hover:text-brand transition-colors">{listing.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-brand">{listing.listingType === 'giveaway' ? 'FREE' : formatINR(listing.sellingPrice)}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" />{listing.views} views</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
