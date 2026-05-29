'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, BookOpen, AlertTriangle, FileText, LogOut,
  RefreshCw, Trash2, Ban, BadgeCheck, Star, Eye, TrendingUp,
  Shield, ChevronRight, Clock, MoreVertical, CheckCircle2, XCircle,
  Crown, UserCog, HeadphonesIcon, Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatINR, CATEGORIES } from '@/lib/store'
import { toast } from 'sonner'
import AdminLogin from './AdminLogin'

// ─── Types ────────────────────────────────────────────────────────

type AdminTab = 'overview' | 'users' | 'listings' | 'reports' | 'audit'

interface AdminInfo {
  id: string
  name: string
  email: string
  role: string
}

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
  recentListings: { id: string; title: string; sellingPrice: number; isSold: boolean; isFeatured: boolean; isVerified: boolean; createdAt: string; seller: { name: string; college: string | null } }[]
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
  adminRole: string | null
  rating: number
  totalSales: number
  createdAt: string
  _count: { listings: number }
}

interface ListingItem {
  id: string
  title: string
  description: string
  category: string
  city: string
  condition: string
  sellingPrice: number
  originalPrice: number
  isFeatured: boolean
  isVerified: boolean
  isSold: boolean
  views: number
  createdAt: string
  seller: { id: string; name: string; email: string; college: string | null }
}

interface ReportItem {
  id: string
  reason: string
  isResolved: boolean
  createdAt: string
  listing: { id: string; title: string }
  reporter: { id: string; name: string; email: string }
}

interface AuditLogItem {
  id: string
  action: string
  targetType: string
  targetId: string
  details: string | null
  ipAddress: string | null
  createdAt: string
  actor: { name: string; email: string }
}

// ─── Role Badge ───────────────────────────────────────────────────

