'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Bookmark, Sun, Moon, Type, ZoomIn, ZoomOut, Maximize2, ChevronLeft, ChevronRight, BookOpen, List, X, Coffee, Plus, Check, RotateCcw } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'

type ReadingMode = 'light' | 'dark' | 'sepia'

interface PageBookmark {
  page: number
  note: string
}

interface BookData {
  title: string
  description?: string
  pages: string[]
  chapters: { title: string; startPage: number; endPage: number }[]
}

export default function BookReaderPage() {
  const { setCurrentPage: navigateToPage, selectedProductId, bookmarks, toggleBookmark, readingProgress, setReadingProgress } = useAppStore()
  const bookId = selectedProductId || ''
  const savedProgress = readingProgress[bookId]
  const [currentPage, setPage] = useState(savedProgress && savedProgress > 1 ? savedProgress : 1)
  const [fontSize, setFontSize] = useState(16)
  const [readingMode, setReadingMode] = useState<ReadingMode>('light')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [zoom, setZoom] = useState(100)
  const [bookData, setBookData] = useState<BookData | null>(null)
  const [loading, setLoading] = useState(true)
  const [pageBookmarks, setPageBookmarks] = useState<PageBookmark[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(`campusnova-bookmarks-${bookId}`)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [bookmarkInput, setBookmarkInput] = useState('')
  const [showBookmarkInput, setShowBookmarkInput] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Fetch listing data for the book
  useEffect(() => {
    const fetchBook = async () => {
      if (!selectedProductId) {
        setLoading(false)
        return
      }
      try {
        const res = await fetch(`/api/listings?id=${selectedProductId}`)
        const data = await res.json()
        if (data.listing) {
          const listing = data.listing
          setBookData({
            title: listing.title,
            description: listing.description,
            pages: listing.description ? [listing.description] : [],
            chapters: listing.description
              ? [{ title: listing.title, startPage: 1, endPage: 1 }]
              : [],
          })
        }
      } catch (err) {
        console.error('Failed to fetch book:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBook()
  }, [selectedProductId])

  const totalPages = bookData?.pages.length || 0
  const isBookmarked = bookmarks.includes(bookId)
  const progressPercent = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0

  const currentChapter = bookData?.chapters.find(
    ch => currentPage >= ch.startPage && currentPage <= ch.endPage
  )

  useEffect(() => {
    if (bookId) setReadingProgress(bookId, currentPage)
  }, [currentPage, bookId, setReadingProgress])

  const savePageBookmarks = useCallback((newBookmarks: PageBookmark[]) => {
    setPageBookmarks(newBookmarks)
    try {
      localStorage.setItem(`campusnova-bookmarks-${bookId}`, JSON.stringify(newBookmarks))
    } catch {
      // ignore
    }
  }, [bookId])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPage(page)
      setShowBookmarkInput(false)
    }
  }

  const addPageBookmark = () => {
    const existing = pageBookmarks.find(b => b.page === currentPage)
    if (existing) return
    const newBookmark: PageBookmark = { page: currentPage, note: bookmarkInput.trim() || `Page ${currentPage}` }
    const updated = [...pageBookmarks, newBookmark].sort((a, b) => a.page - b.page)
    savePageBookmarks(updated)
    setBookmarkInput('')
    setShowBookmarkInput(false)
    if (!isBookmarked) {
      toggleBookmark(bookId)
    }
  }

  const removePageBookmark = (page: number) => {
    const updated = pageBookmarks.filter(b => b.page !== page)
    savePageBookmarks(updated)
  }

  const isCurrentPageBookmarked = pageBookmarks.some(b => b.page === currentPage)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        handlePageChange(currentPage + 1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePageChange(currentPage - 1)
      } else if (e.key === 'b') {
        toggleBookmark(bookId)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, bookId, isBookmarked, toggleBookmark, totalPages])

  const modeClasses: Record<ReadingMode, string> = {
    light: 'bg-white text-gray-900',
    dark: 'reader-dark',
    sepia: 'reader-sepia',
  }

  const headerBgClasses: Record<ReadingMode, string> = {
    light: 'bg-white/90 border-b border-gray-200',
    dark: 'bg-[#1a1a2e]/90 border-b border-gray-700',
    sepia: 'bg-[#f4ecd8]/90 border-b border-amber-200',
  }

  const footerBgClasses: Record<ReadingMode, string> = {
    light: 'bg-white/90 border-t border-gray-200',
    dark: 'bg-[#1a1a2e]/90 border-t border-gray-700',
    sepia: 'bg-[#f4ecd8]/90 border-t border-amber-200',
  }

  const pageContent = bookData?.pages[currentPage - 1] || ''

  // Empty state - no book selected
  if (!loading && !bookData) {
    return (
      <div className={`min-h-screen ${modeClasses[readingMode]} reader-page transition-colors duration-300 flex flex-col`}>
        <div className={`sticky top-0 z-40 ${headerBgClasses[readingMode]} backdrop-blur-md`}>
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigateToPage('home')} className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-sm font-semibold">Book Reader</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand/10 to-purple/10 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-brand" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2 font-heading">No Book Selected</h2>
            <p className="text-muted-foreground mb-6">
              Browse e-books and digital materials from the marketplace to start reading here.
            </p>
            <Button
              onClick={() => navigateToPage('explore')}
              className="btn-gradient text-white border-0 rounded-xl"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Browse E-books
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  // Empty book - no pages
  if (!loading && bookData && totalPages === 0) {
    return (
      <div className={`min-h-screen ${modeClasses[readingMode]} reader-page transition-colors duration-300 flex flex-col`}>
        <div className={`sticky top-0 z-40 ${headerBgClasses[readingMode]} backdrop-blur-md`}>
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigateToPage('home')} className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-sm font-semibold truncate">{bookData.title}</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand/10 to-purple/10 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-brand" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2 font-heading">{bookData.title}</h2>
            <p className="text-muted-foreground mb-6">
              This listing does not have readable content yet. The seller may add digital pages in the future.
            </p>
            <Button
              onClick={() => navigateToPage('explore')}
              className="btn-gradient text-white border-0 rounded-xl"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Browse More
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <BookOpen className="w-12 h-12 text-brand" />
          <p className="text-muted-foreground text-sm">Loading book...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${modeClasses[readingMode]} reader-page transition-colors duration-300`}>
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1">
        <Progress value={progressPercent} className="h-1 rounded-none" />
      </div>

      {/* Header */}
      <div className={`sticky top-1 z-40 ${controlsVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ${headerBgClasses[readingMode]} backdrop-blur-md`}>
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigateToPage('home')} className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold truncate max-w-[200px] sm:max-w-[400px]">{bookData?.title}</h1>
              <p className="text-xs opacity-60">
                Page {currentPage} of {totalPages} {currentChapter ? `· ${currentChapter.title}` : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (isCurrentPageBookmarked) {
                  removePageBookmark(currentPage)
                } else {
                  setShowBookmarkInput(!showBookmarkInput)
                }
              }}
              className="rounded-xl"
              title={isCurrentPageBookmarked ? 'Remove page bookmark' : 'Bookmark this page'}
            >
              <Bookmark className={`w-5 h-5 ${isCurrentPageBookmarked ? 'fill-yellow-500 text-yellow-500' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => toggleBookmark(bookId)} className="rounded-xl" title="Save to library">
              <BookOpen className={`w-5 h-5 ${isBookmarked ? 'text-brand fill-brand/20' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-xl">
              <List className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const modes: ReadingMode[] = ['light', 'sepia', 'dark']
                const next = modes[(modes.indexOf(readingMode) + 1) % modes.length]
                setReadingMode(next)
              }}
              className="rounded-xl"
            >
              {readingMode === 'dark' ? <Sun className="w-5 h-5" /> : readingMode === 'sepia' ? <Coffee className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setFontSize(f => Math.min(f + 2, 24))} className="rounded-xl hidden sm:flex" title="Increase font">
              <Type className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setFontSize(f => Math.max(f - 2, 12))} className="rounded-xl hidden sm:flex" title="Decrease font">
              <Type className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Bookmark Input */}
        <AnimatePresence>
          {showBookmarkInput && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border/50"
            >
              <div className="max-w-4xl mx-auto px-4 py-2 flex items-center gap-2">
                <Input
                  value={bookmarkInput}
                  onChange={e => setBookmarkInput(e.target.value)}
                  placeholder={`Add note for page ${currentPage}...`}
                  className="h-8 text-sm rounded-lg"
                  onKeyDown={e => {
                    if (e.key === 'Enter') addPageBookmark()
                    if (e.key === 'Escape') { setShowBookmarkInput(false); setBookmarkInput('') }
                  }}
                  autoFocus
                />
                <Button size="sm" onClick={addPageBookmark} className="h-8 rounded-lg shrink-0">
                  <Plus className="w-3 h-3 mr-1" /> Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setShowBookmarkInput(false); setBookmarkInput('') }} className="h-8 rounded-lg shrink-0">
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar - Table of Contents & Bookmarks */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className={`fixed left-0 top-0 bottom-0 w-80 z-50 ${readingMode === 'dark' ? 'bg-[#1a1a2e]' : readingMode === 'sepia' ? 'bg-[#f4ecd8]' : 'bg-white'} shadow-2xl overflow-y-auto`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Navigation</h3>
                  <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="rounded-xl h-8 w-8">
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Table of Contents */}
                {bookData && bookData.chapters.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold uppercase tracking-wider opacity-50 mb-2">Table of Contents</h4>
                    <div className="space-y-1">
                      {bookData.chapters.map(ch => (
                        <button
                          key={ch.title}
                          onClick={() => { handlePageChange(ch.startPage); setSidebarOpen(false) }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${
                            currentPage >= ch.startPage && currentPage <= ch.endPage
                              ? 'bg-brand/10 text-brand font-medium'
                              : 'opacity-70 hover:opacity-100 hover:bg-black/5'
                          }`}
                        >
                          {ch.title}
                          <span className="text-xs opacity-50 ml-1">({ch.startPage}-{ch.endPage})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Page Bookmarks */}
                <div className="pt-4 border-t border-border">
                  <h4 className="text-xs font-semibold uppercase tracking-wider opacity-50 mb-2 flex items-center gap-2">
                    <Bookmark className="w-3 h-3 fill-yellow-500 text-yellow-500" /> Page Bookmarks
                  </h4>
                  {pageBookmarks.length === 0 ? (
                    <p className="text-xs opacity-40 px-3 py-2">No page bookmarks yet. Press the bookmark icon to add one.</p>
                  ) : (
                    <div className="space-y-1">
                      {pageBookmarks.map(bm => (
                        <div
                          key={bm.page}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer group ${
                            bm.page === currentPage
                              ? 'bg-brand/10 text-brand font-medium'
                              : 'opacity-70 hover:opacity-100 hover:bg-black/5'
                          }`}
                          onClick={() => { handlePageChange(bm.page); setSidebarOpen(false) }}
                        >
                          <Bookmark className="w-3 h-3 fill-yellow-500 text-yellow-500 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <span className="font-medium">Page {bm.page}</span>
                            {bm.note && <span className="text-xs opacity-60 ml-1">— {bm.note}</span>}
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); removePageBookmark(bm.page) }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Continue Reading */}
                {savedProgress && savedProgress > 1 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <button
                      onClick={() => { handlePageChange(savedProgress); setSidebarOpen(false) }}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-black/5 flex items-center gap-2"
                    >
                      <RotateCcw className="w-3 h-3" /> Continue from page {savedProgress}
                    </button>
                  </div>
                )}

                {/* Reading Stats */}
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="text-xs font-semibold uppercase tracking-wider opacity-50 mb-2">Reading Stats</h4>
                  <div className="grid grid-cols-2 gap-2 px-3">
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <div className="text-lg font-bold text-brand">{progressPercent}%</div>
                      <div className="text-[10px] opacity-60">Complete</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <div className="text-lg font-bold">{currentPage}/{totalPages}</div>
                      <div className="text-[10px] opacity-60">Pages Read</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <div className="text-lg font-bold">{pageBookmarks.length}</div>
                      <div className="text-[10px] opacity-60">Bookmarks</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <div className="text-lg font-bold">{totalPages - currentPage}</div>
                      <div className="text-[10px] opacity-60">Remaining</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Reader Content */}
      <div
        className="max-w-3xl mx-auto px-6 py-8 cursor-pointer select-none"
        onClick={() => setControlsVisible(v => !v)}
      >
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <div
            className={`rounded-lg shadow-lg p-8 sm:p-12 ${readingMode === 'light' ? 'bg-white' : readingMode === 'dark' ? 'bg-[#1e1e3a]' : 'bg-[#faf6eb]'} border border-border/30`}
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.8, transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            {isCurrentPageBookmarked && (
              <div className="absolute -top-1 right-6 w-5 h-8 bg-yellow-400 rounded-b-sm opacity-80 shadow-sm" />
            )}
            <div className="whitespace-pre-wrap">
              {pageContent}
            </div>
          </div>

          <div className="text-center mt-4 text-xs opacity-40">
            — {currentPage} —
          </div>
        </motion.div>

        {pageBookmarks.filter(b => b.page === currentPage).map(bm => (
          <div key={bm.page} className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <Bookmark className="w-4 h-4 text-yellow-500 fill-yellow-500 shrink-0" />
            <span className="text-sm">{bm.note}</span>
          </div>
        ))}
      </div>

      {/* Bottom Navigation Bar */}
      <div className={`sticky bottom-0 z-40 ${controlsVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ${footerBgClasses[readingMode]} backdrop-blur-md`}>
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-xs opacity-60 w-8 text-right">{currentPage}</span>
            <Slider
              value={[currentPage]}
              min={1}
              max={totalPages}
              step={1}
              onValueChange={(v) => handlePageChange(v[0])}
              className="flex-1"
            />
            <span className="text-xs opacity-60 w-8">{totalPages}</span>
          </div>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-xl gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {progressPercent}% read
              </Badge>
              {currentChapter && bookData && (
                <Badge variant="outline" className="text-[10px] hidden sm:flex">
                  Ch. {bookData.chapters.indexOf(currentChapter) + 1}
                </Badge>
              )}
              <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.min(z + 10, 150))} className="h-8 w-8 rounded-lg hidden sm:flex">
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.max(z - 10, 70))} className="h-8 w-8 rounded-lg hidden sm:flex">
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setZoom(100)} className="h-8 w-8 rounded-lg hidden sm:flex" title="Reset zoom">
                <Maximize2 className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="h-8 w-8 rounded-lg hidden sm:flex" title="Fullscreen">
                <Check className="w-3.5 h-3.5" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-xl gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
