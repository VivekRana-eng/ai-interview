'use client';

import React, { useState } from 'react';
import { useRecruiterStore } from '../store';
import { 
  Search, 
  Bell, 
  Moon, 
  ChevronDown, 
  Menu
} from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { 
    searchVal, 
    setSearchVal 
  } = useRecruiterStore();

  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-8 bg-white border-b border-slate-100 shadow-sm">
      
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates, jobs, reports..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full h-9 pl-10 pr-4 rounded-xl text-xs bg-slate-50 border border-slate-200/80 focus:border-slate-350 focus:bg-white text-slate-800 focus:outline-none placeholder-slate-400 font-semibold transition-all"
          />
        </div>
      </div>

      {/* Right side: Theme, Notifs, Profile */}
      <div className="flex items-center gap-2.5 lg:gap-3">
        
        {/* Theme Toggle (Static design matching screenshot icon) */}
        <button 
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-850 transition-colors"
          title="Toggle Theme"
        >
          <Moon className="w-4 h-4 text-slate-500" />
        </button>

        {/* Notifications & AI Alerts Badge */}
        <div className="relative">
          <button className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-850 transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[9px] font-extrabold text-white ring-2 ring-white">
              37
            </span>
          </button>
        </div>

        {/* Profile Avatar */}
        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-xl border border-slate-200 hover:bg-slate-50 bg-white transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-wider">
              JD
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight text-left">
              <span className="text-xs font-bold text-slate-800">John Doe</span>
              <span className="text-[9px] text-slate-400 font-semibold">Recruiting Director</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pl-0.5" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-slate-200 shadow-xl p-1 z-50 text-xs text-slate-700">
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 font-bold">Profile Settings</button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 font-bold text-rose-500">Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
