---
description: SaaS multi-tenancy architecture rules and constraints
---

# Architecture Rules

## Layer Structure

```
src/
├── transports/     → HTTP controllers, routes, validation, tenant middleware
├── core/           → Business logic: services, entities, ports (tenant-agnostic)
├── adapters/       → Repositories (tenant-aware & master), external clients
├── mappers/        → Data transformation (camelCase ↔ snake_case)
├── configs/        → Configuration, tenant config
├── policies/       → Authorization policies, tenant guards
└── utils/          → Shared utilities
```

## Dependency Rules (STRICT)

1. **transports → core** ✅ Controllers call services
2. **transports → adapters** ✅ Controllers inject repos
3. **core → core/ports** ✅ Services use port interfaces
4. **adapters → core/ports** ✅ Repos implement ports
5. **core → adapters** ❌ NEVER
6. **adapters → transports** ❌ NEVER

## Multi-Tenancy Rules (CRITICAL)

- **Dual Prisma schemas**: `master.prisma` (public) + `business.prisma` (tenant)
- **Master client** for: tenants, plans, subscriptions, global config
- **Tenant client** for: users, products, orders (business data)
- **Schema switching** happens at repository/middleware level
- **Services are tenant-agnostic** — they don't know about schemas
- **NEVER** query tenant data without tenant context
- **NEVER** use master client for tenant-scoped data

## Service Rules

- MUST extend base `Service` class
- Constructor injection for repositories
- ALL business logic here
- Tenant-agnostic (no schema knowledge)
- Return domain entities, not Prisma models

## Repository Rules

- MUST extend base `Repository` class
- ONLY layer accessing Prisma
- **Tenant repos** use tenant Prisma client
- **Master repos** use master Prisma client
- Granular methods: findById, findMany, create, update, delete

## Controller Rules

- Parse requests, call services, format responses
- Instantiate repos with correct Prisma client
- Inject repos into services
- NO business logic

## New Module Checklist

1. Determine: master or tenant module?
2. Entity → `src/core/entities/`
3. Port → `src/core/ports/`
4. Service → `src/core/services/` (extends Service)
5. Repository → `src/adapters/repositories/` (extends Repository, correct client)
6. Mapper → `src/mappers/`
7. Controller → `src/transports/http/controllers/`
8. Routes → `src/transports/http/routes/` (tenant middleware if tenant module)
9. Validation → `src/transports/http/validations/`
10. Prisma model → `business.prisma` or `master.prisma`
11. Tests with tenant context
