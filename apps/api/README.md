# EpiVerse API

REST API of EpiVerse, built with NestJS 12 and TypeScript. It serves the web and mobile clients (`apps/app`) under the `/api` prefix.

Owner: Eckson Glitho (backend). Architecture reference: DOC-014 (modular monolith).

## Stack

| Concern | Choice |
|---|---|
| Framework | NestJS 12 (CommonJS build) |
| Language | TypeScript 6, `strict` mode |
| Configuration | `@nestjs/config`, validated with `class-validator` |
| API docs | `@nestjs/swagger` (OpenAPI 3) |
| Tests | Jest 30 + Supertest |
| Password hashing | Argon2id (`@node-rs/argon2`) |
| Lint / format | oxlint, Prettier |
| Database | PostgreSQL 17 + pgvector, Prisma 7 (`pg` driver adapter) |
| Cache (upcoming) | Redis |

## Prerequisites

- **Node.js 24.9 or later** (same major version as the CI and the Docker image). Nest 12 is published as ES modules; Jest can only load them through `require(esm)`, which needs Node 24.9+.
- npm (the lockfile is committed; the CI runs `npm ci`).

## Getting started

```bash
# From the repository root: start PostgreSQL and Redis
docker compose up -d postgres redis

# Then in apps/api
cd apps/api
cp .env.example .env       # local values matching docker-compose.yml
npm ci
npx prisma generate        # generates the client in src/generated (not committed)
npx prisma migrate deploy  # creates the tables
npm run start:dev
```

Then check that the API is up:

```bash
curl http://localhost:3000/api/health
# {"status":"ok"}
```

Local PostgreSQL and Redis are started from the repository root with Docker Compose; see `infra/README.md`, section 1.

## Configuration

The API validates its environment on startup and **refuses to start** if a variable is missing or invalid, listing every problem at once:

```
Error: Invalid configuration:
- NODE_ENV : NODE_ENV must be one of the following values: development, test, production
- PORT : PORT must be an integer number
```

Variables are read from the process environment and, in local development, from `apps/api/.env` (never committed).

| Variable | Required | Default | Rule |
|---|---|---|---|
| `NODE_ENV` | No | `development` | `development`, `test` or `production` |
| `PORT` | No | `3000` | Integer from 1 to 65535, digits only (`" 8080 "` and `"3000abc"` are rejected) |
| `DATABASE_URL` | Yes | — | PostgreSQL connection URL (`postgresql://` or `postgres://`) |
| `RATE_LIMIT_TTL_SECONDS` | No | `60` | Length of the rate limit window. Integer of at least 1 |
| `RATE_LIMIT_MAX` | No | `100` | Requests allowed per window on a route. Integer of at least 1 |
| `AUTH_RATE_LIMIT_MAX` | No | `5` | Same, on routes marked `@AuthRateLimit()`. Integer of at least 1 |
| `LOGIN_FAILURE_MAX` | No | `5` | Failed logins allowed per account and client address within the window below. Integer of at least 1 |
| `LOGIN_FAILURE_WINDOW_MINUTES` | No | `15` | Length of that window, in minutes. Integer of at least 1 |
| `TRUST_PROXY_HOPS` | No | `0` | Number of reverse proxies in front of the API. Integer of at least 0 |

The rules live in `src/config/env.validation.ts`. A new variable is added there, with its tests, in the same change as the code that first uses it (`REDIS_URL` will come with Redis).

Read configuration through `ConfigService`, never through `process.env`:

```ts
const config = app.get(ConfigService<EnvironmentVariables, true>);
const port = config.get('PORT', { infer: true }); // typed as number
```

## Database

- `prisma/schema.prisma` describes the tables for the Prisma client; `prisma/migrations/` holds the SQL applied to every database.
- `0_init` is a copy of `docs/database/schema.sql`: Prisma cannot express pgvector columns, check constraints, expression indexes (such as the case-insensitive unique email) or comments, so the first migration keeps the original SQL.
- Code reaches the database through `PrismaService` (`src/prisma/`), which is global: inject it in any module.
- Changing the schema: edit `schema.prisma`, run `npx prisma migrate dev --name <change>`, review the generated SQL, commit both.
- A database that already has the tables (loaded from `schema.sql` by hand) is marked as migrated once with `npx prisma migrate resolve --applied 0_init`.
- Prisma is pinned to an exact version (7.10.1). Upgrading is a dedicated change, done only on a stable release.

