---
trigger: always_on
priority: high
---

# Frontend Conventions

## Stack
Next.js 14 App Router, TypeScript strict, shadcn/ui, Tailwind CSS, Supabase JS client

## Core rules
- ALL API calls in lib/api.ts only — never inline fetch or supabase calls in components
- ALL types in lib/types.ts — mirrors DB schema exactly
- Supabase client in lib/supabase.ts — imported only by lib/api.ts and lib/auth.ts
- JWT / session auth in middleware.ts for all /admin/* routes
- Candidate routes use tokenised URLs — no login, no session required

## Routing structure
/jobs                         public
/jobs/[id]                    public
/jobs/[id]/apply              public
/status/[token]               public — poll every 30s
/interview/[token]            public — one-time token, invalidated on first load
/admin                        protected
/admin/jobs                   protected
/admin/jobs/create            protected
/admin/applications           protected
/admin/applications/[id]      protected
/admin/merit-list             protected
/admin/notifications          protected

## HTML design files — how to use them
- Open the matching .html file from frontend/design/ as visual reference
- Extract: layout structure, colour values, component hierarchy, spacing
- Convert to Next.js + shadcn/ui + Tailwind — do not copy raw HTML
- Adapt logic to match system spec — do not blindly replicate HTML structure
- Specific adaptations required:
  * Status page: use exactly 4 stages (Applied, Screened, Interview, Result)
    not whatever number the HTML shows
  * Interview page: no back button, no question preview, server-side questions only
  * Admin applications table: columns per Section 12 of MD, not HTML columns
  * Score breakdown: show 5 components (skill/edu/exp/cert/sop) matching formula
  * Merit list: show S_screen, S_interview, S_final, rank, outcome — in that order

## Component rules
- shadcn/ui components only — no other UI library
- Tailwind classes only — no inline styles unless unavoidable
- Mobile-first for: /jobs, /apply, /status, /interview
- Desktop-first for: all /admin/* routes
- Named exports for all components (not default)
- PascalCase for component file names

## State management
- Server components where possible (data fetching)
- Client components only when: interactivity, real-time polling, form state
- No external state library (no Zustand, no Redux) — React state + URL params sufficient
- Interview chat: client component, local state for conversation history

## Forms
- React Hook Form + Zod validation
- Never use HTML <form> submit — always onSubmit handler
- Application form: validate before calling api.ts submitApplication()
- Admin forms: same pattern

## Real-time / polling
- Status page: poll GET /status/[token] every 30 seconds using setInterval
- Interview page: no polling — push model (submit answer → get next Q)
- Admin dashboard: manual refresh button, no auto-poll
