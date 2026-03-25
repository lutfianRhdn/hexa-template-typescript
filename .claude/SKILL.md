---
name: Hexagonal Architecture Code Review
description: Comprehensive review skill for Hexagonal Architecture TypeScript backend projects
---

# Hexagonal Architecture Code Review Skill

## Overview
This skill provides structured guidance for reviewing TypeScript backend code built with Hexagonal Architecture (Ports & Adapters), ensuring architecture compliance, layer separation, and production-readiness.

## Review Process

### 1. Architecture Compliance (CRITICAL)
- **Layer separation** — Verify `transports/ → core/ → adapters/` flow
- **Dependency direction** — Inward only. Core NEVER imports from adapters or transports
- **Service isolation** — Services use ports (interfaces), NOT concrete repositories
- **Repository encapsulation** — ONLY repositories access Prisma client
- **Controller responsibility** — Controllers instantiate repos, inject into services, format responses
- **Inheritance** — All services extend `Service`, all repositories extend `Repository`

### 2. Dependency Injection Validation
- Repositories must be created in controllers and passed to service constructors
- Services must NOT instantiate their own repositories
- Check constructor signatures for proper injection pattern
- Validate that services are framework-agnostic (no Express imports)

### 3. Type Safety
- No `any` without documented justification
- All interfaces in `src/core/entities/`
- Return types explicit on public methods
- Proper null/undefined handling
- Domain entities used in service layer, NOT Prisma types

### 4. Mapper Usage
- All data transformation through mappers in `src/mappers/`
- camelCase in code, snake_case in API responses and DB
- No inline field mapping

### 5. Error Handling
- Custom error classes with statusCode and errorCode
- Async errors caught and propagated
- No swallowed errors
- Consistent error response format
- No sensitive data in error messages

### 6. Security
- Input validation on all endpoints (transport layer)
- Authentication middleware applied
- Authorization checks via policies
- No SQL injection (Prisma parameterized queries)
- Environment variables for secrets

### 7. Performance
- No N+1 queries
- Pagination implemented
- Selective field fetching
- Parallel async operations where possible

### 8. Code Quality
- SRP: Small, focused functions
- DRY: No duplication
- Clear naming matching conventions
- Comments explain WHY, not WHAT

## Review Output Format

```
## Review Summary
- **Overall**: PASS / NEEDS_CHANGES / REJECT
- **Architecture Compliance**: ✅ / ❌
- **Type Safety**: ✅ / ❌
- **Security**: ✅ / ❌

## Findings
### [🟡 Warning] Finding Title
- **File**: `src/core/services/user.service.ts`
- **Line**: 42
- **Issue**: Service directly imports repository
- **Fix**: Use port interface instead
```

## Common Anti-Patterns to Flag

| Anti-Pattern | Severity | Fix |
|---|---|---|
| Service imports from adapters | 🟥 Critical | Use port interface |
| Prisma used outside repository | 🟥 Critical | Move to repository |
| Business logic in controller | 🟧 Warning | Move to service |
| Service doesn't extend base class | 🟧 Warning | Add `extends Service` |
| Inline field mapping | 🟡 Info | Use mapper |
| Missing input validation | 🟧 Warning | Add at transport layer |
| `any` type usage | 🟧 Warning | Use proper type |
