# SelectAI — Progress Tracker

Session-level tracker for what's done and what's next. **Update after every prompt response** that changes code, architecture, or plans.

**Last Updated:** 2026-06-22

---

## Current Phase

**Phase 0 — MOCK** (`NEXT_PUBLIC_APP_MODE=mock`)

Next.js + **Supabase for all data** (auth, CRUD, storage, admin). AI responses mocked. No Python service yet.

---

## Architecture (locked)

| Concern                             | Technology                        |
| ----------------------------------- | --------------------------------- |
| Database, auth, storage, admin CRUD | **Supabase** (both phases)        |
| AI screening, interview, embeddings | **Python FastAPI** (Phase 1 only) |
| Frontend                            | Next.js 14                        |

---

## Done

### Infrastructure & tooling

- [x] Migrated Windsurf rules/plans/skills → `.cursor/`
- [x] Clean architecture rules (`clean-architecture.mdc`, `workflow.mdc`)
- [x] Prettier configured (root + frontend `npm run format`)
- [x] ESLint `@typescript-eslint/no-explicit-any: error`
- [x] Backend AI scaffold (`backend/app/*` placeholder dirs)
- [x] Intern git workflow: `intern-dev` branch, `CONTRIBUTING.md`, `.github/CODEOWNERS`

### Data layer

- [x] Split `lib/api.ts` → `lib/api/{client,jobs,applications,interview,admin,admin-merit,auth,index}.ts`
- [x] **Data functions always Supabase** — jobs, admin, merit, application reads
- [x] **AI mock/live split** — `isAiMock()` + `fetchAiApi()` for screening + interview only
- [x] Unified auth via `lib/auth.ts`
- [x] `lib/errors.ts`, extended `lib/types.ts`
- [x] Zero `@/lib/supabase` imports in `app/` or `features/`

### Frontend structure

- [x] `features/` modules for applications, admin, jobs, status, interview
- [x] All admin pages thin — compose features, call `@/lib/api` only
- [x] `npm run build` passes

### Documentation

- [x] Architecture decision synced across `.cursor/rules/`, plans, `PROGRESS.md`
- [x] Removed PostgreSQL/Alembic/CRUD FastAPI from plans

### Phase 0 routes

- [x] All 14 app routes implemented
- [x] `seed-mock-data.sql` for RLS + seed data

---

## In Progress

_None._

---

## Up Next

### Phase 0 completion

- [ ] Install shadcn/ui into `components/ui/`
- [ ] Wire React Hook Form + Zod on apply and admin forms
- [ ] Add Supabase migrations folder (`supabase/migrations/`)
- [ ] Add Vitest tests for screening formula + AI mock paths

### Phase 1 (after demo approval)

- [ ] Python FastAPI AI microservice per `backend/README.md`
- [ ] Screening + interview AI routers (`PLAN-INTEGRATION.md`)
- [ ] Real Groq/HF/OpenRouter integration
- [ ] SMTP email from Python AI service (optional)

See `.cursor/plans/MASTER-PLAN.md` for milestone-level tracking.

---

## Architecture health

| Area                | Status        | Notes                             |
| ------------------- | ------------- | --------------------------------- |
| Layered frontend    | 🟢 Complete   | app → features → components → lib |
| Supabase data layer | 🟢 Complete   | All CRUD through `lib/api/*`      |
| AI mock/live split  | 🟢 Complete   | Only screening + interview branch |
| Python AI backend   | 🟡 Scaffolded | README + rules; no code yet       |
| shadcn/ui           | 🔴 Pending    |                                   |
| Tests               | 🔴 None       |                                   |

---

## Session log

| Date       | Summary                                                           |
| ---------- | ----------------------------------------------------------------- |
| 2026-06-19 | Windsurf → Cursor; architecture audit; clean-code refactor        |
| 2026-06-19 | **Architecture lock:** Supabase = data backend; Python = AI only  |
| 2026-06-22 | Intern branch workflow: `intern-dev`, CODEOWNERS, CONTRIBUTING.md |

---

_Agents: update this file at the end of every session. Sync milestone changes to `.cursor/plans/MASTER-PLAN.md`._
