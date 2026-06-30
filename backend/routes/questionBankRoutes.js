const express = require('express');
const router = express.Router();
const QuestionBank = require('../models/QuestionBank');

// Robust fallback generator helper for questions if Gemini is unavailable or key is missing
function generateFallbackQuestions(jobTitle) {
  const titleLower = jobTitle.toLowerCase();
  
  // 1. AI / ML Researcher Templates
  if (titleLower.includes('machine learning') || titleLower.includes('ml') || titleLower.includes('ai') || titleLower.includes('researcher')) {
    return [
      // 10 Easy Questions
      { text: "What is the difference between supervised and unsupervised learning?", category: "Easy" },
      { text: "Explain the concept of overfitting and how to prevent it.", category: "Easy" },
      { text: "What are the common activation functions used in neural networks?", category: "Easy" },
      { text: "Define precision, recall, and F1-score.", category: "Easy" },
      { text: "What is a confusion matrix?", category: "Easy" },
      { text: "What is gradient descent and how does it work?", category: "Easy" },
      { text: "What is the difference between L1 and L2 regularization?", category: "Easy" },
      { text: "Explain the purpose of a validation set in model training.", category: "Easy" },
      { text: "What is a loss function in machine learning?", category: "Easy" },
      { text: "What is cross-validation and why is it useful?", category: "Easy" },

      // 10 Medium Questions
      { text: "Explain the architecture and mechanism of a Transformer model.", category: "Medium" },
      { text: "How does backpropagation work in recurrent neural networks (RNNs)?", category: "Medium" },
      { text: "What is the vanishing gradient problem and how can you mitigate it?", category: "Medium" },
      { text: "Describe the differences between Bagging and Boosting algorithms.", category: "Medium" },
      { text: "Explain the concept and trade-offs of using Retrieval-Augmented Generation (RAG) vs fine-tuning an LLM.", category: "Medium" },
      { text: "How does the attention mechanism improve sequence-to-sequence models?", category: "Medium" },
      { text: "What is the difference between batch normalization and layer normalization?", category: "Medium" },
      { text: "Explain how reinforcement learning from human feedback (RLHF) works.", category: "Medium" },
      { text: "Describe PCA (Principal Component Analysis) and how it achieves dimensionality reduction.", category: "Medium" },
      { text: "What is transfer learning and when should you use it?", category: "Medium" },

      // 10 Hard Questions
      { text: "Derive the mathematical formula of self-attention in Transformers.", category: "Hard" },
      { text: "Explain optimization strategies for training LLMs, including ZeRO, pipeline parallelism, and tensor parallelism.", category: "Hard" },
      { text: "How do you mathematically address non-stationarity in reinforcement learning environments?", category: "Hard" },
      { text: "Explain the differences in training dynamics and objective functions between GANs and Diffusion models.", category: "Hard" },
      { text: "How would you design a distributed training pipeline for a 100-billion parameter model on a GPU cluster?", category: "Hard" },
      { text: "Discuss the theoretical bounds of convergence for stochastic gradient descent in non-convex optimization.", category: "Hard" },
      { text: "Explain the mechanics of contrastive learning and its representation learning guarantees.", category: "Hard" },
      { text: "Detail the mathematical differences between FlashAttention and standard self-attention.", category: "Hard" },
      { text: "How would you optimize a deep neural network to run in real-time under strict memory constraints on an edge device?", category: "Hard" },
      { text: "Explain structural causal models (SCMs) and how to perform causal discovery from observational data.", category: "Hard" },

      // 5 Scenario Questions
      { text: "Scenario: Your model performs exceptionally well on the training set (99% accuracy) but poorly on the production test set (55% accuracy). Walk us through your debugging process step-by-step.", category: "Scenario" },
      { text: "Scenario: You are tasked with building a real-time recommendation system for an e-commerce platform that handles 100k requests per second. Explain your model and system architecture choices.", category: "Scenario" },
      { text: "Scenario: An LLM chatbot is generating toxic and biased responses. How do you implement automated guardrails and safety filters at both inference and training phases?", category: "Scenario" },
      { text: "Scenario: You have a dataset where the positive class is only 0.1% of the total dataset. Explain your strategy for sampling, model selection, loss functions, and evaluations.", category: "Scenario" },
      { text: "Scenario: A deep learning model has suddenly dropped in performance in production. The distribution of input features has drifted. How do you detect and fix this feature drift?", category: "Scenario" },

      // 5 Behavioral Questions
      { text: "Tell us about a time when your research project or ML model failed to deliver the expected results. What did you learn and how did you pivot?", category: "Behavioral" },
      { text: "How do you balance the trade-off between spending time researching state-of-the-art algorithms vs shipping a simpler model that works immediately?", category: "Behavioral" },
      { text: "Describe a situation where you had to explain a complex ML model concept (like attention or embeddings) to a non-technical stakeholder. How did you structure your explanation?", category: "Behavioral" },
      { text: "Tell us about a time you collaborated with product and engineering teams to deploy a research prototype into production. What challenges arose and how did you resolve them?", category: "Behavioral" },
      { text: "How do you stay updated with the rapidly evolving field of generative AI and deep learning research? Tell us about a recent paper that inspired you.", category: "Behavioral" }
    ];
  }

  // 2. Full Stack templates
  if (titleLower.includes('full stack') || titleLower.includes('frontend') || titleLower.includes('backend') || titleLower.includes('web') || titleLower.includes('software')) {
    return [
      // 10 Easy Questions
      { text: "What is the difference between GET and POST HTTP requests?", category: "Easy" },
      { text: "What is DOM in web development?", category: "Easy" },
      { text: "Explain the difference between SQL and NoSQL databases.", category: "Easy" },
      { text: "What is CORS and why is it needed?", category: "Easy" },
      { text: "What are CSS media queries used for?", category: "Easy" },
      { text: "Explain the difference between 'let', 'const', and 'var' in Javascript.", category: "Easy" },
      { text: "What is a state management system in React?", category: "Easy" },
      { text: "What is MVC architecture?", category: "Easy" },
      { text: "What is the purpose of database indexes?", category: "Easy" },
      { text: "What is Git and how do you resolve a merge conflict?", category: "Easy" },

      // 10 Medium Questions
      { text: "Explain Next.js rendering strategies: SSR, SSG, ISR, and CSR.", category: "Medium" },
      { text: "How does React fiber architecture and virtual DOM reconciler work?", category: "Medium" },
      { text: "Describe how JWT (JSON Web Tokens) work for session authorization.", category: "Medium" },
      { text: "What is the event loop in Node.js and how does it handle asynchronous code?", category: "Medium" },
      { text: "Explain database normalization (1NF, 2NF, 3NF) and when you would denormalize.", category: "Medium" },
      { text: "How would you implement pagination and infinite scroll for a large feed list?", category: "Medium" },
      { text: "What is database transaction isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable)?", category: "Medium" },
      { text: "Describe CSS grid vs flexbox and their performance implications in complex UI layouts.", category: "Medium" },
      { text: "Explain the concept of WebSockets and how they differ from HTTP polling.", category: "Medium" },
      { text: "What is middleware in Express.js and how does error-handling middleware work?", category: "Medium" },

      // 10 Hard Questions
      { text: "How do you optimize React rendering performance using useMemo, useCallback, and transitions, and how do you debug memory leaks?", category: "Hard" },
      { text: "Explain micro-frontend architectures, their deployment strategies, and runtime module loading (module federation).", category: "Hard" },
      { text: "How do you design a distributed session caching mechanism using Redis with high availability?", category: "Hard" },
      { text: "Explain the mechanics of Optimistic Concurrency Control vs Pessimistic Locking in highly concurrent write databases.", category: "Hard" },
      { text: "Detail how you would implement horizontal scaling for a Node.js API server using load balancers and sticky sessions.", category: "Hard" },
      { text: "Explain React Server Components (RSC) vs Client Components and how the network boundary is negotiated.", category: "Hard" },
      { text: "How do you protect a web application against complex attacks like CSRF, XSS, SSRF, and SQL Injection at the network, framework, and proxy layers?", category: "Hard" },
      { text: "Explain database query optimization techniques, explaining query execution plans and composite indexing strategies.", category: "Hard" },
      { text: "How would you design a robust event-driven microservices architecture using Apache Kafka or RabbitMQ?", category: "Hard" },
      { text: "Describe garbage collection strategies in V8 (NodeJS/Chrome) and how memory leaks occur via closures.", category: "Hard" },

      // 5 Scenario Questions
      { text: "Scenario: Users are reporting that your web app is taking 8 seconds to load on mobile connections. Explain your step-by-step plan to identify, debug, and resolve these performance bottlenecks.", category: "Scenario" },
      { text: "Scenario: Your Express backend goes down every Friday afternoon due to database connection pooling exhaustion. Walk us through how you would diagnose the root cause and refactor the code.", category: "Scenario" },
      { text: "Scenario: You are designing a real-time collaborative document editing tool (similar to Google Docs). Explain your data structure choices (OT vs CRDTs) and network architecture.", category: "Scenario" },
      { text: "Scenario: A third-party payment gateway API is slow and occasionally fails. How do you implement resilient fallbacks, retries with exponential backoffs, and circuit breakers?", category: "Scenario" },
      { text: "Scenario: You need to migrate a production SQL database with 50 million rows to a new schema without causing any platform downtime. Explain your migration strategy.", category: "Scenario" },

      // 5 Behavioral Questions
      { text: "Describe a time when you had a strong technical disagreement with another engineer about code architecture or tech stack selection. How did you navigate the conversation and reach a consensus?", category: "Behavioral" },
      { text: "Tell us about a time you had to deliver a major feature under a tight deadline, but you had to compromise on technical debt. How did you prioritize what to build and how did you manage the leftover debt?", category: "Behavioral" },
      { text: "How do you mentor junior developers or team members? Tell us about a time you helped someone grow technically.", category: "Behavioral" },
      { text: "Tell us about a time when you introduced a new library or tool (e.g. NextJS, Tailwind, Zustand) to your team. How did you pitch it, and how did you handle resistance?", category: "Behavioral" },
      { text: "Describe a production outage that was caused by code you wrote. What was the bug, how did you handle the situation, and what did you implement to prevent it in the future?", category: "Behavioral" }
    ];
  }

  // 3. Security / DevOps / DevOps Architect / Security Engineer Templates
  if (titleLower.includes('security') || titleLower.includes('devops') || titleLower.includes('infra') || titleLower.includes('cloud') || titleLower.includes('kubernetes')) {
    return [
      // 10 Easy Questions
      { text: "What is CI/CD and why is it important?", category: "Easy" },
      { text: "Explain the difference between a container and a virtual machine.", category: "Easy" },
      { text: "What is symmetric vs asymmetric encryption?", category: "Easy" },
      { text: "What is the purpose of SSH?", category: "Easy" },
      { text: "What is Infrastructure as Code (IaC)?", category: "Easy" },
      { text: "Explain the difference between HTTP and HTTPS.", category: "Easy" },
      { text: "What is Docker and what is a Dockerfile?", category: "Easy" },
      { text: "What is a load balancer?", category: "Easy" },
      { text: "What does OWASP stand for and what is its main goal?", category: "Easy" },
      { text: "What is DNS and how does it map domains to IP addresses?", category: "Easy" },

      // 10 Medium Questions
      { text: "Describe Kubernetes core components: Pods, Services, Deployments, and Ingress.", category: "Medium" },
      { text: "Explain how a blue-green deployment differs from a canary deployment.", category: "Medium" },
      { text: "What is a SQL injection vulnerability and how do you protect database interfaces?", category: "Medium" },
      { text: "Explain AWS IAM policies, roles, and the principle of least privilege.", category: "Medium" },
      { text: "What is GitOps and how does it relate to traditional CI/CD workflows?", category: "Medium" },
      { text: "How do you configure secrets management in a Kubernetes cluster safely?", category: "Medium" },
      { text: "Explain the concept of container registry vulnerability scanning.", category: "Medium" },
      { text: "What is rate limiting and how do you configure it in NGINX or API Gateways?", category: "Medium" },
      { text: "Explain the differences between Docker bridge networking and overlay networking.", category: "Medium" },
      { text: "Describe how SSL/TLS handshake works to establish a secure connection.", category: "Medium" },

      // 10 Hard Questions
      { text: "Explain how you would design a secure, zero-trust Kubernetes cluster network architecture using Service Meshes (like Istio/Linkerd) and Network Policies.", category: "Hard" },
      { text: "Detail your approach to configuring multi-region AWS infrastructure using Terraform, managing state locking and workspace drift.", category: "Hard" },
      { text: "How do you investigate, trace, and audit container breakout exploits in production environments?", category: "Hard" },
      { text: "Explain how you would construct a secure, automated CI/CD security scanning pipeline that integrates SAST, DAST, SCA, and secrets scanning.", category: "Hard" },
      { text: "Describe how you optimize Kubernetes resource limits, requests, and Horizontal Pod Autoscalers (HPA) to avoid OOMKills and wasteful over-provisioning.", category: "Hard" },
      { text: "Explain the mechanics of Cross-Site Scripting (XSS) mitigation using Content Security Policies (CSP) and secure headers.", category: "Hard" },
      { text: "How would you design a high-availability disaster recovery failover plan (RTO/RPO targets) for a stateful cloud database?", category: "Hard" },
      { text: "Detail the mechanisms of securing container runtime environments using gVisor, AppArmor, or seccomp profiles.", category: "Hard" },
      { text: "How do you configure decentralized authentication and authorization across multiple cloud providers (SAML, OIDC, OAuth2)?", category: "Hard" },
      { text: "Explain how log aggregation tools (like ELK/EFK stack) process telemetry, and how you filter/mask PII before indexes are written.", category: "Hard" },

      // 5 Scenario Questions
      { text: "Scenario: An automated scanner alerts you that your production AWS S3 bucket containing sensitive PDF resumes is public. Walk us through your immediate incident response steps.", category: "Scenario" },
      { text: "Scenario: You notice a sudden spike in CPU utilization across all Kubernetes nodes. Pods are restarts continuously. Explain how you would isolate, diagnose, and resolve this resource congestion.", category: "Scenario" },
      { text: "Scenario: You are tasked with migrating a legacy server-hosted application to a containerized infrastructure in GKE/EKS. Walk us through your containerization and deployment design.", category: "Scenario" },
      { text: "Scenario: A hacker attempts to execute a DDoS attack targeting your API endpoints. Explain how you would configure Cloudflare WAF, rate limits, and caching to mitigate the threat.", category: "Scenario" },
      { text: "Scenario: Your Terraform deployment succeeds, but someone manually deleted an RDS security group in the cloud console. Explain how you detect and remediate this configuration drift.", category: "Scenario" },

      // 5 Behavioral Questions
      { text: "Describe a time when you had to enforce a strict security policy or infrastructure rule that delayed a product release. How did you communicate this to the product team and resolve the impasse?", category: "Behavioral" },
      { text: "Tell us about a time you handled a critical security incident or system outage. What was the incident, how did you keep the team informed, and what were the post-mortem steps?", category: "Behavioral" },
      { text: "How do you stay abreast of newly disclosed security vulnerabilities (CVEs) and cloud architecture best practices?", category: "Behavioral" },
      { text: "Describe a complex cloud architecture you designed. What were the key requirements, and how did you balance reliability, security, and cost?", category: "Behavioral" },
      { text: "Tell us about a time when you had to convince a development team to change the way they handle secrets in their code. How did you explain the risk and guide them to a secure solution?", category: "Behavioral" }
    ];
  }

  // 4. Default / Generic Templates
  return [
    // 10 Easy Questions
    { text: "What is your development workflow from receiving requirements to deployment?", category: "Easy" },
    { text: "Explain the importance of version control systems like Git.", category: "Easy" },
    { text: "What are the key pillars of object-oriented programming (OOP)?", category: "Easy" },
    { text: "What is the difference between synchronous and asynchronous tasks?", category: "Easy" },
    { text: "Explain the basic structure of a REST API.", category: "Easy" },
    { text: "What is the purpose of software unit testing?", category: "Easy" },
    { text: "What are environment variables and why do we use them?", category: "Easy" },
    { text: "Describe the Agile development methodology.", category: "Easy" },
    { text: "What is a package manager (e.g. npm, pip) and what is its purpose?", category: "Easy" },
    { text: "Explain the concept of code refactoring.", category: "Easy" },

    // 10 Medium Questions
    { text: "Describe the difference between monolithic and microservice architectures.", category: "Medium" },
    { text: "Explain how relational database joining works and the performance implications.", category: "Medium" },
    { text: "What is clean code? Detail some practices you follow to keep code readable.", category: "Medium" },
    { text: "Explain caching strategies (e.g., Cache-Aside, Write-Through) and how you handle cache invalidation.", category: "Medium" },
    { text: "How do you implement secure user authentication and authorization in a web app?", category: "Medium" },
    { text: "Explain the difference between functional programming and object-oriented programming.", category: "Medium" },
    { text: "How do you write API endpoints that handle file uploading safely and efficiently?", category: "Medium" },
    { text: "What is continuous integration and how do you write automated test checks in Git pipelines?", category: "Medium" },
    { text: "Describe key database optimization techniques, like indexing and sharding.", category: "Medium" },
    { text: "Explain the concept of technical debt and how you manage it over a product lifecycle.", category: "Medium" },

    // 10 Hard Questions
    { text: "Explain how you would design a highly scalable, distributed messaging system handling millions of active alerts.", category: "Hard" },
    { text: "How do you design systems to be resilient, covering failover protocols, data replication, and high-availability setups?", category: "Hard" },
    { text: "Explain the CAP theorem and how you choose databases based on its principles.", category: "Hard" },
    { text: "Describe how you debug complex, intermittent memory leaks in highly concurrent systems.", category: "Hard" },
    { text: "How do you mathematically analyze and optimize the time and space complexity of large-scale search algorithms?", category: "Hard" },
    { text: "Detail how you secure decentralized APIs using OAuth2, scopes, rate-limiting, and encryption standards.", category: "Hard" },
    { text: "Explain microservices transaction management strategies, specifically the Saga pattern and 2-phase commit.", category: "Hard" },
    { text: "How would you design a global, low-latency CDN data synchronization model?", category: "Hard" },
    { text: "Detail how you handle data migrations on sharded databases under active load.", category: "Hard" },
    { text: "Explain how you would design a zero-downtime, blue-green cloud container release architecture.", category: "Hard" },

    // 5 Scenario Questions
    { text: "Scenario: A critical database is locking up during peak usage hours (9 AM - 11 AM). Explain your strategy to locate, analyze, and resolve the database lock bottlenecks.", category: "Scenario" },
    { text: "Scenario: You are designing the architecture for a high-concurrency event ticketing system. Explain how you prevent race conditions (double booking tickets) under massive write load.", category: "Scenario" },
    { text: "Scenario: A development team has left API keys exposed in a public Git repository. Walk us through your immediate threat response steps.", category: "Scenario" },
    { text: "Scenario: You need to migrate all customer profiles to a new database engine while maintaining high availability. Explain your migration steps.", category: "Scenario" },
    { text: "Scenario: The platform experiences a complete outage due to a bad deploy. The rollback itself is failing. Explain your contingency debugging steps.", category: "Scenario" },

    // 5 Behavioral Questions
    { text: "Describe a time when you had to complete a task with vague requirements. How did you gather clarity and align with stakeholders?", category: "Behavioral" },
    { text: "Tell us about a time you made a major mistake on a technical project. How did you take responsibility and how did you resolve the fallout?", category: "Behavioral" },
    { text: "How do you manage deadlines and prioritize task loads when you have multiple competing projects?", category: "Behavioral" },
    { text: "Describe a time you proposed a major refactoring or structural change to a legacy application. How did you justify the investment to stakeholders?", category: "Behavioral" },
    { text: "Tell us about a time you mentored a team member. What was their technical challenge and how did you help them succeed?", category: "Behavioral" }
  ];
}

