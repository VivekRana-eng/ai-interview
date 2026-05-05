# AI-Based Selection Application — Full System Design

> **Purpose:** Single source of truth for SelectAI. Covers both Phase 0 (mock demo)
> and Phase 1 (production). Windsurf reads this alongside the rules files.
> HTML design files in frontend/design/ are the visual reference — adapt logic to match
> this document, not the HTML.

---

## 0. Build Strategy — Two Phases

### Phase 0 — Mock Demo (build this first)
**Goal:** Working clickable demo that replicates the full UI workflow end-to-end.
Stakeholder sign-off before any backend work begins.

| Layer | Technology | Notes |
|---|---|---|
| Frontend | Next.js 14 + shadcn/ui + Tailwind | Converted from Claude Design HTML files |
| Database | Supabase | 4 tables — job_profiles, applications, interview_answers, audit_log |
| Storage | Supabase Storage | bucket: "resumes" — real PDF upload |
| Auth | Supabase Auth | Admin login only |
| AI | MOCKED | Hardcoded realistic responses — no real API calls |
| Email | console.log only | Print email content to terminal, don't send |
| Backend | None | No FastAPI yet |

**What works in Phase 0:**
- Admin creates job profiles → saved to Supabase
- Candidate browses jobs, fills form, uploads PDF → saved to Supabase
- Screening score computed using real formula with mocked resume extraction
- Candidate receives status tracking link (mock email logged to console)
- Candidate joins interview → cycles through mock questions → answers stored to Supabase
- Admin dashboard reads real data from Supabase
- Merit list computed using real formula from Supabase data
- Result emails logged to console

**What is mocked:**
- Resume parsing (returns hardcoded extracted profile)
- SOP grading (returns hardcoded score)
- Skill embeddings / cosine similarity (returns hardcoded similarity score)
- Interview question generation (cycles through MOCK_QUESTIONS array)
- Answer scoring (returns random 6-9 with plausible rationale)
- All SMTP sends (console.log instead)

---

### Phase 1 — Production (after demo approved)
Switch `NEXT_PUBLIC_APP_MODE=mock` → `live` in `.env.local`
Update `.windsurfrules` CURRENT MODE line.
Replace mock blocks in `lib/api.ts` with FastAPI calls.
Build FastAPI backend per Section 14 prompts.

| Layer | Technology |
|---|---|
| Frontend | Same Next.js app — zero component changes |
| Database | PostgreSQL 15 (NIC hosted) |
| Storage | TBD — S3-compatible or NIC storage |
| Backend | FastAPI + PydanticAI + Groq |
| AI | Real Groq calls, HF embeddings, OpenRouter fallback |
| Email | smtplib + Jinja2 HTML templates |

---

## 1. What We Are Building

A unified, end-to-end AI-powered internship selection platform for a Government of India
organisation (based on RFP DGTS/E/SM/3/2025). Replaces fragmented manual process with:

| Module | What it does |
|---|---|
| Preliminary Screening | Auto-scores applications using resume parsing + formula |
| AI Interview | Adaptive conversational interview, one question at a time |
| Notification | SMTP emails at every stage transition |

Plus: automated merit lists, real-time admin dashboard, full audit trail, NIC-hosting ready.

---

## 2. Tech Stack

| Layer | Phase 0 | Phase 1 |
|---|---|---|
| Frontend | Next.js 14 + shadcn/ui + Tailwind | Same |
| Database | Supabase | PostgreSQL 15 + SQLAlchemy 2.0 async + Alembic |
| AI Framework | None (mocked) | PydanticAI + Instructor |
| AI Inference | None (mocked) | Groq API + OpenRouter fallback |
| Embeddings | None (mocked) | HF Serverless BAAI/bge-m3 |
| PDF Extraction | None (mocked) | pymupdf (local) |
| Email | console.log | smtplib + Jinja2 |
| Auth | Supabase Auth | JWT (python-jose + bcrypt) |

