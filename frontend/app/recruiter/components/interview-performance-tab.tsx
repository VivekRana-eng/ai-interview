'use client';

import React, { useState } from 'react';
import { Candidate } from '../types';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { getDefaultInterviewPerformance } from './candidate-detail-data';

interface InterviewPerformanceTabProps {
  candidate: Candidate;
}

export const InterviewPerformanceTab: React.FC<InterviewPerformanceTabProps> = ({
  candidate
}) => {
  const [showStrugglesOnly, setShowStrugglesOnly] = useState(false);

  const performance = candidate.interviewPerformance && candidate.interviewPerformance.qaList && candidate.interviewPerformance.qaList.length > 0
    ? candidate.interviewPerformance
    : getDefaultInterviewPerformance(candidate);

  const filteredQaList = showStrugglesOnly 
    ? performance.qaList.filter(qa => qa.score < 7.5)
    : performance.qaList;

  return (
    <div className="space-y-6">
      {/* Score cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall Rating', val: performance.overallScore, max: 10, color: 'text-blue-600' },
          { label: 'Technical depth', val: performance.technicalScore, max: 10, color: 'text-emerald-600' },
          { label: 'Communication', val: performance.communicationScore, max: 10, color: 'text-indigo-655' },
          { label: 'Problem Solving', val: performance.problemSolvingScore, max: 10, color: 'text-violet-655' }
        ].map((score, i) => (
          <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center space-y-1 shadow-sm">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{score.label}</p>
            <p className={`text-xl font-extrabold ${score.color}`}>{score.val} <span className="text-slate-400 text-xs font-medium">/ {score.max}</span></p>
          </div>
        ))}
      </div>

      {/* Strengths & Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-emerald-50/45 border border-emerald-100 text-emerald-800 rounded-xl space-y-2">
          <h5 className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-555" />
            <span>Interview Strengths</span>
          </h5>
          <ul className="list-disc list-outside pl-4 space-y-1 text-[11px] font-semibold text-slate-600 leading-relaxed">
            {performance.strengths.map((str, i) => <li key={i}>{str}</li>)}
          </ul>
        </div>

        <div className="p-4 bg-amber-50/45 border border-amber-100 text-amber-800 rounded-xl space-y-2">
          <h5 className="text-[11px] font-extrabold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-550" />
            <span>Identified Gaps</span>
          </h5>
          <ul className="list-disc list-outside pl-4 space-y-1 text-[11px] font-semibold text-slate-600 leading-relaxed">
            {performance.weaknesses.map((str, i) => <li key={i}>{str}</li>)}
          </ul>
        </div>
      </div>

      {/* Excelled / Struggled Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
          <h5 className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider">Excelled At</h5>
          <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">{(performance.performedWell || []).join(', and ')}.</p>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
          <h5 className="text-[11px] font-extrabold text-amber-700 uppercase tracking-wider">Struggled With</h5>
          <p className="text-[11px] text-slate-655 font-semibold leading-relaxed">{(performance.gotStuck || []).join(', and ')}.</p>
        </div>
      </div>

      {/* QA transcript header with filter action */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Interview QA Transcript</h4>
        
        <button
          onClick={() => setShowStrugglesOnly(!showStrugglesOnly)}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 border ${
            showStrugglesOnly 
              ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm' 
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100/50'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{showStrugglesOnly ? 'Showing Weak Answers' : 'Show Low-Performing Questions'}</span>
        </button>
      </div>

      {/* QA Transcript List */}
      <div className="space-y-4">
        {filteredQaList.length > 0 ? (
          filteredQaList.map((qa, idx) => {
            const isLowScore = qa.score < 7.5;
            return (
              <div key={idx} className={`p-4 bg-slate-50 border rounded-xl space-y-3 transition-all ${
                isLowScore ? 'border-amber-200 shadow-sm bg-amber-50/10' : 'border-slate-150'
              }`}>
                <div className="flex justify-between items-start gap-4">
                  <p className="text-xs font-bold text-slate-800 leading-normal flex-1">
                    <span className="text-blue-600 font-extrabold mr-1">Q{idx + 1}:</span>
                    {qa.question}
                  </p>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider whitespace-nowrap ${
                    isLowScore ? 'bg-amber-50 text-amber-700 border border-amber-200/60' : 'bg-blue-50 text-blue-700 border border-blue-200/40'
                  }`}>
                    Score: {qa.score}/10
                  </span>
                </div>
                <div className="text-xs space-y-2.5">
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">CANDIDATE ANSWER</span>
                    <p className="italic text-slate-600 font-semibold leading-relaxed mt-0.5">"{qa.answer}"</p>
                  </div>
                  <div className="p-3 bg-blue-50/20 border border-blue-100/60 rounded-lg text-slate-655">
                    <span className="text-[9px] font-extrabold text-blue-600 uppercase tracking-widest block">AI ASSESSMENT</span>
                    <p className="text-slate-600 font-semibold mt-0.5 leading-relaxed">{qa.aiEvaluation}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-slate-400 italic text-center py-6">No low-performing questions found for this candidate.</p>
        )}
      </div>
    </div>
  );
};
