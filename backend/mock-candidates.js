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
  { role: 'fullstack', name: 'Sarah Jenkins', position: 'Senior Frontend Engineer', location: 'San Francisco, CA', email: 'candidate@hireai.com', phone: '+1 (555) 019-2834', aiMatchScore: 96, integrityScore: 98, status: 'Interviewing', recommendation: 'Strong Hire', interviewDate: 'Jul 22, 2026', previousTrackRecord: 'clean' },
  { role: 'design', name: 'Sneha Verma', location: 'New Delhi, India', email: 'sneha.verma@selectai.gov.in', aiMatchScore: 90, integrityScore: 96, status: 'Interviewing', recommendation: 'Hire', interviewDate: 'Jun 26, 2026' },
  { role: 'security', name: 'Emma Watson', location: 'London, UK', email: 'emma.watson@selectai.io', aiMatchScore: 89, integrityScore: 86, status: 'Applied', recommendation: 'Maybe', interviewDate: 'Jun 21, 2026', previousTrackRecord: 'switched_tab' },
  { role: 'ml', name: 'Daniel Kim', location: 'San Francisco, CA', email: 'daniel.kim@selectai.io', aiMatchScore: 97, integrityScore: 95, status: 'Interviewing', recommendation: 'Strong Hire', interviewDate: 'Jun 20, 2026' },
  { role: 'ml', name: 'Priya Nair', location: 'Bengaluru, India', email: 'priya.nair@selectai.io', aiMatchScore: 94, integrityScore: 92, status: 'Screening', recommendation: 'Hire', interviewDate: 'Jun 21, 2026' },
  { role: 'ml', name: 'Ethan Brooks', location: 'Seattle, WA', email: 'ethan.brooks@selectai.io', aiMatchScore: 90, integrityScore: 88, status: 'Applied', recommendation: 'Maybe', interviewDate: 'Jun 22, 2026', previousTrackRecord: 'switched_tab' }
];

const generateRemaining = (count) => {
  const list = [];
  const firstNames = ['Amit', 'Raj', 'Sunita', 'Vikram', 'David', 'Neha', 'Anil', 'Emily', 'Jessica', 'Siddharth'];
  const lastNames = ['Sharma', 'Kumar', 'Gupta', 'Patel', 'Singh', 'Johnson', 'Taylor', 'Wilson', 'Sen', 'Rao'];
  const roleKeys = ['ml', 'fullstack', 'security', 'qa', 'design'];
  const locations = ['New Delhi, India', 'Bengaluru, India', 'San Francisco, CA', 'Seattle, WA', 'London, UK', 'New York, NY', 'Washington, DC', 'Mumbai, India', 'Hyderabad, India'];
  const clearances = ['TS/SCI w Poly', 'Secret', 'None'];
  const recommendations = ['Strong Hire', 'Hire', 'Maybe', 'Reject'];
  const statuses = ['Applied', 'Screening', 'Interviewing', 'Shortlisted', 'Hired'];

  for (let i = 0; i < count; i++) {
    const fName = firstNames[i % firstNames.length];
    const lName = lastNames[(i + 3) % lastNames.length];
    const name = `${fName} ${lName}`;
    const roleKey = roleKeys[i % roleKeys.length];
    const template = roleTemplates[roleKey];
    const location = locations[i % locations.length];
    const score = 65 + (i * 7) % 31;
    const status = statuses[i % statuses.length];
    const rec = recommendations[i % recommendations.length];
    const previousTrackRecord = ['clean', 'switched_tab', 'cheated'][i % 3];

    let integrity = 95;
    if (previousTrackRecord === 'cheated') {
      integrity = 40 + (i * 3) % 20;
    } else if (previousTrackRecord === 'switched_tab') {
      integrity = 70 + (i * 3) % 15;
    } else {
      integrity = 90 + (i * 2) % 10;
    }

    list.push(makeCandidate({
      name,
      position: template.position,
      location,
      email: `${fName.toLowerCase()}.${lName.toLowerCase()}@selectai.io`,
      phone: `+91 9${(i * 1234567) % 100000000}`,
      aiMatchScore: score,
      integrityScore: integrity,
      status,
      recommendation: rec,
      interviewDate: 'Jun 28, 2026',
      skills: template.skills,
      education: template.education,
      experience: template.experience,
      certifications: template.certifications,
      strengths: template.strengths,
      missingSkills: template.missingSkills,
      summary: `${name} is a ${template.position.toLowerCase()} candidate with strong alignment to the current open role.`,
      previousTrackRecord
    }));
  }
  return list;
};

const INITIAL_CANDIDATES = [
  ...candidateSpecs.map((spec) => {
    const template = roleTemplates[spec.role];
    return makeCandidate({
      name: spec.name,
      position: spec.position || template.position,
      location: spec.location,
      email: spec.email,
      phone: spec.phone || '+1 (555) 019-2834',
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
  }),
  ...generateRemaining(20)
];

module.exports = { INITIAL_CANDIDATES };
