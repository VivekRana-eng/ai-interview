'use client';

import React from 'react';
import { useDashboardStore } from '../store';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowDown } from 'lucide-react';

// Generates 30 days of mock timeline data
const generateTimelineData = () => {
  const data = [];
  const startDay = 23; // match current date
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    
    // Smooth upward trend with weekend drops
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const base = 30 + (29 - i) * 1.5;
    const apps = isWeekend ? Math.floor(base * 0.3) : Math.floor(base + Math.sin(i) * 5);
    const ints = isWeekend ? Math.floor(base * 0.1) : Math.floor(base * 0.6 + Math.sin(i + 1) * 3);
    const short = isWeekend ? Math.floor(base * 0.05) : Math.floor(base * 0.3 + Math.sin(i + 2) * 2);
    const hired = isWeekend ? 0 : Math.floor(base * 0.1 + Math.sin(i + 3) * 1);

    data.push({
      name: label,
      Applications: apps,
      Interviews: ints,
      Shortlisted: short,
      Hired: hired,
    });
  }
  return data;
};

const TIMELINE_DATA = generateTimelineData();

export const Charts: React.FC = () => {
  const { candidates } = useDashboardStore();

  // Dynamic funnel calculation
  const total = candidates.length;
  const screened = candidates.filter(c => ['Screening', 'Interviewing', 'Shortlisted', 'Hired'].includes(c.status)).length;
  const interviewed = candidates.filter(c => ['Interviewing', 'Shortlisted', 'Hired'].includes(c.status)).length;
  const shortlisted = candidates.filter(c => ['Shortlisted', 'Hired'].includes(c.status)).length;
  const hired = candidates.filter(c => c.status === 'Hired').length;

  const funnelStages = [
    { label: 'Applicants', count: total, color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
    { label: 'Screened', count: screened, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { label: 'Interviewed', count: interviewed, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    { label: 'Shortlisted', count: shortlisted, color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
    { label: 'Hired', count: hired, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 30-Day Recruiter Overview Area Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="lg:col-span-2 p-5 rounded-2xl bg-slate-950/40 dark:bg-slate-950/40 light:bg-white border border-slate-900/60 dark:border-slate-900/60 light:border-slate-200/60 shadow-[0_4px_30px_rgba(0,0,0,0.2)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] light:shadow-[0_4px_30px_rgba(0,0,0,0.05)] backdrop-blur-md"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
              AI Recruitment Overview <TrendingUp className="w-4 h-4 text-indigo-400" />
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">30-day analytics of applications vs hiring metrics</p>
          </div>
        </div>

        <div className="h-72 w-full text-xs font-semibold">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TIMELINE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorInts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorShort" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorHired" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
              <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#090d16', 
                  borderColor: '#1e293b', 
                  borderRadius: '12px',
                  color: '#f8fafc' 
                }} 
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area type="monotone" dataKey="Applications" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" />
              <Area type="monotone" dataKey="Interviews" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorInts)" />
              <Area type="monotone" dataKey="Shortlisted" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorShort)" />
              <Area type="monotone" dataKey="Hired" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorHired)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Dynamic Recruitment Funnel */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="p-5 rounded-2xl bg-slate-950/40 dark:bg-slate-950/40 light:bg-white border border-slate-900/60 dark:border-slate-900/60 light:border-slate-200/60 shadow-[0_4px_30px_rgba(0,0,0,0.2)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] light:shadow-[0_4px_30px_rgba(0,0,0,0.05)] backdrop-blur-md flex flex-col justify-between"
      >
        <div>
          <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900">Hiring Conversion Funnel</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Recruitment pass rates by pipeline stages</p>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-1.5 py-4">
          {funnelStages.map((stage, idx) => {
            const conversion = total > 0 ? (stage.count / total) * 100 : 0;
            const widthPct = Math.max(conversion, 8); // Minimum width for labels
            
            return (
              <React.Fragment key={stage.label}>
                {idx > 0 && (
                  <div className="flex justify-center -my-0.5">
                    <ArrowDown className="w-3.5 h-3.5 text-slate-700 animate-pulse" />
                  </div>
                )}
                <div className="w-full flex items-center justify-between">
                  {/* Label & Count */}
                  <span className="text-[10px] font-bold text-slate-400 w-20">{stage.label}</span>
                  
                  {/* Funnel Bar */}
                  <div className="flex-1 bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 rounded-lg h-7 relative border border-slate-900 dark:border-slate-900 light:border-slate-200 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full border-r ${stage.color} rounded-l-md flex items-center justify-end pr-2`}
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-white dark:text-white light:text-slate-800">
                      {stage.count}
                    </span>
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                      {conversion.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
