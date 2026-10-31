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
| Lint / format | oxlint, Prettier |
| Database (upcoming) | PostgreSQL 17 + pgvector, Prisma |
| Cache (upcoming) | Redis |

## Prerequisites

- **Node.js 24.9 or later** (same major version as the CI and the Docker image). Nest 12 is published as ES modules; Jest can only load them through `require(esm)`, which needs Node 24.9+.
- npm (the lockfile is committed; the CI runs `npm ci`).

## Getting started

```bash
cd apps/api
npm ci
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

The rules live in `src/config/env.validation.ts`. A new variable is added there, with its tests, in the same change as the code that first uses it (`DATABASE_URL` and `REDIS_URL` will come with Prisma and Redis).

Read configuration through `ConfigService`, never through `process.env`:

```ts
const config = app.get(ConfigService<EnvironmentVariables, true>);
const port = config.get('PORT', { infer: true }); // typed as number
```

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
  health/               GET /api/health (liveness check)
test/
  *.e2e-spec.ts         HTTP tests against the full application
```

Each business domain gets its own Nest module (`auth`, `users`, `events`, …), following the modular monolith of DOC-014.

## Testing approach

The API is developed test-first (TDD): a failing test describes the behaviour, then the code makes it pass, then it is cleaned up.

- **Unit tests** sit next to the code (`*.spec.ts`) and cover pure logic such as configuration rules, permissions and validation.
- **End-to-end tests** (`test/`) send real HTTP requests with Supertest. They call `configureApp()` so they exercise the same application as production.
- Acceptance criteria of a ticket become test cases.

## API contracts

Rules shared by every route, set up in `configureApp()` (`src/app.setup.ts`) and covered by the e2e tests.

### Documentation

- Interactive docs: `http://localhost:3000/api/docs`. OpenAPI spec (JSON): `/api/docs-json`; clients can generate their types from it.
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
- Prisma schema and migrations will live in `prisma/`.

## Conventions

- Code, tests, comments, error messages and commit messages are written in English.
- Branches `feature/<ticket>-<topic>`, `fix/…`, `docs/…`; commits `type(scope): message`; pull requests to `develop` with a green CI and a review (DOC-013).
