'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Upload, Check, ArrowLeft, Eye } from 'lucide-react'
import { useAppStore, CATEGORIES, INDIAN_CITIES, CONDITIONS, SEMESTERS, formatINR } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

export default function SellProductPage() {
  const { currentUser, setCurrentPage } = useAppStore()
  const [form, setForm] = useState({
    title: '',
    description: '',
    originalPrice: '',
    sellingPrice: '',
    category: '',
    course: '',
    semester: '',
    college: '',
    city: '',
    condition: '',
    whatsappNumber: currentUser?.whatsapp || '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const cat = CATEGORIES.find(c => c.id === form.category)
  const savings = form.originalPrice && form.sellingPrice ? Math.round(((Number(form.originalPrice) - Number(form.sellingPrice)) / Number(form.originalPrice)) * 100) : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) {
      setCurrentPage('login')
      return
    }
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          originalPrice: Number(form.originalPrice) || 0,
          sellingPrice: Number(form.sellingPrice),
          category: form.category,
          course: form.course || null,
          semester: form.semester || null,
          college: form.college || null,
          city: form.city,
          condition: form.condition,
          whatsappNumber: form.whatsappNumber,
          sellerId: currentUser.id,
        })
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create listing')
        return
      }

      setSuccess(true)
      setForm({
        title: '', description: '', originalPrice: '', sellingPrice: '',
        category: '', course: '', semester: '', college: '', city: '',
        condition: '', whatsappNumber: currentUser?.whatsapp || '',
      })
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="pt-20 pb-10 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Listing Created! 🎉</h2>
          <p className="text-muted-foreground mb-6">Your book is now live on CampusBazaar. Students will be able to find and contact you on WhatsApp.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => setCurrentPage('explore')} className="btn-gradient text-white border-0">
              Browse Books
            </Button>
            <Button variant="outline" onClick={() => setSuccess(false)}>
              List Another
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="pt-20 pb-10 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">Login to Sell</h3>
          <p className="text-muted-foreground mb-6">You need to be logged in to list your books</p>
          <Button onClick={() => setCurrentPage('login')} className="btn-gradient text-white border-0">
            Login Now
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-20 pb-10 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Back button */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Button variant="ghost" onClick={() => setCurrentPage('home')} className="gap-2 -ml-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Sell Your <span className="gradient-text">Books</span>
          </h1>
          <p className="text-muted-foreground">List your book in under 2 minutes and reach thousands of students</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="lg:col-span-3 space-y-5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <Label className="mb-1.5 block">Book / Product Name *</Label>
              <Input
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
                placeholder="e.g., HC Verma Concepts of Physics Vol 1"
                required
                className="h-11 rounded-xl"
              />
            </div>

            <div>
              <Label className="mb-1.5 block">Description *</Label>
              <Textarea
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
                placeholder="Describe the book's condition, edition, any highlights or notes..."
                required
                className="min-h-[100px] rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5 block">Original Price (₹)</Label>
                <Input
                  type="number"
                  value={form.originalPrice}
                  onChange={e => handleChange('originalPrice', e.target.value)}
                  placeholder="e.g., 750"
                  className="h-11 rounded-xl"
                />
              </div>
              <div>
                <Label className="mb-1.5 block">Selling Price (₹) *</Label>
                <Input
                  type="number"
                  value={form.sellingPrice}
                  onChange={e => handleChange('sellingPrice', e.target.value)}
                  placeholder="e.g., 350"
                  required
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5 block">Category *</Label>
                <Select value={form.category} onValueChange={v => handleChange('category', v)} required>
                  <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block">Condition *</Label>
                <Select value={form.condition} onValueChange={v => handleChange('condition', v)} required>
                  <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select condition" /></SelectTrigger>
                  <SelectContent>
                    {CONDITIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5 block">Course</Label>
                <Input
                  value={form.course}
                  onChange={e => handleChange('course', e.target.value)}
                  placeholder="e.g., Physics, CSE"
                  className="h-11 rounded-xl"
                />
              </div>
              <div>
                <Label className="mb-1.5 block">Semester</Label>
                <Select value={form.semester} onValueChange={v => handleChange('semester', v)}>
                  <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select semester" /></SelectTrigger>
                  <SelectContent>
                    {SEMESTERS.map(s => <SelectItem key={s} value={s}>{s} Semester</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="mb-1.5 block">College Name</Label>
              <Input
                value={form.college}
                onChange={e => handleChange('college', e.target.value)}
                placeholder="e.g., IIT Delhi, AIIMS"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5 block">City *</Label>
                <Select value={form.city} onValueChange={v => handleChange('city', v)} required>
                  <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select city" /></SelectTrigger>
                  <SelectContent>
                    {INDIAN_CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block">WhatsApp Number *</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-input bg-muted text-sm text-muted-foreground">
                    +91
                  </span>
                  <Input
                    value={form.whatsappNumber}
                    onChange={e => handleChange('whatsappNumber', e.target.value)}
                    placeholder="9876543210"
                    required
                    className="h-11 rounded-l-none rounded-r-xl"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <Label className="mb-1.5 block">Upload Images</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-brand/40 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB (Coming soon)</p>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 btn-gradient text-white border-0 rounded-xl text-base font-semibold"
            >
              {submitting ? 'Publishing...' : 'Publish Listing'}
            </Button>
          </motion.form>

          {/* Preview Card */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="sticky top-24">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4" /> Preview
              </h3>
              <Card className="overflow-hidden">
                <div className={`aspect-[4/3] bg-gradient-to-br ${cat?.color || 'from-gray-400 to-gray-500'} flex items-center justify-center`}>
                  <BookOpen className="w-16 h-16 text-white/50" />
                  {savings > 0 && (
                    <Badge className="absolute bottom-3 left-3 bg-emerald-500 text-white border-0 font-bold">
                      {savings}% OFF
                    </Badge>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-semibold text-foreground text-sm leading-snug line-clamp-2">
                    {form.title || 'Book Title'}
                  </h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-brand">
                      {form.sellingPrice ? formatINR(Number(form.sellingPrice)) : '₹0'}
                    </span>
                    {form.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatINR(Number(form.originalPrice))}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {form.condition && (
                      <Badge variant="secondary" className="text-[10px]">{form.condition}</Badge>
                    )}
                    {form.city && (
                      <Badge variant="secondary" className="text-[10px]">{form.city}</Badge>
                    )}
                  </div>
                  <div className="pt-2 border-t border-border flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand to-blue-700 flex items-center justify-center text-white text-[10px] font-bold">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="text-xs font-medium">{currentUser.name}</span>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
