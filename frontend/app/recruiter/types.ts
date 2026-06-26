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
  skills?: string[];
  education?: string[];
  experience?: string[];
  certifications?: string[];
  strengths?: string[];
  missingSkills?: string[];
  summary?: string;
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
  status: 'Active' | 'Draft' | 'Closed' | 'Hold' | 'Deactive';
  candidatesCount: number;
  description: string;
  role: string;
  aboutJob: string;
  skillsRequired: string[];
  experience: string;
  salaryRange: string;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  aiSummary?: string;
  aiQuestions?: string[];
  createdAt?: string;
}

export interface QuestionItem {
  text: string;
  category: 'Easy' | 'Medium' | 'Hard' | 'Scenario' | 'Behavioral';
}

export interface QuestionBank {
  id: string;
  jobTitle: string;
  questions: QuestionItem[];
  createdAt?: string;
}