---

## 3. AI Model Army — Free, Zero Cost (Phase 1)

All via OpenAI-compatible endpoints. One client per provider.

| Task | Model | Provider |
|---|---|---|
| Resume extraction | llama-3.3-70b-versatile | Groq (free) |
| SOP grading | llama-3.3-70b-versatile | Groq (free) |
| Skill embeddings | BAAI/bge-m3 | HF Serverless (free CPU) |
| Interview Q generation | deepseek-r1-distill-llama-70b | Groq (free) |
| Answer scoring | llama-3.3-70b-versatile | Groq (free) |
| Email drafting | llama-3.1-8b-instant | Groq (free, 14.4k req/day) |
| All above fallback | openrouter/free | OpenRouter |

---

## 4. Frontend — All Pages

### 4.1 Candidate Portal (public, no auth)

| Route | Page | What It Contains | HTML reference |
|---|---|---|---|
| `/jobs` | Job listings | Grid of job cards, domain filter, search | jobs.html |
| `/jobs/[id]` | Job profile | Role detail, specs, Apply CTA | job-detail.html |
| `/jobs/[id]/apply` | Application form | PDF upload + 8 manual fields + SOP | apply.html |
| `/status/[token]` | Status tracker | **4 stages only** (see below), score if passed | status.html |
| `/interview/[token]` | Interview room | Adaptive chat, 10 Qs, timer, progress | interview.html |

**Status page — exactly 4 stages (not whatever HTML shows):**
1. Application Received
2. Screening — shows score if passed, "Not shortlisted" if failed
3. Interview — shows scheduled time if set, or "Pending"
4. Result — Selected / Waitlisted / Rejected

### 4.2 Admin Dashboard (Supabase Auth protected)

| Route | Page | What It Contains | HTML reference |
|---|---|---|---|
| `/admin` | Overview | KPI cards, pipeline funnel, recent activity | admin-dashboard.html |
| `/admin/jobs` | Job profiles | Table, create button, status badges | admin-dashboard.html (jobs section) |
| `/admin/jobs/create` | Create job | Form: title, domain, skills, CGPA, seats, deadline | (design to match system) |
| `/admin/applications` | All applications | Sortable/filterable table, score columns | admin-applications.html |
| `/admin/applications/[id]` | Candidate detail | Score breakdown, transcript, resume, notes | admin-application-detail.html |
| `/admin/merit-list` | Merit list | Ranked table per role, publish button | admin-merit-list.html |
| `/admin/notifications` | Notifications | Email log (console output in Phase 0) | (design to match system) |

### 4.3 Frontend File Structure

```
frontend/
├── app/
│   ├── jobs/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── apply/page.tsx
│   ├── status/[token]/page.tsx
│   ├── interview/[token]/page.tsx
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── jobs/
│   │   │   ├── page.tsx
│   │   │   └── create/page.tsx
│   │   ├── applications/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── merit-list/page.tsx
│   │   └── notifications/page.tsx
│   ├── layout.tsx
│   └── middleware.ts              ← protects /admin/* routes
├── components/
│   ├── ui/                        ← shadcn/ui primitives
│   ├── job-card.tsx
│   ├── application-form.tsx
│   ├── interview-chat.tsx
│   ├── status-tracker.tsx         ← exactly 4 stages
│   ├── score-breakdown.tsx        ← 5 components: skill/edu/exp/cert/sop
│   ├── candidate-table.tsx
│   └── merit-list-table.tsx
├── design/                        ← HTML reference files (do not edit)
│   ├── jobs.html
│   ├── job-detail.html
│   ├── apply.html
│   ├── status.html
│   ├── interview.html
│   ├── admin-dashboard.html
│   ├── admin-applications.html
│   ├── admin-application-detail.html
│   └── admin-merit-list.html
└── lib/
    ├── api.ts                     ← ALL API calls — mock + live in one file
    ├── supabase.ts                ← Supabase singleton client
    ├── auth.ts                    ← Auth helpers
    ├── mock-data.ts               ← All hardcoded mock data (keep separate)
    └── types.ts                   ← TypeScript types mirroring DB schema
```

