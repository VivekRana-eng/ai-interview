'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowUp, Briefcase, Building2, Check, ChevronRight, HelpCircle, MapPin, MoreVertical, Pencil, Plus, RotateCcw, Sparkles, Trash2, X } from 'lucide-react';
import { useRecruiterStore } from '../store';
import { Job } from '../types';

const getStatusStyle = (status: Job['status']) => {
  switch (status) {
    case 'Active':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Draft':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'Hold':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Closed':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

const buildQuestionsForJob = (job: Job) => {
  const department = job.department || 'the team';
  const experience = job.experience || 'the required experience';
  const skills = job.skillsRequired?.length ? job.skillsRequired.slice(0, 3).join(', ') : 'the core skills';
  const descriptionSnippet = job.description ? `${job.description.split('.').slice(0, 2).join('.')}...` : '';
  const existingQuestions = (job.aiQuestions || []).filter(Boolean);

  const generatedQuestions = [
    `Which of these skills have you used in production: ${skills}?`,
    `Describe a project where you handled responsibilities similar to this position.`,
    `How would you collaborate with other teams while contributing to ${department}?`,
    `Based on this job posting, how do you approach work requiring ${experience}?`,
    `How do you manage shifting priorities and deadlines in a fast-paced ${department.toLowerCase()} environment?`,
    `What experience do you have that matches the core responsibilities described here?`,
    `How do you prepare to learn new skills quickly when the project demands change?`,
    `How do you ensure strong communication and alignment with stakeholders during a busy hiring cycle?`
  ];

  return Array.from(new Set([...existingQuestions, ...generatedQuestions])).slice(0, 8);
};

const EXTRA_QUESTIONS_POOL: Record<string, string[]> = {
  ai: [
    "How do you handle class imbalance in training datasets for deep learning models?",
    "Explain the concept of gradient vanishing and how architectures like ResNet mitigate it.",
    "What is your approach to hyperparameter tuning for large-scale transformer models?",
    "How do you evaluate the bias and fairness of a trained AI model before deployment?",
    "Describe your experience with distributed training across multiple GPUs/TPUs.",
    "What are the trade-offs between using a pre-trained model vs. training from scratch?",
    "How do you optimize deep learning models for edge devices or low-latency inference?",
    "Explain the attention mechanism in Transformers and how it differs from self-attention.",
    "How do you handle overfitting in models with a small amount of training data?",
    "Describe a time when you had to debug a model that was not converging."
  ],
  web: [
    "How do you optimize frontend performance for web applications with large datasets?",
    "Explain the difference between SQL and NoSQL databases, and when you would choose each.",
    "How do you implement secure authentication and authorization (e.g., JWT, OAuth) in a distributed system?",
    "Describe your experience with CI/CD pipelines and automated deployment strategies.",
    "How do you design RESTful or GraphQL APIs to be resilient and backward-compatible?",
    "What is your approach to state management in large-scale React applications?",
    "Explain how web sockets work and when you would use them over HTTP polling.",
    "How do you ensure web accessibility (WCAG compliance) in your frontend designs?",
    "Describe your strategy for database migrations in a production environment with zero downtime.",
    "How do you handle cross-origin resource sharing (CORS) issues in a web application."
  ],
  security: [
    "How do you perform threat modeling for a newly designed cloud-native application?",
    "Describe your experience with secrets management in Kubernetes (e.g., HashiCorp Vault).",
    "How do you handle a suspected security breach or data leak in a production environment?",
    "What is your approach to implementing Zero Trust architecture across enterprise networks?",
    "Explain how you integrate static and dynamic application security testing (SAST/DAST) into CI/CD.",
    "What are the primary differences between symmetric and asymmetric encryption, and where is each used?",
    "How do you protect a web application against SQL injection and Cross-Site Scripting (XSS)?",
    "Describe your experience with penetration testing tools and methodologies.",
    "How do you configure and monitor firewalls and intrusion detection systems (IDS)?",
    "What is the role of IAM policies in securing cloud infrastructure, and how do you enforce least privilege?"
  ],
  pm: [
    "How do you define and track key performance indicators (KPIs) for a newly launched AI feature?",
    "Describe a situation where you had to say 'no' to an important stakeholder's feature request.",
    "How do you conduct user research to validate a product hypothesis before engineering begins?",
    "What is your strategy for managing product debt versus building new feature sets?",
    "How do you collaborate with engineering teams to translate high-level product vision into technical user stories?",
    "How do you handle a product launch that did not meet its initial success metrics?",
    "What methodologies do you use for competitor analysis and market research?",
    "Describe how you manage and prioritize a product backlog with competing priorities.",
    "How do you balance short-term business goals with long-term product vision?",
    "Explain how you gather and analyze qualitative and quantitative feedback from users."
  ],
  qa: [
    "How do you design a test automation framework from scratch for a microservices architecture?",
    "Describe your approach to load testing and stress testing high-traffic APIs.",
    "How do you handle flaky tests in your automated CI/CD pipeline?",
    "What is your strategy for regression testing when major architectural changes are deployed?",
    "Explain the difference between integration testing and end-to-end testing, and their relative trade-offs.",
    "How do you write test cases for non-functional requirements like security and usability?",
    "Describe your experience with bug tracking systems and how you prioritize defect fixes.",
    "How do you perform exploratory testing, and what value does it add to automated testing?",
    "What is your approach to testing mobile applications across different devices and OS versions?",
    "Explain how you collaborate with developers to ensure testability of code early in the lifecycle."
  ],
  data: [
    "How do you design a scalable ETL pipeline to handle streaming data in real-time?",
    "Explain how you ensure data quality and consistency across a distributed data warehouse.",
    "What are the key considerations when choosing between batch processing and stream processing?",
    "How do you optimize slow-running SQL queries on large-scale datasets?",
    "Describe your experience with data orchestration tools like Apache Airflow or Prefect.",
    "What is the difference between a data lake and a data warehouse, and when do you use which?",
    "How do you handle schema evolution in a data pipeline?",
    "Describe your experience with data storage formats like Parquet or ORC.",
    "How do you implement data governance and access control in a data platform?",
    "Explain how you monitor data pipeline health and set up alerting for failures."
  ],
  generic: [
    "What are the most critical performance bottlenecks you typically encounter in your projects?",
    "How do you approach mentoring junior team members or sharing technical knowledge?",
    "Describe a time when you had to make an important technical decision with limited information.",
    "How do you balance technical debt with the need to deliver features quickly?",
    "What is your preferred workflow for code reviews, and what specific aspects do you focus on?",
    "How do you handle conflict or differing opinions within a project team?",
    "Describe a project that failed or did not go as planned. What did you learn from it?",
    "How do you manage your time and prioritize tasks when working on multiple projects simultaneously?",
    "What is your approach to learning a new technology or domain quickly?",
    "How do you ensure effective communication when working in a remote or hybrid team environment?"
  ]
};

const getPoolKey = (title: string): string => {
  const t = title.toLowerCase();
  if (t.includes('machine learning') || t.includes('ai') || t.includes('ml')) return 'ai';
  if (t.includes('full stack') || t.includes('web') || t.includes('software') || t.includes('frontend') || t.includes('developer')) return 'web';
  if (t.includes('security') || t.includes('devsecops')) return 'security';
  if (t.includes('product manager') || t.includes('pm')) return 'pm';
  if (t.includes('qa') || t.includes('test')) return 'qa';
  if (t.includes('data')) return 'data';
  return 'generic';
};

interface QuestionObject {
  text: string;
  origin: 'ai' | 'manual';
}

export const QuestionBankPanel: React.FC = () => {
  const { jobs } = useRecruiterStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [jobQuestions, setJobQuestions] = useState<Record<string, QuestionObject[]>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customQuestionText, setCustomQuestionText] = useState('');
  
  // Header Actions 3-dot dropdown menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Global edit mode toggle
  const [isEditMode, setIsEditMode] = useState(false);

  // Mobile state: 'list' or 'detail'
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  // Edit state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const visibleJobs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return jobs.filter((job) => {
      if (!term) return true;
      return (
        job.title.toLowerCase().includes(term) ||
        job.department.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term)
      );
    });
  }, [jobs, searchTerm]);

  useEffect(() => {
    if (!jobs.length) {
      setSelectedJobId('');
      return;
    }

    const stillExists = jobs.some((job) => job.id === selectedJobId);
    if (!selectedJobId || !stillExists) {
      const preferred = jobs.find((job) => job.status === 'Active') ?? jobs[0];
      setSelectedJobId(preferred.id);
    }
  }, [jobs, selectedJobId]);

  const handleJobSelect = (id: string) => {
    setSelectedJobId(id);
    setMobileView('detail');
  };

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) ?? null,
    [jobs, selectedJobId]
  );

  const questions = useMemo(() => {
    if (!selectedJob) return [];
    if (!jobQuestions[selectedJob.id]) {
      return buildQuestionsForJob(selectedJob).map(text => ({ text, origin: 'ai' as const }));
    }
    return jobQuestions[selectedJob.id];
  }, [selectedJob, jobQuestions]);

  useEffect(() => {
    // Debug logs to help identify why UI might be empty — remove in production
    // eslint-disable-next-line no-console
    console.log('QuestionBank selectedJob:', selectedJob);
    // eslint-disable-next-line no-console
    console.log('QuestionBank questions (count):', questions.length, questions);
  }, [selectedJob, questions]);

  // Click-outside dropdown handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.header-menu-container')) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleGenerateMore = () => {
    if (isGenerating || !selectedJob) return;

    setIsGenerating(true);

    // Simulate AI generation delay for realistic, premium UX
    setTimeout(() => {
      const poolKey = getPoolKey(selectedJob.title);
      const pool = EXTRA_QUESTIONS_POOL[poolKey];
      const genericPool = EXTRA_QUESTIONS_POOL.generic;

      const current = jobQuestions[selectedJob.id] || buildQuestionsForJob(selectedJob).map(text => ({ text, origin: 'ai' as const }));
      const currentTexts = current.map(q => q.text);

      // Find questions from the pool that are not already in the list
      let newQs = pool.filter(q => !currentTexts.includes(q));
      
      // If we don't have enough in the specific pool, fill with generic questions
      if (newQs.length < 5) {
        const extraGeneric = genericPool.filter(q => !currentTexts.includes(q) && !newQs.includes(q));
        newQs = [...newQs, ...extraGeneric];
      }

      // Take exactly 5
      const selectedNewQs = newQs.slice(0, 5).map(text => ({ text, origin: 'ai' as const }));

      setJobQuestions(prev => {
        return {
          ...prev,
          [selectedJob.id]: [...current, ...selectedNewQs]
        };
      });

      setIsGenerating(false);
    }, 1200);
  };

  const handleRegenerate = () => {
    if (isGenerating || !selectedJob) return;

    setIsGenerating(true);

    // Generate a randomized fresh set of AI questions from the pool while preserving manual questions
    setTimeout(() => {
      setJobQuestions(prev => {
        const current = prev[selectedJob.id] || buildQuestionsForJob(selectedJob).map(text => ({ text, origin: 'ai' as const }));
        
        // Preserve manual questions
        const manualQs = current.filter(q => q.origin === 'manual');

        // Fetch category & generic pools and combine them
        const poolKey = getPoolKey(selectedJob.title);
        const categoryPool = EXTRA_QUESTIONS_POOL[poolKey] || [];
        const genericPool = EXTRA_QUESTIONS_POOL.generic || [];
        const combinedPool = Array.from(new Set([...categoryPool, ...genericPool]));

        // Shuffle the pool and select 8 questions
        const shuffled = [...combinedPool].sort(() => 0.5 - Math.random());
        const newAiQs = shuffled.slice(0, 8).map(text => ({ text, origin: 'ai' as const }));

        return {
          ...prev,
          [selectedJob.id]: [...newAiQs, ...manualQs]
        };
      });
      setIsGenerating(false);
      setEditingIndex(null);
    }, 1000);
  };

  const handleAddCustomQuestion = () => {
    if (!customQuestionText.trim() || !selectedJob) return;

    const newQuestion = { text: customQuestionText.trim(), origin: 'manual' as const };
    setJobQuestions(prev => {
      const current = prev[selectedJob.id] || buildQuestionsForJob(selectedJob).map(text => ({ text, origin: 'ai' as const }));
      return {
        ...prev,
        [selectedJob.id]: [...current, newQuestion]
      };
    });

    setCustomQuestionText('');
    setIsAddingCustom(false);
  };

  const handleDeleteQuestion = (indexToDelete: number) => {
    if (!selectedJob) return;

    setJobQuestions(prev => {
      const current = prev[selectedJob.id] || buildQuestionsForJob(selectedJob).map(text => ({ text, origin: 'ai' as const }));
      return {
        ...prev,
        [selectedJob.id]: current.filter((_, index) => index !== indexToDelete)
      };
    });

    // Reset editing index if the currently edited item was deleted
    if (editingIndex === indexToDelete) {
      setEditingIndex(null);
    } else if (editingIndex !== null && editingIndex > indexToDelete) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const handleSaveEdit = (indexToEdit: number) => {
    if (!editingText.trim() || !selectedJob) return;

    setJobQuestions(prev => {
      const current = prev[selectedJob.id] || buildQuestionsForJob(selectedJob).map(text => ({ text, origin: 'ai' as const }));
      return {
        ...prev,
        [selectedJob.id]: current.map((q, index) => index === indexToEdit ? { ...q, text: editingText.trim() } : q)
      };
    });

    setEditingIndex(null);
    setEditingText('');
  };

  const handleMoveUp = (index: number) => {
    if (index === 0 || !selectedJob) return;

    setJobQuestions(prev => {
      const current = [...(prev[selectedJob.id] || buildQuestionsForJob(selectedJob).map(text => ({ text, origin: 'ai' as const })))];
      const temp = current[index];
      current[index] = current[index - 1];
      current[index - 1] = temp;
      return {
        ...prev,
        [selectedJob.id]: current
      };
    });

    if (editingIndex === index) {
      setEditingIndex(index - 1);
    } else if (editingIndex === index - 1) {
      setEditingIndex(index);
    }
  };

  const handleMoveDown = (index: number) => {
    if (!selectedJob) return;

    setJobQuestions(prev => {
      const current = [...(prev[selectedJob.id] || buildQuestionsForJob(selectedJob).map(text => ({ text, origin: 'ai' as const })))];
      if (index === current.length - 1) return prev;
      
      const temp = current[index];
      current[index] = current[index + 1];
      current[index + 1] = temp;
      return {
        ...prev,
        [selectedJob.id]: current
      };
    });

    if (editingIndex === index) {
      setEditingIndex(index + 1);
    } else if (editingIndex === index + 1) {
      setEditingIndex(index);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 flex-1 h-full flex flex-col min-h-0">
      <div className="flex items-center gap-3">
        {mobileView === 'detail' && (
          <button
            onClick={() => setMobileView('list')}
            className="xl:hidden p-2 -ml-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
            title="Back to jobs"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
        )}
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
          Question Bank
        </h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[340px_minmax(0,1fr)] gap-6 items-start flex-1 min-h-0 overflow-hidden">
        <div className={`rounded-[24px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] p-4 md:p-5 h-full flex flex-col min-h-0 ${mobileView === 'detail' ? 'hidden xl:flex' : 'flex'}`}>
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Jobs</h3>
              <p className="text-xs text-slate-500 font-medium">
                Click any job to load its question set.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search job title, department, location"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
            />
          </div>

          <div className="mt-4 space-y-3 flex-1 min-h-0 overflow-y-auto pr-1">
            {visibleJobs.length > 0 ? (
              visibleJobs.map((job) => {
                const isSelected = job.id === selectedJobId;
                return (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => handleJobSelect(job.id)}
                    className={`w-full text-left rounded-2xl border p-4 transition-all ${
                      isSelected
                        ? 'border-blue-300 bg-blue-50/60 shadow-[0_8px_20px_rgba(37,99,235,0.08)]'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-[0_8px_20px_rgba(15,23,42,0.04)]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${getStatusStyle(job.status)}`}>
                            {job.status}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                            {job.department}
                          </span>
                        </div>
                        <div className="mt-2 text-sm font-extrabold text-slate-900 leading-snug">
                          {job.title}
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-xs font-medium text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {job.location || 'Location not set'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 mt-1 ${isSelected ? 'text-blue-600' : 'text-slate-300'}`} />
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
                <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="mt-3 text-sm font-semibold text-slate-700">No jobs match your search</p>
                <p className="mt-1 text-xs text-slate-500">Clear the search to see all available jobs.</p>
              </div>
            )}
          </div>
        </div>

        <div className={`rounded-[24px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] p-4 md:p-6 h-full overflow-hidden flex flex-col min-h-0 ${mobileView === 'list' ? 'hidden xl:flex' : 'flex'}`}>
          <AnimatePresence mode="wait">
            {selectedJob ? (
              <motion.div
                key={selectedJob.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.22 }}
                className="h-full min-h-0 flex flex-col overflow-hidden"
              >
                {/* Header: Title & Actions (Sticky) */}
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 shrink-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${getStatusStyle(selectedJob.status)}`}>
                          {selectedJob.status}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                          Question Bank
                        </span>
                      </div>
                      <h3 className="mt-3 text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 truncate">
                        {selectedJob.title}
                      </h3>
                    </div>

                    {/* Ellipsis actions menu */}
                    <div className="relative header-menu-container shrink-0 flex items-center gap-3">
                      {isGenerating && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-650 animate-pulse">
                          <div className="w-3.5 h-3.5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                          <span className="text-[10px] font-extrabold uppercase tracking-wider">Generating...</span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setIsMenuOpen(prev => !prev)}
                        disabled={isGenerating}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center transition-all duration-200 shadow-sm active:scale-95 text-slate-600 disabled:opacity-50"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      <AnimatePresence>
                        {isMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-[0_12px_40px_rgba(15,23,42,0.15)] overflow-hidden z-[60] py-1.5"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddingCustom(prev => !prev);
                                setIsMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-left"
                            >
                              <Plus className="w-4 h-4 text-slate-500" />
                              <span>Add Question</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setIsEditMode(prev => !prev);
                                setEditingIndex(null);
                                setIsMenuOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors text-left ${
                                isEditMode 
                                  ? 'text-blue-650 bg-blue-50/50 hover:bg-blue-50' 
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              {isEditMode ? (
                                <>
                                  <Check className="w-4 h-4 text-blue-600" />
                                  <span>Done Editing</span>
                                </>
                              ) : (
                                <>
                                  <Pencil className="w-4 h-4 text-slate-500" />
                                  <span>Edit Questions</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                handleGenerateMore();
                                setIsMenuOpen(false);
                              }}
                              disabled={isGenerating}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 text-left"
                            >
                              <Sparkles className="w-4 h-4 text-slate-500" />
                              <span>Generate More</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                handleRegenerate();
                                setIsMenuOpen(false);
                              }}
                              disabled={isGenerating}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 text-left"
                            >
                              <RotateCcw className="w-4 h-4 text-slate-500" />
                              <span>Regenerate</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Body: Metadata & Questions (Scrollable) */}
                <div className="flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-2 mt-5 space-y-8">
                  {/* Job Detail Snippet */}
                  {selectedJob.description && (
                    <p className="text-xs md:text-sm text-slate-500 font-medium max-w-2xl">
                      {selectedJob.description}
                    </p>
                  )}

                  {/* Metadata Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Department</div>
                      <div className="mt-1 text-sm font-bold text-slate-900 inline-flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        {selectedJob.department}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Location</div>
                      <div className="mt-1 text-sm font-bold text-slate-900 inline-flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {selectedJob.location || 'Not specified'}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Experience</div>
                      <div className="mt-1 text-sm font-bold text-slate-900 inline-flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        {selectedJob.experience || 'Not specified'}
                      </div>
                    </div>
                  </div>

                  {/* Questions Section */}
                  <div className="space-y-4 pb-8">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">AI Generated</h4>
                        <p className="hidden sm:block text-xs text-slate-500 font-medium">
                          Top questions for candidate screening.
                        </p>
                      </div>
                      <div className="text-xs font-bold text-slate-500">
                        {questions.length} total
                      </div>
                    </div>

                    {/* Inline Add Custom Question Form */}
                    <AnimatePresence>
                      {isAddingCustom && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                          animate={{ height: 'auto', opacity: 1, marginBottom: 16 }}
                          exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                          className="overflow-hidden border border-slate-200 rounded-2xl p-4 bg-slate-50/50 flex flex-col sm:flex-row gap-3 items-end"
                        >
                          <div className="flex-1 w-full">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Write your custom question</label>
                            <input
                              type="text"
                              placeholder="Type your question here..."
                              value={customQuestionText}
                              onChange={(e) => setCustomQuestionText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddCustomQuestion();
                              }}
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                              autoFocus
                            />
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto justify-end">
                            <button
                              type="button"
                              onClick={() => setIsAddingCustom(false)}
                              className="rounded-xl border border-slate-200 bg-white hover:bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-600 transition-all active:scale-95"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleAddCustomQuestion}
                              className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white transition-all active:scale-95 shadow-sm"
                            >
                              Add
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-col gap-2.5">
                      <AnimatePresence initial={false}>
                        {questions.map((question, index) => {
                          const isEditing = editingIndex === index;
                          return (
                            <motion.div
                              key={`${selectedJob.id}-${question.text}`}
                              layout
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.8 }}
                              className="group flex items-start justify-between gap-2 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                              <span className="text-sm font-bold text-slate-400 shrink-0 mt-1.5">{index + 1}.</span>
                              
                              {isEditing ? (
                                <div className="flex-1 flex gap-2 items-center">
                                  <input
                                    type="text"
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleSaveEdit(index);
                                      if (e.key === 'Escape') setEditingIndex(null);
                                    }}
                                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                                    autoFocus
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleSaveEdit(index)}
                                    className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors shrink-0"
                                    title="Save"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingIndex(null)}
                                    className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-colors shrink-0"
                                    title="Cancel"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <p className="min-w-0 flex-1 text-sm font-semibold text-slate-800 leading-6 mt-1.5">
                                    {question.text}
                                  </p>
                                  
                                  {isEditMode ? (
                                    <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 bg-white shadow-sm border border-slate-100 rounded-lg p-0.5 animate-fade-in sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                      <button
                                        type="button"
                                        onClick={() => handleMoveUp(index)}
                                        disabled={index === 0}
                                        className="w-7 h-7 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                                        title="Move Up"
                                      >
                                        <ArrowUp className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleMoveDown(index)}
                                        disabled={index === questions.length - 1}
                                        className="w-7 h-7 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                                        title="Move Down"
                                      >
                                        <ArrowDown className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingIndex(index);
                                          setEditingText(question.text);
                                        }}
                                        className="w-7 h-7 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-all"
                                        title="Edit"
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteQuestion(index)}
                                        className="w-7 h-7 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-all"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                      <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.16em] whitespace-nowrap mt-2 px-2.5 py-1 rounded-full border ${
                                        question.origin === 'ai' 
                                          ? 'bg-blue-50 text-blue-700 border-blue-100' 
                                          : 'bg-emerald-50 text-emerald-700 border-emerald-250'
                                      }`}>
                                        {question.origin === 'ai' ? 'AI' : 'Manual'}
                                      </span>
                                  )}
                                </>
                              )}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full min-h-0 flex items-center justify-center text-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50/60 px-8"
              >
                <div className="max-w-md">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h3 className="mt-5 text-xl font-extrabold text-slate-900">Select a job to begin</h3>
                  <p className="mt-2 text-sm text-slate-500 font-medium">
                    Job select karte hi right side par AI-generated screening questions show ho jayengi.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
