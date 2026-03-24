# Arsitektur

## Hexagonal Architecture (Ports and Adapters)

Project ini mengimplementasikan Hexagonal Architecture dengan lapisan:

### Core (Domain)
- `src/core/entities/` — Domain types (interface TypeScript)
- `src/core/repositories/` — Port / interface repository
- `src/core/services/` — Business logic

### Adapters (Infrastructure)
- `src/adapters/postgres/` — Implementasi repository dengan Prisma
- `src/adapters/redis/` — Cache adapter (opsional)

### Transport
- `src/transports/api/` — Express REST API
  - `controllers/` — Request handler
  - `routers/` — Route definitions
  - `validations/` — Zod schemas
  - `middlewares/` — Express middlewares

### Mappers
- `src/mappers/mappers/` — DB record → Entity
- `src/mappers/response-mappers/` — Entity → HTTP Response DTO

### Policies
- `src/policies/` — Auth, role, domain middleware

## Alur Request

```
HTTP Request
  → Router
  → Validation (Zod)
  → Middleware (Auth, Domain Gate, Tenant Context)
  → Controller
  → Service (Business Logic)
  → Repository (Port)
  → Repository Implementation (Prisma)
  → Database (PostgreSQL)
```

## Response Format

Semua endpoint mengikuti format standar:

```json
{
  "status": "success | failed",
  "message": "...",
  "data": {},
  "metadata": {
    "page": 1,
    "limit": 20,
    "total_records": 100,
    "total_pages": 5
  },
  "errors": []
}
```

## Perbedaan base-template vs saas-template

| Fitur | base-template | saas-template |
|---|---|---|
| Prisma schema | 1 (public) | 2 (master + tenant_template) |
| Auth | JWT single domain | JWT multi domain (MASTER / TENANT) |
| Multi-tenant | ❌ | ✅ |
| Schema provisioning | ❌ | ✅ |
| Domain detection | ❌ | ✅ |
| `x-domain-dev` header | ❌ | ✅ |
| Seed data tenant | ❌ | ✅ |