## Scripts

| Command | Purpose |
|---|---|
| `npm run start:dev` | Start in watch mode |
| `npm run build` | Compile to `dist/` (`dist/main.js` is the container entry point) |
| `npm run start:prod` | Run the compiled build |
| `npm run test` | Unit tests (`src/**/*.spec.ts`) |
| `npm run test:e2e` | End-to-end tests (`test/**/*.e2e-spec.ts`) |
| `npm run test:cov` | Unit tests with coverage report in `coverage/` |
| `npm run lint` | oxlint on `src/` and `test/` |
| `npm run format` | Prettier on `src/` and `test/` |

Test scripts run Jest through `node --experimental-vm-modules`: without this flag, Jest cannot load the ES modules published by Nest 12. The `node … jest.js` form works on Windows and Linux alike.

## Project structure

```
src/
  main.ts               Entry point: creates the app, applies configureApp, listens on PORT
  app.setup.ts          configureApp(): app-wide settings shared by main.ts and e2e tests
  app.module.ts         Root module: assembles the feature modules
  common/               Shared contracts: AllExceptionsFilter, ErrorResponseDto
  config/               Environment validation (EnvironmentVariables, validateEnv)
  security/             PasswordService (Argon2id), the @IsPassword() rule, rate limiting
  auth/                 Account registration (POST /api/auth/register)
  health/               GET /api/health (liveness check)
  prisma/               PrismaModule (global) and PrismaService
  generated/prisma/     Prisma client, generated by `npx prisma generate` (not committed)
prisma/
  schema.prisma         Prisma models
  migrations/           SQL migrations, applied by `prisma migrate deploy`
test/
  *.e2e-spec.ts         HTTP tests against the full application
```

Each business domain gets its own Nest module (`auth`, `users`, `events`, …), following the modular monolith of DOC-014.

## Passwords

- Passwords are never stored, logged or returned: only their Argon2id hash is kept, through `PasswordService` (`src/security/`).
- Settings: 19 MiB of memory, 2 iterations, 1 thread (OWASP minimum for Argon2id). They are written in the code so that a library update cannot lower them; each hash stores its own settings and salt.
- `verify(password, hash)` returns `false` for a wrong password and for an unreadable hash; it never throws.
- Every DTO field that receives a new password uses `@IsPassword()`: 8 to 128 characters, at least one uppercase letter and one digit. The upper limit keeps hashing cost bounded.

## Accounts

`POST /api/auth/register` creates a personal account (FR-AUTH-001). Choosing a path (student, mentor, organization) and the matching role come in a later step: a new account has no role.

| Field | Rule |
|---|---|
| `email` | Valid email, at most 255 characters. Trimmed and stored in lowercase. |
| `password` | `@IsPassword()` (see Passwords). |
| `firstName`, `lastName` | Required, 1 to 50 characters once surrounding spaces are removed. |

| Response | When |
|---|---|
| 201 with `{ id, email, firstName, lastName }` | Account created. `id` is the public UUID, never the internal numeric id. |
| 400 | Invalid or unknown field. No account is created. |
| 409 `An account already exists with this email` | The email is taken, whatever its letter case. Nothing about the existing account is returned. |
| 429 | Too many attempts (`@AuthRateLimit()`). |

- The unique index on `lower(email)` decides between duplicates, so two simultaneous requests cannot create two accounts.

### Known limits

- The 409 tells whether an email is registered (account enumeration). Accepted for now and slowed down by the rate limit. Sending an email to the existing owner instead would remove it, once email delivery exists (EPI-53).
- Acceptance of the terms of use is not recorded yet (required by FR-AUTH-001); it waits for the database change.

## Rate limiting

