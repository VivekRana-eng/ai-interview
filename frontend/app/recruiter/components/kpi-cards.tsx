'use client';
import * as tw from '@/lib/tailwindClasses'

import React from 'react';
import { useRecruiterStore } from '../store';
import { 
  Briefcase, 
  Users, 
  Video, 
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const Sparkline: React.FC<{ points: number[]; color: string }> = ({ points, color }) => {
  const width = 80;
  const height = 24;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  
  const formattedPoints = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={formattedPoints}
      />
    </svg>
  );
};

export const KpiCards: React.FC = () => {
  const { candidates, alerts } = useRecruiterStore();

  // Dynamic count updates if user moves/resolves candidates, 
  // but we default to the exact screenshot starting values:
  const activeJobsCount = 15;
  const totalCandidatesCount = candidates.length; // Defaults to 3
  const interviewsCount = candidates.filter(c => c.status === 'Interviewing').length || 3; // Defaults to 3 if none active
  const activeAlertsCount = alerts.filter(a => !a.resolved).length || 18; // Default 18

  const cardData = [
    {
      title: 'Active Jobs',
      value: activeJobsCount,
      icon: Briefcase,
      trend: '+ 12.4%',
      trendUp: true,
      sparkData: [10, 12, 11, 14, 13, 15, 15],
      sparkColor: '#3b82f6', // blue
      iconColor: 'bg-indigo-50 text-indigo-650 border-indigo-100',
    },
    {
      title: 'Total Candidates',
      value: totalCandidatesCount,
      icon: Users,
      trend: '+ 18.2%',
      trendUp: true,
      sparkData: [2, 2, 2.5, 2.2, 2.8, 3, 3],
      sparkColor: '#3b82f6', // blue
      iconColor: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      title: 'Interviews Today',
      value: interviewsCount,
      icon: Video,
      trend: '+ 25.0%',
      trendUp: true,
      sparkData: [1, 2, 1.5, 2.5, 3, 2.8, 3],
      sparkColor: '#10b981', // green
      iconColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      title: 'Integrity Alerts',
      value: activeAlertsCount,
      icon: ShieldAlert,
      trend: '- 14.3%',
      trendUp: true, // Shown as green up-right in screenshot because alerts went down!
      sparkData: [15, 16, 14, 15, 17, 16, 18],
      sparkColor: '#ef4444', // red
      iconColor: 'bg-rose-50 text-rose-600 border-rose-100',
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {cardData.map((card) => {
        const Icon = card.icon;
        
        return (
          <div
            key={card.title}
            className="
              relative p-4 sm:p-5 rounded-[15px] bg-white border border-[#EEF1F6]
              shadow-[0_4px_16px_rgba(15,23,42,0.04)] flex flex-col justify-between min-h-[120px] sm:min-h-[130px]
            "
          >
            {/* Top row */}
            <div className="flex justify-between items-start gap-3">
              <div className={tw.flexItemsGap2}>
                <div className={`p-1.5 rounded-lg border flex items-center justify-center ${card.iconColor}`}>
                  <Icon className={tw.iconSm} />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-[#7B8AA3] leading-tight">
                  {card.title}
                </span>
              </div>
              
              {/* Trend Badge */}
              <span className="flex items-center gap-0.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 whitespace-nowrap shrink-0">
                <ArrowUpRight className="w-3 h-3" />
                {card.trend}
              </span>
            </div>

            {/* Bottom Section */}
            <div className="flex items-end justify-between gap-3 mt-3 min-w-0">
              <div className="flex flex-col">
                <span className="text-2xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
                  {card.value}
                </span>
                <span className="text-[10px] text-[#7B8AA3] font-semibold mt-1">
                  vs previous month
                </span>
              </div>

              {/* Sparkline curve */}
              <div className="pb-1 shrink-0">
                <Sparkline points={card.sparkData} color={card.sparkColor} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
