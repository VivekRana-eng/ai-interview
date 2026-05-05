# SelectAI — Government Internship Selection Platform

AI-powered internship selection system for a Government of India organisation.

## Quick start

```bash
# 1. Copy env file
cp .env.example .env.local
# Fill in your Supabase URL and anon key

# 2. Drop your 7 HTML design files into frontend/design/

# 3. Open in Windsurf
# Let indexing complete, then paste Session 1 opener from
# AI_Selection_System_Design.md Section 9
```

## Current mode
**Phase 0 — Mock Demo**
Supabase DB + Storage. AI responses mocked. No FastAPI backend.

## Project structure
```
ai-selection-app/
├── AI_Selection_System_Design.md   ← full spec, read before everything
├── .windsurfrules                  ← Cascade reads this every session
├── .windsurf/
│   └── rules/
│       ├── general.md
│       ├── mock-live.md            ← most important — read this
│       ├── frontend.md
│       ├── backend.md              ← Phase 1 only
│       ├── ai-models.md            ← Phase 1 only
│       └── database.md
├── frontend/
│   └── design/                    ← drop 7 HTML files here
└── backend/                       ← Phase 1 only
```

## HTML design files
Put the 7 Claude Design HTML files in `frontend/design/`.
They are visual references only. Windsurf converts them to Next.js
and adapts the logic to match the system spec, not the other way around.

## Switching to Phase 1
When demo is approved:
1. Change `NEXT_PUBLIC_APP_MODE=mock` → `live` in `.env.local`
2. Update the CURRENT MODE line in `.windsurfrules`
3. Tell Windsurf: "Switch to Phase 1. Read .windsurfrules. Execute Phase 1 Prompt 1
   from AI_Selection_System_Design.md Section 10."