- Every route accepts `RATE_LIMIT_MAX` requests per client and per route during a window of `RATE_LIMIT_TTL_SECONDS`.
- Beyond the limit, the API answers 429 with a `Retry-After` header, in the usual error format. Access returns once the client's block has expired.
- Every login, account recovery and registration route must carry `@AuthRateLimit()`, which applies the stricter `AUTH_RATE_LIMIT_MAX`. Nothing applies it automatically: such a route without the decorator only gets the general limit.
- `GET /api/health` is excluded with `@SkipThrottle()`, because Docker health checks and deployments rely on it.

### Client address

Clients are identified by IP address, so the API must know how many proxies stand in front of it. Set `TRUST_PROXY_HOPS` to that number:

| In front of the API | Value |
|---|---|
| Nothing (local development, tests) | `0` |
| Caddy (staging, production) | `1` |

- Too low: every client shares the proxy's address, and so a single limit.
- Too high, or above 0 on an API reachable without the proxy: clients can forge their address through `X-Forwarded-For` and get around the limit.

### Known limits

- Registration carries the decorator; login and recovery routes do not exist yet and must carry it too.
- The limit is per IP address. Users behind one address, such as a campus network, share it: more than `AUTH_RATE_LIMIT_MAX` students registering together from the school Wi-Fi would be blocked. An attacker with many addresses is not stopped either. Login will add a per-account limit (EPI-57); registration will need its own rule before an onboarding session on campus.
- Counters live in the memory of each API process: a restart resets them and several instances do not share them. Redis will be needed before running more than one instance.

## Testing approach

The API is developed test-first (TDD): a failing test describes the behaviour, then the code makes it pass, then it is cleaned up.

- **Unit tests** sit next to the code (`*.spec.ts`) and cover pure logic such as configuration rules, permissions and validation.
- **End-to-end tests** (`test/`) send real HTTP requests with Supertest. They call `configureApp()` so they exercise the same application as production.
- Acceptance criteria of a ticket become test cases.

## API contracts

Rules shared by every route, set up in `configureApp()` (`src/app.setup.ts`) and covered by the e2e tests.

### Documentation

- Interactive docs: `http://localhost:3000/api/docs`. OpenAPI spec (JSON): `/api/docs-json`; clients can generate their types from it. **These endpoints are disabled when `NODE_ENV=production`**, unless `API_DOCS_ENABLED=true` is set deliberately after access review. Server errors log only HTTP status/method, not exception stacks or credentials.
- Every route is documented: `@ApiTags('<domain>')` on the controller, a response DTO (`@ApiOkResponse({ type: … })`, `@ApiCreatedResponse`, …) and `@ApiProperty` on each DTO field. `src/health/` is the reference example.

### Errors

Every error, expected or not, has the same shape (`ErrorResponseDto`):

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": ["email must be an email"],
  "path": "/api/auth/register",
  "timestamp": "2026-10-31T10:00:00.000Z"
}
```

- `message` is a string, or a list of strings for validation errors.
- Throw Nest exceptions (`NotFoundException`, `ConflictException`, …); `AllExceptionsFilter` formats them.
- Any other error becomes a generic 500: its details are logged on the server and never sent to the client.
- `path` never includes the query string.

### Validation

- Each request body is a DTO class decorated with `class-validator`; the global `ValidationPipe` checks it before the controller runs.
- Invalid fields are rejected with a 400 that lists every problem.
- Unknown fields are rejected too (`property role should not exist`), so a client cannot slip in fields such as `role`.
- The body reaches the controller as a DTO instance, and route parameters are converted to their declared types.

## Contract with the infrastructure

Defined in `infra/README.md`, section 2:

- Listens on `PORT` (default 3000), with every route under `/api`.
- `GET /api/health` returns 200; Docker health checks and deployments rely on it.
- `npm run build` produces `dist/main.js`.
- Prisma schema and migrations live in `prisma/`; the container entrypoint runs `prisma migrate deploy`.
- `TRUST_PROXY_HOPS` is set to `1` wherever the API runs behind Caddy.

## Conventions

- Code, tests, comments, error messages and commit messages are written in English.
- Branches `feature/<ticket>-<topic>`, `fix/…`, `docs/…`; commits `type(scope): message`; pull requests to `develop` with a green CI and a review (DOC-013).
