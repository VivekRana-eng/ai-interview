export interface Candidate {
  id: string;
  name: string;
  position: string;
  aiMatchScore: number;
  integrityScore: number;
  status: 'Applied' | 'Screening' | 'Interviewing' | 'Shortlisted' | 'Hired';
  recommendation: 'Hire' | 'Strong Hire' | 'Maybe' | 'Reject';
  interviewDate: string;
  avatarUrl?: string;
  email: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  status: 'Active' | 'Draft' | 'Closed';
  candidatesCount: number;
}

export interface LiveInterview {
  id: string;
  candidateName: string;
  position: string;
  currentQuestion: number;
  totalQuestions: number;
  progress: number; // percentage
  integrityStatus: 'Good' | 'Warning' | 'Critical';
  avatarUrl?: string;
}

export interface AiAlert {
  id: string;
  candidateName: string;
  type: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  resolved: boolean;
}

export interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
}
