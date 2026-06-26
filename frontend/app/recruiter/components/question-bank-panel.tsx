'use client';
import * as tw from '@/lib/tailwindClasses'

import React, { useState, useEffect } from 'react';
import { useRecruiterStore } from '../store';
import { QuestionItem, Job } from '../types';
import { 
  Sparkles, Search, Copy, Check, FileDown, RefreshCcw, 
  HelpCircle, ChevronRight, AlertCircle, BookOpen, Layers, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const QuestionBankPanel: React.FC = () => {
  const { 
    jobs, 
    activeQuestionBank, 
    fetchQuestionBank, 
    generateQuestions, 
    regenerateQuestions 
  } = useRecruiterStore();

  const [selectedJobTitle, setSelectedJobTitle] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize selected job if list is present
  useEffect(() => {
    const activeJobs = jobs.filter(j => j.status === 'Active');
    if (activeJobs.length > 0 && !selectedJobTitle) {
      setSelectedJobTitle(activeJobs[0].title);
    }
  }, [jobs]);

  // Fetch question bank when selected job changes
  useEffect(() => {
    if (selectedJobTitle) {
      setIsLoading(true);
      fetchQuestionBank(selectedJobTitle).finally(() => {
        setIsLoading(false);
      });
    }
  }, [selectedJobTitle]);

  const handleGenerate = async () => {
    if (!selectedJobTitle) return;
    setIsLoading(true);
    try {
      await generateQuestions(selectedJobTitle);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!selectedJobTitle) return;
    if (window.confirm(`Are you sure you want to regenerate AI screening questions for "${selectedJobTitle}"? This will overwrite the existing bank.`)) {
      setIsLoading(true);
      try {
        await regenerateQuestions(selectedJobTitle);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to escape HTML characters for PDF printing
  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const handleExportPDF = () => {
    if (!activeQuestionBank) return;

    const printWindow = window.open('', '_blank', 'width=850,height=900');
    if (!printWindow) {
      alert('Please allow popups to export the PDF.');
      return;
    }

    const categories = ['Easy', 'Medium', 'Hard', 'Scenario', 'Behavioral'];
    const questionsByCategory = categories.reduce((acc, cat) => {
      acc[cat] = activeQuestionBank.questions.filter(q => q.category === cat);
      return acc;
    }, {} as Record<string, QuestionItem[]>);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Interview Question Bank - ${activeQuestionBank.jobTitle}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #1e293b;
            line-height: 1.6;
            margin: 40px;
          }
          .header {
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .header-left {
            flex: 1;
          }
          .logo {
            font-family: 'Outfit', sans-serif;
            font-size: 22px;
            font-weight: 800;
            color: #2563eb;
            margin-bottom: 6px;
            letter-spacing: -0.02em;
          }
          .title {
            font-size: 20px;
            font-weight: 800;
            margin: 0;
            color: #0f172a;
            letter-spacing: -0.01em;
          }
          .meta {
            font-size: 11px;
            color: #64748b;
            font-weight: 600;
            margin-top: 6px;
          }
          .category-section {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          .category-title {
            font-size: 13px;
            font-weight: 800;
            color: #2563eb;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            border-bottom: 1.5px solid #e2e8f0;
            padding-bottom: 6px;
            margin-bottom: 14px;
          }
          .question-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .question-item {
            padding: 12px 0;
            border-bottom: 1px solid #f8fafc;
            font-size: 13px;
            font-weight: 650;
            display: flex;
            gap: 12px;
          }
          .question-num {
            font-weight: 800;
            color: #94a3b8;
            min-width: 22px;
          }
          .question-text {
            color: #334155;
            flex: 1;
          }
          @media print {
            body {
              margin: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-left">
            <div class="logo">SelectAI</div>
            <h1 class="title">Interview Question Bank</h1>
            <div class="meta">Role: ${activeQuestionBank.jobTitle} &nbsp;|&nbsp; Total Questions: ${activeQuestionBank.questions.length} &nbsp;|&nbsp; Generated: ${new Date(activeQuestionBank.createdAt || Date.now()).toLocaleDateString()}</div>
          </div>
        </div>

        ${categories.map(cat => {
          const list = questionsByCategory[cat] || [];
          if (list.length === 0) return '';
          return `
            <div class="category-section">
              <div class="category-title">${cat === 'Scenario' ? 'Scenario-Based' : cat} Questions (${list.length})</div>
              <ul class="question-list">
                ${list.map((q, idx) => `
                  <li class="question-item">
                    <span class="question-num">${idx + 1}.</span>
                    <span class="question-text">${escapeHtml(q.text)}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          `;
        }).join('')}
        
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Categories mapping
  const CATEGORIES = ['All', 'Easy', 'Medium', 'Hard', 'Scenario', 'Behavioral'];

  const getCategoryColor = (cat: QuestionItem['category']) => {
    switch (cat) {
      case 'Easy': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-450 dark:border-emerald-900/60';
      case 'Medium': return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/30 dark:text-amber-450 dark:border-amber-900/60';
      case 'Hard': return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/30 dark:text-rose-450 dark:border-rose-900/60';
      case 'Scenario': return 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-450 dark:border-indigo-900/60';
      default: return 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/30 dark:text-purple-450 dark:border-purple-900/60';
    }
  };

  // Filter questions list
  const filteredQuestions = activeQuestionBank
    ? activeQuestionBank.questions.filter(q => {
        const matchesCategory = activeCategory === 'All' || q.category === activeCategory;
        const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      })
    : [];

  const activeJobs = jobs.filter(j => j.status === 'Active');

  return (
    <div className="space-y-6">
      
      {/* 1. Header Grid */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5.5 h-5.5 text-blue-500" />
            <span>AI Question Bank</span>
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Instantly generate structured technical, scenario-based, and behavioral interview questions via Google Gemini API.
          </p>
        </div>
      </div>

      {/* 2. Selection & Generating Controls Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100/80 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-stretch md:items-center gap-4">
        
        {/* Dropdown Job Select */}
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-0.5">
            Select Active Job Role
          </label>
          <select
            value={selectedJobTitle}
            onChange={(e) => setSelectedJobTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 dark:bg-slate-950 dark:text-slate-250 font-bold text-xs"
          >
            {activeJobs.length > 0 ? (
              activeJobs.map(job => (
                <option key={job.id} value={job.title}>
                  {job.title} ({job.department})
                </option>
              ))
            ) : (
              <option value="">No Active Job Openings</option>
            )}
          </select>
        </div>

        {/* Generate / Regenerate Controls */}
        <div className="flex items-end gap-3 mt-auto">
          {activeQuestionBank ? (
            <>
              <button
                onClick={handleRegenerate}
                disabled={isLoading || !selectedJobTitle}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 transition-all text-xs font-bold text-slate-650 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 shadow-sm bg-white dark:bg-slate-900 active:scale-[0.98]"
              >
                <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Regenerate AI</span>
              </button>
              <button
                onClick={handleExportPDF}
                disabled={isLoading || !selectedJobTitle}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all text-xs font-bold shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                <FileDown className={tw.iconMd} />
                <span>Export PDF</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={isLoading || !selectedJobTitle}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all text-xs font-bold shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 fill-white/20" />
              <span>Generate Questions</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Generating Loader */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm"
          >
            <div className="relative mb-5 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
              <Sparkles className="w-5 h-5 text-blue-500 absolute animate-pulse" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Generating Screening Guidelines...</h4>
            <p className="text-xs text-slate-450 dark:text-slate-400 mt-1.5 max-w-sm leading-relaxed">
              Google Gemini is modeling 10 Easy, 10 Medium, 10 Hard, 5 Scenario, and 5 Behavioral questions tailored for the "{selectedJobTitle}" candidate pipeline.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Filter & Display Panel */}
      {!isLoading && activeQuestionBank && (
        <div className="space-y-5">
          
          {/* Search and Category Filter Row */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100/85 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Tabs for Category selection */}
            <div className="flex bg-slate-55 dark:bg-slate-950 p-0.5 rounded-xl border border-slate-150 dark:border-slate-800 text-[11px] font-bold text-slate-500 flex-wrap gap-0.5">
              {CATEGORIES.map(cat => {
                const count = cat === 'All' 
                  ? activeQuestionBank.questions.length
                  : activeQuestionBank.questions.filter(q => q.category === cat).length;
                
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                      activeCategory === cat 
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                        : 'hover:text-slate-850 dark:hover:text-slate-350'
                    }`}
                  >
                    <span>{cat === 'Scenario' ? 'Scenario-Based' : cat}</span>
                    <span className={`text-[9px] px-1 rounded ${
                      activeCategory === cat ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-900 text-slate-450'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450 dark:text-slate-500" />
              <input 
                type="text"
                placeholder="Search generated questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 focus:bg-white dark:bg-slate-950 dark:text-slate-250"
              />
            </div>

          </div>

          {/* Questions List Grid */}
          <div className="grid grid-cols-1 gap-4">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((q, idx) => {
                const globalIndex = activeQuestionBank.questions.findIndex(item => item.text === q.text);
                const isCopied = copiedId === globalIndex;

                return (
                  <div 
                    key={globalIndex}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100/80 dark:border-slate-850 shadow-[0_2px_12px_rgba(0,0,0,0.015)] hover:shadow-md transition-all flex justify-between items-start gap-4"
                  >
                    <div className="space-y-3 flex-1 min-w-0">
                      <div className={tw.flexItemsGap2}>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded">
                          Question #{globalIndex + 1}
                        </span>
                        <span className={`text-[9px] font-extrabold uppercase tracking-wider border px-2 py-0.5 rounded-full ${getCategoryColor(q.category)}`}>
                          {q.category === 'Scenario' ? 'Scenario-Based' : q.category}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-750 dark:text-slate-200 leading-relaxed">
                        {q.text}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopy(q.text, globalIndex)}
                      className={`p-2 rounded-xl border border-slate-150 dark:border-slate-800 shadow-sm flex items-center justify-center transition-all ${
                        isCopied 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-900' 
                          : 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-450 hover:text-slate-850'
                      }`}
                      title="Copy question text to clipboard"
                    >
                      {isCopied ? <Check className={tw.iconLg} /> : <Copy className={tw.iconLg} />}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-250">No questions match filters</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
                  Try clearing your search query or selecting a different difficulty filter category tab.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 5. Missing / Closed Job State Fallback */}
      {!isLoading && !activeQuestionBank && (
        <div className="py-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-8 shadow-sm">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-100 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 mb-4 animate-bounce">
            <Sparkles className="w-8 h-8 fill-blue-100 dark:fill-none" />
          </div>
          <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200">
            Generate Interview Guidelines
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-400 mt-1 max-w-sm leading-relaxed font-semibold">
            No questions have been modeled for "{selectedJobTitle}" yet. Select generate above to automatically compile standard, scenario-based and behavioral categories.
          </p>
          <button
            onClick={handleGenerate}
            disabled={!selectedJobTitle}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs mt-6 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 fill-white/10" />
            <span>Generate 40 Questions</span>
          </button>
        </div>
      )}

    </div>
  );
};
