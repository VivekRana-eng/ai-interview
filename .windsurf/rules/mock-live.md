---
trigger: always_on
priority: highest
---

# Mock vs Live Pattern — Read This Every Session

## The core mechanism
One environment variable controls everything:
  NEXT_PUBLIC_APP_MODE=mock   ← Phase 0: demo, Supabase, mocked AI
  NEXT_PUBLIC_APP_MODE=live   ← Phase 1: production, FastAPI backend

## The golden rule
Function signatures in lib/api.ts NEVER change between phases.
Only the implementation inside mock blocks changes.
Components call api.ts functions — they never know which mode they're in.

## How every api.ts function is structured

```typescript
export async function exampleFunction(param: string): Promise<ReturnType> {
  if (isMock()) {
    // MOCK IMPLEMENTATION
    // Use Supabase client, hardcoded data, or simulated responses
    // Always add realistic fake latency: await delay(400)
    return mockData
  }
  // LIVE IMPLEMENTATION (Phase 1)
  // Direct fetch to FastAPI
  return fetch(`${API}/api/v1/endpoint`, { ... }).then(r => r.json())
}
```

## Mock implementations must be realistic
- Fake latency: always await delay(300-800ms) to simulate real API calls
- Realistic data: use plausible names, scores, institutions — not "test" or "foo"
- Screening scores: generate as formula result not random (so UI shows real score breakdown)
- Interview: cycle through MOCK_QUESTIONS array, return plausible scores (6-9 range)
- Emails: console.log the email content instead of sending — log clearly "📧 EMAIL SENT TO:"

## Supabase in mock mode (real DB, mocked AI)
- Supabase IS a real database in Phase 0 — data actually persists
- Only the AI scoring/interview is mocked
- Resume PDF upload: real — goes to Supabase Storage bucket "resumes"
- Application form: real — saved to Supabase applications table
- Interview Q&A: questions are mocked, answers are stored real in interview_answers table
- Admin dashboard: reads real data from Supabase

## The 3 Supabase tables for Phase 0

job_profiles:
  id, title, domain, description, required_skills (jsonb),
  min_cgpa, min_exp_months, required_certs (jsonb),
  seats, deadline, status, created_at

applications:
  id, job_id (fk), candidate_name, email, phone,
  institution, cgpa, degree, experience_months,
  certifications (jsonb), sop_text, resume_url,
  screening_score, screening_components (jsonb),
  interview_score, final_score, rank,
  status, session_token, created_at

interview_answers:
  id, application_id (fk), question_number, question_text,
  answer_text, mock_score, answer_time_seconds,
  created_at

audit_log:
  id, entity_type, entity_id, from_status,
  to_status, actor, timestamp

## Switching to live — the exact process
When .windsurfrules says CURRENT MODE: LIVE:
1. Change NEXT_PUBLIC_APP_MODE to 'live' in .env.local
2. Replace mock blocks in lib/api.ts with FastAPI fetch calls
3. Keep ALL function signatures identical
4. Remove Supabase client imports from api.ts (keep only in auth if needed)
5. Do not touch any component files
6. Start FastAPI backend per Section 14 of AI_Selection_System_Design.md
