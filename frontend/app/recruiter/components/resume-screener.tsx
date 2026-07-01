'use client';

import React, { useState, useEffect } from 'react';
import { useRecruiterStore } from '../store';
import { Candidate } from '../types';
import { Layers, Sparkles } from 'lucide-react';
import { CandidateList } from './candidate-list';
import { CandidateDetail } from './candidate-detail';
import { UploadModal, ScheduleModal } from './candidate-modals';
import { DossierModal } from './dossier-modal';
import { ResumeModal } from './resume-modal';

export const ResumeScreener: React.FC = () => {
  const { 
    jobs, 
    candidates, 
    screenResume,
    filterJob,
    setFilterJob
  } = useRecruiterStore();

  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
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

  // Filter candidates list
  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch = 
      cand.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cand.position.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (cand.skills && cand.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesJob = 
      filterJob === 'All' || filterJob === 'All Jobs' || 
      cand.position.toLowerCase().includes(filterJob.toLowerCase());

    const matchesStage = 
      stageFilter === 'All' || stageFilter === 'All Stages' || 
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
    <div className={viewMode === 'detail' ? 'space-y-4' : 'space-y-6'}>
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
              value={filterJob} 
              onChange={(e) => setFilterJob(e.target.value)}
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

      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        candidate={activeCandidate}
      />

    </div>
  );
};