function RoleBadge({ role }: { role: string }) {
  const config: Record<string, { label: string; icon: React.ElementType; className: string }> = {
    super_admin: { label: 'Super Admin', icon: Crown, className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' },
    moderator: { label: 'Moderator', icon: Shield, className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
    support_admin: { label: 'Support', icon: HeadphonesIcon, className: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30' },
  }
  const c = config[role] || config.support_admin
  const Icon = c.icon
  return (
    <Badge className={`${c.className} border text-[10px] font-semibold gap-1 rounded-full px-2 py-0.5`}>
      <Icon className="w-3 h-3" />
      {c.label}
    </Badge>
  )
}

// ─── Session Timer ────────────────────────────────────────────────

function SessionTimer({ onExpire }: { onExpire: () => void }) {
  const [timeLeft, setTimeLeft] = useState(4 * 60 * 60) // 4 hours in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          onExpire()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [onExpire])

  const hours = Math.floor(timeLeft / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400">
      <Clock className="w-3.5 h-3.5" />
      <span className="font-mono">
        {hours}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────

export default function AdminClient({ admin: initialAdmin }: { admin: AdminInfo }) {
  const [admin, setAdmin] = useState<AdminInfo | null>(initialAdmin)
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<UserItem[]>([])
  const [listings, setListings] = useState<ListingItem[]>([])
  const [reports, setReports] = useState<ReportItem[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Fetch data from protected admin API
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes, reportsRes, listingsRes] = await Promise.all([
        fetch('/api/cnx-admin?type=stats'),
        fetch('/api/cnx-admin?type=users'),
        fetch('/api/cnx-admin?type=reports'),
        fetch('/api/cnx-admin?type=listings'),
      ])
      if (statsRes.ok) setStats(await statsRes.json())
      if (usersRes.ok) { const d = await usersRes.json(); setUsers(d.users || []) }
      if (reportsRes.ok) { const d = await reportsRes.json(); setReports(d.reports || []) }
      if (listingsRes.ok) { const d = await listingsRes.json(); setListings(d.listings || []) }
    } catch (err) {
      console.error('Admin fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAuditLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/cnx-admin?type=audit-logs')
      if (res.ok) { const d = await res.json(); setAuditLogs(d.logs || []) }
    } catch (err) {
      console.error('Audit logs error:', err)
    }
  }, [])

  useEffect(() => {
    if (admin) fetchData()
  }, [admin, fetchData])

  useEffect(() => {
    if (admin && activeTab === 'audit') fetchAuditLogs()
  }, [admin, activeTab, fetchAuditLogs])

  // Admin actions
  const adminAction = async (action: string, targetId: string, details?: string) => {
    try {
      const res = await fetch('/api/cnx-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, targetId, details }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`Action completed: ${action.replace(/_/g, ' ')}`)
        fetchData()
        if (activeTab === 'audit') fetchAuditLogs()
      } else {
        toast.error(data.error || 'Action failed')
      }
    } catch {
      toast.error('Network error')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/cnx-admin', { method: 'DELETE' })
    } catch { /* ignore */ }
    setAdmin(null)
  }

  const handleSessionExpire = () => {
    toast.error('Session expired. Please log in again.')
    setAdmin(null)
  }

  const handleLogin = (loggedInAdmin: AdminInfo) => {
    setAdmin(loggedInAdmin)
  }

  // Show login if not authenticated on client side
  if (!admin) {
    return <AdminLogin onLogin={handleLogin} />
  }

  // Sidebar navigation items
  const sidebarItems: { id: AdminTab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users, count: stats?.totalUsers },
    { id: 'listings', label: 'Listings', icon: BookOpen, count: stats?.totalListings },
    { id: 'reports', label: 'Reports', icon: AlertTriangle, count: stats?.unresolvedReports },
    { id: 'audit', label: 'Audit Logs', icon: FileText },
  ]

  // Filter helpers
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const filteredListings = listings.filter(l =>
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.seller.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const filteredReports = reports.filter(r =>
    r.listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.reason.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // ─── Render ──────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed md:relative z-50 w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col shrink-0"
      >
        {/* Logo area */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-purple flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-100">CampusNova</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Control Panel</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSearchTerm('') }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-brand/10 text-brand'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <Badge className={`h-5 min-w-[20px] px-1.5 text-[10px] rounded-full border-0 ${
                  activeTab === item.id ? 'bg-brand text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.count}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        {/* Admin info */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-purple flex items-center justify-center text-white text-sm font-bold shrink-0">
              {admin.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-200 truncate">{admin.name}</p>
              <RoleBadge role={admin.role} />
            </div>
          </div>
          <SessionTimer onExpire={handleSessionExpire} />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full mt-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 gap-2 rounded-xl"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-40 h-14 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 flex items-center px-4 md:px-6 gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-slate-400 hover:text-slate-200"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>

          <h2 className="text-sm font-semibold text-slate-200 capitalize">
            {activeTab === 'audit' ? 'Audit Logs' : activeTab}
          </h2>

          <div className="flex-1" />

          {activeTab !== 'overview' && (
            <div className="relative max-w-xs w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="h-8 pl-9 text-sm bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500 rounded-lg"
              />
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={fetchData}
            className="text-slate-400 hover:text-slate-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </header>

        {/* Content */}
        <main className="p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && (
                <OverviewTab stats={stats} loading={loading} onAction={adminAction} />
              )}
              {activeTab === 'users' && (
                <UsersTab users={filteredUsers} loading={loading} onAction={adminAction} />
              )}
              {activeTab === 'listings' && (
                <ListingsTab listings={filteredListings} loading={loading} onAction={adminAction} />
              )}
              {activeTab === 'reports' && (
                <ReportsTab reports={filteredReports} loading={loading} onAction={adminAction} />
              )}
              {activeTab === 'audit' && (
                <AuditTab logs={auditLogs} loading={loading} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

// ─── Overview Tab ──────────────────────────────────────────────────

function OverviewTab({ stats, loading, onAction }: { stats: Stats | null; loading: boolean; onAction: (a: string, t: string) => void }) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-5 bg-slate-900/50 border-slate-800 animate-pulse">
            <div className="h-20 bg-slate-800 rounded" />
          </Card>
        ))}
      </div>
    )
  }

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'from-brand to-purple' },
    { icon: BookOpen, label: 'Active Listings', value: stats.activeListings, color: 'from-purple to-violet-600' },
    { icon: AlertTriangle, label: 'Open Reports', value: stats.unresolvedReports, color: 'from-red-500 to-rose-600' },
    { icon: Eye, label: 'Total Views', value: stats.totalViews, color: 'from-cyan-500 to-brand' },
    { icon: Star, label: 'Featured', value: stats.featuredListings, color: 'from-amber-500 to-orange-500' },
    { icon: TrendingUp, label: 'Total Listings', value: stats.totalListings, color: 'from-emerald-500 to-green-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Card className="p-4 bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-100 font-heading">{stat.value.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card className="p-5 bg-slate-900/50 border-slate-800">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Listings by Category</h3>
          <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar">
            {stats.categoryStats.map((c, i) => {
              const catInfo = CATEGORIES.find(cat => cat.id === c.category)
              const maxCount = Math.max(...stats.categoryStats.map(s => s.count))
              const pct = maxCount > 0 ? (c.count / maxCount) * 100 : 0
              return (
                <div key={c.category} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-28 truncate shrink-0">
                    {catInfo?.name || c.category}
                  </span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-brand to-purple rounded-full"
                    />
                  </div>
                  <span className="text-xs text-slate-300 font-mono w-8 text-right">{c.count}</span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* City Breakdown */}
        <Card className="p-5 bg-slate-900/50 border-slate-800">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Top Cities</h3>
          <div className="space-y-3">
            {stats.cityStats.map((c, i) => {
              const maxCount = Math.max(...stats.cityStats.map(s => s.count))
              const pct = maxCount > 0 ? (c.count / maxCount) * 100 : 0
              return (
                <div key={c.city} className="flex items-center gap-3">
                  <span className="text-sm text-slate-300 w-20 shrink-0">{c.city}</span>
                  <div className="flex-1 h-6 bg-slate-800 rounded-lg overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: i * 0.08, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-brand rounded-lg"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-300 font-medium">{c.count}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Recent Listings */}
      <Card className="p-5 bg-slate-900/50 border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-200">Recent Listings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-2 px-3 text-slate-500 font-medium text-xs">Title</th>
                <th className="text-left py-2 px-3 text-slate-500 font-medium text-xs">Seller</th>
                <th className="text-left py-2 px-3 text-slate-500 font-medium text-xs">Price</th>
                <th className="text-left py-2 px-3 text-slate-500 font-medium text-xs">Status</th>
                <th className="text-right py-2 px-3 text-slate-500 font-medium text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentListings.map(listing => (
                <tr key={listing.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 text-slate-200 max-w-[200px] truncate">{listing.title}</td>
                  <td className="py-2.5 px-3 text-slate-400">{listing.seller.name}</td>
                  <td className="py-2.5 px-3 text-slate-300 font-mono">{formatINR(listing.sellingPrice)}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex gap-1">
                      {listing.isSold && <Badge className="bg-slate-700 text-slate-300 border-0 text-[10px] rounded-full">Sold</Badge>}
                      {listing.isFeatured && <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px] rounded-full">Featured</Badge>}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" onClick={() => onAction('verify_listing', listing.id)} className="h-7 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10">
                        <BadgeCheck className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onAction('feature_listing', listing.id)} className="h-7 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10">
                        <Star className="w-3 h-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-slate-900 border-slate-700">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-slate-100">Delete Listing</AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-400">
                              Are you sure you want to delete &quot;{listing.title}&quot;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-slate-800 text-slate-200 border-slate-700">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onAction('delete_listing', listing.id)} className="bg-red-600 hover:bg-red-700 text-white">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// ─── Users Tab ────────────────────────────────────────────────────

function UsersTab({ users, loading, onAction }: { users: UserItem[]; loading: boolean; onAction: (a: string, t: string, d?: string) => void }) {
  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{users.length} users</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left py-2.5 px-3 text-slate-500 font-medium text-xs">User</th>
              <th className="text-left py-2.5 px-3 text-slate-500 font-medium text-xs hidden md:table-cell">College</th>
              <th className="text-left py-2.5 px-3 text-slate-500 font-medium text-xs hidden lg:table-cell">Listings</th>
              <th className="text-left py-2.5 px-3 text-slate-500 font-medium text-xs">Status</th>
              <th className="text-right py-2.5 px-3 text-slate-500 font-medium text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-purple flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-200 font-medium truncate">{user.name}</span>
                        {user.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-slate-400 hidden md:table-cell">{user.college || '—'}</td>
                <td className="py-2.5 px-3 text-slate-300 font-mono hidden lg:table-cell">{user._count.listings}</td>
                <td className="py-2.5 px-3">
                  <div className="flex gap-1 flex-wrap">
                    {user.isAdmin && <RoleBadge role={user.adminRole || 'support_admin'} />}
                    {user.isBanned && <Badge className="bg-red-500/15 text-red-400 border-red-500/30 text-[10px] rounded-full">Banned</Badge>}
                    {!user.isBanned && !user.isAdmin && <Badge className="bg-slate-700/50 text-slate-400 border-slate-700 text-[10px] rounded-full">Active</Badge>}
                  </div>
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex justify-end gap-1">
                    {!user.isVerified && (
                      <Button size="sm" variant="ghost" onClick={() => onAction('verify_seller', user.id)} className="h-7 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 gap-1">
                        <BadgeCheck className="w-3 h-3" /> Verify
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className={`h-7 text-xs gap-1 ${user.isBanned ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-red-400 hover:bg-red-500/10'}`}>
                          <Ban className="w-3 h-3" /> {user.isBanned ? 'Unban' : 'Ban'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-slate-900 border-slate-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-slate-100">{user.isBanned ? 'Unban User' : 'Ban User'}</AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-400">
                            {user.isBanned
                              ? `Are you sure you want to unban ${user.name}?`
                              : `Are you sure you want to ban ${user.name}? They will lose access to their account.`}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-slate-800 text-slate-200 border-slate-700">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onAction(user.isBanned ? 'unban_user' : 'ban_user', user.id)}
                            className={user.isBanned ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}
                          >
                            {user.isBanned ? 'Unban' : 'Ban'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Listings Tab ─────────────────────────────────────────────────

function ListingsTab({ listings, loading, onAction }: { listings: ListingItem[]; loading: boolean; onAction: (a: string, t: string) => void }) {
  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{listings.length} listings</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left py-2.5 px-3 text-slate-500 font-medium text-xs">Listing</th>
              <th className="text-left py-2.5 px-3 text-slate-500 font-medium text-xs hidden md:table-cell">Seller</th>
              <th className="text-left py-2.5 px-3 text-slate-500 font-medium text-xs">Price</th>
              <th className="text-left py-2.5 px-3 text-slate-500 font-medium text-xs">Status</th>
              <th className="text-right py-2.5 px-3 text-slate-500 font-medium text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map(listing => (
              <tr key={listing.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                <td className="py-2.5 px-3">
                  <div className="min-w-0">
                    <p className="text-slate-200 font-medium truncate max-w-[200px]">{listing.title}</p>
                    <p className="text-xs text-slate-500">{CATEGORIES.find(c => c.id === listing.category)?.name || listing.category} · {listing.city}</p>
                  </div>
                </td>
                <td className="py-2.5 px-3 hidden md:table-cell">
                  <p className="text-slate-400">{listing.seller.name}</p>
                  <p className="text-xs text-slate-500">{listing.seller.college || ''}</p>
                </td>
                <td className="py-2.5 px-3 text-slate-300 font-mono">{formatINR(listing.sellingPrice)}</td>
                <td className="py-2.5 px-3">
                  <div className="flex gap-1 flex-wrap">
                    {listing.isSold && <Badge className="bg-slate-700 text-slate-300 border-0 text-[10px] rounded-full">Sold</Badge>}
                    {listing.isFeatured && <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px] rounded-full">Featured</Badge>}
                    {listing.isVerified && <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] rounded-full">Verified</Badge>}
                    {!listing.isSold && !listing.isFeatured && !listing.isVerified && (
                      <Badge className="bg-slate-700/50 text-slate-400 border-slate-700 text-[10px] rounded-full">Active</Badge>
                    )}
                  </div>
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex justify-end gap-1">
                    {!listing.isVerified && (
                      <Button size="sm" variant="ghost" onClick={() => onAction('verify_listing', listing.id)} className="h-7 text-xs text-emerald-400 hover:bg-emerald-500/10">
                        <BadgeCheck className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onAction(listing.isFeatured ? 'unfeature_listing' : 'feature_listing', listing.id)}
                      className={`h-7 text-xs ${listing.isFeatured ? 'text-slate-400 hover:bg-slate-500/10' : 'text-amber-400 hover:bg-amber-500/10'}`}
                    >
                      <Star className="w-3 h-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-red-400 hover:bg-red-500/10">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-slate-900 border-slate-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-slate-100">Delete Listing</AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-400">
                            Are you sure you want to delete &quot;{listing.title}&quot;? This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-slate-800 text-slate-200 border-slate-700">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onAction('delete_listing', listing.id)} className="bg-red-600 hover:bg-red-700 text-white">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Reports Tab ──────────────────────────────────────────────────

function ReportsTab({ reports, loading, onAction }: { reports: ReportItem[]; loading: boolean; onAction: (a: string, t: string) => void }) {
  if (loading) return <LoadingSkeleton />

  const unresolved = reports.filter(r => !r.isResolved)
  const resolved = reports.filter(r => r.isResolved)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-red-500/5 border-red-500/20">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400 font-medium">Unresolved</span>
          </div>
          <p className="text-2xl font-bold text-red-300 mt-1">{unresolved.length}</p>
        </Card>
        <Card className="p-4 bg-emerald-500/5 border-emerald-500/20">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">Resolved</span>
          </div>
          <p className="text-2xl font-bold text-emerald-300 mt-1">{resolved.length}</p>
        </Card>
      </div>

      <div className="space-y-2">
        {reports.map(report => (
          <Card key={report.id} className={`p-4 bg-slate-900/50 border-slate-800 ${report.isResolved ? 'opacity-50' : ''}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-slate-200 truncate">{report.listing.title}</span>
                  {report.isResolved ? (
                    <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] rounded-full shrink-0">Resolved</Badge>
                  ) : (
                    <Badge className="bg-red-500/15 text-red-400 border-red-500/30 text-[10px] rounded-full shrink-0">Open</Badge>
                  )}
                </div>
                <p className="text-xs text-slate-400">{report.reason}</p>
                <p className="text-xs text-slate-500 mt-1">By {report.reporter.name} · {new Date(report.createdAt).toLocaleDateString()}</p>
              </div>
              {!report.isResolved && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" className="shrink-0 border-slate-700 text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 rounded-xl gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-900 border-slate-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-slate-100">Resolve Report</AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-400">
                        Mark this report as resolved? The report for &quot;{report.listing.title}&quot; will be closed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-slate-800 text-slate-200 border-slate-700">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onAction('resolve_report', report.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        Resolve
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Audit Tab ────────────────────────────────────────────────────

function AuditTab({ logs, loading }: { logs: AuditLogItem[]; loading: boolean }) {
  if (loading) return <LoadingSkeleton />

  const actionIcons: Record<string, React.ElementType> = {
    delete_listing: Trash2,
    ban_user: Ban,
    unban_user: CheckCircle2,
    verify_seller: BadgeCheck,
    verify_listing: BadgeCheck,
    feature_listing: Star,
    unfeature_listing: Star,
    resolve_report: CheckCircle2,
  }
  const actionColors: Record<string, string> = {
    delete_listing: 'text-red-400 bg-red-500/10',
    ban_user: 'text-red-400 bg-red-500/10',
    unban_user: 'text-emerald-400 bg-emerald-500/10',
    verify_seller: 'text-emerald-400 bg-emerald-500/10',
    verify_listing: 'text-emerald-400 bg-emerald-500/10',
    feature_listing: 'text-amber-400 bg-amber-500/10',
    unfeature_listing: 'text-slate-400 bg-slate-500/10',
    resolve_report: 'text-emerald-400 bg-emerald-500/10',
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-slate-400 mb-4">{logs.length} log entries</p>
      {logs.map(log => {
        const Icon = actionIcons[log.action] || FileText
        const color = actionColors[log.action] || 'text-slate-400 bg-slate-500/10'
        return (
          <Card key={log.id} className="p-3 bg-slate-900/50 border-slate-800 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-slate-200 font-medium">{log.action.replace(/_/g, ' ')}</span>
                <Badge className="bg-slate-800 text-slate-400 border-slate-700 text-[10px] rounded-full">{log.targetType}</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                by {log.actor.name} · {new Date(log.createdAt).toLocaleString()}
                {log.ipAddress && ` · IP: ${log.ipAddress}`}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
          </Card>
        )
      })}
    </div>
  )
}

// ─── Loading Skeleton ─────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="p-4 bg-slate-900/50 border-slate-800 animate-pulse">
          <div className="h-10 bg-slate-800 rounded" />
        </Card>
      ))}
    </div>
  )
}
