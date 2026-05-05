---
trigger: always_on
priority: highest
---

# Project Overview

SelectAI is a government internship selection platform replacing a fragmented
manual process with three automated modules: Screening, AI Interview, Notification.

## Two surfaces
- Candidate portal: public, no login, tokenised URLs for status + interview
- Admin dashboard: JWT protected, role = admin or reviewer

## Stack
- Frontend: Next.js 14 App Router, TypeScript strict, shadcn/ui, Tailwind CSS
- Mock DB: Supabase (Phase 0)
- Prod DB: PostgreSQL 15 + SQLAlchemy 2.0 async (Phase 1)
- AI: Groq API primary, OpenRouter fallback, HF Serverless embeddings (Phase 1 only)
- Email: smtplib + Jinja2 (Phase 1 only — mock sends console.log in Phase 0)

## File locations
- Full system spec: AI_Selection_System_Design.md
- HTML design files: frontend/design/*.html (visual reference only)
- Frontend app: frontend/
- Backend: backend/ (Phase 1)
- Supabase client: frontend/lib/supabase.ts
- All API calls: frontend/lib/api.ts (single source of truth)
- Types: frontend/lib/types.ts (mirrors DB schema)

## HTML design files — important rule
The 7 HTML files in frontend/design/ are the visual source of truth for layout,
colours, typography, and component style. However:
- The LOGIC must match AI_Selection_System_Design.md, not the HTML
- If HTML shows more steps/stages/fields than the system needs — use what the system needs
- If HTML is missing something the system needs — add it matching the design style
- Never blindly copy HTML structure if it contradicts the system spec
- Example: HTML status page shows 6 stages, system has 4 defined stages — use 4

## When confused about any requirement
Read AI_Selection_System_Design.md — the answer is there.
Do not guess. Do not invent. Read the spec.
