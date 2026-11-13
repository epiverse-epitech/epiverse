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
| `AUTH_RATE_LIMIT_MAX` | No | `30` | Same, on routes marked `@AuthRateLimit()`. Integer of at least 1 |
| `LOGIN_FAILURE_MAX` | No | `5` | Failed logins allowed per account and client address within the window below. Integer of at least 1 |
| `LOGIN_FAILURE_WINDOW_MINUTES` | No | `15` | Length of that window, in minutes. Integer of at least 1 |
| `TRUST_PROXY_HOPS` | No | `0` | Number of reverse proxies in front of the API. Integer of at least 0 |
| `SESSION_TTL_HOURS` | No | `168` | Lifetime of a session after login, in hours (7 days). Integer of at least 1 |
| `CGU_VERSION` | No | `1.0` | Version of the terms of use accepted at registration. 1 to 20 characters |
| `SMTP_HOST` | No | — | SMTP server. Without it, emails are printed in development and not sent in production |
| `SMTP_PORT` | No | `587` | Integer from 1 to 65535 (`465` uses implicit TLS) |
| `SMTP_USER`, `SMTP_PASSWORD` | No | — | SMTP credentials, kept out of Git |
| `SMTP_REQUIRE_TLS` | No | `true` | `true` or `false`. Set to `false` only for a local test server |
| `MAIL_FROM` | No | `EpiVerse <no-reply@epiverse.local>` | Sender of the emails |
| `WEB_BASE_URL` | No | `http://localhost:8080` | Base of the links sent by email. Must be set in staging and production |
| `EMAIL_VERIFICATION_TTL_HOURS` | No | `24` | Lifetime of an email verification link. Integer of at least 1 |
| `PASSWORD_RESET_TTL_MINUTES` | No | `30` | Lifetime of a password reset link. Integer of at least 1 |

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
| `cguVersion` | The version of the terms of use the user accepted, as served by `GET /api/auth/cgu`. Any other version gets 400 `The terms of use have changed: accept the current version`. The acceptance is recorded in `user_cgu_acceptance` with its date, in the same statement as the account (FR-AUTH-001). |

| Response | When |
|---|---|
| 201 with `{ id, email, firstName, lastName }` | Account created. `id` is the public UUID, never the internal numeric id. |
| 400 | Invalid or unknown field. No account is created. |
| 409 `An account already exists with this email` | The email is taken, whatever its letter case. Nothing about the existing account is returned. The owner of an open account gets a notice by email, without any link or text from the other person (at most `LOGIN_FAILURE_MAX` per `LOGIN_FAILURE_WINDOW_MINUTES` for one address). |
| 429 | Too many attempts (`@AuthRateLimit()`). |

- The unique index on `lower(email)` decides between duplicates, so two simultaneous requests cannot create two accounts.

### Known limits

- The 409 tells whether an email is registered (account enumeration). Accepted by the team: the DoD asks for generic answers only at login and password reset, and hiding it would also require a verified address to log in. Slowed down by the rate limit.
- `GET /api/auth/cgu` returns `{ version }`, the current terms of use version (`CGU_VERSION`). When the terms change, the new text and the new `CGU_VERSION` are deployed together; existing accounts then accept the new version through `POST /api/auth/cgu/accept` (see Sessions).

## Sessions

`POST /api/auth/login` opens a session (EPI-57). The client then sends the token on every protected request as `Authorization: Bearer <token>`.

