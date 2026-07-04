'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  User,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Circle,
} from 'lucide-react';

// ─── Mock meeting data ────────────────────────────────────────────────────────
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

function generateMeetings(): Record<string, Meeting[]> {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const pad = (n: number) => String(n).padStart(2, '0');
  const key = (d: number) => `${year}-${pad(month + 1)}-${pad(d)}`;

  const pool: Omit<Meeting, 'id'>[] = [
    { candidateName: 'Amit Sharma',   position: 'Senior React Engineer',   time: '10:00 AM', duration: '45 min', type: 'Technical', status: 'Scheduled', avatarSeed: 'amit' },
    { candidateName: 'Priya Patel',   position: 'UI/UX Designer',           time: '11:30 AM', duration: '30 min', type: 'HR',        status: 'Scheduled', avatarSeed: 'priya' },
    { candidateName: 'Rahul Verma',   position: 'Fullstack Developer',      time: '02:00 PM', duration: '60 min', type: 'Panel',     status: 'Scheduled', avatarSeed: 'rahul' },
    { candidateName: 'Sneha Reddy',   position: 'Data Engineer',            time: '09:15 AM', duration: '45 min', type: 'Final',     status: 'Completed', avatarSeed: 'sneha' },
    { candidateName: 'Vikram Singh',  position: 'DevOps Specialist',        time: '03:30 PM', duration: '30 min', type: 'Technical', status: 'Scheduled', avatarSeed: 'vikram' },
    { candidateName: 'Ananya Iyer',   position: 'Machine Learning Engineer',time: '01:00 PM', duration: '45 min', type: 'Panel',     status: 'Scheduled', avatarSeed: 'ananya' },
    { candidateName: 'Rohan Gupta',   position: 'Mobile App Developer',     time: '04:00 PM', duration: '30 min', type: 'HR',        status: 'Cancelled', avatarSeed: 'rohan' },
    { candidateName: 'Neha Sen',      position: 'QA Lead',                  time: '10:30 AM', duration: '45 min', type: 'Final',     status: 'Scheduled', avatarSeed: 'neha' },
    { candidateName: 'Aditya Joshi',  position: 'Lead Product Manager',     time: '02:30 PM', duration: '60 min', type: 'Technical', status: 'Scheduled', avatarSeed: 'aditya' },
    { candidateName: 'Meera Nair',    position: 'Security Analyst',         time: '11:00 AM', duration: '30 min', type: 'HR',        status: 'Completed', avatarSeed: 'meera' },
  ];

  const daysWithMeetings = [1, 3, 5, today.getDate(), today.getDate() + 1, today.getDate() + 3, today.getDate() + 5, today.getDate() + 7].filter(
    (d) => d >= 1 && d <= 31
  );

  const result: Record<string, Meeting[]> = {};

  daysWithMeetings.forEach((day, di) => {
    const count = di % 2 === 0 ? 2 : 1;
    result[key(day)] = Array.from({ length: count }, (_, i) => ({
      ...pool[(di * 2 + i) % pool.length],
      id: `meet-${day}-${i}`,
    }));
  });

  return result;
}

const MEETINGS_BY_DATE = generateMeetings();

// ─── Helpers ──────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function isoKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const TYPE_COLOR: Record<string, string> = {
  Technical: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  HR:        'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Panel:     'bg-violet-500/20 text-violet-300 border-violet-500/30',
  Final:     'bg-amber-500/20 text-amber-300 border-amber-500/30',
};

const TYPE_DOT: Record<string, string> = {
  Technical: 'bg-indigo-400',
  HR:        'bg-emerald-400',
  Panel:     'bg-violet-400',
  Final:     'bg-amber-400',
};

const STATUS_ICON = {
  Scheduled: <Circle className="w-3 h-3 text-indigo-400" />,
  Completed: <CheckCircle2 className="w-3 h-3 text-emerald-400" />,
  Cancelled: <AlertCircle className="w-3 h-3 text-rose-400" />,
};

