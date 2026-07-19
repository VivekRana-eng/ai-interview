'use client';

import React from 'react';
import { TrendingUp, BookOpen, ExternalLink, Award, Sparkles } from 'lucide-react';

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
    case 'netflix':
      return (
        <svg className="w-3.5 h-3.5 text-[#E50914]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16.11 0l-3.83 9.7L8.4 0H5v24h3.56v-9.6L12.4 24h3.58V14.4l3.83 9.6H23.4V0h-7.29z" />
        </svg>
      );
    case 'amazon':
      return (
        <svg className="w-3.5 h-3.5 text-[#FF9900]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.177 15.688c-1.393.931-3.327 1.341-5.177 1.341-2.484 0-4.832-.781-6.425-2.138-.288-.246-.084-.666.262-.576 2.052.535 4.544.757 6.467.432 2.072-.349 3.931-1.328 5.173-2.607.234-.241.564-.007.388.24-.265.37-.887.893-1.688 1.308zm.971-2.31c-.161-.257-.552-.19-.506.113.111.722-.162 1.488-.748 1.95-.262.207-.058.552.222.428.89-.395 1.411-1.388 1.258-2.229-.029-.161-.131-.225-.226-.262z" />
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

import { useRecruiterStore } from '../../recruiter/store';

const getCompanyForJob = (jobTitle: string, jobId: string | number) => {
  const title = jobTitle.toLowerCase();
  if (title.includes('machine learning') || title.includes('ai') || title.includes('researcher')) {
    return { company: 'Google', logo: 'Google' };
  }
  if (title.includes('full stack') || title.includes('product engineer') || title.includes('stripe')) {
    return { company: 'Stripe', logo: 'Stripe' };
  }
  if (title.includes('security') || title.includes('devsecops') || title.includes('vercel')) {
    return { company: 'Vercel', logo: 'Vercel' };
  }
  if (title.includes('design') || title.includes('relations') || title.includes('github')) {
    return { company: 'GitHub', logo: 'GitHub' };
  }
  if (title.includes('hr') || title.includes('architect') || title.includes('netflix')) {
    return { company: 'Netflix', logo: 'Netflix' };
  }
  
  const companies = [
    { company: 'Google', logo: 'Google' },
    { company: 'Stripe', logo: 'Stripe' },
    { company: 'Vercel', logo: 'Vercel' },
    { company: 'GitHub', logo: 'GitHub' },
    { company: 'Netflix', logo: 'Netflix' },
    { company: 'Amazon', logo: 'Amazon' }
  ];
  const index = typeof jobId === 'number' ? jobId : parseInt(String(jobId).replace(/\D/g, '')) || 0;
  return companies[index % companies.length];
};

interface InsightsTabProps {
  onApplyJob: (company: string, role: string, score: string, location: string) => void;
  appliedJobKeys: string[];
}

export const InsightsTab: React.FC<InsightsTabProps> = ({ onApplyJob, appliedJobKeys }) => {
  const { jobs } = useRecruiterStore();
  const skillGaps = [
    { skill: 'React Concurrent Mode', gap: 'Low Gap', level: 90, target: 95 },
    { skill: 'Docker & Microservices', gap: 'Medium Gap', level: 50, target: 80 },
    { skill: 'Next.js App Routing', gap: 'No Gap', level: 95, target: 90 },
    { skill: 'Performance Benchmarking', gap: 'Medium Gap', level: 60, target: 85 },
    { skill: 'System Design & Scalability', gap: 'Low Gap', level: 75, target: 85 },
    { skill: 'Web Security (OWASP)', gap: 'High Gap', level: 40, target: 80 }
  ];

  const roadmapSteps = [
    { title: 'Step 1: Edge Computing & Caching', desc: 'Read Vercel data prefetching specs and understand middleware routing hooks to optimize SSR rendering speeds.' },
    { title: 'Step 2: Micro-frontend Architecture', desc: 'Build federated bundle pipelines using Webpack 5 Module Federation config to allow modular UI deployment.' },
    { title: 'Step 3: Dockerize Dev Env', desc: 'Write multi-stage Dockerfiles caching frontend node_modules and setup secure dev configurations.' },
    { title: 'Step 4: API Rate Limiting & Gateway', desc: 'Configure rate limit middleware (Token Bucket algorithm) to shield internal APIs against brute requests.' },
    { title: 'Step 5: E2E Testing Suite', desc: 'Write comprehensive user flows using Playwright and Jest Testing Library to guarantee regression resistance.' }
  ];

  const suggestedJobs = jobs.map(job => {
    const companyInfo = getCompanyForJob(job.title, job.id);
    const index = typeof job.id === 'number' ? job.id : parseInt(String(job.id).replace(/\D/g, '')) || 0;
    const score = 85 + (index % 13);
    return {
      company: companyInfo.company,
      role: job.title,
      score: `${score}% match`,
      location: job.location
    };
  });

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Skill Gap Analysis */}
        <div className="lg:col-span-2 bg-white border border-slate-200 dark:border-slate-800/85 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-800/40 pb-3">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-850 dark:text-white">Skill Gap Analysis</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            {skillGaps.map((item) => (
              <div key={item.skill} className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-200 truncate max-w-[170px]" title={item.skill}>{item.skill}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg ${
                    item.gap === 'No Gap' 
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500' 
                      : item.gap === 'Low Gap' 
                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-500' 
                        : 'bg-amber-50 dark:bg-amber-500/10 text-amber-500'
                  }`}>{item.gap}</span>
                </div>
                
                <div className="relative w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  {/* Target level line indicator marker */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10" 
                    style={{ left: `${item.target}%` }}
                    title={`Target level: ${item.target}%`}
                  />
                  {/* Current level bar */}
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse" 
                    style={{ width: `${item.level}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                  <span>Current: {item.level}%</span>
                  <span>Required: {item.target}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="bg-white border border-slate-200 dark:border-slate-800/85 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-800/40 pb-3">
            <Sparkles className="w-4.5 h-4.5 text-blue-400" />
            <h3 className="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider">AI Recommended Jobs</h3>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
            {suggestedJobs.map((job) => (
              <div 
                key={job.company + '-' + job.role}
                className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-800/60 rounded-2xl space-y-1.5 hover:border-blue-500/50 transition-colors"
              >
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-bold text-slate-855 dark:text-white truncate">{job.role}</span>
                  </div>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-450 ring-1 ring-blue-500/15 shrink-0">{job.score}</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{job.company} &bull; {job.location}</p>
                <div>
                  {appliedJobKeys.includes((job.company + '-' + job.role).toLowerCase()) ? (
                    <span className="text-[10px] text-emerald-500 font-bold inline-flex items-center gap-1 mt-0.5">
                      Applied &bull; Under Review
                    </span>
                  ) : (
                    <button 
                      onClick={() => onApplyJob(job.company, job.role, job.score, job.location)}
                      className="text-[10px] text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-1 mt-0.5 transition-colors active:scale-95"
                    >
                      Apply Now <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Learning Roadmap */}
      <div className="bg-white border border-slate-200 dark:border-slate-800/85 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5 border-b border-slate-150 dark:border-slate-800/40 pb-3">
          <BookOpen className="w-4.5 h-4.5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-850 dark:text-white">Suggested Learning Roadmap</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {roadmapSteps.map((step, i) => (
            <div key={step.title} className="relative p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800/60 rounded-2xl space-y-2 flex flex-col justify-between hover:border-blue-500/30 transition-all">
              <div>
                <span className="text-[9px] font-extrabold text-blue-400 uppercase tracking-widest block">{step.title}</span>
                <h4 className="text-xs font-bold text-slate-850 dark:text-white mt-1">{step.title.split(': ')[1]}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mt-1.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