| Route | Response | When |
|---|---|---|
| `POST /api/auth/login` | 200 with `{ token, expiresAt }` | Right email and password, account active and not deleted. |
| | 400 | Invalid or unknown field. |
| | 401 `Invalid email or password` | Unknown email, wrong password, deactivated or deleted account: always the same answer. |
| | 429 with `Retry-After` | Too many requests from the address (`@AuthRateLimit()`), or too many failed logins for this account from this address (see Rate limiting). |
| `GET /api/auth/me` | 200 with `{ id, email, firstName, lastName, cguAccepted, roles, emailVerified }` | Valid session. `cguAccepted` is false when the current terms of use are not accepted yet; `roles` lists role names (empty until a path is chosen); `emailVerified` is false until the address is confirmed. |
| `POST /api/auth/cgu/accept` with `{ version }` | 204 | Records the acceptance of the current terms of use (version and date). Accepting again keeps the first date. |
| | 400 `The terms of use have changed: accept the current version` | `version` is not the current one. |
| `POST /api/auth/logout` | 204 | The session is revoked. The other sessions of the account stay open. |
| Every protected route | 401 `Authentication required` | Missing, malformed, unknown, revoked or expired token, or account deactivated or deleted since login: always the same answer. |

- The token is 32 random bytes (base64url). The API returns it once and stores only its SHA-256 hash in `user_session`, so a database leak does not give working tokens.
- Every request checks the session in the database, so a logout or a deactivated account takes effect at once.
- A session lasts `SESSION_TTL_HOURS` (7 days by default) and is not extended by use.
- A logout keeps the row with `revoked_at` set, so the session history stays readable.
- An unknown email is checked against a dummy Argon2 hash, so both failures take the same time and the response time does not reveal which emails have an account.
- A route is protected with `@UseGuards(SessionGuard)`; `@CurrentAccount()` reads the account, `@CurrentSessionId()` the session and `@CurrentUserId()` the internal account id (never returned to the client).
- When the terms of use change (`CGU_VERSION`), an account that has not accepted the new version gets 403 `The current terms of use must be accepted` on every protected route, except those marked `@AllowPendingCgu()`: `GET /api/auth/me`, `POST /api/auth/cgu/accept` and `POST /api/auth/logout`. Login still works, so the client can show the new terms (EPI-490).

### Known limits

- The token is sent in a header. A cookie for the web client (`HttpOnly`, `Secure`, `SameSite`) may come later with the front team.
- `last_used_at`, `ip_address` and `user_agent` of `user_session` are not filled yet. They will be needed for a list of active sessions.
- No route revokes all the sessions of an account yet (for a password change or a stolen device).
- Expired and revoked rows are never deleted; a cleanup job will be needed.

## Email verification

Registration sends a link to the address (EPI-52, FR-AUTH-005). Opening it confirms the address; the status is kept apart from the session, in `users.email_verified_at`.

| Route | Response | When |
|---|---|---|
| `POST /api/auth/email/verify` with `{ token }` | 204 | Address confirmed. No session needed: the token proves it. |
| | 400 `This link is invalid or has expired` | Unknown, expired, already used or replaced token, or closed account: always the same answer. |
| `POST /api/auth/email/resend` | 202 | With a session. A new link leaves, unless the address is already confirmed. The previous link stops working. |
| | 429 with `Retry-After` | Too many emails requested for this account (`LOGIN_FAILURE_MAX` per `LOGIN_FAILURE_WINDOW_MINUTES`), or too many requests from the address. |

- The link is `WEB_BASE_URL/verify-email#token=...`. The token is in the fragment, so browsers never send it to a server: the web page reads it and calls `POST /api/auth/email/verify`.
- Only the SHA-256 hash of the token is stored, in `auth_token`. A link lasts `EMAIL_VERIFICATION_TTL_HOURS` and works once (`AccountTokens`).
- The text of the email contains nothing chosen by the user, since anyone can register with someone else's address.

### Known limits

- An unverified account can still use every route: which actions need a confirmed address is not decided yet (FR-AUTH-005). `emailVerified` lets the client explain it.
- Counters live in the memory of each API process, like the other limits.

## Password reset

A forgotten password is replaced through a link sent by email (EPI-60, FR-AUTH-004).

