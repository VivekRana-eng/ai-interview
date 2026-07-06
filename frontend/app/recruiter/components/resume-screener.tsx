'use client';

import React, { useState, useEffect } from 'react';
import { useRecruiterStore } from '../store';
import { Candidate } from '../types';
import { Layers, Sparkles } from 'lucide-react';
import { CandidateList } from './candidate-list';
import { CandidateDetail } from './candidate-detail';
import { UploadModal, ScheduleModal, MeetingListModal } from './candidate-modals';
import { DossierModal } from './dossier-modal';
import { ResumeModal } from './resume-modal';

type MeetingItem = {
  key: string;
  candidateId: string;
  candidateName: string;
  position: string;
  date: string;
  comment: string;
  status: string;
  source: 'timeline' | 'interviewDate';
  entryIndex: number | null;
};

export const ResumeScreener: React.FC = () => {
  const { 
    jobs, 
    candidates, 
    screenResume,
    filterJob,
    setFilterJob,
    updateCandidate,
    selectedCandidateId,
    candidateViewMode,
    setSelectedCandidateId,
    setCandidateViewMode
  } = useRecruiterStore();

  const activeCandidate = candidates.find(c => c.id === selectedCandidateId) || null;
  const viewMode = candidateViewMode;
  const setActiveCandidate = (cand: Candidate | null) => {
    setSelectedCandidateId(cand ? cand.id : null);
  };
  const setViewMode = (mode: 'list' | 'detail') => {
    setCandidateViewMode(mode);
  };

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stageFilter, setStageFilter] = useState<string>('All Stages');

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [isMeetingsModalOpen, setIsMeetingsModalOpen] = useState<boolean>(false);
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

  const [meetingToEdit, setMeetingToEdit] = useState<MeetingItem | null>(null);

  const handleScheduleConfirm = async (date: string, time: string, interviewer: string) => {
    if (!activeCandidate) return;
    const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timelineComment = `Scheduled with ${interviewer}.`;
    const nextDateString = `${formattedDate} at ${time}`;

    if (meetingToEdit) {
      const candidate = candidates.find(c => c.id === meetingToEdit.candidateId) || activeCandidate;
      const updatedTimeline = (candidate.hiringTimeline || []).map((entry, idx) => {
        if (meetingToEdit.source === 'timeline' && meetingToEdit.entryIndex === idx) {
          return { ...entry, date: nextDateString, comment: timelineComment, status: 'upcoming' as const };
        }
        return entry;
      });

      await updateCandidate(meetingToEdit.candidateId, {
        hiringTimeline: updatedTimeline,
        interviewDate: formattedDate,
        status: 'Interviewing'
      });

      if (activeCandidate?.id === meetingToEdit.candidateId) {
        setActiveCandidate({
          ...activeCandidate,
          interviewDate: formattedDate,
          status: 'Interviewing',
          hiringTimeline: updatedTimeline
        });
      }

      setMeetingToEdit(null);
      setIsScheduleModalOpen(false);
      return;
    }

    const candidate = activeCandidate;
    if (!candidate) return;

    const nextTimeline = [
      ...(candidate.hiringTimeline || []),
      { stage: 'AI Interview Scheduled', date: nextDateString, status: 'upcoming' as const, comment: timelineComment }
    ];

    const updatedFields: Partial<Candidate> = {
      status: 'Interviewing',
      interviewDate: formattedDate,
      hiringTimeline: nextTimeline
    };

    await updateCandidate(candidate.id, updatedFields);

    setActiveCandidate({
      ...candidate,
      ...updatedFields
    });
  };

  const triggerDownload = () => {
    if (!activeCandidate) return;
    setDownloadSuccess(`Downloading resume for ${activeCandidate.name}...`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const scheduledMeetings = (() => {
    const meetingsMap = new Map<string, MeetingItem>();

    const addMeeting = (meeting: MeetingItem) => {
      if (!meetingsMap.has(meeting.key)) {
        meetingsMap.set(meeting.key, meeting);
      }
    };

    candidates.forEach((candidate) => {
      (candidate.hiringTimeline || []).forEach((entry, idx) => {
        if (entry.stage === 'AI Interview Scheduled' || entry.stage.toLowerCase().includes('interview')) {
          addMeeting({
            key: `${candidate.id}-${idx}-${entry.date}`,
            candidateId: candidate.id,
            candidateName: candidate.name,
            position: candidate.position,
            date: entry.date,
            comment: entry.comment || 'Interview scheduled',
            status: entry.status,
            source: 'timeline',
            entryIndex: idx
          });
        }
      });

      if ((!candidate.hiringTimeline || candidate.hiringTimeline.length === 0) && candidate.status === 'Interviewing' && candidate.interviewDate) {
        addMeeting({
          key: `${candidate.id}-interviewDate-${candidate.interviewDate}`,
          candidateId: candidate.id,
          candidateName: candidate.name,
          position: candidate.position,
          date: candidate.interviewDate,
          comment: 'Interview scheduled',
          status: 'upcoming',
          source: 'interviewDate',
          entryIndex: null
        });
      }
    });

    return Array.from(meetingsMap.values());
  })();

  return (
    <div className={viewMode === 'detail' ? 'space-y-4' : 'space-y-6'}>
      {/* Main Area */}
      {viewMode === 'list' ? (
        <div className="space-y-6">
          {/* Top Search & Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
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
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsMeetingsModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Meeting
              </button>
            </div>
          </div>

          <CandidateList 
            candidates={filteredCandidates} 
            onSelectCandidate={(cand) => {
              setActiveCandidate(cand);
              setViewMode('detail');
            }} 
            onConnectCandidate={async (candId) => {
              const target = candidates.find(c => c.id === candId);
              if (!target) return;
              const nextStatus = target.connectedStatus === 'CONNECTED' ? 'CONNECT' : 'CONNECTED';
              await updateCandidate(candId, { connectedStatus: nextStatus });
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
        onClose={() => {
          setIsScheduleModalOpen(false);
          setMeetingToEdit(null);
        }}
        candidate={activeCandidate}
        meeting={meetingToEdit}
        onSchedule={handleScheduleConfirm}
      />

      <MeetingListModal
        isOpen={isMeetingsModalOpen}
        onClose={() => setIsMeetingsModalOpen(false)}
        meetings={scheduledMeetings}
        onEditMeeting={(meeting) => {
          setMeetingToEdit(meeting);
          setIsMeetingsModalOpen(false);
          setIsScheduleModalOpen(true);
        }}
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
