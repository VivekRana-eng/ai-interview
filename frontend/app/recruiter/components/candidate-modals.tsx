'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Candidate, Job } from '../types';
import { 
  X, Upload, FileText, Loader2, Sparkles, Calendar, ClipboardCheck, 
  Download, HelpCircle, AlertCircle, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: Job[];
  onSubmit: (file: File, jobTitle: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  jobs,
  onSubmit,
  isLoading,
  error
}) => {
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize selected job
  React.useEffect(() => {
    const activeJobs = jobs.filter(j => j.status === 'Active');
    if (activeJobs.length > 0 && !selectedJob) {
      setSelectedJob(activeJobs[0].title);
    }
  }, [jobs, selectedJob]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file && selectedJob) {
      onSubmit(file, selectedJob);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-[6px]" 
            onClick={onClose} />

          <motion.div initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }} 
            className="relative w-full max-w-md bg-white rounded-[32px] shadow-[0_40px_100px_rgba(15,23,42,0.25)] border border-slate-100 overflow-hidden p-6 z-10 space-y-4">


            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-slate-450 uppercase tracking-wider pl-0.5">Applied Position Target</label>
                <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                  {jobs.filter(j => j.status === 'Active').map(j => (
                    <option key={j.id} value={j.title}>{j.title}</option>
                  ))}
                </select>
              </div>

              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files.length > 0) setFile(e.dataTransfer.files[0]); }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[130px] ${isDragOver ? 'border-blue-500 bg-blue-50/20' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/50'}`}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.docx,.txt" className="hidden" />
                {file ? (
                  <div className="space-y-1">
                    <div className="p-2 bg-blue-50 text-blue-500 rounded-xl inline-flex"><FileText className="w-6 h-6" /></div>
                    <p className="text-xs font-bold text-slate-700 max-w-[200px] truncate">{file.name}</p>
                    <p className="text-[9px] text-slate-400 font-semibold">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="p-2 bg-slate-50 text-slate-400 rounded-xl inline-flex"><Upload className="w-5 h-5" /></div>
                    <p className="text-xs font-bold text-slate-700">Drag & Drop Resume</p>
                    <p className="text-[9px] text-slate-400 font-semibold">Accepts PDF, DOCX or TXT files</p>
                  </div>
                )}
              </div>

              {error && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}

              <button type="submit" disabled={isLoading || !file || !selectedJob} className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>Screening & Analyzing...</span></>
                ) : (
                  <><Sparkles className="w-4 h-4" /><span>Analyze Resume</span></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  meeting?: {
    key: string;
    candidateId: string;
    candidateName: string;
    position: string;
    date: string;
    comment: string;
    status: string;
    source: 'timeline' | 'interviewDate';
    entryIndex: number | null;
  } | null;
  onSchedule: (date: string, time: string, interviewer: string) => void;
}

