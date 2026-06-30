import { Candidate, LiveCandidate, AiAlert, Job } from './types';
import { getDefaultExperiences } from './components/candidate-detail-data';

// Specific candidates from screenshots
const SCREENSHOT_CANDIDATES: Partial<Candidate>[] = [
  {
    name: 'Sneha Verma',
    position: 'UI/UX Designer',
    location: 'New Delhi, India',
    email: 'sneha.verma@selectai.gov.in',
    phone: '+91 98765 43210',
    aiMatchScore: 90,
    integrityScore: 96,
    status: 'Interviewing',
    recommendation: 'Hire',
    interviewDate: 'Jun 26, 2026',
    clearance: 'Secret',
    experienceYears: '3+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$70 - $80',
    connectedStatus: 'CONNECTED',
    postedTime: 'Today',
    postedDate: 'Jun 26, 2026',
    skills: ['Figma', 'Adobe XD', 'Wireframing', 'User Research', 'CSS', 'TailwindCSS'],
    missingSkills: [],
    strengths: ['Pixel-perfect design standards', 'Excellent user empathy', 'Collaborates well with developers'],
    workExperienceDetails: [
      {
        role: 'Lead UI/UX Designer',
        company: 'IndiaTech Solutions',
        duration: '2024 - Present',
        description: [
          'Led design system migration to Figma.',
          'Conducted usability testing with 50+ users.',
          'Collaborated with frontend devs on Tailwind integration.'
        ]
      }
    ],
    hiringTimeline: [
      { stage: 'Applied', date: 'Jun 26, 2026', status: 'completed', comment: 'Resume screened.' }
    ]
  },
  {
    name: 'Richard Alpert',
    position: 'Senior Office Manager',
    location: 'Washington, DC',
    email: 'richard.alpert@selectai.io',
    phone: '+1 (555) 123-4567',
    aiMatchScore: 88,
    integrityScore: 92,
    status: 'Applied',
    recommendation: 'Maybe',
    interviewDate: 'Sept 19, 2016',
    clearance: 'TS/SCI w Poly',
    experienceYears: '5+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$80 - $90',
    connectedStatus: 'CONNECTED',
    postedTime: 'Today',
    postedDate: 'Sept 19, 2016',
    skills: ['Office Administration', 'Scheduling', 'Budgeting', 'Vendor Management'],
    missingSkills: ['Technical Writing'],
    strengths: ['Highly organized and details-oriented', 'Clear professional communicator']
  },
  {
    name: 'Joice McNair',
    position: 'Enlisted Medical Veteran',
    location: 'Jacksonville, FL',
    email: 'joice.mcnair@selectai.io',
    phone: '+1 (555) 234-5678',
    aiMatchScore: 85,
    integrityScore: 94,
    status: 'Screening',
    recommendation: 'Maybe',
    interviewDate: 'Sept 19, 2016',
    clearance: 'TS/SCI w Poly',
    experienceYears: '5+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$60 - $90',
    connectedStatus: 'CONNECT',
    postedTime: 'Nov 22, 2017',
    postedDate: 'Sept 19, 2016',
    sendToHiringManager: true,
    sendToHr: true,
    skills: ['Emergency Medicine', 'Patient Care', 'Logistics', 'First Aid'],
    missingSkills: ['Office Software']
  },
  {
    name: 'Robert Huber',
    position: 'Exploitation SME',
    location: 'Mansfield, TX',
    email: 'robert.huber@selectai.io',
    phone: '+1 (555) 345-6789',
    aiMatchScore: 92,
    integrityScore: 95,
    status: 'Interviewing',
    recommendation: 'Strong Hire',
    interviewDate: 'Sept 19, 2016',
    clearance: 'TS/SCI w Poly',
    experienceYears: '5+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$80 - $90',
    connectedStatus: 'CONNECTED',
    postedTime: 'Today',
    postedDate: 'Sept 19, 2016',
    skills: ['Cybersecurity', 'Vulnerability Assessment', 'Exploitation', 'Pentesting'],
    missingSkills: ['Cloud Security']
  },
  {
    name: 'Bruce Timothy Queen',
    position: 'Web Developer - IT Professional',
    location: 'Falls Church, VA',
    email: 'bruce.queen@selectai.io',
    phone: '+1 (555) 456-7890',
    aiMatchScore: 82,
    integrityScore: 90,
    status: 'Applied',
    recommendation: 'Maybe',
    interviewDate: 'Sept 19, 2016',
    clearance: 'Secret',
    experienceYears: '10+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$80 - $90',
    connectedStatus: 'CONNECT',
    postedTime: 'Today',
    postedDate: 'Sept 19, 2016',
    skills: ['HTML/CSS', 'Javascript', 'PHP', 'WordPress', 'MySQL'],
    missingSkills: ['React', 'Next.js']
  },
  {
    name: 'Marlaina Hawthorne',
    position: 'Logistics Specialist',
    location: 'Gaithersburg, MD',
    email: 'marlaina.hawthorne@selectai.io',
    phone: '+1 (555) 567-8901',
    aiMatchScore: 89,
    integrityScore: 93,
    status: 'Screening',
    recommendation: 'Hire',
    interviewDate: 'Sept 19, 2016',
    clearance: 'TS/SCI w Poly',
    experienceYears: '5+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$60 - $90',
    connectedStatus: 'CONNECT',
    postedTime: 'Nov 22, 2017',
    postedDate: 'Sept 19, 2016',
    sendToHiringManager: true,
    sendToHr: true,
    needToCall: true,
    skills: ['Supply Chain', 'Inventory Management', 'Freight Logistics', 'SAP'],
    missingSkills: ['Database Administration']
  },
  {
    name: 'Jacob Schultz',
    position: 'National Security Professional',
    location: 'Alexandria, VA',
    email: 'jacob.schultz@selectai.io',
    phone: '+1 (555) 678-9012',
    aiMatchScore: 91,
    integrityScore: 91,
    status: 'Interviewing',
    recommendation: 'Strong Hire',
    interviewDate: 'Sept 15, 2016',
    clearance: 'Secret',
    experienceYears: '10+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$80 - $90',
    connectedStatus: 'CONNECTED',
    postedTime: 'Today',
    postedDate: 'Sept 15, 2016',
    skills: ['Intelligence Analysis', 'Risk Management', 'Policy Drafting', 'National Security'],
    missingSkills: ['Programming']
  },
  {
    name: 'Nicole Morris',
    position: 'Help Desk',
    location: 'Centreville, VA',
    email: 'nicole.morris@selectai.io',
    phone: '+1 (555) 789-0123',
    aiMatchScore: 84,
    integrityScore: 89,
    status: 'Applied',
    recommendation: 'Maybe',
    interviewDate: 'Sept 19, 2016',
    clearance: 'TS/SCI w Poly',
    experienceYears: '5+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$80 - $90',
    connectedStatus: 'CONNECTED',
    postedTime: 'Today',
    postedDate: 'Sept 19, 2016',
    skills: ['Troubleshooting', 'Active Directory', 'Customer Support', 'Hardware Diagnostic'],
    missingSkills: ['Scripting']
  },
  {
    name: 'Henry Lynch',
    position: 'Manager and Analyst',
    location: 'Fayetteville, NC',
    email: 'henry.lynch@selectai.io',
    phone: '+1 (555) 890-1234',
    aiMatchScore: 90,
    integrityScore: 92,
    status: 'Interviewing',
    recommendation: 'Hire',
    interviewDate: 'Sept 19, 2016',
    clearance: 'TS/SCI w Poly',
    experienceYears: '5+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$80 - $90',
    connectedStatus: 'CONNECTED',
    postedTime: 'Today',
    postedDate: 'Sept 19, 2016',
    skills: ['Operations Management', 'Data Analysis', 'Reporting', 'Staff Supervision'],
    missingSkills: ['Machine Learning']
  },
  {
    name: 'Brian Salazar',
    position: 'Security Specialist',
    location: 'Hamilton Township, NJ',
    email: 'brian.salazar@selectai.io',
    phone: '+1 (555) 901-2345',
    aiMatchScore: 86,
    integrityScore: 91,
    status: 'Screening',
    recommendation: 'Maybe',
    interviewDate: 'Sept 19, 2016',
    clearance: 'TS/SCI w Poly',
    experienceYears: '5+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$60 - $90',
    connectedStatus: 'CONNECT',
    postedTime: 'Nov 22, 2017',
    postedDate: 'Sept 19, 2016',
    sendToHiringManager: true,
    sendToHr: true,
    skills: ['Physical Security', 'Risk Audit', 'Access Control', 'CCTV System'],
    missingSkills: ['Network Pen-Testing']
  },
  {
    name: 'Rachel Lee',
    position: 'Program Manager',
    location: 'Odenton, MD',
    email: 'rachel.lee@selectai.io',
    phone: '+1 (555) 012-3456',
    aiMatchScore: 93,
    integrityScore: 96,
    status: 'Interviewing',
    recommendation: 'Strong Hire',
    interviewDate: 'Sept 19, 2016',
    clearance: 'Secret',
    experienceYears: '10+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$80 - $90',
    connectedStatus: 'CONNECT',
    postedTime: 'Today',
    postedDate: 'Sept 19, 2016',
    skills: ['Agile Project Management', 'PMP', 'Stakeholder Management', 'Roadmapping'],
    missingSkills: ['Software Engineering']
  }
];

