'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Circle,
} from 'lucide-react';
import { useRecruiterStore } from '../store';
import { Candidate } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Meeting {
  id: string;
  candidateName: string;
  position: string;
  time: string;
  duration: string;
  type: 'Technical' | 'HR' | 'Panel' | 'Final';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  avatarSeed: string;
}

// ─── Candidate meetings ───────────────────────────────────────────────────────
const parseDateKey = (dateString: string): string | null => {
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return null;
  return isoKey(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

const getMeetingType = (stage: string): Meeting['type'] => {
  const lower = stage.toLowerCase();
  if (lower.includes('hr')) return 'HR';
  if (lower.includes('panel')) return 'Panel';
  if (lower.includes('final')) return 'Final';
  if (lower.includes('technical')) return 'Technical';
  return 'Technical';
};

const mapStatus = (status: string): Meeting['status'] => {
  const lower = status.toLowerCase();
  if (lower === 'completed') return 'Completed';
  if (lower === 'cancelled') return 'Cancelled';
  return 'Scheduled';
};

const defaultTime = '10:00 AM';
const defaultDuration = '30 min';

const getCandidateMeetings = (candidates: Candidate[]): Record<string, Meeting[]> => {
  const meetings: Record<string, Meeting[]> = {};

  const addMeeting = (dateKey: string, meeting: Meeting) => {
    if (!meetings[dateKey]) meetings[dateKey] = [];
    meetings[dateKey].push(meeting);
  };

  candidates.forEach((candidate) => {
    if (!candidate.interviewDate) return;
    const dateKey = parseDateKey(candidate.interviewDate);
    if (!dateKey) return;

    const meeting: Meeting = {
      id: `${candidate.id}-${dateKey}`,
      candidateName: candidate.name,
      position: candidate.position,
      time: defaultTime,
      duration: defaultDuration,
      type: candidate.status === 'Interviewing' ? 'HR' : 'Technical',
      status: 'Scheduled',
      avatarSeed: candidate.name,
    };

    addMeeting(dateKey, meeting);
  });

  return meetings;
};

// ─── Constants ────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAY_NAMES = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function isoKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const TYPE_STYLES: Record<string, { badge: string; dot: string }> = {
  Technical: { badge: 'bg-indigo-50 text-indigo-600 border-indigo-200',   dot: 'bg-indigo-500'  },
  HR:        { badge: 'bg-emerald-50 text-emerald-600 border-emerald-200', dot: 'bg-emerald-500' },
  Panel:     { badge: 'bg-violet-50 text-violet-600 border-violet-200',    dot: 'bg-violet-500'  },
  Final:     { badge: 'bg-amber-50 text-amber-600 border-amber-200',       dot: 'bg-amber-500'   },
};

const STATUS_META = {
  Scheduled: { icon: <Circle      className="w-3 h-3 text-indigo-500" />, color: 'text-indigo-600'  },
  Completed: { icon: <CheckCircle2 className="w-3 h-3 text-emerald-500" />, color: 'text-emerald-600' },
  Cancelled: { icon: <AlertCircle  className="w-3 h-3 text-rose-500"  />, color: 'text-rose-600'    },
};

// ─── Component ────────────────────────────────────────────────────────────────
export const InterviewCalendar: React.FC = () => {
  const today = new Date();
  const { candidates } = useRecruiterStore();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedKey, setSelectedKey] = useState<string>(
    isoKey(today.getFullYear(), today.getMonth(), today.getDate())
  );

  const meetingsByDate = useMemo(() => getCandidateMeetings(candidates), [candidates]);

  const { daysInMonth, firstWeekday } = useMemo(() => ({
    daysInMonth: new Date(viewYear, viewMonth + 1, 0).getDate(),
    firstWeekday: new Date(viewYear, viewMonth, 1).getDay(),
  }), [viewYear, viewMonth]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const todayKey       = isoKey(today.getFullYear(), today.getMonth(), today.getDate());
  const selectedMtgs   = meetingsByDate[selectedKey] ?? [];
  const todayMtgs      = meetingsByDate[todayKey]    ?? [];
  const isToday        = selectedKey === todayKey;
  const hasMeeting     = selectedMtgs.length > 0;

  return (
    <div className="p-5 lg:p-6 rounded-2xl bg-white border border-slate-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col gap-4 min-h-[480px]">

      {/* ── Header ── */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-800">Interview Schedule</h3>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
          todayMtgs.length > 0
            ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
            : 'bg-slate-50 text-slate-400 border-slate-200'
        }`}>
          {todayMtgs.length > 0
            ? `${todayMtgs.length} meeting${todayMtgs.length > 1 ? 's' : ''} today`
            : 'No meetings today'}
        </span>
      </div>

      {/* ── Responsive body ── */}
      <div className="grid gap-5 min-h-0 lg:grid-cols-[53%_1fr]">

        {/* ─── LEFT: Mini Calendar ─── */}
        <div className="flex flex-col gap-3">

          {/* Month navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevMonth}
              className="w-6 h-8 my-5 ml-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <span className="text-xs font-bold text-slate-700">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              onClick={nextMonth}
              className="w-6 h-8 my-5 mr-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 text-center h-56 gap-y-1">
            {DAY_NAMES.map(d => (
              <span key={d} className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                {d}
              </span>
            ))}

            {/* Empty leading cells */}
            {Array.from({ length: firstWeekday }).map((_, i) => (
              <div key={`e-${i}`} />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const key = isoKey(viewYear, viewMonth, day);
              const isSelected = key === selectedKey;
              const isT  = key === todayKey;
              const mtgs = meetingsByDate[key] ?? [];

              return (
                <button
                  key={day}
                  onClick={() => setSelectedKey(key)}
                  className={`
                    relative flex flex-col items-center justify-center rounded-lg py-1 transition-all
                    ${isSelected
                      ? 'bg-indigo-500 shadow-md shadow-indigo-200'
                      : isT
                      ? 'bg-indigo-50 ring-1 ring-inset ring-indigo-300'
                      : 'hover:bg-slate-50'}
                  `}
                >
                  <span className={`text-[10px] font-bold leading-none ${
                    isSelected ? 'text-white' : isT ? 'text-indigo-600' : 'text-slate-600'
                  }`}>
                    {day}
                  </span>

                  {/* Meeting indicator dots */}
                  {mtgs.length > 0 && (
                    <div className="flex gap-px mt-0.5">
                      {mtgs.slice(0, 3).map((m, mi) => (
                        <span
                          key={mi}
                          className={`w-1 h-1 rounded-full ${
                            isSelected
                              ? 'bg-white/70'
                              : TYPE_STYLES[m.type]?.dot ?? 'bg-indigo-400'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 border-t border-slate-100">
            {Object.entries(TYPE_STYLES).map(([type, s]) => (
              <span key={type} className="flex items-center gap-1 text-[9px] text-slate-400 font-semibold">
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-slate-100 self-stretch flex-shrink-0" />

        {/* ─── RIGHT: Meeting Details ─── */}
        <div className="flex-1 flex flex-col gap-3 min-w-0 min-h-0">

          {/* Panel header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {isToday
                  ? 'Today'
                  : new Date(selectedKey + 'T00:00:00').toLocaleDateString('en-IN', {
                      weekday: 'short', day: 'numeric', month: 'short',
                    })}
              </p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                {hasMeeting
                  ? `${selectedMtgs.length} Interview${selectedMtgs.length > 1 ? 's' : ''} Scheduled`
                  : 'No Interviews'}
              </p>
            </div>
            {hasMeeting && (
              <CalendarDays className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            )}
          </div>

          {/* Meeting cards */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-0.5 scrollbar-thin">
            <AnimatePresence mode="wait">
              {hasMeeting ? (
                <motion.div
                  key={selectedKey}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  {selectedMtgs.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
                    >
                      {/* Name + type */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${m.avatarSeed}`}
                            alt={m.candidateName}
                            className="w-6 h-6 rounded-lg bg-slate-200 flex-shrink-0"
                          />
                          <span className="text-[11px] font-bold text-slate-800 truncate">
                            {m.candidateName}
                          </span>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border flex-shrink-0 ${TYPE_STYLES[m.type]?.badge}`}>
                          {m.type}
                        </span>
                      </div>

                      {/* Position */}
                      <div className="flex items-center gap-1 mt-1.5">
                        <Briefcase className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
                        <span className="text-[10px] text-slate-400 font-semibold truncate">{m.position}</span>
                      </div>

                      {/* Time + status */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-indigo-500" />
                          <span className="text-[10px] font-bold text-indigo-600">{m.time}</span>
                          <span className="text-[10px] text-slate-400">· {m.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {STATUS_META[m.status].icon}
                          <span className={`text-[9px] font-bold ${STATUS_META[m.status].color}`}>
                            {m.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key={`empty-${selectedKey}`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center gap-3 py-8 text-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400">No interviews</p>
                    <p className="text-[10px] text-slate-300 mt-0.5">Nothing scheduled for this day</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Back to today */}
          {!isToday && (
            <button
              onClick={() => setSelectedKey(todayKey)}
              className="w-full text-center text-[10px] font-bold text-indigo-500 hover:text-indigo-700 py-1 rounded-lg hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100"
            >
              ← Back to Today
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
