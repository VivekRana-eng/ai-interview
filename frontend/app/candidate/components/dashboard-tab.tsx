'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Calendar, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Award, 
  Bell, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  MessageSquareCode
} from 'lucide-react';

interface DashboardTabProps {
  onNavigate: (tab: string) => void;
  onStartInterview: () => void;
  applications?: any[];
}

const getCompanyLogo = (company: string) => {
  switch (company.toLowerCase()) {
    case 'google':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      );
    case 'stripe':
      return (
        <svg className="w-3.5 h-3.5 text-[#635BFF] dark:text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13.962 2.044c-1.84 0-3.376.993-3.376 3.01 0 3.275 4.542 2.753 4.542 4.195 0 .506-.448.74-1.094.74-.888 0-1.884-.338-2.603-.736l-.887 2.766c.86.492 2.128.847 3.471.847 1.897 0 3.472-.937 3.472-2.999 0-3.414-4.542-2.852-4.542-4.17 0-.464.394-.718 1.014-.718.732 0 1.603.253 2.222.592l.86-2.677c-.74-.408-1.89-.86-3.08-8.6zM6.557 5.679c.928 0 1.52.436 1.52 1.168 0 .971-.873 1.252-2.125 1.252H4.896V5.679h1.661zm.338 5.485c1.435 0 2.279-.69 2.279-1.927 0-1.393-.971-1.942-2.589-1.942H3.742V15h1.154v-3.836h1.999zM20.258 5.679h-4.321V15h1.154V6.847h3.167V5.679z" />
        </svg>
      );
    case 'vercel':
      return (
        <svg className="w-3.5 h-3.5 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 22.525H0L12 1.475L24 22.525Z" />
        </svg>
      );
    case 'github':
      return (
        <svg className="w-3.5 h-3.5 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      );
    default:
      return (
        <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">
          {company[0].toUpperCase()}
        </span>
      );
  }
};

