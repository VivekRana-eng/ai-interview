'use client';

import React, { useState } from 'react';
import { useDashboardStore } from '../store';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  ChevronDown, 
  Menu,
  User,
  LogOut,
  Building2,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { 
    searchVal, 
    setSearchVal, 
    theme, 
    toggleTheme, 
    alerts 
  } = useDashboardStore();

  const [orgOpen, setOrgOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const activeAlerts = alerts.filter(a => !a.resolved);
  const activeAlertsCount = activeAlerts.length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-8 bg-slate-950/40 dark:bg-slate-950/40 light:bg-white/60 backdrop-blur-md border-b border-slate-900/60 dark:border-slate-900/60 light:border-slate-200/60">
      
      {/* Left side: Hamburger & Org Switcher */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Org Switcher */}
        <div className="relative">
          <button 
            onClick={() => setOrgOpen(!orgOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-900 hover:border-slate-800 dark:border-slate-900 dark:hover:border-slate-800 light:border-slate-200 light:hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-200 dark:text-slate-200 light:text-slate-700"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>SelectAI Org</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>
          
          {orgOpen && (
            <div className="absolute left-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-xl p-1 z-50 text-xs text-slate-300 light:bg-white light:border-slate-200 light:text-slate-700">
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 light:hover:bg-slate-100 font-medium">SelectAI Org</button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 light:hover:bg-slate-100 font-medium">Dept of Technology</button>
            </div>
          )}
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex items-center max-w-sm w-full mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search candidates, jobs, alerts..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full h-9 pl-10 pr-4 rounded-xl text-xs bg-slate-900/60 border border-slate-900 focus:border-slate-800 dark:bg-slate-900/60 dark:border-slate-900 dark:focus:border-slate-800 light:bg-slate-100 light:border-slate-200 light:focus:bg-white text-slate-200 dark:text-slate-200 light:text-slate-800 focus:outline-none placeholder-slate-500 transition-all"
          />
        </div>
      </div>

      {/* Right side: Plan, Credits, Notifs, Theme, Profile */}
      <div className="flex items-center gap-3 lg:gap-4">
        
        {/* Plan & Credits */}
        <div className="hidden sm:flex flex-col items-end text-[11px] leading-tight">
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
              Enterprise
            </span>
          </div>
          <span className="text-slate-500 mt-0.5 font-medium">
            <span className="text-slate-300 dark:text-slate-300 light:text-slate-700 font-semibold">1,240</span> / 5,000 Credits
          </span>
        </div>

        <div className="h-6 w-px bg-slate-900 dark:bg-slate-900 light:bg-slate-200 hidden sm:block"></div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-900 dark:border-slate-900 light:border-slate-200 hover:bg-slate-900/60 dark:hover:bg-slate-900/60 light:hover:bg-slate-100 text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications & AI Alerts Badge */}
        <div className="relative">
          <button 
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-xl border border-slate-900 dark:border-slate-900 light:border-slate-200 hover:bg-slate-900/60 dark:hover:bg-slate-900/60 light:hover:bg-slate-100 text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {activeAlertsCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-slate-950 dark:ring-slate-950 light:ring-white">
                {activeAlertsCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 text-xs dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 dark:border-slate-800 light:border-slate-100">
                <span className="font-bold text-slate-200 dark:text-slate-200 light:text-slate-800">AI Alerts Log</span>
                <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.2 rounded font-semibold">
                  {activeAlertsCount} Active
                </span>
              </div>
              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                {activeAlerts.slice(0, 4).map(alert => (
                  <div key={alert.id} className="p-2 rounded-lg bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 border border-slate-900 dark:border-slate-900 light:border-slate-150">
                    <div className="flex items-center justify-between font-semibold">
                      <span className={`capitalize ${alert.severity === 'critical' ? 'text-rose-400' : alert.severity === 'warning' ? 'text-amber-400' : 'text-blue-400'}`}>
                        {alert.type}
                      </span>
                      <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
                    </div>
                    <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 mt-1 text-[11px] leading-tight">{alert.candidateName}: {alert.message}</p>
                  </div>
                ))}
                {activeAlertsCount === 0 && (
                  <div className="text-center py-4 text-slate-500 font-medium">No active security alerts</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 rounded-full border border-slate-900 hover:border-slate-800 dark:border-slate-900 dark:hover:border-slate-800 light:border-slate-200 light:hover:bg-slate-100 transition-colors"
          >
            <img 
              src="https://api.dicebear.com/7.x/pixel-art/svg?seed=admin"
              alt="Recruiter profile" 
              className="w-7 h-7 rounded-full bg-slate-800"
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 pr-1 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-xl p-1.5 z-50 text-xs dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200 text-slate-300 light:text-slate-700">
              <div className="px-3 py-2 border-b border-slate-800 dark:border-slate-800 light:border-slate-100">
                <p className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">Govind Iyer</p>
                <p className="text-[10px] text-slate-500">Chief Recruiter</p>
              </div>
              <button className="w-full text-left px-3 py-2 mt-1.5 rounded-lg hover:bg-slate-800 light:hover:bg-slate-100 flex items-center gap-2 font-medium">
                <User className="w-3.5 h-3.5 text-slate-400" /> My Profile
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 light:hover:bg-slate-100 flex items-center gap-2 text-rose-400 font-medium">
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