### 4.4 lib/api.ts — The Core Pattern

```typescript
// lib/api.ts
import { supabase } from './supabase'
import { MOCK_JOBS, MOCK_QUESTIONS, mockScreeningResult } from './mock-data'
import type { Job, Application, InterviewQuestion, MeritEntry } from './types'

const MODE = process.env.NEXT_PUBLIC_APP_MODE as 'mock' | 'live'
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
    const file = formData.get('resume') as File
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
    // Write audit log
    await supabase.from('audit_log').insert({
      entity_type: 'application', entity_id: data.id,
      from_status: 'applied',
      to_status: mockScore.s_total >= 55 ? 'shortlisted' : 'rejected',
      actor: 'system', timestamp: new Date().toISOString()
    })
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
export async function startInterview(token: string) {
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
      const avg = answers!.reduce((s, a) => s + a.mock_score, 0) / answers!.length
      const interviewScore = Math.round(avg * 10)
      const { data: app } = await supabase.from('applications')
        .select('screening_score').eq('id', applicationId).single()
      const finalScore = Math.round((app!.screening_score * 0.40) + (interviewScore * 0.60))
      await supabase.from('applications').update({
        interview_score: interviewScore,
        final_score: finalScore,
        status: 'interviewed'
      }).eq('id', applicationId)
      await supabase.from('audit_log').insert({
        entity_type: 'application', entity_id: applicationId,
        from_status: 'shortlisted', to_status: 'interviewed',
        actor: 'system', timestamp: new Date().toISOString()
      })
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
    return data?.map((app, i) => ({
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

// ── HELPERS ───────────────────────────────────────────────────────
function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('admin_token') ?? '' : ''
}

const MOCK_RATIONALES = [
  "Adequate understanding but lacks depth in implementation details.",
  "Good conceptual knowledge with relevant examples provided.",
  "Strong answer demonstrating practical experience and clear reasoning.",
  "Excellent — precise, thorough, and demonstrated advanced understanding.",
]
```

### 4.5 lib/mock-data.ts — Keep all mock data here

```typescript
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
```

---

## 5. Supabase Setup (Phase 0)

### 5.1 Tables — run these in Supabase SQL editor

```sql
-- Job profiles (admin creates these)
create table job_profiles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  domain text not null,
  description text,
  required_skills jsonb default '[]',
  min_cgpa float default 0,
  min_exp_months int default 0,
  required_certs jsonb default '[]',
  seats int default 5,
  deadline date,
  status text default 'published',
  created_at timestamptz default now()
);

-- Applications
create table applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references job_profiles(id),
  candidate_name text not null,
  email text not null,
  phone text,
  institution text,
  cgpa float,
  degree text,
  experience_months int default 0,
  certifications jsonb default '[]',
  sop_text text,
  resume_url text,
  screening_score float,
  screening_components jsonb,
  interview_score float,
  final_score float,
  rank int,
  status text default 'applied',
  session_token uuid unique default gen_random_uuid(),
  created_at timestamptz default now()
);

-- Interview answers
create table interview_answers (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id),
  question_number int,
  question_text text,
  answer_text text,
  mock_score int,
  answer_time_seconds int,
  created_at timestamptz default now()
);

-- Audit log
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  entity_type text,
  entity_id uuid,
  from_status text,
  to_status text,
  actor text,
  timestamp timestamptz default now()
);
```

