'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Trash2, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Eye
} from 'lucide-react';

export const ResumeTab: React.FC = () => {
  const [resume, setResume] = useState<{ name: string; size: string; date: string; status: string } | null>({
    name: 'Sarah_Jenkins_Resume_Senior_Frontend.pdf',
    size: '1.2 MB',
    date: '2026-07-12 10:32 AM',
    status: 'Verified'
  });

  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setResume({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        date: new Date().toLocaleString(),
        status: 'Processing'
      });
      // Simulate verification delay
      setTimeout(() => {
        setResume(prev => prev ? { ...prev, status: 'Verified' } : null);
      }, 3000);
    }
  };

  const handleDownload = () => {
    if (!resume) return;
    const content = `HIREAI PRO - CANDIDATE RESUME PROFILE\n` +
      `=====================================\n` +
      `File Name: ${resume.name}\n` +
      `Upload Date: ${resume.date}\n` +
      `Verification Status: ${resume.status}\n` +
      `Size: ${resume.size}\n\n` +
      `Candidate Name: Sarah Jenkins\n` +
      `Target Role: Senior Frontend Engineer\n` +
      `Summary: High-performing UI developer specializing in Next.js, Concurrent Mode, and state management frameworks.\n`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = resume.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDelete = () => {
    setResume(null);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-left">
      
      <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-6 shadow-sm">
        <h2 className="text-md font-bold text-slate-850 dark:text-white mb-2">My Professional Resume</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-6">
          Upload your resume in PDF format. Our AI parser parses skills, experience, and certifications to automatically match you with jobs.
        </p>
 
        {resume ? (
          // Active Resume View
          <div className="p-4 bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-500/15 flex items-center justify-center text-blue-400 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-850 dark:text-white truncate max-w-md">{resume.name}</h4>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500 font-bold">
                  <span>{resume.size}</span>
                  <span>&bull;</span>
                  <span>Uploaded {resume.date}</span>
                </div>
              </div>
            </div>
 
            <div className="flex items-center gap-2 shrink-0">
              {/* Status Indicator */}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider ring-1 ${
                resume.status === 'Verified' 
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-450 ring-emerald-500/20' 
                  : 'bg-amber-50 dark:bg-amber-500/10 text-amber-450 ring-amber-500/20 animate-pulse'
              }`}>
                {resume.status === 'Verified' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                {resume.status}
              </span>
 
              {/* View Action */}
              <button 
                title="View Document"
                onClick={handleDownload}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl transition-all active:scale-95"
              >
                <Eye className="w-4 h-4" />
              </button>
 
              {/* Download Action */}
              <button 
                title="Download Document"
                onClick={handleDownload}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Delete Action */}
              <button 
                title="Remove Document"
                onClick={handleDelete}
                className="p-2 text-rose-450 hover:text-white bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-600 border border-rose-500/15 rounded-xl transition-all active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          // Upload Drag & Drop Area
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all ${
              dragActive 
                ? 'border-blue-500 bg-blue-500/5' 
                : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/10 hover:border-slate-700/80'
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-850 dark:text-white">Drag and drop your file here, or click to browse</p>
                <p className="text-[10px] text-slate-500 font-bold">Supports PDF format (Max size 10MB)</p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setResume({
                      name: file.name,
                      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                      date: new Date().toLocaleString(),
                      status: 'Processing'
                    });
                    setTimeout(() => {
                      setResume(prev => prev ? { ...prev, status: 'Verified' } : null);
                    }, 3000);
                  }
                }}
              />
              <label 
                htmlFor="file-upload"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-2xl transition-all shadow-md shadow-blue-600/10 cursor-pointer hover:shadow-blue-600/20 active:scale-95 inline-block"
              >
                Choose PDF File
              </label>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
