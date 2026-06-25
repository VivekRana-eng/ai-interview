'use client';

import React from 'react';
import { useRecruiterStore } from '../store';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Calendar, Filter, Sparkles } from 'lucide-react';

const OVERVIEW_DATA = [
  { name: 'Jun 18', Applications: 4, Interviews: 1.2, Shortlisted: 0.2, Hired: 0.1 },
  { name: 'Jun 19', Applications: 3, Interviews: 2.1, Shortlisted: 0.8, Hired: 0.2 },
  { name: 'Jun 20', Applications: 6.2, Interviews: 3.5, Shortlisted: 1.9, Hired: 0.4 },
];

export const Charts: React.FC = () => {
  const { candidates, jobs, filterJob, setFilterJob } = useRecruiterStore();
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  // Filter candidates by job role
  const filteredCandidates = candidates.filter(
    c => filterJob === 'All' || c.position === filterJob
  );

  // Dynamic funnel totals based on filtered candidates
  const total = filteredCandidates.length;
  const screened = filteredCandidates.filter(c => ['Screening', 'Interviewing', 'Shortlisted', 'Hired'].includes(c.status)).length;
  const interviewed = filteredCandidates.filter(c => ['Interviewing', 'Shortlisted', 'Hired'].includes(c.status)).length;
  const shortlisted = filteredCandidates.filter(c => ['Shortlisted', 'Hired'].includes(c.status)).length;
  const hired = filteredCandidates.filter(c => c.status === 'Hired').length;

  const hireRate = total > 0 ? (hired / total) * 100 : 0.0;

  const funnelStages = [
    { num: 1, label: 'Applicants', count: total, percentage: 100 },
    { num: 2, label: 'Screened', count: screened, percentage: total > 0 ? Math.round((screened / total) * 100) : 0 },
    { num: 3, label: 'Interviewed', count: interviewed, percentage: total > 0 ? Math.round((interviewed / total) * 100) : 0 },
    { num: 4, label: 'Shortlisted', count: shortlisted, percentage: total > 0 ? Math.round((shortlisted / total) * 100) : 0 }
  ];

  const donutData = [
    { name: 'Applicants', value: Math.max(total, 1), rawValue: total, color: '#1d4ed8' },
    { name: 'Screened', value: Math.max(screened, 1), rawValue: screened, color: '#2563eb' },
    { name: 'Interviewed', value: Math.max(interviewed, 1), rawValue: interviewed, color: '#3b82f6' },
    { name: 'Shortlisted', value: Math.max(shortlisted, 1), rawValue: shortlisted, color: '#60a5fa' },
    { name: 'Hired', value: Math.max(hired, 1), rawValue: hired, color: '#93c5fd' }
  ];

  // Base mock curves from screenshot if database has no candidates, or add actual counts onto it
  const baseData = [
    { name: 'Jun 18', Applications: 4, Interviews: 1.2, Shortlisted: 0.2, Hired: 0.1 },
    { name: 'Jun 19', Applications: 3, Interviews: 2.1, Shortlisted: 0.8, Hired: 0.2 },
    { name: 'Jun 20', Applications: 6.2, Interviews: 3.5, Shortlisted: 1.9, Hired: 0.4 },
  ];

  const groupedData: Record<string, { name: string; Applications: number; Interviews: number; Shortlisted: number; Hired: number }> = {};

  // Initialize with base data
  baseData.forEach(d => {
    groupedData[d.name] = { ...d };
  });

  // Add candidate counts from DB
  filteredCandidates.forEach(cand => {
    if (!cand.interviewDate) return;
    const dateKey = cand.interviewDate.split(',')[0].trim(); // e.g. "Jun 20"

    if (!groupedData[dateKey]) {
      groupedData[dateKey] = {
        name: dateKey,
        Applications: 0,
        Interviews: 0,
        Shortlisted: 0,
        Hired: 0
      };
    }

    if (cand.status === 'Applied') {
      groupedData[dateKey].Applications += 1;
    } else if (cand.status === 'Interviewing') {
      groupedData[dateKey].Interviews += 1;
    } else if (cand.status === 'Shortlisted') {
      groupedData[dateKey].Shortlisted += 1;
    } else if (cand.status === 'Hired') {
      groupedData[dateKey].Hired += 1;
    }
  });

  // Sort chronologically and compile to array
  const dynamicOverviewData = Object.values(groupedData).sort((a, b) => {
    const dateA = new Date(a.name + ', 2026').getTime();
    const dateB = new Date(b.name + ', 2026').getTime();
    return dateA - dateB;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* 1. AI Recruitment Overview Area Chart */}
      <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">AI Recruitment Overview</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">30-day analytics pipeline performance{filterJob !== 'All' ? ` for ${filterJob}` : ''}</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-[10px] font-bold text-slate-600">
              <Calendar className="w-3.5 h-3.5" />
              <span>Last 30 Days</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors text-[10px] font-bold ${filterJob !== 'All' ? 'bg-blue-50 text-blue-755 border-blue-200' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span className="truncate max-w-[100px]">Filter{filterJob !== 'All' ? `: ${filterJob}` : ''}</span>
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-white border border-slate-100 shadow-[0_8px_24px_rgba(15,23,42,0.08)] p-1 z-50 text-slate-700 max-h-60 overflow-y-auto">
                  <div className="px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-50">
                    Filter by Job Role
                  </div>
                  <button
                    onClick={() => {
                      setFilterJob('All');
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-[10px] font-bold transition-colors ${filterJob === 'All' ? 'bg-blue-50/50 text-blue-650' : 'hover:bg-slate-50'}`}
                  >
                    All Jobs
                  </button>
                  {jobs.map(job => (
                    <button
                      key={job.id}
                      onClick={() => {
                        setFilterJob(job.title);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-[10px] font-bold transition-colors truncate ${filterJob === job.title ? 'bg-blue-50/50 text-blue-650' : 'hover:bg-slate-50'}`}
                    >
                      {job.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 mb-4 text-[10px] font-bold text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
            <span>Applications</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span>Hired</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
            <span>Interviews</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Shortlisted</span>
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="h-64 w-full text-[10px] font-bold">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dynamicOverviewData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} domain={[0, 8]} ticks={[0, 2, 4, 6, 8]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#f1f5f9',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  color: '#1e293b'
                }}
              />
              <Line
                type="linear"
                dataKey="Applications"
                stroke="#2563eb"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="Interviews"
                stroke="#0ea5e9"
                strokeWidth={3}
                strokeDasharray="8 4 2 4"
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="Shortlisted"
                stroke="#10b981"
                strokeWidth={3}
                strokeDasharray="2 4"
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="Hired"
                stroke="#f59e0b"
                strokeWidth={3}
                strokeDasharray="10 6"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Hiring Conversion Funnel */}
      <div className="p-6 rounded-2xl bg-white border border-slate-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Hiring Conversion Funnel</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Recruiting conversion yield across current hiring cycles</p>
          </div>
          <div className="px-2.5 py-1.5 rounded bg-blue-50 text-blue-700 text-[9px] font-bold border border-blue-100 flex items-center gap-0.5 whitespace-nowrap shadow-sm">
            <Sparkles className="w-2.5 h-2.5 text-blue-600" />
            <span>{hireRate.toFixed(1)}% Hire Rate</span>
          </div>
        </div>

        {/* Donut + legend */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[190px_1fr] gap-5 items-center">
          <div className="relative h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={84}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {donutData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, item) => {
                    const raw = (item as any)?.payload?.rawValue ?? 0
                    return [`${raw} candidates`, String(name)] as [string, string]
                  }}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    color: '#1e293b'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Total</div>
              <div className="text-3xl font-extrabold text-slate-900 leading-none mt-1">{total}</div>
              <div className="text-[10px] font-semibold text-slate-500 mt-1">
                {hired} hired
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {funnelStages.map((stage, idx) => {
              const shade = ['bg-[#1d4ed8]', 'bg-[#2563eb]', 'bg-[#3b82f6]', 'bg-[#60a5fa]'][idx]
              return (
                <div key={stage.label} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${shade}`} />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800">{stage.label}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{stage.count} candidates</span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">{stage.percentage}%</span>
                </div>
              )
            })}
            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-blue-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#93c5fd]" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">Hired</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{hired} candidates</span>
                </div>
              </div>
              <span className="text-xs font-extrabold text-slate-900">{total > 0 ? Math.round((hired / total) * 100) : 0}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
