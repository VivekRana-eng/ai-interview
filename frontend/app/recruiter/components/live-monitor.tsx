'use client';

import React, { useState, useEffect } from 'react';
import { useRecruiterStore } from '../store';
import { LiveCandidate } from '../types';
import { 
  Play, 
  Terminal, 
  User, 
  Scan,
  ShieldCheck,
  ShieldAlert,
  Compass
} from 'lucide-react';

export const LiveMonitor: React.FC = () => {
  const { liveCandidates, updateLiveCandidate } = useRecruiterStore();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isSimulating, setIsSimulating] = useState(true);

  const selectedCandidate = liveCandidates[selectedIdx] || null;

  // Telemetry logs simulator
  useEffect(() => {
    if (!isSimulating || liveCandidates.length === 0) return;

    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * liveCandidates.length);
      const target = liveCandidates[idx];

      let nextProgress = target.progress + 5;
      let nextQuestion = target.currentQuestion;

      if (nextProgress >= 100) {
        nextProgress = 0;
        nextQuestion = target.currentQuestion >= target.totalQuestions 
          ? 1 
          : target.currentQuestion + 1;
      }

      const logLines = [
        `Candidate: Answered Q${nextQuestion} segment.`,
        `AI: Evaluating gaze telemetry...`,
        `System: Packet verification successful.`,
        `Candidate: Opened Question ${nextQuestion}.`,
        `AI: Running voice tone analysis...`
      ];
      const randomLog = logLines[Math.floor(Math.random() * logLines.length)];

      updateLiveCandidate(target.id, nextProgress, nextQuestion, randomLog);
    }, 4500);

    return () => clearInterval(interval);
  }, [isSimulating, liveCandidates, updateLiveCandidate]);

  const getStatusBadge = (status: LiveCandidate['status']) => {
    switch (status) {
      case 'Secure':
        return <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200">Secure</span>;
      case 'Warning':
        return <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200">Warning</span>;
      case 'Critical':
        return <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200">Critical</span>;
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-55">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <h3 className="text-sm font-bold text-slate-800">LIVE CANDIDATES</h3>
        </div>
        <button 
          onClick={() => setIsSimulating(!isSimulating)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all ${isSimulating ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm' : 'bg-white text-slate-500 border-slate-200'}`}
        >
          <Play className={`w-3.5 h-3.5 ${isSimulating ? 'fill-indigo-650 text-indigo-650' : ''}`} />
          <span>{isSimulating ? 'Simulating' : 'Start Simulation'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Candidates feeds */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
          {liveCandidates.map((cand, idx) => (
            <button
              key={cand.id}
              onClick={() => setSelectedIdx(idx)}
              className={`
                w-full text-left p-3.5 rounded-2xl border flex items-center justify-between transition-all
                ${selectedIdx === idx 
                  ? 'bg-indigo-50/50 border-indigo-200 shadow-[0_2px_8px_rgba(99,102,241,0.05)]' 
                  : 'bg-white border-slate-100 hover:bg-slate-50'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                  {cand.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{cand.name}</h4>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{cand.position}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                {getStatusBadge(cand.status)}
                <span className="text-[9px] text-slate-400 font-semibold">{cand.timeElapsed}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Column: Inspect telemetry details */}
        {selectedCandidate && (
          <div className="lg:col-span-8 flex flex-col justify-between gap-5">
            {/* Header info */}
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-800">{selectedCandidate.name}</h4>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[8px] font-bold tracking-wider uppercase border border-blue-100">
                    MONITORING
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Role: {selectedCandidate.position}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold block">QUESTION {selectedCandidate.currentQuestion} / {selectedCandidate.totalQuestions}</span>
                <span className="text-xs font-extrabold text-slate-850 mt-0.5 block">PROGRESS {selectedCandidate.progress}%</span>
              </div>
            </div>

            {/* Video camera canvas & console logger */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Telemetry Target camera scan */}
              <div className="relative rounded-2xl bg-slate-50 border border-slate-100 h-36 flex items-center justify-center overflow-hidden shadow-inner">
                {/* Dotted target overlays */}
                <div className="absolute w-24 h-24 border border-dashed border-indigo-300/40 rounded-full animate-spin duration-15000" />
                <div className="absolute w-16 h-16 border border-dashed border-indigo-400/40 rounded-full animate-reverse-spin" />
                <Scan className="absolute w-28 h-28 text-indigo-200/50" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <User className="w-8 h-8 text-indigo-400/80" />
                  {/* Bounding box mock face */}
                  <div className="absolute -inset-1 border border-indigo-400/40 rounded-lg animate-pulse" />
                </div>

                {/* Status Badges */}
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[8px] font-bold border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                  <span>CAM 01 (Verified)</span>
                </div>
                
                <div className="absolute bottom-3 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[8px] font-bold border border-emerald-200 flex items-center gap-1 shadow-sm">
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Face ID Checked</span>
                </div>
              </div>

              {/* System Console Logs */}
              <div className="rounded-2xl bg-slate-900 border border-slate-950 p-4 flex flex-col h-36 shadow-md">
                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800 text-[10px] text-slate-400 font-bold">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>SYSTEM CONSOLE LOGS</span>
                </div>
                <div className="flex-1 mt-2.5 overflow-y-auto font-mono text-[9px] text-slate-350 space-y-1.5 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
                  {selectedCandidate.logs.map((log, i) => (
                    <div key={i} className="flex gap-1.5">
                      <span className="text-slate-600 font-bold select-none">&gt;</span>
                      <p className="truncate">{log}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Progress Bar */}
            <div className="w-full">
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500" 
                  style={{ width: `${selectedCandidate.progress}%` }} 
                />
              </div>
              <div className="flex justify-between items-center mt-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                <span>STAGE PROGRESS</span>
                <span>{selectedCandidate.progress}% COMPLETED</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
