'use client';

import React from 'react';
import { History, Award, Calendar, FileText } from 'lucide-react';

interface HistoryTabProps {
  onViewFeedback: (item: any) => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ onViewFeedback }) => {
  const history = [
    { id: 1, company: 'Google', role: 'Staff UI Engineer', date: '2026-07-12', duration: '42 mins', status: 'Completed', score: 92 },
    { id: 2, company: 'Stripe', role: 'Senior Product Engineer', date: '2026-07-08', duration: '38 mins', status: 'Completed', score: 88 },
    { id: 3, company: 'Vercel', role: 'React Framework Engineer', date: '2026-07-02', duration: '45 mins', status: 'Completed', score: 95 },
    { id: 4, company: 'GitHub', role: 'Developer Relations Lead', date: '2026-06-25', duration: '40 mins', status: 'Completed', score: 86 }
  ];

  return (
    <div className="space-y-6 text-left">
      
      <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-150 dark:border-slate-800/40 pb-3">
          <History className="w-4.5 h-4.5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-850 dark:text-white">Interview Assessment History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800/50 bg-slate-50 dark:bg-[#0d1424]">
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Company</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Duration</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">AI Score</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/40 text-xs font-semibold">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/25 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-850 dark:text-white">{item.company}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-700 dark:text-slate-200">{item.role}</td>
                  <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{item.date}</td>
                  <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{item.duration}</td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-blue-400 font-extrabold flex items-center justify-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      {item.score}%
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button 
                      onClick={() => onViewFeedback(item)}
                      className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-white rounded-xl transition-all inline-flex items-center gap-1 active:scale-95"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Feedback</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
