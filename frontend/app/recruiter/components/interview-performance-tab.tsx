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
  const [showWeakOnly, setShowWeakOnly] = useState(false);

  const performance = candidate.interviewPerformance && candidate.interviewPerformance.qaList && candidate.interviewPerformance.qaList.length > 0
    ? candidate.interviewPerformance
    : getDefaultInterviewPerformance(candidate);

  const filteredQaList = showWeakOnly
    ? performance.qaList.filter(qa => qa.score < 7.5)
    : performance.qaList;

  const weakCount = performance.qaList.filter(qa => qa.score < 7.5).length;

  const ringMetrics = [
    { label: 'Technical depth', score: performance.technicalScore, color: '#10B981' },
    { label: 'Communication', score: performance.communicationScore, color: '#6366F1' },
    { label: 'Problem Solving', score: performance.problemSolvingScore, color: '#8B5CF6' }
  ];

  const getRingStyle = (score: number, color: string) => {
    const percent = Math.min(100, Math.max(0, Math.round((score / 10) * 100)));
    return {
      background: `conic-gradient(${color} ${percent}%, rgba(148,163,184,0.16) ${percent}% 100%)`
    };
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[28px] border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.08),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.06),transparent_30%)]" />
        <div className="relative grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="rounded-[24px] border border-blue-100/80 bg-white/85 backdrop-blur-sm p-4 shadow-[0_8px_24px_rgba(37,99,235,0.05)] flex flex-col justify-between min-h-[172px]">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-slate-400">Overall Rating</p>
              <span className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">Summary</span>
            </div>
            <div className="py-3 flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white to-slate-50 grid place-items-center border border-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <span className="text-3xl font-extrabold text-slate-900">{performance.overallScore}</span>
              </div>
              <p className="mt-3 text-[10px] uppercase tracking-[0.32em] text-slate-500 font-bold">Out of 10</p>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              Balanced score across technical, communication, and problem solving signals.
            </p>
          </div>

          {ringMetrics.map((metric, idx) => (
            <div key={metric.label} className="rounded-[24px] border border-slate-100 bg-white/90 backdrop-blur-sm p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] flex flex-col justify-between min-h-[172px]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-slate-400">Metric {idx + 1}</span>
                <span className="text-[9px] font-extrabold uppercase tracking-[0.22em]" style={{ color: metric.color }}>
                  {metric.score.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center justify-center py-2">
                <div className="mx-auto w-24 h-24 rounded-full relative" style={getRingStyle(metric.score, metric.color)}>
                  <div className="absolute inset-3 rounded-full bg-white grid place-items-center shadow-inner">
                    <div className="text-center">
                      <p className="text-2xl font-extrabold" style={{ color: metric.color }}>{metric.score.toFixed(1)}</p>
                      <p className="text-[9px] uppercase tracking-[0.22em] text-slate-500 mt-0.5">/ 10</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-600">{metric.label}</p>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: metric.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
          <h5 className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider">Excelled At</h5>
          <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">{(performance.performedWell || []).join(', and ')}.</p>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
          <h5 className="text-[11px] font-extrabold text-amber-700 uppercase tracking-wider">Struggled With</h5>
          <p className="text-[11px] text-slate-655 font-semibold leading-relaxed">{(performance.gotStuck || []).join(', and ')}.</p>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Interview QA Transcript</h4>

        <button
          onClick={() => setShowWeakOnly(!showWeakOnly)}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 border ${
            showWeakOnly
              ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100/50'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{showWeakOnly ? `Showing Weak Answers (${weakCount})` : `Show Weak Answers Only (${weakCount})`}</span>
        </button>
      </div>

      <div className="space-y-3">
        {filteredQaList.length > 0 ? (
          filteredQaList.map((qa, idx) => {
            const isLowScore = qa.score < 7.5;
            return (
              <div key={idx} className={`p-3.5 bg-slate-50 border rounded-xl space-y-2.5 transition-all ${
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
                <div className="text-xs space-y-2">
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
          <p className="text-xs text-slate-400 italic text-center py-5">No weak answers found for this candidate.</p>
        )}
      </div>
    </div>
  );
};
