# Taro — Tarot Reading API

Small backend learning project for practicing Node.js, TypeScript, and NestJS in an "enterprise-ish" style: modular structure, request validation, middleware, exception handling, tests, and later external integrations and persistence.

## Goal

Build an HTTP service that:
1. Accepts a tarot reading request.
2. Draws a random spread from a predefined deck.
3. Produces a reading response.
4. Later delegates interpretation to an LLM adapter.

The project is developed milestone by milestone so each change can be delivered as a small PR with a clear Definition of Done.

## Current Stack

- Node.js 20+
- TypeScript
- NestJS
- Jest + Supertest
- Zod

Planned later:
- Real LLM provider integration
- Structured logging with `pino` / `nestjs-pino`
- Postgres
- Redis

## Current API

### Health

- `GET /health` -> `{ "status": "ok" }`

### Tarot reading

- `POST /v1/tarot`

Request:

```json
{
  "question": "Should I change my job?",
  "style": "soft",
  "cards": 3
}
```

Notes:
- `style`: `soft` or `hard`
- `cards`: `3` or `6`

Example response:

```json
{
  "question": "Should I change my job?",
  "cards": ["The Fool", "Justice", "The Star"],
  "prediction": "..."
}
```

## Test Strategy

- `npm test` runs all specs together
- Unit-style and e2e-style tests share the same Jest setup because the suite is small and fast
- E2E bootstrap lives in `src/specs/e2e.setup.ts`
- `createE2EApp()` mirrors the real app bootstrap from `src/main.ts`:
  - global prefix `v1` with `/health` excluded
  - global unexpected error filter
  - shutdown hooks
  - CORS

## Milestones

### M0 — Project bootstrap

DoD:
- `npm run start:dev` starts the server
- `npm test` runs successfully
- `npm run build` produces a build
- Tooling is consistent
- README contains scope and milestones

### M1 — Health + basic infrastructure

Features:
- `GET /health`
- request logging with duration
- `x-request-id` reuse or generation
- always return `x-request-id` in response headers
- graceful shutdown on `SIGTERM` / `SIGINT`
- global unexpected error handling

DoD:
- `/health` works
- every request is logged with `requestId`
- server stops gracefully

### M2 — Tarot reading v1 (no real LLM)

Features:
- `POST /v1/tarot` with request validation
- generate a random spread from a predefined deck
- return stub interpretation without external calls

DoD:
- validation errors return `400` with readable field errors
- controller stays thin, logic stays in service
- tests cover happy path, validation failures, and unexpected error handling

### M4 — LLM adapter (fake -> real)

Features:
- `LlmPort` interface
- `FakeLlmAdapter` for deterministic tests
- provider switch via env such as `LLM_PROVIDER=fake|openai`

DoD:
- tests do not require a real API key
- external calls have timeouts
- provider config comes from env

### M4.1 — Persistence (optional)

- store reading history
- `GET /v1/tarot/readings/:id`

### M5 — Rate limiting / cache (optional)

- rate limit by IP or API key

## Project Structure

```text
src/
  app/
  common/
    decorators/
    filters/
    middleware/
    pipes/
    utils/
  domain/
  health/
  specs/
  tarot/
  types/
  main.ts
```

## Local Development

Install dependencies:

```bash
npm i
```

Run in watch mode:

```bash
npm run start:dev
```

Run all tests:

```bash
npm test
```

Build:

```bash
npm run build
```

## Environment Variables

Current:
- `PORT=3000`

Planned for M3:
- `LLM_PROVIDER=fake|openai`
- `LLM_API_KEY=...`

## Notes

This project is intentionally built step by step to practice:
- NestJS modules and request lifecycle
- TypeScript and validation
- API design and error handling
- e2e-friendly testing
- backend engineering habits before adding real integrations
