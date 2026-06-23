'use client';

import React from 'react';
import { useRecruiterStore } from '../store';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid
} from 'recharts';
import { ChevronDown, Calendar, Filter, Sparkles } from 'lucide-react';

const OVERVIEW_DATA = [
  { name: 'Jun 18', Applications: 4, Interviews: 1.2, Shortlisted: 0.2, Hired: 0.1 },
  { name: 'Jun 19', Applications: 3, Interviews: 2.1, Shortlisted: 0.8, Hired: 0.2 },
  { name: 'Jun 20', Applications: 6.2, Interviews: 3.5, Shortlisted: 1.9, Hired: 0.4 },
];

export const Charts: React.FC = () => {
  const { candidates } = useRecruiterStore();

  // Dynamic funnel totals based on Zustand candidates
  const total = candidates.length;
  const screened = candidates.filter(c => ['Screening', 'Interviewing', 'Shortlisted', 'Hired'].includes(c.status)).length;
  const interviewed = candidates.filter(c => ['Interviewing', 'Shortlisted', 'Hired'].includes(c.status)).length;
  const shortlisted = candidates.filter(c => ['Shortlisted', 'Hired'].includes(c.status)).length;
  const hired = candidates.filter(c => c.status === 'Hired').length;

  const hireRate = total > 0 ? (hired / total) * 100 : 0.0;

  const funnelStages = [
    { num: 1, label: 'Applicants', count: total, percentage: 100, color: 'bg-blue-600/90 text-white' },
    { num: 2, label: 'Screened', count: screened, percentage: total > 0 ? Math.round((screened / total) * 100) : 0, color: 'bg-sky-500/90 text-white' },
    { num: 3, label: 'Interviewed', count: interviewed, percentage: total > 0 ? Math.round((interviewed / total) * 100) : 0, color: 'bg-amber-500/95 text-white' },
    { num: 4, label: 'Shortlisted', count: shortlisted, percentage: total > 0 ? Math.round((shortlisted / total) * 100) : 0, color: 'bg-purple-600/90 text-white' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. AI Recruitment Overview Area Chart */}
      <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">AI Recruitment Overview</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">30-day analytics pipeline performance</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-[10px] font-bold text-slate-600">
              <Calendar className="w-3.5 h-3.5" />
              <span>Last 30 Days</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-[10px] font-bold text-slate-600">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>
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
            <AreaChart data={OVERVIEW_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorInts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorShort" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorHired" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
              <Area type="monotone" dataKey="Applications" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" />
              <Area type="monotone" dataKey="Interviews" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorInts)" />
              <Area type="monotone" dataKey="Shortlisted" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorShort)" />
              <Area type="monotone" dataKey="Hired" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorHired)" />
            </AreaChart>
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

        {/* Funnel Rows */}
        <div className="flex-1 flex flex-col justify-center gap-2">
          {funnelStages.map((stage, idx) => (
            <React.Fragment key={stage.label}>
              {idx > 0 && (
                <div className="flex justify-center -my-0.5">
                  <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                </div>
              )}
              <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl ${stage.color} text-xs font-bold shadow-sm`}>
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-extrabold">{stage.num}</span>
                  <span>{stage.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-white/70 uppercase tracking-wider font-extrabold">{stage.count} {stage.count === 1 ? 'Candidate' : 'Candidates'}</span>
                  <span className="text-white font-extrabold">{stage.percentage}%</span>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
