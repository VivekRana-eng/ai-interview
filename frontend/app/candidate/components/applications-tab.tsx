'use client';

import React, { useState } from 'react';
import { Briefcase, Search, ExternalLink, Calendar, Award, CheckCircle, X } from 'lucide-react';

const getCompanyLogo = (company: string) => {
  switch (company.toLowerCase()) {
    case 'google':
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      );
    case 'stripe':
      return (
        <svg className="w-4 h-4 text-[#635BFF] dark:text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13.962 2.044c-1.84 0-3.376.993-3.376 3.01 0 3.275 4.542 2.753 4.542 4.195 0 .506-.448.74-1.094.74-.888 0-1.884-.338-2.603-.736l-.887 2.766c.86.492 2.128.847 3.471.847 1.897 0 3.472-.937 3.472-2.999 0-3.414-4.542-2.852-4.542-4.17 0-.464.394-.718 1.014-.718.732 0 1.603.253 2.222.592l.86-2.677c-.74-.408-1.89-.86-3.08-8.6zM6.557 5.679c.928 0 1.52.436 1.52 1.168 0 .971-.873 1.252-2.125 1.252H4.896V5.679h1.661zm.338 5.485c1.435 0 2.279-.69 2.279-1.927 0-1.393-.971-1.942-2.589-1.942H3.742V15h1.154v-3.836h1.999zM20.258 5.679h-4.321V15h1.154V6.847h3.167V5.679z" />
        </svg>
      );
    case 'vercel':
      return (
        <svg className="w-4 h-4 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 22.525H0L12 1.475L24 22.525Z" />
        </svg>
      );
    case 'github':
      return (
        <svg className="w-4 h-4 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      );
    case 'netflix':
      return (
        <svg className="w-4 h-4 text-[#E50914]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16.11 0l-3.83 9.7L8.4 0H5v24h3.56v-9.6L12.4 24h3.58V14.4l3.83 9.6H23.4V0h-7.29z" />
        </svg>
      );
    case 'amazon':
      return (
        <svg className="w-4 h-4 text-[#FF9900]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.177 15.688c-1.393.931-3.327 1.341-5.177 1.341-2.484 0-4.832-.781-6.425-2.138-.288-.246-.084-.666.262-.576 2.052.535 4.544.757 6.467.432 2.072-.349 3.931-1.328 5.173-2.607.234-.241.564-.007.388.24-.265.37-.887.893-1.688 1.308zm.971-2.31c-.161-.257-.552-.19-.506.113.111.722-.162 1.488-.748 1.95-.262.207-.058.552.222.428.89-.395 1.411-1.388 1.258-2.229-.029-.161-.131-.225-.226-.262z" />
        </svg>
      );
    default:
      return (
        <span className="font-black text-slate-800 dark:text-slate-200 text-xs">
          {company[0].toUpperCase()}
        </span>
      );
  }
};

