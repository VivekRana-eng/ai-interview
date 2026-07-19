'use client';
import * as tw from '@/lib/tailwindClasses'

import { useAuthStore } from '@/app/authStore';
import React, { useState } from 'react';
import { useRecruiterStore } from '../store';
import { useTheme } from '@/app/components/ThemeProvider';
import { 
  Search, 
  Bell, 
  Moon, 
  Sun,
  ChevronDown, 
  Menu
} from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { 
    searchVal, 
    setSearchVal,
    alerts,
    clearNotifications
  } = useRecruiterStore();

  const { theme, toggle } = useTheme();
  const isDarkMode = theme === 'dark';

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const activeAlerts = alerts.filter(a => !a.resolved);

  const userInitials = user ? user.name.split(' ').map(n => n[0]).join('') : 'JD';
  const userName = user ? user.name : 'John Doe';
  const userTitle = user ? user.title : 'Recruiting Director';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-8 bg-[#f7f9fc] dark:bg-[#0b1329] border-b border-[#EEF1F6] dark:border-[#1e293b]">
      
      {/* Left side: Hamburger (Mobile menu trigger) */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/10 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex items-center max-w-sm w-full mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B8AA3]" />
          <input
            type="text"
            placeholder="Search candidates, jobs, reports..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full h-9 pl-10 pr-4 rounded-xl text-xs bg-slate-50 dark:bg-white/[0.06] border border-[#E6EBF2] dark:border-[#1e293b] focus:border-[#93C5FD] focus:bg-white dark:focus:bg-white/10 text-[#111827] dark:text-slate-100 focus:outline-none placeholder-[#7B8AA3] dark:placeholder-slate-500 font-semibold transition-all"
          />
        </div>
      </div>

      {/* Right side: Theme, Notifs, Profile */}
      <div className="flex items-center gap-2.5 lg:gap-3">
        
        {/* Theme Toggle */}
        <button 
          onClick={toggle}
          className="p-2 rounded-xl border border-[#E6EBF2] dark:border-[#1e293b] hover:bg-slate-50 dark:hover:bg-white/10 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Notifications & AI Alerts Badge */}
        <div className="relative">
          <button 
            onClick={() => setNotifsOpen(!notifsOpen)}
            className="p-2 rounded-xl border border-[#E6EBF2] dark:border-[#1e293b] hover:bg-slate-50 dark:hover:bg-white/10 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors relative"
          >
            <Bell className={tw.iconMd} />
            {activeAlerts.length > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[9px] font-extrabold text-white ring-2 ring-white dark:ring-[#0b1329] animate-pulse">
                {activeAlerts.length}
              </span>
            )}
          </button>

          {notifsOpen && (
            <div className="absolute right-[-10px] sm:right-0 mt-2 w-[280px] sm:w-80 rounded-2xl bg-white dark:bg-[#111a2e] border border-[#EEF1F6] dark:border-[#1e293b] shadow-[0_16px_40px_rgba(15,23,42,0.12)] z-50 overflow-hidden">
              
              {/* Header */}
              <div className="flex justify-between items-center px-4 py-3 border-b border-[#EEF1F6] dark:border-[#1e293b] bg-slate-50/60 dark:bg-white/[0.03]">
                <div className="flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span className="font-bold text-[13px] text-[#111827] dark:text-white">Anomalies & Alerts</span>
                  {activeAlerts.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-blue-500 text-[9px] font-extrabold text-white">
                      {activeAlerts.length}
                    </span>
                  )}
                </div>
                {activeAlerts.length > 0 && (
                  <button 
                    onClick={() => { clearNotifications(); }}
                    className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 px-2 py-1 rounded-lg transition-all"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    Clear all
                  </button>
                )}
              </div>

              {/* Alerts List */}
              <div className="max-h-[320px] overflow-y-auto">
                {activeAlerts.length > 0 ? (
                  <div className="p-2 space-y-1.5">
                    {activeAlerts.map(alert => (
                      <div
                        key={alert.id}
                        className="group relative p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-[#1e293b] hover:border-slate-200 dark:hover:border-[#334155] transition-all"
                      >
                        {/* Severity stripe */}
                        <span className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full ${alert.severity === 'critical' ? 'bg-rose-500' : 'bg-blue-500'}`} />
                        
                        <div className="pl-3">
                          <div className="flex justify-between items-start gap-2">
                            <span className={`text-[10px] font-extrabold uppercase tracking-wide ${alert.severity === 'critical' ? 'text-rose-600 dark:text-rose-400' : 'text-blue-600 dark:text-blue-400'}`}>
                              {alert.type}
                            </span>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold">{alert.timestamp}</span>
                              {/* Individual dismiss button */}
                              <button
                                onClick={() => {
                                  const { alerts } = useRecruiterStore.getState();
                                  useRecruiterStore.setState({
                                    alerts: alerts.map(a => a.id === alert.id ? { ...a, resolved: true } : a)
                                  });
                                }}
                                className="opacity-0 group-hover:opacity-100 w-4 h-4 flex items-center justify-center rounded text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                                title="Dismiss"
                              >
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            </div>
                          </div>
                          <p className="text-[10.5px] text-slate-650 dark:text-slate-300 leading-relaxed mt-1">{alert.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-3">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    </div>
                    <p className="text-[12px] font-bold text-slate-700 dark:text-slate-200">All caught up!</p>
                    <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5">No active anomalies or alerts.</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {activeAlerts.length > 0 && (
                <div className="px-4 py-2.5 border-t border-[#EEF1F6] dark:border-[#1e293b] bg-slate-50/60 dark:bg-white/[0.02]">
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 text-center font-medium">
                    Showing {activeAlerts.length} unresolved alert{activeAlerts.length > 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-xl border border-[#E6EBF2] dark:border-[#1e293b] hover:bg-slate-50 dark:hover:bg-white/10 bg-white dark:bg-transparent transition-colors shadow-[0_4px_16px_rgba(15,23,42,0.04)]"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-wider">
              {userInitials}
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight text-left">
              <span className="text-xs font-bold text-[#111827] dark:text-white">{userName}</span>
              <span className="text-[9px] text-[#7B8AA3] dark:text-slate-400 font-semibold">{userTitle}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 pl-0.5" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-[#111a2e] border border-[#EEF1F6] dark:border-[#1e293b] shadow-[0_8px_24px_rgba(15,23,42,0.08)] p-1 z-50 text-xs text-slate-700 dark:text-slate-200">
              <button 
                onClick={() => { alert('Profile settings functionality coming soon!'); setProfileOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/10 font-bold"
              >
                Profile Settings
              </button>
              <button 
                onClick={() => { logout(); }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/10 font-bold text-rose-500 dark:text-rose-400"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