// ─── Component ────────────────────────────────────────────────────────────────
export const InterviewCalendar: React.FC = () => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedKey, setSelectedKey] = useState<string>(
    isoKey(today.getFullYear(), today.getMonth(), today.getDate())
  );

  // Calendar grid
  const { days, firstWeekday } = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    return { days: daysInMonth, firstWeekday };
  }, [viewYear, viewMonth]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const todayKey = isoKey(today.getFullYear(), today.getMonth(), today.getDate());
  const selectedMeetings = MEETINGS_BY_DATE[selectedKey] || [];
  const todayMeetings    = MEETINGS_BY_DATE[todayKey]    || [];

  const isToday    = selectedKey === todayKey;
  const hasMeeting = selectedMeetings.length > 0;

  return (
    <div className="flex flex-col h-full rounded-2xl bg-slate-950/40 border border-slate-900/60 shadow-xl backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-900/60">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Interview Schedule</h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {todayMeetings.length > 0
            ? `${todayMeetings.length} meeting${todayMeetings.length > 1 ? 's' : ''} today`
            : 'No meetings today'}
        </span>
      </div>

      {/* Body — two columns */}
      <div className="flex flex-1 divide-x divide-slate-900/60 min-h-0">

        {/* ── LEFT: Calendar ── */}
        <div className="w-[52%] flex flex-col px-4 py-3 gap-3">
          {/* Month nav */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevMonth}
              className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-bold text-white">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              onClick={nextMonth}
              className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 text-center">
            {DAY_NAMES.map(d => (
              <span key={d} className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">
                {d}
              </span>
            ))}
          </div>

          {/* Date grid */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {/* empty leading cells */}
            {Array.from({ length: firstWeekday }).map((_, i) => (
              <div key={`e-${i}`} />
            ))}

            {Array.from({ length: days }, (_, i) => {
              const day = i + 1;
              const key = isoKey(viewYear, viewMonth, day);
              const isSelected = key === selectedKey;
              const isT = key === todayKey;
              const hasMtg = !!MEETINGS_BY_DATE[key];
              const mtgs = MEETINGS_BY_DATE[key] || [];

              return (
                <button
                  key={day}
                  onClick={() => setSelectedKey(key)}
                  className={`
                    relative flex flex-col items-center justify-center rounded-lg py-1 transition-all group
                    ${isSelected
                      ? 'bg-indigo-500 shadow-lg shadow-indigo-500/25'
                      : isT
                      ? 'bg-slate-800 ring-1 ring-indigo-500/50'
                      : 'hover:bg-slate-800/60'}
                  `}
                >
                  <span className={`text-[10px] font-bold leading-none ${
                    isSelected ? 'text-white' : isT ? 'text-indigo-300' : 'text-slate-300'
                  }`}>
                    {day}
                  </span>

                  {/* Meeting dots */}
                  {hasMtg && (
                    <div className="flex gap-px mt-0.5">
                      {mtgs.slice(0, 3).map((m, mi) => (
                        <span
                          key={mi}
                          className={`w-1 h-1 rounded-full ${
                            isSelected ? 'bg-white/70' : TYPE_DOT[m.type] || 'bg-indigo-400'
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
          <div className="flex flex-wrap gap-2 mt-auto pt-1">
            {Object.entries(TYPE_DOT).map(([type, dot]) => (
              <span key={type} className="flex items-center gap-1 text-[9px] text-slate-500 font-semibold">
                <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Detail panel ── */}
        <div className="flex-1 flex flex-col px-4 py-3 gap-3 min-h-0">
          {/* Panel title */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {isToday ? 'Today' : new Date(selectedKey + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
              </p>
              <p className="text-xs font-bold text-white mt-0.5">
                {hasMeeting
                  ? `${selectedMeetings.length} Interview${selectedMeetings.length > 1 ? 's' : ''} Scheduled`
                  : 'No Interviews'}
              </p>
            </div>
            {hasMeeting && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
              </span>
            )}
          </div>

          {/* Meeting list */}
          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin pr-0.5">
            <AnimatePresence mode="wait">
              {hasMeeting ? (
                <motion.div
                  key={selectedKey}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-2"
                >
                  {selectedMeetings.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 hover:border-indigo-500/30 transition-all group"
                    >
                      {/* Candidate name + type badge */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${m.avatarSeed}`}
                            alt={m.candidateName}
                            className="w-6 h-6 rounded-lg bg-slate-800 flex-shrink-0"
                          />
                          <span className="text-[11px] font-bold text-white truncate">
                            {m.candidateName}
                          </span>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border flex-shrink-0 ${TYPE_COLOR[m.type]}`}>
                          {m.type}
                        </span>
                      </div>

                      {/* Position */}
                      <div className="flex items-center gap-1 mt-1.5">
                        <Briefcase className="w-2.5 h-2.5 text-slate-500 flex-shrink-0" />
                        <span className="text-[10px] text-slate-500 truncate">{m.position}</span>
                      </div>

                      {/* Time + status */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-indigo-400" />
                          <span className="text-[10px] font-semibold text-indigo-300">
                            {m.time}
                          </span>
                          <span className="text-[10px] text-slate-600">· {m.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {STATUS_ICON[m.status]}
                          <span className={`text-[9px] font-bold ${
                            m.status === 'Completed' ? 'text-emerald-400'
                            : m.status === 'Cancelled' ? 'text-rose-400'
                            : 'text-slate-400'
                          }`}>
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
                  transition={{ duration: 0.22 }}
                  className="flex flex-col items-center justify-center h-full gap-3 py-8 text-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400">No interviews</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">Nothing scheduled for this day</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Today shortcut */}
          {!isToday && (
            <button
              onClick={() => setSelectedKey(todayKey)}
              className="w-full text-center text-[10px] font-bold text-indigo-400 hover:text-indigo-300 py-1 rounded-lg hover:bg-indigo-500/10 transition-all"
            >
              ← Back to Today
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
