'use client';

import React, { useState } from 'react';
import { Candidate } from '../types';
import { Briefcase, Activity, Download, Calendar, ArrowLeft } from 'lucide-react';
import { getDefaultExperiences } from './candidate-detail-data';
import { InterviewPerformanceTab } from './interview-performance-tab';

interface CandidateDetailProps {
  candidate: Candidate;
  onBackToList: () => void;
  onDownloadResume: () => void;
  onScheduleInterview: () => void;
}

export const CandidateDetail: React.FC<CandidateDetailProps> = ({
  candidate,
  onBackToList,
  onDownloadResume,
  onScheduleInterview
}) => {
  const [activeProfileTab, setActiveProfileTab] = useState<'experience' | 'interview'>('experience');
  const [showStrugglesOnly, setShowStrugglesOnly] = useState(false);
  const initials = candidate.name.split(' ').map(n => n[0]).join('');

  // Hydrate experiences (at least 4) if empty
  const experiences = candidate.workExperienceDetails && candidate.workExperienceDetails.length > 0 
    ? candidate.workExperienceDetails 
    : getDefaultExperiences(candidate);

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      {/* Back to list navigation / Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-bold">
        <button onClick={onBackToList} className="flex items-center gap-1 text-slate-500 hover:text-blue-650 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Candidates List</span>
        </button>
        <span className="text-slate-350">/</span>
        <span className="text-slate-805">{candidate.name}</span>
      </div>

      {/* Main Light Profile Card (Matching Job Details Layout) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-[0_4px_16px_rgba(15,23,42,0.04)] space-y-6">
        
        {/* Row 1: Squircle Initials & Name & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-lg flex-shrink-0 shadow-md">
              {initials}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>CANDIDATE PROFILE</span>
                <span>&bull;</span>
                <span className="text-blue-600 font-extrabold">{candidate.name}</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 leading-none">{candidate.name}</h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-1">
                Applied on {candidate.interviewDate} &bull; AI Match: {candidate.aiMatchScore}% &bull; Integrity: {candidate.integrityScore}%
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto mt-2 md:mt-0">

            <button onClick={onDownloadResume} className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 active:scale-95 bg-white">
              <Download className="w-3.5 h-3.5" />
              <span>Download Resume</span>
            </button>
            <button onClick={onScheduleInterview} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95">
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Interview</span>
            </button>
          </div>
        </div>

        {/* Row 2: Grid of Key-Value columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-slate-700">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">EMAIL</span>
            <p className="text-xs font-bold text-slate-900 mt-1 truncate">{candidate.email}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">PHONE</span>
            <p className="text-xs font-bold text-slate-900 mt-1">{candidate.phone || '+91 98765 43210'}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">APPLIED ROLE</span>
            <p className="text-xs font-bold text-slate-900 mt-1">{candidate.position}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">RECOMMENDATION</span>
            <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider mt-1.5 ${
              candidate.recommendation === 'Strong Hire' || candidate.recommendation === 'Hire'
                ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                : candidate.recommendation === 'Maybe'
                ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                : 'bg-rose-50 text-rose-700 border border-rose-200/60'
            }`}>
              {candidate.recommendation}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">INTEGRITY STATUS</span>
            <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider mt-1.5 ${
              candidate.previousTrackRecord === 'clean' || !candidate.previousTrackRecord
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                : candidate.previousTrackRecord === 'switched_tab'
                ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                : 'bg-rose-50 text-rose-700 border border-rose-200/60'
            }`}>
              Integrity: {candidate.integrityScore}%
            </span>
          </div>
        </div>

        {/* Row 3: Grid of Pills (Skills & Gaps) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-5 text-slate-700">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">CORE SKILLS</span>
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {(candidate.skills || ['Go', 'Python', 'FastAPI', 'PostgreSQL', 'gRPC']).map(s => (
                <span key={s} className="text-[10px] font-bold bg-slate-50 text-slate-650 border border-slate-200 px-2.5 py-1 rounded-xl">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">IDENTIFIED GAPS</span>
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {(candidate.missingSkills && candidate.missingSkills.length > 0 ? candidate.missingSkills : ['React', 'CSS']).map(s => (
                <span key={s} className="text-[10px] font-bold bg-rose-50 text-rose-750 border border-rose-250/60 px-2.5 py-1 rounded-xl">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Tabs & Tab Content Container (Question Bank layout style) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          <div className="flex px-4 py-1.5 gap-1.5">
            {[
              { id: 'experience', label: 'Work Experience', icon: Briefcase },
              { id: 'interview', label: 'Interview Performance', icon: Activity }
            ].map(tab => {
              const isSelected = activeProfileTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveProfileTab(tab.id as any)}
                  className={`px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
                    isSelected 
                      ? 'border-blue-650 text-blue-650 bg-blue-50/20' 
                      : 'border-transparent text-slate-450 hover:text-slate-705 hover:bg-slate-100/30'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 bg-white text-slate-800">
          
          {/* TAB: WORK EXPERIENCE */}
          {activeProfileTab === 'experience' && (
            <div className="space-y-6">
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Employment History</h4>
              <div className="relative border-l border-slate-150 pl-6 space-y-6 ml-2">
                {experiences.map((exp, i) => (
                  <div key={i} className="relative group">
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white" />
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <h5 className="text-xs font-extrabold text-slate-800">{exp.role}</h5>
                        <span className="text-[10px] font-bold text-slate-500 px-2 py-0.5 bg-slate-50 border border-slate-150 rounded">{exp.duration}</span>
                      </div>
                      <p className="text-[11px] font-bold text-blue-600">{exp.company}</p>
                      <ul className="list-disc list-outside pl-4 pt-1 space-y-1 text-[11px] text-slate-650 leading-relaxed font-semibold">
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

          {/* TAB: INTERVIEW PERFORMANCE */}
          {activeProfileTab === 'interview' && (
            <InterviewPerformanceTab candidate={candidate} />
          )}
        </div>
      </div>
    </div>
  );
};