| Route | Response | When |
|---|---|---|
| `POST /api/auth/password/forgot` with `{ email }` | 202 `If an account exists for this address, a link has been sent` | Always the same answer: known, unknown, deactivated or deleted account. |
| | 400 | Malformed email. |
| | 429 with `Retry-After` | Too many emails requested for this email from this address (`LOGIN_FAILURE_MAX` per `LOGIN_FAILURE_WINDOW_MINUTES`), or too many requests from the address (`@AuthRateLimit()`). Unknown emails are counted too. |
| `POST /api/auth/password/reset` with `{ token, password }` | 204 | Password changed. Every session of the account is revoked, other reset links stop working, and the owner gets a notice by email. |
| | 400 `This link is invalid or has expired` | Unknown, expired, already used or replaced token, or closed account. A password breaking the policy also gets 400, and the link stays usable. |

- The link is `WEB_BASE_URL/reset-password#token=...`, lasts `PASSWORD_RESET_TTL_MINUTES` and works once. Only its SHA-256 hash is stored, in `auth_token`.
- The account lookup and the email happen after the response, so neither the content nor the timing reveals which accounts exist.
- The token, the password and the sessions change in one transaction.
- A reset lifts the login limit for this account from this address, so the owner can sign in at once.
- A reset also confirms the email address (`email_verified_at`), since the link proved access to the mailbox; an earlier date is kept.

### Known limits

