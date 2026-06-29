'use client';

import React, { useState } from 'react';
import { Candidate } from '../types';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
}

export const DossierModal: React.FC<DossierModalProps> = ({
  isOpen,
  onClose,
  candidate
}) => {
  const [activeTab, setActiveTab] = useState<'background' | 'questions'>('background');
  const [selectedBgIdx, setSelectedBgIdx] = useState(0);
  const [selectedQaIdx, setSelectedQaIdx] = useState(0);

  if (!candidate) return null;

  const milestones: any[] = [];
  if (candidate.workExperienceDetails) {
    candidate.workExperienceDetails.forEach(w => {
      milestones.push({ type: 'Work Experience', title: w.company, subtitle: w.role, meta: w.duration, bullets: w.description });
    });
  }

  const qaList = candidate.interviewPerformance?.qaList || [];
  const activeBgItem = milestones[selectedBgIdx] || milestones[0];
  const activeQaItem = qaList[selectedQaIdx] || qaList[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} className="relative w-full max-w-5xl h-[80vh] bg-[#fafbfd] border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col">
            
            <div className="p-6 bg-white border-b border-slate-150 flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-amber-800 text-[10px] tracking-wider font-extrabold uppercase">Under The Layers</span>
                <h2 className="font-serif text-2xl font-bold text-slate-900 leading-none">{candidate.name}</h2>
              </div>
              <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="px-6 bg-white flex gap-6 border-b border-slate-150">
              {['background', 'questions'].map(t => (
                <button 
                  key={t} 
                  onClick={() => { setActiveTab(t as any); setSelectedBgIdx(0); setSelectedQaIdx(0); }} 
                  className={`py-3 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all ${activeTab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  {t === 'background' ? 'Background & Experience' : 'Questions Asked'}
                </button>
              ))}
            </div>

            <div className="flex-1 flex overflow-hidden p-6 gap-6 min-h-0">
              {/* Left Panel */}
              <div className="w-1/3 flex flex-col gap-2 overflow-y-auto pr-2 border-r border-slate-150">
                {activeTab === 'background' ? (
                  milestones.map((m, idx) => (
                    <button key={idx} onClick={() => setSelectedBgIdx(idx)} className={`p-3 text-left border rounded-xl transition-all ${selectedBgIdx === idx ? 'border-l-4 border-l-blue-600 bg-blue-50/30' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
                      <span className="text-[9px] font-bold text-slate-400 block">{m.meta}</span>
                      <h4 className="text-xs font-extrabold text-slate-800 mt-0.5 truncate">{m.title}</h4>
                      <p className="text-[10px] text-slate-450 truncate mt-0.5">{m.subtitle}</p>
                    </button>
                  ))
                ) : (
                  qaList.map((qa, idx) => (
                    <button key={idx} onClick={() => setSelectedQaIdx(idx)} className={`p-3 text-left border rounded-xl transition-all ${selectedQaIdx === idx ? 'border-l-4 border-l-blue-600 bg-blue-50/30' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
                      <span className="text-[9px] font-bold text-slate-400 block">Question {idx + 1}</span>
                      <h4 className="text-xs font-extrabold text-slate-800 mt-0.5 line-clamp-2">{qa.question}</h4>
                    </button>
                  ))
                )}
              </div>

              {/* Right Panel */}
              <div className="flex-1 overflow-y-auto bg-white border border-slate-150 rounded-xl p-5 flex flex-col gap-4">
                {activeTab === 'background' && activeBgItem ? (
                  <>
                    <div className="border-b pb-2 border-slate-100">
                      <span className="text-[9px] font-bold text-amber-700 uppercase tracking-widest block">{activeBgItem.type}</span>
                      <h3 className="text-sm font-bold text-slate-900 mt-0.5">{activeBgItem.title}</h3>
                      <p className="text-[10px] text-slate-400">{activeBgItem.meta}</p>
                    </div>
                    <div className="text-xs space-y-3 font-semibold text-slate-600">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">Role</span>
                        <span>{activeBgItem.subtitle}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">Achievements</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-500 mt-1">
                          {activeBgItem.bullets.map((b: string, i: number) => <li key={i}>{b}</li>)}
                        </ul>
                      </div>
                    </div>
                  </>
                ) : activeTab === 'questions' && activeQaItem ? (
                  <>
                    <div className="border-b pb-2 border-slate-100">
                      <span className="text-[9px] font-bold text-blue-600 uppercase block">Interview Question Detail</span>
                      <h3 className="text-xs font-bold text-slate-900 mt-1">{activeQaItem.question}</h3>
                      <span className="inline-block text-[9px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-1.5">Score: {activeQaItem.score}/10</span>
                    </div>
                    <div className="text-xs space-y-3 font-semibold text-slate-600">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">Answer</span>
                        <p className="italic text-slate-550">"{activeQaItem.answer}"</p>
                      </div>
                      <div className="p-3 bg-blue-50/20 border border-blue-100 rounded-lg">
                        <span className="text-[9px] text-blue-600 block uppercase font-bold">AI Assessment</span>
                        <p className="text-slate-600 mt-0.5">{activeQaItem.aiEvaluation}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-slate-400">Select an item from the list to view details.</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
