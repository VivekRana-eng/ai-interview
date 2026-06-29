import { Candidate } from '../types';

export interface ExperienceDetail {
  role: string;
  company: string;
  duration: string;
  description: string[];
}

export interface QaItem {
  question: string;
  answer: string;
  score: number;
  aiEvaluation: string;
}

export interface InterviewPerformance {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  strengths: string[];
  weaknesses: string[];
  performedWell: string[];
  gotStuck: string[];
  qaList: QaItem[];
}

export const getDefaultExperiences = (candidate: Candidate): ExperienceDetail[] => {
  const isML = candidate.position.toLowerCase().includes('machine') || candidate.position.toLowerCase().includes('ai');
  const isSec = candidate.position.toLowerCase().includes('security') || candidate.position.toLowerCase().includes('devsecops');
  const isDevOps = candidate.position.toLowerCase().includes('devops');
  
  const rolePrefix = candidate.position.replace(/Senior\s+|Lead\s+/i, '');

  return [
    {
      role: `Senior ${rolePrefix}`,
      company: 'InnovateTech India',
      duration: '2023 - Present',
      description: isML ? [
        'Built real-time model inference gateway using Apache Kafka, supporting 50k events per second.',
        'Optimized LLM query performance and index placements, reducing search latencies by 60%.',
        'Authored microservices in Go/Python using gRPC for low overhead internal systems communication.'
      ] : isSec ? [
        'Built real-time security scanning gateways, supporting 50k events per second across all code commits.',
        'Optimized database vulnerability scanning queries, reducing latency of security reports by 60%.',
        'Authored automated compliance microservices using Go and gRPC for high-speed network security reviews.'
      ] : [
        'Built real-time notification gateway using Apache Kafka, supporting 50k events per second.',
        'Optimized PostgreSQL query execution plans and index placements, reducing search latencies by 60%.',
        'Authored microservices in Go using gRPC for low overhead internal microservices communication.'
      ]
    },
    {
      role: `Lead Developer - Cloud Infrastructure`,
      company: 'Apex Digital Solutions',
      duration: '2021 - 2023',
      description: [
        'Architected core system infrastructure migrating from monolithic architecture to microservices.',
        'Supervised a team of 4 junior developers across sprint cycles and automated QA testing pipelines.',
        'Reduced cloud infrastructure costs by 35% through containerization and automated scaling.'
      ]
    },
    {
      role: `Software Engineer`,
      company: 'Global Tech Labs',
      duration: '2019 - 2021',
      description: [
        'Designed high-availability web applications serving over 500k monthly active users.',
        'Developed reusable UI component library using React, Next.js, and CSS variables.',
        'Maintained 95%+ unit test coverage using Jest and testing-library.'
      ]
    },
    {
      role: `Junior Developer & Intern`,
      company: 'Startup incubator Inc.',
      duration: '2018 - 2019',
      description: [
        'Collaborated with designers to build responsive interfaces matching high-fidelity wireframes.',
        'Participated in daily agile scrum standups, code reviews, and technical retro sessions.',
        'Maintained documentation, fixed bugs, and helped automate internal deployment scripts.'
      ]
    }
  ];
};

export const getDefaultInterviewPerformance = (candidate: Candidate): InterviewPerformance => {
  const match = candidate.aiMatchScore || 85;
  const overall = Number((match / 10).toFixed(1));
  const technical = Number(Math.min(10, (match + 5) / 10).toFixed(1));
  const communication = Number(Math.min(10, (match - 3) / 10).toFixed(1));
  const problemSolving = Number(Math.min(10, (match + 2) / 10).toFixed(1));

  const isML = candidate.position.toLowerCase().includes('machine') || candidate.position.toLowerCase().includes('ai');
  const isSec = candidate.position.toLowerCase().includes('security') || candidate.position.toLowerCase().includes('devsecops');

  return {
    overallScore: overall,
    technicalScore: technical,
    communicationScore: communication,
    problemSolvingScore: problemSolving,
    strengths: isML ? [
      'Flawless system design patterns for neural net pipelines.',
      'Excellent database indexing and vector storage depth.',
      'High concurrent system comprehension.'
    ] : isSec ? [
      'Excellent understanding of OWASP Top 10 vulnerabilities.',
      'Proactive network log auditing and threat modeling.',
      'Flawless integration of security checks in CI/CD.'
    ] : [
      'Flawless system design patterns.',
      'Excellent database indexing depth.',
      'High concurrent system comprehension.'
    ],
    weaknesses: isML ? [
      'Weak on frontend design aspects and styling frameworks.'
    ] : isSec ? [
      'Basic frontend integration knowledge, needs support on fullstack UI tasks.'
    ] : [
      'Weak on frontend design aspects and styling frameworks.'
    ],
    performedWell: isML 
      ? ['Explaining transformer architecture details vs simple CNNs', 'Explaining vector indexing strategies for range queries']
      : isSec
      ? ['Explaining SQL injection mitigation strategies', 'Explaining Docker container escape isolation mechanics']
      : ['Explaining Go channels vs mutex locks', 'Explaining indexing strategies for range queries in PostgreSQL'],
    gotStuck: isML
      ? ['Explaining browser rendering engine pipelines (understandably outside ML domain)']
      : isSec
      ? ['Explaining browser CSS parsing engine rules (understandably outside backend security domain)']
      : ['Explaining browser rendering engine pipelines (understandably outside backend domain)'],
    qaList: [
      {
        question: isML 
          ? 'Detail your experience scaling high-concurrency training or evaluation pipelines.'
          : isSec
          ? 'Detail your experience scaling high-concurrency log-monitoring and firewall alerts.'
          : 'Detail your experience scaling high-concurrency Node.js or Python endpoints.',
        answer: isML 
          ? 'With Python, model serving runs on Ray utilizing asynchronous inference loops. To scale, we run multiple model worker processes, put Redis as manager, load balance across containers, and shift heavy preprocessing tasks to Celery.'
          : isSec
          ? 'With Python, threat scanning runs on Uvicorn utilizing an asyncio loop. To scale, we run multiple worker processes, put Redis as manager, load balance across containers, and shift expensive packet inspections to Celery.'
          : 'With Python, FastAPI runs on Uvicorn utilizing an asyncio loop. To scale, we run multiple worker processes, put Gunicorn as a manager, load balance across containers, and shift expensive tasks to Celery with Redis as a broker.',
        score: 9.2,
        aiEvaluation: 'Very precise. Accurately highlighted asynchronous bottlenecks and worker models.'
      },
      {
        question: 'Explain the browser rendering engine rendering lifecycle steps.',
        answer: 'I know that browser fetches HTML and CSS, parses it, creates DOM tree and styles, and then renders it on screen.',
        score: 5.8,
        aiEvaluation: 'Struggled to explain the exact stages: DOM Tree, CSSOM Tree, Render Tree, Layout, Paint, and Composite. Did not mention GPU acceleration.'
      },
      {
        question: 'How do you handle race conditions in high-concurrency database environments?',
        answer: 'I use standard transactions and locking. If two queries update the same row, database will put a lock and execute them sequentially.',
        score: 8.5,
        aiEvaluation: 'Good explanation of pessimistic vs optimistic locking and transaction isolation levels (Read Committed vs Serializable).'
      },
      {
        question: 'Explain how CSS selectors specificity is calculated.',
        answer: 'Inline styles have highest priority, then IDs, then classes, then elements. If two match, the last one in the file is selected.',
        score: 6.2,
        aiEvaluation: 'Candidate struggled to give the exact weights/vector calculation (a,b,c,d) and missed details on pseudo-elements and pseudo-classes.'
      }
    ]
  };
};
