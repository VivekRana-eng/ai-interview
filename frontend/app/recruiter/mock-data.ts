import { Candidate, LiveCandidate, AiAlert, Job } from './types';
import { getDefaultExperiences } from './components/candidate-detail-data';

// Specific candidates — 25 total across Active & Hold jobs
const SCREENSHOT_CANDIDATES: Partial<Candidate>[] = [
  // ─── AI / Machine Learning Researcher (Active) ───
  {
    name: 'Sarah Jenkins',
    position: 'Senior Frontend Engineer',
    location: 'San Francisco, CA',
    email: 'candidate@hireai.com',
    phone: '+1 (555) 019-2834',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah%20Jenkins',
    aiMatchScore: 96,
    integrityScore: 98,
    status: 'Interviewing',
    recommendation: 'Strong Hire',
    interviewDate: 'Jul 22, 2026',
    clearance: 'Secret',
    experienceYears: '6+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$140k - $180k',
    connectedStatus: 'CONNECTED',
    postedTime: 'Today',
    postedDate: 'Jul 20, 2026',
    skills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Redux / Zustand', 'GraphQL', 'Node.js', 'Jest', 'Playwright'],
    missingSkills: ['Rust'],
    strengths: ['UI Architecture', 'Performance Optimization', 'Design Systems', 'State Management'],
    summary: 'High-performing UI Developer & Architect with 6+ years of experience specializing in Next.js, React, TypeScript, and state management. Proven track record of scaling high-throughput Web applications with pixel-perfect UI/UX standards.',
    certifications: ['AWS Certified Developer - Associate', 'Meta Frontend Developer Professional Certificate'],
    workExperienceDetails: [
      {
        role: 'Senior React Developer',
        company: 'BluePeak Systems',
        duration: '2023 - Present',
        description: [
          'Led a team of 4 frontend engineers to architect high-performance dashboard UI in Next.js.',
          'Improved Core Web Vitals score by 45%.',
          'Drove adoption of TypeScript across the frontend codebase, reducing runtime errors by 60%.'
        ]
      },
      {
        role: 'Frontend Engineer',
        company: 'CloudShield Tech',
        duration: '2020 - 2023',
        description: [
          'Maintained enterprise component library used across 12 product lines.',
          'Achieved 98% test coverage using React Testing Library.',
          'Built accessible UI components compliant with WCAG 2.1 AA standards.'
        ]
      }
    ],
    educationDetails: [
      {
        degree: 'B.Tech in Computer Science',
        school: 'IIT Delhi',
        year: '2016 - 2020',
        grade: 'Intelligent Systems / Application Development'
      }
    ]
  },
  {
    name: 'Priya Nair',
    position: 'AI / Machine Learning Researcher',
    location: 'Bengaluru, India',
    email: 'priya.nair@selectai.io',
    phone: '+91 99999 88888',
    aiMatchScore: 94,
    integrityScore: 92,
    status: 'Screening',
    recommendation: 'Hire',
    interviewDate: 'Jun 21, 2026',
    clearance: 'Secret',
    experienceYears: '5+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$60 - $80',
    connectedStatus: 'CONNECTED',
    postedTime: 'Today',
    postedDate: 'Jun 21, 2026',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'LLMs', 'NLP'],
    missingSkills: ['Production MLOps'],
    strengths: ['Model optimization', 'Research-driven problem solving']
  },
  {
    name: 'Ethan Brooks',
    position: 'AI / Machine Learning Researcher',
    location: 'Seattle, WA',
    email: 'ethan.brooks@selectai.io',
    phone: '+1 (555) 345-6789',
    aiMatchScore: 90,
    integrityScore: 88,
    status: 'Applied',
    recommendation: 'Maybe',
    interviewDate: 'Jun 22, 2026',
    clearance: 'TS/SCI w Poly',
    experienceYears: '5+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$80 - $90',
    connectedStatus: 'CONNECTED',
    postedTime: 'Today',
    postedDate: 'Jun 22, 2026',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'LLMs', 'NLP'],
    missingSkills: ['Production MLOps'],
    strengths: ['Model optimization', 'Research-driven problem solving']
  },
  {
    name: 'Ananya Chatterjee',
    position: 'AI / Machine Learning Researcher',
    location: 'Hyderabad, India',
    email: 'ananya.chatterjee@selectai.io',
    phone: '+91 98765 11111',
    aiMatchScore: 88,
    integrityScore: 91,
    status: 'Shortlisted',
    recommendation: 'Hire',
    interviewDate: 'Jun 25, 2026',
    clearance: 'Secret',
    experienceYears: '4+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$70 - $85',
    connectedStatus: 'CONNECTED',
    postedTime: '2 days ago',
    postedDate: 'Jun 25, 2026',
    skills: ['Python', 'PyTorch', 'Hugging Face', 'CUDA', 'MLflow'],
    missingSkills: ['Reinforcement Learning'],
    strengths: ['Strong NLP background', 'Published researcher', 'Efficient model tuning']
  },
  {
    name: 'James Chen',
    position: 'AI / Machine Learning Researcher',
    location: 'New York, NY',
    email: 'james.chen@selectai.io',
    phone: '+1 (555) 222-3344',
    aiMatchScore: 85,
    integrityScore: 90,
    status: 'Applied',
    recommendation: 'Maybe',
    interviewDate: 'Jun 28, 2026',
    clearance: 'None',
    experienceYears: '3+ yrs exp',
    relocate: 'Not willing to relocate',
    salaryRangeText: '$75 - $90',
    connectedStatus: 'CONNECT',
    postedTime: '3 days ago',
    postedDate: 'Jun 28, 2026',
    skills: ['Python', 'TensorFlow', 'Keras', 'Data Analysis', 'Scikit-learn'],
    missingSkills: ['LLMs', 'Transformers'],
    strengths: ['Solid fundamentals', 'Data pipeline experience']
  },
  {
    name: 'Kavitha Reddy',
    position: 'AI / Machine Learning Researcher',
    location: 'Chennai, India',
    email: 'kavitha.reddy@selectai.io',
    phone: '+91 87654 22222',
    aiMatchScore: 92,
    integrityScore: 94,
    status: 'Interviewing',
    recommendation: 'Strong Hire',
    interviewDate: 'Jun 24, 2026',
    clearance: 'Secret',
    experienceYears: '6+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$85 - $100',
    connectedStatus: 'CONNECTED',
    postedTime: 'Today',
    postedDate: 'Jun 24, 2026',
    skills: ['Python', 'PyTorch', 'LLMs', 'NLP', 'Computer Vision', 'MLOps'],
    missingSkills: [],
    strengths: ['End-to-end ML pipeline expertise', 'Production deployment experience', 'Research publications']
  },
  // ─── Senior Full Stack Engineer (Active) ───
  {
    name: 'Rahul Mehta',
    position: 'Senior Full Stack Engineer',
    location: 'Pune, India',
    email: 'rahul.mehta@selectai.io',
    phone: '+91 99887 66554',
    aiMatchScore: 91,
    integrityScore: 93,
    status: 'Interviewing',
    recommendation: 'Hire',
    interviewDate: 'Jun 23, 2026',
    clearance: 'None',
    experienceYears: '6+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$70 - $85',
    connectedStatus: 'CONNECTED',
    postedTime: 'Today',
    postedDate: 'Jun 23, 2026',
    skills: ['Next.js', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
    missingSkills: ['GraphQL'],
    strengths: ['Scalable architecture design', 'Strong DevOps skills', 'Team mentoring']
  },
  {
    name: 'Sarah Mitchell',
    position: 'Senior Full Stack Engineer',
    location: 'London, UK',
    email: 'sarah.mitchell@selectai.io',
    phone: '+44 7700 900123',
    aiMatchScore: 87,
    integrityScore: 89,
    status: 'Screening',
    recommendation: 'Hire',
    interviewDate: 'Jun 24, 2026',
    clearance: 'Secret',
    experienceYears: '5+ yrs exp',
    relocate: 'Not willing to relocate',
    salaryRangeText: '$75 - $90',
    connectedStatus: 'CONNECTED',
    postedTime: '1 day ago',
    postedDate: 'Jun 24, 2026',
    skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'AWS'],
    missingSkills: ['Next.js'],
    strengths: ['Clean code practices', 'Strong testing discipline', 'API design']
  },
  {
    name: 'Vikram Singh',
    position: 'Senior Full Stack Engineer',
    location: 'Noida, India',
    email: 'vikram.singh@selectai.io',
    phone: '+91 98765 33333',
    aiMatchScore: 82,
    integrityScore: 85,
    status: 'Applied',
    recommendation: 'Maybe',
    interviewDate: 'Jun 26, 2026',
    clearance: 'None',
    experienceYears: '4+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$55 - $70',
    connectedStatus: 'CONNECT',
    postedTime: '3 days ago',
    postedDate: 'Jun 26, 2026',
    skills: ['React', 'Express', 'MongoDB', 'JavaScript', 'Git'],
    missingSkills: ['Next.js', 'TypeScript', 'Docker'],
    strengths: ['Quick learner', 'Agile methodology experience']
  },
  {
    name: 'Olivia Turner',
    position: 'Senior Full Stack Engineer',
    location: 'Austin, TX',
    email: 'olivia.turner@selectai.io',
    phone: '+1 (555) 456-7890',
    aiMatchScore: 93,
    integrityScore: 96,
    status: 'Shortlisted',
    recommendation: 'Strong Hire',
    interviewDate: 'Jun 22, 2026',
    clearance: 'TS/SCI w Poly',
    experienceYears: '7+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$90 - $110',
    connectedStatus: 'CONNECTED',
    postedTime: 'Today',
    postedDate: 'Jun 22, 2026',
    skills: ['Next.js', 'React', 'Node.js', 'TypeScript', 'GraphQL', 'PostgreSQL'],
    missingSkills: [],
    strengths: ['Full stack expertise', 'System design', 'Performance optimization', 'Leadership']
  },
  {
    name: 'Deepak Sharma',
    position: 'Senior Full Stack Engineer',
    location: 'Bengaluru, India',
    email: 'deepak.sharma@selectai.io',
    phone: '+91 77665 44332',
    aiMatchScore: 78,
    integrityScore: 80,
    status: 'Applied',
    recommendation: 'Maybe',
    interviewDate: 'Jun 29, 2026',
    clearance: 'None',
    experienceYears: '3+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$50 - $65',
    connectedStatus: 'CONNECT',
    postedTime: '5 days ago',
    postedDate: 'Jun 29, 2026',
    skills: ['React', 'Node.js', 'MongoDB', 'CSS', 'REST APIs'],
    missingSkills: ['Next.js', 'TypeScript', 'Docker', 'PostgreSQL'],
    strengths: ['Strong problem solver', 'Good communicator']
  },
  {
    name: 'Nisha Kapoor',
    position: 'Senior Full Stack Engineer',
    location: 'Gurugram, India',
    email: 'nisha.kapoor@selectai.io',
    phone: '+91 88776 55443',
    aiMatchScore: 86,
    integrityScore: 91,
    status: 'Screening',
    recommendation: 'Hire',
    interviewDate: 'Jun 25, 2026',
    clearance: 'Secret',
    experienceYears: '5+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$65 - $80',
    connectedStatus: 'CONNECTED',
    postedTime: '2 days ago',
    postedDate: 'Jun 25, 2026',
    skills: ['Next.js', 'React', 'Node.js', 'Express', 'Redis', 'MongoDB'],
    missingSkills: ['Kubernetes'],
    strengths: ['Strong backend architecture', 'Caching strategies', 'Mentoring juniors']
  },
  // ─── Security Engineer (DevSecOps) (Active) ───
  {
    name: 'Emma Watson',
    position: 'Security Engineer (DevSecOps)',
    location: 'London, UK',
    email: 'emma.watson@selectai.io',
    phone: '+1 (555) 998-8877',
    aiMatchScore: 89,
    integrityScore: 86,
    status: 'Applied',
    recommendation: 'Maybe',
    interviewDate: 'Jun 21, 2026',
    clearance: 'TS/SCI w Poly',
    experienceYears: '5+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$80 - $90',
    connectedStatus: 'CONNECTED',
    postedTime: 'Today',
    postedDate: 'Jun 21, 2026',
    skills: ['Docker', 'Kubernetes', 'AWS', 'IAM', 'OWASP'],
    missingSkills: ['Mobile Security'],
    strengths: ['Threat modeling', 'Cloud hardening', 'Access control']
  },
  {
    name: 'Arjun Deshmukh',
    position: 'Security Engineer (DevSecOps)',
    location: 'Mumbai, India',
    email: 'arjun.deshmukh@selectai.io',
    phone: '+91 99001 22334',
    aiMatchScore: 91,
    integrityScore: 94,
    status: 'Interviewing',
    recommendation: 'Hire',
    interviewDate: 'Jun 23, 2026',
    clearance: 'Secret',
    experienceYears: '6+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$75 - $90',
    connectedStatus: 'CONNECTED',
    postedTime: 'Today',
    postedDate: 'Jun 23, 2026',
    skills: ['Docker', 'Kubernetes', 'AWS', 'IAM', 'OWASP', 'Terraform'],
    missingSkills: [],
    strengths: ['Infrastructure as Code', 'CI/CD security pipelines', 'Incident response']
  },
  {
    name: 'Marcus Johnson',
    position: 'Security Engineer (DevSecOps)',
    location: 'Washington, DC',
    email: 'marcus.johnson@selectai.io',
    phone: '+1 (555) 777-4455',
    aiMatchScore: 84,
    integrityScore: 87,
    status: 'Screening',
    recommendation: 'Maybe',
    interviewDate: 'Jun 26, 2026',
    clearance: 'TS/SCI w Poly',
    experienceYears: '4+ yrs exp',
    relocate: 'Not willing to relocate',
    salaryRangeText: '$85 - $100',
    connectedStatus: 'CONNECT',
    postedTime: '2 days ago',
    postedDate: 'Jun 26, 2026',
    skills: ['Docker', 'AWS', 'OWASP', 'SIEM', 'Python'],
    missingSkills: ['Kubernetes', 'Terraform'],
    strengths: ['Government security clearance', 'Compliance expertise', 'Penetration testing']
  },
  {
    name: 'Pooja Iyer',
    position: 'Security Engineer (DevSecOps)',
    location: 'Bengaluru, India',
    email: 'pooja.iyer@selectai.io',
    phone: '+91 98234 56789',
    aiMatchScore: 86,
    integrityScore: 92,
    status: 'Applied',
    recommendation: 'Hire',
    interviewDate: 'Jun 27, 2026',
    clearance: 'Secret',
    experienceYears: '5+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$65 - $80',
    connectedStatus: 'CONNECTED',
    postedTime: '1 day ago',
    postedDate: 'Jun 27, 2026',
    skills: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'IAM', 'SAST/DAST'],
    missingSkills: ['Mobile Security'],
    strengths: ['Cloud-native security', 'Automated scanning pipelines', 'Team collaboration']
  },
  // ─── Product Design Lead (Hold) ───
  {
    name: 'Sneha Verma',
    position: 'Product Design Lead',
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
    name: 'Daniel Kim',
    position: 'Product Design Lead',
    location: 'Seoul, South Korea',
    email: 'daniel.kim@selectai.io',
    phone: '+82 10 1234 5678',
    aiMatchScore: 93,
    integrityScore: 90,
    status: 'Shortlisted',
    recommendation: 'Strong Hire',
    interviewDate: 'Jun 22, 2026',
    clearance: 'None',
    experienceYears: '7+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$80 - $95',
    connectedStatus: 'CONNECTED',
    postedTime: 'Today',
    postedDate: 'Jun 22, 2026',
    skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'Accessibility'],
    missingSkills: [],
    strengths: ['Design leadership', 'Cross-functional collaboration', 'Strategic UX thinking']
  },
  {
    name: 'Meera Joshi',
    position: 'Product Design Lead',
    location: 'Mumbai, India',
    email: 'meera.joshi@selectai.io',
    phone: '+91 98765 77777',
    aiMatchScore: 87,
    integrityScore: 93,
    status: 'Screening',
    recommendation: 'Hire',
    interviewDate: 'Jun 25, 2026',
    clearance: 'None',
    experienceYears: '5+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$60 - $75',
    connectedStatus: 'CONNECTED',
    postedTime: '2 days ago',
    postedDate: 'Jun 25, 2026',
    skills: ['Figma', 'Sketch', 'User Research', 'Interaction Design', 'Prototyping'],
    missingSkills: ['Accessibility'],
    strengths: ['Strong visual design sense', 'Rapid prototyping', 'User-centered approach']
  },
  {
    name: 'Chris Anderson',
    position: 'Product Design Lead',
    location: 'Chicago, IL',
    email: 'chris.anderson@selectai.io',
    phone: '+1 (555) 888-1122',
    aiMatchScore: 80,
    integrityScore: 85,
    status: 'Applied',
    recommendation: 'Maybe',
    interviewDate: 'Jun 28, 2026',
    clearance: 'None',
    experienceYears: '4+ yrs exp',
    relocate: 'Not willing to relocate',
    salaryRangeText: '$70 - $85',
    connectedStatus: 'CONNECT',
    postedTime: '4 days ago',
    postedDate: 'Jun 28, 2026',
    skills: ['Figma', 'Adobe XD', 'Wireframing', 'CSS'],
    missingSkills: ['Design Systems', 'User Research', 'Accessibility'],
    strengths: ['Clean visual aesthetics', 'Good typography sense']
  },
  {
    name: 'Riya Gupta',
    position: 'Product Design Lead',
    location: 'Bengaluru, India',
    email: 'riya.gupta@selectai.io',
    phone: '+91 88999 44455',
    aiMatchScore: 89,
    integrityScore: 91,
    status: 'Interviewing',
    recommendation: 'Hire',
    interviewDate: 'Jun 24, 2026',
    clearance: 'None',
    experienceYears: '6+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$65 - $80',
    connectedStatus: 'CONNECTED',
    postedTime: '1 day ago',
    postedDate: 'Jun 24, 2026',
    skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'Motion Design'],
    missingSkills: [],
    strengths: ['Design system expertise', 'Motion design skills', 'Stakeholder management']
  },
  {
    name: 'Aditya Malhotra',
    position: 'Product Design Lead',
    location: 'New Delhi, India',
    email: 'aditya.malhotra@selectai.io',
    phone: '+91 77655 88899',
    aiMatchScore: 76,
    integrityScore: 82,
    status: 'Applied',
    recommendation: 'Maybe',
    interviewDate: 'Jun 30, 2026',
    clearance: 'None',
    experienceYears: '3+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$50 - $65',
    connectedStatus: 'CONNECT',
    postedTime: '6 days ago',
    postedDate: 'Jun 30, 2026',
    skills: ['Figma', 'Adobe XD', 'Wireframing'],
    missingSkills: ['Design Systems', 'User Research', 'Prototyping', 'Accessibility'],
    strengths: ['Creative thinker', 'Fast iteration speed']
  },
  {
    name: 'Sophie Laurent',
    position: 'Product Design Lead',
    location: 'Paris, France',
    email: 'sophie.laurent@selectai.io',
    phone: '+33 6 12 34 56 78',
    aiMatchScore: 95,
    integrityScore: 97,
    status: 'Shortlisted',
    recommendation: 'Strong Hire',
    interviewDate: 'Jun 21, 2026',
    clearance: 'None',
    experienceYears: '8+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$90 - $110',
    connectedStatus: 'CONNECTED',
    postedTime: 'Today',
    postedDate: 'Jun 21, 2026',
    skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'Accessibility', 'Motion Design'],
    missingSkills: [],
    strengths: ['World-class design portfolio', 'Design leadership', 'Inclusive design advocate']
  },
  {
    name: 'Rohit Saxena',
    position: 'Senior Full Stack Engineer',
    location: 'Jaipur, India',
    email: 'rohit.saxena@selectai.io',
    phone: '+91 99123 45678',
    aiMatchScore: 81,
    integrityScore: 88,
    status: 'Applied',
    recommendation: 'Maybe',
    interviewDate: 'Jun 30, 2026',
    clearance: 'None',
    experienceYears: '4+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$55 - $70',
    connectedStatus: 'CONNECT',
    postedTime: '4 days ago',
    postedDate: 'Jun 30, 2026',
    skills: ['React', 'Node.js', 'Express', 'MySQL', 'Git'],
    missingSkills: ['Next.js', 'TypeScript', 'Docker', 'MongoDB'],
    strengths: ['Consistent delivery', 'Good debugging skills']
  },
  {
    name: 'Fatima Al-Rashid',
    position: 'Security Engineer (DevSecOps)',
    location: 'Dubai, UAE',
    email: 'fatima.alrashid@selectai.io',
    phone: '+971 50 123 4567',
    aiMatchScore: 88,
    integrityScore: 93,
    status: 'Shortlisted',
    recommendation: 'Hire',
    interviewDate: 'Jun 23, 2026',
    clearance: 'Secret',
    experienceYears: '5+ yrs exp',
    relocate: 'Willing to relocate',
    salaryRangeText: '$80 - $95',
    connectedStatus: 'CONNECTED',
    postedTime: '1 day ago',
    postedDate: 'Jun 23, 2026',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'IAM', 'OWASP', 'Terraform'],
    missingSkills: [],
    strengths: ['Multi-cloud security', 'Compliance frameworks', 'Zero-trust architecture']
  }
];

