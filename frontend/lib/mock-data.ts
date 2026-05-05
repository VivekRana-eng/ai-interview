// lib/mock-data.ts — all hardcoded mock data lives here, nowhere else

export const MOCK_QUESTIONS = [
  "Tell me about a technical project you've worked on recently. What was your role?",
  "Explain the concept of RESTful APIs. How have you used them in practice?",
  "How would you approach debugging a performance issue in a web application?",
  "What is the difference between synchronous and asynchronous programming?",
  "Describe a situation where you had to learn a new technology quickly.",
  "How do you ensure code quality in your projects?",
  "Explain how you would design a database schema for a user authentication system.",
  "What are the trade-offs between SQL and NoSQL databases?",
  "How does version control help in team collaboration? Describe your Git workflow.",
  "Where do you see AI/ML being most impactful in government services?",
]

export function mockScreeningResult() {
  // Uses real formula with realistic hardcoded component values
  const s_skill = 26.4   // cosine sim mock
  const s_edu   = 21.5   // CGPA 8.7 + Tier1 institution
  const s_exp   = 14.0   // 8 months / 12 required
  const s_cert  = 7.0    // 1 of 2 required certs matched
  const s_sop   = 7.2    // LLM mock grade
  return {
    s_total: Math.round(s_skill + s_edu + s_exp + s_cert + s_sop),
    components: { s_skill, s_edu, s_exp, s_cert, s_sop }
  }
}

export const MOCK_RATIONALES = [
  "Adequate understanding but lacks depth in implementation details.",
  "Good conceptual knowledge with relevant examples provided.",
  "Strong answer demonstrating practical experience and clear reasoning.",
  "Excellent — precise, thorough, and demonstrated advanced understanding.",
]
