---
description: Hexagonal Architecture rules and constraints
---

# Architecture Rules

## Layer Structure

```
src/
├── transports/     → HTTP controllers, routes, validation (entry points)
├── core/           → Business logic: services, entities, ports (domain)
├── adapters/       → Database repositories, external API clients
├── mappers/        → Data transformation (camelCase ↔ snake_case)
├── configs/        → Configuration loaders
├── policies/       → Authorization policies
└── utils/          → Shared utilities
```

## Dependency Rules (STRICT)

1. **transports → core** ✅ Controllers call services
2. **transports → adapters** ✅ Controllers inject repositories into services
3. **core → core/ports** ✅ Services use port interfaces
4. **adapters → core/ports** ✅ Repositories implement ports
5. **core → adapters** ❌ NEVER
6. **adapters → transports** ❌ NEVER

## Service Rules

- MUST extend base `Service` class
- Receive repositories via constructor (injected by controller)
- Contain ALL business logic
- Return domain entities, not Prisma models
- Do NOT import from `adapters/` or `transports/`

## Repository Rules

- MUST extend base `Repository` class
- ONLY layer accessing Prisma
- Return raw data; services transform
- Granular methods: findById, findMany, create, update, delete

## Controller Rules

- Parse requests, call services, format responses
- Instantiate repos, inject into services
- NO business logic
- One method per route handler

## Mapper Rules

- All mappers in `src/mappers/`
- camelCase (code) ↔ snake_case (API/DB)
- Never inline field mapping

## Entity Rules

- All types/interfaces in `src/core/entities/`
- `interface` for domain entities
- `type` for DTOs, request/response shapes

## New Module Checklist

1. Entity → `src/core/entities/`
2. Port → `src/core/ports/`
3. Service → `src/core/services/` (extends Service)
4. Repository → `src/adapters/repositories/` (extends Repository)
5. Mapper → `src/mappers/`
6. Controller → `src/transports/http/controllers/`
7. Routes → `src/transports/http/routes/`
8. Validation → `src/transports/http/validations/`
9. Prisma model → `prisma/schema.prisma`
10. Tests
