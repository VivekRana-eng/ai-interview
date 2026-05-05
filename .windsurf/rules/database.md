---
trigger: always_on
priority: high
---

# Database Conventions

## Phase 0 — Supabase
Client: @supabase/supabase-js
File: frontend/lib/supabase.ts (singleton client)
Auth: Supabase Auth for admin only
Storage: bucket "resumes" — authenticated upload, public read via signed URL
Tables: job_profiles, applications, interview_answers, audit_log
Schema: defined in .windsurf/rules/mock-live.md

Supabase rules:
- Always use the singleton client from lib/supabase.ts
- Never create a new client inline in components
- RLS: enable on all tables — admin role can read all, anon can insert applications only
- Storage: never expose service role key to frontend — use anon key + RLS policy
- Signed URLs for resume access: 1 hour expiry

## Phase 1 — PostgreSQL + SQLAlchemy (when CURRENT MODE = LIVE)
- Always: async with get_session() as db
- Never: .query() — use select() always
- Never: sync session — always AsyncSession
- Indexes on: applications.status, applications.job_id, sessions.session_token

Migration rules (Phase 1):
- Every schema change = new Alembic migration file
- Never edit existing migrations
- Name format: YYYY_MM_DD_short_description.py

## Audit log — both phases
Phase 0: write to Supabase audit_log table
Phase 1: write to PostgreSQL audit_log table via SQLAlchemy
In both cases: write immediately on every status change, never batch or defer
