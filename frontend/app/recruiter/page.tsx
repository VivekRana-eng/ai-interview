'use client';

import React, { useState, useEffect } from 'react';
import { useRecruiterStore } from './store';
import { Sidebar } from './components/sidebar';
import { Navbar } from './components/navbar';
import { KpiCards } from './components/kpi-cards';
import { Charts } from './components/charts';
import { InterviewCalendar } from './components/interview-calendar';
import { EvaluationsTable } from './components/evaluations-table';
import { InteractiveFlow } from './components/interactive-flow';
import { JobsPanel } from './components/jobs-panel';
import { QuestionBankPanel } from './components/question-bank-panel';
import { ResumeScreener } from './components/resume-screener';
import { motion } from 'framer-motion';

export default function RecruiterDashboard() {
  const { activeTab, initializeStore, isJobOverlayOpen } = useRecruiterStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isQuestionBankTab = activeTab === 'Question Bank';

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <div className="h-screen bg-white dark:bg-[#080c14] text-slate-800 dark:text-slate-100 flex overflow-hidden font-sans antialiased">

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
        <main className={`flex-1 p-4 lg:p-8 space-y-6 lg:space-y-8 min-h-0 overflow-x-hidden bg-white dark:bg-[#080c14] ${isQuestionBankTab ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`space-y-6 lg:space-y-8 ${isQuestionBankTab ? 'h-full flex flex-col' : ''}`}
          >
            {activeTab === 'Dashboard' && (
              <>
                {/* Statistics Cards */}
                <KpiCards />

                {/* Analytical Charts */}
                <Charts />

                {/* Interview Calendar */}
                <div className="w-full">
                  <InterviewCalendar />
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


            {activeTab === 'Evaluation Reports' && <EvaluationsTable showViewAll={false} itemsPerPage={20} showFilters={true} />}


            {activeTab === 'Billing & Settings' && (
              <div className="p-8 bg-white dark:bg-[#0f172a] border border-slate-800 rounded-[15px] shadow-[0_4px_16px_rgba(15,23,42,0.04)] text-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2">Billing & Account Settings</h3>
                <p className="text-slate-500 dark:text-slate-300 font-semibold">Review your enterprise billing periods, active limits and tokens.</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
