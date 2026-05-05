export interface Job {
  id: string
  title: string
  domain: string
  description: string | null
  required_skills: string[]
  min_cgpa: number
  min_exp_months: number
  required_certs: string[]
  seats: number
  deadline: string | null
  status: string
  created_at: string
}

export interface Application {
  id: string
  job_id: string
  candidate_name: string
  email: string
  phone: string | null
  institution: string | null
  cgpa: number | null
  degree: string | null
  experience_months: number
  certifications: string[]
  sop_text: string | null
  resume_url: string | null
  screening_score: number | null
  screening_components: {
    s_skill: number
    s_edu: number
    s_exp: number
    s_cert: number
    s_sop: number
  } | null
  interview_score: number | null
  final_score: number | null
  rank: number | null
  status: string
  session_token: string
  created_at: string
  job_profiles?: {
    title: string
    domain: string
  }
}

export interface InterviewAnswer {
  id: string
  application_id: string
  question_number: number
  question_text: string
  answer_text: string
  mock_score: number
  answer_time_seconds: number
  created_at: string
}

export interface AuditLog {
  id: string
  entity_type: string
  entity_id: string
  from_status: string | null
  to_status: string | null
  actor: string
  timestamp: string
}

export interface MeritEntry extends Application {
  rank: number
  outcome: 'selected' | 'waitlisted' | 'rejected'
}

export interface InterviewQuestion {
  question: string
  questionNumber: number
  totalQuestions: number
}

export interface InterviewSession {
  sessionId: string
  applicationId: string
  question: string
  questionNumber: number
  totalQuestions: number
}
