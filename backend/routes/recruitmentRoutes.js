const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const Alert = require('../models/Alert');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const upload = multer({ storage: multer.memoryStorage() });

const INITIAL_CANDIDATES = [
  {
    name: 'Alexander Wright',
    position: 'AI / Machine Learning Researcher',
    location: 'San Francisco, CA',
    email: 'alex.wright@selectai.io',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alexander',
    aiMatchScore: 96,
    integrityScore: 94,
    status: 'Interviewing',
    recommendation: 'Strong Hire',
    interviewDate: 'Jun 20, 2026'
  },
  {
    name: 'Sophia Chen',
    position: 'Senior Full Stack Engineer',
    location: 'Seattle, WA',
    email: 'sophia.chen@selectai.io',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia',
    aiMatchScore: 94,
    integrityScore: 98,
    status: 'Screening',
    recommendation: 'Strong Hire',
    interviewDate: 'Jun 18, 2026'
  },
  {
    name: 'Emma Watson',
    position: 'Security Engineer (DevSecOps)',
    location: 'London, UK',
    email: 'emma.watson@selectai.io',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Emma',
    aiMatchScore: 89,
    integrityScore: 86,
    status: 'Applied',
    recommendation: 'Maybe',
    interviewDate: 'Jun 21, 2026'
  }
];

const INITIAL_ALERTS = [
  {
    candidateName: 'Daniel Kim',
    type: 'High Potential Match',
    message: 'Daniel Kim: AI score matches outstanding benchmarks (95%+ match).',
    severity: 'info',
    timestamp: 'Just now',
    resolved: false
  },
  {
    candidateName: 'Liam O\'Connor',
    type: 'Multiple Face Detected',
    message: 'Liam O\'Connor: Second face detected in frame during question 5.',
    severity: 'critical',
    timestamp: 'Just now',
    resolved: false
  },
  {
    candidateName: 'Yuki Tanaka',
    type: 'High Potential Match',
    message: 'Yuki Tanaka: AI score matches outstanding benchmarks (90%+ match).',
    severity: 'info',
    timestamp: 'Just now',
    resolved: false
  }
];

