'use client';

import React, { useState } from 'react';
import { useRecruiterStore } from '../store';
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
    isDarkMode,
    toggleTheme,
    alerts,
    clearNotifications
  } = useRecruiterStore();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);

  const activeAlerts = alerts.filter(a => !a.resolved);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-8 bg-white border-b border-[#EEF1F6] shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
      
      {/* Left side: Hamburger (Mobile menu trigger) */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 lg:hidden"
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
            className="w-full h-9 pl-10 pr-4 rounded-xl text-xs bg-slate-50 border border-[#E6EBF2] focus:border-[#93C5FD] focus:bg-white text-[#111827] focus:outline-none placeholder-[#7B8AA3] font-semibold transition-all"
          />
        </div>
      </div>

      {/* Right side: Theme, Notifs, Profile */}
      <div className="flex items-center gap-2.5 lg:gap-3">
        
        {/* Theme Toggle (Static design matching screenshot icon) */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-[#E6EBF2] hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Notifications & AI Alerts Badge */}
        <div className="relative">
          <button 
            onClick={() => setNotifsOpen(!notifsOpen)}
            className="p-2 rounded-xl border border-[#E6EBF2] hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {activeAlerts.length > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[9px] font-extrabold text-white ring-2 ring-white">
                {activeAlerts.length}
              </span>
            )}
          </button>

          {notifsOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-[#EEF1F6] shadow-[0_8px_24px_rgba(15,23,42,0.08)] p-3.5 z-50 text-xs text-slate-700 space-y-2.5 max-h-[300px] overflow-y-auto">
              <div className="flex justify-between items-center pb-2 border-b border-[#EEF1F6]">
                <span className="font-bold text-[#111827]">Anomalies & Alerts</span>
                {activeAlerts.length > 0 && (
                  <button 
                    onClick={() => { clearNotifications(); setNotifsOpen(false); }}
                    className="text-[10px] text-blue-600 hover:underline font-bold"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {activeAlerts.map(alert => (
                  <div key={alert.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex flex-col gap-0.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className={`font-bold ${alert.severity === 'critical' ? 'text-rose-600' : 'text-slate-500'}`}>{alert.type}</span>
                      <span className="text-[8px] text-slate-400 font-semibold">{alert.timestamp}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-0.5">{alert.message}</p>
                  </div>
                ))}
                {activeAlerts.length === 0 && (
                  <p className="text-slate-400 text-center py-6 font-semibold">No new notifications</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-xl border border-[#E6EBF2] hover:bg-slate-50 bg-white transition-colors shadow-[0_4px_16px_rgba(15,23,42,0.04)]"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-wider">
              JD
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight text-left">
              <span className="text-xs font-bold text-[#111827]">John Doe</span>
              <span className="text-[9px] text-[#7B8AA3] font-semibold">Recruiting Director</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pl-0.5" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-[#EEF1F6] shadow-[0_8px_24px_rgba(15,23,42,0.08)] p-1 z-50 text-xs text-slate-700">
              <button 
                onClick={() => { alert('Profile settings functionality coming soon!'); setProfileOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 font-bold"
              >
                Profile Settings
              </button>
              <button 
                onClick={() => { window.location.href = '/admin/login'; }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 font-bold text-rose-500"
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
