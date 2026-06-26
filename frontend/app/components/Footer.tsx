import { badgeBase, badgeSuccess, footerShell } from '@/lib/tailwindClasses'
import * as tw from '@/lib/tailwindClasses'

export function Footer() {
  return (
    <footer className={footerShell}>
      <div className="max-w-[1200px] mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-xs text-[#718096]">
          <span className={`${badgeBase} ${badgeSuccess}`}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" stroke="#1D9E75" strokeWidth="1.2"/><circle cx="5" cy="5" r="1.5" fill="#1D9E75"/></svg>
            Powered by AI
          </span>
          <span className="text-[#e2e8f0]">·</span>
          <span>Hosted on NIC Infrastructure</span>
        </div>
        <div className={tw.textSecondary12}>Government of India · © 2026 SelectAI</div>
      </div>
    </footer>
  )
}
