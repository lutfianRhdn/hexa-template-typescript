---
description: Perform a comprehensive security audit of the codebase (Senior Cyber Security role)
---

# Security Audit Command

Perform a full security audit as a Senior Cyber Security Engineer.

## Audit Process

### 1. OWASP Top 10 Checklist

- **A01 Broken Access Control** — Every route has auth middleware; RBAC covers all roles
- **A02 Cryptographic Failures** — JWT uses HS256/RS256 (never `none`); bcrypt cost ≥ 12; no secrets in logs
- **A03 Injection** — Prisma parameterized queries; Zod validation on all request bodies; no raw SQL with user input
- **A04 Insecure Design** — Refresh token rotation; rate limiting on auth endpoints
- **A05 Security Misconfiguration** — Helmet.js configured; CORS allowlist (no `*`); `X-Powered-By` disabled
- **A06 Vulnerable Components** — `npm audit --audit-level=high`; CRITICAL and HIGH findings listed
- **A07 Auth & Session Failures** — Access token ≤ 15m; refresh token ≤ 7d with rotation; tokens invalidated on logout
- **A09 Logging & Monitoring** — Failed auth attempts logged; no PII in logs; structured logging with correlation IDs

### 2. Input Validation Sweep

- List all controllers in `src/transports/http/controllers/`
- Confirm Zod validation schema exists for each request body
- Flag any controller reading `req.body` without prior validation

### 3. Secrets Scan

- Search for hardcoded: `password`, `secret`, `token`, `key`, `api_key`
- Verify all secrets come from `process.env` via `src/configs/`

## Output Format

```
## Security Audit Report

### Summary
- CRITICAL: X | HIGH: X | MEDIUM: X | LOW: X
- Overall Risk: CRITICAL / HIGH / MEDIUM / LOW

### Findings

#### 🟥 [CRITICAL] Finding Title
- **File**: `src/path/to/file.ts:42`
- **Issue**: Description
- **Impact**: What an attacker can do
- **Fix**: Concrete remediation
```

## Usage

```
/security-audit
/security-audit src/transports/http/routes/auth.routes.ts
```
