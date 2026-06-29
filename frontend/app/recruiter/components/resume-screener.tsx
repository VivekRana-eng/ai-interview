'use client';

<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
>>>>>>> bb746e542aaac3e0415d7c75af25e0590166cfcb
import { useRecruiterStore } from '../store';
import { Candidate } from '../types';
import { Layers, Upload, Sparkles } from 'lucide-react';
import { CandidateList } from './candidate-list';
import { CandidateDetail } from './candidate-detail';
import { UploadModal, ScheduleModal } from './candidate-modals';
import { DossierModal } from './dossier-modal';
import { ResumeModal } from './resume-modal';

export const ResumeScreener: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const { 
    jobs, 
    candidates, 
    screenResume 
  } = useRecruiterStore();

  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [jobFilter, setJobFilter] = useState<string>('All Jobs');
  const [stageFilter, setStageFilter] = useState<string>('All Stages');

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState<boolean>(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Set the first candidate as active by default if none is selected
  useEffect(() => {
    if (candidates.length > 0 && !activeCandidate) {
      setActiveCandidate(candidates[0]);
    }
  }, [candidates, activeCandidate]);

<<<<<<< HEAD
=======
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
        // Hydrate default ATS details for newly uploaded candidates
        const hydratedCandidate: Candidate = {
          ...candidate,
          phone: candidate.phone || '+91 99888 77665',
          linkedinUrl: 'https://linkedin.com/in/' + candidate.name.toLowerCase().replace(' ', '-'),
          githubUrl: 'https://github.com/github-' + candidate.name.toLowerCase().replace(' ', '-'),
          currentCompany: 'Freelance / Open Source',
          resumeText: `RESUME OF ${candidate.name.toUpperCase()}\nPosition: ${candidate.position}\n\nEmail: ${candidate.email}\nSkills: ${candidate.skills?.join(', ') || ''}\n\nStrengths:\n${candidate.strengths?.map(s => `- ${s}`).join('\n') || ''}\n\nSummary:\n${candidate.summary || ''}`,
          workExperienceDetails: [
            {
              role: candidate.position,
              company: 'Independent Contractor',
              duration: '2023 - Present',
              description: candidate.strengths || ['Contributed to high-quality codebases.', 'Collaborated with clients on application design.']
            }
          ],
          educationDetails: [
            {
              degree: 'Bachelor of Technology in Computer Science',
              school: 'Technology Institute',
              year: '2019 - 2023',
              grade: '8.5 CGPA'
            }
          ],
          projects: [
            {
              title: 'Portfolio Application',
              description: 'Personal projects showcasing modern stack integrations.',
              techStack: candidate.skills || ['React', 'Node.js']
            }
          ],
          internships: [
            {
              role: 'Software Development Intern',
              company: 'Tech Corp',
              duration: '3 Months (2022)',
              description: ['Assisted in building frontend components and writing integration tests.']
            }
          ],
          trainingsAndCertifications: [
            {
              name: 'AI & Data Science Specialization',
              issuer: 'Coursera',
              date: 'Dec 2024'
            }
          ],
          hiringTimeline: [
            { stage: 'Applied', date: 'Just now', status: 'completed', comment: 'Resume screened via ATS.' },
            { stage: 'Resume Screening', date: 'Just now', status: 'completed', comment: `AI Match Score: ${candidate.aiMatchScore}%` },
            { stage: 'AI Interview', date: 'Pending', status: 'current', comment: 'Waiting to schedule interview.' }
          ]
        };
        setActiveCandidate(hydratedCandidate);
        setSelectedFile(null);
        setIsUploadModalOpen(false);
        setActiveProfileTab('experience');
      } else {
        setErrorMsg('Failed to analyze the resume. Please check the backend log.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during resume screening.');
    } finally {
      setIsLoading(false);
    }
  };

  // Score match color palette builder
  const getScoreColor = (score: number) => {
    if (score >= 90) return { stroke: '#10b981', text: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100 bg-emerald-950/20 border-emerald-900/60' };
    if (score >= 80) return { stroke: '#3b82f6', text: 'text-blue-600', bg: 'bg-blue-50 border-blue-100 bg-blue-950/20 border-blue-900/60' };
    if (score >= 70) return { stroke: '#f59e0b', text: 'text-amber-600', bg: 'bg-amber-50 border-amber-100 bg-amber-950/20 border-amber-900/60' };
    return { stroke: '#ef4444', text: 'text-rose-600', bg: 'bg-rose-50 border-rose-100 bg-rose-950/20 border-rose-900/60' };
  };

>>>>>>> bb746e542aaac3e0415d7c75af25e0590166cfcb
  // Filter candidates list
  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch = 
      cand.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cand.position.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (cand.skills && cand.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesJob = 
      jobFilter === 'All Jobs' || 
      cand.position.toLowerCase().includes(jobFilter.toLowerCase());

    const matchesStage = 
      stageFilter === 'All Stages' || 
      cand.status === stageFilter;

    return matchesSearch && matchesJob && matchesStage;
  });

  const handleScreenResumeSubmit = async (file: File, jobTitle: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const candidate = await screenResume(file, jobTitle);
      if (candidate) {
        // Hydrate default ATS details
        const hydrated: Candidate = {
          ...candidate,
          phone: candidate.phone || '+91 98765 43210',
          resumeText: `RESUME OF ${candidate.name.toUpperCase()}\nPosition: ${candidate.position}\n\nEmail: ${candidate.email}\nSkills: ${candidate.skills?.join(', ') || ''}`,
          workExperienceDetails: [
            { role: candidate.position, company: 'Freelance / Open Source', duration: '2023 - Present', description: ['Contributed to key codebases.'] }
          ],
          interviewDate: 'Jun 28, 2026',
          postedTime: 'Today',
          postedDate: 'Jun 28, 2026'
        };
        setActiveCandidate(hydrated);
        setIsUploadModalOpen(false);
        setViewMode('detail');
      } else {
        setErrorMsg('Failed to analyze the resume.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during resume screening.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleConfirm = (date: string, time: string, interviewer: string) => {
    if (!activeCandidate) return;
    const updated: Candidate = {
      ...activeCandidate,
      status: 'Interviewing',
      interviewDate: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      hiringTimeline: [
        ...(activeCandidate.hiringTimeline || []),
        { stage: 'AI Interview Scheduled', date: `${date} at ${time}`, status: 'completed', comment: `Scheduled with ${interviewer}.` }
      ]
    };
    setActiveCandidate(updated);
  };

  const triggerDownload = () => {
    if (!activeCandidate) return;
    setDownloadSuccess(`Downloading resume for ${activeCandidate.name}...`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Dashboard Header */}
<<<<<<< HEAD
      <div className="flex justify-end gap-4">
=======
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="w-5.5 h-5.5 text-blue-500" />
            <span>ATS Candidate Profile Dashboard</span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Enterprise candidate tracking, pipeline routing, AI interview transcripts, and resume evaluations.
          </p>
        </div>
>>>>>>> bb746e542aaac3e0415d7c75af25e0590166cfcb
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 hover:shadow-lg active:scale-95"
        >
          <Upload className="w-4 h-4" />
          <span>Upload & Screen CV</span>
        </button>
      </div>

<<<<<<< HEAD
      {/* Main Area */}
      {viewMode === 'list' ? (
        <div className="space-y-6">
          {/* Top Search & Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
            <input 
              type="text" 
              placeholder="Search by name, role or skill..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <select 
              value={jobFilter} 
              onChange={(e) => setJobFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All Jobs">All Jobs</option>
              {Array.from(new Set(candidates.map(c => c.position))).map(j => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
            <select 
              value={stageFilter} 
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All Stages">All Stages</option>
              <option value="Applied">Applied</option>
              <option value="Screening">Screening</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Hired">Hired</option>
            </select>
          </div>

          <CandidateList 
            candidates={filteredCandidates} 
            onSelectCandidate={(cand) => {
              setActiveCandidate(cand);
              setViewMode('detail');
            }} 
          />
        </div>
      ) : (
        activeCandidate && (
          <CandidateDetail
            candidate={activeCandidate}
            onBackToList={() => setViewMode('list')}
            onDownloadResume={() => setIsResumeModalOpen(true)}
            onScheduleInterview={() => setIsScheduleModalOpen(true)}
          />
        )
      )}

      {/* Notification Toast */}
      {downloadSuccess && (
        <div className="fixed bottom-4 right-4 bg-emerald-50 text-emerald-600 border border-emerald-100 p-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg animate-fadeIn z-50">
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Modals */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        jobs={jobs}
        onSubmit={handleScreenResumeSubmit}
        isLoading={isLoading}
        error={errorMsg}
      />

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        candidate={activeCandidate}
        onSchedule={handleScheduleConfirm}
      />

      <DossierModal
        isOpen={isDossierModalOpen}
        onClose={() => setIsDossierModalOpen(false)}
        candidate={activeCandidate}
      />
=======
      {/* 2. Main ATS Layout Workspace */}
      <div className="w-full space-y-6">
          <AnimatePresence mode="wait">
            {activeCandidate ? (
              <motion.div
                key={activeCandidate.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                
                {/* A. ATS Candidate Profile Header Card - Inspired by the Patient Profile layout */}
                <div className={`${tw.recruiterPanelCard} border-l-4 ${
                  activeCandidate.recommendation === 'Strong Hire' ? 'border-l-emerald-500' :
                  activeCandidate.recommendation === 'Maybe' ? 'border-l-amber-500' :
                  activeCandidate.recommendation === 'Hire' ? 'border-l-blue-500' :
                  'border-l-rose-500'
                } p-6 lg:p-8 space-y-6`}>

                {/* Row 1: Profile Initials Squircle & Name Info & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 border-slate-800 pb-5">
                <div className="flex items-center gap-4">
                {/* Squircle Initials block */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-serif font-bold text-white text-lg flex-shrink-0 shadow-md">
                {activeCandidate.name.split(' ').map(n => n[0]).join('')}
                </div>

                <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                <span>CANDIDATE PROFILE</span>
                <span>•</span>
                <select
                value={activeCandidate.id}
                onChange={(e) => {
                const found = candidates.find(c => c.id === e.target.value);
                if (found) {
                setActiveCandidate(found);
                if (!found.interviewPerformance && activeProfileTab === 'interview') {
                setActiveProfileTab('experience');
                }
                }
                }}
                className="bg-transparent text-[10px] font-extrabold text-[#2563EB] hover:text-[#1d4ed8] text-blue-400 focus:outline-none cursor-pointer hover:underline normal-case tracking-normal"
                >
                {candidates.map(c => (
                <option key={c.id} value={c.id} className="bg-white bg-slate-900 text-slate-800 text-slate-200 font-bold">
                {c.name}
                </option>
                ))}
                </select>
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900 text-white leading-none">
                {activeCandidate.name}
                </h3>
                <p className="text-[11px] text-slate-600 font-semibold mt-1">
                Applied on {activeCandidate.interviewDate} • AI Match: {activeCandidate.aiMatchScore}% • Integrity: {activeCandidate.integrityScore}%
                </p>
                </div>
                </div>

                {/* Action buttons aligned in top-right */}
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto mt-2 md:mt-0">
                <button
                onClick={() => {
                setActiveDossierTab('background');
                setSelectedDossierBgIdx(0);
                setSelectedDossierQaIdx(0);
                setIsDossierModalOpen(true);
                }}
                className="px-3.5 py-2 border border-blue-600 border-blue-500 hover:bg-blue-50/50 rounded-xl text-blue-600 text-blue-400 text-xs font-bold transition-all hover:border-blue-400 active:scale-95"
                >
                Detailed Profile
                </button>
                <button
                onClick={() => triggerDownload(activeCandidate.name)}
                className="px-3.5 py-2 border border-slate-200 rounded-xl text-slate-700 text-xs font-bold transition-all hover:border-slate-300 flex items-center gap-1.5 active:scale-95"
                >
                <Download className="w-3.5 h-3.5" />
                <span>Download Resume</span>
                </button>
                <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Interview</span>
                </button>
                </div>
                </div>

                {/* Row 2: Grid of Key-Value columns */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">EMAIL</span>
                <p className="text-xs font-semibold text-slate-800 text-slate-200 mt-1 truncate">{activeCandidate.email}</p>
                </div>
                <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">PHONE</span>
                <p className="text-xs font-semibold text-slate-800 text-slate-200 mt-1">{activeCandidate.phone || '+91 98765 43210'}</p>
                </div>
                <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">APPLIED ROLE</span>
                <p className="text-xs font-semibold text-slate-800 text-slate-200 mt-1">{activeCandidate.position}</p>
                </div>
                <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">RECOMMENDATION</span>
                <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider mt-1.5 ${
                activeCandidate.recommendation === 'Strong Hire' ? 'bg-emerald-100 text-emerald-700 bg-emerald-950/40 text-emerald-450' :
                activeCandidate.recommendation === 'Hire' ? 'bg-blue-100 text-blue-700 bg-blue-950/40 text-blue-450' :
                activeCandidate.recommendation === 'Maybe' ? 'bg-amber-100 text-amber-700 bg-amber-950/40 text-amber-450' :
                'bg-rose-100 text-rose-700 bg-rose-950/40 text-rose-450'
                }`}>
                {activeCandidate.recommendation}
                </span>
                </div>
                </div>

                {/* Row 3: Grid of Pills (Skills & Gaps) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 border-slate-800 pt-5">

                {/* Column A: Core Skills (Greenish-grey pill style, similar to current medications) */}
                <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">CORE SKILLS</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                {activeCandidate.skills && activeCandidate.skills.slice(0, 5).map(s => (
                <span key={s} className="text-[10.5px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-xl">
                {s}
                </span>
                ))}
                {activeCandidate.skills && activeCandidate.skills.length > 5 && (
                <span className="text-[10px] font-bold text-blue-600 px-2 py-1">+{activeCandidate.skills.length - 5} more</span>
                )}
                </div>
                </div>

                {/* Column B: Identified Gaps (Allergies pink pill style) */}
                <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">IDENTIFIED GAPS</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                {activeCandidate.missingSkills && activeCandidate.missingSkills.length > 0 ? (
                activeCandidate.missingSkills.map(s => (
                <span key={s} className="text-[10.5px] font-bold bg-[#FEF2F2] text-[#991B1B] border border-[#FEE2E2] px-2.5 py-1 rounded-xl">
                {s}
                </span>
                ))
                ) : (
                <span className="text-[10.5px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-xl">
                None (Fully Qualified)
                </span>
                )}
                </div>
                </div>

                </div>

                {/* Toast status updates */}
                {downloadSuccess && (
                  <div className="bg-emerald-50 bg-emerald-950/20 text-emerald-600 border border-emerald-100 border-emerald-900/60 p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{downloadSuccess}</span>
                  </div>
                )}

                </div>

                {/* B. Dashboard Tab system switches (9 Tabs scrollable in mobile) */}
                <div className={`${tw.recruiterPanelCard} overflow-hidden`}>
                  
{/* Tab Navigation header */}
                  <div className="flex border-b border-slate-100 border-slate-850 overflow-x-auto scrollbar-none scroll-smooth">
                    <div className="flex px-4 py-1.5 gap-1.5 flex-nowrap text-xs font-bold text-slate-450">
                      {[
                        { id: 'experience', label: 'Work Experience', icon: Briefcase },
                        { id: 'interview', label: 'Interview Performance', icon: Activity, hidden: !activeCandidate.interviewPerformance },
                        { id: 'timeline', label: 'Hiring Timeline', icon: Clock }
                      ].map(tab => {
                        if (tab.hidden) return null;
                        const isSelected = activeProfileTab === tab.id;
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveProfileTab(tab.id as any)}
                            className={`px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
                              isSelected 
                                ? 'border-blue-500 text-blue-600 text-blue-400 bg-blue-50/20 bg-blue-950/10' 
                                : 'border-transparent hover:text-slate-700 hover:text-slate-350 hover:bg-slate-50/50 hover:bg-slate-950/20'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tab Workspace content */}
                  <div className="p-6 min-h-[300px]">

                    {/* TAB: WORK EXPERIENCE & INTERNSHIPS TIMELINE */}
                    {activeProfileTab === 'experience' && (
                      <div className="space-y-8">
                        {/* Employment History */}
                        <div className="space-y-6">
                          <div className="pb-2 border-b border-slate-100 border-slate-800">
                            <h4 className="text-xs font-extrabold text-slate-900 text-slate-200 uppercase tracking-wider">Employment History</h4>
                          </div>
                          {activeCandidate.workExperienceDetails && activeCandidate.workExperienceDetails.length > 0 ? (
                            <div className="relative border-l border-slate-200 border-slate-800 pl-6 space-y-8 ml-2">
                              {activeCandidate.workExperienceDetails.map((exp, i) => (
                                <div key={i} className="relative group">
                                  <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white border-slate-900 group-hover:scale-125 transition-all" />
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-start">
                                      <h5 className="text-xs font-extrabold text-slate-800 text-slate-200">{exp.role}</h5>
                                      <span className="text-[10px] font-bold text-slate-455 px-2 py-0.5 bg-slate-50 bg-slate-850 rounded-lg">{exp.duration}</span>
                                    </div>
                                    <p className="text-[11px] font-bold text-blue-600 text-blue-400">{exp.company}</p>
                                    <ul className="list-disc list-outside pl-4 pt-1 space-y-1 text-[11px] text-slate-500 text-slate-355 leading-relaxed font-semibold">
                                      {exp.description.map((bullet, idx) => (
                                        <li key={idx}>{bullet}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-3 pl-2">
                              {activeCandidate.experience?.map((exp, i) => (
                                <div key={i} className="p-3 bg-slate-50 bg-slate-950 border border-slate-100 rounded-xl text-xs font-semibold text-slate-655 text-slate-300">
                                  {exp}
                                </div>
                              )) || <p className="text-xs text-slate-400">No work experience documented.</p>}
                            </div>
                          )}
                        </div>

                        {/* Internships & Periods */}
                        {activeCandidate.internships && activeCandidate.internships.length > 0 && (
                          <div className="space-y-6 pt-2">
                            <div className="pb-2 border-b border-slate-100 border-slate-800">
                              <h4 className="text-xs font-extrabold text-slate-700 text-slate-355 uppercase tracking-wider">Internships & Periods</h4>
                            </div>
                            <div className="relative border-l border-slate-200 border-slate-800 pl-6 space-y-8 ml-2">
                              {activeCandidate.internships.map((exp, i) => (
                                <div key={i} className="relative group">
                                  <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-violet-500 border-2 border-white border-slate-900 group-hover:scale-125 transition-all" />
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-start">
                                      <h5 className="text-xs font-extrabold text-slate-800 text-slate-200">{exp.role}</h5>
                                      <span className="text-[10px] font-bold text-slate-455 px-2 py-0.5 bg-slate-50 bg-slate-850 rounded-lg">{exp.duration}</span>
                                    </div>
                                    <p className="text-[11px] font-bold text-violet-600 text-violet-400">{exp.company}</p>
                                    <ul className="list-disc list-outside pl-4 pt-1 space-y-1 text-[11px] text-slate-500 text-slate-350 leading-relaxed font-semibold">
                                      {exp.description.map((bullet, idx) => (
                                        <li key={idx}>{bullet}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                                      {/* TAB 7: INTERVIEW PERFORMANCE */}
                    {activeProfileTab === 'interview' && (
                      <div className="space-y-6">
                        {activeCandidate.interviewPerformance ? (
                          <>
                            {/* Score dashboard */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {[
                                { label: 'Overall Rating', val: activeCandidate.interviewPerformance.overallScore, max: 10, color: 'text-blue-600' },
                                { label: 'Technical depth', val: activeCandidate.interviewPerformance.technicalScore, max: 10, color: 'text-emerald-600' },
                                { label: 'Communication', val: activeCandidate.interviewPerformance.communicationScore, max: 10, color: 'text-indigo-600' },
                                { label: 'Problem Solving', val: activeCandidate.interviewPerformance.problemSolvingScore, max: 10, color: 'text-violet-600' }
                              ].map((score, i) => (
                                <div key={i} className="p-4 bg-slate-50/50 bg-slate-950/40 border border-slate-100 border-slate-850 rounded-xl text-center space-y-1">
                                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{score.label}</p>
                                  <p className={`text-xl font-extrabold ${score.color}`}>{score.val} <span className="text-slate-400 text-xs font-medium">/ {score.max}</span></p>
                                </div>
                              ))}
                            </div>

                            {/* Strengths / Weaknesses */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="p-4 bg-emerald-50/20 bg-emerald-950/5 border border-emerald-100/50 border-emerald-900/30 rounded-xl space-y-3">
                                <h5 className="text-[11px] font-extrabold text-emerald-700 text-emerald-450 uppercase tracking-wider flex items-center gap-1.5">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                  <span>Interview Strengths</span>
                                </h5>
                                <ul className="list-disc list-outside pl-4 space-y-1.5 text-[11px] font-semibold text-slate-650 text-slate-350 leading-relaxed">
                                  {activeCandidate.interviewPerformance.strengths.map((str, i) => <li key={i}>{str}</li>)}
                                </ul>
                              </div>

                              <div className="p-4 bg-amber-50/20 bg-amber-950/5 border border-amber-100/50 border-amber-900/30 rounded-xl space-y-3">
                                <h5 className="text-[11px] font-extrabold text-amber-700 text-amber-450 uppercase tracking-wider flex items-center gap-1.5">
                                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                                  <span>Identified Gaps</span>
                                </h5>
                                <ul className="list-disc list-outside pl-4 space-y-1.5 text-[11px] font-semibold text-slate-650 text-slate-350 leading-relaxed">
                                  {activeCandidate.interviewPerformance.weaknesses.map((str, i) => <li key={i}>{str}</li>)}
                                </ul>
                              </div>
                            </div>

                            {/* Perform well / Got stuck callout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-1.5 pl-1">
                                <h5 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Excelled at</h5>
                                <p className="text-xs font-semibold text-slate-700 text-slate-300 leading-relaxed bg-slate-50 bg-slate-950 p-3 rounded-xl border border-slate-100 border-slate-850">
                                  {activeCandidate.interviewPerformance.performedWell.join(' and ')}
                                </p>
                              </div>
                              <div className="space-y-1.5 pl-1">
                                <h5 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Struggled with</h5>
                                <p className="text-xs font-semibold text-slate-700 text-slate-300 leading-relaxed bg-slate-50 bg-slate-950 p-3 rounded-xl border border-slate-100 border-slate-850">
                                  {activeCandidate.interviewPerformance.gotStuck.join(' and ')}
                                </p>
                              </div>
                            </div>

                            {/* Q&A List */}
                            <div className="space-y-4 pt-2">
                              <h5 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1">Interview QA Transcript</h5>
                              <div className="space-y-3">
                                {activeCandidate.interviewPerformance.qaList.map((qa, i) => (
                                  <div key={i} className="border border-slate-200 border-slate-800 rounded-[24px] overflow-hidden shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                                    <div className="bg-slate-50 bg-slate-950/60 p-4 border-b border-slate-100 border-slate-850 flex justify-between items-start gap-4">
                                      <div className="flex items-start gap-3">
                                        <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                        <p className="text-xs font-bold text-slate-800 text-slate-250 leading-relaxed">
                                          {qa.question}
                                        </p>
                                      </div>
                                      <span className="text-[10px] font-extrabold bg-blue-50 bg-blue-950 text-blue-600 text-blue-450 border border-blue-100 border-blue-900 px-2 py-0.5 rounded-lg flex-shrink-0">
                                        Score: {qa.score}/10
                                      </span>
                                    </div>
                                    <div className="p-4 bg-white bg-slate-900 space-y-3 text-xs leading-relaxed font-semibold">
                                      <div className="space-y-1">
                                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Candidate Answer</p>
                                        <p className="text-slate-650 text-slate-300 italic pl-1">
                                          "{qa.answer}"
                                        </p>
                                      </div>
                                      <div className="p-3 bg-blue-50/20 bg-blue-950/5 border border-blue-100/30 border-blue-900/20 rounded-xl space-y-1">
                                        <p className="text-[9px] font-extrabold text-blue-600 text-blue-400 uppercase tracking-wider flex items-center gap-1">
                                          <Sparkles className="w-3 h-3 fill-blue-50/10" />
                                          <span>AI Assessment</span>
                                        </p>
                                        <p className="text-slate-650 text-slate-350">
                                          {qa.aiEvaluation}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="py-12 text-center text-xs text-slate-450 font-semibold space-y-3">
                            <Clock className="w-10 h-10 text-slate-300 mx-auto" />
                            <p>No interview transcript available for this candidate.</p>
                            <button 
                              onClick={() => setIsScheduleModalOpen(true)}
                              className="px-4 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 rounded-lg text-xs font-bold transition-all"
                            >
                              Schedule Technical AI Interview
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 9: TIMELINE */}
                    {activeProfileTab === 'timeline' && (
                      <div className="space-y-6">
                        <div className="pb-2 border-b border-slate-100 border-slate-800">
                          <h4 className="text-xs font-extrabold text-slate-700 text-slate-350 uppercase tracking-wider">Hiring Process Journey</h4>
                        </div>
                        <div className="relative border-l-2 border-slate-100 border-slate-800 pl-6 space-y-8 ml-3">
                          {activeCandidate.hiringTimeline ? (
                            activeCandidate.hiringTimeline.map((step, idx) => (
                              <div key={idx} className="relative group text-xs font-semibold">
                                <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center border-2 bg-white bg-slate-900 ${
                                  step.status === 'completed' ? 'border-emerald-500 text-emerald-500' :
                                  step.status === 'current' ? 'border-blue-500 text-blue-500 animate-pulse' :
                                  'border-slate-200 text-slate-300'
                                }`}>
                                  <Check className="w-2.5 h-2.5" />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center">
                                    <span className={`font-extrabold ${step.status === 'current' ? 'text-blue-600 text-blue-400' : 'text-slate-800 text-slate-200'}`}>
                                      {step.stage}
                                    </span>
                                    <span className="text-[10px] text-slate-400">{step.date}</span>
                                  </div>
                                  {step.comment && (
                                    <p className="text-[11px] text-slate-450 leading-relaxed mt-0.5">{step.comment}</p>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            // Fallback Timeline if undefined
                            [
                              { stage: 'Applied', date: activeCandidate.interviewDate, status: 'completed', comment: 'Resume entered online portal.' },
                              { stage: 'AI Resume Screened', date: activeCandidate.interviewDate, status: 'completed', comment: `Analyzed with match score of ${activeCandidate.aiMatchScore}%` },
                              { stage: 'Interview Stage', date: 'Pending', status: activeCandidate.status === 'Interviewing' ? 'current' : 'upcoming', comment: activeCandidate.status === 'Interviewing' ? 'Scheduled AI Interview.' : 'Waiting for setup.' }
                            ].map((step, idx) => (
                              <div key={idx} className="relative group text-xs font-semibold">
                                <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center border-2 bg-white bg-slate-900 ${
                                  step.status === 'completed' ? 'border-emerald-500 text-emerald-500' :
                                  step.status === 'current' ? 'border-blue-500 text-blue-500' :
                                  'border-slate-200 text-slate-300'
                                }`}>
                                  <Check className="w-2.5 h-2.5" />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center">
                                    <span className="font-extrabold text-slate-800 text-slate-200">{step.stage}</span>
                                    <span className="text-[10px] text-slate-400">{step.date}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-450 leading-relaxed mt-0.5">{step.comment}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                  </div>

                </div>

              </motion.div>
            ) : (
              <div className={`${tw.recruiterPanelCard} flex flex-col items-center justify-center text-center p-8`}>
                <Sparkles className="w-12 h-12 text-slate-300 text-slate-700 mb-3 animate-pulse" />
                <h4 className="text-sm font-bold text-slate-900 text-slate-200">
                  Select a Candidate to View Profile Dashboard
                </h4>
                <p className="text-xs text-slate-500 text-slate-400 mt-1 max-w-[280px]">
                Choose a candidate from the dropdown selector above or upload a new candidate resume.
                </p>
                </div>
                )}
                </AnimatePresence>
                </div>

      {/* 3. MODAL: UPLOAD RESUME DRAWER/DIALOG */}
      <AnimatePresence>
        {mounted && isUploadModalOpen && createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setIsUploadModalOpen(false)}
            />

            {/* Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className={`${tw.recruiterPanelCard} relative w-full max-w-md overflow-hidden p-6 z-10`} 
            >
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 border-slate-850">
                <h4 className="text-xs font-extrabold text-slate-700 text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-blue-500" />
                  <span>Screen Candidate CV</span>
                </h4>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-650 hover:bg-slate-50 hover:bg-slate-950 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleScreenResume} className="space-y-4 pt-4">
                
                {/* Job Dropdown Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-455 text-slate-500 uppercase tracking-wider pl-0.5">
                    Select Target Job Profile
                  </label>
                  <select
                    value={selectedJobTitle}
                    onChange={(e) => setSelectedJobTitle(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 border-slate-880 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 bg-slate-950 text-slate-350 text-xs font-semibold cursor-pointer"
                  >
                    {jobs.filter(j => j.status === 'Active').map(j => (
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
                      ? 'border-blue-500 bg-blue-50/30' 
                      : 'border-slate-200 border-slate-800 hover:border-blue-400 hover:bg-slate-50/40 hover:bg-slate-950/20'
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
                      <div className="p-3 bg-blue-50 bg-blue-950/40 text-blue-600 text-blue-400 rounded-xl inline-flex">
                        <FileText className="w-8 h-8" />
                      </div>
                      <p className="text-xs font-bold text-slate-700 text-slate-300 max-w-[200px] truncate mx-auto">
                        {selectedFile.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-3 bg-slate-50 bg-slate-950/60 text-slate-450 text-slate-550 rounded-xl inline-flex group-hover:scale-105 transition-transform duration-200">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-slate-700 text-slate-300">
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
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errorMsg}</span>
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
                      <span>Screening & Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-white/10" />
                      <span>Analyze Resume</span>
                    </>
                  )}
                </button>

              </form>

            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>

      {/* 4. MODAL: SCHEDULE INTERVIEW */}
      <AnimatePresence>
        {mounted && isScheduleModalOpen && createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setIsScheduleModalOpen(false)}
            />

            {/* Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className={`${tw.recruiterPanelCard} relative w-full max-w-md overflow-hidden p-6 z-10`} 
            >

              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>Schedule AI Technical Interview</span>
                </h4>
                <button
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {scheduleSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-100">
                    <Check className="w-6 h-6" />
                  </div>
                  <h5 className="text-xs font-extrabold text-slate-850">Interview Scheduled!</h5>
                  <p className="text-[11px] text-slate-450 leading-relaxed font-semibold px-4">{scheduleSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleScheduleInterviewSubmit} className="space-y-4 pt-4">

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase">Candidate</p>
                    <p className="text-xs font-bold text-slate-750 mt-0.5">{activeCandidate?.name}</p>
                    <p className="text-[10px] text-slate-500 font-semibold">{activeCandidate?.position}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold text-slate-455 uppercase tracking-wider pl-0.5">Date</label>
                      <input 
                        type="date" 
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold text-slate-455 uppercase tracking-wider pl-0.5">Time</label>
                      <input 
                        type="time" 
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold text-slate-455 uppercase tracking-wider pl-0.5">Assigned Lead / Interviewer</label>
                    <select
                      value={schedulerInterviewer}
                      onChange={(e) => setSchedulerInterviewer(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Akash Patel (AI Lead)">Akash Patel (AI Lead)</option>
                      <option value="Priya Sharma (Engineering Director)">Priya Sharma (Engineering Director)</option>
                      <option value="Nisha Lal (Security Architect)">Nisha Lal (Security Architect)</option>
                      <option value="Tanya Gupta (HR Specialist)">Tanya Gupta (HR Specialist)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg active:scale-95"
                  >
                    <ClipboardCheck className="w-4 h-4" />
                    <span>Confirm Interview Schedule</span>
                  </button>

                </form>
              )}

            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>

        {/* 5. MODAL: DETAILED PROFILE DOSSIER (Inspired by "Under The Layers" reference) */}
        <AnimatePresence>
        {mounted && isDossierModalOpen && activeCandidate && createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setIsDossierModalOpen(false)}
            />
  
            {/* Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 20 }}
              className={`${tw.recruiterPanelCard} relative w-full max-w-5xl h-[85vh] overflow-hidden z-10 flex flex-col`} 
            >
  
              {/* Header Segment */}
              <div className="p-6 md:p-8 bg-white border-b border-slate-200 flex justify-between items-start flex-shrink-0">
                <div className="space-y-2">
                  <span className="font-serif text-blue-600 text-sm tracking-wider font-semibold block uppercase">
                    Under The Layers
                  </span>
                  <h2 className="font-serif text-3xl font-bold text-slate-900 leading-none">
                    {activeCandidate.name}
                  </h2>
                </div>
                <button
                  onClick={() => setIsDossierModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
  
              {/* Sub-Tabs selector (Under The Layers style) */}
              <div className="px-6 md:px-8 bg-white flex gap-6 border-b border-slate-200 flex-shrink-0">
                {[
                  { id: 'background', label: 'Background & Experience' },
                  { id: 'questions', label: 'Questions Asked' }
                ].map(t => {
                  const isActive = activeDossierTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setActiveDossierTab(t.id as any);
                        setSelectedDossierBgIdx(0);
                        setSelectedDossierQaIdx(0);
                      }}
                      className={`py-4 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all ${
                        isActive 
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-slate-400 hover:text-slate-650'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
  
              {/* Split Content Area */}
              <div className="flex-1 flex overflow-hidden p-6 md:p-8 gap-6 min-h-0">
  
                {/* Left Panel: Vertical list of items */}
                <div className="w-1/3 flex flex-col gap-3 overflow-y-auto pr-2 flex-shrink-0 border-r border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    {activeDossierTab === 'background' ? 'All Milestones' : 'Interview Q&A'}
                  </span>
  
                  {activeDossierTab === 'background' ? (
                    (() => {
                      // Construct milestones
                      const milestones: any[] = [];
                      if (activeCandidate.workExperienceDetails) {
                        activeCandidate.workExperienceDetails.forEach((w, i) => {
                          milestones.push({
                            type: 'work',
                            title: w.company,
                            subtitle: w.role,
                            meta: w.duration
                          });
                        });
                      }
                      if (activeCandidate.internships) {
                        activeCandidate.internships.forEach((w, i) => {
                          milestones.push({
                            type: 'internship',
                            title: `${w.company} (Internship)`,
                            subtitle: w.role,
                            meta: w.duration
                          });
                        });
                      }
                      if (activeCandidate.trainingsAndCertifications) {
                        activeCandidate.trainingsAndCertifications.forEach((w, i) => {
                          milestones.push({
                            type: 'training',
                            title: w.name,
                            subtitle: w.issuer,
                            meta: w.date
                          });
                        });
                      }
  
                      return milestones.map((m, idx) => {
                        const isSelected = selectedDossierBgIdx === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedDossierBgIdx(idx)}
                            className={`w-full p-4 text-left border rounded-2xl transition-all ${
                              isSelected 
                                ? 'border-l-4 border-l-blue-600 border-blue-250 bg-blue-50/30 shadow-sm' 
                                : 'border-slate-200 hover:bg-slate-50 bg-white text-slate-500'
                            }`}
                          >
                            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{m.meta}</span>
                            <h4 className="text-xs font-extrabold text-slate-800 mt-1 truncate">{m.title}</h4>
                            <p className="text-[10px] text-slate-450 truncate font-semibold mt-0.5">{m.subtitle}</p>
                          </button>
                        );
                      });
                    })()
                  ) : (
                    activeCandidate.interviewPerformance?.qaList.map((qa, idx) => {
                      const isSelected = selectedDossierQaIdx === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedDossierQaIdx(idx)}
                          className={`w-full p-4 text-left border rounded-2xl transition-all ${
                            isSelected 
                              ? 'border-l-4 border-l-blue-600 border-blue-250 bg-blue-50/30 shadow-sm' 
                              : 'border-slate-200 hover:bg-slate-50 bg-white text-slate-500'
                          }`}
                        >
                          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Question {idx + 1}</span>
                          <h4 className="text-xs font-extrabold text-slate-800 mt-1 line-clamp-2">{qa.question}</h4>
                          <span className="inline-block text-[9px] font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-lg mt-1">Score: {qa.score}/10</span>
                        </button>
                      );
                    }) || (
                      <p className="text-xs text-slate-400 p-2">No questions documented.</p>
                    )
                  )}
                </div>
  
                {/* Right Panel: Detail View */}
                <div className={`flex-1 overflow-y-auto ${tw.recruiterPanelCard} p-6 md:p-8 flex flex-col gap-6`}>
  
                  {activeDossierTab === 'background' ? (
                    (() => {
                      // Retrieve the selected milestone details
                      const milestones: any[] = [];
                      if (activeCandidate.workExperienceDetails) {
                        activeCandidate.workExperienceDetails.forEach((w, i) => {
                          milestones.push({
                            type: 'Work Experience',
                            title: w.company,
                            subtitle: w.role,
                            meta: w.duration,
                            bullets: w.description,
                            techStack: activeCandidate.skills?.slice(0, 3) || []
                          });
                        });
                      }
                      if (activeCandidate.internships) {
                        activeCandidate.internships.forEach((w, i) => {
                          milestones.push({
                            type: 'Internship',
                            title: w.company,
                            subtitle: w.role,
                            meta: w.duration,
                            bullets: w.description,
                            techStack: activeCandidate.skills?.slice(3, 5) || []
                          });
                        });
                      }
                      if (activeCandidate.trainingsAndCertifications) {
                        activeCandidate.trainingsAndCertifications.forEach((w, i) => {
                          milestones.push({
                            type: 'Training & Certification',
                            title: w.name,
                            subtitle: w.issuer,
                            meta: w.date,
                            bullets: w.credentialId ? [`Credential ID: ${w.credentialId}`] : ['Completed certified course training requirements.'],
                            techStack: activeCandidate.skills?.slice(2, 4) || []
                          });
                        });
                      }
  
                      const activeItem = milestones[selectedDossierBgIdx] || milestones[0];
                      if (!activeItem) return <p className="text-xs text-slate-400">No background details available.</p>;
  
                      return (
                        <>
                          <div className="border-b border-slate-100 pb-3">
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">
                              {activeItem.type} DETAIL
                            </span>
                            <h3 className="font-serif text-xl font-bold text-slate-900 mt-1">
                              {activeItem.title}
                            </h3>
                            <p className="text-xs font-semibold text-slate-400 mt-0.5">{activeItem.meta}</p>
                          </div>
  
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">ROLE FOCUS</span>
                            <p className="text-xs font-semibold text-slate-800">{activeItem.subtitle}</p>
                          </div>
  
                          <div className="space-y-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">RELATED TECHNOLOGIES</span>
                            <div className="flex flex-wrap gap-1.5">
                              {activeItem.techStack.map((s: string) => (
                                <span key={s} className="text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-xl">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">ACHIEVEMENTS & DESCRIPTION</span>
                            <div className="space-y-2">
                              {activeItem.bullets.map((b: string, idx: number) => (
                                <div key={idx} className="p-3 bg-[#FAFBFD] border border-slate-200 rounded-xl">
                                  <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                                    {b}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      );
                    })()
                  ) : (
                    (() => {
                      const activeItem = activeCandidate.interviewPerformance?.qaList[selectedDossierQaIdx] || activeCandidate.interviewPerformance?.qaList[0];
                      if (!activeItem) return <p className="text-xs text-slate-455">No interview Q&A details available.</p>;
  
                      return (
                        <>
                          <div className="border-b border-slate-100 pb-3">
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">
                              QUESTION DETAIL
                            </span>
                            <h3 className="font-serif text-lg font-bold text-slate-900 mt-1 leading-relaxed">
                              {activeItem.question}
                            </h3>
                            <span className="inline-block text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-xl mt-2">Score: {activeItem.score}/10</span>
                          </div>
  
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">DIAGNOSIS & TOPIC FOCUS</span>
                            <p className="text-xs font-semibold text-slate-850">
                              Technical evaluation regarding core system capabilities and solution engineering.
                            </p>
                          </div>
  
                          <div className="space-y-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">CANDIDATE ANSWER</span>
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                              <p className="text-xs text-slate-650 italic leading-relaxed font-semibold">
                                "{activeItem.answer}"
                              </p>
                            </div>
                          </div>
  
                          <div className="space-y-3">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">AI ASSESSMENT</span>
                            <div className="p-4 bg-blue-50/20 border border-blue-100/30 rounded-xl">
                              <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                                {activeItem.aiEvaluation}
                              </p>
                            </div>
                          </div>
                        </>
                      );
                    })()
                  )}
  
                </div>
  
              </div>
  
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>
  
      {/* 6. MODAL: DETAILED RESUME VIEWER */}
      <AnimatePresence>
        {mounted && isResumeModalOpen && activeCandidate && createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setIsResumeModalOpen(false)}
            />
  
            {/* Modal Sheet */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 20 }}
              className={`${tw.recruiterPanelCard} relative w-full max-w-4xl h-[80vh] overflow-hidden z-10 flex flex-col`} 
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
                <div>
                  <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest block">CANDIDATE CV DOCUMENT</span>
                  <h3 className="font-serif text-lg font-bold text-slate-900 mt-0.5">
                    {activeCandidate.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => triggerDownload(activeCandidate.name)}
                    className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-650 transition-all hover:border-slate-300"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsResumeModalOpen(false)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
  
              {/* Scrollable CV content */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50/50">
                <div className={`${tw.recruiterPanelCard} max-w-3xl mx-auto font-mono text-[11px] text-slate-700 leading-relaxed whitespace-pre-wrap select-text`}>
                  {activeCandidate.resumeText || `RESUME DATA\n\nNo detailed CV text parsed for this mock profile.\nSkills identified: ${activeCandidate.skills?.join(', ')}`}
                </div>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>
>>>>>>> bb746e542aaac3e0415d7c75af25e0590166cfcb

      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        candidate={activeCandidate}
      />

    </div>
  );
};

