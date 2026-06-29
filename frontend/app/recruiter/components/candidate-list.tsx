'use client';

import React, { useState } from 'react';
import { Candidate } from '../types';
import { 
  Clock, Calendar, Layers, Briefcase, MapPin, 
  Activity, Phone, Mail, User, Check, MoreHorizontal, ChevronLeft, ChevronRight 
} from 'lucide-react';

interface CandidateListProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
}

export const CandidateList: React.FC<CandidateListProps> = ({ 
  candidates, 
  onSelectCandidate 
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [sortBy, setSortBy] = useState<string>('Date (Des)');

  // Filter & Search are handled at the parent level, but let's do pagination here.
  const totalPages = Math.ceil(candidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCandidates = candidates.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* List Header Selector from Screenshot 1 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
        <div>
          <h3 className="text-base font-extrabold text-slate-800 leading-none">
            Viewing {startIndex + 1} - {Math.min(endIndex, candidates.length)} of {candidates.length}
          </h3>
          <p className="text-xs text-slate-455 font-semibold mt-1">All Candidates</p>
        </div>
        
        <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span>Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 px-2.5 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 px-2.5 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="Date (Des)">Date (Des)</option>
              <option value="AI Match">AI Match</option>
              <option value="Name">Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidates Cards Container */}
      <div className="space-y-4">
        {currentCandidates.map((candidate) => {
          const initials = candidate.name.split(' ').map(n => n[0]).join('');
          return (
            <div
              key={candidate.id}
              onClick={() => onSelectCandidate(candidate)}
              className="bg-white border border-slate-100 hover:border-slate-300 rounded-xl p-5 shadow-[0_2px_8px_rgba(15,23,42,0.01)] hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 cursor-pointer"
            >
              {/* Left Side: Avatar + Details */}
              <div className="flex items-start gap-4 flex-1">
                {/* Profile Avatar Image/Squircle */}
                {candidate.avatarUrl ? (
                  <img 
                    src={candidate.avatarUrl} 
                    alt={candidate.name} 
                    className="w-12 h-12 rounded-full border border-slate-150 object-cover flex-shrink-0 bg-slate-50"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {initials}
                  </div>
                )}

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-slate-800 text-sm hover:text-blue-600 transition-colors">
                      {candidate.name}
                    </h4>
                    {candidate.connectedStatus === 'CONNECTED' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block" title="Connected" />
                    )}
                    {/* Add small visual indicators if recommended */}
                    {candidate.aiMatchScore >= 90 && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-blue-600 text-[9px] font-extrabold">
                        AI: {candidate.aiMatchScore}%
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-slate-400 font-semibold">
                    {candidate.position} &bull; <span className="text-slate-500">{candidate.location}</span>
                  </div>

                  {/* Operational Tags (Middle Section in screenshot 1) */}
                  {(candidate.sendToHiringManager || candidate.sendToHr || candidate.needToCall) && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {candidate.sendToHiringManager && (
                        <span className="px-2 py-0.5 bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] text-[9px] font-extrabold rounded uppercase tracking-wider">
                          Send To Hiring Manager
                        </span>
                      )}
                      {candidate.sendToHr && (
                        <span className="px-2 py-0.5 bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] text-[9px] font-extrabold rounded uppercase tracking-wider">
                          Send To HR
                        </span>
                      )}
                      {candidate.needToCall && (
                        <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-600 text-[9px] font-extrabold rounded uppercase tracking-wider">
                          Need To Call
                        </span>
                      )}
                    </div>
                  )}

                  {/* Bottom Metadata Badges */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-[10.5px] font-bold text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-450" />
                      <span>{candidate.postedTime || 'Today'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-450" />
                      <span>{candidate.postedDate || 'Sept 19, 2016'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-blue-450" />
                      <span>{candidate.clearance || 'Secret'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-blue-450" />
                      <span>{candidate.experienceYears || '5+ yrs exp'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-450" />
                      <span>{candidate.relocate || 'Willing to relocate'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-blue-450" />
                      <span>{candidate.salaryRangeText || '$80 - $90'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Communication Icons + Connect Buttons */}
              <div className="flex items-center justify-between md:justify-end gap-3 flex-shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-50">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); alert(`Initiating chat with ${candidate.name}`); }}
                    className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); alert(`Calling ${candidate.name} at ${candidate.phone}`); }}
                    className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                </div>

                {candidate.connectedStatus === 'CONNECTED' ? (
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="px-3.5 py-1.5 border border-blue-500 bg-white text-blue-600 text-xs font-bold rounded-lg flex items-center gap-1 hover:bg-blue-50/50 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>CONNECTED</span>
                  </button>
                ) : (
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="px-3.5 py-1.5 border border-slate-200 hover:border-slate-350 bg-white text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 hover:bg-slate-50 transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>CONNECT</span>
                  </button>
                )}

                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Numbered Pagination from Screenshot 3 */}
      {candidates.length > 20 && totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-4 border-t border-slate-100">
          {/* Previous Arrow */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-150 text-slate-400 disabled:opacity-50 hover:bg-slate-50 transition-all font-bold text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page numbers list */}
          {getPageNumbers().map((pageNum, idx) => {
            if (pageNum === '...') {
              return (
                <span key={`dots-${idx}`} className="w-8 h-8 flex items-center justify-center text-slate-400 font-bold text-xs">
                  ...
                </span>
              );
            }

            const isActive = pageNum === currentPage;
            return (
              <button
                key={`page-${pageNum}`}
                onClick={() => handlePageChange(Number(pageNum))}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-slate-800 border-slate-800 text-white shadow-sm' 
                    : 'bg-white border-slate-150 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Next Arrow */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-150 text-slate-400 disabled:opacity-50 hover:bg-slate-50 transition-all font-bold text-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
