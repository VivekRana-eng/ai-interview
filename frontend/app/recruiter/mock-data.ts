import { Candidate, LiveCandidate, AiAlert, Job } from './types';

// Exact Candidates from Screenshot 3 & 4
export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Alexander Wright',
    position: 'AI / Machine Learning Researcher',
    location: 'San Francisco, CA',
    email: 'alex.wright@selectai.io',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alexander',
    aiMatchScore: 96,
    integrityScore: 94,
    status: 'Interviewing', // Matches timeline dot in screenshot
    recommendation: 'Strong Hire',
    interviewDate: 'Jun 20, 2026'
  },
  {
    id: 'cand-2',
    name: 'Sophia Chen',
    position: 'Senior Full Stack Engineer',
    location: 'Seattle, WA',
    email: 'sophia.chen@selectai.io',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia',
    aiMatchScore: 94,
    integrityScore: 98,
    status: 'Screening', // Matches timeline dot in screenshot
    recommendation: 'Strong Hire',
    interviewDate: 'Jun 18, 2026'
  },
  {
    id: 'cand-3',
    name: 'Emma Watson',
    position: 'Security Engineer (DevSecOps)',
    location: 'London, UK',
    email: 'emma.watson@selectai.io',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Emma',
    aiMatchScore: 89,
    integrityScore: 86,
    status: 'Applied', // Matches timeline dot in screenshot
    recommendation: 'Maybe',
    interviewDate: 'Jun 21, 2026'
  }
];

// Exact Live Candidates from Screenshot 2
export const INITIAL_LIVE_CANDIDATES: LiveCandidate[] = [
  {
    id: 'live-1',
    name: 'Liam O\'Connor',
    position: 'DevOps Architect',
    status: 'Secure',
    timeElapsed: '12m 40s',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Liam',
    currentQuestion: 2,
    totalQuestions: 6,
    progress: 33,
    logs: [
      'Candidate: Opened Question 2.',
      'System: Session reset for sim.',
      'System: Re-verifying camera 1...',
      'AI: Analyzing response pattern...'
    ]
  },
  {
    id: 'live-2',
    name: 'Yuki Tanaka',
    position: 'UI/UX Designer',
    status: 'Warning',
    timeElapsed: '0m 0s',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Yuki',
    currentQuestion: 1,
    totalQuestions: 6,
    progress: 10,
    logs: [
      'System: Starting session...',
      'AI: Face detection initialized.',
      'System: Audio validation okay.'
    ]
  },
  {
    id: 'live-3',
    name: 'Daniel Kim',
    position: 'Frontend Developer',
    status: 'Critical',
    timeElapsed: '28m 15s',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Daniel',
    currentQuestion: 5,
    totalQuestions: 6,
    progress: 83,
    logs: [
      'System: Warning - background audio detected.',
      'AI: Face gaze out of bounds.',
      'Candidate: Opened Question 5.'
    ]
  }
];

