'use client'
import * as tw from '@/lib/tailwindClasses'

import { useState } from 'react'
import { signInAdmin } from '@/lib/api'
import { useRouter } from 'next/navigation'
import {
  brandMark,
  brandSubtitle,
  brandTitle,
  buttonPrimary,
  inputBase,
  pageShellCentered,
  surfaceCard,
} from '@/lib/tailwindClasses'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signInAdmin(email, password)
      document.cookie = 'admin_token=authenticated; path=/'
      router.push('/admin')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={pageShellCentered}>
      <div className={`${surfaceCard} p-8 max-w-[420px] w-full mx-4`}>
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div className={brandMark}>
            <svg viewBox="0 0 22 22" fill="none" className="w-[22px] h-[22px]">
              <rect x="3" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="12" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.5"/>
              <rect x="3" y="12" width="7" height="7" rx="1.5" fill="white" opacity="0.5"/>
              <rect x="12" y="12" width="7" height="7" rx="1.5" fill="#1D9E75"/>
            </svg>
          </div>
          <div className="flex flex-col leading-tight">
            <span className={brandTitle}>SelectAI</span>
            <span className={brandSubtitle}>Govt. of India</span>
          </div>
        </div>

        <h1 className="text-xl font-bold text-[#0F2744] mb-2 text-center">Admin Login</h1>
        <p className="text-sm text-[#718096] mb-6 text-center">Ministry of Electronics & IT</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className={tw.flexColGap1_5}>
            <label className={tw.textPrimary13}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@gov.in"
              className={inputBase}
            />
          </div>

          <div className={tw.flexColGap1_5}>
            <label className={tw.textPrimary13}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className={inputBase}
            />
          </div>

          {error && <p className="text-[#dc2626] text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`${buttonPrimary} w-full py-3 text-sm tracking-[0.01em] disabled:bg-[#718096]`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#e2e8f0] text-center">
          <p className={tw.textSecondary12}>Mock mode: any credentials work</p>
        </div>
      </div>
    </div>
  )
}
