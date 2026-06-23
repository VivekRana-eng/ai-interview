'use client';

import React, { useEffect, useState } from 'react';
import { useDashboardStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, ShieldAlert, ShieldCheck, HelpCircle } from 'lucide-react';

const QUESTIONS = [
  'Describe a complex technical challenge you solved recently.',
  'How do you manage race conditions in asynchronous environments?',
  'Explain your approach to designing a scalable microservice system.',
  'What security safeguards do you apply in user authentication?',
  'How do you handle conflict or architectural disagreements in a dev team?'
];

export const LiveMonitor: React.FC = () => {
  const { liveInterviews, updateLiveInterviewProgress } = useDashboardStore();
  const [selectedIdx, setSelectedIdx] = useState(0);

  const activeCount = liveInterviews.length;
  const currentInterview = liveInterviews[selectedIdx] || null;

  // Real-time simulator: incrementally increases progress of ongoing interviews
  useEffect(() => {
    if (activeCount === 0) return;

    const interval = setInterval(() => {
      // Pick a random interview to simulate progress
      const targetIdx = Math.floor(Math.random() * activeCount);
      const target = liveInterviews[targetIdx];
      
      let nextProgress = target.progress + 8;
      let nextQuestion = target.currentQuestion;

      if (nextProgress >= 100) {
        nextProgress = 0;
        nextQuestion = target.currentQuestion === target.totalQuestions 
          ? 1 
          : target.currentQuestion + 1;
      }

      updateLiveInterviewProgress(target.id, nextProgress, nextQuestion);
    }, 3500);

    return () => clearInterval(interval);
  }, [activeCount, liveInterviews, updateLiveInterviewProgress]);

  const getIntegrityBadge = (status: 'Good' | 'Warning' | 'Critical') => {
    switch (status) {
      case 'Good':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Good
          </span>
        );
      case 'Warning':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" /> Warning
          </span>
        );
      case 'Critical':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider animate-bounce">
            <ShieldAlert className="w-3.5 h-3.5" /> Critical
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900">Live Interview Monitoring</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Real-time candidate camera & telemetry tracking</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-xl text-xs font-semibold">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="uppercase tracking-wider text-[10px] font-bold">LIVE ({activeCount})</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Side: Detail view of currently inspected interview */}
        {currentInterview ? (
          <div className="md:col-span-2 p-5 rounded-2xl bg-slate-950/40 dark:bg-slate-950/40 light:bg-white border border-slate-900/60 dark:border-slate-900/60 light:border-slate-200/60 shadow-lg backdrop-blur-md flex flex-col justify-between min-h-[250px]">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={currentInterview.avatarUrl} 
                    alt={currentInterview.candidateName} 
                    className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-850"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white dark:text-white light:text-slate-800">{currentInterview.candidateName}</h4>
                    <p className="text-[10px] text-slate-500">{currentInterview.position}</p>
                  </div>
                </div>
                {getIntegrityBadge(currentInterview.integrityStatus)}
              </div>

              {/* Progress and active question */}
              <div className="mt-6">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-indigo-400" /> Active Question {currentInterview.currentQuestion} / {currentInterview.totalQuestions}</span>
                  <span>{currentInterview.progress}% Answered</span>
                </div>
                <div className="w-full bg-slate-900 dark:bg-slate-900 light:bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-900/80 dark:border-slate-900/80 light:border-slate-200">
                  <motion.div
                    className="h-full bg-indigo-500"
                    animate={{ width: `${currentInterview.progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-slate-900/40 dark:bg-slate-900/40 light:bg-slate-50 border border-slate-900 dark:border-slate-900 light:border-slate-200 text-xs italic text-slate-300 dark:text-slate-300 light:text-slate-700">
              "{QUESTIONS[(currentInterview.currentQuestion - 1) % QUESTIONS.length]}"
            </div>
          </div>
        ) : (
          <div className="md:col-span-2 flex items-center justify-center p-8 rounded-2xl bg-slate-950/40 border border-slate-900 text-slate-500 text-xs">
            No live interviews occurring.
          </div>
        )}

        {/* Right Side: Quick list of other concurrent live interviews */}
        <div className="p-4 rounded-2xl bg-slate-950/40 dark:bg-slate-950/40 light:bg-white border border-slate-900/60 dark:border-slate-900/60 light:border-slate-200/60 shadow-lg backdrop-blur-md max-h-[250px] overflow-y-auto scrollbar-thin">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-3">Monitoring Feed</span>
          <div className="space-y-2">
            {liveInterviews.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setSelectedIdx(idx)}
                className={`
                  w-full text-left p-2.5 rounded-xl border flex items-center justify-between transition-all
                  ${selectedIdx === idx 
                    ? 'bg-slate-900 dark:bg-slate-900 light:bg-indigo-50 text-white dark:text-white light:text-indigo-700 border-indigo-500/40' 
                    : 'bg-slate-950/20 dark:bg-slate-950/20 light:bg-transparent border-slate-900 dark:border-slate-900 light:border-slate-200 text-slate-400 dark:text-slate-400 light:text-slate-600 hover:bg-slate-900/20'
                  }
                `}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full ${item.integrityStatus === 'Critical' ? 'bg-rose-500' : item.integrityStatus === 'Warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <span className="text-xs font-semibold truncate block">{item.candidateName}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold whitespace-nowrap pr-1">Q{item.currentQuestion} / {item.totalQuestions}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
