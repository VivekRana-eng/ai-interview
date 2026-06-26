'use client';
import * as tw from '@/lib/tailwindClasses'

import React, { useState, useRef, useEffect } from 'react';
import { useRecruiterStore } from '../store';
import { Candidate, Job } from '../types';
import { 
  Sparkles, Upload, FileText, CheckCircle2, AlertTriangle, 
  User, Mail, MapPin, Award, BookOpen, Briefcase, ChevronRight, 
  Search, Info, ShieldCheck, Loader2, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ResumeScreener: React.FC = () => {
  const { 
    jobs, 
    candidates, 
    screenResume 
  } = useRecruiterStore();

  const [selectedJobTitle, setSelectedJobTitle] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeScreenedCandidate, setActiveScreenedCandidate] = useState<Candidate | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'details'>('overview');
  const [historySearch, setHistorySearch] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize selected job role
  useEffect(() => {
    const activeJobs = jobs.filter(j => j.status === 'Active');
    if (activeJobs.length > 0 && !selectedJobTitle) {
      setSelectedJobTitle(activeJobs[0].title);
    }
  }, [jobs]);

  // List of candidates who have been screened (possessing summary and details)
  const screenedCandidates = candidates.filter(c => 
    c.summary || 
    (c.skills && c.skills.length > 0) || 
    (c.strengths && c.strengths.length > 0)
  );

  // Set the first screened candidate as active if no candidate is selected
  useEffect(() => {
    if (screenedCandidates.length > 0 && !activeScreenedCandidate) {
      setActiveScreenedCandidate(screenedCandidates[0]);
    }
  }, [candidates]);

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validTypes = [
        'application/pdf', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
        'text/plain'
      ];
      if (validTypes.includes(file.type) || file.name.endsWith('.docx') || file.name.endsWith('.pdf')) {
        setSelectedFile(file);
        setErrorMsg(null);
      } else {
        setErrorMsg('Please upload a PDF, DOCX, or plain text file.');
      }
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const validTypes = [
        'application/pdf', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
        'text/plain'
      ];
      if (validTypes.includes(file.type) || file.name.endsWith('.docx') || file.name.endsWith('.pdf')) {
        setSelectedFile(file);
        setErrorMsg(null);
      } else {
        setErrorMsg('Please upload a PDF, DOCX, or plain text file.');
      }
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  // Screen Resume API call
  const handleScreenResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedJobTitle) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const candidate = await screenResume(selectedFile, selectedJobTitle);
      if (candidate) {
        setActiveScreenedCandidate(candidate);
        setSelectedFile(null);
        setActiveTab('overview');
      } else {
        setErrorMsg('Failed to analyze the resume. Please check the backend log.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during resume screening.');
    } finally {
      setIsLoading(false);
    }
  };

  // Colors based on match score
  const getScoreColor = (score: number) => {
    if (score >= 90) return { stroke: '#10b981', text: 'text-emerald-600 dark:text-emerald-450', bg: 'bg-emerald-50 dark:bg-emerald-950/20' };
    if (score >= 80) return { stroke: '#3b82f6', text: 'text-blue-600 dark:text-blue-450', bg: 'bg-blue-50 dark:bg-blue-950/20' };
    if (score >= 70) return { stroke: '#f59e0b', text: 'text-amber-600 dark:text-amber-450', bg: 'bg-amber-50 dark:bg-amber-950/20' };
    return { stroke: '#ef4444', text: 'text-rose-600 dark:text-rose-450', bg: 'bg-rose-50 dark:bg-rose-950/20' };
  };

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case 'Strong Hire':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-450 dark:border-emerald-900/60">
            <ShieldCheck className={tw.iconMd} />
            Strong Hire
          </span>
        );
      case 'Hire':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-450 dark:border-blue-900/60">
            <CheckCircle2 className={tw.iconMd} />
            Hire
          </span>
        );
      case 'Maybe':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-450 dark:border-amber-900/60">
            <AlertTriangle className={tw.iconMd} />
            Maybe
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-450 dark:border-rose-900/60">
            <AlertTriangle className={tw.iconMd} />
            Reject
          </span>
        );
    }
  };

  const activeJobs = jobs.filter(j => j.status === 'Active');

  const filteredHistory = screenedCandidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(historySearch.toLowerCase()) || 
                          c.position.toLowerCase().includes(historySearch.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* 1. Header Row */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5.5 h-5.5 text-blue-500" />
          <span>AI Resume Screening System</span>
        </h2>
        <p className="text-xs text-slate-400 font-semibold mt-1">
          Upload candidate resumes in PDF/DOCX format to instantly evaluate match scores, extract skills, and highlight capability gaps.
        </p>
      </div>

      {/* 2. Main Dashboard Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Upload & History Registers */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Upload Resume Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-5">
            <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-blue-500" />
              <span>Screen Candidate CV</span>
            </h3>

            <form onSubmit={handleScreenResume} className="space-y-4">
              
              {/* Job Dropdown Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider pl-0.5">
                  Select Job Description
                </label>
                <select
                  value={selectedJobTitle}
                  onChange={(e) => setSelectedJobTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 dark:bg-slate-950 dark:text-slate-350 text-xs font-semibold"
                >
                  {activeJobs.map(j => (
                    <option key={j.id} value={j.title}>
                      {j.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleTriggerUpload}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] group ${
                  isDragOver 
                    ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/10' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:bg-slate-50/40 dark:hover:bg-slate-950/20'
                }`}
              >
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                />
                
                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl inline-flex">
                      <FileText className="w-8 h-8" />
                    </div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 max-w-[200px] truncate mx-auto">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/60 text-slate-450 dark:text-slate-550 rounded-xl inline-flex group-hover:scale-105 transition-transform duration-200">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Drag & Drop Resume
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                      Accepts PDF, DOCX or TXT files
                    </p>
                  </div>
                )}
              </div>

              {errorMsg && (
                <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                  <AlertCircleIcon className={tw.iconSm} />
                  {errorMsg}
                </p>
              )}

              {/* Submit trigger button */}
              <button
                type="submit"
                disabled={isLoading || !selectedFile || !selectedJobTitle}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    <span>Analyzing Guidelines...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-white/10" />
                    <span>Analyze Resume</span>
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Screening History Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Screening Log ({screenedCandidates.length})
              </h3>
            </div>

            {/* Search filter input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-[11px] border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50 dark:bg-slate-950 dark:text-slate-300"
              />
            </div>

            {/* List Log */}
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((cand) => {
                  const isActive = activeScreenedCandidate?.id === cand.id;
                  const scoreColors = getScoreColor(cand.aiMatchScore);
                  
                  return (
                    <button
                      key={cand.id}
                      onClick={() => setActiveScreenedCandidate(cand)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-all ${
                        isActive 
                          ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/10 shadow-sm' 
                          : 'border-slate-100 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-950/20'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{cand.name}</p>
                        <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">{cand.position}</p>
                      </div>
                      <span className={`text-xs font-extrabold px-2 py-0.5 rounded-lg border ${scoreColors.bg} ${scoreColors.text} border-slate-100/10`}>
                        {cand.aiMatchScore}%
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="py-8 text-center text-[11px] text-slate-450">
                  No screened records.
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Right Column: AI Analysis Dashboards */}
        <div className="lg:col-span-2 space-y-6">
          
          <AnimatePresence mode="wait">
            {activeScreenedCandidate ? (
              <motion.div
                key={activeScreenedCandidate.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col gap-6"
              >
                
                {/* Screening Header Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-b border-slate-100 dark:border-slate-850 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-extrabold text-white text-base shadow-sm border border-blue-400">
                      {activeScreenedCandidate.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-[15px] font-extrabold text-slate-800 dark:text-slate-100">
                        {activeScreenedCandidate.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-slate-400 mt-1">
                        <span className="flex items-center gap-1 truncate">
                          <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          {activeScreenedCandidate.email}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          {activeScreenedCandidate.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation badge */}
                  <div>
                    {getRecommendationBadge(activeScreenedCandidate.recommendation)}
                  </div>
                </div>

                {/* Score & Summary Callout Box */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-50/50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100/60 dark:border-slate-850">
                  
                  {/* Score SVG radial progress */}
                  <div className="md:col-span-1 flex flex-col items-center justify-center text-center">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        {/* Track circle */}
                        <circle 
                          cx="56" 
                          cy="56" 
                          r="46" 
                          className="stroke-slate-100 dark:stroke-slate-800" 
                          strokeWidth="8" 
                          fill="transparent" 
                        />
                        {/* Fill circle */}
                        <motion.circle 
                          cx="56" 
                          cy="56" 
                          r="46" 
                          stroke={getScoreColor(activeScreenedCandidate.aiMatchScore).stroke}
                          strokeWidth="8" 
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 46}
                          initial={{ strokeDashoffset: 2 * Math.PI * 46 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - activeScreenedCandidate.aiMatchScore / 100) }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-[20px] font-extrabold text-slate-800 dark:text-slate-150">
                          {activeScreenedCandidate.aiMatchScore}%
                        </span>
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">
                          Match Score
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Candidate Summary Block */}
                  <div className="md:col-span-2 space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-0.5 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                      <span>AI Candidate Profile Summary</span>
                    </h4>
                    <p className="text-xs font-semibold text-slate-650 dark:text-slate-300 leading-relaxed italic pr-2">
                      "{activeScreenedCandidate.summary || 'Candidate resume has been matched against core job requirements.'}"
                    </p>
                  </div>

                </div>

                {/* Dashboard Tabs switchers */}
                <div className="flex border-b border-slate-100 dark:border-slate-850 pb-px text-xs font-bold text-slate-400">
                  {(['overview', 'skills', 'details'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 border-b-2 transition-all relative ${
                        activeTab === tab 
                          ? 'border-blue-500 text-blue-600 dark:text-blue-450' 
                          : 'border-transparent hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {tab === 'overview' && 'Role Evaluation'}
                      {tab === 'skills' && 'Skill Gap Analysis'}
                      {tab === 'details' && 'Extracted CV Details'}
                    </button>
                  ))}
                </div>

                {/* Tab Views content blocks */}
                <div className="min-h-[220px]">
                  
                  {/* View A: Evaluation Summary */}
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      
                      {/* position context */}
                      <div className="p-4 bg-blue-50/40 dark:bg-blue-950/10 rounded-xl border border-blue-100/40 dark:border-blue-900/30 flex justify-between items-center text-xs font-bold">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-350">
                          <Briefcase className="w-4.5 h-4.5 text-blue-500" />
                          <span>Screened Position Profile:</span>
                        </div>
                        <span className="text-blue-600 dark:text-blue-450">{activeScreenedCandidate.position}</span>
                      </div>

                      {/* strengths list */}
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-0.5">
                          Strengths & Fits
                        </h4>
                        {activeScreenedCandidate.strengths && activeScreenedCandidate.strengths.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {activeScreenedCandidate.strengths.map((str, idx) => (
                              <div key={idx} className="p-3 bg-emerald-50/30 dark:bg-emerald-950/10 rounded-xl border border-emerald-100/40 dark:border-emerald-900/30 flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span className="text-[11px] font-bold text-slate-650 dark:text-slate-300 leading-relaxed">
                                  {str}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] font-semibold text-slate-450 pl-0.5">No explicit strengths listed.</p>
                        )}
                      </div>

                    </div>
                  )}

                  {/* View B: Skill Gap Analysis */}
                  {activeTab === 'skills' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Strengths */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider pl-0.5 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Skills Met / Match</span>
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {activeScreenedCandidate.skills && activeScreenedCandidate.skills.length > 0 ? (
                            activeScreenedCandidate.skills.map(s => (
                              <span key={s} className="text-[10.5px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-900/60 px-2.5 py-1 rounded-xl">
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-slate-450 font-semibold pl-0.5">None parsed</span>
                          )}
                        </div>
                      </div>

                      {/* Missing skills gap */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-wider pl-0.5 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
                          <span>Gaps / Missing Skills</span>
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {activeScreenedCandidate.missingSkills && activeScreenedCandidate.missingSkills.length > 0 ? (
                            activeScreenedCandidate.missingSkills.map(s => (
                              <span key={s} className="text-[10.5px] font-bold bg-amber-50 text-amber-600 border border-amber-250 dark:bg-amber-950/20 dark:text-amber-450 dark:border-amber-900/60 px-2.5 py-1 rounded-xl">
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10.5px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-xl">
                              All Job Skills Met
                            </span>
                          )}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* View C: Extracted CV Details */}
                  {activeTab === 'details' && (
                    <div className="space-y-5 text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-semibold">
                      
                      {/* Education */}
                      {activeScreenedCandidate.education && activeScreenedCandidate.education.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-0.5 flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-slate-400" />
                            <span>Education History</span>
                          </h4>
                          <ul className="space-y-1.5 pl-5 list-disc list-outside text-[11px] text-slate-650 dark:text-slate-300">
                            {activeScreenedCandidate.education.map((edu, idx) => (
                              <li key={idx}>{edu}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Work history */}
                      {activeScreenedCandidate.experience && activeScreenedCandidate.experience.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-0.5 flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-slate-400" />
                            <span>Work Experience Highlights</span>
                          </h4>
                          <ul className="space-y-1.5 pl-5 list-disc list-outside text-[11px] text-slate-650 dark:text-slate-300">
                            {activeScreenedCandidate.experience.map((exp, idx) => (
                              <li key={idx}>{exp}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Certifications */}
                      {activeScreenedCandidate.certifications && activeScreenedCandidate.certifications.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-0.5 flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-slate-400" />
                            <span>Certifications</span>
                          </h4>
                          <ul className="space-y-1.5 pl-5 list-disc list-outside text-[11px] text-slate-650 dark:text-slate-300">
                            {activeScreenedCandidate.certifications.map((cert, idx) => (
                              <li key={idx}>{cert}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                    </div>
                  )}

                </div>

              </motion.div>
            ) : (
              <div className="py-24 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-8 shadow-sm">
                <Sparkles className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3 animate-pulse" />
                <h4 className="text-sm font-bold text-slate-750 dark:text-slate-200">
                  Select a Candidate to View Analysis
                </h4>
                <p className="text-xs text-slate-450 dark:text-slate-400 mt-1 max-w-[280px]">
                  Analyze a new resume using the panel on the left or select an already screened candidate log row.
                </p>
              </div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
};

// Quick custom inline warning component to avoid Lucide resolution errors
const AlertCircleIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
