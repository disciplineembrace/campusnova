'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Star, BookOpen, Heart, Settings, BadgeCheck, MapPin, GraduationCap, Mail, Phone, ArrowLeft } from 'lucide-react'
import { useAppStore, formatINR, CATEGORIES } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { INDIAN_CITIES } from '@/lib/store'

interface UserListing {
  id: string
  title: string
  sellingPrice: number
  originalPrice: number
  category: string
  city: string
  condition: string
  isSold: boolean
  views: number
}

export default function ProfilePage() {
  const { currentUser, setCurrentPage, setCurrentUser, setSelectedProductId, wishlist } = useAppStore()
  const [myListings, setMyListings] = useState<UserListing[]>([])
  const [wishlistListings, setWishlistListings] = useState<UserListing[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', college: '', city: '', phone: '', whatsapp: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!currentUser) return
    setEditForm({
      name: currentUser.name,
      college: currentUser.college || '',
      city: currentUser.city || '',
      phone: currentUser.phone || '',
      whatsapp: currentUser.whatsapp || '',
    })

    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/listings?limit=50')
        const data = await res.json()
        const allListings = data.listings || []
        setMyListings(allListings.filter((l: UserListing & { seller: { id: string } }) => l.seller?.id === currentUser.id))
        setWishlistListings(allListings.filter((l: UserListing & { id: string }) => wishlist.includes(l.id)))
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [currentUser, wishlist])

  const handleSaveProfile = async () => {
    if (!currentUser) return
    setSaving(true)
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentUser.id, ...editForm })
      })
      const data = await res.json()
      setCurrentUser({ ...currentUser, ...editForm })
      setEditing(false)
    } catch (err) {
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }

  if (!currentUser) {
    return (
      <div className="pt-20 pb-10 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Please login</h3>
          <Button onClick={() => setCurrentPage('login')} className="btn-gradient text-white border-0">
            <span>Login</span>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 pb-10 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Button variant="ghost" onClick={() => setCurrentPage('home')} className="gap-2 -ml-2 rounded-xl">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </motion.div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-6 card-premium">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand to-purple flex items-center justify-center text-white text-2xl font-bold shrink-0 ring-4 ring-brand/10">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-foreground font-heading">{currentUser.name}</h1>
                  {currentUser.isVerified && <BadgeCheck className="w-5 h-5 text-brand" />}
                  {currentUser.isAdmin && <Badge className="bg-brand text-white border-0 text-xs rounded-full">Admin</Badge>}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{currentUser.email}</span>
                  {currentUser.college && <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" />{currentUser.college}</span>}
                  {currentUser.city && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{currentUser.city}</span>}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium">{currentUser.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{currentUser.totalSales} sales</span>
                </div>
              </div>
              <Button variant="outline" onClick={() => setEditing(!editing)} className="gap-2 shrink-0 rounded-xl">
                <Settings className="w-4 h-4" /> {editing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            {editing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 pt-6 border-t border-border space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1.5 block">Name</Label>
                    <Input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} className="h-10 rounded-xl" />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">College</Label>
                    <Input value={editForm.college} onChange={e => setEditForm(p => ({ ...p, college: e.target.value }))} className="h-10 rounded-xl" />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">City</Label>
                    <Select value={editForm.city} onValueChange={v => setEditForm(p => ({ ...p, city: v }))}>
                      <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="Select city" /></SelectTrigger>
                      <SelectContent>
                        {INDIAN_CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Phone</Label>
                    <Input value={editForm.phone} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} className="h-10 rounded-xl" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="mb-1.5 block">WhatsApp Number</Label>
                    <Input value={editForm.whatsapp} onChange={e => setEditForm(p => ({ ...p, whatsapp: e.target.value }))} className="h-10 rounded-xl" />
                  </div>
                </div>
                <Button onClick={handleSaveProfile} disabled={saving} className="btn-gradient text-white border-0 rounded-xl">
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </Button>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Listings', value: myListings.length, icon: BookOpen },
            { label: 'Sales', value: currentUser.totalSales, icon: Star },
            { label: 'Rating', value: currentUser.rating.toFixed(1), icon: BadgeCheck },
          ].map(stat => (
            <Card key={stat.label} className="p-4 card-premium text-center">
              <stat.icon className="w-5 h-5 text-brand mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground font-heading">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="listings">
          <TabsList className="mb-6">
            <TabsTrigger value="listings" className="gap-2 rounded-xl"><BookOpen className="w-4 h-4" /> My Listings</TabsTrigger>
            <TabsTrigger value="wishlist" className="gap-2 rounded-xl"><Heart className="w-4 h-4" /> Wishlist</TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            {myListings.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                <p className="text-muted-foreground text-sm mb-4">Start selling your books!</p>
                <Button onClick={() => setCurrentPage('sell')} className="btn-gradient text-white border-0">
                  <span>Sell Now</span>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {myListings.map(listing => {
                  const lcat = CATEGORIES.find(c => c.id === listing.category)
                  return (
                    <Card
                      key={listing.id}
                      className="overflow-hidden cursor-pointer hover:shadow-md transition-all card-premium"
                      onClick={() => { setSelectedProductId(listing.id); setCurrentPage('product') }}
                    >
                      <div className={`aspect-[4/3] bg-gradient-to-br ${lcat?.color || 'from-gray-400 to-gray-500'} flex items-center justify-center relative`}>
                        <BookOpen className="w-8 h-8 text-white/50" />
                        {listing.isSold && <Badge className="absolute bg-gray-500 text-white border-0 rounded-full">Sold</Badge>}
                      </div>
                      <div className="p-3">
                        <h4 className="text-sm font-medium line-clamp-1">{listing.title}</h4>
                        <p className="text-base font-bold text-brand mt-1">{formatINR(listing.sellingPrice)}</p>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="wishlist">
            {wishlistListings.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground text-sm mb-4">Save books you&apos;re interested in</p>
                <Button onClick={() => setCurrentPage('explore')} variant="outline" className="rounded-xl">Browse Books</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {wishlistListings.map(listing => {
                  const lcat = CATEGORIES.find(c => c.id === listing.category)
                  return (
                    <Card
                      key={listing.id}
                      className="overflow-hidden cursor-pointer hover:shadow-md transition-all card-premium"
                      onClick={() => { setSelectedProductId(listing.id); setCurrentPage('product') }}
                    >
                      <div className={`aspect-[4/3] bg-gradient-to-br ${lcat?.color || 'from-gray-400 to-gray-500'} flex items-center justify-center`}>
                        <BookOpen className="w-8 h-8 text-white/50" />
                      </div>
                      <div className="p-3">
                        <h4 className="text-sm font-medium line-clamp-1">{listing.title}</h4>
                        <p className="text-base font-bold text-brand mt-1">{formatINR(listing.sellingPrice)}</p>
                      </div>
                    </Card>
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
