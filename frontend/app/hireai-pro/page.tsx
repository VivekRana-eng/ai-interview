'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardStore } from './store';
import { Sidebar } from './components/sidebar';
import { Navbar } from './components/navbar';
import { KpiCards } from './components/kpi-cards';
import { Charts } from './components/charts';
import { KanbanBoard } from './components/kanban';
import { InterviewsTable } from './components/interviews-table';
import { LiveMonitor } from './components/live-monitor';
import { AlertsPanel } from './components/alerts-panel';
import { motion } from 'framer-motion';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function HireAiProDashboard() {
  const { activeTab, searchVal, setSearchVal } = useDashboardStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulate dashboard loading skeleton state
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Simulating an interactive error boundary trigger
  const hasError = searchVal.toLowerCase() === 'error';

  if (hasError) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-200">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-4 animate-bounce">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Simulated Dashboard Crash</h2>
        <p className="text-sm text-slate-400 max-w-sm mb-6">
          You entered 'error' in the search bar. This triggers a visual error state to demonstrate robustness.
        </p>
        <button
          onClick={() => setSearchVal('')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20"
        >
          <RotateCcw className="w-4 h-4" /> Reset Search
        </button>
      </div>
    );
  }

  // Render Loader Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex">
        <div className="w-64 bg-slate-950/80 border-r border-slate-900 hidden lg:block p-6 space-y-4">
          <div className="h-8 bg-slate-900 rounded-lg animate-pulse w-3/4" />
          <div className="space-y-2.5 pt-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 bg-slate-900 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="h-16 bg-slate-950 border-b border-slate-900 animate-pulse" />
          <div className="p-6 lg:p-8 space-y-6 flex-1 bg-slate-950">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 bg-slate-900 rounded-2xl animate-pulse" />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 h-80 bg-slate-900 rounded-2xl animate-pulse" />
              <div className="h-80 bg-slate-900 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-x-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Navigation Sidebar */}
      <Sidebar 
        isOpen={mobileSidebarOpen} 
        onClose={() => setMobileSidebarOpen(false)} 
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <Navbar onMenuClick={() => setMobileSidebarOpen(true)} />

        {/* View Port Panel */}
        <main className="flex-1 p-4 lg:p-8 space-y-6 lg:space-y-8 overflow-y-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6 lg:space-y-8"
          >
            {activeTab === 'Dashboard' && (
              <>
                <KpiCards />
                <Charts />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <LiveMonitor />
                  <AlertsPanel />
                </div>
                <InterviewsTable />
              </>
            )}

            {activeTab === 'Jobs' && (
              <div className="p-6 bg-slate-950/40 border border-slate-900 rounded-2xl">
                <h3 className="text-sm font-bold text-white mb-2">Job Profiles Management</h3>
                <p className="text-xs text-slate-500">Recruiter portal dashboard is currently filtering active roles.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {['Senior React Engineer', 'Fullstack Developer', 'UI/UX Designer'].map((job, idx) => (
                    <div key={job} className="p-4 rounded-xl border border-slate-900 bg-slate-900/40">
                      <span className="text-xs font-bold text-white">{job}</span>
                      <p className="text-[10px] text-slate-500 mt-1">Engineering Dept • Active</p>
                      <div className="mt-4 flex justify-between items-center text-[10px] font-bold text-indigo-400">
                        <span>{12 - idx} Applications</span>
                        <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">Manage</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Question Bank' && (
              <div className="p-6 bg-slate-950/40 border border-slate-900 rounded-2xl">
                <h3 className="text-sm font-bold text-white mb-2">System Question Bank</h3>
                <p className="text-xs text-slate-500">Timed screening & interview questions database.</p>
                <div className="space-y-2 mt-6">
                  {['Coding: Reverse a linked list in place', 'System Design: Design an image scaling backend', 'Behavioral: Resolving conflict between Product & Eng'].map((q, idx) => (
                    <div key={q} className="p-3 rounded-xl border border-slate-900 bg-slate-900/20 flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-semibold">{q}</span>
                      <span className="text-[9px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-bold text-slate-400">Lvl {idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Candidates' && <KanbanBoard />}

            {activeTab === 'Live Interviews' && <LiveMonitor />}

            {activeTab === 'Evaluation Reports' && <InterviewsTable />}

            {activeTab === 'Integrity Dashboard' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <AlertsPanel />
                </div>
                <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-900 shadow-lg flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Integrity Statistics</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Automated violations summary</p>
                  </div>
                  <div className="space-y-3.5 my-6 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Eye Gaze Anomaly</span>
                      <span className="font-bold text-white">12 Events</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Tab-switching block</span>
                      <span className="font-bold text-white">8 Events</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Voice similarity mismatch</span>
                      <span className="font-bold text-white">2 Events</span>
                    </div>
                  </div>
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[10px] text-indigo-400 font-semibold">
                    Telemetry analysis captures and flags candidate desktop activities during assessment.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Billing & Settings' && (
              <div className="p-6 bg-slate-950/40 border border-slate-900 rounded-2xl text-xs space-y-4">
                <h3 className="text-sm font-bold text-white mb-2">Billing & Account Settings</h3>
                <p className="text-slate-500">Configure your recruiting credits, API integrations and team permissions.</p>
                <div className="h-px bg-slate-900 my-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/20">
                    <span className="font-bold text-slate-300">Selected Plan</span>
                    <p className="text-2xl font-bold text-white mt-2">Enterprise Plus</p>
                    <p className="text-[10px] text-slate-500 mt-1">Includes unlimited AI evaluations per active slot.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/20">
                    <span className="font-bold text-slate-300">Credits Remaining</span>
                    <p className="text-2xl font-bold text-white mt-2">1,240 / 5,000</p>
                    <p className="text-[10px] text-slate-500 mt-1">Auto-renews on the 1st of next month.</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
