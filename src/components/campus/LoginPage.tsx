'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Mail, ArrowRight, GraduationCap, Shield, Users } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const { setCurrentPage, setCurrentUser } = useAppStore()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }

      setCurrentUser(data.user)
      setCurrentPage('home')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const quickLogin = async (quickEmail: string) => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: quickEmail })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }
      setCurrentUser(data.user)
      setCurrentPage('home')
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const demoAccounts = [
    { email: 'arjun@iitd.ac.in', label: 'Admin (Arjun, IIT Delhi)', badge: 'Admin' },
    { email: 'priya@aiims.ac.in', label: 'Verified Seller (Priya, AIIMS)', badge: 'Verified' },
    { email: 'rahul@iisc.ac.in', label: 'Top Seller (Rahul, IISc)', badge: 'Top' },
  ]

  return (
    <div className="pt-20 pb-10 min-h-screen flex items-center justify-center">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Join <span className="gradient-text">CampusBazaar</span>
              </h1>
              <p className="text-muted-foreground">
                Login with your college email to start buying and selling
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div>
                <Label className="mb-1.5 block">College Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@college.ac.in"
                    required
                    className="h-12 pl-10 rounded-xl"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 btn-gradient text-white border-0 rounded-xl text-base font-semibold gap-2"
              >
                {loading ? 'Logging in...' : <>Continue <ArrowRight className="w-4 h-4" /></>}
              </Button>
            </form>

            {/* Google Login (styled, non-functional) */}
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full h-12 mt-4 rounded-xl gap-3 font-medium"
                onClick={() => {}}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </Button>
            </div>

            {/* Demo Quick Login */}
            <div className="mt-6">
              <p className="text-xs text-muted-foreground mb-3">⚡ Quick Demo Login:</p>
              <div className="space-y-2">
                {demoAccounts.map(account => (
                  <button
                    key={account.email}
                    onClick={() => quickLogin(account.email)}
                    className="w-full text-left px-3 py-2.5 rounded-xl bg-muted/50 hover:bg-muted border border-border hover:border-brand/20 transition-all text-sm flex items-center justify-between group"
                  >
                    <span className="text-foreground font-medium">{account.label}</span>
                    <span className="text-xs text-muted-foreground group-hover:text-brand transition-colors">{account.email}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right - Illustration */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <div className="w-full aspect-square rounded-3xl bg-gradient-to-br from-brand/10 via-blue-50 to-indigo-50 dark:from-brand/5 dark:via-blue-950/20 dark:to-indigo-950/20 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-brand to-blue-700 flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <BookOpen className="w-14 h-14 text-white" />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Start Saving Today</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    Join thousands of students already saving money on textbooks
                  </p>
                </div>
              </div>

              {/* Floating cards */}
              <motion.div
                className="absolute -top-4 -right-4 p-3 rounded-xl bg-card border border-border shadow-lg"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs font-medium">Verified Sellers</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 p-3 rounded-xl bg-card border border-border shadow-lg"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand" />
                  <span className="text-xs font-medium">10,000+ Students</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute top-1/2 -left-8 p-3 rounded-xl bg-card border border-border shadow-lg"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-amber-500" />
                  <span className="text-xs font-medium">100+ Colleges</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
