const makeCandidate = (candidate) => ({
  avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(candidate.name)}`,
  skills: [],
  education: [],
  experience: [],
  certifications: [],
  strengths: [],
  missingSkills: [],
  summary: '',
  previousTrackRecord: 'clean',
  ...candidate
});

const roleTemplates = {
  ml: {
    position: 'AI / Machine Learning Researcher',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'LLMs', 'NLP'],
    education: ['M.S. in Computer Science - Stanford University'],
    experience: ['ML Engineer - DeepCompute Labs (2023 - Present)'],
    certifications: ['Google Professional Machine Learning Engineer'],
    strengths: ['Model optimization', 'Research-driven problem solving', 'Scalable experimentation'],
    missingSkills: ['Production MLOps'],
    summary: 'Strong research-to-production profile with solid NLP and model optimization depth.'
  },
  fullstack: {
    position: 'Senior Full Stack Engineer',
    skills: ['Next.js', 'React', 'Node.js', 'MongoDB', 'TypeScript'],
    education: ['B.Tech in Computer Science - IIT Delhi'],
    experience: ['Full Stack Engineer - BluePeak Systems (2022 - Present)'],
    certifications: ['AWS Certified Developer - Associate'],
    strengths: ['Frontend architecture', 'API design', 'Fast product delivery'],
    missingSkills: ['Distributed systems'],
    summary: 'Balanced frontend and backend engineer with strong product delivery focus.'
  },
  security: {
    position: 'Security Engineer (DevSecOps)',
    skills: ['Docker', 'Kubernetes', 'AWS', 'IAM', 'OWASP'],
    education: ['B.E. in Information Security - VIT Vellore'],
    experience: ['Security Engineer - CloudShield (2022 - Present)'],
    certifications: ['CISSP'],
    strengths: ['Threat modeling', 'Cloud hardening', 'Access control'],
    missingSkills: ['Mobile security'],
    summary: 'Security-focused candidate with practical DevSecOps and compliance experience.'
  },
  qa: {
    position: 'QA Engineer',
    skills: ['Playwright', 'Cypress', 'Jest', 'Selenium', 'Test Automation'],
    education: ['B.Sc. in Information Technology - Pune University'],
    experience: ['QA Automation Engineer - QualityFirst (2021 - Present)'],
    certifications: ['ISTQB Foundation Level'],
    strengths: ['Automation coverage', 'Regression discipline', 'Bug triage'],
    missingSkills: ['Performance testing'],
    summary: 'Reliable QA automation profile with strong regression and test stability habits.'
  }
};

const candidateSpecs = [
  { role: 'ml', name: 'Alexander Wright', location: 'San Francisco, CA', email: 'alexander.wright@selectai.io', aiMatchScore: 97, integrityScore: 95, status: 'Interviewing', recommendation: 'Strong Hire', interviewDate: 'Jun 20, 2026' },
  { role: 'ml', name: 'Priya Nair', location: 'Bengaluru, India', email: 'priya.nair@selectai.io', aiMatchScore: 94, integrityScore: 92, status: 'Screening', recommendation: 'Hire', interviewDate: 'Jun 21, 2026' },
  { role: 'ml', name: 'Ethan Brooks', location: 'Seattle, WA', email: 'ethan.brooks@selectai.io', aiMatchScore: 90, integrityScore: 88, status: 'Applied', recommendation: 'Maybe', interviewDate: 'Jun 22, 2026', previousTrackRecord: 'switched_tab' },
  { role: 'ml', name: 'Meera Iyer', location: 'New Delhi, India', email: 'meera.iyer@selectai.io', aiMatchScore: 96, integrityScore: 97, status: 'Shortlisted', recommendation: 'Strong Hire', interviewDate: 'Jun 23, 2026' },
  { role: 'ml', name: 'Daniel Kim', location: 'Toronto, Canada', email: 'daniel.kim@selectai.io', aiMatchScore: 93, integrityScore: 91, status: 'Interviewing', recommendation: 'Hire', interviewDate: 'Jun 24, 2026' },
  { role: 'ml', name: 'Olivia Martinez', location: 'Austin, TX', email: 'olivia.martinez@selectai.io', aiMatchScore: 91, integrityScore: 89, status: 'Screening', recommendation: 'Hire', interviewDate: 'Jun 25, 2026' },
  { role: 'ml', name: 'Rahul Sen', location: 'Hyderabad, India', email: 'rahul.sen@selectai.io', aiMatchScore: 95, integrityScore: 96, status: 'Hired', recommendation: 'Strong Hire', interviewDate: 'Jun 26, 2026' },
  { role: 'fullstack', name: 'Sophia Chen', location: 'Seattle, WA', email: 'sophia.chen@selectai.io', aiMatchScore: 95, integrityScore: 98, status: 'Screening', recommendation: 'Strong Hire', interviewDate: 'Jun 18, 2026' },
  { role: 'fullstack', name: "Liam O'Connor", location: 'Dublin, Ireland', email: 'liam.oconnor@selectai.io', aiMatchScore: 92, integrityScore: 90, status: 'Interviewing', recommendation: 'Hire', interviewDate: 'Jun 19, 2026' },
  { role: 'fullstack', name: 'Ananya Sharma', location: 'Pune, India', email: 'ananya.sharma@selectai.io', aiMatchScore: 88, integrityScore: 93, status: 'Applied', recommendation: 'Maybe', interviewDate: 'Jun 20, 2026' },
  { role: 'fullstack', name: 'Carlos Mendes', location: 'Lisbon, Portugal', email: 'carlos.mendes@selectai.io', aiMatchScore: 90, integrityScore: 88, status: 'Shortlisted', recommendation: 'Hire', interviewDate: 'Jun 21, 2026', previousTrackRecord: 'switched_tab' },
  { role: 'fullstack', name: 'Tanvi Malhotra', location: 'Mumbai, India', email: 'tanvi.malhotra@selectai.io', aiMatchScore: 93, integrityScore: 94, status: 'Interviewing', recommendation: 'Hire', interviewDate: 'Jun 22, 2026' },
  { role: 'fullstack', name: 'Kevin Brown', location: 'Chicago, IL', email: 'kevin.brown@selectai.io', aiMatchScore: 97, integrityScore: 96, status: 'Hired', recommendation: 'Strong Hire', interviewDate: 'Jun 23, 2026' },
  { role: 'security', name: 'Emma Watson', location: 'London, UK', email: 'emma.watson@selectai.io', aiMatchScore: 89, integrityScore: 86, status: 'Applied', recommendation: 'Maybe', interviewDate: 'Jun 21, 2026', previousTrackRecord: 'switched_tab' },
  { role: 'security', name: 'Arjun Patel', location: 'Ahmedabad, India', email: 'arjun.patel@selectai.io', aiMatchScore: 92, integrityScore: 94, status: 'Screening', recommendation: 'Hire', interviewDate: 'Jun 22, 2026' },
  { role: 'security', name: 'Yuki Tanaka', location: 'Tokyo, Japan', email: 'yuki.tanaka@selectai.io', aiMatchScore: 95, integrityScore: 93, status: 'Interviewing', recommendation: 'Strong Hire', interviewDate: 'Jun 23, 2026' },
  { role: 'security', name: 'Sana Khan', location: 'Dubai, UAE', email: 'sana.khan@selectai.io', aiMatchScore: 91, integrityScore: 90, status: 'Shortlisted', recommendation: 'Hire', interviewDate: 'Jun 24, 2026' },
  { role: 'security', name: 'Jason Miller', location: 'Austin, TX', email: 'jason.miller@selectai.io', aiMatchScore: 87, integrityScore: 58, status: 'Applied', recommendation: 'Reject', interviewDate: 'Jun 25, 2026', previousTrackRecord: 'cheated' },
  { role: 'security', name: 'Kavya Rao', location: 'Bengaluru, India', email: 'kavya.rao@selectai.io', aiMatchScore: 96, integrityScore: 97, status: 'Hired', recommendation: 'Strong Hire', interviewDate: 'Jun 26, 2026' },
  { role: 'qa', name: 'Nikhil Verma', location: 'Gurugram, India', email: 'nikhil.verma@selectai.io', aiMatchScore: 89, integrityScore: 91, status: 'Screening', recommendation: 'Hire', interviewDate: 'Jun 24, 2026' },
  { role: 'qa', name: 'Emily Davis', location: 'New York, NY', email: 'emily.davis@selectai.io', aiMatchScore: 94, integrityScore: 95, status: 'Interviewing', recommendation: 'Strong Hire', interviewDate: 'Jun 25, 2026' },
  { role: 'qa', name: 'Rohan Kapoor', location: 'Chandigarh, India', email: 'rohan.kapoor@selectai.io', aiMatchScore: 86, integrityScore: 87, status: 'Applied', recommendation: 'Maybe', interviewDate: 'Jun 26, 2026' },
  { role: 'qa', name: 'Grace Lee', location: 'Singapore', email: 'grace.lee@selectai.io', aiMatchScore: 91, integrityScore: 92, status: 'Shortlisted', recommendation: 'Hire', interviewDate: 'Jun 27, 2026' },
  { role: 'qa', name: 'Harsh Mehta', location: 'Ahmedabad, India', email: 'harsh.mehta@selectai.io', aiMatchScore: 95, integrityScore: 94, status: 'Interviewing', recommendation: 'Strong Hire', interviewDate: 'Jun 28, 2026' },
  { role: 'qa', name: 'Priyanka Bose', location: 'Kolkata, India', email: 'priyanka.bose@selectai.io', aiMatchScore: 93, integrityScore: 96, status: 'Hired', recommendation: 'Strong Hire', interviewDate: 'Jun 29, 2026' }
];

const INITIAL_CANDIDATES = candidateSpecs.map((spec) => {
  const template = roleTemplates[spec.role];
  return makeCandidate({
    name: spec.name,
    position: template.position,
    location: spec.location,
    email: spec.email,
    aiMatchScore: spec.aiMatchScore,
    integrityScore: spec.integrityScore,
    status: spec.status,
    recommendation: spec.recommendation,
    interviewDate: spec.interviewDate,
    skills: template.skills,
    education: template.education,
    experience: template.experience,
    certifications: template.certifications,
    strengths: template.strengths,
    missingSkills: template.missingSkills,
    summary: `${spec.name} is a ${template.position.toLowerCase()} candidate with strong alignment to the current open role.`,
    previousTrackRecord: spec.previousTrackRecord || 'clean'
  });
});

module.exports = { INITIAL_CANDIDATES };
