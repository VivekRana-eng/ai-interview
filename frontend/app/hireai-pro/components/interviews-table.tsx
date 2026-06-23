'use client';

import React, { useState } from 'react';
import { useDashboardStore } from '../store';
import { Candidate } from '../types';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const InterviewsTable: React.FC = () => {
  const { candidates, searchVal, filterJob } = useDashboardStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter candidates based on search queries and job choices
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchVal.toLowerCase()) || 
                          c.position.toLowerCase().includes(searchVal.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchVal.toLowerCase());
    const matchesJob = filterJob === 'All' || c.position === filterJob;
    return matchesSearch && matchesJob;
  });

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage) || 1;
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRecommendationBadge = (rec: Candidate['recommendation']) => {
    switch (rec) {
      case 'Strong Hire':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-pulse">
            Strong Hire
          </span>
        );
      case 'Hire':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Hire
          </span>
        );
      case 'Maybe':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Maybe
          </span>
        );
      case 'Reject':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Reject
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900">Recent Candidate Assessments</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Evaluation metrics and AI hiring recommendations</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-900/60 dark:border-slate-900/60 light:border-slate-200/60 bg-slate-950/40 dark:bg-slate-950/40 light:bg-white shadow-[0_4px_30px_rgba(0,0,0,0.2)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] light:shadow-[0_4px_30px_rgba(0,0,0,0.05)] backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-900/60 dark:border-slate-900/60 light:border-slate-200/60 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50">
              <th className="py-3 px-4 sm:px-6">Candidate</th>
              <th className="py-3 px-4">Job Role</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-center">AI Score</th>
              <th className="py-3 px-4 text-center">Integrity</th>
              <th className="py-3 px-4 text-right">Recommendation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/40 dark:divide-slate-900/40 light:divide-slate-100 text-xs">
            {paginatedCandidates.map((candidate, index) => (
              <motion.tr 
                key={candidate.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="hover:bg-slate-900/30 dark:hover:bg-slate-900/30 light:hover:bg-slate-50 transition-colors"
              >
                {/* Candidate Info */}
                <td className="py-3 px-4 sm:px-6 flex items-center gap-3">
                  <img 
                    src={candidate.avatarUrl} 
                    alt={candidate.name} 
                    className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-800"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-200 dark:text-slate-200 light:text-slate-800 truncate">{candidate.name}</span>
                    <span className="text-[10px] text-slate-500 truncate">{candidate.email}</span>
                  </div>
                </td>

                {/* Job Role */}
                <td className="py-3 px-4 font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700">
                  {candidate.position}
                </td>

                {/* Date */}
                <td className="py-3 px-4 text-slate-500 font-medium">
                  {candidate.interviewDate}
                </td>

                {/* AI Score */}
                <td className="py-3 px-4 text-center">
                  <div className="inline-flex items-center gap-1 font-bold text-indigo-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{candidate.aiMatchScore}%</span>
                  </div>
                </td>

                {/* Integrity Score */}
                <td className="py-3 px-4 text-center">
                  <div className={`inline-flex items-center gap-1 font-bold ${candidate.integrityScore < 80 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {candidate.integrityScore < 80 ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    <span>{candidate.integrityScore}%</span>
                  </div>
                </td>

                {/* Recommendation */}
                <td className="py-3 px-4 text-right">
                  {getRecommendationBadge(candidate.recommendation)}
                </td>
              </motion.tr>
            ))}

            {filteredCandidates.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500 font-medium bg-transparent">
                  No evaluation reports found matching filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-xl border border-slate-900 hover:border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-900/60 transition-colors text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-xl border border-slate-900 hover:border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-900/60 transition-colors text-slate-400 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
