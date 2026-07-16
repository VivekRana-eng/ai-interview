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
  const titleLower = candidate.position.toLowerCase();
  const rolePrefix = candidate.position.replace(/Senior\s+|Lead\s+/i, '');

  if (titleLower.includes('machine') || titleLower.includes('ai') || titleLower.includes('ml')) {
    return [
      {
        role: `Lead AI / ML Researcher`,
        company: 'InnovateTech India',
        duration: '2024 - Present',
        description: [
          'Built real-time model inference gateway using Apache Kafka, supporting 50k events per second.',
          'Optimized LLM query performance and index placements, reducing search latencies by 60%.',
          'Authored microservices in Go/Python using gRPC for low overhead internal systems communication.'
        ]
      },
      {
        role: `Senior Machine Learning Engineer`,
        company: 'Apex Digital Solutions',
        duration: '2021 - 2024',
        description: [
          'Designed and implemented distributed training pipelines for large language models (LLMs).',
          'Reduced cloud GPU infrastructure costs by 30% through model quantization and fractional sharing.',
          'Led team of 3 engineers in delivering state-of-the-art text classification and embedding models.'
        ]
      },
      {
        role: `Data Scientist`,
        company: 'Global Tech Labs',
        duration: '2019 - 2021',
        description: [
          'Developed predictive analytics dashboards utilizing statistical learning and regression modeling.',
          'Optimized data ingestion queries, improving speed of data prep pipelines by 45%.',
          'Presented weekly insights to product and marketing teams to improve user acquisition.'
        ]
      },
      {
        role: `Research Analyst`,
        company: 'Startup Incubator Inc.',
        duration: '2018 - 2019',
        description: [
          'Assisted senior researchers in model tuning, data labeling, and training run monitoring.',
          'Wrote Python utility scripts for parsing research datasets and generating visualization plots.',
          'Maintained documentation for experimental setups and results.'
        ]
      },
      {
        role: `AI Development Intern`,
        company: 'Academic Research Lab',
        duration: '2017 - 2018',
        description: [
          'Conducted literature review and baseline tests for computer vision models.',
          'Implemented research papers in PyTorch, contributing to lab open source codebases.',
          'Assisted with hardware maintenance and data preparation for training runs.'
        ]
      }
    ];
  }

  if (titleLower.includes('security') || titleLower.includes('devsecops') || titleLower.includes('exploitation') || titleLower.includes('medic') || titleLower.includes('veteran')) {
    // If it's medical/medic, use medical experiences, else use security experiences
    if (titleLower.includes('medic') || titleLower.includes('veteran')) {
      return [
        {
          role: `Enlisted Medical Specialist`,
          company: 'Gov Services / US Army',
          duration: '2024 - Present',
          description: [
            'Directs emergency medical care, field casualty treatment, and patient logistics during drills.',
            'Maintains high-standard inventory control over medical gear and pharmaceutical supplies.',
            'Provides clinical training to junior medical personnel on trauma treatment and stabilization.'
          ]
        },
        {
          role: `Field Medic Coordinator`,
          company: 'Emergency Corps',
          duration: '2021 - 2024',
          description: [
            'Coordinated rapid response disaster medical teams, logistics, and resource dispatch.',
            'Managed medical logs, patient tracking protocols, and emergency communications.',
            'Instructed community first-aid, CPR, and automated external defibrillator (AED) training.'
          ]
        },
        {
          role: `Lead First Responder`,
          company: 'Red Cross Health',
          duration: '2019 - 2021',
          description: [
            'Provided primary health assessment and first-aid support during large public gatherings.',
            'Maintains emergency response vehicle preparedness, medical kits, and logs.',
            'Coordinated with dispatch systems and local ambulance crews to ensure transfer of critical cases.'
          ]
        },
        {
          role: `Clinical Assistant`,
          company: 'County General Hospital',
          duration: '2017 - 2019',
          description: [
            'Recorded patient vital signs, prepared examination rooms, and updated medical records.',
            'Assisted nursing staff in patient mobility, routine tests, and administrative duties.',
            'Maintained sterile environments and prepared equipment for surgical procedures.'
          ]
        },
        {
          role: `Medical Volunteer`,
          company: 'Community Health Outreach',
          duration: '2016 - 2017',
          description: [
            'Supported free health checkup camps, distributed informational flyers, and guided patients.',
            'Assisted in data entry and patient scheduling database management.'
          ]
        }
      ];
    }
    return [
      {
        role: `Senior Security Architect`,
        company: 'InnovateTech India',
        duration: '2024 - Present',
        description: [
          'Built real-time security scanning gateways, supporting 50k events per second across all code commits.',
          'Optimized database vulnerability scanning queries, reducing latency of security reports by 60%.',
          'Authored automated compliance microservices using Go and gRPC for high-speed network security reviews.'
        ]
      },
      {
        role: `Senior Penetration Tester`,
        company: 'Apex Digital Solutions',
        duration: '2021 - 2024',
        description: [
          'Conducted deep grey-box and black-box penetration testing on enterprise web applications.',
          'Identified 15+ critical CVEs and worked with development teams to implement remediation patches.',
          'Conducted training sessions on secure coding practices and OWASP Top 10 guidelines.'
        ]
      },
      {
        role: `Information Security Analyst`,
        company: 'Global Tech Labs',
        duration: '2019 - 2021',
        description: [
          'Monitored SIEM log feeds and orchestrated incident response protocols for suspicious network activity.',
          'Configured AWS security groups, IAM roles, and VPC isolation networks.',
          'Conducted annual IT compliance audits against ISO 27001 and SOC2 standards.'
        ]
      },
      {
        role: `Security Systems Administrator`,
        company: 'Startup Incubator Inc.',
        duration: '2018 - 2019',
        description: [
          'Configured and updated corporate firewalls, VPNs, and antivirus solutions.',
          'Automated user onboarding/offboarding permissions scripts and endpoint security verification.',
          'Resolved daily security alerts, malware flags, and phishing incident reports.'
        ]
      },
      {
        role: `Cybersecurity Intern`,
        company: 'NetSec Labs',
        duration: '2017 - 2018',
        description: [
          'Assisted in routine vulnerability scans, asset inventory tracking, and patch application verification.',
          'Created security awareness training materials and ran phishing simulation tests.'
        ]
      }
    ];
  }

  if (
    titleLower.includes('designer') ||
    titleLower.includes('ux') ||
    titleLower.includes('ui') ||
    titleLower.includes('visual') ||
    titleLower.includes('product design') ||
    titleLower.includes('design lead')
  ) {
    return [
      {
        role: `Lead UI/UX Designer`,
        company: 'InnovateTech India',
        duration: '2024 - Present',
        description: [
          'Led design system migration to Figma, unifying 12 product lines under a single design language.',
          'Conducted user research and usability testing sessions with 100+ participants, identifying key friction points.',
          'Collaborated with frontend developers on CSS/Tailwind integration and visual quality assurance.'
        ]
      },
      {
        role: `Senior UI/UX Designer`,
        company: 'Apex Digital Solutions',
        duration: '2021 - 2024',
        description: [
          'Created interactive, high-fidelity prototypes for web and mobile interfaces.',
          'Designed intuitive user flows, journey maps, and wireframe schemes for complex dashboards.',
          'Improved onboarding completion rate by 40% through user-centered UX redesign.'
        ]
      },
      {
        role: `Interaction Designer`,
        company: 'Global Tech Labs',
        duration: '2019 - 2021',
        description: [
          'Designed micro-interactions, layout grids, and visual assets for customer-facing applications.',
          'Built responsive prototypes for testing user navigation paths.',
          'Managed asset libraries and handed over clean specifications to development team.'
        ]
      },
      {
        role: `Visual Designer`,
        company: 'Startup Incubator Inc.',
        duration: '2018 - 2019',
        description: [
          'Drafted brand graphics, website layouts, marketing landing pages, and pitch presentations.',
          'Fixed design bugs, modified design components based on user feedback, and aligned assets.'
        ]
      },
      {
        role: `Design Intern`,
        company: 'Creative Studio Agency',
        duration: '2017 - 2018',
        description: [
          'Assisted senior designers with icon design, asset resizing, and creating visual variations.',
          'Participated in brainstorming sessions and prepared mood boards for client projects.'
        ]
      }
    ];
  }

  if (titleLower.includes('office') || titleLower.includes('manager') || titleLower.includes('admin') || titleLower.includes('program') || titleLower.includes('project')) {
    // If program/project manager
    if (titleLower.includes('program') || titleLower.includes('project')) {
      return [
        {
          role: `Program Manager`,
          company: 'Delivery Group Inc',
          duration: '2024 - Present',
          description: [
            'Manages multiple strategic projects, resource allocation, and program timelines.',
            'Redesigned program management workflow, improving sprint delivery rates by 25%.',
            'Coordinates communication across 5 inter-departmental teams and key stakeholders.'
          ]
        },
        {
          role: `Senior Project Manager`,
          company: 'Strategic Execution Corp',
          duration: '2021 - 2024',
          description: [
            'Oversaw enterprise project budgets, milestone roadmaps, and risk management.',
            'Led agile scrum ceremonies, sprint planning, and retro sessions.',
            'Delivered project deliverables 2 weeks ahead of schedule and 10% under budget.'
          ]
        },
        {
          role: `Project Coordinator`,
          company: 'Enterprise Dev Labs',
          duration: '2019 - 2021',
          description: [
            'Maintained project schedule timelines, resource logs, and update reports.',
            'Organized sprint planning sessions, standups, and stakeholder meetings.',
            'Updated task boards (Jira, Trello) and compiled progress update reports.'
          ]
        },
        {
          role: `Associate Project Manager`,
          company: 'BuildTech Services',
          duration: '2017 - 2019',
          description: [
            'Assisted in project milestone tracking, client communication, and budget audits.',
            'Maintained project documentation libraries and processed invoice approvals.'
          ]
        },
        {
          role: `Operations Intern`,
          company: 'Local Business Incubator',
          duration: '2016 - 2017',
          description: [
            'Assisted with event setup, workspace administration, and scheduling meetings.',
            'Helped coordinate logistics for workshop events and community meetups.'
          ]
        }
      ];
    }
    // Else admin/office manager
    return [
      {
        role: `Senior Office Manager`,
        company: 'Global Solutions Group',
        duration: '2024 - Present',
        description: [
          'Oversees daily office operations, budget management, vendor contracts, and facility maintenance.',
          'Implemented digital inventory tracking system, reducing supply expenses by 20%.',
          'Coordinates executive scheduling, logistics, travel arrangements, and board meetings.'
        ]
      },
      {
        role: `Office Administrator`,
        company: 'Metro Business Hub',
        duration: '2021 - 2024',
        description: [
          'Managed front desk operations, visitor greeting, and call routing systems.',
          'Supervised team of 3 administrative assistants and managed mail distribution networks.',
          'Organized corporate events, team-building outings, and annual seminars.'
        ]
      },
      {
        role: `Executive Assistant`,
        company: 'Capital Investments Group',
        duration: '2019 - 2021',
        description: [
          'Provided high-level administrative support to C-level executives, calendar scheduling, and draft communications.',
          'Compiled weekly expense claims, monthly performance reports, and executive dashboards.',
          'Managed sensitive information with high confidentiality and professionalism.'
        ]
      },
      {
        role: `Office Coordinator`,
        company: 'Host Services Inc.',
        duration: '2017 - 2019',
        description: [
          'Ordered office supplies, maintained meeting room schedules, and resolved facility issues.',
          'Updated corporate contact directory and assisted HR with employee onboarding setups.'
        ]
      },
      {
        role: `Administrative Assistant Intern`,
        company: 'Local Business Corp',
        duration: '2016 - 2017',
        description: [
          'Scanned files, archived records, managed incoming mail, and greeted guests.',
          'Maintained kitchen supplies and set up meeting room technology for presentations.'
        ]
      }
    ];
  }

  if (titleLower.includes('logistics') || titleLower.includes('supply')) {
    return [
      {
        role: `Logistics Specialist`,
        company: 'Supply Chain Partners',
        duration: '2024 - Present',
        description: [
          'Manages end-to-end supply chain logistics, routing optimization, and freight dispatch.',
          'Reduced average transport times by 15% through carrier review and route optimization.',
          'Maintains tracking database logs for high-priority government and commercial cargo shipments.'
        ]
      },
      {
        role: `Senior Inventory Coordinator`,
        company: 'Freight Logistics Corp',
        duration: '2021 - 2024',
        description: [
          'Monitored inventory levels across 3 warehouses, audit logs, and stock replenishment.',
          'Implemented SAP inventory module improvements, boosting stock accuracy to 99.8%.',
          'Supervised team of 4 warehouse assistants and coordinated shipment receipt audits.'
        ]
      },
      {
        role: `Warehouse Operations Lead`,
        company: 'Global Distributors',
        duration: '2019 - 2021',
        description: [
          'Oversaw daily order pick-and-pack schedules, shipment preparation, and carrier handoffs.',
          'Maintained strict safety standard compliances, reducing warehouse incidents to zero.',
          'Managed warehouse spacing configuration, maximizing storage space utilization by 25%.'
        ]
      },
      {
        role: `Logistics Coordinator`,
        company: 'Shipment Express',
        duration: '2017 - 2019',
        description: [
          'Generated shipping labels, compiled custom clearance documents, and scheduled pickup tasks.',
          'Communicated delivery status updates and resolved shipment delay complaints.'
        ]
      },
      {
        role: `Procurement Assistant`,
        company: 'Local Trade Inc',
        duration: '2016 - 2017',
        description: [
          'Assisted procurement team in matching invoices, sending requests for quotes, and following up on purchase orders.',
          'Updated supplier catalogues and pricing spreadsheets.'
        ]
      }
    ];
  }

  if (titleLower.includes('national') || titleLower.includes('security professional') || titleLower.includes('analyst') || titleLower.includes('policy')) {
    return [
      {
        role: `National Security Specialist`,
        company: 'Federal Policy Group',
        duration: '2024 - Present',
        description: [
          'Drafts comprehensive intelligence threat reports and security briefings for policy makers.',
          'Collaborates on joint agency risk assessment taskforces focused on regional stability.',
          'Reviews compliance of internal agency programs against national security standards.'
        ]
      },
      {
        role: `Senior Analyst - Risk Assessments`,
        company: 'Strategic Intelligence Labs',
        duration: '2021 - 2024',
        description: [
          'Conducted open-source research and data analysis on global geopolitical developments.',
          'Authored weekly risk reports detailing emerging threat landscapes in cyberspace and critical infrastructure.',
          'Presented analytical briefings to senior management and government liaison officers.'
        ]
      },
      {
        role: `Policy Advisor`,
        company: 'Defense Policy Board',
        duration: '2019 - 2021',
        description: [
          'Analyzed defense spending trends, policy papers, and legislative updates.',
          'Compiled research papers and policy briefs, improving access to analytical insights.',
          'Coordinated inter-departmental advisory panels and policy workshops.'
        ]
      },
      {
        role: `Security Program Liaison`,
        company: 'Global Affairs Institute',
        duration: '2017 - 2019',
        description: [
          'Maintained security program documentation and coordinated training schedules.',
          'Assisted with physical security audits and badge access logs for institute facilities.'
        ]
      },
      {
        role: `Junior Research Analyst`,
        company: 'Foreign Policy Center',
        duration: '2016 - 2017',
        description: [
          'Collected, structured, and archived geopolitical research data.',
          'Supported senior scholars in drafting research indices and bibliography databases.'
        ]
      }
    ];
  }

  if (titleLower.includes('support') || titleLower.includes('help') || titleLower.includes('desk') || titleLower.includes('representative')) {
    return [
      {
        role: `Help Desk Specialist`,
        company: 'Enterprise Support Services',
        duration: '2024 - Present',
        description: [
          'Manages tier-2 technical support tickets for hardware, software, and networking issues.',
          'Resolved 95%+ of assigned tickets within SLA timelines, improving customer satisfaction.',
          'Configures and deploys workplace computers, software packages, and network accounts.'
        ]
      },
      {
        role: `Senior IT Support Representative`,
        company: 'Metro Tech Support',
        duration: '2021 - 2024',
        description: [
          'Provided tier-1 and tier-2 phone, email, and chat technical support to corporate clients.',
          'Administered Active Directory users, passwords, and security groups.',
          'Authored internal troubleshooting guides, reducing tier-1 ticket escalation rates by 20%.'
        ]
      },
      {
        role: `Technical Support Coordinator`,
        company: 'Client First Systems',
        duration: '2019 - 2021',
        description: [
          'Answered user technical queries, logged tickets, and routed complex tasks to field crews.',
          'Conducted remote diagnostic tests and guided users through hardware setups.',
          'Updated support database with resolution guides and client hardware inventories.'
        ]
      },
      {
        role: `Desktop Support Technician`,
        company: 'Local Office Network',
        duration: '2017 - 2019',
        description: [
          'Maintained office printers, routers, workstations, and software patches.',
          'Resolved daily user connectivity, printing, and file access issues.'
        ]
      },
      {
        role: `IT Helpdesk Intern`,
        company: 'College IT Helpdesk',
        duration: '2016 - 2017',
        description: [
          'Assisted students and staff with Wi-Fi connection, software installs, and account resets.',
          'Maintained hardware loan inventories and processed returned equipment.'
        ]
      }
    ];
  }

  // Fallback / General Technical Roles
  return [
    {
      role: `Senior ${rolePrefix}`,
      company: 'InnovateTech India',
      duration: '2023 - Present',
      description: [
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
      role: `Junior Developer`,
      company: 'Startup Incubator Inc.',
      duration: '2018 - 2019',
      description: [
        'Collaborated with designers to build responsive interfaces matching high-fidelity wireframes.',
        'Participated in daily agile scrum standups, code reviews, and technical retro sessions.',
        'Maintained documentation, fixed bugs, and helped automate internal deployment scripts.'
      ]
    },
    {
      role: `Developer Intern`,
      company: 'Tech Incubator Labs',
      duration: '2017 - 2018',
      description: [
        'Assisted with database scripting, UI bug fixes, and system monitoring.',
        'Created wiki pages documenting local developer setup scripts and guidelines.'
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

  const positionLower = candidate.position.toLowerCase();
  const isML = positionLower.includes('machine') || positionLower.includes('ai');
  const isSec = positionLower.includes('security') || positionLower.includes('devsecops');
  const isDesign = positionLower.includes('designer') || positionLower.includes('ux') || positionLower.includes('ui') || positionLower.includes('visual') || positionLower.includes('product design') || positionLower.includes('design lead');

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
    ] : isDesign ? [
      'Exceptional taste for clean interaction patterns and visual hierarchy.',
      'Strong user research synthesis and product thinking.',
      'Consistent collaboration with engineering teams on design handoff quality.'
    ] : [
      'Flawless system design patterns.',
      'Excellent database indexing depth.',
      'High concurrent system comprehension.'
    ],
    weaknesses: isML ? [
      'Weak on frontend design aspects and styling frameworks.'
    ] : isSec ? [
      'Basic frontend integration knowledge, needs support on fullstack UI tasks.'
    ] : isDesign ? [
      'Needs stronger technical depth on backend APIs and data-layer constraints.'
    ] : [
      'Weak on frontend design aspects and styling frameworks.'
    ],
    performedWell: isML 
      ? ['Explaining transformer architecture details vs simple CNNs', 'Explaining vector indexing strategies for range queries']
      : isSec
      ? ['Explaining SQL injection mitigation strategies', 'Explaining Docker container escape isolation mechanics']
      : isDesign
      ? ['Explaining design system consistency across product surfaces', 'Explaining user research findings into interface decisions']
      : ['Explaining Go channels vs mutex locks', 'Explaining indexing strategies for range queries in PostgreSQL'],
    gotStuck: isML
      ? ['Explaining browser rendering engine pipelines (understandably outside ML domain)']
      : isSec
      ? ['Explaining browser CSS parsing engine rules (understandably outside backend security domain)']
      : isDesign
      ? ['Explaining low-level backend scaling trade-offs (understandably outside product design domain)']
      : ['Explaining browser rendering engine pipelines (understandably outside backend domain)'],
    qaList: [
      {
        question: isML 
          ? 'Detail your experience scaling high-concurrency training or evaluation pipelines.'
          : isSec
          ? 'Detail your experience scaling high-concurrency log-monitoring and firewall alerts.'
          : isDesign
          ? 'How do you translate user research into clear product design decisions?'
          : 'Detail your experience scaling high-concurrency Node.js or Python endpoints.',
        answer: isML 
          ? 'With Python, model serving runs on Ray utilizing asynchronous inference loops. To scale, we run multiple model worker processes, put Redis as manager, load balance across containers, and shift heavy preprocessing tasks to Celery.'
          : isSec
          ? 'With Python, threat scanning runs on Uvicorn utilizing an asyncio loop. To scale, we run multiple worker processes, put Redis as manager, load balance across containers, and shift expensive packet inspections to Celery.'
          : isDesign
          ? 'I start with user interviews and workflow mapping, then convert findings into journey maps, wireframes, and iterative prototypes. I keep engineers involved early so constraints are visible before final handoff.'
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

export interface IntegrityEvent {
  timestamp: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  deduction: number;
  questionNumber: number;
  context: string;
}

export interface DimensionScore {
  name: string;
  score: number;
  weight: number;
  category: 'Core technical' | 'Communication' | 'Behavioural';
}

export interface TranscriptTurn {
  questionNumber: number;
  type: string;
  complexity: 'Easy' | 'Medium' | 'Hard';
  questionText: string;
  answerText: string;
  score: number;
  responseTime: string;
  timingAnomaly: boolean;
}

export interface DetailedEvaluationReport {
  seniority: string;
  duration: string;
  percentile: string;
  verdict: 'Clean' | 'Flagged' | 'Critical';
  verdictDescription: string;
  summary: string;
  signalFlags: string[];
  strengths: string[];
  concerns: string[];
  dimensions: DimensionScore[];
  integrityScore: number;
  integrityEvents: IntegrityEvent[];
  integrityDeductionsBreakdown: {
    tabSwitches: number;
    gazeAverting: number;
    multipleFaces: number;
    total: number;
  };
  transcript: TranscriptTurn[];
}

export const getDetailedEvaluationReport = (candidate: Candidate): DetailedEvaluationReport => {
  const match = candidate.aiMatchScore || 85;
  const integrity = candidate.integrityScore !== undefined ? candidate.integrityScore : 100;
  
  let seniority = 'Mid-level';
  if (match >= 90) seniority = 'Senior';
  if (match >= 95) seniority = 'Lead / Principal';
  if (match < 70) seniority = 'Junior';

  const duration = '42 minutes';

  let percentile = 'Top 15%';
  if (match >= 95) percentile = 'Top 2%';
  else if (match >= 90) percentile = 'Top 6%';
  else if (match >= 85) percentile = 'Top 10%';
  else if (match >= 75) percentile = 'Top 25%';
  else percentile = 'Top 50%';

  let verdict: 'Clean' | 'Flagged' | 'Critical' = 'Clean';
  let verdictDescription = 'Candidate completed the assessment securely with no suspicious patterns.';
  if (integrity < 70) {
    verdict = 'Critical';
    verdictDescription = 'Multiple serious violations detected: multiple faces and background voice activity.';
  } else if (integrity < 90) {
    verdict = 'Flagged';
    verdictDescription = 'Minor anomalies flagged: browser tab switches and screen gaze averts.';
  }

  const positionName = candidate.position || 'Software Engineer';
  const summary = `${candidate.name} demonstrated exceptional technical execution during their ${duration} automated screening for the ${positionName} position. Their explanation of key principles was articulate, well-structured, and rich with practical examples. In particular, their approach to scalability showed a strong systems-level maturity. There are minor areas of growth, but overall they represent a highly promising addition to the team.`;

  const signalFlags = [
    'Strong system design knowledge',
    match >= 85 ? 'Exceptional concurrency patterns understanding' : 'Good familiarity with core architecture libraries',
    'Hesitated briefly on thread isolation details',
    'Well-structured verbal communication'
  ];

  const strengths = [
    'Excellent understanding of asynchronous and concurrent processing models',
    'Deep knowledge of relational indexing and distributed databases',
    'Proactive approach to modular, self-healing system design patterns'
  ];
  
  const concerns = [
    'Slightly weaker on lower-level rendering pipeline specifics',
    'Relies on standard templates for complex security configuration details'
  ];

  const dScores = {
    tech1: Math.min(100, match + 5),
    tech2: Math.min(100, Math.max(45, match + 3)),
    tech3: Math.min(100, Math.max(45, match - 2)),
    tech4: Math.min(100, Math.max(45, match + 1)),
    tech5: Math.min(100, Math.max(45, match - 5)),
    comm1: Math.min(100, Math.max(45, match + 4)),
    comm2: Math.min(100, Math.max(45, match)),
    comm3: Math.min(100, Math.max(45, match - 3)),
    comm4: Math.min(100, Math.max(45, match + 2)),
    behav1: Math.min(100, Math.max(45, match + 6)),
    behav2: Math.min(100, Math.max(45, match + 2)),
    behav3: Math.min(100, Math.max(45, match - 1))
  };

  const dimensions: DimensionScore[] = [
    { name: 'System Architecture', score: dScores.tech1, weight: 15, category: 'Core technical' },
    { name: 'Database Systems', score: dScores.tech2, weight: 10, category: 'Core technical' },
    { name: 'Data Structures', score: dScores.tech3, weight: 10, category: 'Core technical' },
    { name: 'Concurrency & Perf', score: dScores.tech4, weight: 10, category: 'Core technical' },
    { name: 'API Design & gRPC', score: dScores.tech5, weight: 10, category: 'Core technical' },
    { name: 'Technical Articulation', score: dScores.comm1, weight: 10, category: 'Communication' },
    { name: 'Explanation Structure', score: dScores.comm2, weight: 5, category: 'Communication' },
    { name: 'Active Listening', score: dScores.comm3, weight: 5, category: 'Communication' },
    { name: 'Professional Tone', score: dScores.comm4, weight: 5, category: 'Communication' },
    { name: 'Problem Solving Drive', score: dScores.behav1, weight: 10, category: 'Behavioural' },
    { name: 'Adaptability', score: dScores.behav2, weight: 5, category: 'Behavioural' },
    { name: 'Collaboration Mindset', score: dScores.behav3, weight: 5, category: 'Behavioural' }
  ];

  const integrityEvents: IntegrityEvent[] = [];
  let tabSwitches = 0;
  let gazeAverting = 0;
  let multipleFaces = 0;

  if (integrity < 100) {
    const totalDeduction = 100 - integrity;
    if (totalDeduction >= 25) {
      multipleFaces += 1;
      tabSwitches += 2;
      gazeAverting += 3;
      integrityEvents.push(
        { timestamp: '10:14', type: 'Multiple Faces Detected', severity: 'high', deduction: 15, questionNumber: 3, context: 'During vector retrieval explanation' },
        { timestamp: '14:22', type: 'Tab Switch', severity: 'medium', deduction: 5, questionNumber: 5, context: 'During query execution lifecycle' },
        { timestamp: '18:05', type: 'Gaze Averted', severity: 'low', deduction: 3, questionNumber: 6, context: 'During race condition question' },
        { timestamp: '24:50', type: 'Tab Switch', severity: 'medium', deduction: 5, questionNumber: 8, context: 'During cache invalidation question' }
      );
    } else {
      tabSwitches += 1;
      gazeAverting += 1;
      integrityEvents.push(
        { timestamp: '12:04', type: 'Tab Switch', severity: 'medium', deduction: 5, questionNumber: 4, context: 'During thread rendering step question' },
        { timestamp: '22:30', type: 'Gaze Averted', severity: 'low', deduction: 3, questionNumber: 7, context: 'During lock contention explanation' }
      );
    }
  }

  const qList = (candidate.interviewPerformance?.qaList || getDefaultInterviewPerformance(candidate).qaList);
  const transcript: TranscriptTurn[] = qList.map((qa, index) => {
    let type = 'Core technical';
    if (index === 0) type = 'System Design';
    else if (index === 1) type = 'Core CS / Rendering';
    else if (index === 2) type = 'Concurrency';
    else if (index === 3) type = 'Scenario / Practice';

    const complexity = index % 3 === 0 ? 'Hard' : index % 3 === 1 ? 'Easy' : 'Medium';
    const timingAnomaly = index === 2;
    const responseTime = index === 2 ? '2.5s' : `${Math.floor(Math.random() * 40) + 15}s`;

    return {
      questionNumber: index + 1,
      type,
      complexity,
      questionText: qa.question,
      answerText: qa.answer,
      score: qa.score,
      responseTime,
      timingAnomaly
    };
  });

  return {
    seniority,
    duration,
    percentile,
    verdict,
    verdictDescription,
    summary,
    signalFlags,
    strengths,
    concerns,
    dimensions,
    integrityScore: integrity,
    integrityEvents,
    integrityDeductionsBreakdown: {
      tabSwitches,
      gazeAverting,
      multipleFaces,
      total: 100 - integrity
    },
    transcript
  };
};
