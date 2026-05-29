'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail, Shield, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface AdminLoginProps {
  onLogin: (admin: { id: string; name: string; email: string; role: string }) => void
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rateLimited, setRateLimited] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/cnx-admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, secretKey }),
      })

      const data = await res.json()

      if (res.status === 429) {
        setRateLimited(true)
        setError('Too many attempts. Please try again later.')
        return
      }

      if (!res.ok) {
        setError(data.error || 'Authentication failed')
        return
      }

      onLogin(data.admin)
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <Card className="p-8 bg-slate-900/80 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          {/* Minimal, no branding */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-slate-300" />
            </div>
          </div>

          <h1 className="text-xl font-semibold text-slate-100 text-center mb-1">
            Secure Access
          </h1>
          <p className="text-sm text-slate-400 text-center mb-8">
            Enter your credentials to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="h-11 pl-10 bg-slate-800/60 border-slate-600/50 text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:ring-slate-500/20 rounded-xl"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="password"
                  value={secretKey}
                  onChange={e => setSecretKey(e.target.value)}
                  placeholder="Access key"
                  required
                  className="h-11 pl-10 bg-slate-800/60 border-slate-600/50 text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:ring-slate-500/20 rounded-xl"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {rateLimited && (
              <div className="text-amber-400 text-xs text-center bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                Account temporarily locked due to multiple failed attempts. Please wait 15 minutes.
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || rateLimited}
              className="w-full h-11 bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium rounded-xl transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Authenticate'
              )}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
