'use client';

import React, { useEffect } from 'react';
import { useDashboardStore } from '../store';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  Video, 
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// Animated Counter component using Framer Motion
const AnimatedCounter: React.FC<{ value: number }> = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, value, { duration: 1.5, ease: 'easeOut' });
    return animation.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
};

// Custom lightweight SVG Sparkline
const Sparkline: React.FC<{ data: number[]; isPositive: boolean }> = ({ data, isPositive }) => {
  const width = 80;
  const height = 24;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const strokeColor = isPositive ? '#10b981' : '#f43f5e'; // Emerald vs Rose

  return (
    <svg width={width} height={height} className="overflow-visible opacity-80">
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export const KpiCards: React.FC = () => {
  const { candidates, jobs, alerts, liveInterviews } = useDashboardStore();

  const activeJobs = jobs.filter(j => j.status === 'Active').length;
  const totalCandidates = candidates.length;
  const liveInterviewsCount = liveInterviews.length;
  const activeAlerts = alerts.filter(a => !a.resolved).length;

  const cardData = [
    {
      title: 'Active Job Openings',
      value: activeJobs,
      icon: Briefcase,
      trend: '+4.2%',
      isPositive: true,
      sparkData: [12, 11, 13, 12, 14, 13, 14],
      color: 'from-blue-500/20 to-indigo-500/20',
      iconColor: 'text-indigo-400'
    },
    {
      title: 'Total Candidates',
      value: totalCandidates,
      icon: Users,
      trend: '+12.5%',
      isPositive: true,
      sparkData: [40, 42, 45, 43, 47, 49, 52],
      color: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-400'
    },
    {
      title: 'Interviews Today',
      value: liveInterviewsCount,
      icon: Video,
      trend: '-2.1%',
      isPositive: false,
      sparkData: [10, 8, 9, 7, 8, 10, 8],
      color: 'from-emerald-500/20 to-teal-500/20',
      iconColor: 'text-emerald-400'
    },
    {
      title: 'Security Alerts',
      value: activeAlerts,
      icon: ShieldAlert,
      trend: '-15%',
      isPositive: true, // down is positive for alerts
      sparkData: [8, 9, 6, 7, 5, 5, 4],
      color: 'from-rose-500/20 to-orange-500/20',
      iconColor: 'text-rose-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {cardData.map((card, i) => {
        const Icon = card.icon;
        
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`
              relative p-5 rounded-2xl overflow-hidden
              bg-slate-950/40 dark:bg-slate-950/40 light:bg-white
              border border-slate-900/60 dark:border-slate-900/60 light:border-slate-200/60
              shadow-[0_4px_30px_rgba(0,0,0,0.2)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] light:shadow-[0_4px_30px_rgba(0,0,0,0.05)]
              backdrop-blur-md
            `}
          >
            {/* Ambient Background Glow */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} blur-2xl opacity-40`} />

            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 light:text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-50 border border-slate-900 dark:border-slate-900 light:border-slate-100 ${card.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-white dark:text-white light:text-slate-900">
                <AnimatedCounter value={card.value} />
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-900/40 dark:border-slate-900/40 light:border-slate-100">
              <div className="flex items-center gap-1 text-[11px] font-semibold">
                {card.isPositive ? (
                  <span className="flex items-center gap-0.5 text-emerald-400 dark:text-emerald-400 light:text-emerald-600">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    {card.trend}
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 text-rose-400 dark:text-rose-400 light:text-rose-600">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    {card.trend}
                  </span>
                )}
                <span className="text-slate-500 dark:text-slate-500 light:text-slate-400">vs last week</span>
              </div>

              <Sparkline data={card.sparkData} isPositive={card.isPositive} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