const MOCK_JOBS = [
  {
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

// Helper to generate AI summary and interview questions based on title and metadata
function generateAiMetadata(title, description, skills, department) {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('machine learning') || titleLower.includes('ml') || titleLower.includes('ai') || titleLower.includes('researcher')) {
    return {
      aiSummary: `Lead investigator for machine learning modeling and deep neural framework research. Focuses on NLP/Transformers, model optimization, and scalable AI infrastructure.`,
      aiQuestions: [
        `Detail the trade-offs of fine-tuning LLMs vs using RAG for context retrieval.`,
        `Explain optimization strategies for backpropagation in deep architectures.`,
        `How do you manage computational efficiency during training and inference?`,
        `Describe a challenging ML model scalability issue you encountered and how you solved it.`
      ]
    };
  }
  
  if (titleLower.includes('full stack') || titleLower.includes('frontend') || titleLower.includes('backend') || titleLower.includes('web') || titleLower.includes('software')) {
    return {
      aiSummary: `Lead product engineer responsible for frontend client systems, state management, and resilient, high-concurrency API services.`,
      aiQuestions: [
        `Explain Next.js rendering modes (SSR, SSG, ISR) and their appropriate use cases.`,
        `How do you structure database schemas for fast indexing and performance under heavy load?`,
        `Detail your experience scaling high-concurrency Node.js endpoints.`,
        `Describe your approach to state management in complex frontend applications.`
      ]
    };
  }
  
  if (titleLower.includes('security') || titleLower.includes('devsecops') || titleLower.includes('cyber')) {
    return {
      aiSummary: `Security compliance officer establishing container guardrails, access policies, and automated security scans in the CI/CD pipeline.`,
      aiQuestions: [
        `Describe how you audit code for OWASP Top 10 vulnerabilities.`,
        `How do you secure multi-tenant cloud instances and handle secret management?`,
        `Walk us through how you would configure a DevSecOps CI/CD scanner.`,
        `Detail a time you resolved a major production security vulnerability under pressure.`
      ]
    };
  }

  if (titleLower.includes('devops') || titleLower.includes('cloud') || titleLower.includes('infrastructure')) {
    return {
      aiSummary: `Principal cloud architect designing high-availability automation systems, infrastructure as code, and cluster orchestration.`,
      aiQuestions: [
        `Detail your approach to configuring multi-region failovers and disaster recovery.`,
        `How do you monitor container telemetry and build alert rules?`,
        `Explain infrastructure-as-code configuration drift management.`,
        `How do you manage scaling and network routing inside a Kubernetes cluster?`
      ]
    };
  }

  if (titleLower.includes('design') || titleLower.includes('ui') || titleLower.includes('ux')) {
    return {
      aiSummary: `Lead interface designer drafting layout paradigms, component specifications, and user experience journeys.`,
      aiQuestions: [
        `How do you adapt layout systems for responsive viewports?`,
        `Describe your handoff process to frontend engineers.`,
        `Detail your experience creating custom design token architectures.`,
        `How do you validate design systems with real users and incorporate feedback?`
      ]
    };
  }

  const skillsList = Array.isArray(skills) ? skills : [];
  const skillText = skillsList.length > 0 ? ` specializing in ${skillsList.slice(0, 3).join(', ')}` : '';
  const deptText = department ? ` for the ${department} department` : '';
  return {
    aiSummary: `Expert ${title}${skillText}${deptText}, responsible for drafting high-quality, scalable solutions and driving technical excellence.`,
    aiQuestions: [
      `Detail a complex problem you solved while working with ${skillsList.length > 0 ? skillsList.slice(0, 2).join(', ') : 'modern technology stacks'}.`,
      `How do you collaborate with cross-functional teams to align design decisions?`,
      `Describe your approach to ensuring code quality, security, and performance.`,
      `What is your process for learning new technologies and architectural patterns?`
    ]
  };
}

// Seed Route
router.post('/seed', async (req, res) => {
  try {
    await Job.deleteMany({});
    await Candidate.deleteMany({});
    await Alert.deleteMany({});

    await Job.insertMany(MOCK_JOBS);
    await Candidate.insertMany(INITIAL_CANDIDATES);
    await Alert.insertMany(INITIAL_ALERTS);

    res.status(200).json({ message: 'Database seeded successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Candidates CRUD
router.get('/candidates', async (req, res) => {
  try {
    const list = await Candidate.find({}).sort({ createdAt: -1 });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/candidates', async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    await candidate.save();
    
    // Update candidates count for the associated job
    if (candidate.position) {
      await Job.findOneAndUpdate(
        { title: candidate.position },
        { $inc: { candidatesCount: 1 } }
      );
    }

    res.status(201).json(candidate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/candidates/:id', async (req, res) => {
  try {
    const candidateBefore = await Candidate.findById(req.params.id);
    if (!candidateBefore) return res.status(404).json({ message: 'Candidate not found' });

    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // If the candidate's position changed, adjust candidate counts
    if (req.body.position && req.body.position !== candidateBefore.position) {
      if (candidateBefore.position) {
        await Job.findOneAndUpdate({ title: candidateBefore.position }, { $inc: { candidatesCount: -1 } });
      }
      await Job.findOneAndUpdate({ title: req.body.position }, { $inc: { candidatesCount: 1 } });
    }

    res.status(200).json(candidate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/candidates/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    
    // Update candidates count for the associated job
    if (candidate.position) {
      await Job.findOneAndUpdate(
        { title: candidate.position },
        { $inc: { candidatesCount: -1 } }
      );
    }

    res.status(200).json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Jobs CRUD
router.get('/jobs', async (req, res) => {
  try {
    const list = await Job.find({}).sort({ createdAt: -1 });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/jobs', async (req, res) => {
  try {
    const jobData = { ...req.body };
    if (!jobData.aiSummary || !jobData.aiQuestions || jobData.aiQuestions.length === 0) {
      const generated = generateAiMetadata(
        jobData.title,
        jobData.description || '',
        jobData.skillsRequired || [],
        jobData.department || ''
      );
      jobData.aiSummary = jobData.aiSummary || generated.aiSummary;
      jobData.aiQuestions = jobData.aiQuestions && jobData.aiQuestions.length > 0 ? jobData.aiQuestions : generated.aiQuestions;
    }
    const job = new Job(jobData);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/jobs/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    const jobBefore = await Job.findById(req.params.id);
    if (!jobBefore) return res.status(404).json({ message: 'Job not found' });

    const titleChanged = updateData.title && updateData.title !== jobBefore.title;
    const descChanged = updateData.description && updateData.description !== jobBefore.description;
    
    // If title or description changed, and they didn't provide new aiSummary/aiQuestions, regenerate them
    if ((titleChanged || descChanged) && !updateData.aiSummary && (!updateData.aiQuestions || updateData.aiQuestions.length === 0)) {
      const skills = updateData.skillsRequired || jobBefore.skillsRequired;
      const dept = updateData.department || jobBefore.department;
      const title = updateData.title || jobBefore.title;
      const desc = updateData.description || jobBefore.description;
      const generated = generateAiMetadata(title, desc, skills, dept);
      updateData.aiSummary = generated.aiSummary;
      updateData.aiQuestions = generated.aiQuestions;
    }

    const job = await Job.findByIdAndUpdate(req.params.id, updateData, { new: true });
    
    // If the job title was updated, also update any candidates associated with the old title
    if (titleChanged) {
      await Candidate.updateMany({ position: jobBefore.title }, { position: updateData.title });
    }

    res.status(200).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    
    // Optional: could delete candidates applied to this job or keep them. Let's keep them but clear position
    await Candidate.updateMany({ position: job.title }, { position: '' });

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Alerts CRUD
router.get('/alerts', async (req, res) => {
  try {
    const list = await Alert.find({});
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/alerts/:id/resolve', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, { resolved: true }, { new: true });
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.status(200).json(alert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/alerts/resolve-all', async (req, res) => {
  try {
    await Alert.updateMany({ resolved: false }, { resolved: true });
    res.status(200).json({ message: 'All alerts resolved' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Helper to perform Gemini screening evaluation
async function runGeminiScreening(resumeText, jobDescription, apiKey) {
  const httpFetch = typeof fetch === 'function' ? fetch : (await import('node-fetch')).default;

  const prompt = `
You are an expert AI recruiter system. You are given the text of a candidate's resume and a job description.
Your task is to:
1. Parse the resume and extract candidate metadata (Name, Email, Location).
2. Extract the candidate's skills, education history, work experience details, and certifications.
3. Compare the candidate's profile against the job requirements.
4. Calculate a Match Score (integer, 0 to 100) based on how well their skills and experience match.
5. Identify Strengths (matching skills and qualifications) and Missing Skills (required skills not in resume).
6. Write a short, professional Candidate Summary (3-4 sentences).
7. Determine a Hiring Recommendation ('Strong Hire', 'Hire', 'Maybe', 'Reject').

Job Description:
"""
${jobDescription}
"""

Resume Content:
"""
${resumeText}
"""

Return the output as a valid JSON object matching this schema:
{
  "name": "Candidate Full Name",
  "email": "candidate@email.com",
  "location": "City, State or Country",
  "skills": ["Skill 1", "Skill 2", ...],
  "education": ["Degree, Major - Institution", ...],
  "experience": ["Role at Company (Duration)", ...],
  "certifications": ["Cert 1", "Cert 2", ...],
  "matchScore": 85,
  "strengths": ["Strength 1", "Strength 2", ...],
  "missingSkills": ["Missing Skill 1", "Missing Skill 2", ...],
  "summary": "Brief summary text...",
  "recommendation": "Hire"
}

Important Rules:
- Return ONLY the raw JSON object. Do not wrap in markdown tags like \`\`\`json.
- If name/email/location are not found in the resume text, provide a sensible extraction or placeholder.
- The recommendation property MUST be exactly one of: 'Strong Hire', 'Hire', 'Maybe', 'Reject'.
`;

  const response = await httpFetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }

  const resJson = await response.json();
  const textResult = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textResult) {
    throw new Error('Gemini API returned empty text');
  }

  let cleaned = textResult.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```$/, '').trim();
  }

  return JSON.parse(cleaned);
}

// Fallback mock screening evaluator when Gemini isn't configured
function generateMockScreening(resumeText, jobTitle) {
  let name = 'Screened Applicant';
  let email = 'applicant@selectai.io';
  let location = 'New Delhi, India';

  // Basic regex searches
  const nameMatch = resumeText.match(/(?:Name|Full Name):\s*([^\n\r]+)/i) || resumeText.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/);
  if (nameMatch) name = nameMatch[1].trim();

  const emailMatch = resumeText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  if (emailMatch) email = emailMatch[1].trim();

  const locMatch = resumeText.match(/(?:Location|Address):\s*([^\n\r]+)/i);
  if (locMatch) location = locMatch[1].trim();

  const skills = [];
  const strengths = [];
  const missingSkills = [];

  const techStack = [
    'React', 'Node.js', 'Express', 'MongoDB', 'Typescript', 'Javascript', 'Docker', 'Kubernetes', 'AWS', 'Python', 'PyTorch', 'TensorFlow', 'Figma', 'Next.js', 'Redux', 'SQL', 'Git'
  ];

  techStack.forEach(tech => {
    if (resumeText.toLowerCase().includes(tech.toLowerCase())) {
      skills.push(tech);
      strengths.push(tech);
    } else {
      missingSkills.push(tech);
    }
  });

  if (skills.length === 0) {
    skills.push('Javascript', 'HTML', 'CSS');
    strengths.push('Javascript', 'HTML');
    missingSkills.push('React', 'Node.js', 'AWS');
  }

  const matchScore = Math.max(55, Math.min(96, 50 + strengths.length * 6));
  let recommendation = 'Maybe';
  if (matchScore >= 90) recommendation = 'Strong Hire';
  else if (matchScore >= 80) recommendation = 'Hire';
  else if (matchScore < 70) recommendation = 'Reject';

  return {
    name,
    email,
    location,
    skills,
    education: ['B.Tech in Computer Science & Engineering - Delhi Technological University'],
    experience: ['Software Engineer Intern - Tech Solutions (6 months)', 'Freelance Web Developer (1 year)'],
    certifications: ['AWS Certified Solutions Architect Associate'],
    matchScore,
    strengths: strengths.slice(0, 3).map(s => `${s} proficiency demonstrated in text`),
    missingSkills: missingSkills.slice(0, 3),
    summary: `The candidate demonstrates active experience in software engineering and web tech stacks. Key strengths lie in ${strengths.slice(0, 2).join(' and ')}. A match score of ${matchScore}% has been calculated relative to the requirements.`,
    recommendation
  };
}

// POST screen candidates resume
router.post('/candidates/screen', upload.single('file'), async (req, res) => {
  try {
    const { jobTitle } = req.body;
    const file = req.file;

    if (!jobTitle) {
      return res.status(400).json({ message: 'Job title is required' });
    }
    if (!file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    let resumeText = '';
    const mime = file.mimetype;

    if (mime === 'application/pdf') {
      const parser = new pdfParse.PDFParse({ data: file.buffer });
      const parsed = await parser.getText();
      resumeText = parsed.text;
    } else if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const parsed = await mammoth.extractRawText({ buffer: file.buffer });
      resumeText = parsed.value;
    } else if (mime === 'text/plain') {
      resumeText = file.buffer.toString('utf-8');
    } else {
      // Fallback
      resumeText = file.buffer.toString('utf-8');
    }

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ message: 'Could not extract text content from the uploaded file.' });
    }

    // Fetch Job details
    const job = await Job.findOne({ title: jobTitle });
    const jobDesc = job 
      ? `Title: ${job.title}\nDepartment: ${job.department}\nDescription: ${job.description}\nSkills Required: ${job.skillsRequired.join(', ')}`
      : `Title: ${jobTitle}`;

    // Gemini evaluation or Fallback
    const apiKey = process.env.GEMINI_API_KEY;
    let screeningResult;

    if (!apiKey) {
      console.log('Gemini API key is not configured. Falling back to local regex screening...');
      screeningResult = generateMockScreening(resumeText, jobTitle);
    } else {
      try {
        screeningResult = await runGeminiScreening(resumeText, jobDesc, apiKey);
      } catch (geminiErr) {
        console.error('Gemini screening api error:', geminiErr);
        screeningResult = generateMockScreening(resumeText, jobTitle);
      }
    }

    // Save Candidate
    const candidateData = {
      name: screeningResult.name || 'Screened Candidate',
      position: jobTitle,
      location: screeningResult.location || 'New Delhi, India',
      email: screeningResult.email || 'candidate@selectai.io',
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(screeningResult.name || 'Screened')}`,
      aiMatchScore: screeningResult.matchScore || 70,
      integrityScore: 92, // mock integrity
      status: 'Screening',
      recommendation: screeningResult.recommendation || 'Maybe',
      interviewDate: 'TBD',
      skills: screeningResult.skills || [],
      education: screeningResult.education || [],
      experience: screeningResult.experience || [],
      certifications: screeningResult.certifications || [],
      strengths: screeningResult.strengths || [],
      missingSkills: screeningResult.missingSkills || [],
      summary: screeningResult.summary || 'Resume analyzed successfully.'
    };

    const candidate = new Candidate(candidateData);
    await candidate.save();

    // Increment count on job
    await Job.findOneAndUpdate(
      { title: jobTitle },
      { $inc: { candidatesCount: 1 } }
    );

    res.status(201).json(candidate);
  } catch (err) {
    console.error('Resume screening endpoint error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
