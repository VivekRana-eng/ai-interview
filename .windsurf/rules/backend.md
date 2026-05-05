---
trigger: glob
globs: backend/**
priority: high
---

# Backend Conventions (Phase 1 — FastAPI)
# This file is only relevant when CURRENT MODE = LIVE
# Do not build any of this during Phase 0

## FastAPI patterns
- Dependency injection always: db: AsyncSession = Depends(get_db)
- Never return ORM objects directly — always Pydantic response_model
- All routes prefixed /api/v1/
- HTTPException with proper status codes for all errors
- Background tasks for: screening trigger, email send, merit list generation
- Never block the event loop — all I/O must be async

## PydanticAI — mandatory for ALL LLM calls
- Define output Pydantic schema in ai_schemas/schemas.py FIRST
- Use strict=True on all Groq structured output calls
- Instructor retry: 3 attempts max, inject validation error as feedback context
- If validation fails 3 times: raise hard exception + log — never silently fail
- Never use raw JSON parsing — if you are tempted, use a schema instead

## File size rule
Keep every .py file under 300 lines.
If a service file exceeds 300 lines, split into sub-modules:
  screening_engine.py → screening_scoring.py + screening_embeddings.py

## Error handling
- All LLM calls: try/except with structured logging
- All DB calls: try/except with rollback on failure
- Never expose internal errors to frontend — sanitise all 500 responses

## Audit log — non-negotiable
Every status transition writes immediately:
AuditLog(entity_type, entity_id, from_status, to_status, actor_id, actor_role, timestamp)
Do not batch. Do not defer. Write on every transition.
