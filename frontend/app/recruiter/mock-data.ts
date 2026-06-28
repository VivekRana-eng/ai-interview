import { Candidate, LiveCandidate, AiAlert, Job } from './types';

// Exact Candidates from Screenshot 3 & 4
export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Alexander Wright',
    position: 'AI / Machine Learning Researcher',
    location: 'San Francisco, CA',
    email: 'alex.wright@selectai.io',
    phone: '+1 (555) 234-5678',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alexander',
    aiMatchScore: 96,
    integrityScore: 94,
    status: 'Interviewing',
    recommendation: 'Strong Hire',
    interviewDate: 'Jun 20, 2026',
    currentCompany: 'NeuralEdge Labs',
    linkedinUrl: 'https://linkedin.com/in/alexander-wright-ml',
    githubUrl: 'https://github.com/alexwright-ai',
    skills: ['PyTorch', 'TensorFlow', 'NLP', 'Transformers', 'CUDA', 'Python', 'LLMs', 'C++', 'Reinforcement Learning'],
    missingSkills: ['Kubernetes', 'Go'],
    strengths: [
      'Deep expertise in transformer-based architectures and self-supervised training paradigms',
      'Solid foundations in mathematical optimization and backpropagation strategies',
      'Proven track record of optimizing model inference speed using CUDA kernels'
    ],
    summary: 'Lead researcher with 4+ years of experience designing and scaling deep neural models for high-throughput language and vision tasks. Expert in model optimization and hardware-accelerated learning.',
    resumeText: `ALEXANDER WRIGHT\nAI / Machine Learning Researcher\nSan Francisco, CA | alex.wright@selectai.io | +1 (555) 234-5678\n\nSUMMARY\nLead researcher with 4+ years of experience designing and scaling deep neural models for high-throughput language and vision tasks. Expert in model optimization and hardware-accelerated learning.\n\nEXPERIENCE\nNeuralEdge Labs - Lead ML Researcher (2024 - Present)\n- Developed novel low-latency Transformer architecture reducing token generation costs by 32%.\n- Authored dynamic batching kernels in CUDA for high-concurrency LLM pipelines.\n\nDeepMind (Internship) - Research Intern (2023 - 2024)\n- Researched reinforcement learning techniques for combinatorial optimization problems.\n- Co-authored paper on distributed actor-critic models in simulation environments.\n\nEDUCATION\nStanford University - M.S. in Computer Science (AI Track) (2022 - 2024)\n- GPA: 3.95/4.00. Specialization in deep learning and NLP.\nUniversity of California, Berkeley - B.S. in Electrical Engineering & Computer Science (2018 - 2022)\n\nPROJECTS\nFastAttention-CUDA: Custom PyTorch Triton kernels for flash-attention style mechanisms, yielding 1.8x speedups on H100s.\nNeuroCompose: A code-generation LLM specialized in low-level DSP assembly instructions.\n\nTRAINING & CERTIFICATIONS\n- NVIDIA CUDA Developer Certification (2023)\n- AWS Certified Machine Learning Specialty (2024)`,
    workExperienceDetails: [
      {
        role: 'Lead ML Researcher',
        company: 'NeuralEdge Labs',
        duration: '2024 - Present',
        description: [
          'Developed novel low-latency Transformer architectures reducing token generation costs by 32%.',
          'Authored dynamic batching kernels in CUDA for high-concurrency LLM pipelines.',
          'Supervised a team of 4 ML engineers implementing data pipelines for multi-modal model training.'
        ]
      },
      {
        role: 'Research Assistant',
        company: 'Stanford AI Lab',
        duration: '2022 - 2024',
        description: [
          'Investigated parameter-efficient fine-tuning techniques (LoRA, QLoRA) on open-weights models.',
          'Assisted in designing coursework for advanced graduate deep learning lectures.'
        ]
      }
    ],
    educationDetails: [
      {
        degree: 'M.S. in Computer Science (AI Track)',
        school: 'Stanford University',
        year: '2022 - 2024',
        grade: '3.95/4.00 GPA'
      },
      {
        degree: 'B.S. in Electrical Engineering & Computer Science',
        school: 'UC Berkeley',
        year: '2018 - 2022',
        grade: 'First Class Honors'
      }
    ],
    projects: [
      {
        title: 'FastAttention-CUDA',
        description: 'Custom PyTorch Triton kernels for flash-attention style mechanisms, yielding 1.8x speedups on H100s.',
        techStack: ['PyTorch', 'Triton', 'CUDA', 'Python'],
        link: 'https://github.com/alexwright-ai/fast-attention'
      },
      {
        title: 'NeuroCompose',
        description: 'A code-generation LLM specialized in low-level DSP assembly instructions.',
        techStack: ['Python', 'Transformers', 'HuggingFace', 'PyTorch'],
        link: 'https://github.com/alexwright-ai/neurocompose'
      }
    ],
    internships: [
      {
        role: 'Research Intern',
        company: 'DeepMind',
        duration: '6 Months (2023)',
        description: [
          'Researched reinforcement learning techniques for combinatorial optimization problems.',
          'Co-authored paper on distributed actor-critic models in simulation environments.'
        ]
      }
    ],
    trainingsAndCertifications: [
      {
        name: 'NVIDIA Certified CUDA Developer',
        issuer: 'NVIDIA',
        date: 'Oct 2023',
        credentialId: 'NV-CUDA-928371'
      },
      {
        name: 'AWS Certified Machine Learning - Specialty',
        issuer: 'Amazon Web Services',
        date: 'Jan 2024',
        credentialId: 'AWS-ML-837128'
      }
    ],
    interviewPerformance: {
      overallScore: 9.3,
      communicationScore: 9.0,
      technicalScore: 9.6,
      problemSolvingScore: 9.3,
      strengths: [
        'Exceptional command of hardware architecture details (VRAM, memory bandwidth, tensor cores).',
        'Clear, structured layout of mathematical formulas for optimization.',
        'Articulate and structured during design explanations.'
      ],
      weaknesses: [
        'Slightly over-focused on low-level details where high-level system architectural trade-offs would suffice.',
        'Limited experience in cloud-native microservices orchestration (Kubernetes).'
      ],
      performedWell: [
        'Deriving backpropagation equations for standard Transformer layers.',
        'Explaining Triton kernel design and hardware-bound bottlenecks (Compute-bound vs Memory-bound).'
      ],
      gotStuck: [
        'Explaining integration points with production Kubernetes clusters (resolved after minor prompt guidance).'
      ],
      qaList: [
        {
          question: 'Detail the trade-offs of fine-tuning LLMs vs using RAG.',
          answer: 'Fine-tuning updates weights and embeds domain knowledge/behaviors but runs the risk of catastrophic forgetting and hallucinations. RAG keeps the model frozen and feeds context into the context window, resolving hallucinations and dynamic updates, but is limited by the context window size and retrieval latency.',
          aiEvaluation: 'Excellent explanation. Accurately highlighted constraints, latency trade-offs, and behavioral adjustments. Highlighted memory constraints during fine-tuning.',
          score: 9.5
        },
        {
          question: 'Explain optimization strategies for backpropagation in deep architectures.',
          answer: 'We can utilize gradient checkpointing to save VRAM at the expense of re-calculating activation maps during backward pass. Mixed precision training (FP16/BF16) halves memory footprint. Distributed training pipelines like pipeline parallelism and FSDP slice weights across nodes.',
          aiEvaluation: 'Very detailed. Candidate clearly understands tensor core utilization and activation caching trade-offs.',
          score: 9.8
        },
        {
          question: 'How do you manage computational efficiency during training?',
          answer: 'Utilizing flash attention to minimize quadratic memory bottleneck of soft-max operations, optimizing data loader pre-fetching, and profiling GPU bottlenecks using PyTorch Profiler.',
          aiEvaluation: 'Strong technical grounding. Showed practical knowledge of GPU profiling tools and data pipeline optimization.',
          score: 9.0
        }
      ]
    },
    aiEvaluationDetails: {
      strengths: [
        'Deep understanding of optimization formulas.',
        'Strong production programming capability in Python/CUDA.',
        'Solid communication and structured technical explanations.'
      ],
      gaps: [
        'Needs to build experience in deployment orchestration frameworks (Kubernetes/Helm).'
      ],
      integrityDetails: 'Secure session. No suspicious browser tabs, camera gaze deviations, or voice anomalies detected. 94% Proctoring rating.',
      overallRecommendation: 'Strong fit for Lead ML Researcher. Unmatched capability in low-level optimization and deep architecture design.'
    },
    hiringTimeline: [
      { stage: 'Applied', date: 'Jun 10, 2026', status: 'completed', comment: 'Resume submitted online.' },
      { stage: 'Resume Screening', date: 'Jun 12, 2026', status: 'completed', comment: 'AI match score: 96%. Promoted to Interview.' },
      { stage: 'Technical AI Interview', date: 'Jun 18, 2026', status: 'completed', comment: 'Scored 9.3/10. Highly recommendation.' },
      { stage: 'Recruiter Callback', date: 'Jun 20, 2026', status: 'current', comment: 'Scheduling final panel review.' }
    ]
  },
  {
    id: 'cand-2',
    name: 'Sophia Chen',
    position: 'Senior Full Stack Engineer',
    location: 'Seattle, WA',
    email: 'sophia.chen@selectai.io',
    phone: '+1 (555) 345-6789',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia',
    aiMatchScore: 94,
    integrityScore: 98,
    status: 'Screening',
    recommendation: 'Strong Hire',
    interviewDate: 'Jun 18, 2026',
    currentCompany: 'SaaSify Platforms',
    linkedinUrl: 'https://linkedin.com/in/sophia-chen-fs',
    githubUrl: 'https://github.com/sophiachen-dev',
    skills: ['Next.js', 'React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Redis', 'PostgreSQL', 'Docker'],
    missingSkills: ['Python', 'FastAPI'],
    strengths: [
      'Strong architecture skills in React state management and Next.js SSR configurations',
      'Extensive background in scalable MongoDB schema design and caching layers',
      'Passionate about UI craft, micro-interactions, and accessibility standards'
    ],
    summary: 'Senior Full Stack Engineer with 6+ years of experience launching SaaS products from scratch. Expert in system optimization, API design, and highly interactive user interfaces.',
    resumeText: `SOPHIA CHEN\nSeattle, WA | sophia.chen@selectai.io\n\nSenior developer specializing in React/Next.js and microservice backends. Created and scaled payment integration gateways for 10M+ users.\n\nEXPERIENCE\nSaaSify Platforms - Senior Full Stack Engineer (2022 - Present)\n- Led migration from legacy SPA to Next.js App Router, increasing Lighthouse performance scores by 40%.\n- Designed multi-tenant architecture with MongoDB and Redis caching, cutting database costs in half.\n\nEDUCATION\nUniversity of Washington - B.S. in Computer Science (2018 - 2022)`,
    workExperienceDetails: [
      {
        role: 'Senior Full Stack Engineer',
        company: 'SaaSify Platforms',
        duration: '2022 - Present',
        description: [
          'Led migration from legacy SPA to Next.js App Router, increasing Lighthouse performance scores by 40%.',
          'Designed multi-tenant database models with MongoDB and Redis caching, cutting page load times in half.',
          'Integrated Stripe Billing Engine supporting customized usage-based corporate tiers.'
        ]
      }
    ],
    educationDetails: [
      {
        degree: 'B.S. in Computer Science',
        school: 'University of Washington',
        year: '2018 - 2022',
        grade: 'Cum Laude'
      }
    ],
    projects: [
      {
        title: 'TaskFlow Dashboard',
        description: 'Collaborative real-time board using WebSockets and optimistic UI rendering in React.',
        techStack: ['React', 'Node.js', 'Socket.io', 'TailwindCSS'],
        link: 'https://github.com/sophiachen-dev/taskflow'
      }
    ],
    internships: [
      {
        role: 'Software Engineer Intern',
        company: 'Amazon',
        duration: '3 Months (2021)',
        description: [
          'Assisted the retail logistics team in writing high-coverage unit tests for backend fulfillment workflows.'
        ]
      }
    ],
    trainingsAndCertifications: [
      {
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        date: 'Nov 2024'
      }
    ],
    interviewPerformance: {
      overallScore: 9.1,
      communicationScore: 9.3,
      technicalScore: 9.0,
      problemSolvingScore: 9.0,
      strengths: ['Great communication', 'Very strong front-end state management theory', 'Solid database querying logic.'],
      weaknesses: ['Has not worked extensively with Python frameworks (FastAPI/Django).'],
      performedWell: ['Explaining Next.js Server Components vs Client Components.', 'Drawing clean ERDs for multi-tenant database systems.'],
      gotStuck: ['Explaining distributed lock implementation in Redis (cleared after a brief hint).'],
      qaList: [
        {
          question: 'Explain Next.js rendering modes.',
          answer: 'Next.js supports Static Site Generation (SSG), Server-Side Rendering (SSR), Incremental Static Regeneration (ISR), and Client-Side Rendering (CSR). With the App Router, we also have Server Components that render on the server by default to reduce bundle size.',
          aiEvaluation: 'Flawless answer. Perfectly contrasted Server Components with traditional SSR and explained the client-side hydrations.',
          score: 9.5
        }
      ]
    },
    aiEvaluationDetails: {
      strengths: ['Expert in modern web patterns', 'High collaboration skills', 'Exceptional UI/UX aesthetic appreciation.'],
      gaps: ['No python experience (minor gap, easily learnable).'],
      integrityDetails: 'Excellent compliance. 98% Proctoring rating.',
      overallRecommendation: 'Highly Recommended. Great fit for the product development team.'
    },
    hiringTimeline: [
      { stage: 'Applied', date: 'Jun 12, 2026', status: 'completed' },
      { stage: 'Resume Screening', date: 'Jun 14, 2026', status: 'completed', comment: 'AI Score: 94%' },
      { stage: 'Technical AI Interview', date: 'Jun 18, 2026', status: 'completed' },
      { stage: 'Final Review', date: 'Jun 25, 2026', status: 'current', comment: 'Evaluating salary alignment.' }
    ]
  },
  {
    id: 'cand-3',
    name: 'Emma Watson',
    position: 'Security Engineer (DevSecOps)',
    location: 'London, UK',
    email: 'emma.watson@selectai.io',
    phone: '+44 20 7946 0958',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Emma',
    aiMatchScore: 89,
    integrityScore: 86,
    status: 'Applied',
    recommendation: 'Maybe',
    interviewDate: 'Jun 21, 2026',
    currentCompany: 'Fortress Cyber Security',
    linkedinUrl: 'https://linkedin.com/in/emma-watson-sec',
    githubUrl: 'https://github.com/emma-secops',
    skills: ['Docker', 'Kubernetes', 'AWS', 'IAM', 'OWASP', 'Terraform', 'Vault', 'Bash', 'GitLab CI'],
    missingSkills: ['Java', 'C#'],
    strengths: [
      'Strong automated vulnerability scanning pipeline implementations',
      'In-depth knowledge of AWS IAM least-privilege configurations',
      'Solid containerized application hardening workflows'
    ],
    summary: 'DevSecOps Specialist with 4 years of experience auditing cloud architectures and building zero-trust pipelines. Experienced in container security and secret management systems.',
    resumeText: `EMMA WATSON\nLondon, UK | emma.watson@selectai.io\n\nDevSecOps Engineer securing AWS/Kubernetes setups. Expert in shifting security left in CI/CD pipelines.\n\nEXPERIENCE\nFortress Cyber Security - Security Engineer (2023 - Present)\n- Built static/dynamic analysis stages (SAST/DAST) into standard corporate Jenkins templates.\n- Resolved critical privilege escalations in Kubernetes RBAC configurations.`,
    workExperienceDetails: [
      {
        role: 'Security Engineer',
        company: 'Fortress Cyber Security',
        duration: '2023 - Present',
        description: [
          'Built static/dynamic analysis stages (SAST/DAST) into standard corporate GitLab CI templates.',
          'Resolved critical privilege escalations in Kubernetes RBAC configurations.',
          'Audited internal codebases against OWASP Top 10 guidelines before key release dates.'
        ]
      }
    ],
    educationDetails: [
      {
        degree: 'B.Eng in Software Engineering',
        school: 'University College London',
        year: '2019 - 2023',
        grade: 'Upper Second Class Honors'
      }
    ],
    projects: [
      {
        title: 'KubeGuard Scanner',
        description: 'An open-source operator scanning Kubernetes clusters against CIS benchmarks.',
        techStack: ['Go', 'Kubernetes', 'Docker', 'Trivy'],
        link: 'https://github.com/emma-secops/kubeguard'
      }
    ],
    internships: [
      {
        role: 'Security Intern',
        company: 'NCC Group',
        duration: '3 Months (2022)',
        description: [
          'Assisted penetration testers in generating reports and configuring wireless audit rigs.'
        ]
      }
    ],
    trainingsAndCertifications: [
      {
        name: 'Certified Kubernetes Administrator (CKA)',
        issuer: 'CNCF',
        date: 'Jul 2024'
      },
      {
        name: 'CompTIA Security+',
        issuer: 'CompTIA',
        date: 'Dec 2023'
      }
    ],
    interviewPerformance: {
      overallScore: 8.2,
      communicationScore: 8.5,
      technicalScore: 8.0,
      problemSolvingScore: 8.0,
      strengths: ['Highly ethical approach', 'Deep understanding of cloud IAM boundaries', 'Good shell scripting experience.'],
      weaknesses: ['Average algorithmic puzzle capability', 'Struggles with rapid application coding.'],
      performedWell: ['Defining custom Kubernetes network policies.', 'Explaining secret isolation using HashiCorp Vault.'],
      gotStuck: ['Writing a complex dynamic programming script in Python (needed significant optimization hints).'],
      qaList: [
        {
          question: 'Describe how you audit code for OWASP Top 10 vulnerabilities.',
          answer: 'I set up SAST tools like SonarQube in the CI pipeline to catch SQL injections and cross-site scripting (XSS). I also perform manual audits on authentication endpoints and make sure JWTs are signed with robust asymmetric algorithms.',
          aiEvaluation: 'Solid security posture. Covered both automated tooling and architectural practices well.',
          score: 8.5
        }
      ]
    },
    aiEvaluationDetails: {
      strengths: ['Robust security awareness', 'Hands-on experience in DevSecOps tooling'],
      gaps: ['Algorithmic scripting is slightly slow.'],
      integrityDetails: 'Slight gaze warnings flagged due to dual monitor setup. Authenticated as secure. 86% integrity rating.',
      overallRecommendation: 'Maybe Hire. Good fit if the focus is strictly infrastructure security rather than feature engineering.'
    },
    hiringTimeline: [
      { stage: 'Applied', date: 'Jun 15, 2026', status: 'completed' },
      { stage: 'Resume Screening', date: 'Jun 17, 2026', status: 'completed', comment: 'AI Score: 89%' },
      { stage: 'Technical AI Interview', date: 'Jun 21, 2026', status: 'completed' },
      { stage: 'Hiring Decision', date: 'Jun 27, 2026', status: 'current', comment: 'Under review by security manager.' }
    ]
  },
  {
    id: 'cand-4',
    name: 'Rajesh Kumar',
    position: 'Senior Backend Developer',
    location: 'Bengaluru, India',
    email: 'rajesh.kumar@selectai.io',
    phone: '+91 98765 43210',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Rajesh',
    aiMatchScore: 92,
    integrityScore: 95,
    status: 'Interviewing',
    recommendation: 'Hire',
    interviewDate: 'Jun 22, 2026',
    currentCompany: 'InnovateTech India',
    linkedinUrl: 'https://linkedin.com/in/rajeshkumar-backend',
    githubUrl: 'https://github.com/rajesh-code',
    skills: ['Go', 'Python', 'FastAPI', 'PostgreSQL', 'gRPC', 'Docker', 'Redis', 'Kafka', 'GraphQL'],
    missingSkills: ['React', 'CSS'],
    strengths: [
      'Excellent understanding of asynchronous programming models and concurrency structures (Go routines/channels)',
      'Highly adept at SQL optimization and schema design for low-latency databases',
      'Solid command of event-driven architectures with Apache Kafka'
    ],
    summary: 'Backend Engineer with 5+ years of experience designing and scaling microservices. Specializes in building high-throughput APIs in Go and Python, as well as message-broker setups.',
    resumeText: `RAJESH KUMAR\nBengaluru, India | rajesh.kumar@selectai.io\n\nExpert Go/Python Backend Engineer specializing in concurrent services and heavy database workloads.\n\nEXPERIENCE\nInnovateTech India - Senior Software Engineer (2022 - Present)\n- Built real-time notification gateway using Kafka, supporting 50k events per second.\n- Optimized PostgreSQL query execution plans, reducing search latencies by 60%.\n\nEDUCATION\nIIT Madras - B.Tech in Computer Science (2018 - 2022)`,
    workExperienceDetails: [
      {
        role: 'Senior Software Engineer',
        company: 'InnovateTech India',
        duration: '2022 - Present',
        description: [
          'Built real-time notification gateway using Apache Kafka, supporting 50k events per second.',
          'Optimized PostgreSQL query execution plans and index placements, reducing search latencies by 60%.',
          'Authored microservices in Go using gRPC for low-overhead internal microservices communication.'
        ]
      }
    ],
    educationDetails: [
      {
        degree: 'B.Tech in Computer Science & Engineering',
        school: 'IIT Madras',
        year: '2018 - 2022',
        grade: 'CGPA 9.1/10'
      }
    ],
    projects: [
      {
        title: 'CacheStore Go',
        description: 'An in-memory key-value database written in Go with customizable TTL eviction algorithms.',
        techStack: ['Go', 'Concurrency', 'Network Protocol'],
        link: 'https://github.com/rajesh-code/cachestore'
      }
    ],
    internships: [
      {
        role: 'Backend Intern',
        company: 'Razorpay',
        duration: '4 Months (2021)',
        description: [
          'Worked on payment gateway routing microservice, improving fallback routing logics.'
        ]
      }
    ],
    trainingsAndCertifications: [
      {
        name: 'Certified Professional Go Developer',
        issuer: 'Go Academy',
        date: 'Feb 2023'
      }
    ],
    interviewPerformance: {
      overallScore: 8.8,
      communicationScore: 8.2,
      technicalScore: 9.4,
      problemSolvingScore: 9.0,
      strengths: ['Flawless system design patterns', 'Excellent database indexing depth', 'High concurrent system comprehension.'],
      weaknesses: ['Weak on frontend design aspects and styling frameworks.'],
      performedWell: ['Explaining Go channels vs mutex locks.', 'Explaining indexing strategies for range queries in PostgreSQL.'],
      gotStuck: ['Explaining browser rendering engine pipelines (understandably outside backend domain).'],
      qaList: [
        {
          question: 'Detail your experience scaling high-concurrency Node.js or Python endpoints.',
          answer: 'With Python, FastAPI runs on Uvicorn utilizing an asyncio loop. To scale, we run multiple worker processes, put Gunicorn as a manager, load balance across containers, and shift expensive tasks to Celery with Redis as a broker.',
          aiEvaluation: 'Very precise. Accurately highlighted asynchronous bottlenecks and worker models.',
          score: 9.2
        }
      ]
    },
    aiEvaluationDetails: {
      strengths: ['Highly functional system designer', 'Solid database engineer', 'Practical architectural mind.'],
      gaps: ['No frontend/UI capability.'],
      integrityDetails: 'Fully compliant. No flags. 95% integrity rating.',
      overallRecommendation: 'Hire. Extremely capable backend engineer.'
    },
    hiringTimeline: [
      { stage: 'Applied', date: 'Jun 11, 2026', status: 'completed' },
      { stage: 'Resume Screening', date: 'Jun 13, 2026', status: 'completed', comment: 'AI Score: 92%' },
      { stage: 'Technical AI Interview', date: 'Jun 22, 2026', status: 'completed' },
      { stage: 'Manager Interview', date: 'Jun 29, 2026', status: 'upcoming', comment: 'Scheduling interview.' }
    ]
  },
  {
    id: 'cand-5',
    name: 'Aarav Patel',
    position: 'Frontend Engineer',
    location: 'Mumbai, India',
    email: 'aarav.patel@selectai.io',
    phone: '+91 99999 88888',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aarav',
    aiMatchScore: 85,
    integrityScore: 91,
    status: 'Screening',
    recommendation: 'Maybe',
    interviewDate: 'Jun 24, 2026',
    currentCompany: 'WebStudio Agency',
    linkedinUrl: 'https://linkedin.com/in/aarav-patel-frontend',
    githubUrl: 'https://github.com/aarav-patel',
    skills: ['React', 'TypeScript', 'TailwindCSS', 'Redux Toolkit', 'CSS3', 'Framer Motion', 'Vite', 'HTML5'],
    missingSkills: ['Docker', 'AWS', 'MongoDB'],
    strengths: [
      'Expert in pixel-perfect visual styling and accessibility',
      'Strong grasp of state management libraries and custom hooks',
      'Fluent in framer-motion micro-animations'
    ],
    summary: 'Frontend Engineer with 3+ years of experience constructing highly responsive web dashboards. Passionate about animations, user experience, and semantic code structure.',
    resumeText: `AARAV PATEL\nMumbai, India | aarav.patel@selectai.io\n\nCreative frontend developer building stunning, high-performance dashboards using React/TailwindCSS.\n\nEXPERIENCE\nWebStudio Agency - UI Developer (2023 - Present)\n- Built client admin dashboards using React, Redux, and TailwindCSS.\n- Replaced heavy CSS libraries with lightweight custom utilities, saving 25% bundle size.\n\nEDUCATION\nUniversity of Mumbai - B.E. in Information Technology (2019 - 2023)`,
    workExperienceDetails: [
      {
        role: 'UI Developer',
        company: 'WebStudio Agency',
        duration: '2023 - Present',
        description: [
          'Built client admin dashboards using React, Redux Toolkit, and TailwindCSS.',
          'Replaced heavy legacy bootstrap configurations with Tailwind utilities, saving 25% client bundle sizes.',
          'Implemented full keyboard navigation support across crucial transactional layouts.'
        ]
      }
    ],
    educationDetails: [
      {
        degree: 'B.E. in Information Technology',
        school: 'University of Mumbai',
        year: '2019 - 2023',
        grade: 'GPA 8.4/10'
      }
    ],
    projects: [
      {
        title: 'GlassyUI Kit',
        description: 'An open-source CSS framework dedicated to premium Glassmorphism styling blocks.',
        techStack: ['TailwindCSS', 'JavaScript', 'HTML5'],
        link: 'https://github.com/aarav-patel/glassy-ui'
      }
    ],
    internships: [
      {
        role: 'Frontend Intern',
        company: 'Codemy Tech',
        duration: '3 Months (2022)',
        description: [
          'Assisted developers in translating Figma boards into operational HTML/CSS landing pages.'
        ]
      }
    ],
    trainingsAndCertifications: [
      {
        name: 'Advanced React Design Patterns',
        issuer: 'Frontend Masters',
        date: 'Aug 2024'
      }
    ],
    interviewPerformance: {
      overallScore: 8.0,
      communicationScore: 8.8,
      technicalScore: 7.6,
      problemSolvingScore: 7.5,
      strengths: ['Great collaboration drive', 'Clear understanding of web layouts', 'Excellent responsiveness strategies.'],
      weaknesses: ['Requires guidance on complex caching or service worker logics.'],
      performedWell: ['Explaining component lifecycle hooks and React ref manipulations.', 'Implementing CSS flex/grid layout strategies.'],
      gotStuck: ['Describing virtual DOM reconciliations algorithm details (needed guidance).'],
      qaList: [
        {
          question: 'Explain Next.js rendering modes.',
          answer: 'Next.js has static site generation, server rendering, and client rendering. Server components render to a virtual DOM representation on the server first.',
          aiEvaluation: 'Correct, but lacked details on dynamic routing hydration and ISR logic.',
          score: 8.0
        }
      ]
    },
    aiEvaluationDetails: {
      strengths: ['Highly energetic designer-developer hybrid', 'Great communication skills'],
      gaps: ['Needs depth in backend architectures and advanced build pipelines.'],
      integrityDetails: 'Fully approved. 91% integrity score.',
      overallRecommendation: 'Good fit for a mid-level Frontend role focused on UI fidelity.'
    },
    hiringTimeline: [
      { stage: 'Applied', date: 'Jun 18, 2026', status: 'completed' },
      { stage: 'Resume Screening', date: 'Jun 20, 2026', status: 'completed', comment: 'AI Score: 85%' },
      { stage: 'Technical AI Interview', date: 'Jun 24, 2026', status: 'completed' },
      { stage: 'Review Panel', date: 'Jun 27, 2026', status: 'current' }
    ]
  },
  {
    id: 'cand-6',
    name: 'Vikram Singh',
    position: 'Cloud DevOps Engineer',
    location: 'Delhi, India',
    email: 'vikram.singh@selectai.io',
    phone: '+91 97111 22222',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Vikram',
    aiMatchScore: 91,
    integrityScore: 94,
    status: 'Interviewing',
    recommendation: 'Hire',
    interviewDate: 'Jun 23, 2026',
    currentCompany: 'CloudStack Sol',
    linkedinUrl: 'https://linkedin.com/in/vikram-singh-devops',
    githubUrl: 'https://github.com/vikram-devops',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'CI/CD', 'Prometheus', 'Helm', 'Nginx', 'Jenkins'],
    missingSkills: ['Python', 'FastAPI', 'Go'],
    strengths: [
      'Strong background in Infrastructure as Code (IaC) using Terraform',
      'Solid command of Helm chart creation and Kubernetes cluster administration',
      'Reliable implementation of monitoring using Prometheus/Grafana stacks'
    ],
    summary: 'DevOps Engineer with 4+ years of experience designing secure AWS infrastructure. Specialist in orchestrating multi-region Kubernetes clusters and high-availability CI/CD pipelines.',
    resumeText: `VIKRAM SINGH\nDelhi, India | vikram.singh@selectai.io\n\nCloud DevOps Engineer managing enterprise Kubernetes clusters on AWS.\n\nEXPERIENCE\nCloudStack Sol - DevOps Engineer (2022 - Present)\n- Maintained infrastructure across 4 AWS regions using Terraform.\n- Built GitHub Actions deployments pipeline, cutting build times by 35%.\n\nEDUCATION\nDelhi Technological University - B.Tech in CSE (2018 - 2022)`,
    workExperienceDetails: [
      {
        role: 'DevOps Engineer',
        company: 'CloudStack Sol',
        duration: '2022 - Present',
        description: [
          'Maintained infrastructure across 4 AWS regions using Terraform modules.',
          'Built GitHub Actions deployment pipelines for 15+ microservices, cutting build times by 35%.',
          'Configured logging and monitoring using Prometheus, Grafana, and ELK stack.'
        ]
      }
    ],
    educationDetails: [
      {
        degree: 'B.Tech in Computer Science',
        school: 'DTU (Delhi Technological University)',
        year: '2018 - 2022',
        grade: 'GPA 8.9/10'
      }
    ],
    projects: [
      {
        title: 'Terraform AWS EKS Boilerplate',
        description: 'Open-source production-ready Terraform configuration for creating EKS clusters with monitoring pre-installed.',
        techStack: ['Terraform', 'Kubernetes', 'AWS', 'Helm'],
        link: 'https://github.com/vikram-devops/terraform-eks'
      }
    ],
    internships: [
      {
        role: 'Systems Intern',
        company: 'HCL Technologies',
        duration: '4 Months (2021)',
        description: [
          'Assisted network administrators in cabling, server rack assembly, and basic Linux administration.'
        ]
      }
    ],
    trainingsAndCertifications: [
      {
        name: 'AWS Solutions Architect Professional',
        issuer: 'Amazon Web Services',
        date: 'Mar 2025'
      },
      {
        name: 'Certified Kubernetes Administrator (CKA)',
        issuer: 'The Linux Foundation',
        date: 'Jul 2024'
      }
    ],
    interviewPerformance: {
      overallScore: 8.9,
      communicationScore: 8.5,
      technicalScore: 9.2,
      problemSolvingScore: 9.0,
      strengths: ['Highly logical approach to cloud scaling', 'Strong infrastructure hardening logic', 'Clear production experience.'],
      weaknesses: ['Limited custom software scripting ability (focuses on shell scripting).'],
      performedWell: ['Designing highly-available systems across availability zones.', 'Configuring secure Kubernetes ingress controllers.'],
      gotStuck: ['Writing a custom web server logic in Go (struggled with basic Go routing).'],
      qaList: [
        {
          question: 'Walk us through how you would configure a DevSecOps CI/CD scanner.',
          answer: 'I would integrate Aqua Security Trivy in the build stage to scan Docker images, use SonarQube in the code review pipeline, and employ GitGuardian to scan for secrets leaks before committing to master.',
          aiEvaluation: 'Very precise. Highlighted various staging areas and scanners correctly.',
          score: 9.3
        }
      ]
    },
    aiEvaluationDetails: {
      strengths: ['Excellent AWS/Kubernetes administrator', 'Strong Terraform knowledge'],
      gaps: ['Backend programming language proficiency.'],
      integrityDetails: 'Secure session verified. 94% proctoring match.',
      overallRecommendation: 'Hire. Great addition to secure and scale cluster infrastructure.'
    },
    hiringTimeline: [
      { stage: 'Applied', date: 'Jun 13, 2026', status: 'completed' },
      { stage: 'Resume Screening', date: 'Jun 15, 2026', status: 'completed', comment: 'AI Score: 91%' },
      { stage: 'Technical AI Interview', date: 'Jun 23, 2026', status: 'completed' },
      { stage: 'Management Panel', date: 'Jun 28, 2026', status: 'upcoming' }
    ]
  },
  {
    id: 'cand-7',
    name: 'Pooja Sharma',
    position: 'Data Scientist',
    location: 'Hyderabad, India',
    email: 'pooja.sharma@selectai.io',
    phone: '+91 91234 56789',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Pooja',
    aiMatchScore: 88,
    integrityScore: 93,
    status: 'Screening',
    recommendation: 'Hire',
    interviewDate: 'Jun 25, 2026',
    currentCompany: 'Analytics Intelligence',
    linkedinUrl: 'https://linkedin.com/in/pooja-sharma-ds',
    githubUrl: 'https://github.com/pooja-sharma',
    skills: ['Python', 'Pandas', 'Scikit-learn', 'NLP', 'TensorFlow', 'SQL', 'Tableau', 'Docker', 'HuggingFace'],
    missingSkills: ['CUDA', 'C++'],
    strengths: [
      'Very strong foundations in statistical modeling, hypothesis testing, and regression analysis',
      'Experienced in building text classification pipelines with HuggingFace models',
      'Expert in SQL analytics and ETL processing'
    ],
    summary: 'Data Scientist with 3.5 years of experience building predictive models and custom text-mining services. Expert in python modeling and data presentation.',
    resumeText: `POOJA SHARMA\nHyderabad, India | pooja.sharma@selectai.io\n\nData Scientist building statistical pipelines, predictive dashboards, and NLP applications.\n\nEXPERIENCE\nAnalytics Intelligence - Data Scientist (2023 - Present)\n- Designed customer churn prediction model, saving 15% revenue losses.\n- Built auto-tagging system for support tickets using BERT models.\n\nEDUCATION\nIIIT Hyderabad - B.Tech in CSE (2019 - 2023)`,
    workExperienceDetails: [
      {
        role: 'Data Scientist',
        company: 'Analytics Intelligence',
        duration: '2023 - Present',
        description: [
          'Designed customer churn prediction models using XGBoost, saving 15% annual revenue losses.',
          'Built auto-tagging system for support tickets using BERT models fine-tuned on custom support data.',
          'Created automated reporting dashboards in Tableau linked with database views.'
        ]
      }
    ],
    educationDetails: [
      {
        degree: 'B.Tech in Computer Science & Engineering',
        school: 'IIIT Hyderabad',
        year: '2019 - 2023',
        grade: 'CGPA 9.2/10'
      }
    ],
    projects: [
      {
        title: 'ReviewAnalyzer',
        description: 'A dashboard analyzing product reviews for sentiment trends and keyword extractors.',
        techStack: ['Python', 'Flask', 'NLTK', 'Transformers'],
        link: 'https://github.com/pooja-sharma/reviewanalyzer'
      }
    ],
    internships: [
      {
        role: 'Data Analyst Intern',
        company: 'Mu Sigma',
        duration: '6 Months (2022)',
        description: [
          'Wrote SQL scripts for reporting pipelines and cleaned raw transactional data.'
        ]
      }
    ],
    trainingsAndCertifications: [
      {
        name: 'Natural Language Processing Specialization',
        issuer: 'DeepLearning.AI',
        date: 'Oct 2024'
      }
    ],
    interviewPerformance: {
      overallScore: 8.5,
      communicationScore: 9.0,
      technicalScore: 8.2,
      problemSolvingScore: 8.3,
      strengths: ['Clear explanation of statistical formulas', 'Strong SQL background', 'Excellent presentation style.'],
      weaknesses: ['Limited experience in hardware acceleration and custom C++ training code.'],
      performedWell: ['Explaining feature importance strategies.', 'Explaining cross-validation methods.'],
      gotStuck: ['Explaining neural network optimizer derivations (SGD momentum calculations, got stuck slightly).'],
      qaList: [
        {
          question: 'Detail the trade-offs of fine-tuning LLMs vs using RAG.',
          answer: 'Fine-tuning modifies the weights of the model to learn a specific style or set of terms, but is expensive. RAG fetches documents and appends them to the prompt, avoiding retraining and ensuring real-time data access.',
          aiEvaluation: 'Great explanation. Clear emphasis on latency and context length limits.',
          score: 8.8
        }
      ]
    },
    aiEvaluationDetails: {
      strengths: ['Strong data cleaning/ETL habits', 'Exceptional statistics grounding', 'Articulate communication.'],
      gaps: ['Needs depth in model engineering / deep production constraints.'],
      integrityDetails: 'Secure. 93% proctoring rating.',
      overallRecommendation: 'Recommend Hire. Excellent analytical candidate.'
    },
    hiringTimeline: [
      { stage: 'Applied', date: 'Jun 19, 2026', status: 'completed' },
      { stage: 'Resume Screening', date: 'Jun 21, 2026', status: 'completed', comment: 'AI Score: 88%' },
      { stage: 'Technical AI Interview', date: 'Jun 25, 2026', status: 'completed' },
      { stage: 'HR Round', date: 'Jun 30, 2026', status: 'upcoming' }
    ]
  },
  {
    id: 'cand-8',
    name: 'Ananya Gupta',
    position: 'UI/UX Architect',
    location: 'Noida, India',
    email: 'ananya.gupta@selectai.io',
    phone: '+91 92222 33333',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ananya',
    aiMatchScore: 86,
    integrityScore: 97,
    status: 'Applied',
    recommendation: 'Hire',
    interviewDate: 'Jun 26, 2026',
    currentCompany: 'CreativeDesign Co',
    linkedinUrl: 'https://linkedin.com/in/ananya-gupta-design',
    githubUrl: 'https://github.com/ananya-design',
    skills: ['Figma', 'Adobe XD', 'HTML', 'CSS', 'TailwindCSS', 'User Research', 'Wireframing', 'Prototyping', 'React'],
    missingSkills: ['Node.js', 'Express', 'MongoDB'],
    strengths: [
      'Outstanding user research and accessibility design capability',
      'Advanced Figma prototyping skills including design system maintenance',
      'Translates visuals into clean Tailwind HTML code'
    ],
    summary: 'UI/UX Designer and Architect with 5 years of experience leading design systems and user research studies. Dedicated to building accessible, clean, and interactive interfaces.',
    resumeText: `ANANYA GUPTA\nNoida, India | ananya.gupta@selectai.io\n\nUI/UX Architect specializing in modern enterprise interface designs and design systems.\n\nEXPERIENCE\nCreativeDesign Co - Lead UX Designer (2021 - Present)\n- Maintained standard enterprise design system in Figma, adopted by 8 product teams.\n- Performed usability testing with 50+ clients, reducing screen drop-off rates by 22%.\n\nEDUCATION\nNID Ahmedabad - Graduate Diploma in Interaction Design (2017 - 2021)`,
    workExperienceDetails: [
      {
        role: 'Lead UX Designer',
        company: 'CreativeDesign Co',
        duration: '2021 - Present',
        description: [
          'Maintained standard enterprise design system in Figma, adopted by 8 separate product teams.',
          'Performed usability testing with 50+ clients, reducing application screen drop-off rates by 22%.',
          'Worked closely with frontend engineering to write standard TailwindCSS component wrappers.'
        ]
      }
    ],
    educationDetails: [
      {
        degree: 'Graduate Diploma in Interaction Design',
        school: 'NID Ahmedabad',
        year: '2017 - 2021',
        grade: 'Top 10% of class'
      }
    ],
    projects: [
      {
        title: 'ZenDoc System',
        description: 'A fully accessible medical charting system designed for multi-device workflows.',
        techStack: ['Figma', 'UI Design', 'Accessibility'],
        link: 'https://dribbble.com/ananya-design'
      }
    ],
    internships: [
      {
        role: 'UX Intern',
        company: 'MakeMyTrip',
        duration: '6 Months (2020)',
        description: [
          'Assisted the booking team in mapping mobile user checkout journeys.'
        ]
      }
    ],
    trainingsAndCertifications: [
      {
        name: 'Google UX Design Professional Certificate',
        issuer: 'Google (Coursera)',
        date: 'Jul 2022'
      }
    ],
    interviewPerformance: {
      overallScore: 8.6,
      communicationScore: 9.4,
      technicalScore: 7.8,
      problemSolvingScore: 8.5,
      strengths: ['Superb communication and storytelling', 'Expert in accessibility (WCAG)', 'Deep empathy for user pain points.'],
      weaknesses: ['Limited programming capabilities outside CSS and basic HTML/JS.'],
      performedWell: ['Explaining complex design decision-making processes.', 'Auditing layouts for contrast and assistive device accessibility.'],
      gotStuck: ['Writing code to map a complex React state handler (understandably out of design core).'],
      qaList: [
        {
          question: 'Explain Next.js rendering modes.',
          answer: 'Next.js allows server-side rendering and client-side rendering. For designers, server rendering ensures the page displays faster for SEO and first contentful paint, improving user satisfaction.',
          aiEvaluation: 'Creative UX perspective. Looked at the technical concept through the lens of user retention and loading experience.',
          score: 8.2
        }
      ]
    },
    aiEvaluationDetails: {
      strengths: ['Superb portfolio and design process', 'Excellent WCAG compliance knowledge'],
      gaps: ['No backend database development skills.'],
      integrityDetails: 'Secure session validated. 97% integrity score.',
      overallRecommendation: 'Strong Hire. Excellent fit to elevate interface aesthetics across product lines.'
    },
    hiringTimeline: [
      { stage: 'Applied', date: 'Jun 22, 2026', status: 'completed' },
      { stage: 'Resume Screening', date: 'Jun 23, 2026', status: 'completed', comment: 'AI Score: 86%' },
      { stage: 'Technical AI Interview', date: 'Jun 26, 2026', status: 'completed' },
      { stage: 'Portfolio Presentation', date: 'Jul 2, 2026', status: 'upcoming' }
    ]
  },
  {
    id: 'cand-9',
    name: 'Karan Johar',
    position: 'Mobile App Developer',
    location: 'Chennai, India',
    email: 'karan.johar@selectai.io',
    phone: '+91 93333 44444',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Karan',
    aiMatchScore: 87,
    integrityScore: 92,
    status: 'Applied',
    recommendation: 'Maybe',
    interviewDate: 'Jun 27, 2026',
    currentCompany: 'MobileCraft Technologies',
    linkedinUrl: 'https://linkedin.com/in/karan-johar-mobile',
    githubUrl: 'https://github.com/karan-mobile',
    skills: ['React Native', 'TypeScript', 'iOS', 'Android', 'Swift', 'Redux', 'Git', 'CocoaPods', 'Firebase'],
    missingSkills: ['Docker', 'AWS'],
    strengths: [
      'Strong knowledge of React Native bridge optimization and native modules',
      'Experienced in publishing and deploying applications to App Store and Google Play Store',
      'Clean TypeScript code architecture'
    ],
    summary: 'Mobile Developer with 4 years of experience building cross-platform React Native applications. Expert in native mobile configurations and state architecture.',
    resumeText: `KARAN JOHAR\nChennai, India | karan.johar@selectai.io\n\nReact Native / iOS Specialist publishing high-traffic mobile applications.\n\nEXPERIENCE\nMobileCraft Technologies - Mobile Lead (2022 - Present)\n- Published e-commerce application scoring 4.7 stars on App Store with 1M+ downloads.\n- Optimized flat-list rendering performance, cutting frame drops by 50%.\n\nEDUCATION\nAnna University - B.E. in Computer Science (2018 - 2022)`,
    workExperienceDetails: [
      {
        role: 'Mobile Lead',
        company: 'MobileCraft Technologies',
        duration: '2022 - Present',
        description: [
          'Published corporate e-commerce application scoring 4.7 stars on App Store with 1M+ downloads.',
          'Optimized mobile flat-list render cycles and image caching mechanisms, cutting UI frame drops by 50%.',
          'Wrote custom Swift and Java bridges for push notifications and device biometric access.'
        ]
      }
    ],
    educationDetails: [
      {
        degree: 'B.E. in Computer Science & Engineering',
        school: 'Anna University',
        year: '2018 - 2022',
        grade: 'GPA 8.2/10'
      }
    ],
    projects: [
      {
        title: 'FitTrack App',
        description: 'A React Native application integrating with Apple HealthKit for real-time calorie tracking.',
        techStack: ['React Native', 'Swift', 'Redux', 'Firebase'],
        link: 'https://github.com/karan-mobile/fittrack'
      }
    ],
    internships: [
      {
        role: 'App Development Intern',
        company: 'Cognizant',
        duration: '6 Months (2021)',
        description: [
          'Wrote responsive layouts for hybrid Cordova applications.'
        ]
      }
    ],
    trainingsAndCertifications: [
      {
        name: 'Meta Android Developer Professional Certificate',
        issuer: 'Meta (Coursera)',
        date: 'Nov 2023'
      }
    ],
    interviewPerformance: {
      overallScore: 8.4,
      communicationScore: 8.6,
      technicalScore: 8.2,
      problemSolvingScore: 8.3,
      strengths: ['Expert in React state flow', 'Good native mobile module debugging experience', 'Active app portfolio.'],
      weaknesses: ['Limited exposure to cloud container deployments and Kubernetes setups.'],
      performedWell: ['Explaining React Native rendering thread structures vs Native UI thread.', 'Configuring secure keychains for OAuth tokens.'],
      gotStuck: ['Explaining Docker network drivers configuration (needed guidance).'],
      qaList: [
        {
          question: 'How do you structure database schemas for fast indexing?',
          answer: 'For mobile, local databases like SQLite or Realm need indices on columns that are queried frequently, like primary IDs or created dates. We must avoid over-indexing to keep write performance optimal.',
          aiEvaluation: 'Great explanation centered on mobile-specific environments.',
          score: 8.5
        }
      ]
    },
    aiEvaluationDetails: {
      strengths: ['Strong mobile publishing background', 'Good native bridge builder'],
      gaps: ['DevOps and Cloud Deployments experience.'],
      integrityDetails: 'Secure session validated. 92% integrity score.',
      overallRecommendation: 'Maybe Hire. Strong fit if team needs mobile native capabilities.'
    },
    hiringTimeline: [
      { stage: 'Applied', date: 'Jun 22, 2026', status: 'completed' },
      { stage: 'Resume Screening', date: 'Jun 23, 2026', status: 'completed', comment: 'AI Score: 87%' },
      { stage: 'Technical AI Interview', date: 'Jun 27, 2026', status: 'completed' },
      { stage: 'Panel Interview', date: 'Jul 3, 2026', status: 'upcoming' }
    ]
  },
  {
    id: 'cand-10',
    name: 'Neha Malhotra',
    position: 'QA Automation Engineer',
    location: 'Pune, India',
    email: 'neha.malhotra@selectai.io',
    phone: '+91 94444 55555',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Neha',
    aiMatchScore: 89,
    integrityScore: 96,
    status: 'Screening',
    recommendation: 'Hire',
    interviewDate: 'Jun 26, 2026',
    currentCompany: 'Quality Assurance Inc',
    linkedinUrl: 'https://linkedin.com/in/neha-malhotra-qa',
    githubUrl: 'https://github.com/neha-qa',
    skills: ['Selenium', 'Jest', 'Cypress', 'Playwright', 'Postman', 'JavaScript', 'Git', 'Jenkins', 'API Testing'],
    missingSkills: ['AWS', 'Terraform'],
    strengths: [
      'Expert in writing end-to-end user tests using Playwright and Cypress',
      'Solid command of API validation using Postman and automated scripts',
      'Strong bug isolation and diagnostic reporting methodology'
    ],
    summary: 'QA Automation Engineer with 4 years of experience building automated test suites. Expert in web regression suites and continuous integration testing setups.',
    resumeText: `NEHA MALHOTRA\nPune, India | neha.malhotra@selectai.io\n\nQA Automation Engineer configuring CI/CD integration testing suites.\n\nEXPERIENCE\nQuality Assurance Inc - Senior QA Automation (2022 - Present)\n- Built Playwright regression suite testing 200+ user checkout scenarios.\n- Integrated automated test runs in Jenkins, cutting manual deployment delays by 40%.\n\nEDUCATION\nPune University - B.E. in Computer Science (2018 - 2022)`,
    workExperienceDetails: [
      {
        role: 'Senior QA Automation',
        company: 'Quality Assurance Inc',
        duration: '2022 - Present',
        description: [
          'Built Playwright regression suites testing 200+ user checkout scenarios.',
          'Integrated automated testing runs into the Jenkins deployment process, cutting manual deployment check delays by 40%.',
          'Authored API load tests using k6, isolating database lock vulnerabilities.'
        ]
      }
    ],
    educationDetails: [
      {
        degree: 'B.E. in Computer Science',
        school: 'Pune University',
        year: '2018 - 2022',
        grade: 'GPA 8.6/10'
      }
    ],
    projects: [
      {
        title: 'ApiCheck Tool',
        description: 'An open-source CLI parsing OpenAPI specs and generating automated mock test scenarios.',
        techStack: ['Node.js', 'Jest', 'OpenAPI'],
        link: 'https://github.com/neha-qa/apicheck'
      }
    ],
    trainingsAndCertifications: [
      {
        name: 'Certified Software Test Automation Specialist',
        issuer: 'QA Board',
        date: 'Jan 2024'
      }
    ],
    interviewPerformance: {
      overallScore: 8.7,
      communicationScore: 8.8,
      technicalScore: 8.6,
      problemSolvingScore: 8.7,
      strengths: ['Highly detail-oriented', 'Strong knowledge of testing frameworks', 'Excellent bug documentation process.'],
      weaknesses: ['Limited cloud cluster administration skills.'],
      performedWell: ['Writing modular test suites using page object models.', 'Configuring parallel runner nodes.'],
      gotStuck: ['Explaining database replication lag (minor query block, resolved quickly).'],
      qaList: [
        {
          question: 'Describe how you audit code for OWASP Top 10 vulnerabilities.',
          answer: 'As a QA, I focus on automated security scanners in the pipeline. I write specific test assertions checking that authentication tokens are secure and check form fields for input validation and XSS scripts.',
          aiEvaluation: 'Very good. Showed custom QA verification strategies beyond basic dev tools.',
          score: 8.8
        }
      ]
    },
    aiEvaluationDetails: {
      strengths: ['Highly precise tester', 'Excellent documentation standards'],
      gaps: ['Cloud infrastructure configurations.'],
      integrityDetails: 'Secure session validated. 96% integrity score.',
      overallRecommendation: 'Hire. Capable of leading automation strategy for web and API products.'
    },
    hiringTimeline: [
      { stage: 'Applied', date: 'Jun 20, 2026', status: 'completed' },
      { stage: 'Resume Screening', date: 'Jun 22, 2026', status: 'completed', comment: 'AI Score: 89%' },
      { stage: 'Technical AI Interview', date: 'Jun 26, 2026', status: 'completed' },
      { stage: 'Team Match', date: 'Jul 1, 2026', status: 'upcoming' }
    ]
  }
];

