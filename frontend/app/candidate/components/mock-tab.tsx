'use client';

import React, { useState } from 'react';
import { Sparkles, Calendar, BookOpen, Clock, Award } from 'lucide-react';

interface MockTabProps {
  onStartMock: () => void;
}

export const MockTab: React.FC<MockTabProps> = ({ onStartMock }) => {
  const [domain, setDomain] = useState('React Core & internals');
  const [difficulty, setDifficulty] = useState('Medium');

  const domains = [
    'React Core & internals',
    'Full-Stack Node.js architectures',
    'System Design & Micro-frontends',
    'Data Structures & Algorithms'
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const previousScores = [
    { id: 1, domain: 'React Core & internals', date: '2026-07-16', score: 92, level: 'Medium' },
    { id: 2, domain: 'System Design', date: '2026-07-11', score: 86, level: 'Hard' }
  ];

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Mock Setup Form */}
        <div className="md:col-span-2 bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-800/40 pb-3">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-850 dark:text-white">Create AI Mock Practice Room</h3>
          </div>

          <div className="space-y-4">
            {/* Domain Selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 block">Select Practice Domain</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {domains.map((dom) => (
                  <button
                    key={dom}
                    type="button"
                    onClick={() => setDomain(dom)}
                    className={`p-3.5 rounded-2xl border text-xs text-left font-bold transition-all active:scale-95 ${
                      domain === dom 
                        ? 'bg-blue-600/10 border-blue-500 text-blue-400' 
                        : 'bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/50 border-slate-150 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 hover:text-white'
                    }`}
                  >
                    {dom}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 block">Select Difficulty Level</label>
              <div className="flex gap-3">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`flex-1 py-3 rounded-2xl border text-xs font-bold transition-all active:scale-95 ${
                      difficulty === diff 
                        ? 'bg-blue-600/10 border-blue-500 text-blue-400' 
                        : 'bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/50 border-slate-150 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 hover:text-white'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={onStartMock}
            className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold rounded-2xl transition-all shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Start Practice Assessment</span>
            <Sparkles className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Previous mock scores */}
        <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-800/40 pb-3">
            <BookOpen className="w-4.5 h-4.5 text-blue-400" />
            <h3 className="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider">Previous Scores</h3>
          </div>

          <div className="space-y-3">
            {previousScores.map((score) => (
              <div 
                key={score.id}
                className="p-3.5 bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-800/60 rounded-2xl space-y-2 text-left"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-extrabold text-blue-400 uppercase tracking-widest">{score.level}</span>
                  <span className="text-[10px] text-slate-500 font-bold">{score.date}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{score.domain}</h4>
                <div className="flex items-center gap-1.5 text-xs text-blue-400 font-extrabold mt-1">
                  <Award className="w-4.5 h-4.5" />
                  <span>AI Score: {score.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