interface MeetingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetings: Array<{
    key: string;
    candidateId: string;
    candidateName: string;
    position: string;
    date: string;
    comment: string;
    status: string;
    source: 'timeline' | 'interviewDate';
    entryIndex: number | null;
  }>;
  onEditMeeting: (meeting: {
    key: string;
    candidateId: string;
    candidateName: string;
    position: string;
    date: string;
    comment: string;
    status: string;
    source: 'timeline' | 'interviewDate';
    entryIndex: number | null;
  }) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  candidate,
  meeting,
  onSchedule
}) => {
  const [date, setDate] = useState('2026-07-02');
  const [time, setTime] = useState('14:30');
  const [interviewer, setInterviewer] = useState('Akash Patel (AI Lead)');
  const [success, setSuccess] = useState(false);

  const parseMeetingDate = (meetingDate: string) => {
    const [datePart, timePart] = meetingDate.split(' at ');
    let parsedDate = datePart;
    let parsedTime = '14:30';

    if (timePart) {
      parsedTime = timePart;
    }

    try {
      const parsed = new Date(parsedDate);
      if (!isNaN(parsed.getTime())) {
        parsedDate = parsed.toISOString().split('T')[0];
      }
    } catch {
      parsedDate = '2026-07-02';
    }

    return { parsedDate, parsedTime };
  };

  useEffect(() => {
    if (isOpen) {
      if (meeting?.date) {
        const { parsedDate, parsedTime } = parseMeetingDate(meeting.date);
        setDate(parsedDate);
        setTime(parsedTime);
      } else if (candidate?.interviewDate && candidate.interviewDate !== 'TBD') {
        try {
          const parsedDate = new Date(candidate.interviewDate);
          if (!isNaN(parsedDate.getTime())) {
            setDate(parsedDate.toISOString().split('T')[0]);
          } else {
            setDate('2026-07-02');
          }
        } catch (e) {
          setDate('2026-07-02');
        }
        setTime('14:30');
      } else {
        setDate('2026-07-02');
        setTime('14:30');
      }
    }
  }, [isOpen, meeting, candidate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule(date, time, interviewer);

    // Google Calendar template URL construction
    const cleanDate = date.replace(/-/g, ''); // e.g. "20260702"
    const cleanTime = time.replace(/:/g, ''); // e.g. "1430"
    
    // Parse time to add 1 hour for end time
    const [hours, minutes] = time.split(':').map(Number);
    const endHours = (hours + 1) % 24;
    const endHoursStr = String(endHours).padStart(2, '0');
    const cleanEndTime = `${endHoursStr}${String(minutes).padStart(2, '0')}`;
    
    const start = `${cleanDate}T${cleanTime}00`;
    const end = `${cleanDate}T${cleanEndTime}00`;
    
    const text = encodeURIComponent(`AI Interview: ${candidate?.name}`);
    const details = encodeURIComponent(`Candidate: ${candidate?.name}\nRole: ${candidate?.position}\nInterviewer: ${interviewer}\nScheduled via SelectAI.`);
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=Online`;
    
    // Open in a new tab/window
    window.open(googleCalendarUrl, '_blank');

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && candidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/20 backdrop-blur-[6px]" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-[32px] shadow-[0_40px_100px_rgba(15,23,42,0.25)] border border-slate-100 overflow-hidden p-6 z-10 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Schedule AI Interview</span>
              </h4>
              <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-650"><X className="w-4 h-4" /></button>
            </div>

            {success ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 mx-auto flex items-center justify-center"><Check className="w-5 h-5" /></div>
                <h5 className="text-xs font-extrabold text-slate-800">Interview Scheduled!</h5>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-xs font-semibold">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase">Candidate</p>
                  <p className="font-bold text-slate-800 mt-0.5">{candidate.name}</p>
                  <p className="text-[10px] text-slate-500">{candidate.position}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold text-slate-450 uppercase pl-0.5">Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold text-slate-450 uppercase pl-0.5">Time</label>
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500" required />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold text-slate-450 uppercase pl-0.5">Assigned Interviewer</label>
                  <select value={interviewer} onChange={(e) => setInterviewer(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                    <option value="Akash Patel (AI Lead)">Akash Patel (AI Lead)</option>
                    <option value="Priya Sharma (Eng Director)">Priya Sharma (Eng Director)</option>
                  </select>
                </div>

                <button type="submit" className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md">
                  <ClipboardCheck className="w-4 h-4" />
                  <span>{meeting ? 'Confirm Reschedule' : 'Confirm Schedule'}</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const MeetingListModal: React.FC<MeetingListModalProps> = ({
  isOpen,
  onClose,
  meetings,
  onEditMeeting
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/20 backdrop-blur-[6px]" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg h-[560px] bg-white rounded-[32px] shadow-[0_40px_100px_rgba(15,23,42,0.25)] border border-slate-100 overflow-hidden p-6 z-10">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Scheduled Meetings</span>
              </h4>
              <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-650"><X className="w-4 h-4" /></button>
            </div>

            <div className="mt-4 max-h-[460px] overflow-y-auto pr-2 space-y-4">
              {meetings.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm font-semibold">
                  No meetings scheduled yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {meetings.map((meeting, index) => (
                    <div key={`${meeting.candidateName}-${index}`} className="border border-slate-100 rounded-3xl p-4 bg-slate-50">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidate</p>
                            <h5 className="text-sm font-extrabold text-slate-900 mt-1 leading-snug">{meeting.candidateName}</h5>
                            <p className="text-[11px] text-slate-500 font-semibold mt-1">{meeting.position}</p>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                            {meeting.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-500 text-[10px] font-semibold">
                          <div>
                            <p className="text-slate-400 uppercase tracking-wider text-[9px]">Date & Time</p>
                            <p className="mt-1 text-slate-700">{meeting.date}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 uppercase tracking-wider text-[9px]">Note</p>
                            <p className="mt-1 text-slate-700">{meeting.comment || 'No details provided.'}</p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => onEditMeeting(meeting)}
                            className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold uppercase tracking-wider transition-colors"
                          >
                            Reschedule
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};



