'use client';

import React from 'react';
import { BrainCircuit, Award, Star, ThumbsUp, ThumbsDown, Lightbulb, Download } from 'lucide-react';

export const FeedbackTab: React.FC = () => {
  const scores = [
    { name: 'Overall Score', score: 92, desc: 'Top 5% of candidate pool' },
    { name: 'Technical Depth', score: 94, desc: 'Strong grasp of concurrent rendering, React fibers, and hydration locks' },
    { name: 'Communication Pacing', score: 88, desc: 'Very articulate, well-structured layout description' },
    { name: 'Confidence & Tone', score: 90, desc: 'Stable sound level, low usage of filler words' },
    { name: 'Problem Solving Method', score: 95, desc: 'Correct architectural step breakdown' },
    { name: 'Cultural Fit Score', score: 86, desc: 'Highly collaborative tone, receptive feedback indicators' }
  ];

  const strengths = [
    "Expert level structure when explaining virtualization logic (explaining row bounds and off-screen nodes).",
    "Great explanation of state scoping, specifically the trade-offs of Zustand closures vs Redux middleware.",
    "Very clean audio input pacing with zero distracting background levels."
  ];

  const weaknesses = [
    "Missed explaining error boundary fallbacks in Server Components.",
    "Could elaborate slightly more on CSS-in-JS hydration performance hits."
  ];

  const suggestions = [
    "Practice talking about Server Actions alongside standard React Concurrent features.",
    "Read the Vercel architecture spec on Edge runtime caching and prefetching mechanics."
  ];

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div id="scorecard-print-area" className="space-y-6 text-left max-w-4xl mx-auto">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #scorecard-print-area, #scorecard-print-area * {
            visibility: visible;
          }
          #scorecard-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            padding: 24px !important;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      
      {/* Overview Header Card */}
      <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-6 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-blue-500/5 blur-2xl" />
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <BrainCircuit className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-850 dark:text-white">AI Evaluation Scorecard</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Google &bull; Staff UI Engineer Evaluation Assessment</p>
          </div>
        </div>

        <button 
          onClick={handlePrintReport}
          className="no-print px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-blue-600/10 flex items-center gap-1.5 active:scale-95 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF Report</span>
        </button>
      </div>

      {/* Grid of Scores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {scores.map((item) => (
          <div 
            key={item.name}
            className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">{item.name}</span>
              <span className="text-xs font-extrabold text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-lg">{item.score}/100</span>
            </div>
            
            <div className="mt-2.5">
              <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" 
                  style={{ width: `${item.score}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold mt-2.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Analysis (Strengths, Weaknesses, Suggestions) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Strengths */}
        <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-800/40 pb-2">
            <ThumbsUp className="w-4.5 h-4.5 text-emerald-450" />
            <h4 className="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider">Key Strengths</h4>
          </div>
          <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold list-disc pl-4">
            {strengths.map((str, i) => (
              <li key={i}>{str}</li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-800/40 pb-2">
            <ThumbsDown className="w-4.5 h-4.5 text-rose-455" />
            <h4 className="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider">Growth Areas</h4>
          </div>
          <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold list-disc pl-4">
            {weaknesses.map((weak, i) => (
              <li key={i}>{weak}</li>
            ))}
          </ul>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-800/40 pb-2">
            <Lightbulb className="w-4.5 h-4.5 text-amber-400" />
            <h4 className="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider">AI Suggestions</h4>
          </div>
          <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold list-disc pl-4">
            {suggestions.map((sug, i) => (
              <li key={i}>{sug}</li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
};
