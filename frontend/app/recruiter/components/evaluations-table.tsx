'use client';
import * as tw from '@/lib/tailwindClasses'

import React from 'react';
import { useRecruiterStore } from '../store';
import { Candidate } from '../types';
import { ExternalLink, Circle, ChevronLeft, ChevronRight } from 'lucide-react';

type EvaluationsTableProps = {
  showViewAll?: boolean;
  itemsPerPage?: number;
  showFilters?: boolean;
};

export const EvaluationsTable: React.FC<EvaluationsTableProps> = ({ showViewAll = true, itemsPerPage = 5, showFilters = false }) => {
  const { candidates, setActiveTab, filterJob, setFilterJob } = useRecruiterStore();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [stageFilter, setStageFilter] = React.useState<string>('All Stages');

  const filteredCandidates = React.useMemo(() => {
    if (!showFilters) return candidates;

    return candidates.filter(cand => {
      const matchesSearch =
        cand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cand.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cand.skills && cand.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesJob =
        filterJob === 'All' || filterJob === 'All Jobs' ||
        cand.position.toLowerCase().includes(filterJob.toLowerCase());

      const matchesStage =
        stageFilter === 'All' || stageFilter === 'All Stages' ||
        cand.status === stageFilter;

      return matchesSearch && matchesJob && matchesStage;
    });
  }, [candidates, showFilters, searchQuery, filterJob, stageFilter]);

  const [itemsPerPageState, setItemsPerPageState] = React.useState<number>(itemsPerPage);
  const [sortBy, setSortBy] = React.useState<string>('AI Match');

  const sortedCandidates = React.useMemo(() => {
    const arr = [...filteredCandidates];
    if (sortBy === 'AI Match' || sortBy === 'Highest AI Match') {
      return arr.sort((a, b) => (b.aiMatchScore || 0) - (a.aiMatchScore || 0));
    }
    if (sortBy === 'Date' || sortBy === 'Date (Des)') {
      return arr.sort((a, b) => {
        const da = new Date(a.interviewDate || '').getTime() || 0;
        const db = new Date(b.interviewDate || '').getTime() || 0;
        return db - da;
      });
    }
    if (sortBy === 'Integrity' || sortBy === 'Highest Integrity') {
      return arr.sort((a, b) => (b.integrityScore || 0) - (a.integrityScore || 0));
    }
    if (sortBy === 'Name') {
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    }
    return arr;
  }, [filteredCandidates, sortBy]);

  const totalPages = Math.ceil(sortedCandidates.length / itemsPerPageState);
  const displayCandidates = sortedCandidates.slice((currentPage - 1) * itemsPerPageState, currentPage * itemsPerPageState);

  const getRecommendationBadge = (rec: Candidate['recommendation']) => {
    switch (rec) {
      case 'Strong Hire':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-250">
            Strong Hire
          </span>
        );
      case 'Hire':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-250">
            Hire
          </span>
        );
      case 'Maybe':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-250">
            Maybe
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-250">
            Reject
          </span>
        );
    }
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 90) return 'bg-[#10b981]'; // emerald green
    return 'bg-blue-600'; // royal blue
  };

  return (
    <div className=" flex flex-col gap-5">
      
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h3 className="text-xl md:text-[22px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">Recent Evaluations</h3>
          <p className="text-[11px] font-semibold text-slate-500 leading-relaxed uppercase tracking-wider flex items-center gap-2">
            Overview of latest automated and live candidate matches
            </p>
        </div>
        {showViewAll && (
          <button 
            onClick={() => setActiveTab('Evaluation Reports')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-slate-200 bg-white text-[10px] font-bold text-blue-600 hover:bg-slate-50 transition-shadow shadow-sm"
          >
            <span>View All</span>
            <ExternalLink className={tw.iconSm} />
          </button>
        )}
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4 bg-slate-50/50 border border-slate-100 p-4 rounded-xl">
          <input
            type="text"
            placeholder="Search by name, role or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={filterJob}
              onChange={(e) => setFilterJob(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All Jobs">All Jobs</option>
              {Array.from(new Set(candidates.map(c => c.position))).map(j => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All Stages">All Stages</option>
              <option value="Applied">Applied</option>
              <option value="Screening">Screening</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Hired">Hired</option>
            </select>
          </div>
        </div>
      )}

      {/* Table */}
      {/* Controls bar: viewing summary + per-page & sort */}
      <div className="w-full bg-slate-50/50 border border-slate-100 rounded-xl p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-xs font-bold text-slate-600">
        <div className="text-base font-extrabold text-slate-800">
          {sortedCandidates.length === 0 ? (
            <span>Viewing 0 of 0</span>
          ) : (
            <span>
              Viewing {Math.min(sortedCandidates.length, (currentPage - 1) * itemsPerPageState + 1)} - {Math.min(sortedCandidates.length, currentPage * itemsPerPageState)} of {sortedCandidates.length}
            </span>
          )}
          <div className="text-[12px] text-slate-800 font-semibold">All Candidates</div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
            <span className="text-slate-500">Show:</span>
            <select
              value={itemsPerPageState}
              onChange={(e) => {
                setItemsPerPageState(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white text-slate-700 text-xs border-none outline-none focus:ring-0 cursor-pointer"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
            <span className="text-slate-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white text-slate-700 text-xs border-none outline-none focus:ring-0 cursor-pointer"
            >
              <option value="Date (Des)">Date (Des)</option>
              <option value="AI Match">AI Match</option>
              <option value="Name">Name</option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th className="pb-3 pr-4">Candidate</th>
              <th className="pb-3 px-4">Job Role</th>
              <th className="pb-3 px-4">Date</th>
              <th className="pb-3 px-4 text-left">Match Score</th>
              <th className="pb-3 px-4 text-center">Integrity</th>
              <th className="pb-3 pl-4 text-right">Recommendation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
            {displayCandidates.map((cand) => (
              <tr key={cand.id} className="hover:bg-slate-50/50 transition-colors">
                
                {/* Candidate name & avatar */}
                <td className="py-4 pr-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-150">
                    {cand.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-800 text-[11px]">{cand.name}</span>
                    <span className="text-[9px] text-slate-400 font-semibold truncate">{cand.email}</span>
                  </div>
                </td>

                {/* Job Role */}
                <td className="py-4 px-4 font-bold text-slate-500 truncate max-w-[200px]">
                  {cand.position}
                </td>

                {/* Date */}
                <td className="py-4 px-4 font-semibold text-slate-400">
                  {cand.interviewDate}
                </td>

                {/* Match Score Progress Bar */}
                <td className="py-4 px-4">
                  <div className={tw.flexItemsGap3}>
                    <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${getProgressBarColor(cand.aiMatchScore)}`}
                        style={{ width: `${cand.aiMatchScore}%` }} 
                      />
                    </div>
                    <span className="font-extrabold text-[11px] text-slate-800">{cand.aiMatchScore}%</span>
                  </div>
                </td>

                {/* Integrity Secure Circle */}
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-600">
                    <Circle className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span className="font-extrabold text-[11px]">{cand.integrityScore}%</span>
                  </div>
                </td>

                {/* Recommendation Badges */}
                <td className="py-4 pl-4 text-right">
                  {getRecommendationBadge(cand.recommendation)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center pt-4 border-t border-slate-100 text-[10px] font-bold text-slate-500">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:opacity-50 hover:bg-slate-50 transition-all font-bold text-xs bg-white shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg border text-xs font-bold transition-all shadow-sm ${
                    isActive 
                      ? 'bg-slate-800 border-slate-800 text-white' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:opacity-50 hover:bg-slate-50 transition-all font-bold text-xs bg-white shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
