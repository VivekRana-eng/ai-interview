'use client';
import * as tw from '@/lib/tailwindClasses'

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pagination state for progress flow
  const [currentPageFlow, setCurrentPageFlow] = useState(1);
  const itemsPerPageFlow = 5;

  // Toast state for hired notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Confirm dialog state to prevent accidental click on promote/delete
  const [confirmDialog, setConfirmDialog] = useState<{
    type: 'promote' | 'stage' | 'delete';
    candidate: Candidate;
    targetStage?: Candidate['status'];
  } | null>(null);

  const showHiredToast = (name: string, position: string) => {
    setToastMessage(`${name} is hired as ${position}`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

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

  const replaceHiredCandidate = async (hiredCandId: string) => {
    const firstNames = ['Arjun', 'Priya', 'Aditya', 'Ananya', 'Rohan', 'Sneha', 'Rahul', 'Kriti', 'Vikram', 'Neha', 'Kabir', 'Divya'];
    const lastNames = ['Sharma', 'Patel', 'Verma', 'Mehta', 'Rao', 'Joshi', 'Gupta', 'Sen', 'Nair', 'Singh', 'Kapoor', 'Reddy'];
    const randomName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    const randomEmail = `${randomName.toLowerCase().replace(' ', '.')}@selectai.gov.in`;

    const activeJobs = jobs.filter(j => j.status === 'Active');
    const positions = activeJobs.length > 0 
      ? activeJobs.map(j => j.title)
      : ['AI / Machine Learning Researcher', 'Senior Full Stack Engineer', 'Security Engineer (DevSecOps)', 'UI/UX Designer'];
    const randomPos = positions[Math.floor(Math.random() * positions.length)];
    
    const id = 'cand-' + Date.now();
    
    // Promote candidate to Hired in the database & store so the circle chart is updated
    await setCandidateStage(hiredCandId, 'Hired');

    // Add the new candidate
    await addCandidate({
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
  };

  const handlePromoteClick = (cand: Candidate) => {
    const currIdx = STAGES.indexOf(cand.status);
    const nextIdx = Math.min(currIdx + 1, STAGES.length - 1);
    const nextStatus = STAGES[nextIdx];

    setConfirmDialog({
      type: 'promote',
      candidate: cand,
      targetStage: nextStatus
    });
  };

  const handleStageClick = (cand: Candidate, stage: Candidate['status']) => {
    if (stage === cand.status) return; // No stage changes needed
    setConfirmDialog({
      type: 'stage',
      candidate: cand,
      targetStage: stage
    });
  };

  const handleDeleteClick = (cand: Candidate) => {
    setConfirmDialog({
      type: 'delete',
      candidate: cand
    });
  };

  const handleConfirmAction = () => {
    if (!confirmDialog) return;
    const { type, candidate, targetStage } = confirmDialog;
    setConfirmDialog(null);

    if (type === 'promote' && targetStage) {
      if (targetStage === 'Hired') {
        showHiredToast(candidate.name, candidate.position);
        replaceHiredCandidate(candidate.id);
      } else {
        promoteCandidate(candidate.id);
      }
    } else if (type === 'stage' && targetStage) {
      if (targetStage === 'Hired' && candidate.status !== 'Hired') {
        showHiredToast(candidate.name, candidate.position);
        replaceHiredCandidate(candidate.id);
      } else {
        setCandidateStage(candidate.id, targetStage);
      }
    } else if (type === 'delete') {
      deleteCandidate(candidate.id);
    }
  };
  const isAllJobs = filterJob === 'All' || filterJob === 'All Jobs';
  const isAllStages = filterStage === 'All' || filterStage === 'All Stages' || filterStage === 'All Stages (3)';

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
      // Hide hired candidates from the active timeline flow
      if (c.status === 'Hired') return false;

      const matchesSearch = c.name.toLowerCase().includes(searchVal.toLowerCase()) || 
                            c.position.toLowerCase().includes(searchVal.toLowerCase());
      const matchesJob = isAllJobs || c.position === filterJob;
      const matchesStage = isAllStages || c.status.toLowerCase() === filterStage.toLowerCase();
      return matchesSearch && matchesJob && matchesStage;
    })
    .sort((a, b) => {
      if (sortBy === 'Highest AI Match') return b.aiMatchScore - a.aiMatchScore;
      if (sortBy === 'Lowest AI Match') return a.aiMatchScore - b.aiMatchScore;
      if (sortBy === 'Highest Integrity') return b.integrityScore - a.integrityScore;
      if (sortBy === 'Name') return a.name.localeCompare(b.name);
      return 0;
    });

  const totalPagesFlow = Math.ceil(filteredCandidates.length / itemsPerPageFlow);
  const currentPage = Math.max(1, Math.min(currentPageFlow, totalPagesFlow || 1));
  const displayCandidates = filteredCandidates.slice((currentPage - 1) * itemsPerPageFlow, currentPage * itemsPerPageFlow);

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
                  !isAllStages ? 'bg-blue-50 text-blue-755 border-blue-200' : 'border-slate-200 hover:bg-slate-50 bg-white text-slate-700'
                }`}
              >
                <span>{isAllStages ? 'All Stages' : filterStage}</span>
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
                        (filterStage === stage.value || (stage.value === 'All' && isAllStages)) ? 'bg-blue-50/50 text-blue-650' : 'hover:bg-slate-50'
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
      </div>

      {/* Interactive timeline candidate rows */}
      <div className="space-y-4 pt-1">
        {displayCandidates.map((cand) => {
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
                      onClick={() => handleStageClick(cand, stage)}
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
                {cand.status !== 'Hired' && (
                  <button
                    onClick={() => handlePromoteClick(cand)}
                    className="px-4 py-1.5 rounded-xl text-[9px] font-extrabold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
                  >
                    Promote &gt;
                  </button>
                )}
                <button
                  onClick={() => setSelectedCandidate(cand)}
                  className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm"
                >
                  <User className={tw.iconSm} />
                </button>
                <button
                  onClick={() => handleDeleteClick(cand)}
                  className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 hover:text-rose-500 transition-colors shadow-sm"
                >
                  <Trash2 className={tw.iconSm} />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPagesFlow > 1 && (
        <div className="flex justify-between items-center pt-4 border-t border-slate-100 text-[10px] font-bold text-slate-500">
          <span>
            Showing {Math.min(filteredCandidates.length, (currentPage - 1) * itemsPerPageFlow + 1)}–{Math.min(filteredCandidates.length, currentPage * itemsPerPageFlow)} of {filteredCandidates.length} candidates
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrentPageFlow(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white text-slate-700 transition-colors shadow-sm"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPageFlow(prev => Math.min(totalPagesFlow, prev + 1))}
              disabled={currentPage === totalPagesFlow}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white text-slate-700 transition-colors shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>

    {/* Candidate Profile Details Modal */}
    {mounted && selectedCandidate && createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
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
              <h4 className="font-extrabold text-slate-850 text-slate-800 text-sm leading-tight">{selectedCandidate.name}</h4>
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
      </div>,
      document.body
    )}

    {/* Hired Toast Alert */}
    {toastMessage && (
      <div 
        className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800/80 transition-all duration-300"
        style={{
          animation: 'toast-enter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-black shadow-sm">
          ✓
        </div>
        <span className="text-xs font-bold tracking-tight text-slate-100">{toastMessage}</span>
        <style>{`
          @keyframes toast-enter {
            from { opacity: 0; transform: translate3d(-50%, -20px, 0) scale(0.95); }
            to { opacity: 1; transform: translate3d(-50%, 0, 0) scale(1); }
          }
        `}</style>
      </div>
    )}

    {/* Action Confirmation Modal */}
    {mounted && confirmDialog && createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div 
          className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 relative animate-in fade-in zoom-in-95 duration-200 text-slate-800"
          style={{
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)'
          }}
        >
          <h4 className="font-extrabold text-slate-850 text-sm leading-tight mb-2">
            {confirmDialog.type === 'delete' ? 'Delete Candidate' : confirmDialog.type === 'promote' ? 'Promote Candidate' : 'Move Stage'}
          </h4>
          
          <p className="text-xs font-semibold text-slate-500 mb-5 leading-normal">
            {confirmDialog.type === 'delete' && (
              <>Are you sure you want to delete <span className="font-extrabold text-slate-800">{confirmDialog.candidate.name}</span> from the pipeline? This action cannot be undone.</>
            )}
            {confirmDialog.type === 'promote' && (
              <>Are you sure you want to promote <span className="font-extrabold text-slate-800">{confirmDialog.candidate.name}</span> to the <span className="font-extrabold text-blue-600 uppercase tracking-wider">{confirmDialog.targetStage}</span> stage?</>
            )}
            {confirmDialog.type === 'stage' && (
              <>Are you sure you want to manually change <span className="font-extrabold text-slate-800">{confirmDialog.candidate.name}</span>'s stage to <span className="font-extrabold text-blue-600 uppercase tracking-wider">{confirmDialog.targetStage}</span>?</>
            )}
          </p>

          <div className="flex justify-end gap-2.5">
            <button
              onClick={() => setConfirmDialog(null)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-[10px] font-bold rounded-xl transition-colors bg-white shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmAction}
              className={`px-4 py-2 text-white text-[10px] font-bold rounded-xl transition-colors shadow-sm ${
                confirmDialog.type === 'delete' 
                  ? 'bg-rose-600 hover:bg-rose-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>,
      document.body
    )}
    </>
  );
};
