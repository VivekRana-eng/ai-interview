'use client';

import React from 'react';
import { useDashboardStore } from '../store';
import { Candidate } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, User } from 'lucide-react';

const COLUMNS: Candidate['status'][] = [
  'Applied',
  'Screening',
  'Interviewing',
  'Shortlisted',
  'Hired'
];

export const KanbanBoard: React.FC = () => {
  const { 
    candidates, 
    updateCandidateStatus, 
    searchVal, 
    filterJob 
  } = useDashboardStore();

  // Filter candidates based on search bar and job dropdown
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchVal.toLowerCase()) || 
                          c.position.toLowerCase().includes(searchVal.toLowerCase());
    const matchesJob = filterJob === 'All' || c.position === filterJob;
    return matchesSearch && matchesJob;
  });

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Required to allow drop
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Candidate['status']) => {
    e.preventDefault();
    const candidateId = e.dataTransfer.getData('text/plain');
    if (candidateId) {
      updateCandidateStatus(candidateId, targetStatus);
    }
  };

  const getStatusColor = (status: Candidate['status']) => {
    switch (status) {
      case 'Applied': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Screening': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Interviewing': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Shortlisted': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      case 'Hired': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900">Candidate Pipeline</h3>
        <p className="text-[11px] text-slate-500 mt-0.5">Drag and drop candidates to progress their hiring lifecycle</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-900 scrollbar-track-transparent">
        {COLUMNS.map((column) => {
          const colCandidates = filteredCandidates.filter((c) => c.status === column);
          const colCount = colCandidates.length;

          return (
            <div
              key={column}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column)}
              className="flex-shrink-0 w-72 rounded-2xl bg-slate-950/30 dark:bg-slate-950/30 light:bg-slate-50 border border-slate-900/60 dark:border-slate-900/60 light:border-slate-200/60 p-4 min-h-[500px] flex flex-col gap-3"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-900/40 dark:border-slate-900/40 light:border-slate-250">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${getStatusColor(column)}`}>
                    {column}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{colCount}</span>
                </div>
              </div>

              {/* Candidates List */}
              <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto max-h-[450px] pr-1.5 scrollbar-thin">
                <AnimatePresence>
                  {colCandidates.map((candidate) => (
                    <motion.div
                      key={candidate.id}
                      layoutId={`card-${candidate.id}`}
                    >
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, candidate.id)}
                        className="
                          p-3.5 rounded-xl cursor-grab active:cursor-grabbing
                          bg-slate-900/60 dark:bg-slate-900/60 light:bg-white
                          border border-slate-900 dark:border-slate-900 light:border-slate-200
                          shadow-md dark:shadow-md light:shadow-sm hover:border-slate-800 dark:hover:border-slate-800 light:hover:border-indigo-400
                          hover:shadow-[0_0_15px_rgba(99,102,241,0.05)]
                          transition-all duration-200
                        "
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={candidate.avatarUrl} 
                            alt={candidate.name} 
                            className="w-8 h-8 rounded-xl bg-slate-800 object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-200 dark:text-slate-200 light:text-slate-800 truncate">
                              {candidate.name}
                            </h4>
                            <p className="text-[10px] text-slate-500 truncate mt-0.5">
                              {candidate.position}
                            </p>
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="mt-3.5 pt-2.5 border-t border-slate-900/40 dark:border-slate-900/40 light:border-slate-100 flex items-center justify-between">
                          {/* AI Match Badge */}
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-[11px] font-bold text-indigo-400">
                              {candidate.aiMatchScore}%
                            </span>
                            <span className="text-[9px] text-slate-500">fit</span>
                          </div>

                          {/* Integrity Alert indicator if low score */}
                          {candidate.integrityScore < 80 ? (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              Sec Alert
                            </span>
                          ) : (
                            <span className="text-[9px] font-semibold text-slate-500">
                              Sec: {candidate.integrityScore}%
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {colCount === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-900/40 dark:border-slate-900/40 light:border-slate-200 rounded-xl p-4 py-8 text-center text-slate-600">
                    <User className="w-6 h-6 mb-2 opacity-30 text-slate-400" />
                    <span className="text-[11px] font-medium">Empty column</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
