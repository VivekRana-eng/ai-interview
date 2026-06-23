'use client';

import React, { useState } from 'react';
import { useRecruiterStore } from './store';
import { Sidebar } from './components/sidebar';
import { Navbar } from './components/navbar';
import { KpiCards } from './components/kpi-cards';
import { Charts } from './components/charts';
import { LiveMonitor } from './components/live-monitor';
import { AlertsPanel } from './components/alerts-panel';
import { EvaluationsTable } from './components/evaluations-table';
import { InteractiveFlow } from './components/interactive-flow';
import { motion } from 'framer-motion';

export default function RecruiterDashboard() {
  const { activeTab } = useRecruiterStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-800 flex overflow-x-hidden font-sans antialiased">
      
      {/* 1. Navigation Sidebar (Dark Mode) */}
      <Sidebar 
        isOpen={mobileSidebarOpen} 
        onClose={() => setMobileSidebarOpen(false)} 
      />

      {/* 2. Main content area frame (Light Mode) */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Utilities */}
        <Navbar onMenuClick={() => setMobileSidebarOpen(true)} />

        {/* Viewport Frame */}
        <main className="flex-1 p-4 lg:p-8 space-y-6 lg:space-y-8 overflow-y-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 lg:space-y-8"
          >
            {activeTab === 'Dashboard' && (
              <>
                {/* Statistics Cards */}
                <KpiCards />

                {/* Analytical Charts */}
                <Charts />

                {/* Live Monitor and AI Alerts row */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                  <div className="xl:col-span-2">
                    <LiveMonitor />
                  </div>
                  <div className="xl:col-span-1">
                    <AlertsPanel />
                  </div>
                </div>

                {/* Evaluations Grid */}
                <EvaluationsTable />

                {/* Progression Timelines Flow */}
                <InteractiveFlow />
              </>
            )}

            {/* Other navigation tab fallbacks */}
            {activeTab === 'Jobs' && (
              <div className="p-8 bg-white border border-slate-100/80 rounded-2xl shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-2">Job Openings</h3>
                <p className="text-xs text-slate-400 font-semibold">Active job roles screening database.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {['AI / Machine Learning Researcher', 'Senior Full Stack Engineer', 'Security Engineer (DevSecOps)'].map((job) => (
                    <div key={job} className="p-4 rounded-xl border border-slate-150 bg-slate-50 flex justify-between items-center text-xs font-bold text-slate-700">
                      <span>{job}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px]">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Question Bank' && (
              <div className="p-8 bg-white border border-slate-100/80 rounded-2xl shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-2">Recruitment Question Bank</h3>
                <p className="text-xs text-slate-400 font-semibold">Pre-configured timed screening templates database.</p>
              </div>
            )}

            {activeTab === 'Candidates' && <InteractiveFlow />}

            {activeTab === 'Live Interviews' && <LiveMonitor />}

            {activeTab === 'Evaluation Reports' && <EvaluationsTable />}

            {activeTab === 'Integrity Dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <AlertsPanel />
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-100/80 shadow-sm text-xs space-y-4">
                  <h4 className="font-bold text-slate-800">Violation Analytics</h4>
                  <p className="text-slate-400 font-semibold">Telemetry details logged during applicant tests.</p>
                </div>
              </div>
            )}

            {activeTab === 'Billing & Settings' && (
              <div className="p-8 bg-white border border-slate-100/80 rounded-2xl shadow-sm text-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800 mb-2">Billing & Account Settings</h3>
                <p className="text-slate-400 font-semibold">Review your enterprise billing periods, active limits and tokens.</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
