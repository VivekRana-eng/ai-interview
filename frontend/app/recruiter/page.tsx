'use client';

import React, { useState, useEffect } from 'react';
import { useRecruiterStore } from './store';
import { Sidebar } from './components/sidebar';
import { Navbar } from './components/navbar';
import { KpiCards } from './components/kpi-cards';
import { Charts } from './components/charts';
import { LiveMonitor } from './components/live-monitor';
import { AlertsPanel } from './components/alerts-panel';
import { EvaluationsTable } from './components/evaluations-table';
import { InteractiveFlow } from './components/interactive-flow';
import { JobsPanel } from './components/jobs-panel';
import { QuestionBankPanel } from './components/question-bank-panel';
import { ResumeScreener } from './components/resume-screener';
import { motion } from 'framer-motion';

export default function RecruiterDashboard() {
  const { activeTab, initializeStore, isJobOverlayOpen } = useRecruiterStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <div className="h-screen bg-white text-slate-800 flex overflow-hidden font-sans antialiased">

      {/* 1. Navigation Sidebar (Dark Mode) */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* 2. Main content area frame (Light Mode) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[228px] h-full">

        {/* Top Header Utilities */}
        <Navbar onMenuClick={() => setMobileSidebarOpen(true)} />

        {/* Viewport Frame */}
        <main className="flex-1 p-4 lg:p-8 space-y-6 lg:space-y-8 overflow-y-auto min-h-0">
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

            {activeTab === 'Jobs' && <JobsPanel />}

            {activeTab === 'Question Bank' && <QuestionBankPanel />}

            {activeTab === 'Candidates' && <ResumeScreener />}

            {activeTab === 'Live Interviews' && <LiveMonitor />}

            {activeTab === 'Evaluation Reports' && <EvaluationsTable />}

            {activeTab === 'Integrity Dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <AlertsPanel />
                </div>
                <div className="p-6 rounded-[15px] bg-white border border-[#EEF1F6] shadow-[0_4px_16px_rgba(15,23,42,0.04)] text-xs space-y-4">
                  <h4 className="font-bold text-[#111827]">Violation Analytics</h4>
                  <p className="text-[#7B8AA3] font-semibold">Telemetry details logged during applicant tests.</p>
                </div>
              </div>
            )}

            {activeTab === 'Billing & Settings' && (
              <div className="p-8 bg-white border border-[#EEF1F6] rounded-[15px] shadow-[0_4px_16px_rgba(15,23,42,0.04)] text-xs space-y-4">
                <h3 className="text-sm font-bold text-[#111827] mb-2">Billing & Account Settings</h3>
                <p className="text-[#7B8AA3] font-semibold">Review your enterprise billing periods, active limits and tokens.</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
