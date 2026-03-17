# Taro — Tarot Reading API (NestJS + TypeScript)

Small backend project to practice **Node.js / TypeScript / NestJS** in an “enterprise-ish” way: structured project layout, validation, logging, tests, Docker, and later — persistence and rate limiting.

## Goal

Build an HTTP service that:
1. Accepts a tarot reading request (question + style).
2. Generates a spread (random cards).
3. Builds a prompt for an LLM.
4. Calls an LLM provider (first **fake adapter**, later real).
5. Returns a structured response.

This repo is built iteratively via small PRs (milestones), with a clear Definition of Done (DoD) per milestone.

## Tech Stack

- Node.js 20+
- TypeScript
- NestJS
- Jest + Supertest (e2e)
- Zod (request validation)
- Pino / nestjs-pino (structured logging)
- Docker
- (Later) Postgres, Redis

## API (planned)

### Health
- `GET /health` → `{ "status": "ok" }`

### Tarot reading (v1)
- `POST /v1/tarot/reading`

Request:
```json
{
  "question": "Should I change my job?",
  "style": "soft",
  "cards": 3
}
```
### Milestones

Each milestone should be delivered as a small PR.

#### M0 — Project bootstrap

DoD
	•	npm run dev starts the server
	•	npm run test runs successfully
	•	npm run build produces a build
	•	Tooling is consistent (TS modules strategy, Jest config, lint)
	•	README contains scope + milestones

#### M1 — Health + basic infrastructure

Features
	•	GET /health
	•	request logging with duration
	•	requestId:
	•	if client sends x-request-id → reuse else generate
	•	always return x-request-id in response headers
	•	graceful shutdown on SIGTERM/SIGINT

DoD
	•	/health works
	•	every request is logged with requestId
	•	server stops gracefully (no hanging process)

#### M2 — Tarot reading v1 (no real LLM)

Features
	•	POST /v1/tarot/reading with DTO validation
	•	generates a 3-card spread (random from a predefined deck)
	•	returns stub interpretation (no external calls yet)

DoD
	•	validation errors return 400 with readable field errors
	•	controller stays thin, logic in service
	•	e2e tests:
	•	happy path
	•	bad request

#### M3 — LLM adapter (fake → real)

Features
	•	LlmPort interface
	•	FakeLlmAdapter (deterministic text for tests)
	•	provider switch via env: LLM_PROVIDER=fake|openai (or similar)

DoD
	•	tests do not require a real API key
	•	external calls have timeouts
	•	config comes from env

(Optional) M4 — Persistence (Postgres)
	•	store reading history
	•	GET /v1/tarot/readings/:id

(Optional) M5 — Rate limiting / cache (Redis)
	•	rate limit by IP or API key

Project structure (target)
````
src/
  main.ts
  app.module.ts
  common/
    config/
    logging/
    errors/
  tarot/
    tarot.module.ts
    tarot.controller.ts
    tarot.service.ts
    dto/
    domain/
    llm/
test/
  tarot.e2e-spec.ts
````
## Local development

``npm i``

``npm run dev``

Run tests:

``npm test``

Build

``npm run build``

## Environment variables (planned)
•	PORT=3000
•	LOG_LEVEL=info
•	LLM_PROVIDER=fake|openai
•	LLM_API_KEY=... (when real provider is added)


## Notes

This project is intentionally built “step-by-step” to practice:
•	TS config / module system consistency
•	API design + validation
•	logging/metrics/shutdown
•	e2e tests and CI-friendly tooling
