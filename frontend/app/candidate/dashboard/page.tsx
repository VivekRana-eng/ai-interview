'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../recruiter/components/sidebar';
import { Navbar } from '../../recruiter/components/navbar';
import { useRecruiterStore } from '../../recruiter/store';
import { motion } from 'framer-motion';

// Import Candidate Sub-panels
import { DashboardTab } from '../components/dashboard-tab';
import { ProfileTab } from '../components/profile-tab';
import { ApplicationsTab } from '../components/applications-tab';
import { ResumeTab } from '../components/resume-tab';
import { InterviewsTab } from '../components/interviews-tab';
import { HistoryTab } from '../components/history-tab';
import { FeedbackTab } from '../components/feedback-tab';
import { MockTab } from '../components/mock-tab';
import { InsightsTab } from '../components/insights-tab';
import { NotificationsTab } from '../components/notifications-tab';
import { SettingsTab } from '../components/settings-tab';

export default function CandidateDashboard() {
  const { activeTab, setActiveTab, initializeStore } = useRecruiterStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Dynamic Candidate Applications List state shared across tabs
  const [applications, setApplications] = useState([
    { id: 1, role: 'AI / Machine Learning Researcher', appliedDate: '2026-07-10', status: 'Scheduled', aiScore: 97, location: 'New Delhi (On-site)' },
    { id: 2, role: 'Senior Full Stack Engineer', appliedDate: '2026-07-14', status: 'Under Review', aiScore: 94, location: 'Bengaluru (Hybrid)' },
    { id: 3, role: 'Security Engineer (DevSecOps)', appliedDate: '2026-07-08', status: 'In Progress', aiScore: 89, location: 'Hyderabad (Remote)' },
    { id: 4, role: 'Product Design Lead', appliedDate: '2026-07-02', status: 'Shortlisted', aiScore: 91, location: 'Bengaluru (Hybrid)' },
    { id: 5, role: 'HR Operations Specialist', appliedDate: '2026-06-25', status: 'Offer', aiScore: 80, location: 'New Delhi (On-site)' }
  ]);

  // Toast confirmation trigger state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Custom step override for dynamic interview setups
  const [interviewStep, setInterviewStep] = useState<'list' | 1 | 2 | 3 | 4 | 5 | 6>('list');

  useEffect(() => {
    initializeStore();
    setActiveTab('Dashboard');
  }, [initializeStore, setActiveTab]);

  // Selected history assessment for feedback view
  const [selectedFeedbackItem, setSelectedFeedbackItem] = useState<any>(null);

  const handleStartInterview = () => {
    setInterviewStep(1);
    setActiveTab('Scheduled Interviews');
  };

  const handleTabNavigate = (tabName: string) => {
    setInterviewStep('list');
    setActiveTab(tabName);
  };

  const handleViewFeedback = (item: any) => {
    setSelectedFeedbackItem(item);
    setActiveTab('AI Feedback');
  };

  const handleApplyJob = (company: string, role: string, score: string, location: string) => {
    const numericScore = parseInt(score.replace(/\D/g, '')) || 90;
    
    // Check if already applied
    const isDup = applications.some(app => 
      app.role.toLowerCase() === role.toLowerCase()
    );

    if (isDup) return;

    const newApp = {
      id: Date.now(),
      role,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Under Review',
      aiScore: numericScore,
      location: location + ' (Applied via Portal)'
    };

    setApplications([newApp, ...applications]);
    
    // Trigger user toast notice
    setToastMessage(`Applied successfully to ${role}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="h-screen bg-white dark:bg-[#080c14] text-slate-800 dark:text-slate-100 flex overflow-hidden font-sans antialiased relative">
      
      {/* Dynamic Toast Feedback Overlay */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-semibold text-xs animate-bounce">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          {toastMessage}
        </div>
      )}

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
        <main className="flex-1 p-4 lg:p-8 min-h-0 overflow-y-auto bg-slate-50/50 dark:bg-[#080c14]">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 lg:space-y-8"
          >
            {activeTab === 'Dashboard' && (
              <DashboardTab 
                onNavigate={handleTabNavigate}
                onStartInterview={handleStartInterview}
                applications={applications}
              />
            )}
            
            {activeTab === 'My Profile' && (
              <ProfileTab />
            )}

            {activeTab === 'My Applications' && (
              <ApplicationsTab 
                applications={applications}
                setApplications={setApplications}
              />
            )}

            {activeTab === 'Resume' && (
              <ResumeTab />
            )}

            {activeTab === 'Scheduled Interviews' && (
              <InterviewsTab 
                key={interviewStep} 
                initialStep={interviewStep} 
              />
            )}

            {activeTab === 'Interview History' && (
              <HistoryTab 
                onViewFeedback={handleViewFeedback}
              />
            )}

            {activeTab === 'AI Feedback' && (
              <FeedbackTab selectedItem={selectedFeedbackItem} />
            )}

            {activeTab === 'Mock Interviews' && (
              <MockTab 
                onStartMock={handleStartInterview}
              />
            )}

            {activeTab === 'Career Insights' && (
              <InsightsTab 
                onApplyJob={handleApplyJob}
                appliedJobKeys={applications.map(app => app.role.toLowerCase())}
              />
            )}

            {activeTab === 'Notifications' && (
              <NotificationsTab />
            )}

            {activeTab === 'Settings' && (
              <SettingsTab />
            )}

          </motion.div>
        </main>
      </div>
    </div>
  );
}
