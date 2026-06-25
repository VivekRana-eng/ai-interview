'use client';

import React, { useState, useEffect } from 'react';
import { useRecruiterStore } from '../store';
import { Job, Candidate } from '../types';
import { 
  Plus, Edit2, Trash2, Archive, Users, MapPin, Briefcase, 
  DollarSign, Sparkles, X, Check, Search, Building, Clock, 
  ChevronRight, AlertCircle, RefreshCcw
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
    seedDemoPipeline 
  } = useRecruiterStore();

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Draft' | 'Closed'>('All');
  
  // Selected Job for Applicants drawer
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Modals States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

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
    aiQuestions: ''
  });

  // Validation States
  const [errors, setErrors] = useState<Record<string, string>>({});

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
        aiQuestions: (editingJob.aiQuestions || []).join('\n')
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
        aiQuestions: ''
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
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
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
        status: 'Active',
        ...(questions.length > 0 ? { aiQuestions: questions } : {})
      });

      setIsCreateModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
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
        aiQuestions: questions
      });

      setIsEditModalOpen(false);
      setEditingJob(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleArchive = async (job: Job) => {
    try {
      const nextStatus = job.status === 'Closed' ? 'Active' : 'Closed';
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-extrabold uppercase tracking-[0.14em] bg-emerald-500/10 text-emerald-600 border border-emerald-300/40 ring-1 ring-white/50 backdrop-blur-md shadow-[0_4px_14px_rgba(16,185,129,0.08)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)] animate-pulse" />
            Active
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-extrabold uppercase tracking-[0.14em] bg-slate-500/10 text-slate-600 border border-slate-300/40 ring-1 ring-white/50 backdrop-blur-md shadow-[0_4px_14px_rgba(148,163,184,0.08)]">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shadow-[0_0_0_4px_rgba(148,163,184,0.12)]" />
            Draft
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-extrabold uppercase tracking-[0.14em] bg-rose-500/10 text-rose-600 border border-rose-300/40 ring-1 ring-white/50 backdrop-blur-md shadow-[0_4px_14px_rgba(244,63,94,0.08)]">
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
    <div className="space-y-6">
      
      {/* 1. Header Row */}
      <div className="rounded-[28px] bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 px-5 py-5 md:px-6 md:py-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              ATS Job Management
            </h2>
            <p className="mt-2 text-sm md:text-[15px] text-white/70 font-medium leading-relaxed">
              Create, update, archive, and audit active job screening guidelines, AI assistants, and matches.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetData}
              title="Reset to default mock jobs database"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 transition-all text-xs font-bold text-white/80 shadow-sm backdrop-blur"
            >
              <RefreshCcw className="w-4 h-4" />
              <span>Reset Demo</span>
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white transition-all text-xs font-bold shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Create New Job</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Screen Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative min-w-[240px] max-w-full md:max-w-[320px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search jobs, descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs border border-white/70 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white/70 backdrop-blur-md text-slate-700 placeholder:text-slate-400 shadow-[0_4px_12px_rgba(15,23,42,0.04)] focus:bg-white transition-all"
            />
          </div>

          <div className="flex bg-white/65 backdrop-blur-md p-1 rounded-2xl border border-white/70 text-[11px] font-bold text-slate-500 shadow-[0_4px_12px_rgba(15,23,42,0.04)] w-fit">
            {(['All', 'Active', 'Draft', 'Closed'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === status 
                    ? 'bg-white text-blue-600 shadow-sm ring-1 ring-blue-100' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/70'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-start lg:justify-end gap-2 md:gap-3 text-xs font-bold text-slate-400">
          <div className="px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/80 text-slate-500 shadow-[0_4px_12px_rgba(15,23,42,0.04)]">
            Active: <span className="text-slate-800 dark:text-slate-200">{jobs.filter(j => j.status === 'Active').length}</span>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/80 text-slate-500 shadow-[0_4px_12px_rgba(15,23,42,0.04)]">
            Closed: <span className="text-slate-800">{jobs.filter(j => j.status === 'Closed').length}</span>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-blue-50/90 backdrop-blur-md border border-blue-100 text-blue-600 shadow-[0_4px_12px_rgba(59,130,246,0.08)]">
            Total Roles: <span className="text-slate-800">{jobs.length}</span>
          </div>
        </div>
      </div>

      {/* 3. Jobs Grid */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-5 items-start transition-all duration-300 ${selectedJob ? 'blur-sm scale-[0.995] pointer-events-none select-none' : ''}`}>
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
                className={`relative overflow-hidden p-4 rounded-[15px] bg-white border border-slate-100/80 shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition-all duration-200 flex flex-col gap-3.5 group hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] cursor-pointer ${
                  isSelected 
                    ? 'ring-1 ring-blue-500/40 border-blue-200' 
                    : ''
                }`}
              >
                
                {/* Accent bar for Active job */}
                {job.status === 'Active' && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-600" />
                )}

                {/* Job Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wider">
                        {job.department}
                      </span>
                      {getStatusBadge(job.status)}
                    </div>
                    <h3 className="text-[14px] font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors mt-1">
                      {job.title}
                    </h3>
                  </div>

                  {/* CRUD Operations buttons */}
                  <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleArchive(job)}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClickCapture={(e) => e.stopPropagation()}
                      title={job.status === 'Closed' ? 'Re-open job opening' : 'Close/Archive job opening'}
                      className="p-1.5 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all text-slate-450 hover:text-slate-650"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingJob(job);
                        setIsEditModalOpen(true);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClickCapture={(e) => e.stopPropagation()}
                      title="Edit job opening details"
                      className="p-1.5 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all text-slate-450 hover:text-slate-650"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClickCapture={(e) => e.stopPropagation()}
                      title="Delete job opening"
                      className="p-1.5 rounded-lg border border-slate-100 hover:border-red-200 hover:bg-red-50 transition-all text-slate-450 hover:text-red-650"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Job Metadata details */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-[11px] font-bold text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <Briefcase className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{job.employmentType}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <DollarSign className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{job.salaryRange}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{job.experience}</span>
                  </div>
                </div>

                {/* Description snippet */}
                {job.description && (
                  <p className="text-[11px] font-semibold text-slate-500 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                )}

                {/* Skills tags list */}
                {job.skillsRequired && job.skillsRequired.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {job.skillsRequired.slice(0, 4).map(skill => (
                      <span 
                        key={skill} 
                        className="text-[10px] font-bold bg-slate-100 text-slate-650 px-2 py-0.5 rounded border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skillsRequired.length > 4 && (
                      <span className="text-[10px] font-extrabold text-slate-400 pl-1">
                        +{job.skillsRequired.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Screening questions trigger */}
                {job.aiQuestions && job.aiQuestions.length > 0 && (
                  <div className="mt-1 pt-3 border-t border-slate-100 space-y-2.5">
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
                          <li className="list-none text-[10px] font-bold text-blue-500 hover:underline cursor-pointer pl-1 mt-0.5">
                            View all {job.aiQuestions.length} questions...
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Candidates footer */}
                <div className="flex items-center justify-between mt-auto pt-3.5 border-t border-slate-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenJobDetails(job);
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected 
                        ? 'bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>
                      {candidates.filter(c => c.position && c.position.toLowerCase() === job.title.toLowerCase()).length} Applicants
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isSelected ? 'rotate-90' : ''}`} />
                  </button>

                    <span className="text-[10px] text-slate-400 font-bold">
                    Created {job.createdAt ? new Date(job.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'by Sai'}
                  </span>
                </div>
                
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-8">
            <Briefcase className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-3" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No job openings found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
              Try adjusting your search criteria or create a brand new job opening role using the primary action above.
            </p>
          </div>
        )}
      </div>

      {/* 4. Job Details Overlay */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <motion.button
              type="button"
              aria-label="Close job details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseJobDetails}
              className="absolute inset-0 bg-slate-950/30 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              transition={{ duration: 0.22 }}
              className="relative w-full max-w-6xl max-h-[88vh] overflow-hidden rounded-[28px] bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_30px_80px_rgba(15,23,42,0.18)]"
            >
              <div className="p-5 md:p-6 border-b border-white/70 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
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

                <div className="flex items-center gap-2 self-start">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleArchive(selectedJob);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white/80 border border-white/80 text-xs font-bold text-slate-600 shadow-[0_4px_12px_rgba(15,23,42,0.06)] hover:bg-white transition-all"
                  >
                    {selectedJob.status === 'Closed' ? 'Re-open' : 'Archive'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingJob(selectedJob);
                      setIsEditModalOpen(true);
                      handleCloseJobDetails();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-[0_8px_20px_rgba(37,99,235,0.24)] hover:bg-blue-700 transition-all"
                  >
                    Edit Job
                  </button>
                  <button
                    onClick={handleCloseJobDetails}
                    className="p-2.5 rounded-xl bg-white/80 border border-white/80 shadow-[0_4px_12px_rgba(15,23,42,0.06)]"
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 p-5 md:p-6 max-h-[calc(88vh-88px)] overflow-y-auto">
                <div className="xl:col-span-7 space-y-5">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="rounded-2xl bg-white/75 border border-white/80 backdrop-blur-md p-3 shadow-[0_4px_12px_rgba(15,23,42,0.04)]">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</div>
                      <div className="mt-1 text-sm font-bold text-slate-800">{selectedJob.location}</div>
                    </div>
                    <div className="rounded-2xl bg-white/75 border border-white/80 backdrop-blur-md p-3 shadow-[0_4px_12px_rgba(15,23,42,0.04)]">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</div>
                      <div className="mt-1 text-sm font-bold text-slate-800">{selectedJob.employmentType}</div>
                    </div>
                    <div className="rounded-2xl bg-white/75 border border-white/80 backdrop-blur-md p-3 shadow-[0_4px_12px_rgba(15,23,42,0.04)]">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Salary</div>
                      <div className="mt-1 text-sm font-bold text-slate-800">{selectedJob.salaryRange}</div>
                    </div>
                    <div className="rounded-2xl bg-white/75 border border-white/80 backdrop-blur-md p-3 shadow-[0_4px_12px_rgba(15,23,42,0.04)]">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experience</div>
                      <div className="mt-1 text-sm font-bold text-slate-800">{selectedJob.experience}</div>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white/75 border border-white/80 backdrop-blur-md p-5 shadow-[0_4px_16px_rgba(15,23,42,0.04)] space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-extrabold text-slate-900">Skills Required</h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {selectedJob.skillsRequired?.length || 0} skills
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.skillsRequired?.length ? (
                        selectedJob.skillsRequired.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1.5 rounded-full bg-slate-900/5 border border-white/80 text-[11px] font-bold text-slate-700 backdrop-blur-md"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-slate-400 font-semibold">No skills listed.</p>
                      )}
                    </div>
                  </div>

                </div>

                <div className="xl:col-span-5 space-y-5">
                  <div className="rounded-3xl bg-white/75 border border-white/80 backdrop-blur-md p-5 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <Users className="w-4.5 h-4.5 text-blue-500" />
                        Applicants
                      </h4>
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-extrabold border border-blue-100">
                        {matchingApplicants.length}
                      </span>
                    </div>

                    {matchingApplicants.length > 0 ? (
                      <div className="space-y-3 max-h-[38vh] overflow-y-auto pr-1">
                        {matchingApplicants.map((cand) => (
                          <div
                            key={cand.id}
                            className="rounded-2xl bg-white/80 border border-white/80 backdrop-blur-md p-3.5 shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                                    {cand.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-bold text-slate-800 truncate">{cand.name}</div>
                                    <div className="text-[10px] text-slate-400 truncate">{cand.location}</div>
                                  </div>
                                </div>
                              </div>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getStageColor(cand.status)}`}>
                                {cand.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] font-semibold text-slate-500">
                              <div className="rounded-xl bg-slate-50/90 border border-slate-100 px-2.5 py-2">
                                AI Match: <span className="font-extrabold text-blue-600">{cand.aiMatchScore}%</span>
                              </div>
                              <div className="rounded-xl bg-slate-50/90 border border-slate-100 px-2.5 py-2">
                                Integrity: <span className="font-extrabold text-emerald-600">{cand.integrityScore}%</span>
                              </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-2">
                              <span className="text-[10px] text-slate-400 font-semibold truncate">{cand.email}</span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                cand.recommendation === 'Strong Hire' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                                cand.recommendation === 'Hire' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                                cand.recommendation === 'Maybe' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                                'bg-rose-50 text-rose-600 border border-rose-200'
                              }`}>
                                {cand.recommendation}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-10 rounded-2xl bg-slate-50/70 border border-dashed border-slate-200 text-center">
                        <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <h4 className="text-xs font-bold text-slate-700">No applicants yet</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 max-w-[260px] mx-auto">
                          No candidates have been linked with this role yet.
                        </p>
                      </div>
                    )}
                  </div>

                  {selectedJob.aiQuestions && selectedJob.aiQuestions.length > 0 && (
                    <div className="rounded-3xl bg-white/75 border border-white/80 backdrop-blur-md p-5 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-extrabold text-slate-900">Screening Questions</h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {selectedJob.aiQuestions.length}
                        </span>
                      </div>
                      <ul className="space-y-2 text-sm font-semibold text-slate-600 list-disc list-inside">
                        {selectedJob.aiQuestions.map((question, index) => (
                          <li key={index} className="leading-relaxed">
                            {question}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Modals (Create & Edit) */}
      <AnimatePresence>
        {(isCreateModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
                setEditingJob(null);
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Body Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-white/80 backdrop-blur-2xl rounded-[28px] border border-white/70 shadow-[0_30px_80px_rgba(15,23,42,0.18)] overflow-hidden flex flex-col max-h-[90vh] z-10 font-sans"
            >
              
              {/* Modal Header */}
              <div className="p-5 md:p-6 border-b border-white/70 flex justify-between items-center bg-white/55 backdrop-blur-xl">
                <div>
                  <h3 className="text-[16px] font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                    <span>{isCreateModalOpen ? 'Create New Job Opening' : 'Edit Job Opening Details'}</span>
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                    {isCreateModalOpen ? 'Define parameters, requirements, and let the AI generate evaluation questions.' : 'Update guidelines, status, and requirement properties.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                    setEditingJob(null);
                  }}
                  className="p-2 rounded-xl border border-white/70 bg-white/70 backdrop-blur-md hover:bg-white transition-colors shadow-[0_4px_12px_rgba(15,23,42,0.06)]"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Form Element */}
              <form 
                onSubmit={isCreateModalOpen ? handleCreateJob : handleUpdateJob}
                className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5 text-xs text-slate-700 bg-gradient-to-b from-white/70 to-slate-50/70"
              >
                
                {/* 1. Row: Title & Department */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <span>Job Title</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Frontend Developer"
                      value={formValues.title}
                      onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                      className={`w-full px-3.5 py-2.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white/75 backdrop-blur-md text-slate-700 placeholder:text-slate-400 shadow-[0_4px_12px_rgba(15,23,42,0.04)] transition-all ${
                        errors.title ? 'border-red-400 focus:ring-red-400/40' : 'border-white/80'
                      }`}
                    />
                    {errors.title && (
                      <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <span>Department</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Engineering, Product, HR"
                      value={formValues.department}
                      onChange={(e) => setFormValues({ ...formValues, department: e.target.value })}
                      className={`w-full px-3.5 py-2.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white/75 backdrop-blur-md text-slate-700 placeholder:text-slate-400 shadow-[0_4px_12px_rgba(15,23,42,0.04)] transition-all ${
                        errors.department ? 'border-red-400 focus:ring-red-400/40' : 'border-white/80'
                      }`}
                    />
                    {errors.department && (
                      <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.department}
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. Row: Location & Employment Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <span>Location</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bengaluru (Hybrid), Remote"
                      value={formValues.location}
                      onChange={(e) => setFormValues({ ...formValues, location: e.target.value })}
                      className={`w-full px-3.5 py-2.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white/75 backdrop-blur-md text-slate-700 placeholder:text-slate-400 shadow-[0_4px_12px_rgba(15,23,42,0.04)] transition-all ${
                        errors.location ? 'border-red-400 focus:ring-red-400/40' : 'border-white/80'
                      }`}
                    />
                    {errors.location && (
                      <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <span>Employment Type</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formValues.employmentType}
                      onChange={(e) => setFormValues({ ...formValues, employmentType: e.target.value as Job['employmentType'] })}
                      className="w-full px-3.5 py-2.5 border border-white/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white/75 backdrop-blur-md text-slate-700 shadow-[0_4px_12px_rgba(15,23,42,0.04)] font-medium"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>

                {/* 3. Row: Salary & Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <span>Salary Range</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹12,00,000 - ₹18,00,000"
                      value={formValues.salaryRange}
                      onChange={(e) => setFormValues({ ...formValues, salaryRange: e.target.value })}
                      className={`w-full px-3.5 py-2.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white/75 backdrop-blur-md text-slate-700 placeholder:text-slate-400 shadow-[0_4px_12px_rgba(15,23,42,0.04)] transition-all ${
                        errors.salaryRange ? 'border-red-400 focus:ring-red-400/40' : 'border-white/80'
                      }`}
                    />
                    {errors.salaryRange && (
                      <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.salaryRange}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <span>Experience Required</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 3+ years, Mid-Senior"
                      value={formValues.experience}
                      onChange={(e) => setFormValues({ ...formValues, experience: e.target.value })}
                      className={`w-full px-3.5 py-2.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white/75 backdrop-blur-md text-slate-700 placeholder:text-slate-400 shadow-[0_4px_12px_rgba(15,23,42,0.04)] transition-all ${
                        errors.experience ? 'border-red-400 focus:ring-red-400/40' : 'border-white/80'
                      }`}
                    />
                    {errors.experience && (
                      <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.experience}
                      </p>
                    )}
                  </div>
                </div>

                {/* 4. Row: Skills Required */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <span>Skills Required</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter skills separated by commas, e.g. React, Next.js, Node.js, Typescript"
                    value={formValues.skillsRequired}
                    onChange={(e) => setFormValues({ ...formValues, skillsRequired: e.target.value })}
                    className={`w-full px-3.5 py-2.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white/75 backdrop-blur-md text-slate-700 placeholder:text-slate-400 shadow-[0_4px_12px_rgba(15,23,42,0.04)] transition-all ${
                      errors.skillsRequired ? 'border-red-400 focus:ring-red-400/40' : 'border-white/80'
                    }`}
                  />
                  <p className="text-[10px] text-slate-400 font-semibold">Separate each skill keyword tag using a comma.</p>
                  {errors.skillsRequired && (
                    <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.skillsRequired}
                    </p>
                  )}
                </div>

                {/* 5. Row: Description */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <span>Job Description</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter detailed description of responsibilities, requirements, and team scope..."
                    value={formValues.description}
                    onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                    className={`w-full px-3.5 py-2.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white/75 backdrop-blur-md text-slate-700 placeholder:text-slate-400 shadow-[0_4px_12px_rgba(15,23,42,0.04)] leading-relaxed transition-all ${
                      errors.description ? 'border-red-400 focus:ring-red-400/40' : 'border-white/80'
                    }`}
                  />
                  {errors.description && (
                    <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* 6. Section: AI Metadata Configuration */}
                <div className="p-4 bg-gradient-to-br from-white/85 to-blue-50/70 rounded-3xl border border-white/80 backdrop-blur-md space-y-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600">
                    <Sparkles className="w-4 h-4 fill-indigo-100" />
                    <span>AI Assistant Configurations (Optional)</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-600">AI Screening Questions</label>
                    <textarea
                      rows={3}
                      placeholder="Optional. Put each question on a new line. If empty, the AI helper will generate screening questions matching the tech stack."
                      value={formValues.aiQuestions}
                      onChange={(e) => setFormValues({ ...formValues, aiQuestions: e.target.value })}
                      className="w-full px-3 py-2 border border-white/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white/80 backdrop-blur-md text-slate-700 placeholder:text-slate-400 shadow-[0_4px_12px_rgba(15,23,42,0.04)] text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-white/70">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setIsEditModalOpen(false);
                      setEditingJob(null);
                    }}
                    className="px-4 py-2 border border-white/80 bg-white/70 backdrop-blur-md hover:bg-white rounded-xl text-slate-600 font-bold transition-all shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-[0_8px_20px_rgba(37,99,235,0.24)] flex items-center gap-1.5"
                  >
                    {isSubmitting && (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    <span>{isCreateModalOpen ? 'Create Role' : 'Save Changes'}</span>
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
