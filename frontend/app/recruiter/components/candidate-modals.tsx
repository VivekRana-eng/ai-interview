'use client';

import React, { useState, useRef } from 'react';
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/20 backdrop-blur-[6px]" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-[32px] shadow-[0_40px_100px_rgba(15,23,42,0.25)] border border-slate-100 overflow-hidden p-6 z-10 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-blue-500" />
                <span>Upload Candidate CV</span>
              </h4>
              <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50"><X className="w-4 h-4" /></button>
            </div>

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
  onSchedule: (date: string, time: string, interviewer: string) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  candidate,
  onSchedule
}) => {
  const [date, setDate] = useState('2026-07-02');
  const [time, setTime] = useState('14:30');
  const [interviewer, setInterviewer] = useState('Akash Patel (AI Lead)');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule(date, time, interviewer);
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/20 backdrop-blur-[6px]" onClick={onClose} />
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
                  <span>Confirm Schedule</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};




