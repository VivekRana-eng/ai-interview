import { create } from 'zustand';
import { Candidate, LiveCandidate, AiAlert, Job, QuestionBank } from './types';
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
  isDarkMode: boolean;

  // MongoDB Aggregated Analytics State
  kpiData: { activeJobs: number; totalCandidates: number; interviewsToday: number; integrityAlerts: number } | null;
  overviewData: any[] | null;
  funnelData: any[] | null;

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
  toggleTheme: () => void;
  addCandidate: (candidate: Candidate) => void;
  deleteCandidate: (id: string) => void;
  clearNotifications: () => void;
  addJob: (job: Omit<Job, 'id' | 'candidatesCount' | 'aiSummary' | 'aiQuestions'> & { aiSummary?: string; aiQuestions?: string[] }) => Promise<void>;
  updateJob: (id: string, job: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  screenResume: (file: File, jobTitle: string) => Promise<Candidate | null>;

  questionBanks: QuestionBank[];
  activeQuestionBank: QuestionBank | null;
  fetchQuestionBank: (jobTitle: string) => Promise<void>;
  generateQuestions: (jobTitle: string) => Promise<void>;
  regenerateQuestions: (jobTitle: string) => Promise<void>;

  // API async calls
  initializeStore: () => Promise<void>;
  fetchAnalytics: () => Promise<void>;
}

const STAGES: Candidate['status'][] = ['Applied', 'Screening', 'Interviewing', 'Shortlisted', 'Hired'];
const API_URL = 'http://localhost:5000/api';