export const DashboardTab: React.FC<DashboardTabProps> = ({ onNavigate, onStartInterview, applications = [] }) => {
  // Mock Candidate Details
  const candidateInfo = {
    name: 'Sarah Jenkins',
    avatar: '', // Fallback initials
    title: 'Senior Frontend Engineer candidate',
    resumeCompletion: 85,
    aiScore: 92,
    nextInterview: {
      role: 'Staff UI Engineer',
      date: 'Today at 4:30 PM',
      countdown: 'Starts in 45m 12s'
    }
  };

  const activeAppsCount = applications.filter(app => app.status !== 'Rejected' && app.status !== 'Offer').length;
  const completedInterviewsCount = applications.filter(app => app.status === 'Offer' || app.status === 'Rejected').length + 2;

  // Mock statistics cards
  const stats = [
    { name: 'Applied Jobs', value: applications.length, change: '+2 new this week', icon: Briefcase, color: 'text-blue-500 bg-blue-500/10' },
    { name: 'Active Applications', value: activeAppsCount, change: 'Under review & scheduled', icon: Clock, color: 'text-amber-500 bg-amber-500/10' },
    { name: 'Scheduled Interviews', value: applications.filter(app => app.status === 'Scheduled').length, change: '1 live today', icon: Calendar, color: 'text-indigo-500 bg-indigo-500/10' },
    { name: 'Completed Interviews', value: completedInterviewsCount, change: 'All feedback received', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
    { name: 'AI Feedback Reports', value: 5, change: 'Avg. AI Score: 88%', icon: BrainCircuit, color: 'text-violet-500 bg-violet-500/10' }
  ];

  // Slice down dynamically from state
  const recentApplications = applications.slice(0, 4).map(app => ({
    id: app.id,
    company: app.company,
    role: app.role,
    status: app.status,
    appliedDate: app.appliedDate,
    interviewDate: app.status === 'Scheduled' ? '2026-07-19' : 'Pending',
    score: app.aiScore
  }));

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 border-indigo-500/25';
      case 'Under Review': return 'bg-amber-50 dark:bg-amber-500/10 text-amber-500 border-amber-500/25';
      case 'In Progress': return 'bg-blue-50 dark:bg-blue-500/10 text-blue-500 border-blue-500/25';
      case 'Shortlisted': return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 border-emerald-500/25';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/25';
    }
  };

  const recentAppsHeader = recentApplications; // alias logic check fallback

  return (
    <div className="space-y-6 lg:space-y-8">
      
      {/* ─── 1. WELCOME CARD & COUNTDOWN CONTAINER ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile/Welcome Widget */}
        <div className="lg:col-span-2 bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-full shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
          <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-blue-500/5 blur-2xl" />
          
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg ring-1 ring-white/10">
                SJ
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-850 dark:text-white">Welcome back, Sarah!</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-450 ring-1 ring-emerald-500/25">Online</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Ready for your upcoming assessments? You have 1 interview scheduled for today.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#0d1424] px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Award className="w-5 h-5 text-indigo-400" />
              <div className="text-left">
                <span className="text-[9px] font-bold text-slate-500 block uppercase tracking-wider">AI Readiness Score</span>
                <span className="text-sm font-extrabold text-slate-850 dark:text-white">{candidateInfo.aiScore}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800/50">
            {/* Resume Completion Progress */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-bold">Resume Completion</span>
                <span className="text-xs font-extrabold text-blue-400">{candidateInfo.resumeCompletion}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000"
                  style={{ width: `${candidateInfo.resumeCompletion}%` }}
                />
              </div>
              <button 
                onClick={() => onNavigate('Resume')}
                className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-white font-bold inline-flex items-center gap-1 mt-2 transition-colors text-left"
              >
                Complete your profile details <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Profile Completion Call to Action */}
            <div className="flex items-center sm:justify-end">
              <button 
                onClick={() => onNavigate('My Profile')}
                className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold rounded-2xl transition-all shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
              >
                Edit Professional Profile
              </button>
            </div>
          </div>
        </div>

        {/* Live / Upcoming Interview Countdown widget */}
        <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
          <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-indigo-500/5 blur-2xl" />
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-450 uppercase tracking-widest ring-1 ring-rose-500/20">
                Next Evaluation
              </span>
              <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Live
              </div>
            </div>

            <h4 className="text-md font-bold text-slate-850 dark:text-white truncate">{candidateInfo.nextInterview.role}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold truncate mt-1">{candidateInfo.nextInterview.company}</p>
            
            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span className="text-xs text-slate-700 dark:text-slate-200 font-semibold">{candidateInfo.nextInterview.date}</span>
              </div>
              <span className="text-[11px] text-indigo-300 font-bold animate-pulse">{candidateInfo.nextInterview.countdown}</span>
            </div>
          </div>

          <button
            onClick={onStartInterview}
            className="w-full mt-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-2xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Enter Interview Room</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* ─── 2. STATS ROW ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider text-left">{stat.name}</span>
                <div className={`p-1.5 rounded-lg ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 text-left">
                <span className="text-xl font-extrabold text-slate-850 dark:text-white block">{stat.value}</span>
                <span className="text-[9px] font-semibold text-slate-500 mt-0.5 block truncate">{stat.change}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ─── 3. RECENT APPLICATIONS & SIDE PANELS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Applications Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800/60 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-850 dark:text-white">Recent Applications</h3>
            <button 
              onClick={() => onNavigate('My Applications')}
              className="text-xs text-blue-400 hover:text-blue-300 font-bold transition-colors"
            >
              View All Applications
            </button>
          </div>

          <div className="flex-1 overflow-x-auto min-h-0">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800/50 bg-slate-50 dark:bg-[#0d1424]">
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Status</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">AI Match</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider">Applied Date</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/40">
                {recentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/25 transition-colors group">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{app.role}</span>
                    </td>
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${getStatusStyle(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <span className="text-xs font-extrabold text-blue-400">{app.score}%</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{app.appliedDate}</span>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <button 
                        onClick={() => onNavigate('My Applications')}
                        className="text-xs text-slate-500 dark:text-slate-400 hover:text-white font-bold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-800/50 transition-all inline-flex items-center gap-1 active:scale-95"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest AI Feedback Summary & Notifications Panel */}
        <div className="space-y-6">
          
          {/* AI Feedback Summary Widget */}
          <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5">
              <BrainCircuit className="w-24 h-24 text-blue-500" />
            </div>

            <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-800/60 pb-3">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4.5 h-4.5 text-blue-400" />
                <h3 className="text-xs font-bold text-slate-850 dark:text-white">Latest AI Feedback</h3>
              </div>
              <button 
                onClick={() => onNavigate('AI Feedback')}
                className="text-[11px] text-blue-450 hover:text-blue-300 font-bold transition-colors"
              >
                Full Report
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase">Technical Skills</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-0.5 block">Excellent structure, high React proficiency</span>
                </div>
                <span className="text-xs font-extrabold text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-lg">94/100</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase">Communication</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-0.5 block">Articulate, nice pacing, structured delivery</span>
                </div>
                <span className="text-xs font-extrabold text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-lg">88/100</span>
              </div>

              <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-2xl text-left">
                <span className="text-[10px] font-bold text-blue-400 block uppercase mb-1">Key Suggestion</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
                  "Elaborate more on memory leaks and optimization strategies in React Concurrent Mode when explaining SSR hydration performance."
                </p>
              </div>
            </div>
          </div>

          {/* Recent Notifications Widget */}
          <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-5 shadow-sm">
            
            <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-800/60 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4.5 h-4.5 text-indigo-400" />
                <h3 className="text-xs font-bold text-slate-850 dark:text-white">Recent Notifications</h3>
              </div>
              <button 
                onClick={() => onNavigate('Notifications')}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="flex gap-3 text-left">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">Interview invitation confirmed</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Staff UI Engineer role</p>
                  <span className="text-[9px] text-slate-500 font-bold block mt-1">20 minutes ago</span>
                </div>
              </div>

              <div className="flex gap-3 text-left">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">AI Mock Assessment report generated</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">React Framework Practice Module &bull; Score: 92%</p>
                  <span className="text-[9px] text-slate-500 font-bold block mt-1">Today, 11:32 AM</span>
                </div>
              </div>

              <div className="flex gap-3 text-left opacity-70">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300">Application status updated to Under Review</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Senior Product Engineer &bull; Stripe</p>
                  <span className="text-[9px] text-slate-500 font-bold block mt-1">Yesterday</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
