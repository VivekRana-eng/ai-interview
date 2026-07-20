'use client';

import React from 'react';
import { Bell, Calendar, Award, FileText, CheckCircle } from 'lucide-react';

export const NotificationsTab: React.FC = () => {
  const notifications = [
    { id: 1, type: 'invite', title: 'Interview invitation confirmed', desc: 'Your technical screening for Staff UI Engineer position has been confirmed for July 19th at 4:30 PM.', date: '20 minutes ago', unread: true, icon: Calendar, color: 'text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10' },
    { id: 2, type: 'report', title: 'Mock Interview report generated', desc: 'Your assessment scorecard for React Core Practice Module has been processed. Final Match: 92%.', date: 'Today, 11:32 AM', unread: true, icon: Award, color: 'text-blue-400 bg-blue-50 dark:bg-blue-500/10' },
    { id: 3, type: 'status', title: 'Application status update', desc: 'Your Senior Product Engineer application status was updated to "Under Review".', date: 'Yesterday', unread: false, icon: FileText, color: 'text-amber-400 bg-amber-50 dark:bg-amber-500/10' },
    { id: 4, type: 'system', title: 'System profile verified', desc: 'Your uploaded resume has been successfully indexed and parsed by the AI matching system.', date: '3 days ago', unread: false, icon: CheckCircle, color: 'text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' }
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto text-left">
      
      <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-5 border-b border-slate-150 dark:border-slate-800/40 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4.5 h-4.5 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-850 dark:text-white">Notifications Hub</h3>
          </div>
          <button className="text-xs text-blue-450 hover:text-blue-300 font-bold transition-colors">
            Mark all as read
          </button>
        </div>

        <div className="space-y-4">
          {notifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <div 
                key={notif.id}
                className={`p-4 rounded-2xl border flex items-start gap-4 transition-all relative overflow-hidden ${
                  notif.unread 
                    ? 'bg-indigo-50/40 dark:bg-[#18233c]/60 border-blue-200 dark:border-blue-500/20' 
                    : 'bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/40 border-slate-150 dark:border-slate-800/60 hover:bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/60'
                }`}
              >
                {notif.unread && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                )}
                
                <div className={`p-2.5 rounded-xl shrink-0 ${notif.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex justify-between items-center gap-4">
                    <h4 className="text-xs font-bold text-slate-850 dark:text-white truncate">{notif.title}</h4>
                    <span className="text-[9px] text-slate-500 font-extrabold shrink-0">{notif.date}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">{notif.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
