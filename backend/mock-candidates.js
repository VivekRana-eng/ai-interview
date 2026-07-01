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
  },
  design: {
    position: 'UI/UX Designer',
    skills: ['Figma', 'Adobe XD', 'Wireframing', 'User Research', 'CSS', 'TailwindCSS'],
    education: ['B.Des in Communication Design - NID Ahmedabad'],
    experience: ['Lead UI/UX Designer - IndiaTech Solutions (2024 - Present)'],
    certifications: ['Interaction Design Foundation Certified'],
    strengths: ['Pixel-perfect design standards', 'Excellent user empathy', 'Collaborates well with developers'],
    missingSkills: [],
    summary: 'Lead interface designer drafting layout paradigms and component specs.'
  }
};

const candidateSpecs = [
  { role: 'design', name: 'Sneha Verma', location: 'New Delhi, India', email: 'sneha.verma@selectai.gov.in', aiMatchScore: 90, integrityScore: 96, status: 'Interviewing', recommendation: 'Hire', interviewDate: 'Jun 26, 2026' },
  { role: 'security', name: 'Emma Watson', location: 'London, UK', email: 'emma.watson@selectai.io', aiMatchScore: 89, integrityScore: 86, status: 'Applied', recommendation: 'Maybe', interviewDate: 'Jun 21, 2026', previousTrackRecord: 'switched_tab' },
  { role: 'ml', name: 'Alexander Wright', location: 'San Francisco, CA', email: 'alexander.wright@selectai.io', aiMatchScore: 97, integrityScore: 95, status: 'Interviewing', recommendation: 'Strong Hire', interviewDate: 'Jun 20, 2026' },
  { role: 'ml', name: 'Priya Nair', location: 'Bengaluru, India', email: 'priya.nair@selectai.io', aiMatchScore: 94, integrityScore: 92, status: 'Screening', recommendation: 'Hire', interviewDate: 'Jun 21, 2026' },
  { role: 'ml', name: 'Ethan Brooks', location: 'Seattle, WA', email: 'ethan.brooks@selectai.io', aiMatchScore: 90, integrityScore: 88, status: 'Applied', recommendation: 'Maybe', interviewDate: 'Jun 22, 2026', previousTrackRecord: 'switched_tab' }
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
