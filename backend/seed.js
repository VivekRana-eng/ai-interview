const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');
const Candidate = require('./models/Candidate');
const Alert = require('./models/Alert');
const { INITIAL_CANDIDATES } = require('./mock-candidates');

dotenv.config();

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
    candidatesCount: 7,
    description: 'Research and develop advanced neural architectures for high-throughput decision-making systems.',
    role: 'Lead ML Researcher',
    aboutJob: 'You will be working at the cutting edge of AI, developing models that power our core platform.',
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
    candidatesCount: 6,
    description: 'Build responsive interfaces and robust API backends that scale seamlessly under heavy load.',
    role: 'Product Engineer',
    aboutJob: 'Help us build the next generation of screening tools using React and Node.js.',
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
    candidatesCount: 6,
    description: 'Audit cloud infrastructure, set container security parameters, and configure access control lists.',
    role: 'Cloud Security Architect',
    aboutJob: 'Protect our infrastructure and ensure all our AI systems are secure by design.',
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
    title: 'Product Manager (Draft)',
    department: 'Product',
    status: 'Draft',
    candidatesCount: 0,
    description: 'Defining product roadmaps and coordinating between engineering and design teams.',
    role: 'PM',
    aboutJob: 'Join our product team to shape the future of AI interviews.',
    skillsRequired: ['Agile', 'Product Roadmapping', 'User Research'],
    experience: '3+ years',
    salaryRange: '₹15,00,000 - ₹22,00,000',
    location: 'Mumbai (Hybrid)',
    employmentType: 'Full-time',
    aiQuestions: [
      'How do you prioritize features in a fast-paced AI environment?',
      'Describe a time you had to pivot a product based on user feedback.'
    ]
  },
  {
    title: 'Frontend Developer (Closed)',
    department: 'Engineering',
    status: 'Closed',
    candidatesCount: 0,
    description: 'Developed and maintained the dashboard interface of our analytics portal.',
    role: 'UI Specialist',
    aboutJob: 'This role has been successfully filled.',
    skillsRequired: ['Vue.js', 'TailwindCSS', 'TypeScript'],
    experience: '2-4 years',
    salaryRange: '₹10,00,000 - ₹14,00,000',
    location: 'Remote',
    employmentType: 'Full-time',
    aiQuestions: []
  },
  {
    title: 'QA Engineer',
    department: 'Engineering',
    status: 'Hold',
    candidatesCount: 6,
    description: 'Automation testing for core service APIs and frontend flows.',
    role: 'Automation Specialist',
    aboutJob: 'Ensuring the highest quality for our AI-driven platforms.',
    skillsRequired: ['Selenium', 'Jest', 'Cypress'],
    experience: '3+ years',
    salaryRange: '₹12,0,000 - ₹16,0,000',
    location: 'Pune (Remote)',
    employmentType: 'Full-time',
    aiQuestions: []
  }
];

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hireai_analytics');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Job.deleteMany({});
    await Candidate.deleteMany({});
    await Alert.deleteMany({});
    console.log('Cleared existing collections.');

    // Insert new data
    await Job.insertMany(MOCK_JOBS);
    await Candidate.insertMany(INITIAL_CANDIDATES);
    await Alert.insertMany(INITIAL_ALERTS);

    console.log('Data seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error(`Error during seeding: ${err.message}`);
    process.exit(1);
  }
}

seedData();
