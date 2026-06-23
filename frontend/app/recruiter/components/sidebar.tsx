'use client';

import React from 'react';
import { useRecruiterStore } from '../store';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Briefcase, 
  HelpCircle, 
  Users, 
  Radio, 
  FileBarChart2, 
  ShieldCheck, 
  Sparkles,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab } = useRecruiterStore();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Jobs', icon: Briefcase },
    { name: 'Question Bank', icon: HelpCircle },
    { name: 'Candidates', icon: Users },
    { name: 'Live Interviews', icon: Radio },
    { name: 'Evaluation Reports', icon: FileBarChart2 },
    { name: 'Integrity Dashboard', icon: ShieldCheck }
  ];

  return (
    <>
      {/* Mobile Sidebar overlay backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col w-64 
        bg-[#090d16] border-r border-[#111827]/40
        transition-transform duration-350 lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Brand Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-900/50">
          <div className="flex items-center gap-3">
            {/* Styled Logo Icon */}
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-md shadow-blue-500/20">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white tracking-wide">
                  HireAI
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-indigo-600 text-white uppercase tracking-wider scale-90">
                  PRO
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wide">
                Next-Gen Recruitment
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 lg:hidden"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-4 py-6 space-y-1">
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
                  relative flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs font-semibold
                  transition-all duration-200 group
                  ${isActive 
                    ? 'text-white bg-slate-900/80 shadow-[0_0_15px_rgba(99,102,241,0.08)] border border-slate-800/40' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
                  }
                `}
              >
                {/* Glow Dot Highlight */}
                {isActive && (
                  <span className="absolute right-3.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                )}

                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-350'}`} />
                  <span>{item.name}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
