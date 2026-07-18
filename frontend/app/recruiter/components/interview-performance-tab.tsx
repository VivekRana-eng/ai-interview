'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Candidate } from '../types';
import { useRecruiterStore } from '../store';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Download, 
  Check, 
  Award, 
  Clock, 
  Calendar, 
  User, 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  Shield, 
  HelpCircle,
  AlertOctagon,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';
import { 
  getDetailedEvaluationReport, 
  DimensionScore, 
  IntegrityEvent, 
  TranscriptTurn 
} from './candidate-detail-data';


interface InterviewPerformanceTabProps {
  candidate: Candidate;
}

export const InterviewPerformanceTab: React.FC<InterviewPerformanceTabProps> = ({
  candidate
}) => {
  const { updateCandidate } = useRecruiterStore();
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'integrity' | 'transcript' | 'recording'>('overview');
  const [decisionSubmitted, setDecisionSubmitted] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Panel States
  const [panelRecommend, setPanelRecommend] = useState<'Strong Hire' | 'Hire' | 'Maybe' | 'Reject'>(candidate.recommendation || 'Hire');
  const [panelStage, setPanelStage] = useState<'Applied' | 'Screening' | 'Interviewing' | 'Shortlisted' | 'Hired'>(candidate.status);
  const [panelAgrees, setPanelAgrees] = useState<boolean>(true);
  const [panelScoreOverride, setPanelScoreOverride] = useState<string>(String(candidate.aiMatchScore || ''));
  const [panelNotes, setPanelNotes] = useState<string>(candidate.summary || '');
  const [panelSubmitting, setPanelSubmitting] = useState<boolean>(false);

  // Video Player States
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(900); // 15 mins default
  const [activeEventIndex, setActiveEventIndex] = useState<number | null>(null);

  const parseTimestampToSeconds = (ts: string): number => {
    const parts = ts.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return 0;
  };

  const formatSeconds = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        try {
          videoRef.current.pause();
        } catch (e) {}
      } else {
        videoRef.current.play().catch(err => console.log('Playback error:', err));
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        if (videoRef.current && !videoRef.current.paused && videoRef.current.currentTime > 0) {
          setCurrentTime(videoRef.current.currentTime);
        } else {
          setCurrentTime(prev => {
            const next = prev + 0.25;
            if (next >= videoDuration) {
              setIsPlaying(false);
              return 0;
            }
            return next;
          });
        }
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isPlaying, videoDuration]);

  useEffect(() => {
    setPanelRecommend(candidate.recommendation || 'Hire');
    setPanelStage(candidate.status);
    setPanelScoreOverride(String(candidate.aiMatchScore || ''));
    setPanelNotes(candidate.summary || '');
  }, [candidate]);

  const report = getDetailedEvaluationReport(candidate);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const getVerdictStyles = (recommendation: string) => {
    switch (recommendation) {
      case 'Strong Hire':
        return {
          bg: 'bg-gradient-to-r from-blue-600 to-indigo-600',
          text: 'text-white',
          border: 'border-blue-700',
          badgeBg: 'bg-blue-500/20 text-blue-200'
        };
      case 'Hire':
        return {
          bg: 'bg-gradient-to-r from-emerald-600 to-teal-600',
          text: 'text-white',
          border: 'border-emerald-700',
          badgeBg: 'bg-emerald-500/20 text-emerald-250'
        };
      case 'Maybe':
        return {
          bg: 'bg-gradient-to-r from-blue-600 to-blue-750',
          text: 'text-white',
          border: 'border-blue-700',
          badgeBg: 'bg-blue-500/20 text-blue-200'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-rose-600 to-red-600',
          text: 'text-white',
          border: 'border-rose-700',
          badgeBg: 'bg-rose-500/20 text-rose-250'
        };
    }
  };

  const verdictStyle = getVerdictStyles(candidate.recommendation);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const element = document.getElementById('candidate-performance-content');
      if (element) {
        const html2pdf = (await import('html2pdf.js')).default;
        const opt: any = {
          margin:       0.3,
          filename:     `${candidate.name.replace(/\s+/g, '_')}_Performance_Report.pdf`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true, logging: false },
          jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        await html2pdf().set(opt).from(element).save();
      } else {
        window.print();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handleSubmitDecision = () => {
    if (typeof window !== 'undefined') {
      const el = document.getElementById('decision-panel');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handlePanelSubmit = async () => {
    setPanelSubmitting(true);
    try {
      const score = panelScoreOverride ? Number(panelScoreOverride) : candidate.aiMatchScore;
      await updateCandidate(candidate.id, {
        status: panelStage,
        recommendation: panelRecommend,
        aiMatchScore: score,
        summary: panelNotes
      });
      alert(`Decision submitted! Successfully updated ${candidate.name} to ${panelStage} (${panelRecommend}).`);
    } catch (err) {
      console.error(err);
      alert('Failed to submit decision.');
    } finally {
      setPanelSubmitting(false);
    }
  };



  return (
    <div id="candidate-performance-content" className="space-y-6">
      
      {/* 1. REPORT HEADER */}
      <div className="bg-white dark:bg-[#111a2e] border border-slate-200/80 dark:border-slate-800/85 rounded-3xl p-5 lg:p-6 shadow-[0_4px_16px_rgba(15,23,42,0.03)] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Candidate Info with Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-extrabold text-white text-lg flex-shrink-0 shadow-lg">
              {candidate.avatarUrl ? (
                <img 
                  src={candidate.avatarUrl} 
                  alt={candidate.name} 
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                candidate.name.split(' ').map(n => n[0]).join('')
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl lg:text-2xl font-extrabold text-slate-900 dark:text-white leading-none">{candidate.name}</h3>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 border border-blue-200/40 uppercase tracking-wider">
                  {report.percentile}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-450 font-bold">
                {report.seniority} &bull; {candidate.position}
              </p>
            </div>
          </div>

          {/* Interview Details & Global Percentile */}
          <div className="flex items-center gap-3 lg:gap-5 flex-wrap">
            <div className="text-slate-550 dark:text-slate-400 text-xs font-semibold space-y-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Date: {candidate.interviewDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Duration: {report.duration}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5">
              <button 
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="px-4 py-2 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 active:scale-95 bg-white dark:bg-slate-900 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloading ? 'Exporting...' : 'Download PDF'}</span>
              </button>
              <button 
                onClick={handleSubmitDecision}
                disabled={decisionSubmitted}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{decisionSubmitted ? 'Submitting...' : 'Submit Decision'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Verdict Recommendation Banner */}
        <div className={`p-3.5 rounded-2xl border ${verdictStyle.bg} ${verdictStyle.text} flex items-center justify-between gap-4 shadow-sm`}>
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 opacity-90" />
            <div>
              <span className="text-[10px] font-extrabold tracking-widest uppercase block opacity-80">VERDICT & RECOMMENDATION</span>
              <p className="text-xs lg:text-sm font-extrabold">{candidate.recommendation === 'Strong Hire' ? 'Strong Hire - Exceptional Technical and Cultural Fit' : candidate.recommendation === 'Hire' ? 'Hire - Highly Recommended for Progression' : candidate.recommendation === 'Maybe' ? 'Maybe - Borderline fit, requires administrative review' : 'Reject - Profile does not match current standards'}</p>
            </div>
          </div>
          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${verdictStyle.badgeBg}`}>
            {candidate.recommendation}
          </span>
        </div>
      </div>

      {/* 2. TAB NAVIGATION & DECISION PANEL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Left Column: Report Contents */}
        <div className="bg-white dark:bg-[#111a2e] border border-slate-200/80 dark:border-slate-800/85 rounded-3xl overflow-hidden shadow-[0_4px_16px_rgba(15,23,42,0.03)] flex flex-col">
        <div className="flex border-b border-slate-100 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="flex px-4 py-1.5 gap-1 lg:gap-2 overflow-x-auto hide-scrollbar w-full">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'integrity', label: 'Integrity Report' },
              { id: 'transcript', label: 'QA Transcript' },
              { id: 'recording', label: 'Recording' }
            ].map(tab => {
              const isSelected = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
                    isSelected 
                      ? 'border-blue-650 text-blue-650 bg-blue-50/20 dark:text-blue-400 dark:border-blue-400' 
                      : 'border-transparent text-slate-450 hover:text-slate-705 dark:text-slate-400 hover:bg-slate-100/30 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. TAB CONTENT */}
        <div className="p-5 lg:p-6">
          
          {/* TAB: OVERVIEW */}
          <div className={`${activeSubTab === 'overview' ? 'block' : 'hidden print:block'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-6 lg:gap-8">
              
              {/* Composite Score Circle & Summary */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 shadow-sm">
                  {/* Color ring score display */}
                  <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-95" viewBox="0 0 100 100">
                      <circle 
                        className="text-slate-100 dark:text-slate-800" 
                        strokeWidth="8" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="38" 
                        cx="50" 
                        cy="50" 
                      />
                      <circle 
                        className="transition-all duration-1000 ease-out" 
                        strokeWidth="8" 
                        strokeDasharray={2 * Math.PI * 38}
                        strokeDashoffset={2 * Math.PI * 38 * (1 - (candidate.aiMatchScore || 85) / 100)}
                        strokeLinecap="round" 
                        stroke={getScoreColor(candidate.aiMatchScore || 85)} 
                        fill="transparent" 
                        r="38" 
                        cx="50" 
                        cy="50" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-800 dark:text-white">
                      <span className="text-3xl font-extrabold tracking-tight">{(candidate.aiMatchScore / 10).toFixed(1)}</span>
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mt-0.5">SCORE</span>
                    </div>
                  </div>

                  <div className="space-y-2 flex-1">
                    <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-455">Composite AI Rating</h5>
                    <p className="text-xs text-slate-655 leading-relaxed font-semibold">
                      This score represents a weighted aggregation across 12 specific performance indicators, including coding depth, structural design, integrity compliance, and articulation pace.
                    </p>
                  </div>
                </div>

                {/* AI Summary Statement */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">AI Narrative Summary</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold bg-blue-50/15 p-4 rounded-2xl border border-blue-200/25">
                    {report.summary}
                  </p>
                </div>

                {/* Capsule Flags */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Evaluation Signal Flags</h4>
                  <div className="flex flex-wrap gap-2">
                    {report.signalFlags.map((flag, idx) => (
                      <span 
                        key={idx}
                        className={`text-[10px] font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 border ${
                          flag.toLowerCase().includes('hesitat') || flag.toLowerCase().includes('weak')
                            ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-250/50'
                            : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-250/50'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          flag.toLowerCase().includes('hesitat') || flag.toLowerCase().includes('weak')
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`} />
                        <span>{flag}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Strengths & Concerns Column */}
              <div className="space-y-5 flex flex-col justify-between">
                {/* Top Strengths */}
                <div className="p-5 bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100/70 dark:border-emerald-900/30 rounded-2xl space-y-3 flex-1 flex flex-col justify-start">
                  <h4 className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-555" />
                    <span>Top 3 Evaluated Strengths</span>
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-semibold list-none pl-1">
                    {report.strengths.map((str, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-emerald-555 dark:text-emerald-400 font-bold shrink-0">{idx + 1}.</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Top Concerns */}
                <div className="p-5 bg-rose-50/20 dark:bg-rose-950/10 border border-rose-100/70 dark:border-rose-900/30 rounded-2xl space-y-3 flex-1 flex flex-col justify-start mt-5">
                  <h4 className="text-xs font-extrabold text-rose-700 dark:text-rose-450 uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-555" />
                    <span>Top 2 Evaluated Concerns</span>
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-semibold list-none pl-1">
                    {report.concerns.map((con, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-rose-555 dark:text-rose-400 font-bold shrink-0">{idx + 1}.</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>


          {/* TAB: INTEGRITY REPORT */}
          <div className={`${activeSubTab === 'integrity' ? 'block' : 'hidden print:block'} print-page-break print:mt-10`}>
            <div className="space-y-6">
              
              {/* Gauge & Deductions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1.8fr] gap-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/60">
                {/* Score Gauge */}
                <div className="flex flex-col items-center justify-center text-center p-3 border-b md:border-b-0 md:border-r border-slate-200/65 dark:border-slate-800/70 pb-5 md:pb-3 md:pr-6">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-3">INTEGRITY RATING</span>
                  
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle 
                        className="text-slate-200 dark:text-slate-800" 
                        strokeWidth="7" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="38" 
                        cx="50" 
                        cy="50" 
                      />
                      <circle 
                        className="transition-all duration-1000 ease-out" 
                        strokeWidth="7" 
                        strokeDasharray={2 * Math.PI * 38}
                        strokeDashoffset={2 * Math.PI * 38 * (1 - report.integrityScore / 100)}
                        strokeLinecap="round" 
                        stroke={report.integrityScore >= 90 ? '#10b981' : report.integrityScore >= 70 ? '#f59e0b' : '#ef4444'} 
                        fill="transparent" 
                        r="38" 
                        cx="50" 
                        cy="50" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-800 dark:text-white">
                      <span className="text-3xl font-extrabold tracking-tight">{report.integrityScore}%</span>
                      <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-400 mt-1">100 = CLEAN</span>
                    </div>
                  </div>

                  <span className={`inline-block mt-4 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border ${
                    report.verdict === 'Clean'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/40 dark:bg-emerald-950/20 dark:text-emerald-400'
                      : report.verdict === 'Flagged'
                      ? 'bg-amber-50 text-amber-700 border-amber-200/40 dark:bg-amber-950/20 dark:text-amber-400'
                      : 'bg-rose-50 text-rose-700 border-rose-200/40 dark:bg-rose-950/20 dark:text-rose-455'
                  }`}>
                    VERDICT: {report.verdict}
                  </span>
                </div>

                {/* Deductions Breakdown */}
                <div className="flex flex-col justify-center space-y-4">
                  <div>
                    <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Deductions Breakdown</h5>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">{report.verdictDescription}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-150 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Tab Switches</span>
                      <span className="text-lg font-extrabold text-slate-800 dark:text-white mt-1.5">{report.integrityDeductionsBreakdown.tabSwitches}</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">Deduction: {report.integrityDeductionsBreakdown.tabSwitches * 5} pts</span>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-150 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Gaze Averting</span>
                      <span className="text-lg font-extrabold text-slate-800 dark:text-white mt-1.5">{report.integrityDeductionsBreakdown.gazeAverting}</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">Deduction: {report.integrityDeductionsBreakdown.gazeAverting * 3} pts</span>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-150 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Multiple Faces</span>
                      <span className="text-lg font-extrabold text-slate-800 dark:text-white mt-1.5">{report.integrityDeductionsBreakdown.multipleFaces}</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">Deduction: {report.integrityDeductionsBreakdown.multipleFaces * 15} pts</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50/15 border border-blue-200/20 text-xs font-bold flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <span>Total Compliance Deduction</span>
                    <span className="text-rose-600 dark:text-rose-455 font-extrabold">-{report.integrityDeductionsBreakdown.total} pts</span>
                  </div>
                </div>
              </div>

              {/* Event timeline list */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Integrity Event Timeline</h4>
                {report.integrityEvents.length > 0 ? (
                  <div className="relative border-l border-slate-200 dark:border-slate-800 pl-6 space-y-5 ml-2.5">
                    {report.integrityEvents.map((evt, idx) => {
                      const isHigh = evt.severity === 'high';
                      const isMed = evt.severity === 'medium';
                      return (
                        <div key={idx} className="relative group">
                          {/* Timeline dot */}
                          <div className={`absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
                            isHigh ? 'bg-red-500' : isMed ? 'bg-amber-500' : 'bg-blue-500'
                          }`} />
                          
                          <div className="p-3.5 bg-slate-50 dark:bg-slate-900/20 border border-slate-150 dark:border-slate-800/80 rounded-xl space-y-1.5">
                            <div className="flex justify-between items-center flex-wrap gap-2 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-800 dark:text-white">{evt.type}</span>
                                <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                  isHigh 
                                    ? 'bg-rose-50 text-rose-700 border-rose-250/60 dark:bg-rose-950/20 dark:text-rose-400' 
                                    : isMed 
                                    ? 'bg-amber-50 text-amber-700 border-amber-250/60 dark:bg-amber-950/20 dark:text-amber-400' 
                                    : 'bg-blue-50 text-blue-700 border-blue-250/60 dark:bg-blue-950/20 dark:text-blue-400'
                                }`}>
                                  {evt.severity}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-semibold">{evt.timestamp} &bull; Q{evt.questionNumber} context</span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-semibold">{evt.context}</p>
                            <div className="flex justify-between items-center text-[10px] font-bold text-rose-600 dark:text-rose-455 pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
                              <span>Score Deduction applied</span>
                              <span>-{evt.deduction} points</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/20 border border-slate-150 dark:border-slate-800/80 rounded-2xl text-xs font-bold text-slate-455 flex flex-col items-center justify-center gap-2.5">
                    <Shield className="w-8 h-8 text-emerald-500" />
                    <span>No violations detected. Candidate record is fully secure.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TAB: QA TRANSCRIPT */}
          <div className={`${activeSubTab === 'transcript' ? 'block' : 'hidden print:block'} print-page-break print:mt-10`}>
            <div className="space-y-5">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/60">
                <h4 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Evaluation turns & answers</h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Questions: {report.transcript.length}</span>
              </div>

              <div className="space-y-4">
                {report.transcript.map((turn, idx) => {
                  const isLow = turn.score < 7.5;
                  return (
                    <div 
                      key={idx} 
                      className={`p-4 bg-slate-50 dark:bg-slate-900/20 border rounded-2xl space-y-3.5 transition-all ${
                        isLow 
                          ? 'border-amber-250/70 shadow-sm bg-amber-50/5 dark:border-amber-900/40' 
                          : 'border-slate-150 dark:border-slate-800/85'
                      }`}
                    >
                      {/* Turn header */}
                      <div className="flex justify-between items-start gap-4 flex-wrap">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-xs font-extrabold text-blue-650 dark:text-blue-400">Q{turn.questionNumber}</span>
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-350">
                            {turn.type}
                          </span>
                          <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
                            turn.complexity === 'Hard' 
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400' 
                              : turn.complexity === 'Medium' 
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400' 
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                          }`}>
                            {turn.complexity}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Time: {turn.responseTime}</span>
                          </span>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider border ${
                            isLow ? 'bg-amber-50 text-amber-700 border-amber-250/50' : 'bg-blue-50 text-blue-700 border-blue-200/50'
                          }`}>
                            Score: {turn.score.toFixed(1)}/10
                          </span>
                        </div>
                      </div>

                      {/* Question Text */}
                      <p className="text-xs font-extrabold text-slate-800 dark:text-white leading-relaxed">
                        {turn.questionText}
                      </p>

                      {/* Timing Anomaly Alert banner if triggered */}
                      {turn.timingAnomaly && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2.5 text-[11px] font-bold text-red-650 dark:text-red-400 animate-pulse">
                          <AlertOctagon className="w-4 h-4 shrink-0" />
                          <span>TIMING ANOMALY: Candidate submitted an answer exceptionally fast (within {turn.responseTime}). Potential integrity risk.</span>
                        </div>
                      )}

                      {/* Candidate Answer */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Candidate Answer</span>
                        <p className="italic text-slate-655 dark:text-slate-350 font-semibold leading-relaxed pl-2 border-l border-slate-300 dark:border-slate-800">
                          "{turn.answerText}"
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TAB: RECORDING */}
          <div className={`${activeSubTab === 'recording' ? 'block' : 'hidden print:block'} space-y-6`}>
            {/* Twilio Video Embed container */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-900 shadow-lg group flex items-center justify-center">
              {/* Actual hidden HTML5 video element for timing track */}
              <video 
                ref={videoRef}
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                className="hidden"
                loop
                playsInline
                muted={isMuted}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setCurrentTime(videoRef.current.currentTime);
                  }
                }}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    setVideoDuration(videoRef.current.duration || 900);
                  }
                }}
              />

              {/* MOCK WEBCAM VISUALS */}
              <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-slate-950/95 overflow-hidden">
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px]" />

                {/* Candidate avatar container representing webcam feed */}
                <div className="relative flex flex-col items-center justify-center">
                  <div className={`relative w-36 h-36 rounded-full border-4 border-slate-800 flex items-center justify-center shadow-2xl transition-all duration-700 bg-slate-900/60 ${
                    isPlaying ? 'ring-8 ring-blue-500/20 scale-105 border-blue-500' : 'border-slate-800'
                  }`}>
                    {candidate.avatarUrl ? (
                      <img 
                        src={candidate.avatarUrl} 
                        alt={candidate.name} 
                        className={`w-full h-full rounded-full object-cover p-2.5 transition-all ${
                          isPlaying ? 'animate-pulse' : ''
                        }`}
                      />
                    ) : (
                      <span className="text-3xl font-extrabold text-slate-700">{candidate.name.split(' ').map(n => n[0]).join('')}</span>
                    )}

                    {/* Face detection target box overlay */}
                    {isPlaying && (
                      <div className="absolute -inset-4 border-2 border-emerald-500/45 rounded-3xl pointer-events-none animate-twilio-scanner">
                        {/* Brackets indicator */}
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
                        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />
                        
                        {/* Status text */}
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-extrabold text-[8px] uppercase tracking-widest px-2 py-0.5 rounded shadow-md">
                          FACE DETECTED
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Candidate Name Watermark */}
                  <span className="mt-4 text-xs font-extrabold tracking-wider text-slate-400 uppercase">
                    Participant: {candidate.name}
                  </span>
                </div>

                {/* Simulated Audio Waveform Equalizer (at the bottom) */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-end gap-1 h-8 z-10">
                  {Array.from({ length: 24 }).map((_, idx) => {
                    const randomDelay = (idx * 0.05).toFixed(2);
                    const randomHeight = [16, 24, 8, 32, 12, 28, 20, 14, 18, 22][idx % 10];
                    return (
                      <div 
                        key={idx}
                        className={`w-1 rounded-t bg-blue-500/80 transition-all ${
                          isPlaying ? 'animate-twilio-equalizer' : ''
                        }`}
                        style={{ 
                          height: isPlaying ? '100%' : `${randomHeight}px`,
                          maxHeight: '32px',
                          animationDelay: `${randomDelay}s` 
                        }}
                      />
                    );
                  })}
                </div>

                {/* Status text */}
                <div className="absolute bottom-4 left-4 z-10 text-[9px] font-extrabold tracking-widest uppercase text-slate-500 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                  <span>{isPlaying ? 'REC FEED LIVE' : 'PLAYBACK PAUSED'}</span>
                </div>
              </div>

              {/* Twilio Room Watermark Overlays */}
              <div className="absolute top-4 left-4 z-10 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-extrabold uppercase tracking-wider text-slate-350">Room:</span>
                <span className="font-bold text-white text-[11px]">{candidate.name.replace(/\s+/g, '_')}_session_video</span>
              </div>

              <div className="absolute top-4 right-4 z-10 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] text-slate-350 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-[9px]">LATENCY:</span>
                  <span className="font-bold text-emerald-400">14ms</span>
                </div>
                <div className="w-px h-3 bg-slate-800" />
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-[9px]">QUALITY:</span>
                  <span className="font-bold text-emerald-400">1080p HD</span>
                </div>
              </div>

              {/* Central play button overlay when paused */}
              {!isPlaying && (
                <button 
                  onClick={togglePlay}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95"
                >
                  <Play className="w-6 h-6 fill-current" />
                </button>
              )}
            </div>

            {/* Scrubber timeline and Event Flag Markers */}
            <div className="space-y-4">
              <div className="relative pt-6 pb-2">
                {/* Overlaid Event Flag Markers */}
                <div className="absolute top-0 left-0 w-full h-6 z-30 pointer-events-none">
                  {report.integrityEvents.map((evt, idx) => {
                    const evtSeconds = parseTimestampToSeconds(evt.timestamp);
                    const positionRatio = videoDuration ? evtSeconds / videoDuration : 0;

                    let colorClass = 'bg-blue-500 ring-blue-500/20';
                    if (evt.severity === 'high') colorClass = 'bg-rose-500 ring-rose-500/20';
                    if (evt.severity === 'medium') colorClass = 'bg-amber-500 ring-amber-500/20';

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentTime(evtSeconds);
                          setActiveEventIndex(idx);
                          setIsPlaying(true);
                          if (videoRef.current) {
                            try {
                              videoRef.current.currentTime = evtSeconds;
                              videoRef.current.play().catch(() => {});
                            } catch (e) {}
                          }
                        }}
                        className={`absolute -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white dark:border-[#111a2e] ring-4 flex items-center justify-center transition-all cursor-pointer pointer-events-auto hover:scale-125 ${colorClass} ${
                          activeEventIndex === idx ? 'scale-110 shadow-lg ring-8' : ''
                        }`}
                        style={{ left: `${Math.min(99, Math.max(1, positionRatio * 100))}%` }}
                        title={`${evt.timestamp} - ${evt.type} (${evt.severity} severity)`}
                      />
                    );
                  })}
                </div>

                {/* Scrubber Range Input */}
                <div className="relative flex items-center w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <input 
                    type="range"
                    min={0}
                    max={videoDuration}
                    value={currentTime}
                    onChange={(e) => {
                      const newTime = Number(e.target.value);
                      setCurrentTime(newTime);
                      if (videoRef.current) {
                        videoRef.current.currentTime = newTime;
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  {/* Visual scrubber fill */}
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-75 relative z-10"
                    style={{ width: `${(currentTime / videoDuration) * 100}%` }}
                  />
                  {/* Scrubber thumb handle */}
                  <div 
                    className="w-4 h-4 rounded-full bg-white border-2 border-blue-600 absolute top-1/2 -translate-y-1/2 -ml-2 z-10 pointer-events-none"
                    style={{ left: `${(currentTime / videoDuration) * 100}%` }}
                  />
                </div>
              </div>

              {/* Controls and duration metrics bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={togglePlay}
                    className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 flex items-center justify-center shadow-sm text-slate-650 dark:text-slate-300 active:scale-95 transition-all"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                  <button 
                    onClick={toggleMute}
                    className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 flex items-center justify-center shadow-sm text-slate-650 dark:text-slate-300 active:scale-95 transition-all"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span className="font-extrabold text-[11px] tabular-nums text-slate-500">
                    {formatSeconds(currentTime)} / {formatSeconds(videoDuration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Timeline Indicators:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-[10px] text-slate-500 font-bold">High Risk</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-[10px] text-slate-500 font-bold">Medium Risk</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-[10px] text-slate-500 font-bold">Low Risk</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active integrity warning display */}
            {activeEventIndex !== null && report.integrityEvents[activeEventIndex] && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
                  <AlertOctagon className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-extrabold uppercase tracking-wider">Integrity Event Selected: {report.integrityEvents[activeEventIndex].type}</span>
                  <span className="text-[10px] font-extrabold bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full uppercase ml-auto">
                    {report.integrityEvents[activeEventIndex].severity} severity
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                  {report.integrityEvents[activeEventIndex].context}
                </p>
                <div className="text-[10px] text-slate-400 font-bold">
                  Deduction Applied: -{report.integrityEvents[activeEventIndex].deduction} pts &bull; Occurred at timestamp {report.integrityEvents[activeEventIndex].timestamp}
                </div>
              </div>
            )}

            {/* Help Callout */}
            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              Tip: Click on the colored flag markers on the timeline scrubber track to jump the video directly to specific integrity events (e.g. tab switches, gaze averting anomalies) to visually audit the recording candidate stream.
            </div>
          </div>

        </div>

        {/* Right Column: Sticky Decision Panel */}
        <div id="decision-panel" className="lg:sticky lg:top-6 bg-white dark:bg-[#111a2e] border border-slate-200/80 dark:border-slate-800/85 rounded-3xl p-5 shadow-[0_4px_16px_rgba(15,23,42,0.03)] space-y-5 no-print">
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Hiring Decision Panel</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">Record notes and finalize candidate stage.</p>
          </div>

          <hr className="border-slate-150 dark:border-slate-800/60" />

          {/* Verdict Recommendation Buttons */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Hire Recommendation</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Strong Hire', 'Hire', 'Maybe', 'Reject'] as const).map((rec) => {
                const isSel = panelRecommend === rec;
                let colorClass = '';
                if (rec === 'Strong Hire') colorClass = isSel ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900';
                if (rec === 'Hire') colorClass = isSel ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900';
                if (rec === 'Maybe') colorClass = isSel ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900';
                if (rec === 'Reject') colorClass = isSel ? 'bg-rose-600 border-rose-600 text-white shadow-md' : 'border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900';
                
                return (
                  <button
                    key={rec}
                    type="button"
                    onClick={() => setPanelRecommend(rec)}
                    className={`px-3 py-2 border rounded-xl text-center text-xs font-extrabold transition-all active:scale-95 ${colorClass}`}
                  >
                    {rec}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recruitment Stage */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Recruitment Stage</label>
            <select
              value={panelStage}
              onChange={(e) => setPanelStage(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-xs font-extrabold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer"
            >
              <option value="Applied">Applied</option>
              <option value="Screening">Screening</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Hired">Hired</option>
            </select>
          </div>

          {/* Optional score override input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">AI Match Score Override</label>
            <input
              type="number"
              min="0"
              max="100"
              value={panelScoreOverride}
              onChange={(e) => setPanelScoreOverride(e.target.value)}
              placeholder="0 - 100"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-xs font-extrabold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            />
          </div>

          {/* Optional notes textarea */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Decision Notes</label>
            <textarea
              rows={3}
              value={panelNotes}
              onChange={(e) => setPanelNotes(e.target.value)}
              placeholder="Add final review notes..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all resize-none placeholder-slate-400"
            />
          </div>

          {/* Submit decision button */}
          <button
            type="button"
            onClick={handlePanelSubmit}
            disabled={panelSubmitting}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {panelSubmitting ? 'Submitting...' : 'Submit Final Decision'}
          </button>
        </div>
      </div>
    </div>
  );
};
