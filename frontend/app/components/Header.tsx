'use client'
import * as tw from '@/lib/tailwindClasses'

import Link from 'next/link'
import {
  brandMark,
  brandSubtitle,
  brandTitle,
  buttonSecondary,
  headerShell,
} from '@/lib/tailwindClasses'

export function Header() {
  return (
    <header className={headerShell}>
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className={brandMark}>
            <svg viewBox="0 0 22 22" fill="none" className="w-[22px] h-[22px]">
              <rect x="3" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.9" />
              <rect x="12" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.5" />
              <rect x="3" y="12" width="7" height="7" rx="1.5" fill="white" opacity="0.5" />
              <rect x="12" y="12" width="7" height="7" rx="1.5" fill="#1D9E75" />
            </svg>
          </div>
          <div className="flex flex-col leading-tight">
            <span className={brandTitle}>SelectAI</span>
            <span className={brandSubtitle}>Govt. of India</span>
          </div>
        </Link>
        <nav className={tw.flexItemsGap2}>
          <Link href="/jobs" className="text-sm font-medium px-4 py-2 rounded-md bg-[#e6f7f2] text-[#1D9E75] hover:bg-[#d0f0e6] transition-colors">
            Jobs
          </Link>
          <Link href="/admin/login" className={`${buttonSecondary} px-4 py-2 text-sm`}>
            Admin Login
          </Link>
        </nav>
      </div>
    </header>
  )
}
