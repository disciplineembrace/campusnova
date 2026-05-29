'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail, Shield, AlertCircle, Loader2, KeyRound, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface AdminLoginProps {
  onLogin: (admin: { id: string; name: string; email: string; role: string; mustChangePassword?: boolean }) => void
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rateLimited, setRateLimited] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Password change state
  const [mustChangePassword, setMustChangePassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [adminEmail, setAdminEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/cnx-admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.status === 429) {
        setRateLimited(true)
        setError('Too many attempts. Please try again in 15 minutes.')
        return
      }

      if (!res.ok) {
        setError(data.error || 'Authentication failed')
        return
      }

      if (data.admin?.mustChangePassword) {
        setMustChangePassword(true)
        setAdminEmail(email)
      } else {
        onLogin(data.admin)
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setPasswordErrors([])

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setError('Password must contain uppercase, lowercase, and number')
      return
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      setError('Password must contain at least one special character')
      return
    }

    setChangingPassword(true)

    try {
      const res = await fetch('/api/cnx-admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_password',
          email: adminEmail,
          currentPassword: password,
          newPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to change password')
        return
      }

      setMustChangePassword(false)
      // Re-login with new password
      const loginRes = await fetch('/api/cnx-admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: newPassword }),
      })

      const loginData = await loginRes.json()

      if (loginRes.ok) {
        onLogin(loginData.admin)
      } else {
        setError('Password changed! Please login again.')
        setMustChangePassword(false)
        setPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setChangingPassword(false)
    }
  }

  // ─── Force Password Change Screen ───
  if (mustChangePassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <Card className="p-8 bg-slate-900/80 border-slate-700/50 backdrop-blur-xl shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shadow-lg">
                <KeyRound className="w-7 h-7 text-white" />
              </div>
            </div>

            <h1 className="text-xl font-semibold text-slate-100 text-center mb-1">
              Change Your Password
            </h1>
            <p className="text-sm text-slate-400 text-center mb-6">
              You must set a new password before continuing
            </p>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="New password"
                    required
                    className="h-11 pl-10 pr-10 bg-slate-800/60 border-slate-600/50 text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500/20 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <div className="relative">
                  <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    className="h-11 pl-10 bg-slate-800/60 border-slate-600/50 text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500/20 rounded-xl"
                  />
                </div>
              </div>

              {/* Password requirements */}
              <div className="text-xs text-slate-400 space-y-1 bg-slate-800/40 rounded-lg p-3">
                <p className="font-medium text-slate-300 mb-1.5">Password requirements:</p>
                <div className={`flex items-center gap-1.5 ${newPassword.length >= 8 ? 'text-emerald-400' : ''}`}>
                  <span>{newPassword.length >= 8 ? '✓' : '○'}</span> At least 8 characters
                </div>
                <div className={`flex items-center gap-1.5 ${/[A-Z]/.test(newPassword) ? 'text-emerald-400' : ''}`}>
                  <span>{/[A-Z]/.test(newPassword) ? '✓' : '○'}</span> One uppercase letter
                </div>
                <div className={`flex items-center gap-1.5 ${/[a-z]/.test(newPassword) ? 'text-emerald-400' : ''}`}>
                  <span>{/[a-z]/.test(newPassword) ? '✓' : '○'}</span> One lowercase letter
                </div>
                <div className={`flex items-center gap-1.5 ${/[0-9]/.test(newPassword) ? 'text-emerald-400' : ''}`}>
                  <span>{/[0-9]/.test(newPassword) ? '✓' : '○'}</span> One number
                </div>
                <div className={`flex items-center gap-1.5 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) ? 'text-emerald-400' : ''}`}>
                  <span>{/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) ? '✓' : '○'}</span> One special character
                </div>
                <div className={`flex items-center gap-1.5 ${newPassword === confirmPassword && confirmPassword.length > 0 ? 'text-emerald-400' : ''}`}>
                  <span>{newPassword === confirmPassword && confirmPassword.length > 0 ? '✓' : '○'}</span> Passwords match
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

              <Button
                type="submit"
                disabled={changingPassword}
                className="w-full h-11 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-xl transition-colors"
              >
                {changingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    )
  }

  // ─── Login Screen ───
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
                  placeholder="Admin email"
                  required
                  className="h-11 pl-10 bg-slate-800/60 border-slate-600/50 text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:ring-slate-500/20 rounded-xl"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="h-11 pl-10 pr-10 bg-slate-800/60 border-slate-600/50 text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:ring-slate-500/20 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
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