// Exact AI Alerts from Screenshot 2
export const INITIAL_ALERTS: AiAlert[] = [
  {
    id: 'alert-1',
    candidateName: 'Daniel Kim',
    type: 'High Potential Match',
    message: 'Daniel Kim: AI score matches outstanding benchmarks (95%+ match).',
    severity: 'info',
    timestamp: 'Just now',
    resolved: false
  },
  {
    id: 'alert-2',
    candidateName: 'Liam O\'Connor',
    type: 'Multiple Face Detected',
    message: 'Liam O\'Connor: Second face detected in frame during question 5.',
    severity: 'critical',
    timestamp: 'Just now',
    resolved: false
  },
  {
    id: 'alert-3',
    candidateName: 'Yuki Tanaka',
    type: 'High Potential Match',
    message: 'Yuki Tanaka: AI score matches outstanding benchmarks (90%+ match).',
    severity: 'info',
    timestamp: 'Just now',
    resolved: false
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'AI / Machine Learning Researcher',
    department: 'Engineering',
    status: 'Active',
    candidatesCount: 1,
    description: 'Research and develop advanced neural architectures for high-throughput decision-making systems.',
    skillsRequired: ['PyTorch', 'TensorFlow', 'NLP', 'Transformers', 'CUDA'],
    experience: '3+ years',
    salaryRange: '₹18,00,000 - ₹24,00,000',
    location: 'New Delhi (On-site)',
    employmentType: 'Full-time',
    aiSummary: 'Lead investigator for machine learning modeling and deep neural framework research.',
    aiQuestions: [
      'Detail the trade-offs of fine-tuning LLMs vs using RAG.',
      'Explain optimization strategies for backpropagation in deep architectures.',
      'How do you manage computational efficiency during training?'
    ]
  },
  {
    id: 'job-2',
    title: 'Senior Full Stack Engineer',
    department: 'Engineering',
    status: 'Active',
    candidatesCount: 1,
    description: 'Build responsive interfaces and robust API backends that scale seamlessly under heavy load.',
    skillsRequired: ['Next.js', 'React', 'Node.js', 'Express', 'MongoDB'],
    experience: '5+ years',
    salaryRange: '₹14,00,000 - ₹20,00,000',
    location: 'Bengaluru (Hybrid)',
    employmentType: 'Full-time',
    aiSummary: 'Lead product engineer responsible for frontend client systems and service architectures.',
    aiQuestions: [
      'Explain Next.js rendering modes.',
      'How do you structure database schemas for fast indexing?',
      'Detail your experience scaling high-concurrency Node.js endpoints.'
    ]
  },
  {
    id: 'job-3',
    title: 'Security Engineer (DevSecOps)',
    department: 'Security',
    status: 'Active',
    candidatesCount: 1,
    description: 'Audit cloud infrastructure, set container security parameters, and configure access control lists.',
    skillsRequired: ['Docker', 'Kubernetes', 'AWS', 'IAM', 'OWASP'],
    experience: '4+ years',
    salaryRange: '₹16,00,000 - ₹22,00,000',
    location: 'Hyderabad (Remote)',
    employmentType: 'Full-time',
    aiSummary: 'Security compliance officer establishing container guardrails and access policies.',
    aiQuestions: [
      'Describe how you audit code for OWASP Top 10 vulnerabilities.',
      'How do you secure multi-tenant cloud instances?',
      'Walk us through how you would configure a DevSecOps CI/CD scanner.'
    ]
  },
  {
    id: 'job-4',
    title: 'DevOps Architect',
    department: 'Engineering',
    status: 'Active',
    candidatesCount: 0,
    description: 'Oversee continuous deployment pipelines, maintain Kubernetes cluster stability, and monitor platform health.',
    skillsRequired: ['Kubernetes', 'GitHub Actions', 'Prometheus', 'Terraform'],
    experience: '6+ years',
    salaryRange: '₹20,00,000 - ₹28,00,000',
    location: 'Bengaluru (On-site)',
    employmentType: 'Full-time',
    aiSummary: 'Principal cloud architect designing high-availability automation systems.',
    aiQuestions: [
      'Detail your approach to configuring multi-region failovers.',
      'How do you monitor container telemetry?',
      'Explain infrastructure-as-code configuration drift management.'
    ]
  },
  {
    id: 'job-5',
    title: 'UI/UX Designer',
    department: 'Design',
    status: 'Active',
    candidatesCount: 0,
    description: 'Draft user flows, create high-fidelity design prototypes, and compile components design libraries.',
    skillsRequired: ['Figma', 'Illustrator', 'Prototyping', 'Design Systems'],
    experience: '2+ years',
    salaryRange: '₹8,00,000 - ₹12,00,000',
    location: 'New Delhi (Hybrid)',
    employmentType: 'Full-time',
    aiSummary: 'Lead interface designer drafting layout paradigms and component specs.',
    aiQuestions: [
      'How do you adapt layout systems for responsive viewports?',
      'Describe your handoff process to frontend engineers.',
      'Detail your experience creating custom design token architectures.'
    ]
  }
];
