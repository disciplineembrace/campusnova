'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { useTranslation } from '@/lib/i18n/TranslationContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type AuthTab = 'login' | 'register'

export default function LoginPage() {
  const { setCurrentPage, setCurrentUser } = useAppStore()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<AuthTab>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register form state
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    if (!loginEmail) {
      setError(t('login.error.emailRequired'))
      return
    }
    if (!loginPassword) {
      setError(t('login.error.passwordRequired'))
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: loginEmail,
          password: loginPassword,
        })
      })
      const data = await res.json()

      if (!res.ok) {
        // Map server errors to translation keys
        if (data.error === 'Invalid email or password') {
          setError(t('login.error.invalidCredentials'))
        } else if (data.error === 'This account has been banned') {
          setError(t('login.error.accountBanned'))
        } else {
          setError(data.error || t('login.error.loginFailed'))
        }
        return
      }

      setCurrentUser(data.user)
      setCurrentPage('home')
    } catch {
      setError(t('login.error.wentWrong'))
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    if (!regName) {
      setError(t('login.error.nameRequired'))
      return
    }
    if (regName.trim().length < 2) {
      setError(t('login.error.nameRequired'))
      return
    }
    if (!regEmail) {
      setError(t('login.error.emailRequired'))
      return
    }
    if (!regPassword) {
      setError(t('login.error.passwordRequired'))
      return
    }
    if (regPassword.length < 8) {
      setError(t('login.error.passwordTooShort'))
      return
    }
    // Check password strength
    const hasUppercase = /[A-Z]/.test(regPassword)
    const hasLowercase = /[a-z]/.test(regPassword)
    const hasDigit = /\d/.test(regPassword)
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(regPassword)
    if (!(hasUppercase && hasLowercase && hasDigit && hasSpecial)) {
      setError(t('login.error.passwordWeak'))
      return
    }
    if (regPassword !== regConfirmPassword) {
      setError(t('login.error.passwordMismatch'))
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          name: regName,
          email: regEmail,
          password: regPassword,
          phone: regPhone || undefined,
        })
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.error === 'Email already registered') {
          setError(t('login.error.emailExists'))
        } else if (data.error === 'Please enter a valid email') {
          setError(t('login.error.invalidEmail'))
        } else if (data.error === 'Password must be at least 8 characters') {
          setError(t('login.error.passwordTooShort'))
        } else if (data.error === 'Password must include uppercase, lowercase, number, and special character') {
          setError(t('login.error.passwordWeak'))
        } else {
          setError(data.error || t('login.error.wentWrong'))
        }
        return
      }

      setCurrentUser(data.user)
      setCurrentPage('home')
    } catch {
      setError(t('login.error.wentWrong'))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    window.location.href = '/api/auth/google'
  }

  return (
    <div className="pt-16 min-h-screen flex">
      {/* Left side - Gradient branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand via-accent to-brand relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-pattern opacity-20" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-light/10 rounded-full blur-[100px]" />

        <div className="relative text-center px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="mb-8"
            >
              <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto shadow-2xl">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-4 font-heading">{t('login.brand.welcome')}</h2>
            <p className="text-white/70 max-w-sm mx-auto mb-8 leading-relaxed">
              {t('login.brand.tagline')}
            </p>

            {/* Floating stats */}
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white font-heading">{t('login.brand.0percent')}</p>
                <p className="text-xs text-white/60">{t('login.brand.commission')}</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white font-heading">{t('login.brand.direct')}</p>
                <p className="text-xs text-white/60">{t('login.brand.studentToStudent')}</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white font-heading">{t('login.brand.100percent')}</p>
                <p className="text-xs text-white/60">{t('login.brand.safeVerified')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Mobile header gradient bar */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold font-heading">
                Edu<span className="gradient-text">CampusHub</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm">{t('login.mobileBrand.tagline')}</p>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 font-heading">
              {t('login.heading.prefix')} <span className="gradient-text">{t('login.heading.highlight')}</span>
            </h1>
            <p className="text-muted-foreground">
              {t('login.subheading')}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex mb-6 bg-muted/50 rounded-xl p-1">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setError('') }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'login'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('login.tabs.login')}
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setError('') }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'register'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('login.tabs.register')}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'login' ? (
              <motion.form
                key="login"
                onSubmit={handleLogin}
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <Label className="mb-1.5 block">{t('login.label.collegeEmail')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder={t('login.placeholder.email')}
                      required
                      className="h-12 pl-10 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-1.5 block">{t('login.label.password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder={t('login.placeholder.password')}
                      required
                      className="h-12 pl-10 pr-10 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-brand hover:underline"
                  >
                    {t('login.forgotPassword')}
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 btn-gradient text-white border-0 rounded-xl text-base font-semibold gap-2"
                >
                  <span className="flex items-center gap-2">
                    {loading ? t('login.button.loggingIn') : <>{t('login.button.login')} <ArrowRight className="w-4 h-4" /></>}
                  </span>
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  {t('login.noAccount')}{' '}
                  <button
                    type="button"
                    onClick={() => { setActiveTab('register'); setError('') }}
                    className="text-brand font-semibold hover:underline"
                  >
                    {t('login.tabs.register')}
                  </button>
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                onSubmit={handleRegister}
                className="space-y-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <Label className="mb-1.5 block">{t('login.label.name')}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      placeholder={t('login.placeholder.name')}
                      required
                      className="h-12 pl-10 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-1.5 block">{t('login.label.collegeEmail')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder={t('login.placeholder.email')}
                      required
                      className="h-12 pl-10 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-1.5 block">{t('login.label.phone')}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      placeholder={t('login.placeholder.phone')}
                      className="h-12 pl-10 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-1.5 block">{t('login.label.password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder={t('login.placeholder.password')}
                      required
                      className="h-12 pl-10 pr-10 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label className="mb-1.5 block">{t('login.label.confirmPassword')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      placeholder={t('login.placeholder.confirmPassword')}
                      required
                      className="h-12 pl-10 pr-10 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 btn-gradient text-white border-0 rounded-xl text-base font-semibold gap-2"
                >
                  <span className="flex items-center gap-2">
                    {loading ? t('login.button.registering') : <>{t('login.button.register')} <ArrowRight className="w-4 h-4" /></>}
                  </span>
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  {t('login.hasAccount')}{' '}
                  <button
                    type="button"
                    onClick={() => { setActiveTab('login'); setError('') }}
                    className="text-brand font-semibold hover:underline"
                  >
                    {t('login.tabs.login')}
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Google Login */}
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">{t('login.or')}</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full h-12 mt-4 rounded-xl gap-3 font-medium border-2"
              onClick={handleGoogleSignIn}
              type="button"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {t('login.continueWithGoogle')}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
