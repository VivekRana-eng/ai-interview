'use client';
import * as tw from '@/lib/tailwindClasses'

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

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, payload }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.45;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (!payload || payload.rawValue === 0 || payload.funnelPercentage === 0) return null;

  return (
    <text
      x={x}
      y={y}
      fill="#ffffff"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-[10px] font-extrabold select-none pointer-events-none"
    >
      {`${payload.funnelPercentage}%`}
    </text>
  );
};

export const Charts: React.FC = () => {
  const { candidates, jobs } = useRecruiterStore();
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isFunnelFilterOpen, setIsFunnelFilterOpen] = React.useState(false);
  const [isRangeOpen, setIsRangeOpen] = React.useState(false);

  // Decoupled local job filters for both charts
  const [overviewFilterJob, setOverviewFilterJob] = React.useState<string>('All Jobs');
  const [funnelFilterJob, setFunnelFilterJob] = React.useState<string>('All Jobs');

  // Interactive selected stage for candidates detail list in the funnel chart
  const [selectedStageDetails, setSelectedStageDetails] = React.useState<{ name: string; color: string } | null>(null);

  const isOverviewAllJobs = overviewFilterJob === 'All' || overviewFilterJob === 'All Jobs';
  const isFunnelAllJobs = funnelFilterJob === 'All' || funnelFilterJob === 'All Jobs';

  const [selectedRange, setSelectedRange] = React.useState<'7' | '30' | '90' | 'all'>('30');

  const rangeOptions: Array<{ value: '7' | '30' | '90' | 'all'; label: string; days: number | null }> = [
    { value: '7', label: 'Last 7 Days', days: 7 },
    { value: '30', label: 'Last 30 Days', days: 30 },
    { value: '90', label: 'Last 90 Days', days: 90 },
    { value: 'all', label: 'All Time', days: null }
  ];

  // 1. Filter candidates for Overview Chart
  const overviewFilteredCandidates = candidates.filter(
    c => isOverviewAllJobs || c.position === overviewFilterJob
  );

  // 2. Filter candidates for Funnel Chart
  const funnelFilteredCandidates = candidates.filter(
    c => isFunnelAllJobs || c.position === funnelFilterJob
  );

  // Dynamic funnel totals based on funnel filtered candidates
  const total = funnelFilteredCandidates.length;
  const screened = funnelFilteredCandidates.filter(c => ['Screening', 'Interviewing', 'Shortlisted', 'Hired'].includes(c.status)).length;
  const interviewed = funnelFilteredCandidates.filter(c => ['Interviewing', 'Shortlisted', 'Hired'].includes(c.status)).length;
  const shortlisted = funnelFilteredCandidates.filter(c => ['Shortlisted', 'Hired'].includes(c.status)).length;
  const hired = funnelFilteredCandidates.filter(c => c.status === 'Hired').length;

  const hireRate = total > 0 ? (hired / total) * 100 : 0.0;

  const funnelStages = [
    { num: 1, label: 'Applicants', count: total, percentage: 100 },
    { num: 2, label: 'Screened', count: screened, percentage: total > 0 ? Math.round((screened / total) * 100) : 0 },
    { num: 3, label: 'Interviewed', count: interviewed, percentage: total > 0 ? Math.round((interviewed / total) * 100) : 0 },
    { num: 4, label: 'Shortlisted', count: shortlisted, percentage: total > 0 ? Math.round((shortlisted / total) * 100) : 0 }
  ];

  const donutData = total === 0
    ? [{ name: 'No candidates', value: 1, rawValue: 0, funnelPercentage: 0, color: '#f1f5f9' }]
    : [
      { name: 'Applicants', value: total, rawValue: total, funnelPercentage: 100, color: '#2563eb' },
      { name: 'Screened', value: screened, rawValue: screened, funnelPercentage: total > 0 ? Math.round((screened / total) * 100) : 0, color: '#6366f1' },
      { name: 'Interviewed', value: interviewed, rawValue: interviewed, funnelPercentage: total > 0 ? Math.round((interviewed / total) * 100) : 0, color: '#0ea5e9' },
      { name: 'Shortlisted', value: shortlisted, rawValue: shortlisted, funnelPercentage: total > 0 ? Math.round((shortlisted / total) * 100) : 0, color: '#10b981' },
      { name: 'Hired', value: hired, rawValue: hired, funnelPercentage: total > 0 ? Math.round((hired / total) * 100) : 0, color: '#f59e0b' }
    ].filter(stage => stage.value > 0);

  const funnelStagesList = [
    { name: 'Applicants', count: total, percentage: 100, color: '#2563eb' },
    { name: 'Screened', count: screened, percentage: total > 0 ? Math.round((screened / total) * 100) : 0, color: '#6366f1' },
    { name: 'Interviewed', count: interviewed, percentage: total > 0 ? Math.round((interviewed / total) * 100) : 0, color: '#0ea5e9' },
    { name: 'Shortlisted', count: shortlisted, percentage: total > 0 ? Math.round((shortlisted / total) * 100) : 0, color: '#10b981' },
    { name: 'Hired', count: hired, percentage: total > 0 ? Math.round((hired / total) * 100) : 0, color: '#f59e0b' }
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
  overviewFilteredCandidates.forEach(cand => {
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

  const parseChartDate = (label: string) => {
    const parsed = new Date(`${label}, 2026`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const selectedRangeConfig = rangeOptions.find(option => option.value === selectedRange) || rangeOptions[1];
  const latestChartDate = dynamicOverviewData.reduce<Date | null>((latest, item) => {
    const itemDate = parseChartDate(item.name);
    if (!itemDate) return latest;
    if (!latest || itemDate.getTime() > latest.getTime()) return itemDate;
    return latest;
  }, null);

  const filteredOverviewData = selectedRangeConfig.days === null || !latestChartDate
    ? dynamicOverviewData
    : dynamicOverviewData.filter(item => {
      const itemDate = parseChartDate(item.name);
      if (!itemDate) return true;
      const diffDays = (latestChartDate.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= selectedRangeConfig.days!;
    });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] gap-4 md:gap-6">

      {/* 1. AI Recruitment Overview Area Chart */}
      <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-white border border-slate-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start mb-4 md:mb-6 min-w-0">
          <div>
            <h3 className="text-sm md:text-[15px] font-bold text-slate-900 leading-tight">AI Recruitment Overview</h3>
            <p className="text-[10px] md:text-[11px] text-slate-400 font-semibold mt-0.5 leading-snug max-w-[22rem]">
              30-day analytics pipeline performance{isOverviewAllJobs ? '' : ` for ${overviewFilterJob}`}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
            <div className="relative">
              <button
                onClick={() => {
                  setIsFilterOpen(false);
                  setIsRangeOpen(!isRangeOpen);
                }}
                className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-[10px] font-bold text-slate-600 whitespace-nowrap shrink-0"
              >
                <Calendar className={tw.iconSm} />
                <span>{selectedRangeConfig.label}</span>
              </button>

              {isRangeOpen && (
                <div className="absolute right-0 mt-1.5 w-40 rounded-xl bg-white border border-slate-100 shadow-[0_8px_24px_rgba(15,23,42,0.08)] p-1 z-50 text-slate-700">
                  {rangeOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedRange(option.value);
                        setIsRangeOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-[10px] font-bold transition-colors ${selectedRange === option.value ? 'bg-blue-50/50 text-blue-650' : 'hover:bg-slate-50'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl border transition-colors text-[10px] font-bold whitespace-nowrap shrink-0 ${!isOverviewAllJobs ? 'bg-blue-50 text-blue-755 border-blue-200' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
              >
                <Filter className={tw.iconSm} />
                <span className="truncate max-w-[10rem]">Filter{!isOverviewAllJobs ? `: ${overviewFilterJob}` : ''}</span>
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-1.5 w-56 max-w-[calc(100vw-2rem)] rounded-xl bg-white border border-slate-100 shadow-[0_8px_24px_rgba(15,23,42,0.08)] p-1 z-50 text-slate-700 max-h-60 overflow-y-auto">
                  <div className="px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-50">
                    Filter by Job Role
                  </div>
                  <button
                    onClick={() => {
                      setOverviewFilterJob('All Jobs');
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-[10px] font-bold transition-colors ${isOverviewAllJobs ? 'bg-blue-50/50 text-blue-650' : 'hover:bg-slate-50'}`}
                  >
                    All Jobs
                  </button>
                  {jobs.map(job => (
                    <button
                      key={job.id}
                      onClick={() => {
                        setOverviewFilterJob(job.title);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-[10px] font-bold transition-colors truncate ${overviewFilterJob === job.title ? 'bg-blue-50/50 text-blue-650' : 'hover:bg-slate-50'}`}
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
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-4 gap-y-2 mb-4 text-[10px] font-bold text-slate-400">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
            <span>Applications</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span>Hired</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
            <span>Interviews</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Shortlisted</span>
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="h-52 sm:h-64 w-full text-[10px] font-bold">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredOverviewData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 10 }} />
              <YAxis
                stroke="#94a3b8"
                tickLine={false}
                axisLine={false}
                domain={[0, 8]}
                ticks={[0, 2, 4, 6, 8]}
                tickFormatter={(value) => Math.round(Number(value)).toString()}
                tick={{ fontSize: 10 }}
              />
              <Tooltip
                formatter={(value, name) => [Math.round(Number(value)).toString(), String(name)]}
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
      <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-white border border-slate-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start mb-4">
          <div>
            <h3 className="text-sm md:text-[15px] font-bold text-slate-900 leading-tight">Hiring Conversion Funnel</h3>
            <p className="text-[10px] md:text-[11px] text-slate-400 font-semibold mt-0.5 leading-snug">
              Recruiting conversion yield across current hiring cycles
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap sm:flex-nowrap">
            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsFunnelFilterOpen(!isFunnelFilterOpen);
                }}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors text-[9px] font-bold whitespace-nowrap ${!isFunnelAllJobs ? 'bg-blue-50 text-blue-755 border-blue-200' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
              >
                <Filter className="w-2.5 h-2.5" />
                <span className="truncate max-w-[8rem]">{isFunnelAllJobs ? 'All Jobs' : funnelFilterJob}</span>
              </button>

              {isFunnelFilterOpen && (
                <div className="absolute right-0 mt-1.5 w-52 max-w-[calc(100vw-2rem)] rounded-xl bg-white border border-slate-100 shadow-[0_8px_24px_rgba(15,23,42,0.08)] p-1 z-50 text-slate-700 max-h-60 overflow-y-auto">
                  <div className="px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-50">
                    Filter by Job Role
                  </div>
                  <button
                    onClick={() => {
                      setFunnelFilterJob('All Jobs');
                      setIsFunnelFilterOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-[10px] font-bold transition-colors ${isFunnelAllJobs ? 'bg-blue-50/50 text-blue-650' : 'hover:bg-slate-50'}`}
                  >
                    All Jobs
                  </button>
                  {jobs.map(job => (
                    <button
                      key={job.id}
                      onClick={() => {
                        setFunnelFilterJob(job.title);
                        setIsFunnelFilterOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-[10px] font-bold transition-colors truncate ${funnelFilterJob === job.title ? 'bg-blue-50/50 text-blue-650' : 'hover:bg-slate-50'}`}
                    >
                      {job.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Centered Donut with Center Legend & Custom Labels */}
        <div className="flex-1 flex flex-col items-center justify-center py-2">
          <div className="relative h-[255px] sm:h-[275px] lg:h-[295px] w-full max-w-[295px] mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={84}
                  outerRadius={112}
                  paddingAngle={total === 0 ? 0 : 2}
                  dataKey="value"
                  stroke="#ffffff"
                  strokeWidth={total === 0 ? 0 : 2}
                  labelLine={false}
                  label={renderCustomizedLabel}
                  onClick={(data: any) => {
                    if (data && data.name) {
                      const stage = funnelStagesList.find(s => s.name === data.name);
                      if (stage) {
                        setSelectedStageDetails({ name: stage.name, color: stage.color });
                      }
                    }
                  }}
                >
                  {donutData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  position={{ x: 8, y: 8 }}
                  formatter={(value, name, item) => {
                    const raw = (item as any)?.payload?.rawValue ?? 0;
                    const pct = (item as any)?.payload?.funnelPercentage ?? 0;
                    return [`${raw} candidates (${pct}%)`, String(name)] as [string, string];
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

            {/* Legend inside the Donut Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="flex flex-col gap-1 w-full max-w-[130px] px-2 text-left pointer-events-auto">
                {funnelStagesList.map((stage) => (
                  <button
                    key={stage.name}
                    onClick={() => setSelectedStageDetails({ name: stage.name, color: stage.color })}
                    className="flex items-center gap-1.5 text-[9px] sm:text-[10px] leading-tight w-full cursor-pointer hover:bg-slate-50/80 p-0.5 rounded transition-colors text-left"
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: stage.color }} />
                    <span className="font-bold text-slate-650 truncate max-w-[60px]">{stage.name}</span>
                    <span className="ml-auto font-extrabold text-slate-850 shrink-0">
                      {stage.count}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400 shrink-0">
                      ({stage.percentage}%)
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Candidate List Popover */}
        {selectedStageDetails && (
          <div className="mt-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col gap-3 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedStageDetails(null)}
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-650 font-extrabold text-xs"
            >
              ✕
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: selectedStageDetails.color }} />
              <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider">
                {selectedStageDetails.name} Candidates ({
                  selectedStageDetails.name === 'Applicants' ? total :
                    selectedStageDetails.name === 'Screened' ? screened :
                      selectedStageDetails.name === 'Interviewed' ? interviewed :
                        selectedStageDetails.name === 'Shortlisted' ? shortlisted : hired
                })
              </h4>
            </div>

            <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
              {(() => {
                const list = funnelFilteredCandidates.filter(c => {
                  if (selectedStageDetails.name === 'Applicants') return true;
                  if (selectedStageDetails.name === 'Screened') return ['Screening', 'Interviewing', 'Shortlisted', 'Hired'].includes(c.status);
                  if (selectedStageDetails.name === 'Interviewed') return ['Interviewing', 'Shortlisted', 'Hired'].includes(c.status);
                  if (selectedStageDetails.name === 'Shortlisted') return ['Shortlisted', 'Hired'].includes(c.status);
                  if (selectedStageDetails.name === 'Hired') return c.status === 'Hired';
                  return false;
                });

                if (list.length === 0) {
                  return <p className="text-[9px] text-slate-400 font-semibold italic">No candidates in this stage.</p>;
                }

                return list.map(c => (
                  <div key={c.id} className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100/60 shadow-sm text-[10px] font-bold text-slate-700">
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-slate-800 text-[10px] truncate">{c.name}</span>
                      <span className="text-[9px] text-slate-450 font-semibold truncate">{c.position}</span>
                    </div>
                    <span className="text-[9px] font-extrabold text-indigo-600 bg-indigo-50/50 px-1.5 py-0.5 rounded border border-indigo-100 shrink-0">
                      {c.aiMatchScore}% Match
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
