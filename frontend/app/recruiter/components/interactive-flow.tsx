'use client';

import React from 'react';
import { useRecruiterStore } from '../store';
import { Candidate } from '../types';
import { motion } from 'framer-motion';
import { 
  RotateCcw, 
  ChevronDown, 
  ArrowUpDown, 
  UserPlus, 
  Trash2, 
  Sparkles, 
  User, 
  Plus
} from 'lucide-react';

const STAGES: Candidate['status'][] = ['Applied', 'Screening', 'Interviewing', 'Shortlisted', 'Hired'];

const CircularProgress: React.FC<{ value: number; label: string; sublabel: string }> = ({ value, label, sublabel }) => {
  const radius = 16;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg className="w-10 h-10 transform -rotate-90">
          <circle
            className="text-slate-100"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="20"
            cy="20"
          />
          <circle
            className="text-emerald-500 transition-all duration-550"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="20"
            cy="20"
          />
        </svg>
        <span className="absolute text-[9px] font-extrabold text-slate-800">{value}%</span>
      </div>
      <div className="flex flex-col text-left">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        <span className="text-[10px] font-semibold text-slate-600">{sublabel}</span>
      </div>
    </div>
  );
};

export const InteractiveFlow: React.FC = () => {
  const { 
    candidates, 
    promoteCandidate, 
    setCandidateStage, 
    seedDemoPipeline,
    searchVal,
    filterJob,
    filterStage,
    sortBy
  } = useRecruiterStore();

  // Counts for pipeline summary
  const appliedCount = candidates.filter(c => c.status === 'Applied').length;
  const screeningCount = candidates.filter(c => c.status === 'Screening').length;
  const interviewingCount = candidates.filter(c => c.status === 'Interviewing').length;
  const shortlistCount = candidates.filter(c => c.status === 'Shortlisted').length;
  const hiredCount = candidates.filter(c => c.status === 'Hired').length;

  const total = candidates.length;

  // Filter candidates based on controls
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchVal.toLowerCase()) || 
                          c.position.toLowerCase().includes(searchVal.toLowerCase());
    const matchesJob = filterJob === 'All' || c.position === filterJob;
    return matchesSearch && matchesJob;
  });

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col gap-6">
      
      {/* Brand Header */}
      <div className="flex justify-between items-start pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-850">Applicant Interactive Progression Flow</h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Lays candidate applications horizontally on a timeline. Select or click any stage circle node to shift stages dynamically.</p>
        </div>
        <button 
          onClick={seedDemoPipeline}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-[10px] font-bold text-slate-600 bg-white shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Seed Demo Pipeline</span>
        </button>
      </div>

      {/* 5-Stage Metrics Boxes */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {[
          { label: 'APPLIED', count: appliedCount, detail: 'Start Stage', color: 'text-blue-600 border-blue-100 bg-blue-50/30' },
          { label: 'SCREENING', count: screeningCount, detail: total > 0 ? `${Math.round((screeningCount/total)*100)}% yield` : '0% yield', color: 'text-sky-500 border-sky-100 bg-sky-50/30' },
          { label: 'INTERVIEWING', count: interviewingCount, detail: total > 0 ? `${Math.round((interviewingCount/total)*100)}% yield` : '0% yield', color: 'text-amber-500 border-amber-100 bg-amber-50/30' },
          { label: 'SHORTLIST', count: shortlistCount, detail: total > 0 ? `${Math.round((shortlistCount/total)*100)}% yield` : '0% yield', color: 'text-purple-650 border-purple-100 bg-purple-50/30' },
          { label: 'HIRED', count: hiredCount, detail: 'Success', color: 'text-emerald-500 border-emerald-100 bg-emerald-50/30' }
        ].map((box) => (
          <div key={box.label} className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${box.color} shadow-sm`}>
            <span className="text-[9px] font-bold tracking-wider uppercase text-slate-400">{box.label}</span>
            <span className="text-xl font-extrabold mt-1.5 leading-none">{box.count}</span>
            <span className="text-[9px] font-semibold text-slate-400 mt-1">{box.detail}</span>
          </div>
        ))}
      </div>

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-500">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1">
            <span>Filter Stage:</span>
            <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 bg-white">
              <span>{filterStage}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <span>Sort:</span>
            <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 bg-white">
              <ArrowUpDown className="w-3 h-3" />
              <span>{sortBy}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">QUICK ADD:</span>
          <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-extrabold text-[9px] text-slate-700">
            <Plus className="w-3 h-3 text-slate-400" />
            <span>+ Applied</span>
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-extrabold text-[9px] text-slate-700">
            <Plus className="w-3 h-3 text-slate-400" />
            <span>+ Interview</span>
          </button>
        </div>
      </div>

      {/* Interactive timeline candidate rows */}
      <div className="space-y-4 pt-1">
        {filteredCandidates.map((cand) => {
          const currentStageIdx = STAGES.indexOf(cand.status);

          return (
            <div 
              key={cand.id} 
              className="p-4 rounded-2xl border border-slate-100/80 shadow-[0_1px_4px_rgba(0,0,0,0.01)] hover:border-slate-200 transition-all flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-5 bg-white"
            >
              {/* Profile column */}
              <div className="flex items-center gap-3.5 min-w-[240px]">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center font-bold text-xs border border-indigo-100">
                  {cand.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-800 text-xs">{cand.name}</span>
                    <span className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded border ${cand.recommendation === 'Strong Hire' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                      {cand.recommendation}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{cand.position}</p>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">@{cand.location} • Applied: {cand.interviewDate}</p>
                </div>
              </div>

              {/* Progress circles column */}
              <div className="flex flex-wrap gap-5">
                <CircularProgress value={cand.aiMatchScore} label="AI MATCH" sublabel="Score index" />
                <CircularProgress value={cand.integrityScore} label="INTEGRITY" sublabel="Secure rate" />
              </div>

              {/* Horizontal Timeline progression */}
              <div className="flex-1 max-w-md flex items-center justify-between relative px-2">
                {/* Horizontal Line background */}
                <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-0.5 bg-slate-100" />
                {/* Horizontal active progression line */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 left-4 h-0.5 bg-blue-500 transition-all duration-550" 
                  style={{ width: `${(currentStageIdx / (STAGES.length - 1)) * 90}%` }}
                />

                {STAGES.map((stage, sIdx) => {
                  const isCompleted = sIdx <= currentStageIdx;
                  const isActive = sIdx === currentStageIdx;

                  return (
                    <button
                      key={stage}
                      onClick={() => setCandidateStage(cand.id, stage)}
                      className="relative z-10 flex flex-col items-center group focus:outline-none"
                    >
                      <div className={`
                        w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300
                        ${isActive 
                          ? 'bg-blue-600 border-blue-600 ring-4 ring-blue-50 shadow-sm' 
                          : isCompleted 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'bg-white border-slate-200 group-hover:border-slate-350'
                        }
                      `}>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                      </div>
                      <span className={`text-[8px] font-extrabold uppercase mt-1.5 tracking-wider ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                        {stage === 'Shortlisted' ? 'Shortlisted' : stage}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons column */}
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={() => promoteCandidate(cand.id)}
                  className="px-4 py-1.5 rounded-xl text-[9px] font-extrabold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
                >
                  Promote &gt;
                </button>
                <button className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm">
                  <User className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 hover:text-rose-500 transition-colors shadow-sm">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
