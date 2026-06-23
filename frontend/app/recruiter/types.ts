export interface Candidate {
  id: string;
  name: string;
  position: string;
  location: string;
  email: string;
  avatarUrl: string;
  aiMatchScore: number;
  integrityScore: number;
  status: 'Applied' | 'Screening' | 'Interviewing' | 'Shortlisted' | 'Hired';
  recommendation: 'Strong Hire' | 'Hire' | 'Maybe' | 'Reject';
  interviewDate: string;
}

export interface LiveCandidate {
  id: string;
  name: string;
  position: string;
  status: 'Secure' | 'Warning' | 'Critical';
  timeElapsed: string;
  avatarUrl: string;
  currentQuestion: number;
  totalQuestions: number;
  progress: number; // percentage
  logs: string[];
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

export interface Job {
  id: string;
  title: string;
  department: string;
  status: 'Active' | 'Draft' | 'Closed';
  candidatesCount: number;
}