### 5.2 Storage
- Create bucket: `resumes`
- Enable: public bucket OFF, authenticated upload ON
- RLS policy: allow insert for authenticated users + anon (candidates aren't logged in)

### 5.3 Seed data
```sql
insert into job_profiles (title, domain, description, required_skills, min_cgpa, seats, deadline, status)
values
  ('AI/ML Engineering Intern', 'artificial_intelligence',
   'Work on AI systems for government data analysis.',
   '["Python", "Machine Learning", "TensorFlow", "NumPy"]', 7.5, 8, '2026-05-31', 'published'),
  ('Software Development Intern', 'software_development',
   'Build backend APIs and microservices for digital governance.',
   '["Python", "FastAPI", "PostgreSQL", "Docker"]', 7.0, 12, '2026-05-31', 'published'),
  ('Cybersecurity Intern', 'cybersecurity',
   'Security auditing and penetration testing for government systems.',
   '["Network Security", "Linux", "Python", "OWASP"]', 7.0, 5, '2026-06-15', 'published');
```

---

## 6. Scoring Formula (Phase 0 — computed in mock-data.ts, Phase 1 — computed in backend)

```
S_screen = s_skill(0-35) + s_edu(0-25) + s_exp(0-20) + s_cert(0-10) + s_sop(0-10)
Threshold: S_screen >= 55 → shortlisted

S_interview = mean(answer_scores[0..9]) × 10   (scores 0-10, result 0-100)

S_final = (S_screen × 0.40) + (S_interview × 0.60)
```

These formulas never change between Phase 0 and Phase 1.
In Phase 0: s_skill, s_sop computed from hardcoded values in mock-data.ts
In Phase 1: s_skill from bge-m3 cosine similarity, s_sop from Llama 3.3 70B

---

## 7. Pipeline Stages — Candidate View

Exactly 4 stages. No more. No less. Status page shows these 4:

| Stage | Status value in DB | What candidate sees |
|---|---|---|
| 1. Application Received | `applied` | Green check, timestamp |
| 2. Screening | `shortlisted` or `rejected` | Score if shortlisted, reason if rejected |
| 3. Interview | `shortlisted` → `interviewed` | Scheduled time and link, or "Completed" |
| 4. Result | `selected` / `waitlisted` / `rejected` | Final outcome with message |

---

## 8. Windsurf Session 1 Opener

Paste this as the very first message:

```
Read these files before doing anything:
1. AI_Selection_System_Design.md
2. .windsurfrules
3. .windsurf/rules/general.md
4. .windsurf/rules/mock-live.md
5. .windsurf/rules/frontend.md

We are in Phase 0 — mock demo mode.
Confirm you understand by telling me:
- What mode we are in and what that means
- What the 3 Supabase tables are
- What gets mocked vs what is real
- The 4 candidate pipeline stages
- How lib/api.ts is structured

Do not write any code yet.
```

---

## 9. Phase 0 Build Order for Windsurf

### Session 2 — Supabase + project scaffold
```
We confirmed understanding. Now begin Phase 0 build.

1. Scaffold Next.js 14 project in /frontend with TypeScript strict,
   Tailwind CSS, shadcn/ui. Use App Router.
2. Install dependencies: @supabase/supabase-js, react-hook-form, zod
3. Create frontend/lib/supabase.ts — singleton Supabase client
   using NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Create frontend/lib/types.ts — TypeScript interfaces for:
   Job, Application, InterviewAnswer, AuditLog, MeritEntry
   (mirror the Supabase table schemas from Section 5 of the MD)
5. Create frontend/lib/mock-data.ts — exactly as specified in Section 4.5
6. Create frontend/lib/api.ts — full implementation as specified in Section 4.4
7. Create .env.local from .env.example with NEXT_PUBLIC_APP_MODE=mock
8. Do not build any pages yet.
```

### Session 3 — Candidate pages
```
Supabase and lib files confirmed working.
Now build the 3 candidate-facing pages.

For each page:
- Open the matching HTML file in frontend/design/ as visual reference
- Convert to Next.js + shadcn/ui + Tailwind preserving the visual design
- Wire all interactions to lib/api.ts functions (never call Supabase directly)
- Adapt logic to match AI_Selection_System_Design.md — not the HTML

Build in this order:
1. /jobs — reads getJobs(), displays job cards with domain badges
2. /jobs/[id] — reads getJob(id), shows specs and Apply CTA
3. /jobs/[id]/apply — application form with PDF upload + 8 fields + SOP,
   calls submitApplication() on submit, shows confirmation with status link
4. /status/[token] — calls getStatus(token) every 30s,
   shows EXACTLY 4 stages as defined in Section 7 of the MD
```

### Session 4 — Interview room
```
Candidate pages confirmed working end-to-end.
Now build /interview/[token].

Reference: interview.html in frontend/design/
Logic from Section 4.1 of AI_Selection_System_Design.md:
- Validate token on load via startInterview(token)
- Show one question at a time — never reveal next question
- Textarea for answer, word count below, Submit button
- Timer: 90 minutes countdown, turns amber < 10 min, red < 3 min
- Progress indicator: Q3 of 10
- Track answer_time_seconds per answer
- On submit: call submitAnswer(), show next question or completion screen
- Completion screen: thank you message, no buttons
- Anti-cheat: block paste on textarea, no back navigation
```

### Session 5 — Admin dashboard
```
Interview confirmed working. Now build admin pages.

Supabase Auth setup first:
- Create admin user in Supabase Auth dashboard manually
- Add middleware.ts to protect all /admin/* routes
- Add /admin/login page with email + password form

Then build admin pages in order:
1. /admin — KPI cards + pipeline funnel + recent activity (reads from Supabase)
2. /admin/jobs — table of job_profiles, create button
3. /admin/jobs/create — form that inserts to job_profiles table
4. /admin/applications — sortable filterable table, calls getApplications()
5. /admin/applications/[id] — score breakdown + interview transcript + status change
6. /admin/merit-list — calls getMeritList(jobId), publish button calls publishResults()
7. /admin/notifications — shows audit_log as email log (console.log entries)

Reference the HTML files in frontend/design/ for visual layout.
Adapt columns and data to match Section 4.2 of the MD exactly.
```

---

## 10. Phase 1 Prompts (FastAPI — run after demo approved)

[All content from the original Section 14 remains here — Prompts 1-6]

### Prompt 1 — FastAPI scaffold
```
We are switching to Phase 1. Update .windsurfrules CURRENT MODE to LIVE.

Create FastAPI project in /backend. Python 3.11, SQLAlchemy 2.0 async
with asyncpg, Alembic for migrations, pydantic-settings for config,
python-jose + passlib for JWT auth.
Folder structure per AI_Selection_System_Design.md Section 5 (backend/).
Generate requirements.txt, Dockerfile, docker-compose.yml (postgres + api).
Create .env from .env.example. Do not write business logic yet.
```

### Prompt 2 — ORM models
```
Create SQLAlchemy async ORM models: job_profiles, candidates, applications
(resume_profile JSONB, screening_components JSONB, s_screen, s_interview,
s_final, rank, status), interview_sessions (session_token unique, conversation
JSONB, answer_scores JSONB), interview_answers (question_number, answer_text,
score, answer_time_seconds, suspicious_timing bool), audit_log, users.
Alembic init + first migration. Indexes on: applications.status,
applications.job_id, interview_sessions.session_token.
```

### Prompt 3 — Pydantic AI schemas
```
In backend/app/ai_schemas/schemas.py implement all Pydantic v2 models:
ResumeProfile, Education, WorkExperience, SOPScore, ScoreComponents,
ScreeningResult (with component sum validator), InterviewQuestion,
AnswerScore (with quality-score consistency validator), MeritEntry
(with formula validator), EmailDraft.
Write pytest tests covering: valid inputs, boundary values, validator rejection.
```

### Prompt 4 — Screening engine
```
In backend/app/services/screening_engine.py implement pure-Python scoring:
compute_s_skill (cosine similarity via numpy, 0-35), compute_s_edu
(CGPA 0-15 + tier 10/6/2 = max 25), compute_s_exp (ratio × 20),
compute_s_cert (matched/required × 10), compute_total, build_screening_result.
In backend/app/services/resume_parser.py: pymupdf text extraction +
Llama 3.3 70B via Groq + PydanticAI → ResumeProfile.
Build POST /api/v1/applications endpoint.
Then update lib/api.ts: replace mock blocks with FastAPI fetch calls.
Keep all function signatures identical.
```

### Prompt 5 — Interview engine
```
In backend/app/services/interview_engine.py: adaptive interview engine
using DeepSeek R1 70B via Groq. Prompt = base_interviewer.txt + domain file
+ candidate skills + topics_covered + current_difficulty + questions_remaining.
Difficulty rules: score 0-3 → easy, 4-7 → medium, 8-10 → hard.
In backend/app/services/answer_scorer.py: Llama 3.3 70B strict=true → AnswerScore.
Build /api/v1/interview/start, /answer, /end endpoints.
Store answer_time_seconds, suspicious_timing=true if < 8 seconds.
Update lib/api.ts interview functions to use FastAPI.
```

### Prompt 6 — Merit list + admin APIs
```
In backend/app/services/merit_list.py:
compute_final_score = s_screen×0.40 + s_interview×0.60,
rank_candidates(job_id) → sorted MeritEntry list,
assign_outcomes(entries, seats) → top N selected, next ceil(N×0.3) waitlisted.
Build GET /api/v1/admin/merit-list, /export (CSV),
POST /api/v1/admin/merit-list/publish (bulk emails + audit_log writes).
Build GET /api/v1/admin/dashboard KPI counts.
Update lib/api.ts admin functions to use FastAPI.
```

---

## 11. Environment Variables

```env
NEXT_PUBLIC_APP_MODE=mock
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_API_URL=http://localhost:8000
GROQ_API_KEY=gsk_...
OPENROUTER_API_KEY=sk-or-...
HF_API_KEY=hf_...
JWT_SECRET=minimum-32-chars
JWT_EXPIRE_MINUTES=60
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your-app-password
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/selection_db
SCREENING_THRESHOLD=55
CORS_ORIGINS=http://localhost:3000
```

---

## 12. API Endpoints Reference

### Phase 0 — all handled by lib/api.ts calling Supabase directly
### Phase 1 — FastAPI endpoints

Public:
```
GET  /api/v1/jobs
GET  /api/v1/jobs/{id}
POST /api/v1/applications          multipart: PDF + fields
GET  /api/v1/status/{token}
POST /api/v1/interview/start       body: { session_token }
POST /api/v1/interview/answer      body: { session_token, answer, answer_time_seconds }
```

Admin (JWT required):
```
GET  /api/v1/admin/applications    ?job_id= &status= &min_score= &max_score=
GET  /api/v1/admin/applications/{id}
POST /api/v1/screening/run/{id}
GET  /api/v1/admin/merit-list      ?job_id=
GET  /api/v1/admin/merit-list/export
POST /api/v1/admin/merit-list/publish
GET  /api/v1/admin/dashboard
```

---

## 13. MCP Servers — Install in Windsurf Marketplace

| MCP | Purpose | Install |
|---|---|---|
| Supabase (official ✅) | Cascade manages tables, storage, auth directly | Marketplace → OAuth login |
| GitHub (official ✅) | Git operations without terminal | Marketplace → PAT |
| Playwright (official ✅) | Browser testing of all 7 pages end-to-end | Marketplace |
| Context7 (official ✅) | Live docs for Next.js, Supabase, FastAPI, PydanticAI | Marketplace |
| PostgreSQL | Phase 1 only — swap Supabase MCP for this | Marketplace |

Scope Supabase MCP to your specific project_ref immediately after connecting.

---

*Phase 0 target: working demo in 5 Windsurf sessions.*
*Phase 1 target: production-ready system in 6 additional sessions.*