// Only Active & Hold job positions for generated candidates
const generateRemaining = (count: number): Candidate[] => {
  const list: Candidate[] = [];
  const firstNames = ['Amit', 'Raj', 'Sunita', 'Michael', 'David', 'Neha', 'Vikram', 'Anil', 'Emily', 'Jessica'];
  const lastNames = ['Sharma', 'Kumar', 'Gupta', 'Patel', 'Singh', 'Johnson', 'Davis', 'Taylor', 'Wilson', 'Sen'];
  // Only Active & Hold job positions
  const positions = ['AI / Machine Learning Researcher', 'Senior Full Stack Engineer', 'Security Engineer (DevSecOps)', 'Product Design Lead'];
  const locations = ['New Delhi, India', 'Bengaluru, India', 'San Francisco, CA', 'Seattle, WA', 'London, UK', 'New York, NY', 'Washington, DC', 'Mumbai, India', 'Hyderabad, India'];
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
      postedTime: i % 3 === 0 ? 'Today' : '2 days ago',
      postedDate: 'Jun 28, 2026',
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
    position: 'Security Engineer (DevSecOps)',
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
    position: 'Product Design Lead',
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
    position: 'Senior Full Stack Engineer',
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

import { INITIAL_SHARED_JOBS } from '../shared/jobs';
export const MOCK_JOBS: Job[] = INITIAL_SHARED_JOBS as any;
