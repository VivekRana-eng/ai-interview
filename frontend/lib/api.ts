// lib/api.ts
import { supabase } from './supabase'
import { MOCK_QUESTIONS, mockScreeningResult, MOCK_RATIONALES } from './mock-data'
import type { Job, Application, InterviewSession } from './types'

// Default to mock mode locally so builds work without backend/env setup.
const MODE = (process.env.NEXT_PUBLIC_APP_MODE ?? 'mock') as 'mock' | 'live'
const API  = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const isMock = () => MODE === 'mock'
const delay  = (ms: number) => new Promise(r => setTimeout(r, ms))

// ── JOBS ──────────────────────────────────────────────────────────
export async function getJobs(domain?: string): Promise<Job[]> {
  if (isMock()) {
    await delay(400)
    const { data } = await supabase.from('job_profiles')
      .select('*').eq('status', 'published')
    return data ?? []
  }
  const params = domain ? `?domain=${domain}` : ''
  return fetch(`${API}/api/v1/jobs${params}`).then(r => r.json())
}

export async function getJob(id: string): Promise<Job> {
  if (isMock()) {
    const { data } = await supabase.from('job_profiles')
      .select('*').eq('id', id).single()
    return data
  }
  return fetch(`${API}/api/v1/jobs/${id}`).then(r => r.json())
}

// ── APPLICATIONS ──────────────────────────────────────────────────
export async function submitApplication(jobId: string, formData: FormData) {
  if (isMock()) {
    await delay(600)
    // Upload PDF to Supabase Storage
    const file = formData.get('resume') as File | null
    if (!file || !(file instanceof File)) throw new Error('Resume file is required')
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`
    const { data: upload, error: uploadError } = await supabase.storage
      .from('resumes').upload(filename, file)
    if (uploadError) throw uploadError
    // Mock screening score using real formula with hardcoded extracted profile
    const mockScore = mockScreeningResult()
    const token = crypto.randomUUID()
    // Save application to Supabase
    const { data, error } = await supabase.from('applications').insert({
      job_id: jobId,
      candidate_name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      institution: formData.get('institution'),
      cgpa: parseFloat(formData.get('cgpa') as string),
      degree: formData.get('degree'),
      experience_months: parseInt(formData.get('experience_months') as string),
      certifications: JSON.parse(formData.get('certifications') as string || '[]'),
      sop_text: formData.get('sop_text'),
      resume_url: upload?.path,
      screening_score: mockScore.s_total,
      screening_components: mockScore.components,
      status: mockScore.s_total >= 55 ? 'shortlisted' : 'rejected',
      session_token: token,
    }).select().single()
    if (error) throw error
    // Mock email log
    console.log(`📧 EMAIL: ${mockScore.s_total >= 55 ? 'SHORTLIST' : 'REJECTION'} email to ${formData.get('email')}`)
    // Write audit log (best-effort in mock mode; anon may lack RLS write permission)
    try {
      await supabase.from('audit_log').insert({
        entity_type: 'application', entity_id: data.id,
        from_status: 'applied',
        to_status: mockScore.s_total >= 55 ? 'shortlisted' : 'rejected',
        actor: 'system', timestamp: new Date().toISOString()
      })
    } catch {
      console.warn('Audit log write skipped — RLS policy blocks anon writes')
    }
    return { success: true, token, applicationId: data.id }
  }
  return fetch(`${API}/api/v1/applications`, { method: 'POST', body: formData }).then(r => r.json())
}

export async function getStatus(token: string) {
  if (isMock()) {
    const { data } = await supabase.from('applications')
      .select('*, job_profiles(title, domain)').eq('session_token', token).single()
    return data
  }
  return fetch(`${API}/api/v1/status/${token}`).then(r => r.json())
}

// ── INTERVIEW ─────────────────────────────────────────────────────
export async function startInterview(token: string): Promise<InterviewSession> {
  if (isMock()) {
    await delay(500)
    // Validate token
    const { data: app } = await supabase.from('applications')
      .select('*').eq('session_token', token)
      .eq('status', 'shortlisted').single()
    if (!app) throw new Error('Invalid or expired interview token')
    // Return first mock question
    return {
      sessionId: token,
      applicationId: app.id,
      question: MOCK_QUESTIONS[0],
      questionNumber: 1,
      totalQuestions: 10,
    }
  }
  return fetch(`${API}/api/v1/interview/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_token: token }),
  }).then(r => r.json())
}

