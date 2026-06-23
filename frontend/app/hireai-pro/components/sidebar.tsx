'use client';

import React from 'react';
import { useDashboardStore } from '../store';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Briefcase, 
  HelpCircle, 
  Users, 
  Radio, 
  FileBarChart2, 
  ShieldCheck, 
  Settings,
  Sparkles,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab } = useDashboardStore();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Jobs', icon: Briefcase },
    { name: 'Question Bank', icon: HelpCircle },
    { name: 'Candidates', icon: Users },
    { name: 'Live Interviews', icon: Radio, badge: 'Live' },
    { name: 'Evaluation Reports', icon: FileBarChart2 },
    { name: 'Integrity Dashboard', icon: ShieldCheck, badge: 'Sec' },
    { name: 'Billing & Settings', icon: Settings },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col w-64 
        bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-100/90
        backdrop-blur-xl border-r border-slate-900/60 dark:border-slate-900/60 light:border-slate-200/60
        transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-900/60 dark:border-slate-900/60 light:border-slate-200/60">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 dark:from-white light:from-slate-900 light:to-slate-800">
              HireAI Pro
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  onClose();
                }}
                className={`
                  relative flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${isActive 
                    ? 'text-white shadow-[0_0_20px_rgba(99,102,241,0.15)] bg-slate-900/80 dark:bg-slate-900/80 light:bg-indigo-50 light:text-indigo-600' 
                    : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-slate-900/40 dark:hover:bg-slate-900/40 light:hover:bg-slate-100'
                  }
                `}
              >
                {/* Active Indicator Glow */}
                {isActive && (
                  <motion.div
                    layoutId="activeGlow"
                    className="absolute left-0 w-1 h-6 rounded-r bg-indigo-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-400 light:text-indigo-600' : 'text-slate-400 dark:text-slate-400 light:text-slate-500 group-hover:text-slate-200'}`} />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className={`
                    text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
                    ${item.badge === 'Live' 
                      ? 'bg-emerald-500/10 text-emerald-400 dark:text-emerald-400 light:text-emerald-600 border border-emerald-500/20' 
                      : 'bg-indigo-500/10 text-indigo-400 dark:text-indigo-400 light:text-indigo-600 border border-indigo-500/20'
                    }
                  `}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Recruiter Footnote Info */}
        <div className="p-4 m-4 rounded-2xl bg-gradient-to-b from-slate-900/50 to-slate-950 border border-slate-900/80 dark:border-slate-900/80 light:bg-slate-100 light:border-slate-200">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase tracking-wider">
              Recruiter Mode
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-500 mt-1 leading-relaxed">
            AI Screening Engine is active & analyzing resumes.
          </p>
        </div>
      </aside>
    </>
  );
};
