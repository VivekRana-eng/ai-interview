'use client';

import React from 'react';
import { useRecruiterStore } from '../store';
import { Candidate } from '../types';
import { ExternalLink, Sparkles, Circle } from 'lucide-react';

export const EvaluationsTable: React.FC = () => {
  const { candidates } = useRecruiterStore();

  const getRecommendationBadge = (rec: Candidate['recommendation']) => {
    switch (rec) {
      case 'Strong Hire':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-250">
            Strong Hire
          </span>
        );
      case 'Hire':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-250">
            Hire
          </span>
        );
      case 'Maybe':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-250">
            Maybe
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-250">
            Reject
          </span>
        );
    }
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 90) return 'bg-[#10b981]'; // emerald green
    return 'bg-blue-600'; // royal blue
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col gap-5">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Recent Evaluations</h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Overview of latest automated and live candidate matches</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-[10px] font-bold text-blue-600 shadow-sm bg-white">
          <span>View All</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th className="pb-3 pr-4">Candidate</th>
              <th className="pb-3 px-4">Job Role</th>
              <th className="pb-3 px-4">Date</th>
              <th className="pb-3 px-4 text-left">Match Score</th>
              <th className="pb-3 px-4 text-center">Integrity</th>
              <th className="pb-3 pl-4 text-right">Recommendation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
            {candidates.map((cand) => (
              <tr key={cand.id} className="hover:bg-slate-50/50 transition-colors">
                
                {/* Candidate name & avatar */}
                <td className="py-4 pr-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-150">
                    {cand.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-800 text-[11px]">{cand.name}</span>
                    <span className="text-[9px] text-slate-400 font-semibold truncate">{cand.email}</span>
                  </div>
                </td>

                {/* Job Role */}
                <td className="py-4 px-4 font-bold text-slate-500 truncate max-w-[200px]">
                  {cand.position}
                </td>

                {/* Date */}
                <td className="py-4 px-4 font-semibold text-slate-400">
                  {cand.interviewDate}
                </td>

                {/* Match Score Progress Bar */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${getProgressBarColor(cand.aiMatchScore)}`}
                        style={{ width: `${cand.aiMatchScore}%` }} 
                      />
                    </div>
                    <span className="font-extrabold text-[11px] text-slate-800">{cand.aiMatchScore}%</span>
                  </div>
                </td>

                {/* Integrity Secure Circle */}
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-600">
                    <Circle className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span className="font-extrabold text-[11px]">{cand.integrityScore}%</span>
                  </div>
                </td>

                {/* Recommendation Badges */}
                <td className="py-4 pl-4 text-right">
                  {getRecommendationBadge(cand.recommendation)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
