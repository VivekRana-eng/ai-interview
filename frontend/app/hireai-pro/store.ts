import { create } from 'zustand';
import { Candidate, Job, LiveInterview, AiAlert } from './types';
import { MOCK_CANDIDATES, MOCK_JOBS, MOCK_LIVE_INTERVIEWS, MOCK_ALERTS } from './mock-data';

interface DashboardState {
  // States
  activeTab: string;
  candidates: Candidate[];
  jobs: Job[];
  liveInterviews: LiveInterview[];
  alerts: AiAlert[];
  searchVal: string;
  filterJob: string;
  theme: 'dark' | 'light';
  
  // Setters/Actions
  setActiveTab: (tab: string) => void;
  updateCandidateStatus: (candidateId: string, status: Candidate['status']) => void;
  setSearchVal: (val: string) => void;
  setFilterJob: (job: string) => void;
  toggleTheme: () => void;
  resolveAlert: (alertId: string) => void;
  addAlert: (alert: Omit<AiAlert, 'id' | 'timestamp' | 'resolved'>) => void;
  updateLiveInterviewProgress: (id: string, progress: number, currentQuestion: number) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeTab: 'Dashboard',
  candidates: MOCK_CANDIDATES,
  jobs: MOCK_JOBS,
  liveInterviews: MOCK_LIVE_INTERVIEWS,
  alerts: MOCK_ALERTS,
  searchVal: '',
  filterJob: 'All',
  theme: 'dark',

  setActiveTab: (tab) => set({ activeTab: tab }),

  updateCandidateStatus: (candidateId, status) => set((state) => {
    // Audit log / state transition logic
    const updatedCandidates = state.candidates.map((c) => {
      if (c.id === candidateId) {
        // Automatically determine/simulate new recommendation based on status if needed
        let newRec = c.recommendation;
        if (status === 'Hired') newRec = 'Strong Hire';
        else if (status === 'Shortlisted' && c.recommendation === 'Reject') newRec = 'Maybe';
        
        return { ...c, status, recommendation: newRec };
      }
      return c;
    });
    return { candidates: updatedCandidates };
  }),

  setSearchVal: (val) => set({ searchVal: val }),
  
  setFilterJob: (job) => set({ filterJob: job }),

  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    // Update HTML class list for Tailwind theme toggle
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      if (nextTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    return { theme: nextTheme };
  }),

  resolveAlert: (alertId) => set((state) => ({
    alerts: state.alerts.map((a) => a.id === alertId ? { ...a, resolved: true } : a)
  })),

  addAlert: (alert) => set((state) => {
    const newAlert: AiAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      timestamp: 'Just now',
      resolved: false,
    };
    return { alerts: [newAlert, ...state.alerts] };
  }),

  updateLiveInterviewProgress: (id, progress, currentQuestion) => set((state) => ({
    liveInterviews: state.liveInterviews.map((item) => 
      item.id === id ? { ...item, progress, currentQuestion } : item
    )
  }))
}));
