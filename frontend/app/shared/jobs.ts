export interface Job {
  id: string;
  title: string;
  department: string;
  status: 'Active' | 'Hold' | 'Closed' | 'Draft';
  candidatesCount: number;
  description: string;
  role: string;
  aboutJob: string;
  skillsRequired: string[];
  experience: string;
  salaryRange: string;
  location: string;
  employmentType: string;
  aiSummary: string;
  aiQuestions: string[];
  postedDate?: string;
}

export const INITIAL_SHARED_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'AI / Machine Learning Researcher',
    department: 'Engineering',
    status: 'Active',
    candidatesCount: 6,
    description: 'Research and develop advanced neural architectures for high-throughput decision-making systems.',
    role: 'Lead ML Researcher',
    aboutJob: 'You will be working at the cutting edge of AI, developing models that power our core platform.',
    skillsRequired: ['PyTorch', 'TensorFlow', 'NLP', 'Transformers', 'CUDA'],
    experience: '3+ years',
    salaryRange: '₹18,0,000 - ₹24,0,000',
    location: 'New Delhi (On-site)',
    employmentType: 'Full-time',
    aiSummary: 'Lead investigator for machine learning modeling and deep neural framework research.',
    aiQuestions: [
      'Detail the trade-offs of fine-tuning LLMs vs using RAG.',
      'Explain optimization strategies for backpropagation in deep architectures.',
      'How do you manage computational efficiency during training?'
    ],
    postedDate: '2026-07-10'
  },
  {
    id: 'job-2',
    title: 'Senior Full Stack Engineer',
    department: 'Engineering',
    status: 'Active',
    candidatesCount: 7,
    description: 'Build responsive interfaces and robust API backends that scale seamlessly under heavy load.',
    role: 'Product Engineer',
    aboutJob: 'Help us build the next generation of screening tools using React and Node.js.',
    skillsRequired: ['Next.js', 'React', 'Node.js', 'Express', 'MongoDB'],
    experience: '5+ years',
    salaryRange: '₹14,0,000 - ₹20,0,000',
    location: 'Bengaluru (Hybrid)',
    employmentType: 'Full-time',
    aiSummary: 'Lead product engineer responsible for frontend client systems and service architectures.',
    aiQuestions: [
      'Explain Next.js rendering modes.',
      'How do you structure database schemas for fast indexing?',
      'Detail your experience scaling high-concurrency Node.js endpoints.'
    ],
    postedDate: '2026-07-12'
  },
  {
    id: 'job-3',
    title: 'Security Engineer (DevSecOps)',
    department: 'Security',
    status: 'Active',
    candidatesCount: 5,
    description: 'Audit cloud infrastructure, set container security parameters, and configure access control lists.',
    role: 'Cloud Security Architect',
    aboutJob: 'Protect our infrastructure and ensure all our AI systems are secure by design.',
    skillsRequired: ['Docker', 'Kubernetes', 'AWS', 'IAM', 'OWASP'],
    experience: '4+ years',
    salaryRange: '₹16,0,000 - ₹22,0,000',
    location: 'Hyderabad (Remote)',
    employmentType: 'Full-time',
    aiSummary: 'Security compliance officer establishing container guardrails and access policies.',
    aiQuestions: [
      'Describe how you audit code for OWASP Top 10 vulnerabilities.',
      'How do you secure multi-tenant cloud instances?',
      'Walk us through how you would configure a DevSecOps CI/CD scanner.'
    ],
    postedDate: '2026-07-14'
  },
  {
    id: 'job-4',
    title: 'Product Design Lead',
    department: 'Design',
    status: 'Hold',
    candidatesCount: 7,
    description: 'Lead the product design team and drive user-centered design for enterprise applications.',
    role: 'Design Lead',
    aboutJob: 'Guide cross-functional teams through product discovery, UX strategy, and execution while supporting key design programs.',
    skillsRequired: ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'Accessibility'],
    experience: '6+ years',
    salaryRange: '₹12,0,000 - ₹16,0,000',
    location: 'Bengaluru (Hybrid)',
    employmentType: 'Full-time',
    aiSummary: 'Design leader focused on building inclusive and scalable digital experiences.',
    aiQuestions: [
      'How do you translate research insights into product design outcomes?',
      'Describe your process for maintaining a scalable design system.',
      'What metrics do you use to measure design impact?'
    ],
    postedDate: '2026-07-08'
  },
  {
    id: 'job-5',
    title: 'HR Operations Specialist',
    department: 'People',
    status: 'Closed',
    candidatesCount: 0,
    description: 'Manage HR operations, onboarding, and employee lifecycle activities for a fast-growing technology team.',
    role: 'HR Operations Specialist',
    aboutJob: 'Support recruitment operations and maintain smooth HR processes across employee onboarding and compliance.',
    skillsRequired: ['HRIS', 'Onboarding', 'Employee Experience', 'Compliance', 'Data Reporting'],
    experience: '2+ years',
    salaryRange: '₹8,0,000 - ₹11,0,000',
    location: 'New Delhi (On-site)',
    employmentType: 'Full-time',
    aiSummary: 'Operational HR role focused on candidate experience and internal process excellence.',
    aiQuestions: [
      'Explain how you ensure consistent onboarding experience at scale.',
      'What tools do you use for HR operations and reporting?',
      'How do you handle confidential employee data securely?'
    ],
    postedDate: '2026-07-02'
  }
];