const getDetailedData = (company: string, role: string) => {
  const normCompany = company.toLowerCase();
  
  const googleDetails = {
    summary: `Join Google's Next-Generation User Interfaces team. You will drive front-end scalability across Chrome DevTools pipelines and Google Cloud orchestration portals, focusing on heavy bundle virtualization and advanced concurrent processing metrics.`,
    breakdown: { tech: 96, sys: 92, comm: 90 },
    responsibilities: [
      "Design and maintain virtualized viewport structures serving 100,000+ items at 60 FPS.",
      "Collaborate with Chromium engineers to integrate direct memory metrics tracking inside React profiles.",
      "Diagnose and resolve hydrating concurrent rendering blocks on deep nested state trees.",
      "Spearhead security reviews on third-party JS packages and telemetry analytics modules."
    ],
    requirements: [
      "6+ years of client infrastructure engineering experience with solid web fundamentals.",
      "Expert knowledge of React Concurrent features, fiber schedules, and profiling utilities.",
      "Deep understanding of browser paint rendering algorithms, Reflow overhead, and Edge caches.",
      "Proven history of managing accessible user interfaces conforming to WCAG 2.1 AA specs."
    ],
    benefits: [
      "Top-of-market compensation: $180,000 - $245,000 base salary + equity grants + target bonus.",
      "Premium wellness panels, complete dental & vision care coverage (100% sponsored).",
      "Gourmet meals, home ergonomics allowance, and absolute freedom on hybrid schedule days."
    ]
  };

  const stripeDetails = {
    summary: `Become a key part of Stripe's Dashboard Infrastructure team. Build the checkout workflows and billing controls that process billions of secure requests daily for global merchants.`,
    breakdown: { tech: 94, sys: 88, comm: 92 },
    responsibilities: [
      "Architect micro-frontend modules supporting dynamic regional payment types with zero layout shifts.",
      "Improve dashboard visualization chart pipelines using native SVGs, Canvas, and optimized hooks.",
      "Verify integrity of state stores, ensuring robust session recovery when payment streams drop.",
      "Construct secure, proctored testing runners to validate dashboard updates before global production deploys."
    ],
    requirements: [
      "5+ years of software design experience specializing in client-side transactions logic.",
      "Demonstrated experience with TypeScript types systems, React closures, and security tokens.",
      "Familiarity with financial regulations, PCI-DSS guidelines, and browser request caching layers.",
      "Outstanding technical communication and product engineering user empathy."
    ],
    benefits: [
      "Strong starting salary: $170,000 - $220,000 base salary + Stripe options grants.",
      "Annual education stipends, home-office design grants, and full gym memberships.",
      "Unlimited paid time off, comprehensive parental leaves, and family insurance setups."
    ]
  };

  const genericDetails = {
    summary: `Exciting opportunity at ${company} as a ${role}. Work alongside cross-functional engineering pods to design, optimize, and build interactive client applications using cutting edge tech stacks.`,
    breakdown: { tech: 90, sys: 85, comm: 88 },
    responsibilities: [
      "Build highly responsive layouts using reusable UI frameworks and state controls.",
      "Write unit and integration tests to verify features across major evergreen browsers.",
      "Optimize network calls, code splitting bundles, and dynamic image loadings.",
      "Participate in daily agile stand-ups, code reviews, and project alignment syncs."
    ],
    requirements: [
      "4+ years of software engineering experience focusing on client-side modules.",
      "Strong proficiency with React, modern state stores (Zustand/Redux), and Tailwind CSS.",
      "Experience setting up CI/CD pipelines, package bundlers, and testing environments.",
      "Great team player mindset with proactive problem-solving patterns."
    ],
    benefits: [
      "Competitive salary package ($140,000 - $180,000) + equity shares + bonus structure.",
      "Generous health plans, retirement match plans, and flexible holidays allowance.",
      "Hybrid workspace access, tech gadgets allowance, and career development support."
    ]
  };

  if (normCompany.includes('google')) return googleDetails;
  if (normCompany.includes('stripe')) return stripeDetails;
  return genericDetails;
};

interface ApplicationsTabProps {
  applications: any[];
  setApplications: React.Dispatch<React.SetStateAction<any[]>>;
}