- The limit on emails is per email and address, so that nobody can block someone else's recovery: an attacker with many addresses can still send several emails to one mailbox.
- Passwords are not checked against a list of compromised passwords yet (NIST SP 800-63B, issue #18).

## Paths

After registration, the user chooses a path (Soumia's workflow, EPI-42). A new account has no role until then.

| Route | Response | When |
|---|---|---|
| `POST /api/me/paths/student` | 200 with the account as `GET /api/auth/me` shows it | Gives the `student` role and an empty `student_profile`, without approval. Choosing it again changes nothing and keeps the profile. |
| | 401 / 403 | No valid session, or current terms of use not accepted (see Sessions). |

- The `student` role is seeded by the fixtures; the API creates it if a fresh database does not have it.
- The role, the link and the profile are written in one transaction.

### Known limits

- Mentor and organization paths need an approval and wait for role requests in the schema (EPI-41). A pending applicant must then see only a waiting page (Soumia).
- Nothing stops a student from also requesting another path; how roles combine is EPI-93.
- Two simultaneous first calls on a database without the `student` role could make one of them fail with 500 (unique role name). The fixtures seed the role, so it only concerns an empty database.

## Emails

Inject `Mailer` (`src/mail/`, global module) and call `send({ to, subject, text })`. Text only: no HTML, so nothing from a user can become markup.

- With `SMTP_HOST`, messages go through SMTP (nodemailer), with TLS required by default.
- Without it, in development, messages are printed in the console, so links can be tried without a server.
- Without it, in production, the API starts with a warning and no email leaves. The content is never logged there, because links are secrets.
- Emails are sent after the response, in the background: a slow or failing server neither fails the request nor reveals through timing which accounts exist. A failure is logged without any address or link.
- Tests replace `Mailer` with `FakeMailer` (`test/support/`).

## Rate limiting

- Every route accepts `RATE_LIMIT_MAX` requests per client and per route during a window of `RATE_LIMIT_TTL_SECONDS`.
- Beyond the limit, the API answers 429 with a `Retry-After` header, in the usual error format. Access returns once the client's block has expired.
- Every login, account recovery and registration route must carry `@AuthRateLimit()`, which applies the stricter `AUTH_RATE_LIMIT_MAX`. Nothing applies it automatically: such a route without the decorator only gets the general limit.
- `GET /api/health` is excluded with `@SkipThrottle()`, because Docker health checks and deployments rely on it.
- Login also counts failed attempts per account and client address: beyond `LOGIN_FAILURE_MAX` failures within `LOGIN_FAILURE_WINDOW_MINUTES` (5 per 15 minutes, NFR-SEC-003), that pair gets 429 with `Retry-After` until the window ends, even with the right password. A successful login clears the count. Unknown emails are counted too, so a 429 does not reveal which accounts exist. Students behind one address each have their own count.

### Client address

Clients are identified by IP address, so the API must know how many proxies stand in front of it. Set `TRUST_PROXY_HOPS` to that number:

| In front of the API | Value |
|---|---|
| Nothing (local development, tests) | `0` |
| Caddy (staging, production) | `1` |

- Too low: every client shares the proxy's address, and so a single limit.
- Too high, or above 0 on an API reachable without the proxy: clients can forge their address through `X-Forwarded-For` and get around the limit.

### Known limits

- Registration and login carry the decorator; account recovery routes do not exist yet and must carry it too.
- The address limit still applies to login and registration: more than `AUTH_RATE_LIMIT_MAX` (30) students logging in or registering within one minute from the school Wi-Fi would be blocked, whatever their own count. It is set high on purpose: guessing one account is already capped by the account limit, so the address limit only slows down trying many accounts from one address. Raise it if a larger group connects at once. An attacker with many addresses is not stopped by it.
- Counters live in the memory of each API process: a restart resets them and several instances do not share them. Redis will be needed before running more than one instance.

## Security controls

Each security requirement of the DoD (DOC-008) and of the security register (`docs/security/controle-securite.md`) maps to the tests that prove it (EPI-223). They run in the CI with every other test.

| Requirement | What is checked | Tests |
|---|---|---|
| NFR-SEC-001 Passwords never in clear | Argon2id hash, salted, never returned; no password, token, email or hash in the logs of the account flows, even when the mail server fails | `src/security/password.service.spec.ts`, `test/register.e2e-spec.ts`, `test/password-reset.e2e-spec.ts`, `test/no-secrets-in-logs.e2e-spec.ts` |
| NFR-SEC-002 Access checked by the API | 401 without a valid session (missing, unknown, revoked, expired, closed account); 403 until the current terms of use are accepted; unknown fields refused (`role: 'admin'`); one-time links refused when unknown, expired, used, replaced or of another type | `test/me.e2e-spec.ts`, `test/logout.e2e-spec.ts`, `test/cgu-acceptance.e2e-spec.ts`, `test/student-path.e2e-spec.ts`, `test/validation.e2e-spec.ts`, `test/email-verification.e2e-spec.ts`, `test/password-reset.e2e-spec.ts`, `test/account-tokens.e2e-spec.ts` |
| NFR-SEC-003 Repeated attempts limited | 429 with `Retry-After` per address and per account and address, students behind one address not blocked together, forged addresses ignored, unknown emails counted alike | `test/rate-limit.e2e-spec.ts`, `test/login-rate-limit.e2e-spec.ts`, `test/register.e2e-spec.ts`, `test/password-reset.e2e-spec.ts`, `test/email-verification.e2e-spec.ts` |
| FR-AUTH-002 / FR-AUTH-004 Generic answers | Same 401 for an unknown email, a wrong password or a closed account; same 202 for any forgotten-password request | `test/login.e2e-spec.ts`, `test/password-reset.e2e-spec.ts` |
| NFR-OBS-001 Logs without sensitive data | 5xx answers and logs without internal details; account flows as for NFR-SEC-001 | `test/errors.e2e-spec.ts`, `test/no-secrets-in-logs.e2e-spec.ts` |
| API-05 Swagger in production and HTTP headers | Swagger off in production unless enabled; `helmet` headers (`nosniff`, frame, referrer and content security policies, no `X-Powered-By`) on every answer, errors included, while the docs stay usable | `test/api-docs.e2e-spec.ts`, `test/security-headers.e2e-spec.ts` |

### Known limits

- Session tokens are random and stored as a hash, but nothing tests MFA or a list of compromised passwords: neither exists yet (issue #18).
- NFR-SEC-004 (secrets out of Git) is checked by Gitleaks in the CI, not by these tests.
- Role checks (FR-ROLE-001) will add their own negative tests with the role routes.

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
