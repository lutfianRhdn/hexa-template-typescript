---
description: Review deployment readiness — Dockerfile, CI/CD, env vars, health checks (Senior DevOps role)
---

# Deploy Check Command

Review deployment configuration as a Senior DevOps Engineer.

## Review Process

### 1. Dockerfile Audit
- Multi-stage build (builder → runner)
- Base image: `oven/bun:alpine` or `node:alpine`
- Non-root user (`USER bun` or `USER node`)
- Layer caching: copy `package.json`/`bun.lockb` before source
- `.dockerignore` excludes: `node_modules/`, `.env`, `*.log`, `.git/`, `tests/`
- `EXPOSE` correct port; `HEALTHCHECK` instruction present

### 2. Environment Variables
- All vars validated with Zod on startup (`src/configs/`)
- `.env.example` is present and complete
- Minimum required: `DATABASE_URL`, `JWT_SECRET`, `REFRESH_SECRET`, `PORT`, `NODE_ENV`

### 3. CI/CD Pipeline (GitHub Actions)
Gates in order: lint → test → build → migrate → deploy
- Uses `prisma migrate deploy` (NOT `migrate dev`)
- Dependencies cached (`bun install`)
- Secrets via GitHub Secrets (not plaintext)

### 4. Health Check Endpoint
- `/health` or `/healthz` exists
- Returns DB connectivity status
- 200 = healthy, 503 = unhealthy

### 5. Graceful Shutdown
- SIGTERM/SIGINT handled
- In-flight requests drained
- `prisma.$disconnect()` called
- Exits with code 0

## Output Format

```
## Deploy Readiness Report
### Summary: Ready: YES / NO / WITH_CONDITIONS

### Checklist
- [ ] Multi-stage Dockerfile
- [ ] Non-root user
- [ ] migrate deploy in CI
- [ ] Health endpoint exists
- [ ] Graceful shutdown

### Findings
#### 🔴 [BLOCKER] ...
#### 🟡 [WARNING] ...
```

## Usage

```
/deploy-check
/deploy-check Dockerfile
```
