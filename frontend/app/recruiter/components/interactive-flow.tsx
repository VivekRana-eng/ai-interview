'use client';
import * as tw from '@/lib/tailwindClasses'

import React, { useState } from 'react';
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
    <div className={tw.flexItemsGap2}>
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
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isStageFilterOpen, setIsStageFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const { 
    candidates, 
    jobs,
    promoteCandidate, 
    setCandidateStage, 
    seedDemoPipeline,
    searchVal,
    filterJob,
    filterStage,
    sortBy,
    setFilterStage,
    setSortBy,
    addCandidate,
    deleteCandidate
  } = useRecruiterStore();

  // Counts for pipeline summary
  const appliedCount = candidates.filter(c => c.status === 'Applied').length;
  const screeningCount = candidates.filter(c => c.status === 'Screening').length;
  const interviewingCount = candidates.filter(c => c.status === 'Interviewing').length;
  const shortlistCount = candidates.filter(c => c.status === 'Shortlisted').length;
  const hiredCount = candidates.filter(c => c.status === 'Hired').length;

  const total = candidates.length;

  // Filter candidates based on controls
  const filteredCandidates = candidates
    .filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(searchVal.toLowerCase()) || 
                            c.position.toLowerCase().includes(searchVal.toLowerCase());
      const matchesJob = filterJob === 'All' || c.position === filterJob;
      const matchesStage = filterStage === 'All' || c.status.toLowerCase() === filterStage.toLowerCase();
      return matchesSearch && matchesJob && matchesStage;
    })
    .sort((a, b) => {
      if (sortBy === 'Highest AI Match') return b.aiMatchScore - a.aiMatchScore;
      if (sortBy === 'Lowest AI Match') return a.aiMatchScore - b.aiMatchScore;
      if (sortBy === 'Highest Integrity') return b.integrityScore - a.integrityScore;
      if (sortBy === 'Name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <>
      <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-white border border-slate-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col gap-5 sm:gap-6 min-w-0">
      
      {/* Brand Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm md:text-[15px] font-bold text-slate-850 leading-tight">Applicant Interactive Progression Flow</h3>
          <p className="text-[10px] md:text-[11px] text-slate-400 font-semibold mt-0.5 leading-snug max-w-2xl">
            Lays candidate applications horizontally on a timeline. Select or click any stage circle node to shift stages dynamically.
          </p>
        </div>
        <button 
          onClick={seedDemoPipeline}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-[10px] font-bold text-slate-600 bg-white shadow-sm w-full sm:w-auto"
        >
          <RotateCcw className={tw.iconSm} />
          <span>Seed Demo Pipeline</span>
        </button>
      </div>

      {/* 5-Stage Metrics Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3.5">
        {[
          { label: 'APPLIED', count: appliedCount, detail: 'Start Stage', color: 'text-blue-600 border-blue-100 bg-blue-50/30' },
          { label: 'SCREENING', count: screeningCount, detail: total > 0 ? `${Math.round((screeningCount/total)*100)}% yield` : '0% yield', color: 'text-sky-500 border-sky-100 bg-sky-50/30' },
          { label: 'INTERVIEWING', count: interviewingCount, detail: total > 0 ? `${Math.round((interviewingCount/total)*100)}% yield` : '0% yield', color: 'text-amber-500 border-amber-100 bg-amber-50/30' },
          { label: 'SHORTLIST', count: shortlistCount, detail: total > 0 ? `${Math.round((shortlistCount/total)*100)}% yield` : '0% yield', color: 'text-purple-650 border-purple-100 bg-purple-50/30' },
          { label: 'HIRED', count: hiredCount, detail: 'Success', color: 'text-emerald-500 border-emerald-100 bg-emerald-50/30' }
        ].map((box) => (
          <div key={box.label} className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${box.color} shadow-sm min-w-0`}>
            <span className="text-[9px] font-bold tracking-wider uppercase text-slate-400">{box.label}</span>
            <span className="text-xl font-extrabold mt-1.5 leading-none">{box.count}</span>
            <span className="text-[9px] font-semibold text-slate-400 mt-1">{box.detail}</span>
          </div>
        ))}
      </div>

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-500">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5">
            <span>Filter Stage:</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsStageFilterOpen(!isStageFilterOpen);
                  setIsSortOpen(false);
                }}
                className={`flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-xl border transition-colors text-[10px] font-bold min-w-[110px] ${
                  filterStage !== 'All' ? 'bg-blue-50 text-blue-755 border-blue-200' : 'border-slate-200 hover:bg-slate-50 bg-white text-slate-700'
                }`}
              >
                <span>{filterStage === 'All' ? 'All Stages' : filterStage}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isStageFilterOpen && (
                <div className="absolute left-0 mt-1.5 w-44 rounded-xl bg-white border border-slate-100 shadow-[0_8px_24px_rgba(15,23,42,0.08)] p-1 z-50 text-slate-700 max-h-60 overflow-y-auto">
                  <div className="px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-50">
                    Filter by Stage
                  </div>
                  {[
                    { value: 'All', label: 'All Stages' },
                    { value: 'Applied', label: 'Applied' },
                    { value: 'Screening', label: 'Screening' },
                    { value: 'Interviewing', label: 'Interviewing' },
                    { value: 'Shortlisted', label: 'Shortlisted' },
                    { value: 'Hired', label: 'Hired' }
                  ].map((stage) => (
                    <button
                      key={stage.value}
                      type="button"
                      onClick={() => {
                        setFilterStage(stage.value);
                        setIsStageFilterOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-[10px] font-bold transition-colors ${
                        filterStage === stage.value ? 'bg-blue-50/50 text-blue-650' : 'hover:bg-slate-50'
                      }`}
                    >
                      {stage.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Sort:</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsSortOpen(!isSortOpen);
                  setIsStageFilterOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 bg-white transition-colors text-[10px] font-bold text-slate-700"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[120px]">{sortBy}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isSortOpen && (
                <div className="absolute left-0 mt-1.5 w-44 rounded-xl bg-white border border-slate-100 shadow-[0_8px_24px_rgba(15,23,42,0.08)] p-1 z-50 text-slate-700 max-h-60 overflow-y-auto">
                  <div className="px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-50">
                    Sort By
                  </div>
                  {[
                    { value: 'Highest AI Match', label: 'Highest AI Match' },
                    { value: 'Lowest AI Match', label: 'Lowest AI Match' },
                    { value: 'Highest Integrity', label: 'Highest Integrity' },
                    { value: 'Name', label: 'Name' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSortBy(option.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-[10px] font-bold transition-colors ${
                        sortBy === option.value ? 'bg-blue-50/50 text-blue-650' : 'hover:bg-slate-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400">QUICK ADD:</span>
          <button
            onClick={() => {
              const firstNames = ['Arjun', 'Priya', 'Aditya', 'Ananya', 'Rohan', 'Sneha', 'Rahul', 'Kriti'];
              const lastNames = ['Sharma', 'Patel', 'Verma', 'Mehta', 'Rao', 'Joshi', 'Gupta', 'Sen'];
              const randomName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
              const randomEmail = `${randomName.toLowerCase().replace(' ', '.')}@selectai.gov.in`;
              
              const activeJobs = jobs.filter(j => j.status === 'Active');
              const positions = activeJobs.length > 0 
                ? activeJobs.map(j => j.title)
                : ['AI / Machine Learning Researcher', 'Senior Full Stack Engineer', 'Security Engineer (DevSecOps)'];
              const randomPos = positions[Math.floor(Math.random() * positions.length)];
              
              const id = 'cand-' + Date.now();
              addCandidate({
                id,
                name: randomName,
                position: randomPos,
                location: 'New Delhi, IN',
                email: randomEmail,
                avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${randomName}`,
                aiMatchScore: Math.floor(Math.random() * 26) + 70,
                integrityScore: Math.floor(Math.random() * 16) + 82,
                status: 'Applied',
                recommendation: Math.random() > 0.5 ? 'Hire' : 'Maybe',
                interviewDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              });
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-extrabold text-[9px] text-slate-700"
          >
            <Plus className="w-3 h-3 text-slate-400" />
            <span>Applied</span>
          </button>
          <button
            onClick={() => {
              const firstNames = ['Vikram', 'Neha', 'Kabir', 'Divya', 'Siddharth', 'Ishita', 'Aarav', 'Kiara'];
              const lastNames = ['Nair', 'Singh', 'Kapoor', 'Reddy', 'Choudhury', 'Bose', 'Mishra', 'Das'];
              const randomName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
              const randomEmail = `${randomName.toLowerCase().replace(' ', '.')}@selectai.gov.in`;
              
              const activeJobs = jobs.filter(j => j.status === 'Active');
              const positions = activeJobs.length > 0 
                ? activeJobs.map(j => j.title)
                : ['AI / Machine Learning Researcher', 'Senior Full Stack Engineer', 'Security Engineer (DevSecOps)'];
              const randomPos = positions[Math.floor(Math.random() * positions.length)];
              
              const id = 'cand-' + Date.now();
              addCandidate({
                id,
                name: randomName,
                position: randomPos,
                location: 'Bengaluru, IN',
                email: randomEmail,
                avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${randomName}`,
                aiMatchScore: Math.floor(Math.random() * 21) + 80,
                integrityScore: Math.floor(Math.random() * 11) + 88,
                status: 'Interviewing',
                recommendation: Math.random() > 0.4 ? 'Strong Hire' : 'Hire',
                interviewDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              });
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-extrabold text-[9px] text-slate-700"
          >
            <Plus className="w-3 h-3 text-slate-400" />
            <span>Interviewed</span>
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
              className="p-4 rounded-2xl border border-slate-100/80 shadow-[0_1px_4px_rgba(0,0,0,0.01)] hover:border-slate-200 transition-all flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 sm:gap-5 bg-white min-w-0"
            >
              {/* Profile column */}
              <div className="flex items-center gap-3.5 min-w-0 xl:min-w-[240px]">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center font-bold text-xs border border-indigo-100">
                  {cand.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className={tw.flexItemsGap2}>
                    <span className="font-extrabold text-slate-800 text-xs">{cand.name}</span>
                    <span className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded border ${cand.recommendation === 'Strong Hire' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                      {cand.recommendation}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5 break-words">{cand.position}</p>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5 break-words">@{cand.location} • Applied: {cand.interviewDate}</p>
                </div>
              </div>

              {/* Progress circles column */}
              <div className="flex flex-wrap gap-4 sm:gap-5">
                <CircularProgress value={cand.aiMatchScore} label="AI MATCH" sublabel="Score index" />
                <CircularProgress value={cand.integrityScore} label="INTEGRITY" sublabel="Secure rate" />
              </div>

              {/* Horizontal Timeline progression */}
              <div className="flex-1 w-full xl:max-w-md flex items-center justify-between relative px-2">
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
              <div className="flex flex-wrap items-center gap-2 justify-end">
                <button
                  onClick={() => promoteCandidate(cand.id)}
                  className="px-4 py-1.5 rounded-xl text-[9px] font-extrabold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
                >
                  Promote &gt;
                </button>
                <button
                  onClick={() => setSelectedCandidate(cand)}
                  className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm"
                >
                  <User className={tw.iconSm} />
                </button>
                <button
                  onClick={() => deleteCandidate(cand.id)}
                  className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 hover:text-rose-500 transition-colors shadow-sm"
                >
                  <Trash2 className={tw.iconSm} />
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>

    {/* Candidate Profile Details Modal */}
    {selectedCandidate && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in-95 duration-200 text-slate-800">
          <button 
            onClick={() => setSelectedCandidate(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 font-extrabold text-sm"
          >
            ✕
          </button>
          <div className="flex items-center gap-4 mb-5 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center font-extrabold text-base border border-indigo-100">
              {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{selectedCandidate.name}</h4>
              <p className="text-xs text-[#7B8AA3] font-semibold mt-0.5">{selectedCandidate.position}</p>
            </div>
          </div>
          <div className="space-y-3.5 text-xs font-semibold text-slate-700">
            <div className="grid grid-cols-2 gap-3 bg-slate-55/40 p-3.5 rounded-xl border border-slate-100 mb-2">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">AI Match Score</span>
                <span className="text-sm font-extrabold text-slate-800">{selectedCandidate.aiMatchScore}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Integrity Index</span>
                <span className="text-sm font-extrabold text-[#1D9E75]">{selectedCandidate.integrityScore}%</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">Email Address</span>
              <span className="text-slate-600 font-medium">{selectedCandidate.email}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">Location</span>
              <span className="text-slate-600 font-medium">{selectedCandidate.location}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">Applied On</span>
              <span className="text-slate-600 font-medium">{selectedCandidate.interviewDate}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">Current Status</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-extrabold">
                {selectedCandidate.status}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">AI Recommendation</span>
              <div>
                {selectedCandidate.recommendation === 'Strong Hire' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-250">Strong Hire</span>
                )}
                {selectedCandidate.recommendation === 'Hire' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-250">Hire</span>
                )}
                {selectedCandidate.recommendation === 'Maybe' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-250">Maybe</span>
                )}
                {selectedCandidate.recommendation === 'Reject' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-250">Reject</span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button 
              onClick={() => setSelectedCandidate(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              Close Profile
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};
