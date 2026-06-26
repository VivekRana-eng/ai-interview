'use client';
import * as tw from '@/lib/tailwindClasses'

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
        bg-[#080E1C] backdrop-blur-xl border-r border-white/8
        shadow-[10px_0_30px_rgba(2,6,23,0.35)]
        transition-transform duration-350 lg:fixed lg:translate-x-0 lg:z-auto
        overflow-hidden
        lg:w-[228px]
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="pointer-events-none absolute -top-12 -right-10 h-28 w-28 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-16 -left-10 h-24 w-24 rounded-full bg-violet-500/10 blur-3xl" />

        {/* Sidebar Brand Header */}
        <div className="relative z-10 flex items-center justify-between h-16 px-5 border-b border-white/8 bg-[#0B1222]">
          <div className={tw.flexItemsGap3}>
            {/* Styled Logo Icon */}
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 shadow-md shadow-blue-500/10 ring-1 ring-white/10">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white tracking-wide">
                  HireAI
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-white/10 text-blue-200 uppercase tracking-wider scale-90 ring-1 ring-white/10">
                  PRO
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wide">
                Next-Gen Recruitment
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 lg:hidden transition-all duration-300 active:scale-95"
          >
            <X className={tw.iconLg} />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="relative z-10 flex-1 px-3.5 py-6 space-y-1">
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
                  relative flex items-center justify-between w-full px-3.5 py-2.5 rounded-[10px] text-xs font-semibold
                  transition-all duration-200 ease-out group active:scale-95
                  ${isActive 
                    ? 'text-white bg-[rgba(62,91,255,0.14)] shadow-[0_0_0_1px_rgba(59,130,246,0.16)] border border-blue-400/15' 
                    : 'text-[#AAB6CC] hover:text-white hover:bg-[rgba(255,255,255,0.05)] hover:shadow-[0_10px_22px_rgba(59,130,246,0.06)]'
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-500" />
                )}

                {/* Glow Dot Highlight */}
                {isActive && (
                  <span className="absolute right-3.5 w-1 h-1 rounded-full bg-[#6D8CFF] shadow-[0_0_8px_rgba(109,140,255,0.45)]" />
                )}

                <div className={tw.flexItemsGap3}>
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#6D8CFF]' : 'text-[#7F8CA5] group-hover:text-[#9FB0D0]'}`} />
                  <span>{item.name}</span>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="relative z-10 p-4 border-t border-white/8 bg-[#0B1222]">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0D1528] px-3 py-3 shadow-[0_8px_20px_rgba(0,0,0,0.18)] backdrop-blur-md">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-violet-500 ring-2 ring-blue-400/60 flex items-center justify-center text-white font-bold text-sm">
                JD
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-blue-500 ring-2 ring-white animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-white truncate">John Doe</div>
              <div className="text-[11px] text-slate-400 truncate">Recruiting Director</div>
            </div>
            <div className="text-[10px] font-semibold text-slate-200 bg-white/5 px-2 py-1 rounded-full border border-white/10">
              Online
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
