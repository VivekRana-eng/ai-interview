import { create } from 'zustand';
import { Candidate, LiveCandidate, AiAlert, Job } from './types';
import { INITIAL_CANDIDATES, INITIAL_LIVE_CANDIDATES, INITIAL_ALERTS, MOCK_JOBS } from './mock-data';

interface RecruiterState {
  activeTab: string;
  candidates: Candidate[];
  liveCandidates: LiveCandidate[];
  alerts: AiAlert[];
  jobs: Job[];
  searchVal: string;
  filterJob: string;
  filterStage: string;
  sortBy: string;

  setActiveTab: (tab: string) => void;
  setSearchVal: (val: string) => void;
  setFilterJob: (job: string) => void;
  setFilterStage: (stage: string) => void;
  setSortBy: (sort: string) => void;
  promoteCandidate: (id: string) => void;
  setCandidateStage: (id: string, stage: Candidate['status']) => void;
  resolveAlert: (id: string) => void;
  updateLiveCandidate: (id: string, progress: number, currentQuestion: number, log?: string) => void;
  seedDemoPipeline: () => void;
}

const STAGES: Candidate['status'][] = ['Applied', 'Screening', 'Interviewing', 'Shortlisted', 'Hired'];

export const useRecruiterStore = create<RecruiterState>((set) => ({
  activeTab: 'Dashboard',
  candidates: INITIAL_CANDIDATES,
  liveCandidates: INITIAL_LIVE_CANDIDATES,
  alerts: INITIAL_ALERTS,
  jobs: MOCK_JOBS,
  searchVal: '',
  filterJob: 'All',
  filterStage: 'All Stages (3)',
  sortBy: 'Highest AI Match',

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchVal: (val) => set({ searchVal: val }),
  setFilterJob: (job) => set({ filterJob: job }),
  setFilterStage: (stage) => set({ filterStage: stage }),
  setSortBy: (sort) => set({ sortBy: sort }),

  promoteCandidate: (id) => set((state) => {
    const updated = state.candidates.map((c) => {
      if (c.id === id) {
        const currIdx = STAGES.indexOf(c.status);
        const nextIdx = Math.min(currIdx + 1, STAGES.length - 1);
        const nextStatus = STAGES[nextIdx];
        return { ...c, status: nextStatus };
      }
      return c;
    });
    return { candidates: updated };
  }),

  setCandidateStage: (id, stage) => set((state) => ({
    candidates: state.candidates.map((c) => c.id === id ? { ...c, status: stage } : c)
  })),

  resolveAlert: (id) => set((state) => ({
    alerts: state.alerts.map((a) => a.id === id ? { ...a, resolved: true } : a)
  })),

  updateLiveCandidate: (id, progress, currentQuestion, log) => set((state) => ({
    liveCandidates: state.liveCandidates.map((c) => {
      if (c.id === id) {
        const nextLogs = log ? [...c.logs.slice(-4), log] : c.logs;
        return { ...c, progress, currentQuestion, logs: nextLogs };
      }
      return c;
    })
  })),

  seedDemoPipeline: () => set(() => ({
    candidates: INITIAL_CANDIDATES
  }))
}));
