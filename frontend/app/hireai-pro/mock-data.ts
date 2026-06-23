import { Candidate, Job, LiveInterview, AiAlert } from './types';

// Mock Constants
const DEPARTMENTS = ['Engineering', 'Design', 'Product', 'Security', 'Data Science'];
const POSITIONS = [
  'Senior React Engineer', 'Fullstack Developer', 'UI/UX Designer',
  'Lead Product Manager', 'Security Analyst', 'Data Engineer',
  'Frontend Engineer', 'Machine Learning Engineer', 'DevOps Specialist',
  'Mobile App Developer', 'QA Lead', 'Technical Writer'
];

const NAMES = [
  'Amit Sharma', 'Priya Patel', 'Rahul Verma', 'Sneha Reddy', 'Vikram Singh',
  'Ananya Iyer', 'Rohan Gupta', 'Neha Sen', 'Siddharth Rao', 'Kriti Nair',
  'Aditya Joshi', 'Meera Nair', 'Vijay Kumar', 'Divya Teja', 'Sanjay Dutt',
  'Deepa Roy', 'Karan Johar', 'Sunita Rao', 'Abhishek Bose', 'Tanvi Shah',
  'Rajesh Koothrapali', 'Pooja Bhatt', 'Manish Malhotra', 'Arjun Kapoor',
  'Shreya Ghoshal', 'Arijit Singh', 'Sonu Nigam', 'Alka Yagnik', 'Udit Narayan',
  'Kishore Kumar', 'Lata Mangeshkar', 'Asha Bhosle', 'R.D. Burman', 'A.R. Rahman',
  'Zakir Hussain', 'Ravi Shankar', 'Hariprasad Chaurasia', 'Shivkumar Sharma',
  'Bismillah Khan', 'Amjad Ali Khan', 'Srinivas Ramanujan', 'C.V. Raman',
  'Homi Bhabha', 'Jagadish Chandra Bose', 'Vikram Sarabhai', 'A.P.J. Abdul Kalam',
  'Satish Dhawan', 'E. Sreedharan', 'Verghese Kurien', 'M.S. Swaminathan',
  'Amartya Sen', 'Abhijit Banerjee'
];

// 15 Mock Jobs
export const MOCK_JOBS: Job[] = Array.from({ length: 15 }, (_, i) => {
  const title = POSITIONS[i % POSITIONS.length];
  const dept = DEPARTMENTS[i % DEPARTMENTS.length];
  return {
    id: `job-${i + 1}`,
    title,
    department: dept,
    status: i === 14 ? 'Draft' : i === 13 ? 'Closed' : 'Active',
    candidatesCount: 0
  };
});

// 50+ Mock Candidates
export const MOCK_CANDIDATES: Candidate[] = NAMES.map((name, i) => {
  const jobIndex = i % MOCK_JOBS.length;
  const job = MOCK_JOBS[jobIndex];
  
  // Custom distribution of statuses
  let status: Candidate['status'] = 'Applied';
  if (i < 10) status = 'Hired';
  else if (i < 20) status = 'Shortlisted';
  else if (i < 30) status = 'Interviewing';
  else if (i < 40) status = 'Screening';
  
  // Custom distribution of recommendations
  let recommendation: Candidate['recommendation'] = 'Maybe';
  if (i % 4 === 0) recommendation = 'Strong Hire';
  else if (i % 4 === 1) recommendation = 'Hire';
  else if (i % 4 === 2) recommendation = 'Maybe';
  else recommendation = 'Reject';

  // Increment candidates counter on job
  job.candidatesCount++;

  const aiMatchScore = Math.floor(65 + Math.random() * 34); // 65-98
  const integrityScore = Math.floor(70 + Math.random() * 31); // 70-100

  // Date formatted back over past 30 days
  const dateOffset = i % 30;
  const date = new Date();
  date.setDate(date.getDate() - dateOffset);
  const interviewDate = date.toISOString().split('T')[0];

  return {
    id: `cand-${i + 1}`,
    name,
    position: job.title,
    aiMatchScore,
    integrityScore,
    status,
    recommendation,
    interviewDate,
    email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
    avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
  };
});

// 8 Live Interviews
export const MOCK_LIVE_INTERVIEWS: LiveInterview[] = Array.from({ length: 8 }, (_, i) => {
  const candidate = MOCK_CANDIDATES[i + 20]; // Take some from the "Interviewing" list
  const currentQuestion = Math.floor(1 + Math.random() * 5);
  const totalQuestions = 5;
  const progress = Math.floor((currentQuestion / totalQuestions) * 100);
  
  let integrityStatus: LiveInterview['integrityStatus'] = 'Good';
  if (i === 2) integrityStatus = 'Warning';
  if (i === 5) integrityStatus = 'Critical';

  return {
    id: `live-${i + 1}`,
    candidateName: candidate.name,
    position: candidate.position,
    currentQuestion,
    totalQuestions,
    progress,
    integrityStatus,
    avatarUrl: candidate.avatarUrl
  };
});

// Mock AI Security Alerts
export const MOCK_ALERTS: AiAlert[] = [
  {
    id: 'alert-1',
    candidateName: 'Rahul Verma',
    type: 'Multiple Faces Detected',
    message: 'A second person was detected in the camera frame for 12 seconds.',
    severity: 'critical',
    timestamp: '2 mins ago',
    resolved: false
  },
  {
    id: 'alert-2',
    candidateName: 'Priya Patel',
    type: 'Tab Switch Attempt',
    message: 'Candidate switched tabs to lookup developer documentation.',
    severity: 'warning',
    timestamp: '5 mins ago',
    resolved: false
  },
  {
    id: 'alert-3',
    candidateName: 'Sanjay Dutt',
    type: 'Low Confidence Answer',
    message: 'AI voice analysis detects stuttering and potentially read-out content.',
    severity: 'info',
    timestamp: '15 mins ago',
    resolved: false
  },
  {
    id: 'alert-4',
    candidateName: 'Amit Sharma',
    type: 'High Match Potential',
    message: 'Candidate scored 98% in technical fit with exceptional architecture insights.',
    severity: 'info',
    timestamp: '25 mins ago',
    resolved: false
  },
  {
    id: 'alert-5',
    candidateName: 'Vikram Singh',
    type: 'Audio Device Mismatch',
    message: 'Microphone signal disconnected and re-routed during live assessment.',
    severity: 'warning',
    timestamp: '1 hour ago',
    resolved: false
  }
];