export const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ applications, setApplications }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Offer': return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 border-emerald-500/25';
      case 'Scheduled': return 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 border-indigo-500/25';
      case 'Under Review': return 'bg-amber-50 dark:bg-amber-500/10 text-amber-500 border-amber-500/25';
      case 'In Progress': return 'bg-blue-50 dark:bg-blue-500/10 text-blue-500 border-blue-500/25';
      case 'Shortlisted': return 'bg-teal-500/10 text-teal-500 border-teal-500/25';
      case 'Rejected': return 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 border-rose-500/25';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/25';
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.role.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 text-left">
      
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-5 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search applications..."
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800/60 rounded-2xl focus:border-blue-500 focus:outline-none font-semibold text-slate-700 dark:text-slate-200"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto hide-scrollbar">
          {['All', 'Under Review', 'Scheduled', 'In Progress', 'Shortlisted', 'Offer', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 ${
                statusFilter === status 
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/50 hover:bg-slate-100 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Applications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredApps.map((app) => (
          <div 
            key={app.id} 
            className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:border-slate-700/80 transition-all duration-300 relative overflow-hidden"
          >
            <div className="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full bg-blue-500/5 blur-2xl" />
            
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-[#1d2942] border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-sm">
                    {getCompanyLogo(app.company)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-tight group-hover:text-blue-400">{app.role}</h4>
                    <span className="text-xs text-blue-400 font-bold block mt-1">{app.company} &bull; <span className="text-slate-500 dark:text-slate-400">{app.location}</span></span>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStatusStyle(app.status)}`}>
                  {app.status}
                </span>
              </div>

              <hr className="border-slate-150 dark:border-slate-800/40 my-3" />

              <div className="grid grid-cols-2 gap-4 text-xs font-semibold mt-3">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider mb-0.5">Applied Date</span>
                  <span className="text-slate-600 dark:text-slate-300 font-bold">{app.appliedDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider mb-0.5">AI Match Match</span>
                  <span className="text-blue-400 font-extrabold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    {app.aiScore}% Match
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-150 dark:border-slate-800/40 flex gap-2">
              <button 
                onClick={() => setSelectedApp(app)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 active:scale-95"
              >
                <span>View Details</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              {app.status === 'Scheduled' && (
                <button className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/10 active:scale-95">
                  Launch Interview
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Mock details Modal */}
      {selectedApp && (() => {
        const details = getDetailedData(selectedApp.company, selectedApp.role);
        return (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 lg:p-8 max-w-xl w-full space-y-5 shadow-2xl text-left relative overflow-y-auto max-h-[90vh]">
              
              <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-[#1d2942] border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-sm shrink-0">
                    {getCompanyLogo(selectedApp.company)}
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-blue-500 uppercase tracking-widest block">Application Details</span>
                    <h3 className="text-md font-bold text-slate-850 dark:text-white mt-0.5">{selectedApp.role}</h3>
                    <p className="text-xs text-slate-500 font-semibold">{selectedApp.company} &bull; {selectedApp.location}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all active:scale-95 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
                
                {/* AI Score Breakdown metrics */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-150 dark:border-slate-800/60 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">AI Scorecard Breakdown</span>
                    <span className="text-xs font-extrabold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-lg">{selectedApp.aiScore}% Match</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl">
                      <span className="text-[9px] text-slate-400 block font-bold">Tech Skill</span>
                      <span className="text-xs font-bold text-indigo-400 mt-0.5 block">{details.breakdown.tech}%</span>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl">
                      <span className="text-[9px] text-slate-400 block font-bold">System Design</span>
                      <span className="text-xs font-bold text-blue-400 mt-0.5 block">{details.breakdown.sys}%</span>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl">
                      <span className="text-[9px] text-slate-400 block font-bold">Communication</span>
                      <span className="text-xs font-bold text-emerald-400 mt-0.5 block">{details.breakdown.comm}%</span>
                    </div>
                  </div>
                </div>

                {/* Role Description */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-extrabold tracking-wider block">Role Summary</span>
                  <p className="font-semibold text-slate-700 dark:text-slate-350">{details.summary}</p>
                </div>

                {/* Responsibilities */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-extrabold tracking-wider block">Primary Responsibilities</span>
                  <ul className="list-disc list-outside pl-4 space-y-1 text-slate-700 dark:text-slate-300">
                    {details.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>

                {/* Requirements */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-extrabold tracking-wider block">Candidate Requirements</span>
                  <ul className="list-disc list-outside pl-4 space-y-1 text-slate-700 dark:text-slate-300">
                    {details.requirements.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-extrabold tracking-wider block">Benefits & Perks</span>
                  <ul className="list-disc list-outside pl-4 space-y-1 text-slate-700 dark:text-slate-300">
                    {details.benefits.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>

              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800/60 flex gap-3">
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-2xl transition-all shadow-md shadow-blue-600/10 active:scale-95"
                >
                  Close Application Details
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};
