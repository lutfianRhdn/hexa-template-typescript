---
name: SaaS Multi-Tenancy Architecture Review
description: Review skill for SaaS applications with schema-based multi-tenancy and Hexagonal Architecture
---

# SaaS Multi-Tenancy Architecture Review Skill

## Overview
Comprehensive review skill for TypeScript SaaS backend with Hexagonal Architecture and schema-based multi-tenancy. Focuses on tenant isolation, data security, and architecture compliance.

## Review Process

### 1. Tenant Isolation (CRITICAL — Review First)
- **Schema isolation** — Verify each tenant query uses tenant-specific Prisma client
- **No cross-tenant access** — Check that data queries are scoped to tenant context
- **Tenant context propagation** — Tenant resolved from request and passed through layers
- **Master vs tenant client** — Verify correct Prisma client used per operation
- **No hardcoded schemas** — Schema derived from tenant context, never hardcoded
- **Tenant validation** — Tenant status checked before processing (active, suspended, etc.)

### 2. Architecture Compliance
- **Layer separation** — `transports/ → core/ → adapters/` flow
- **Dependency direction** — Inward only. Core NEVER imports from adapters/transports
- **Service isolation** — Services use ports, NOT concrete repositories
- **Repository encapsulation** — ONLY repos access Prisma
- **Inheritance** — All services extend `Service`, all repos extend `Repository`
- **Services are tenant-agnostic** — Services don't handle schema switching

### 3. Type Safety
- No `any` without justification
- Tenant types properly defined
- Return types explicit on public methods
- Domain entities vs Prisma models separation
- Master entities vs tenant entities properly separated

### 4. Security
- Input validation on all endpoints
- Tenant middleware on all tenant-scoped routes
- JWT includes tenant claim
- Authorization checked per-tenant
- No tenant IDs or schema names leaked in responses
- Rate limiting per tenant

### 5. Performance
- No N+1 queries
- Connection pooling accounts for multiple schemas
- Pagination implemented
- Tenant-specific caching where appropriate

### 6. Data Migration Safety
- Schema migrations don't conflict between master/tenant
- Seed scripts are idempotent and tenant-aware
- No destructive operations without tenant scoping

## Review Output Format

```
## Review Summary
- **Overall**: PASS / NEEDS_CHANGES / REJECT
- **Tenant Isolation**: ✅ / ❌
- **Architecture Compliance**: ✅ / ❌
- **Security**: ✅ / ❌

## Findings
### [🟥 Critical] Tenant Isolation Vulnerability
- **File**: `src/adapters/repositories/order.repository.ts`
- **Line**: 25
- **Issue**: Using master Prisma client for tenant data query
- **Fix**: Use tenant-scoped Prisma client
```

## Common Anti-Patterns to Flag

| Anti-Pattern | Severity | Fix |
|---|---|---|
| Tenant data queried without tenant context | 🟥 Critical | Add tenant middleware |
| Master client used for tenant data | 🟥 Critical | Use tenant client |
| Hardcoded schema name | 🟥 Critical | Derive from tenant context |
| Cross-tenant data access | 🟥 Critical | Scope query to tenant |
| Service imports from adapters | 🟥 Critical | Use port interface |
| Prisma used outside repository | 🟥 Critical | Move to repository |
| Tenant ID leaked in response | 🟧 Warning | Remove from response |
| Business logic in controller | 🟧 Warning | Move to service |
| Missing tenant validation | 🟧 Warning | Add tenant status check |
| `any` type usage | 🟧 Warning | Use proper type |
