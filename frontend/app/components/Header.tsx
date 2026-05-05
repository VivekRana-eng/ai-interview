'use client'

import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-white border-t-[3px] border-t-[#0F2744] border-b border-[#e2e8f0] sticky top-0 z-[100]">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline">
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
            <span className="text-[10px] text-[#718096] font-normal uppercase tracking-[0.03em]">Govt. of India</span>
          </div>
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/jobs" className="text-sm font-medium px-4 py-2 rounded-md bg-[#e6f7f2] text-[#1D9E75] hover:bg-[#d0f0e6] transition-colors">
            Jobs
          </Link>
          <Link href="/admin/login" className="text-sm font-medium px-4 py-2 rounded-md border border-[#e2e8f0] text-[#0F2744] hover:bg-[#E8F4FD] transition-colors">
            Admin Login
          </Link>
        </nav>
      </div>
    </header>
  )
}
