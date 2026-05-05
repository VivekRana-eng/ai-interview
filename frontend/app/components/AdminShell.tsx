'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z' },
  { href: '/admin/jobs', label: 'Job Profiles', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { href: '/admin/applications', label: 'Applications', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { href: '/admin/merit-list', label: 'Merit List', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m6-6h2a2 2 0 012 2v6m-6-6h12M7 7h10v10H7V7z' },
  { href: '/admin/notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
]

function NavIcon({ path }: { path: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
      <path d={path} />
    </svg>
  )
}

export function AdminShell({ children, title, subtitle }: { children: ReactNode; title?: string; subtitle?: string }) {
  const pathname = usePathname()
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f4f8]">
      {/* Sidebar */}
      <aside className="w-[220px] bg-[#0F2744] flex flex-col flex-shrink-0 z-20">
        <div className="h-14 flex items-center gap-2.5 px-4 border-b border-white/[0.07] flex-shrink-0">
          <div className="w-[30px] h-[30px] bg-white/10 rounded-md flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 22 22" fill="none" className="w-4 h-4">
              <rect x="3" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="12" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.5"/>
              <rect x="3" y="12" width="7" height="7" rx="1.5" fill="white" opacity="0.5"/>
              <rect x="12" y="12" width="7" height="7" rx="1.5" fill="#1D9E75"/>
            </svg>
          </div>
          <span className="text-sm font-bold text-white whitespace-nowrap">SelectAI</span>
        </div>

        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/30 px-4 pt-5 pb-1.5">Overview</div>
        <nav className="flex flex-col gap-0.5 px-2 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium whitespace-nowrap relative transition-colors ${
                  isActive
                    ? 'bg-white/[0.12] text-white font-semibold before:content-[""] before:absolute before:left-0 before:top-[20%] before:bottom-[20%] before:w-[3px] before:bg-[#1D9E75] before:rounded-r-sm before:-ml-2'
                    : 'text-white/60 hover:bg-white/[0.07] hover:text-white/90'
                }`}
              >
                <NavIcon path={item.icon} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-2 border-t border-white/[0.07]">
          <Link href="/" className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium text-white/40 hover:bg-white/[0.06] hover:text-white/70 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 14h5a2 2 0 002-2V5a2 2 0 00-2-2h-5m-2 18V3"/></svg>
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <div className="h-14 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-6 flex-shrink-0 gap-4">
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-[#0F2744]">{title || 'Dashboard'}</span>
            {subtitle && <span className="text-[11px] text-[#718096] mt-0.5">{subtitle}</span>}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-[#718096] font-medium">Government of India</div>
              <div className="text-[13px] text-[#0F2744] font-semibold">Ministry of Electronics & IT</div>
            </div>
            <div className="w-[34px] h-[34px] rounded-md bg-[#f0f4f8] border border-[#e2e8f0] flex items-center justify-center text-[#718096] hover:bg-[#0F2744] hover:text-white hover:border-[#0F2744] transition-colors cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {children}
        </main>
      </div>
    </div>
  )
}
