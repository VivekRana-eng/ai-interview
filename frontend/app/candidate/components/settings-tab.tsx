'use client';

import React, { useState } from 'react';
import { Settings, Lock, Bell, Shield, User, Trash2 } from 'lucide-react';
import { useTheme } from '@/app/components/ThemeProvider';

export const SettingsTab: React.FC = () => {
  const { theme, toggle } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState({
    invites: true,
    reminders: true,
    feedback: false,
    news: false
  });

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-left">
      
      {/* Account Settings */}
      <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-800/40 pb-3">
          <User className="w-4.5 h-4.5 text-blue-450" />
          <h3 className="text-sm font-bold text-slate-850 dark:text-white">Account Settings</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Email Address</span>
            <input 
              type="text" 
              value="candidate@hireai.com" 
              disabled
              className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 font-bold cursor-not-allowed"
            />
          </div>
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Workspace Role</span>
            <input 
              type="text" 
              value="Candidate Access" 
              disabled
              className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 font-bold cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-800/40 pb-3">
          <Lock className="w-4.5 h-4.5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-850 dark:text-white">Change Password</h3>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Current Password</span>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800/60 rounded-xl focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">New Password</span>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800/60 rounded-xl focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Confirm Password</span>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800/60 rounded-xl focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
          <button className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-indigo-600/10 active:scale-95">
            Update Password
          </button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-800/40 pb-3">
          <Bell className="w-4.5 h-4.5 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-850 dark:text-white">Notification Preferences</h3>
        </div>

        <div className="space-y-3.5 text-xs font-semibold text-slate-600 dark:text-slate-350">
          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800/60 rounded-2xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors">
            <div>
              <span className="font-bold text-slate-850 dark:text-white block">Interview Invites</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Receive immediate email notices for scheduled evaluations.</span>
            </div>
            <input 
              type="checkbox" 
              checked={emailNotifications.invites}
              onChange={(e) => setEmailNotifications({ ...emailNotifications, invites: e.target.checked })}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800/60 rounded-2xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors">
            <div>
              <span className="font-bold text-slate-850 dark:text-white block">Evaluation Reminders</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Get 1 hour reminders before scheduled live assessments start.</span>
            </div>
            <input 
              type="checkbox" 
              checked={emailNotifications.reminders}
              onChange={(e) => setEmailNotifications({ ...emailNotifications, reminders: e.target.checked })}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800/60 rounded-2xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors">
            <div>
              <span className="font-bold text-slate-850 dark:text-white block">AI Report Generation</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Notify when final evaluation report cards are ready for review.</span>
            </div>
            <input 
              type="checkbox" 
              checked={emailNotifications.feedback}
              onChange={(e) => setEmailNotifications({ ...emailNotifications, feedback: e.target.checked })}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0"
            />
          </label>
        </div>
      </div>

      {/* Theme preferences */}
      <div className="bg-white border border-slate-200 dark:border-slate-800/85 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-4 border-b border-slate-150 dark:border-slate-800/40 pb-3">Appearance</h3>
        <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800/60 rounded-2xl">
          <div>
            <span className="text-xs font-bold text-slate-850 dark:text-white block">Workspace Theme</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Toggle between light and dark modes.</span>
          </div>
          <button
            onClick={toggle}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white text-xs font-extrabold rounded-xl transition-all"
          >
            Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
        </div>
      </div>

      {/* Account Deletion */}
      <div className="bg-rose-500/5 border border-rose-500/10 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-rose-500/20 pb-3">
          <Trash2 className="w-4.5 h-4.5 text-rose-455" />
          <h3 className="text-sm font-bold text-rose-455">Danger Zone</h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
          Deleting your profile deletes all evaluation history, pending interviews, and matches. This action is permanent.
        </p>
        <button className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-rose-600/10 active:scale-95">
          Delete Profile Account
        </button>
      </div>

    </div>
  );
};
