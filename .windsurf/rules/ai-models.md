---
trigger: glob
globs: backend/**
priority: high
---

# AI Model Assignments (Phase 1 only)
# In Phase 0 ALL of these are MOCKED — do not call any real AI APIs

## When to read this file
Only when CURRENT MODE = LIVE in .windsurfrules
In mock mode: return hardcoded realistic responses instead of calling any model

## Groq — primary provider
base_url: https://api.groq.com/openai/v1
Client: openai.AsyncOpenAI(api_key=GROQ_API_KEY, base_url=...)

| Task                    | Model                          | Notes                    |
|-------------------------|--------------------------------|--------------------------|
| Resume extraction       | llama-3.3-70b-versatile        | Strict JSON schema       |
| SOP grading             | llama-3.3-70b-versatile        | Returns SOPScore schema  |
| Answer scoring          | llama-3.3-70b-versatile        | strict=True always       |
| Email drafting          | llama-3.1-8b-instant           | 14.4k req/day free       |
| Interview Q generation  | deepseek-r1-distill-llama-70b  | Chain-of-thought         |

## HuggingFace Serverless — embeddings only
Model: BAAI/bge-m3
Client: InferenceClient from huggingface_hub
Purpose: cosine similarity for skill matching only

## OpenRouter — fallback only
base_url: https://openrouter.ai/api/v1
Trigger: Groq returns 429
Backoff: 2s → 4s → 8s before routing to fallback

## Mock responses for Phase 0
Resume extraction mock:
  { skills: ["Python", "TensorFlow", "FastAPI"], cgpa: 8.2,
    institution: "IIT Delhi", experience_months: 6,
    certifications: ["TensorFlow Developer"] }

SOP score mock: 7.2

Screening score mock: compute using real formula with mock resume data
  (so the score breakdown shows realistic component values)

Interview question mock: cycle through MOCK_QUESTIONS array in lib/api.ts

Answer score mock: return random int between 6-9 with plausible rationale string