export const useRecruiterStore = create<RecruiterState>((set, get) => ({
  activeTab: 'Dashboard',
  candidates: INITIAL_CANDIDATES,
  liveCandidates: INITIAL_LIVE_CANDIDATES,
  alerts: INITIAL_ALERTS,
  jobs: MOCK_JOBS,
  questionBanks: [],
  activeQuestionBank: null,
  searchVal: '',
  filterJob: 'All',
  filterStage: 'All Stages (3)',
  sortBy: 'Highest AI Match',
  isDarkMode: false,

  kpiData: null,
  overviewData: null,
  funnelData: null,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchVal: (val) => set({ searchVal: val }),
  setFilterJob: (job) => set({ filterJob: job }),
  setFilterStage: (stage) => set({ filterStage: stage }),
  setSortBy: (sort) => set({ sortBy: sort }),

  initializeStore: async () => {
    try {
      const [candRes, jobRes, alertRes] = await Promise.all([
        fetch(`${API_URL}/candidates`).then(r => r.json()),
        fetch(`${API_URL}/jobs`).then(r => r.json()),
        fetch(`${API_URL}/alerts`).then(r => r.json())
      ]);

      const mappedCands = candRes.map((c: any) => ({
        id: c._id,
        name: c.name,
        position: c.position,
        location: c.location,
        email: c.email,
        avatarUrl: c.avatarUrl || 'https://api.dicebear.com/7.x/adventurer/svg?seed=' + c.name,
        aiMatchScore: c.aiMatchScore,
        integrityScore: c.integrityScore,
        status: c.status,
        recommendation: c.recommendation,
        interviewDate: c.interviewDate,
        skills: c.skills || [],
        education: c.education || [],
        experience: c.experience || [],
        certifications: c.certifications || [],
        strengths: c.strengths || [],
        missingSkills: c.missingSkills || [],
        summary: c.summary || ''
      }));

      const mappedAlerts = alertRes.map((a: any) => ({
        id: a._id,
        candidateName: a.candidateName,
        type: a.type,
        message: a.message,
        severity: a.severity,
        timestamp: a.timestamp,
        resolved: a.resolved
      }));

      const mappedJobs = jobRes.map((j: any) => ({
        id: j._id,
        title: j.title,
        department: j.department,
        status: j.status,
        candidatesCount: j.candidatesCount,
        description: j.description || '',
        skillsRequired: j.skillsRequired || [],
        experience: j.experience || '',
        salaryRange: j.salaryRange || '',
        location: j.location || '',
        employmentType: j.employmentType || 'Full-time',
        aiSummary: j.aiSummary || '',
        aiQuestions: j.aiQuestions || [],
        createdAt: j.createdAt
      }));

      set({ 
        candidates: mappedCands, 
        alerts: mappedAlerts, 
        jobs: mappedJobs 
      });

      await get().fetchAnalytics();
    } catch (err) {
      console.error('Failed to initialize MongoDB recruiter store:', err);
    }
  },

  fetchAnalytics: async () => {
    try {
      const [kpiRes, overviewRes, funnelRes] = await Promise.all([
        fetch(`${API_URL}/analytics/kpis`).then(r => r.json()),
        fetch(`${API_URL}/analytics/overview`).then(r => r.json()),
        fetch(`${API_URL}/analytics/funnel`).then(r => r.json())
      ]);

      set({
        kpiData: kpiRes,
        overviewData: overviewRes,
        funnelData: funnelRes.stages
      });
    } catch (err) {
      console.error('Failed to fetch analytics from MongoDB:', err);
    }
  },

  promoteCandidate: async (id) => {
    const candidate = get().candidates.find(c => c.id === id);
    if (!candidate) return;
    const currIdx = STAGES.indexOf(candidate.status);
    const nextIdx = Math.min(currIdx + 1, STAGES.length - 1);
    const nextStatus = STAGES[nextIdx];

    try {
      await fetch(`${API_URL}/candidates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      await get().initializeStore();
    } catch (err) {
      console.error('Failed to promote candidate in MongoDB:', err);
    }
  },

  setCandidateStage: async (id, stage) => {
    try {
      await fetch(`${API_URL}/candidates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: stage })
      });
      await get().initializeStore();
    } catch (err) {
      console.error('Failed to set candidate stage in MongoDB:', err);
    }
  },

  resolveAlert: async (id) => {
    try {
      await fetch(`${API_URL}/alerts/${id}/resolve`, {
        method: 'PATCH'
      });
      await get().initializeStore();
    } catch (err) {
      console.error('Failed to resolve alert in MongoDB:', err);
    }
  },

  addCandidate: async (candidate) => {
    try {
      const payload = {
        name: candidate.name,
        position: candidate.position,
        location: candidate.location,
        email: candidate.email,
        avatarUrl: candidate.avatarUrl,
        aiMatchScore: candidate.aiMatchScore,
        integrityScore: candidate.integrityScore,
        status: candidate.status,
        recommendation: candidate.recommendation,
        interviewDate: candidate.interviewDate
      };

      await fetch(`${API_URL}/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      await get().initializeStore();
    } catch (err) {
      console.error('Failed to add candidate to MongoDB:', err);
    }
  },

  deleteCandidate: async (id) => {
    try {
      await fetch(`${API_URL}/candidates/${id}`, {
        method: 'DELETE'
      });
      await get().initializeStore();
    } catch (err) {
      console.error('Failed to delete candidate in MongoDB:', err);
    }
  },

  clearNotifications: async () => {
    try {
      await fetch(`${API_URL}/alerts/resolve-all`, {
        method: 'PATCH'
      });
      await get().initializeStore();
    } catch (err) {
      console.error('Failed to clear notifications in MongoDB:', err);
    }
  },

  updateLiveCandidate: (id, progress, currentQuestion, log) => set((state) => ({
    liveCandidates: state.liveCandidates.map((c) => {
      if (c.id === id) {
        const nextLogs = log ? [...c.logs.slice(-4), log] : c.logs;
        return { ...c, progress, currentQuestion, logs: nextLogs };
      }
      return c;
    })
  })),

  seedDemoPipeline: async () => {
    try {
      await fetch(`${API_URL}/seed`, { method: 'POST' });
      await get().initializeStore();
    } catch (err) {
      console.error('Failed to seed pipeline:', err);
    }
  },

  addJob: async (job) => {
    try {
      await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job)
      });
      await get().initializeStore();
    } catch (err) {
      console.error('Failed to add job to MongoDB:', err);
    }
  },

  updateJob: async (id, job) => {
    try {
      await fetch(`${API_URL}/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job)
      });
      await get().initializeStore();
    } catch (err) {
      console.error('Failed to update job in MongoDB:', err);
    }
  },

  deleteJob: async (id) => {
    try {
      await fetch(`${API_URL}/jobs/${id}`, {
        method: 'DELETE'
      });
      await get().initializeStore();
    } catch (err) {
      console.error('Failed to delete job in MongoDB:', err);
    }
  },

  screenResume: async (file, jobTitle) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('jobTitle', jobTitle);

      const res = await fetch(`${API_URL}/candidates/screen`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || 'Failed to screen resume');
      }

      const cand = await res.json();
      await get().initializeStore();

      return {
        id: cand._id,
        name: cand.name,
        position: cand.position,
        location: cand.location,
        email: cand.email,
        avatarUrl: cand.avatarUrl || 'https://api.dicebear.com/7.x/adventurer/svg?seed=' + cand.name,
        aiMatchScore: cand.aiMatchScore,
        integrityScore: cand.integrityScore,
        status: cand.status,
        recommendation: cand.recommendation,
        interviewDate: cand.interviewDate,
        skills: cand.skills || [],
        education: cand.education || [],
        experience: cand.experience || [],
        certifications: cand.certifications || [],
        strengths: cand.strengths || [],
        missingSkills: cand.missingSkills || [],
        summary: cand.summary || ''
      };
    } catch (err) {
      console.error('Failed to screen resume:', err);
      return null;
    }
  },

  fetchQuestionBank: async (jobTitle) => {
    try {
      const res = await fetch(`${API_URL}/question-banks/${encodeURIComponent(jobTitle)}`);
      if (res.ok) {
        const bank = await res.json();
        set({ 
          activeQuestionBank: {
            id: bank._id,
            jobTitle: bank.jobTitle,
            questions: bank.questions || [],
            createdAt: bank.createdAt
          } 
        });
      } else {
        set({ activeQuestionBank: null });
      }
    } catch (err) {
      console.error('Failed to fetch question bank:', err);
      set({ activeQuestionBank: null });
    }
  },

  generateQuestions: async (jobTitle) => {
    try {
      const res = await fetch(`${API_URL}/question-banks/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle })
      });
      if (res.ok) {
        const bank = await res.json();
        const mappedBank = {
          id: bank._id,
          jobTitle: bank.jobTitle,
          questions: bank.questions || [],
          createdAt: bank.createdAt
        };
        set((state) => ({
          activeQuestionBank: mappedBank,
          questionBanks: [
            mappedBank,
            ...state.questionBanks.filter(b => b.jobTitle !== jobTitle)
          ]
        }));
      }
    } catch (err) {
      console.error('Failed to generate questions:', err);
    }
  },

  regenerateQuestions: async (jobTitle) => {
    await get().generateQuestions(jobTitle);
  },

  toggleTheme: () => set((state) => {
    const nextMode = !state.isDarkMode;
    if (typeof document !== 'undefined') {
      if (nextMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    return { isDarkMode: nextMode };
  })
}));
