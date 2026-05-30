'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Users, BookOpen, AlertTriangle, Star, TrendingUp, Eye, Trash2, Ban, BadgeCheck, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react'
import { useAppStore, formatINR, CATEGORIES } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface Stats {
  totalUsers: number
  totalListings: number
  activeListings: number
  totalReports: number
  unresolvedReports: number
  featuredListings: number
  totalViews: number
  categoryStats: { category: string; count: number }[]
  cityStats: { city: string; count: number }[]
  recentListings: { id: string; title: string; createdAt: string; seller: { name: string; college: string | null } }[]
}

interface ReportItem {
  id: string
  reason: string
  isResolved: boolean
  createdAt: string
  listing: { id: string; title: string }
  reporter: { id: string; name: string; email: string }
}

interface UserItem {
  id: string
  name: string
  email: string
  college: string | null
  city: string | null
  isVerified: boolean
  isBanned: boolean
  isAdmin: boolean
  rating: number
  totalSales: number
  _count: { listings: number }
}

const CHART_COLORS = ['#002868', '#FF6600', '#06B6D4', '#10B981', '#FF8C3A', '#22D3EE', '#F59E0B', '#EC4899', '#1A4D8C']

export default function AdminDashboard() {
  const { currentUser, setCurrentPage } = useAppStore()
  const [stats, setStats] = useState<Stats | null>(null)
  const [reports, setReports] = useState<ReportItem[]>([])
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [statsRes, reportsRes, usersRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/reports'),
        fetch('/api/users'),
      ])
      const [statsData, reportsData, usersData] = await Promise.all([
        statsRes.json(),
        reportsRes.json(),
        usersRes.json(),
      ])
      setStats(statsData)
      setReports(reportsData.reports || [])
      setUsers(usersData.users || [])
    } catch (err) {
      console.error('Admin fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (currentUser?.isAdmin) fetchData()
  }, [currentUser, fetchData])

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Delete this listing?')) return
    try {
      await fetch(`/api/listings?id=${id}`, { method: 'DELETE' })
      fetchData()
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const handleBanUser = async (id: string, isBanned: boolean) => {
    try {
      await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isBanned: !isBanned })
      })
      fetchData()
    } catch (err) {
      console.error('Ban error:', err)
    }
  }

  const handleVerifyListing = async (id: string, isVerified: boolean) => {
    try {
      await fetch('/api/listings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isVerified: !isVerified })
      })
      fetchData()
    } catch (err) {
      console.error('Verify error:', err)
    }
  }

  const handleResolveReport = async (id: string) => {
    try {
      await fetch('/api/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isResolved: true })
      })
      fetchData()
    } catch (err) {
      console.error('Resolve error:', err)
    }
  }

  if (!currentUser?.isAdmin) {
    return (
      <div className="pt-20 pb-10 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Access Denied</h3>
          <p className="text-muted-foreground mb-6">You need admin privileges to access this page</p>
          <Button onClick={() => setCurrentPage('home')} className="btn-gradient text-white border-0">
            <span>Go Home</span>
          </Button>
        </div>
      </div>
    )
  }

  const pieData = stats?.categoryStats.map(c => ({
    name: CATEGORIES.find(cat => cat.id === c.category)?.name || c.category,
    value: c.count
  })) || []

  const barData = stats?.cityStats.map(c => ({ name: c.city, listings: c.count })) || []

  return (
    <div className="pt-20 pb-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => setCurrentPage('home')} className="gap-2 -ml-2 rounded-xl">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </div>
          <Button variant="outline" onClick={fetchData} className="gap-2 rounded-xl">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 font-heading">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-muted-foreground">Manage listings, users, and reports</p>
        </motion.div>

        {loading || !stats ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-6 card-premium"><div className="h-16 bg-muted animate-pulse rounded" /></Card>
            ))}
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'from-brand to-accent' },
                { icon: BookOpen, label: 'Total Listings', value: stats.totalListings, color: 'from-accent to-purple-light' },
                { icon: AlertTriangle, label: 'Active Reports', value: stats.unresolvedReports, color: 'from-red-500 to-rose-500' },
                { icon: Eye, label: 'Total Views', value: stats.totalViews, color: 'from-cyan to-brand' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-5 card-premium">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground mt-1 font-heading">{stat.value.toLocaleString()}</p>
                      </div>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="p-6 card-premium">
                <h3 className="text-sm font-semibold text-foreground mb-4 font-heading">Listings by City</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                    <Tooltip />
                    <Bar dataKey="listings" fill="#002868" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card className="p-6 card-premium">
                <h3 className="text-sm font-semibold text-foreground mb-4 font-heading">Listings by Category</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="reports">
              <TabsList>
                <TabsTrigger value="reports" className="gap-2 rounded-xl"><AlertTriangle className="w-4 h-4" /> Reports ({stats.unresolvedReports})</TabsTrigger>
                <TabsTrigger value="users" className="gap-2 rounded-xl"><Users className="w-4 h-4" /> Users ({stats.totalUsers})</TabsTrigger>
                <TabsTrigger value="recent" className="gap-2 rounded-xl"><TrendingUp className="w-4 h-4" /> Recent</TabsTrigger>
              </TabsList>

              <TabsContent value="reports" className="mt-6">
                {reports.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">No reports found</div>
                ) : (
                  <div className="space-y-3">
                    {reports.map(report => (
                      <Card key={report.id} className={`p-4 card-premium ${report.isResolved ? 'opacity-50' : ''}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-foreground">{report.listing.title}</span>
                              {report.isResolved ? (
                                <Badge variant="secondary" className="text-[10px] rounded-full">Resolved</Badge>
                              ) : (
                                <Badge className="bg-red-500 text-white border-0 text-[10px] rounded-full">Open</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{report.reason}</p>
                            <p className="text-xs text-muted-foreground mt-1">Reported by {report.reporter.name} ({report.reporter.email})</p>
                          </div>
                          {!report.isResolved && (
                            <Button size="sm" variant="outline" onClick={() => handleResolveReport(report.id)} className="shrink-0 rounded-xl">
                              Mark Resolved
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="users" className="mt-6">
                <div className="space-y-3">
                  {users.map(user => (
                    <Card key={user.id} className="p-4 card-premium">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{user.name}</span>
                              {user.isVerified && <BadgeCheck className="w-4 h-4 text-brand" />}
                              {user.isAdmin && <Badge className="bg-brand text-white border-0 text-[10px] rounded-full">Admin</Badge>}
                              {user.isBanned && <Badge className="bg-red-500 text-white border-0 text-[10px] rounded-full">Banned</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground">{user.email} · {user.college || 'No college'} · {user._count.listings} listings</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={user.isBanned ? 'outline' : 'ghost'}
                          onClick={() => handleBanUser(user.id, user.isBanned)}
                          className="shrink-0 gap-1 text-xs rounded-xl"
                        >
                          <Ban className="w-3 h-3" /> {user.isBanned ? 'Unban' : 'Ban'}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="recent" className="mt-6">
                <div className="space-y-3">
                  {stats.recentListings.map(listing => (
                    <Card key={listing.id} className="p-4 card-premium">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-sm font-medium">{listing.title}</span>
                          <p className="text-xs text-muted-foreground">by {listing.seller.name} {listing.seller.college ? `· ${listing.seller.college}` : ''}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button size="sm" variant="outline" onClick={() => handleVerifyListing(listing.id, false)} className="text-xs gap-1 rounded-xl">
                            <BadgeCheck className="w-3 h-3" /> Verify
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteListing(listing.id)} className="text-xs text-destructive gap-1 rounded-xl">
                            <Trash2 className="w-3 h-3" /> Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}