const generateRemaining = (count: number): Candidate[] => {
  const list: Candidate[] = [];
  const firstNames = ['Amit', 'Raj', 'Priya', 'John', 'Sarah', 'Sunita', 'Michael', 'David', 'Jane', 'Neha', 'Vikram', 'Anil', 'Emily', 'Chris', 'Jessica'];
  const lastNames = ['Sharma', 'Verma', 'Kumar', 'Smith', 'Doe', 'Gupta', 'Patel', 'Singh', 'Johnson', 'Davis', 'Taylor', 'Brown', 'Wilson', 'Malhotra', 'Sen'];
  const positions = ['UI/UX Designer', 'Senior Full Stack Engineer', 'AI / Machine Learning Researcher', 'Security Engineer (DevSecOps)', 'Mobile App Developer', 'QA Automation Engineer', 'Senior Office Manager', 'Program Manager'];
  const locations = ['New Delhi, India', 'Bengaluru, India', 'San Francisco, CA', 'Seattle, WA', 'London, UK', 'New York, NY', 'Washington, DC', 'Fayetteville, NC', 'Jacksonville, FL'];
  const clearances = ['TS/SCI w Poly', 'Secret', 'None'];
  const recommendations: Candidate['recommendation'][] = ['Strong Hire', 'Hire', 'Maybe', 'Reject'];
  const statuses: Candidate['status'][] = ['Applied', 'Screening', 'Interviewing', 'Shortlisted', 'Hired'];

  for (let i = 0; i < count; i++) {
    const fName = firstNames[i % firstNames.length];
    const lName = lastNames[(i + 3) % lastNames.length];
    const name = `${fName} ${lName}`;
    const position = positions[i % positions.length];
    const location = locations[i % locations.length];
    const score = 65 + (i * 7) % 31;
    const clearance = clearances[i % clearances.length];
    const experience = `${3 + (i % 8)}+ yrs exp`;
    const salary = `$${50 + (i % 5) * 10} - $${80 + (i % 5) * 10}`;
    const status = statuses[i % statuses.length];
    const rec = recommendations[i % recommendations.length];
    const connectedStatus = i % 2 === 0 ? 'CONNECTED' : 'CONNECT';
    const trackRecordOptions: Candidate['previousTrackRecord'][] = ['clean', 'switched_tab', 'cheated'];
    const previousTrackRecord = trackRecordOptions[i % trackRecordOptions.length];
    
    let integrity = 95;
    if (previousTrackRecord === 'cheated') {
      integrity = 40 + (i * 3) % 20;
    } else if (previousTrackRecord === 'switched_tab') {
      integrity = 70 + (i * 3) % 15;
    } else {
      integrity = 90 + (i * 2) % 10;
    }

    list.push({
      id: `cand-gen-${i}`,
      name,
      position,
      location,
      email: `${fName.toLowerCase()}.${lName.toLowerCase()}@selectai.io`,
      phone: `+91 9${(i * 1234567) % 100000000}`,
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${fName}-${lName}`,
      aiMatchScore: score,
      integrityScore: integrity,
      status,
      recommendation: rec,
      interviewDate: 'Jun 28, 2026',
      clearance,
      experienceYears: experience,
      relocate: 'Willing to relocate',
      salaryRangeText: salary,
      connectedStatus,
      previousTrackRecord,
      postedTime: i % 3 === 0 ? 'Today' : 'Nov 22, 2017',
      postedDate: 'Sept 19, 2016',
      sendToHiringManager: i % 5 === 0,
      sendToHr: i % 4 === 0,
      needToCall: i % 7 === 0,
      skills: [position.split(' ')[0], 'Git', 'Agile', 'Teamwork'],
      missingSkills: [],
      strengths: ['Solid work ethic', 'Proactive communication skills'],
      workExperienceDetails: getDefaultExperiences({ position } as Candidate)
    });
  }
  return list;
};

const mappedScreenshotCandidates: Candidate[] = SCREENSHOT_CANDIDATES.map((c, idx) => {
  let previousTrackRecord: Candidate['previousTrackRecord'] = 'clean';
  let integrityScore = c.integrityScore || 92;

  if (c.name === 'Robert Huber' || c.name === 'Brian Salazar') {
    previousTrackRecord = 'cheated';
    integrityScore = 45; // Reflect cheated status
  } else if (c.name === 'Richard Alpert' || c.name === 'Nicole Morris' || c.name === 'David Taylor') {
    previousTrackRecord = 'switched_tab';
    integrityScore = 78; // Reflect switched tab warning
  } else {
    integrityScore = Math.max(90, integrityScore); // Ensure clean record shows 90%+
  }

  const tempCand = { position: c.position || '', name: c.name || '' } as Candidate;
  const defaults = getDefaultExperiences(tempCand);
  const workExperienceDetails = c.workExperienceDetails && c.workExperienceDetails.length > 0
    ? [
        ...c.workExperienceDetails,
        ...defaults.slice(c.workExperienceDetails.length)
      ]
    : defaults;

  return {
    id: `cand-${idx + 1}`,
    name: c.name || '',
    position: c.position || '',
    location: c.location || '',
    avatarUrl: c.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${c.name?.replace(' ', '')}`,
    email: c.email || `${c.name?.toLowerCase().replace(' ', '.')}@selectai.io`,
    phone: c.phone || '+91 99888 77665',
    aiMatchScore: c.aiMatchScore || 85,
    status: c.status || 'Applied',
    recommendation: c.recommendation || 'Maybe',
    interviewDate: c.interviewDate || 'Jun 28, 2026',
    skills: c.skills || ['Management', 'Communication', 'IT', 'Customer Support'],
    missingSkills: c.missingSkills || [],
    strengths: c.strengths || ['Highly skilled and adaptable'],
    workExperienceDetails,
    previousTrackRecord,
    ...c,
    integrityScore // Override with the aligned integrity score
  } as Candidate;
});

const TOTAL_RECRUITER_CANDIDATES = 25;

export const INITIAL_CANDIDATES: Candidate[] = [
  ...mappedScreenshotCandidates,
  ...generateRemaining(Math.max(0, TOTAL_RECRUITER_CANDIDATES - mappedScreenshotCandidates.length))
].slice(0, TOTAL_RECRUITER_CANDIDATES);

// Exact Live Candidates from Screenshot 2
export const INITIAL_LIVE_CANDIDATES: LiveCandidate[] = [
  {
    id: 'live-1',
    name: "Liam O'Connor",
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
    candidateName: "Liam O'Connor",
    type: 'Multiple Face Detected',
    message: "Liam O'Connor: Second face detected in frame during question 5.",
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
  },
  {
    id: 'alert-4',
    candidateName: 'Sneha Verma',
    type: 'Microphone Instability',
    message: 'Sneha Verma: Mic input is dropping intermittently during live interview playback.',
    severity: 'warning',
    timestamp: '2m ago',
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
    ]
  },
  {
    id: 'job-2',
    title: 'Senior Full Stack Engineer',
    department: 'Engineering',
    status: 'Active',
    candidatesCount: 1,
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
    ]
  },
  {
    id: 'job-3',
    title: 'Security Engineer (DevSecOps)',
    department: 'Security',
    status: 'Active',
    candidatesCount: 1,
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
    ]
  },
  {
    id: 'job-4',
    title: 'Product Design Lead',
    department: 'Design',
    status: 'Hold',
    candidatesCount: 3,
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
    ]
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
    ]
  }
];
