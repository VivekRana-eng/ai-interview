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

  // ATS Candidate Profile Dashboard extensions
  phone?: string;
  currentCompany?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  resumeUrl?: string;
  resumeText?: string;
  workExperienceDetails?: Array<{
    role: string;
    company: string;
    duration: string;
    description: string[];
  }>;
  educationDetails?: Array<{
    degree: string;
    school: string;
    year: string;
    grade?: string;
  }>;
  projects?: Array<{
    title: string;
    description: string;
    techStack: string[];
    link?: string;
  }>;
  internships?: Array<{
    role: string;
    company: string;
    duration: string;
    description: string[];
  }>;
  trainingsAndCertifications?: Array<{
    name: string;
    issuer: string;
    date: string;
    credentialId?: string;
  }>;
  interviewPerformance?: {
    overallScore: number;
    communicationScore: number;
    technicalScore: number;
    problemSolvingScore: number;
    strengths: string[];
    weaknesses: string[];
    performedWell: string[];
    gotStuck: string[];
    qaList: Array<{
      question: string;
      answer: string;
      aiEvaluation: string;
      score: number;
    }>;
  };
  aiEvaluationDetails?: {
    strengths: string[];
    gaps: string[];
    integrityDetails: string;
    overallRecommendation: string;
  };
  hiringTimeline?: Array<{
    stage: string;
    date: string;
    status: 'completed' | 'current' | 'upcoming';
    comment?: string;
  }>;
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
  status: 'Active' | 'Draft' | 'Closed' | 'Hold';
  candidatesCount: number;
  description: string;
  role: string;
  aboutJob: string;
  skillsRequired: string[];
  experience: string;
  salaryRange: string;
  location: string;
  createdBy?: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  lastDateToApply?: string;
  joiningType?: 'Immediately' | 'Custom Date';
  joiningDate?: string;
  isInternship?: boolean;
  internshipDuration?: string; // e.g. "3 months"
  qualifications?: string;
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