// Exact Live Candidates from Screenshot 2
export const INITIAL_LIVE_CANDIDATES: LiveCandidate[] = [
  {
    id: 'live-1',
    name: 'Liam O\'Connor',
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
    candidateName: 'Liam O\'Connor',
    type: 'Multiple Face Detected',
    message: 'Liam O\'Connor: Second face detected in frame during question 5.',
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
    salaryRange: '₹18,00,000 - ₹24,00,000',
    location: 'New Delhi (On-site)',
    createdBy: 'Akash Patel',
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
    salaryRange: '₹14,00,000 - ₹20,00,000',
    location: 'Bengaluru (Hybrid)',
    createdBy: 'Priya Sharma',
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
    salaryRange: '₹16,00,000 - ₹22,00,000',
    location: 'Hyderabad (Remote)',
    createdBy: 'Nisha Lal',
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
    createdBy: 'Rahul Mehta',
    employmentType: 'Full-time',
    aiQuestions: [
      'How do you prioritize features in a fast-paced AI environment?',
      'Describe a time you had to pivot a product based on user feedback.'
    ]
  },
  {
    id: 'job-5',
    title: 'Frontend Developer (Closed)',
    department: 'Engineering',
    status: 'Closed',
    candidatesCount: 12,
    description: 'Developed and maintained the dashboard interface of our analytics portal.',
    role: 'UI Specialist',
    aboutJob: 'This role has been successfully filled.',
    skillsRequired: ['Vue.js', 'TailwindCSS', 'TypeScript'],
    experience: '2-4 years',
    salaryRange: '₹10,00,000 - ₹14,00,000',
    location: 'Remote',
    createdBy: 'Tanya Gupta',
    employmentType: 'Full-time',
    aiQuestions: []
  },
  {
    id: 'job-6',
    title: 'QA Engineer',
    department: 'Engineering',
    status: 'Hold',
    candidatesCount: 3,
    description: 'Automation testing for core service APIs and frontend flows.',
    role: 'Automation Specialist',
    aboutJob: 'Ensuring the highest quality for our AI-driven platforms.',
    skillsRequired: ['Selenium', 'Jest', 'Cypress'],
    experience: '3+ years',
    salaryRange: '₹12,00,000 - ₹16,00,000',
    location: 'Pune (Remote)',
    createdBy: 'Charan Singh',
    employmentType: 'Full-time',
    aiQuestions: []
  },
  {
    id: 'job-7',
    title: 'Data Engineer (Legacy)',
    department: 'Engineering',
    status: 'Closed',
    candidatesCount: 8,
    description: 'Maintenance of legacy data pipelines and ETL processes.',
    role: 'ETL Developer',
    aboutJob: 'This role has been archived as we transition to new cloud-native pipelines.',
    skillsRequired: ['SQL', 'Hadoop', 'Apache Spark'],
    experience: '4+ years',
    salaryRange: '₹12,00,000 - ₹16,00,000',
    location: 'Chennai (On-site)',
    createdBy: 'Meera Nair',
    employmentType: 'Full-time',
    aiQuestions: []
  }
];