// GET all question banks
router.get('/', async (req, res) => {
  try {
    const list = await QuestionBank.find({}).sort({ createdAt: -1 });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET question bank for a specific job title
router.get('/:jobTitle', async (req, res) => {
  try {
    const bank = await QuestionBank.findOne({ jobTitle: req.params.jobTitle });
    if (!bank) return res.status(404).json({ message: 'Question bank not found' });
    res.status(200).json(bank);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT save/update question bank for a specific job title
router.put('/:jobTitle', async (req, res) => {
  const { questions } = req.body;

  if (!Array.isArray(questions)) {
    return res.status(400).json({ message: 'Questions array is required' });
  }

  try {
    const sanitizedQuestions = questions.map((q) => ({
      text: q?.text || 'Tell us about your technical experience.',
      category: ['Easy', 'Medium', 'Hard', 'Scenario', 'Behavioral'].includes(q?.category)
        ? q.category
        : 'Easy'
    }));

    const bank = await QuestionBank.findOneAndUpdate(
      { jobTitle: req.params.jobTitle },
      { questions: sanitizedQuestions, createdAt: new Date() },
      { new: true, upsert: true }
    );

    res.status(200).json(bank);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST generate/regenerate question bank for a job role
router.post('/generate', async (req, res) => {
  const { jobTitle } = req.body;
  if (!jobTitle) {
    return res.status(400).json({ message: 'Job title is required' });
  }

  // Check if we have an API key configured for Gemini
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log(`Gemini API key is not configured. Generating fallback mock questions for "${jobTitle}"...`);
    try {
      const fallbackQuestions = generateFallbackQuestions(jobTitle);
      
      // Upsert into database
      const bank = await QuestionBank.findOneAndUpdate(
        { jobTitle },
        { questions: fallbackQuestions, createdAt: new Date() },
        { new: true, upsert: true }
      );
      
      return res.status(200).json(bank);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Gemini API exists, let's call it!
  const prompt = `
Generate a structured, professional set of interview questions for the job role: "${jobTitle}".
You must generate EXACTLY the following questions divided into these categories:
- 10 Easy questions (technical basics and concepts)
- 10 Medium questions (intermediate architecture, frameworks, algorithms)
- 10 Hard questions (deep optimization, advanced scaling, math derivation, low-level details)
- 5 Scenario Based questions (incident response, system design situations, debugging challenges)
- 5 Behavioral questions (communication, teamwork, mentorship, handling technical disputes)

Format the output strictly as a valid JSON object matching this schema:
{
  "questions": [
    { "text": "Question text here", "category": "Easy" },
    { "text": "Question text here", "category": "Medium" },
    { "text": "Question text here", "category": "Hard" },
    { "text": "Question text here", "category": "Scenario" },
    { "text": "Question text here", "category": "Behavioral" }
  ]
}

Important Rules:
1. Return ONLY the raw JSON object. Do not wrap the JSON object inside markdown code block formatting (e.g. do not use \`\`\`json ... \`\`\`).
2. Make the question texts highly specific to "${jobTitle}" and its typical technical requirements.
3. Ensure you return exactly 40 questions in total, adhering to the requested splits.
4. The category property values must be exactly 'Easy', 'Medium', 'Hard', 'Scenario', or 'Behavioral'.
`;

  try {
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    
    // We import dynamically or use global fetch if available. In Node 18+ global fetch is available.
    // Let's use the native fetch if available, else import dynamic node-fetch.
    const httpFetch = typeof fetch === 'function' ? fetch : (await import('node-fetch')).default;
    
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
      throw new Error(`Gemini API returned status ${response.status}: ${errText}`);
    }

    const resJson = await response.json();
    const resultText = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!resultText) {
      throw new Error('Gemini API returned an empty candidate text block');
    }

    // Clean JSON response (strip markdown wrappers if model disobeyed instructions)
    let cleanedText = resultText.trim();
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
    }

    const parsedData = JSON.parse(cleanedText);
    if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
      throw new Error('Parsed response does not contain a questions array');
    }

    // Validate and clean categories
    const validatedQuestions = parsedData.questions.map(q => {
      let category = q.category || 'Easy';
      if (category === 'Scenario Based') category = 'Scenario';
      if (!['Easy', 'Medium', 'Hard', 'Scenario', 'Behavioral'].includes(category)) {
        category = 'Easy';
      }
      return {
        text: q.text || 'Tell us about your technical experience.',
        category
      };
    });

    // Upsert database
    const bank = await QuestionBank.findOneAndUpdate(
      { jobTitle },
      { questions: validatedQuestions, createdAt: new Date() },
      { new: true, upsert: true }
    );

    res.status(200).json(bank);

  } catch (err) {
    console.error(`Gemini generation failed: ${err.message}. Falling back to sample questions list...`);
    try {
      // Fallback on fail
      const fallbackQuestions = generateFallbackQuestions(jobTitle);
      const bank = await QuestionBank.findOneAndUpdate(
        { jobTitle },
        { questions: fallbackQuestions, createdAt: new Date() },
        { new: true, upsert: true }
      );
      res.status(200).json(bank);
    } catch (dbErr) {
      res.status(500).json({ message: dbErr.message });
    }
  }
});

module.exports = router;
