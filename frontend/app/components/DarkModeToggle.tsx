'use client'

import { useTheme } from './ThemeProvider'

interface DarkModeToggleProps {
  /** compact = small icon-only button (for admin topbar) | default = full pill button */
  variant?: 'compact' | 'default'
}

export function DarkModeToggle({ variant = 'default' }: DarkModeToggleProps) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  if (variant === 'compact') {
    return (
      <button
        onClick={toggle}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Light mode' : 'Dark mode'}
        className="
          w-[34px] h-[34px] rounded-md flex items-center justify-center
          border border-[#e2e8f0] bg-[#f0f4f8] text-[#718096]
          hover:bg-[#0F2744] hover:text-white hover:border-[#0F2744]
          dark:border-white/10 dark:bg-white/[0.06] dark:text-white/50
          dark:hover:bg-white/[0.12] dark:hover:text-white dark:hover:border-white/20
          transition-all duration-200 cursor-pointer
        "
      >
        {isDark ? (
          /* Sun icon */
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          /* Moon icon */
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>
    )
  }

  // Default: pill toggle with sliding knob
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="
        relative flex items-center gap-2
        px-3 py-1.5 rounded-full
        border border-[#e2e8f0] bg-[#f7f9fc]
        dark:border-white/10 dark:bg-white/[0.06]
        hover:border-[#0F2744] dark:hover:border-white/20
        transition-all duration-200 cursor-pointer
        text-[12px] font-medium text-[#4a5568] dark:text-white/60
        hover:text-[#0F2744] dark:hover:text-white/90
        select-none
      "
    >
      {/* Track */}
      <span
        className="
          relative inline-flex w-8 h-4 rounded-full
          bg-[#e2e8f0] dark:bg-indigo-500
          transition-colors duration-300
        "
      >
        {/* Knob */}
        <span
          className={`
            absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow-sm
            transition-transform duration-300 ease-in-out
            ${isDark ? 'translate-x-4' : 'translate-x-0'}
          `}
        />
      </span>
      <span className="flex items-center gap-1.5">
        {isDark ? (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            Light
          </>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            Dark
          </>
        )}
      </span>
    </button>
  )
}