export async function submitAnswer(
  sessionToken: string,
  applicationId: string,
  questionNumber: number,
  questionText: string,
  answer: string,
  answerTimeSeconds: number,
) {
  if (isMock()) {
    await delay(700)
    // Store answer to Supabase
    const mockScore = Math.floor(Math.random() * 4) + 6 // 6-9
    await supabase.from('interview_answers').insert({
      application_id: applicationId,
      question_number: questionNumber,
      question_text: questionText,
      answer_text: answer,
      mock_score: mockScore,
      answer_time_seconds: answerTimeSeconds,
    })
    const isLast = questionNumber >= 10
    // If last question, compute and store interview score
    if (isLast) {
      const { data: answers } = await supabase.from('interview_answers')
        .select('mock_score').eq('application_id', applicationId)
      const avg = answers!.reduce((s: number, a: { mock_score: number }) => s + a.mock_score, 0) / answers!.length
      const interviewScore = Math.round(avg * 10)
      const { data: app } = await supabase.from('applications')
        .select('screening_score').eq('id', applicationId).single()
      const finalScore = Math.round((app!.screening_score * 0.40) + (interviewScore * 0.60))
      const { error: updateError } = await supabase.from('applications').update({
        interview_score: interviewScore,
        final_score: finalScore,
        status: 'interviewed'
      }).eq('id', applicationId)
      if (updateError) {
        console.error('Failed to update application scores:', updateError)
        throw new Error('Failed to save interview results')
      }
      try {
        await supabase.from('audit_log').insert({
          entity_type: 'application', entity_id: applicationId,
          from_status: 'shortlisted', to_status: 'interviewed',
          actor: 'system', timestamp: new Date().toISOString()
        })
      } catch {
        console.warn('Audit log write skipped — RLS policy blocks anon writes')
      }
    }
    return {
      score: mockScore,
      rationale: MOCK_RATIONALES[mockScore - 6],
      nextQuestion: isLast ? null : MOCK_QUESTIONS[questionNumber],
      nextQuestionNumber: isLast ? null : questionNumber + 1,
      isComplete: isLast,
    }
  }
  return fetch(`${API}/api/v1/interview/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_token: sessionToken, answer, answer_time_seconds: answerTimeSeconds }),
  }).then(r => r.json())
}

// ── ADMIN ─────────────────────────────────────────────────────────
export async function getApplications(filters?: {
  jobId?: string, status?: string, minScore?: number, maxScore?: number
}) {
  if (isMock()) {
    let query = supabase.from('applications').select('*, job_profiles(title, domain)')
    if (filters?.jobId) query = query.eq('job_id', filters.jobId)
    if (filters?.status) query = query.eq('status', filters.status)
    const { data } = await query.order('final_score', { ascending: false })
    return data ?? []
  }
  const params = new URLSearchParams(filters as Record<string, string>)
  return fetch(`${API}/api/v1/admin/applications?${params}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  }).then(r => r.json())
}

export async function getMeritList(jobId: string) {
  if (isMock()) {
    const { data } = await supabase.from('applications')
      .select('*, job_profiles(title)')
      .eq('job_id', jobId).eq('status', 'interviewed')
      .order('final_score', { ascending: false })
    // Assign ranks and outcomes
    const seats = data?.[0] ? 5 : 0 // mock: top 5 selected
    return data?.map((app: any, i: number) => ({
      ...app,
      rank: i + 1,
      outcome: i < seats ? 'selected' : i < seats + 3 ? 'waitlisted' : 'rejected'
    })) ?? []
  }
  return fetch(`${API}/api/v1/admin/merit-list?job_id=${jobId}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  }).then(r => r.json())
}

export async function publishResults(jobId: string) {
  if (isMock()) {
    const list = await getMeritList(jobId)
    for (const entry of list) {
      await supabase.from('applications').update({
        status: entry.outcome, rank: entry.rank
      }).eq('id', entry.id)
      console.log(`📧 EMAIL: RESULT (${entry.outcome.toUpperCase()}) to ${entry.email}`)
      await supabase.from('audit_log').insert({
        entity_type: 'application', entity_id: entry.id,
        from_status: 'interviewed', to_status: entry.outcome,
        actor: 'admin', timestamp: new Date().toISOString()
      })
    }
    return { success: true, count: list.length }
  }
  return fetch(`${API}/api/v1/admin/merit-list/publish`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ job_id: jobId }),
  }).then(r => r.json())
}

// ── AUTH ──────────────────────────────────────────────────────────
export async function signInAdmin(email: string, password: string) {
  if (isMock()) {
    await delay(300)
    // Mock admin login — accepts any credentials in Phase 0
    const mockToken = 'mock-admin-token-' + Date.now()
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', mockToken)
    }
    return { user: { email }, session: { access_token: mockToken } }
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  if (data.session?.access_token && typeof window !== 'undefined') {
    localStorage.setItem('admin_token', data.session.access_token)
  }
  return data
}

export async function signOutAdmin() {
  if (isMock()) {
    await delay(200)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token')
    }
    return
  }
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_token')
  }
}

// ── HELPERS ───────────────────────────────────────────────────────
function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('admin_token') ?? '' : ''
}
