'use client'

import { useState } from 'react'
import { signInAdmin } from '@/lib/api'
import { useRouter } from 'next/navigation'

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
      // Set cookie for middleware
      document.cookie = 'admin_token=authenticated; path=/'
      router.push('/admin')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center">
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-8 max-w-[420px] w-full mx-4">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div className="w-10 h-10 bg-[#0F2744] rounded-md flex items-center justify-center">
            <svg viewBox="0 0 22 22" fill="none" className="w-[22px] h-[22px]">
              <rect x="3" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="12" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.5"/>
              <rect x="3" y="12" width="7" height="7" rx="1.5" fill="white" opacity="0.5"/>
              <rect x="12" y="12" width="7" height="7" rx="1.5" fill="#1D9E75"/>
            </svg>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-[#0F2744] tracking-[0.01em]">SelectAI</span>
            <span className="text-[10px] text-[#718096] uppercase tracking-[0.03em]">Govt. of India</span>
          </div>
        </div>

        <h1 className="text-xl font-bold text-[#0F2744] mb-2 text-center">Admin Login</h1>
        <p className="text-sm text-[#718096] mb-6 text-center">Ministry of Electronics & IT</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#0F2744]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@gov.in"
              className="px-3.5 py-2.5 border-[1.5px] border-[#e2e8f0] rounded-lg text-sm text-[#0F2744] bg-white outline-none focus:border-[#0F2744] focus:shadow-[0_0_0_3px_rgba(15,39,68,0.07)] transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#0F2744]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="px-3.5 py-2.5 border-[1.5px] border-[#e2e8f0] rounded-lg text-sm text-[#0F2744] bg-white outline-none focus:border-[#0F2744] focus:shadow-[0_0_0_3px_rgba(15,39,68,0.07)] transition-all"
            />
          </div>

          {error && <p className="text-[#dc2626] text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0F2744] text-white font-semibold text-sm rounded-lg hover:bg-[#1a3a5c] transition-colors disabled:bg-[#718096] tracking-[0.01em]"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#e2e8f0] text-center">
          <p className="text-xs text-[#718096]">Mock mode: any credentials work</p>
        </div>
      </div>
    </div>
  )
}
