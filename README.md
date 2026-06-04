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
- Prisma
- PostgreSQL
- Docker / Docker Compose
- GitHub Actions
- Real LLM provider integration

Planned later:
- Structured logging with `pino` / `nestjs-pino`
- Redis

## Current API

### Health

- `GET /health` -> `{ "status": "ok" }`

### User registration

- `POST /v1/user`

Current request:

```json
{
  "name": "Maksym Koiev",
  "password": "password123"
}
```

Notes:
- password is hashed before persistence
- password hash is never returned in API responses
- current schema intentionally uses a single `name` field before the M5.3 migration exercise

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
- real OpenAI adapter

DoD:
- tests do not require a real API key
- external calls have timeouts
- provider config comes from env

### M5.1 — Prisma + database bootstrap

Features:
- Prisma setup
- PostgreSQL connection
- first Prisma schema
- first migration
- Nest integration with Prisma client

DoD:
- app connects to PostgreSQL
- initial migration is created and applied
- Prisma client is available in the application

### M5.2 — User registration v1

Features:
- `User` model with `id`, `name`, `passwordHash`, timestamps
- registration endpoint
- password hashing before save

DoD:
- user can register
- password is never stored in plain text
- user record is persisted in the database

### M5.3 — User schema evolution

Features:
- evolve `User.name` into `firstName` and `lastName`
- practice safe schema evolution with an Expand → Migrate → Contract approach
- add and apply a new migration
- document and test data migration behavior
- update API and persistence logic after the database is safely expanded

Migration strategy:
1. **Expand**: add nullable `firstName` and `lastName` while keeping old `name`.
2. **Migrate**: backfill existing users from `name` into the new fields.
3. **Switch API**: change registration to accept `firstName` and `lastName`.
4. **Contract**: remove old `name` only after the app no longer depends on it.

Name split rule:
- everything before the first space becomes `firstName`
- everything after the first space becomes `lastName`
- examples: `Maksym Koiev` → `Maksym` / `Koiev`; `Jean Claude Van Damme` → `Jean` / `Claude Van Damme`

DoD:
- migration is created and applied
- existing users are migrated to the new fields according to the documented rule
- application works with the expanded schema
- API contract is updated only after the database migration is proven safe
- old single-name field is removed only in the final contract step

### M5.4 — Email + login

Features:
- add `email` field to `User`
- unique constraint for email
- login endpoint
- password verification

DoD:
- user can log in with email and password
- duplicate emails are rejected
- password verification works correctly

### M5.5 — Authentication

Features:
- JWT-based authentication
- protected endpoint such as `GET /v1/users/me`
- auth guard / token validation

DoD:
- protected routes require a valid token
- authenticated user can fetch their own profile
- invalid token is rejected

### M5.6 — Cards in database

Features:
- tarot cards stored in the database instead of hardcoded list
- Prisma queries for reading cards
- seed or initialization strategy for cards

DoD:
- app can read cards from the database
- hardcoded deck is no longer required for runtime
- seed/init process is documented

### M5.7 — Docker + runtime config

Features:
- Dockerfile for the NestJS app
- Docker Compose for app + PostgreSQL
- runtime environment configuration through `.env`, GitHub Actions variables/secrets, and Compose env forwarding
- environment-based CORS configuration
- database migrations as a deploy/pipeline step, not as a Docker image build step

DoD:
- app runs in Docker
- app can connect to PostgreSQL in Docker
- CORS is configured through environment variables

### Later / optional

- reading history
- continue chat on top of previous reading context
- email verification
- phone number
- rate limiting / cache
- Redis
- structured logging with `pino` / `nestjs-pino`

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

Run with Docker Compose from the project root:

```bash
docker compose -f infra/compose.yml up --build
```

Notes:
- `.env` lives in the project root
- Compose passes runtime environment variables into the app and db containers
- inside Docker, the app must use the Compose service name `db` as the PostgreSQL host, not `localhost`
- PostgreSQL data is persisted in a Docker volume

## Environment Variables

Current:
- `PORT=3000`
- `LLM_PROVIDER=fake|openai`
- `LLM_API_KEY=...`
- `POSTGRES_USER=...`
- `POSTGRES_PASSWORD=...`
- `POSTGRES_HOST=localhost` locally, `db` inside Docker Compose
- `POSTGRES_DB=...`

Notes:
- Prisma uses `prisma.config.ts` and the project env helper to build the datasource URL from individual env values.
- Do not build `DATABASE_URL` manually inside `.env` for this project.
- Generated Prisma Client is build output and must not be edited manually.
- Generated Prisma Client should stay ignored by Git and be produced with `npx prisma generate` in local, Docker, and CI flows.

## Notes

This project is intentionally built step by step to practice:
- NestJS modules and request lifecycle
- TypeScript and validation
- API design and error handling
- e2e-friendly testing
- backend engineering habits before adding real integrations
- Prisma schema changes, migrations, and generated client flow
- safe database migration strategies such as Expand → Migrate → Contract
- Docker runtime configuration and the difference between build-time and runtime environment variables
- CI/CD basics with reusable GitHub Actions workflows
