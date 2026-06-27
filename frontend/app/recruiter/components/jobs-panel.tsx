'use client';
import * as tw from '@/lib/tailwindClasses'

import React, { useState, useEffect } from 'react';
import { useRecruiterStore } from '../store';
import { Job, Candidate } from '../types';
import {
  Plus, Edit2, Trash2, Archive, Users, MapPin, Briefcase,
  DollarSign, Sparkles, X, Check, Search, Building, Clock,
  ChevronRight, AlertCircle, RefreshCcw, Filter, ChevronDown,
  MoreVertical, Sparkle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const JobsPanel: React.FC = () => {
  const {
    jobs,
    candidates,
    addJob,
    updateJob,
    deleteJob,
    initializeStore,
    seedDemoPipeline,
    setIsJobOverlayOpen
  } = useRecruiterStore();

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Draft' | 'Closed' | 'Hold'>('All');

  // Selected Job for Applicants drawer
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Modals States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [activeJobMenuId, setActiveJobMenuId] = useState<string | null>(null);

  // Loading indicator for API calls
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formValues, setFormValues] = useState({
    title: '',
    department: '',
    description: '',
    skillsRequired: '',
    experience: '',
    salaryRange: '',
    location: '',
    employmentType: 'Full-time' as Job['employmentType'],
    role: '',
    aboutJob: '',
    aiQuestions: '',
    lastDateToApply: '',
    joiningType: 'Immediately' as Job['joiningType'],
    joiningDate: '',
    isInternship: false,
    internshipDuration: '',
    qualifications: '',
    status: 'Active' as Job['status']
  });

  // Validation States
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync global overlay state for parent layout blurring
  useEffect(() => {
    setIsJobOverlayOpen(!!selectedJob || isCreateModalOpen || isEditModalOpen);
  }, [selectedJob, isCreateModalOpen, isEditModalOpen, setIsJobOverlayOpen]);

  // Click-outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.job-action-menu-container')) {
        setActiveJobMenuId(null);
      }
    };

    if (activeJobMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeJobMenuId]);

  // Sync edit form values when editingJob changes
  useEffect(() => {
    if (editingJob) {
      setFormValues({
        title: editingJob.title,
        department: editingJob.department,
        description: editingJob.description || '',
        skillsRequired: (editingJob.skillsRequired || []).join(', '),
        experience: editingJob.experience || '',
        salaryRange: editingJob.salaryRange || '',
        location: editingJob.location || '',
        employmentType: editingJob.employmentType || 'Full-time',
        role: editingJob.role || '',
        aboutJob: editingJob.aboutJob || '',
        aiQuestions: (editingJob.aiQuestions || []).join('\n'),
        lastDateToApply: editingJob.lastDateToApply ? new Date(editingJob.lastDateToApply).toISOString().split('T')[0] : '',
        joiningType: editingJob.joiningType || 'Immediately',
        joiningDate: editingJob.joiningDate ? new Date(editingJob.joiningDate).toISOString().split('T')[0] : '',
        isInternship: editingJob.isInternship || false,
        internshipDuration: editingJob.internshipDuration || '',
        qualifications: editingJob.qualifications || '',
        status: editingJob.status || 'Active'
      });
      setErrors({});
    } else {
      setFormValues({
        title: '',
        department: '',
        description: '',
        skillsRequired: '',
        experience: '',
        salaryRange: '',
        location: '',
        employmentType: 'Full-time',
        role: '',
        aboutJob: '',
        aiQuestions: '',
        lastDateToApply: '',
        joiningType: 'Immediately',
        joiningDate: '',
        isInternship: false,
        internshipDuration: '',
        qualifications: '',
        status: 'Active'
      });
      setErrors({});
    }
  }, [editingJob, isCreateModalOpen]);

  // If a job gets updated or deleted, ensure selectedJob is synchronized
  useEffect(() => {
    if (selectedJob) {
      const current = jobs.find(j => j.id === selectedJob.id);
      if (current) {
        setSelectedJob(current);
      } else {
        setSelectedJob(null);
      }
    }
  }, [jobs]);

  // Form Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formValues.title.trim()) newErrors.title = 'Job title is required';
    if (!formValues.department.trim()) newErrors.department = 'Department is required';
    if (!formValues.description.trim()) newErrors.description = 'Job description is required';
    if (!formValues.skillsRequired.trim()) newErrors.skillsRequired = 'Skills required are required';
    if (!formValues.experience.trim()) newErrors.experience = 'Experience level is required';
    if (!formValues.salaryRange.trim()) newErrors.salaryRange = 'Salary range is required';
    if (!formValues.location.trim()) newErrors.location = 'Location details are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handlers
  const submitJobForm = async (status: Job['status']) => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const skills = formValues.skillsRequired
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const questions = formValues.aiQuestions
        .split('\n')
        .map(q => q.trim())
        .filter(q => q.length > 0);

      await addJob({
        title: formValues.title,
        department: formValues.department,
        description: formValues.description,
        skillsRequired: skills,
        experience: formValues.experience,
        salaryRange: formValues.salaryRange,
        location: formValues.location,
        employmentType: formValues.employmentType,
        role: formValues.role,
        aboutJob: formValues.aboutJob,
        status,
        lastDateToApply: formValues.lastDateToApply,
        joiningType: formValues.joiningType,
        joiningDate: formValues.joiningDate,
        isInternship: formValues.isInternship,
        internshipDuration: formValues.isInternship ? formValues.internshipDuration : '',
        qualifications: formValues.qualifications,
        ...(questions.length > 0 ? { aiQuestions: questions } : {})
      });

      setIsCreateModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitJobForm('Active');
  };

  const handleUpdateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const skills = formValues.skillsRequired
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const questions = formValues.aiQuestions
        .split('\n')
        .map(q => q.trim())
        .filter(q => q.length > 0);

      await updateJob(editingJob.id, {
        title: formValues.title,
        department: formValues.department,
        description: formValues.description,
        skillsRequired: skills,
        experience: formValues.experience,
        salaryRange: formValues.salaryRange,
        location: formValues.location,
        employmentType: formValues.employmentType,
        role: formValues.role,
        aboutJob: formValues.aboutJob,
        aiQuestions: questions,
        lastDateToApply: formValues.lastDateToApply,
        joiningType: formValues.joiningType,
        joiningDate: formValues.joiningDate,
        isInternship: formValues.isInternship,
        internshipDuration: formValues.isInternship ? formValues.internshipDuration : '',
        qualifications: formValues.qualifications
      });

      setIsEditModalOpen(false);
      setEditingJob(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetStatus = async (job: Job, nextStatus: Job['status']) => {
    try {
      await updateJob(job.id, { status: nextStatus });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this job opening? Candidates linked to this role will have their position unlinked.')) {
      try {
        await deleteJob(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleResetData = async () => {
    if (window.confirm('This will restore the database to the initial set of 5 sample jobs, resetting all custom items. Continue?')) {
      try {
        await seedDemoPipeline();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Filtered Jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.description || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Find matching applicants for selected job
  const matchingApplicants = selectedJob
    ? candidates.filter(c => c.position && c.position.toLowerCase() === selectedJob.title.toLowerCase())
    : [];

  const getStatusBadge = (status: Job['status']) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-extrabold uppercase tracking-[0.14em] bg-emerald-500/10 text-emerald-600 border border-emerald-300/40 ring-1 ring-white/50 shadow-[0_4px_14px_rgba(16,185,129,0.08)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)] animate-pulse" />
            Active
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-extrabold uppercase tracking-[0.14em] bg-slate-500/10 text-slate-600 border border-slate-300/40 ring-1 ring-white/50 shadow-[0_4px_14px_rgba(148,163,184,0.08)]">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shadow-[0_0_0_4px_rgba(148,163,184,0.12)]" />
            Draft
          </span>
        );
      case 'Hold':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-extrabold uppercase tracking-[0.14em] bg-amber-500/10 text-amber-600 border border-amber-300/40 ring-1 ring-white/50 shadow-[0_4px_14px_rgba(245,158,11,0.08)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.12)] animate-pulse" />
            Hold
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-extrabold uppercase tracking-[0.14em] bg-rose-500/10 text-rose-600 border border-rose-300/40 ring-1 ring-white/50 shadow-[0_4px_14px_rgba(244,63,94,0.08)]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_0_4px_rgba(244,63,94,0.12)]" />
            Closed
          </span>
        );
    }
  };

  const getStageColor = (status: Candidate['status']) => {
    switch (status) {
      case 'Hired': return 'bg-emerald-55 text-emerald-600 border-emerald-250';
      case 'Shortlisted': return 'bg-indigo-50 text-indigo-600 border-indigo-250';
      case 'Interviewing': return 'bg-blue-50 text-blue-600 border-blue-250';
      case 'Screening': return 'bg-amber-50 text-amber-600 border-amber-250';
      default: return 'bg-slate-50 text-slate-600 border-slate-250';
    }
  };

  const handleOpenJobDetails = (job: Job) => {
    setSelectedJob(job);
  };

  const handleCloseJobDetails = () => {
    setSelectedJob(null);
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500 relative">
      <div className={`space-y-6 lg:space-y-8 transition-all duration-300 ${selectedJob ? 'pointer-events-none select-none opacity-60' : ''}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h2 className="text-xl md:text-[22px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              ATS Job Management
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            </h2>
            <p className="text-[11px] font-semibold text-slate-500 leading-relaxed uppercase tracking-wider flex items-center gap-2">
              Active Dashboard
              <ChevronRight className="w-3 h-3" />
              Recruitment Lifecycle
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[11px] font-bold shadow-[0_8px_20px_rgba(37,99,235,0.24)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Create New Job
            </button>
          </div>
        </div>

        {/* 2. Controls Section */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative min-w-[240px] max-w-full md:max-w-[320px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs, descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-slate-700 placeholder:text-slate-400 shadow-[0_4px_12px_rgba(15,23,42,0.04)] transition-all"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border transition-all text-[10px] font-bold min-w-[130px] justify-between shadow-[0_4px_12px_rgba(15,23,42,0.04)] ${statusFilter !== 'All'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Filter className="w-3.5 h-3.5" />
                  <span className="truncate">{statusFilter} Status</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute left-0 mt-1.5 w-56 rounded-xl bg-white border border-slate-100 shadow-[0_8px_24px_rgba(15,23,42,0.08)] p-1 z-50 text-slate-700 max-h-60 overflow-y-auto"
                  >
                    <div className="px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-50">
                      Filter by Status
                    </div>
                    {(['All', 'Active', 'Hold', 'Draft', 'Closed'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-[10px] font-bold transition-colors ${statusFilter === status
                          ? 'bg-blue-50/50 text-blue-650'
                          : 'hover:bg-slate-50'
                          }`}
                      >
                        {status} Jobs
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-start lg:justify-end gap-2 md:gap-3 text-xs font-bold text-slate-400">
            <div className="px-3 py-1.5 rounded-full bg-white border border-slate-100 text-slate-500 shadow-[0_4px_12px_rgba(15,23,42,0.04)]">
              Active: <span className="text-slate-800">{jobs.filter(j => j.status === 'Active').length}</span>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-white border border-slate-100 text-slate-500 shadow-[0_4px_12px_rgba(15,23,42,0.04)]">
              Closed: <span className="text-slate-800">{jobs.filter(j => j.status === 'Closed').length}</span>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 shadow-[0_4px_12px_rgba(59,130,246,0.08)]">
              Total Roles: <span className="text-slate-800">{jobs.length}</span>
            </div>
          </div>
        </div>

        {/* 3. Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-5">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => {
              const isSelected = selectedJob?.id === job.id;

              return (
                <div
                  key={job.id}
                  onClick={() => handleOpenJobDetails(job)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenJobDetails(job);
                    }
                  }}
                  className={`relative p-4 rounded-[15px] bg-white border border-slate-100/80 shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition-all duration-200 flex flex-col gap-3.5 group hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] cursor-pointer h-full ${isSelected
                    ? 'ring-1 ring-blue-500/40 border-blue-200'
                    : ''
                    }`}
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full rounded-l-[15px]" style={{
                    backgroundColor:
                        job.status === 'Active' ? '#3B82F6' :
                        job.status === 'Hold' ? '#F59E0B' :
                          job.status === 'Closed' ? '#EF4444' : '#94A3B8'
                  }} />

                  {/* Card Actions Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 pl-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {job.department}
                        </span>
                        {getStatusBadge(job.status)}
                      </div>
                      <h3 className="text-[15px] font-bold text-slate-800 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                    </div>

                    <div className="relative job-action-menu-container">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveJobMenuId(activeJobMenuId === job.id ? null : job.id);
                        }}
                        className={`p-1.5 rounded-lg transition-all ${activeJobMenuId === job.id ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                          }`}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      <AnimatePresence>
                        {activeJobMenuId === job.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white border border-slate-200 shadow-[0_12px_40px_rgba(15,23,42,0.15)] overflow-hidden z-[60] py-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {job.status === 'Draft' && (
                              <button
                                onClick={() => {
                                  handleSetStatus(job, 'Active');
                                  setActiveJobMenuId(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50 transition-colors"
                              >
                                <Sparkles className="w-4 h-4" />
                                <span>Publish Opening</span>
                              </button>
                            )}

                            {(job.status === 'Active' || job.status === 'Hold') && (
                              <button
                                onClick={() => {
                                  handleSetStatus(job, job.status === 'Hold' ? 'Active' : 'Hold');
                                  setActiveJobMenuId(null);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-colors ${job.status === 'Hold' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-600 hover:bg-amber-50 hover:text-amber-600'
                                  }`}
                              >
                                <Clock className="w-4 h-4" />
                                <span>{job.status === 'Hold' ? 'Resume Opening' : 'Put on Hold'}</span>
                              </button>
                            )}

                            {job.status === 'Active' && (
                              <button
                                onClick={() => {
                                  handleSetStatus(job, 'Closed');
                                  setActiveJobMenuId(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                              >
                                <X className="w-4 h-4" />
                                <span>Close Opening</span>
                              </button>
                            )}

                            {job.status === 'Closed' && (
                              <button
                                onClick={() => {
                                  handleSetStatus(job, 'Active');
                                  setActiveJobMenuId(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                              >
                                <RefreshCcw className="w-4 h-4" />
                                <span>Re-open Role</span>
                              </button>
                            )}

                            <div className="mx-2 my-1 border-t border-slate-100" />

                            <button
                              onClick={() => {
                                setEditingJob(job);
                                setIsEditModalOpen(true);
                                setActiveJobMenuId(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                              <span>Edit Details</span>
                            </button>

                            <button
                              onClick={() => {
                                handleDeleteJob(job.id);
                                setActiveJobMenuId(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete Job</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Stats and metadata grid */}
                  <div className="grid grid-cols-2 gap-2 pl-1">
                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Users className="w-3 h-3" />
                        Applicants
                      </span>
                      <span className="text-sm font-extrabold text-slate-900 leading-none">
                        {job.candidatesCount}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <DollarSign className="w-3 h-3" />
                        Salary Range
                      </span>
                      <span className="text-xs font-bold text-slate-700 leading-none truncate" title={job.salaryRange}>
                        {job.salaryRange}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 flex-1 pl-1">
                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {job.skillsRequired && job.skillsRequired.length > 0 ? (
                        <>
                          {job.skillsRequired.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[9px] font-bold text-slate-500"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skillsRequired.length > 3 && (
                            <span className="text-[9px] font-bold text-slate-400 pt-0.5">
                              +{job.skillsRequired.length - 3} more
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-300 italic">No skills specified</span>
                      )}
                    </div>

                    {/* Screening questions trigger */}
                    <div className="mt-1 pt-3 border-t border-slate-100 space-y-2.5 min-h-[60px]">
                      {job.aiQuestions && job.aiQuestions.length > 0 ? (
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                            Screening Questions ({job.aiQuestions.length})
                          </div>
                          <ul className="space-y-1 text-[11px] font-semibold text-slate-600 list-disc list-inside pl-1.5">
                            {job.aiQuestions.slice(0, 1).map((q, idx) => (
                              <li key={idx} className="truncate leading-relaxed" title={q}>
                                {q}
                              </li>
                            ))}
                            {job.aiQuestions.length > 1 && (
                              <li
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenJobDetails(job);
                                }}
                                className="list-none text-[10px] font-bold text-blue-500 hover:underline cursor-pointer pl-1 mt-0.5"
                              >
                                View all {job.aiQuestions.length} questions...
                              </li>
                            )}
                          </ul>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-300 italic text-[11px] font-medium pl-1">
                          <Sparkles className="w-3.5 h-3.5 text-slate-200" />
                          <span>No custom questions added</span>
                        </div>
                      )}
                    </div>

                    {/* Candidates footer */}
                    <div className="flex items-center justify-between mt-auto pt-3.5 border-t border-slate-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenJobDetails(job);
                        }}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${isSelected
                          ? 'bg-blue-600 text-white shadow-blue-200'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                          }`}
                      >
                        <Users className="w-3.5 h-3.5" />
                        View Applicants
                      </button>
                      <div className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                        Created by {job.createdBy ?? 'Unknown'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center bg-white/50 backdrop-blur-md rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700">No jobs found</h3>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Job Details Overlay */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[50] flex items-center justify-center p-4 lg:p-8"
          >
            <div
              onClick={handleCloseJobDetails}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-[6px]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              transition={{ duration: 0.22 }}
              className="relative w-full max-w-6xl max-h-[88vh] overflow-hidden rounded-[28px] bg-white border border-slate-200 shadow-[0_30px_80px_rgba(15,23,42,0.18)] flex flex-col"
            >
              <div className="p-5 md:p-6 border-b border-white/70 flex flex-col gap-4 md:flex-row md:items-start md:justify-between flex-shrink-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50/80 px-2.5 py-1 rounded-full border border-blue-100/80 backdrop-blur-md uppercase tracking-wider">
                      {selectedJob.department}
                    </span>
                    {getStatusBadge(selectedJob.status)}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-2xl font-extrabold text-slate-900">{selectedJob.title}</h3>
                    <p className="text-xs md:text-sm text-slate-500 font-semibold mt-1 max-w-3xl">
                      {selectedJob.description || 'Job details overview'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetStatus(selectedJob, selectedJob.status === 'Hold' ? 'Active' : 'Hold');
                    }}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all shadow-[0_4px_12px_rgba(15,23,42,0.06)] ${selectedJob.status === 'Hold' ? 'bg-amber-100 border-amber-200 text-amber-600' : 'bg-white/80 border-white/80 text-slate-600 hover:bg-white'}`}
                  >
                    {selectedJob.status === 'Hold' ? 'Resume' : 'Hold'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingJob(selectedJob);
                      setIsEditModalOpen(true);
                      handleCloseJobDetails();
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-[11px] font-extrabold shadow-[0_8px_20px_rgba(37,99,235,0.24)] hover:bg-blue-700 transition-all hover:scale-[1.02]"
                  >
                    Edit Job
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteJob(selectedJob.id);
                      handleCloseJobDetails();
                    }}
                    className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-all"
                  >
                    Delete
                  </button>
                  <button onClick={handleCloseJobDetails} className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)] overflow-y-auto min-h-0 bg-white">
                <div className="p-5 md:p-8 space-y-8">
                  <section className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="text-[15px] font-extrabold text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-4.5 h-4.5 text-blue-500" />
                        Core Details
                      </h4>
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        {selectedJob.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.18em]">Title</div>
                        <div className="text-sm font-semibold text-slate-900">{selectedJob.title}</div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.18em]">Department</div>
                        <div className="text-sm font-semibold text-slate-900">{selectedJob.department}</div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.18em]">Role</div>
                        <div className="text-sm font-semibold text-slate-900">{selectedJob.role || 'Not specified'}</div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.18em]">Location</div>
                        <div className="text-sm font-semibold text-slate-900">{selectedJob.location || 'Not specified'}</div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.18em]">Employment Type</div>
                        <div className="text-sm font-semibold text-slate-900">{selectedJob.employmentType}</div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.18em]">Created By</div>
                        <div className="text-sm font-semibold text-slate-900 truncate">{selectedJob.createdBy ?? 'Unknown'}</div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4 border-t border-slate-100 pt-6">
                    <h4 className="text-[15px] font-extrabold text-slate-900">Hiring Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.18em]">Salary Range</div>
                        <div className="text-sm font-semibold text-slate-900">{selectedJob.salaryRange || 'Not specified'}</div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.18em]">Experience</div>
                        <div className="text-sm font-semibold text-slate-900">{selectedJob.experience || 'Not specified'}</div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.18em]">Apply By</div>
                        <div className="text-sm font-semibold text-slate-900">
                          {selectedJob.lastDateToApply ? new Date(selectedJob.lastDateToApply).toLocaleDateString() : 'Rolling'}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.18em]">Joining</div>
                        <div className="text-sm font-semibold text-slate-900">
                          {selectedJob.joiningType === 'Custom Date' && selectedJob.joiningDate
                            ? new Date(selectedJob.joiningDate).toLocaleDateString()
                            : 'Immediate'}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.18em]">Created On</div>
                        <div className="text-sm font-semibold text-slate-900">
                          {selectedJob.createdAt ? new Date(selectedJob.createdAt).toLocaleDateString() : 'Not specified'}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.18em]">Internship</div>
                        <div className="text-sm font-semibold text-slate-900">
                          {selectedJob.isInternship
                            ? `${selectedJob.internshipDuration || 'N/A'} Months`
                            : 'No'}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-3 border-t border-slate-100 pt-6">
                    <h4 className="text-[15px] font-extrabold text-slate-900">Description</h4>
                    <p className="text-[13px] text-slate-600 leading-7 font-medium max-w-4xl">
                      {selectedJob.description || 'No description provided.'}
                    </p>
                  </section>

                  <section className="space-y-3 border-t border-slate-100 pt-6">
                    <h4 className="text-[15px] font-extrabold text-slate-900">About the Job</h4>
                    <p className="text-[13px] text-slate-600 leading-7 font-medium max-w-4xl">
                      {selectedJob.aboutJob || 'No company or culture summary provided.'}
                    </p>
                  </section>

                  <section className="space-y-4 border-t border-slate-100 pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="text-[15px] font-extrabold text-slate-900">Skills Required</h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">
                        {selectedJob.skillsRequired?.length || 0} skills
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {selectedJob.skillsRequired?.length ? (
                        selectedJob.skillsRequired.map((skill) => (
                          <span key={skill} className="px-3.5 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-700">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">No skills specified for this role.</p>
                      )}
                    </div>
                  </section>

                  <section className="space-y-3 border-t border-slate-100 pt-6">
                    <h4 className="text-[15px] font-extrabold text-slate-900 flex items-center gap-2">
                      <Building className="w-4.5 h-4.5 text-emerald-500" />
                      Qualifications
                    </h4>
                    <p className="text-[13px] text-slate-600 leading-7 font-medium max-w-4xl">
                      {selectedJob.qualifications || 'Standard industry qualifications required for this position.'}
                    </p>
                  </section>

                </div>

                <div className="border-t xl:border-t-0 xl:border-l border-slate-100 bg-slate-50/40 p-5 md:p-8 space-y-8">
                  <section className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="text-[15px] font-extrabold text-slate-900 flex items-center gap-2.5">
                        <Users className="w-5 h-5 text-blue-500" />
                        Matched Applicants
                      </h4>
                      <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-[12px] font-bold shadow-lg">
                        {matchingApplicants.length}
                      </span>
                    </div>
                    <div className="rounded-[24px] border border-dashed border-slate-200 bg-white/70 px-5 py-8 text-center">
                      <Users className="w-11 h-11 text-slate-200 mx-auto" />
                      <h4 className="mt-3 text-sm font-semibold text-slate-700">Screening in Progress</h4>
                      <p className="mt-2 text-[11px] text-slate-500 leading-6 max-w-[240px] mx-auto">
                        Detailed applicant insights will appear here once candidates match the role criteria.
                      </p>
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Modals (Create & Edit) */}
      <AnimatePresence>
        {(isCreateModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); setEditingJob(null); }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-[6px]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-[0_40px_100px_rgba(15,23,42,0.25)] overflow-hidden flex flex-col max-h-[90vh] z-10 font-sans"
            >
              <div className="p-6 md:p-8 border-b border-slate-50 flex justify-between items-center bg-white shrink-0">
                <h3 className="text-lg md:text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
                  <Plus className="w-6 h-6 text-blue-600" />
                  {isCreateModalOpen ? 'Create New Role' : 'Update Job Details'}
                </h3>
                <button
                  onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); setEditingJob(null); }}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <form
                onSubmit={isCreateModalOpen ? handleCreateJob : handleUpdateJob}
                className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-slate-700 bg-white"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold text-slate-900 uppercase tracking-widest">Job Title <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formValues.title}
                      onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 shadow-sm transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="e.g. Lead Designer"
                    />
                    {errors.title && <p className="text-[10px] text-rose-500 font-bold">{errors.title}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold text-slate-900 uppercase tracking-widest">Department <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formValues.department}
                      onChange={(e) => setFormValues({ ...formValues, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 shadow-sm transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="e.g. Design Team"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold text-slate-900 uppercase tracking-widest">Location <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formValues.location}
                      onChange={(e) => setFormValues({ ...formValues, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 shadow-sm transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="e.g. Bengaluru, Remote, Pune"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold text-slate-900 uppercase tracking-widest">Salary Range <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formValues.salaryRange}
                      onChange={(e) => setFormValues({ ...formValues, salaryRange: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 shadow-sm transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="e.g. ₹10,00,000 - ₹14,00,000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold text-slate-900 uppercase tracking-widest">Experience <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formValues.experience}
                      onChange={(e) => setFormValues({ ...formValues, experience: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 shadow-sm transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="e.g. 5+ years"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-900">Employment Type</label>
                    <select
                      value={formValues.employmentType}
                      onChange={(e) => setFormValues({ ...formValues, employmentType: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 shadow-sm transition-all text-slate-400"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  {/* Row 4 */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-900">Joining Timeline</label>
                    <select
                      value={formValues.joiningType}
                      onChange={(e) => setFormValues({ ...formValues, joiningType: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 shadow-sm transition-all text-slate-400"
                    >
                      <option value="Immediately">Immediately</option>
                      <option value="Custom Date">Custom Date</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-900">Last Date to Apply</label>
                    <input
                      type="date"
                      value={formValues.lastDateToApply}
                      onChange={(e) => setFormValues({ ...formValues, lastDateToApply: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 shadow-sm transition-all text-slate-400"
                    />
                  </div>

                  {/* Optional Row 5 */}
                  {formValues.joiningType === 'Custom Date' && (
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-900">Joining Date</label>
                      <input
                        type="date"
                        value={formValues.joiningDate}
                        onChange={(e) => setFormValues({ ...formValues, joiningDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 shadow-sm transition-all text-slate-400"
                      />
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 transition-colors cursor-pointer"
                         onClick={() => setFormValues({ ...formValues, isInternship: !formValues.isInternship })}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formValues.isInternship ? 'translate-x-6' : 'translate-x-1'}`} />
                    </div>
                    <span className="font-bold text-slate-900">Is this an Internship?</span>
                  </div>
                  
                  {formValues.isInternship && (
                    <div className="flex-1 flex items-center gap-3">
                      <label className="font-bold text-slate-900 whitespace-nowrap">Duration (Months):</label>
                      <input
                        type="number"
                        min="1"
                        max="24"
                        value={formValues.internshipDuration}
                        onChange={(e) => setFormValues({ ...formValues, internshipDuration: e.target.value })}
                        className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg bg-white shadow-sm text-slate-900 placeholder:text-slate-400"
                        placeholder="e.g. 6"
                      />
                    </div>
                  )}
                </div>

                {/* 3. Detailed Info */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-900">Role Summary</label>
                  <input
                    type="text"
                    value={formValues.role}
                    onChange={(e) => setFormValues({ ...formValues, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 shadow-sm transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-900">Skills <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formValues.skillsRequired}
                    onChange={(e) => setFormValues({ ...formValues, skillsRequired: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 shadow-sm transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="React, Node.js, etc."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-900">Educational Qualifications</label>
                  <input
                    type="text"
                    value={formValues.qualifications}
                    onChange={(e) => setFormValues({ ...formValues, qualifications: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 shadow-sm transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="e.g. B.Tech in Computer Science, MBA, etc."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-900">Description <span className="text-red-500">*</span></label>
                  <textarea
                    rows={3}
                    value={formValues.description}
                    onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 shadow-sm transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-900">About the Job / Culture</label>
                  <textarea
                    rows={3}
                    value={formValues.aboutJob}
                    onChange={(e) => setFormValues({ ...formValues, aboutJob: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 shadow-sm transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); setEditingJob(null); }}
                    className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  {isCreateModalOpen && (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => submitJobForm('Draft')}
                      className="px-5 py-2.5 border border-amber-200 bg-amber-50 rounded-xl text-amber-700 font-bold hover:bg-amber-100 transition-colors disabled:opacity-60"
                    >
                      Save Draft
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md transition-all active:scale-95"
                  >
                    {isCreateModalOpen ? 'Create Role' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
