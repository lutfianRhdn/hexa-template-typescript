---
description: Architecture rules and constraints for the backend project
---

# Architecture Rules

## Layer Structure

```
src/
├── transports/     → HTTP controllers, routes, validation (entry points)
├── core/           → Business logic: services, entities, ports (domain)
├── adapters/       → Database repositories, external API clients (implementations)
├── mappers/        → Data transformation (camelCase ↔ snake_case)
├── configs/        → Configuration loaders
├── policies/       → Authorization policies
└── utils/          → Shared utilities (logger, helpers)
```

## Dependency Rules (STRICT)

1. **transports → core** ✅ Controllers can call services
2. **core → (nothing external)** ✅ Services use ports (interfaces), not implementations
3. **adapters → core** ✅ Repositories implement ports defined in core
4. **transports → adapters** ✅ Controllers inject repositories into services
5. **core → adapters** ❌ NEVER. Services must NOT import repositories directly
6. **adapters → transports** ❌ NEVER. No reverse dependencies

## Service Rules

- All services MUST extend the base `Service` class
- Services receive repositories via constructor injection (injected by controller)
- Services contain ALL business logic
- Services return domain entities, not Prisma models
- Services do NOT import from `adapters/` or `transports/`

## Repository Rules

- All repositories MUST extend the base `Repository` class
- Repositories are the ONLY layer that accesses the database (Prisma)
- Repositories return raw data, services transform it
- Repository methods should be granular (findById, findMany, create, update, delete)
- Complex queries stay in repositories, not services

## Controller Rules

- Controllers parse requests and call services
- Controllers format service responses to HTTP responses
- Controllers instantiate repositories and inject into services
- Controllers do NOT contain business logic
- One controller method per route handler

## Mapper Rules

- All mappers live in `src/mappers/`
- Use mappers for converting between camelCase (code) and snake_case (API/DB)
- Never do manual field mapping inline — use mapper functions

## Entity Rules

- All types and interfaces in `src/core/entities/`
- Use interfaces for domain entities
- Use types for DTOs, request/response shapes
- Entities represent the domain model, not the database schema

## Adding a New Module Checklist

- [ ] Entity in `src/core/entities/`
- [ ] Port (interface) in `src/core/ports/`
- [ ] Service in `src/core/services/` (extends Service)
- [ ] Repository in `src/adapters/repositories/` (extends Repository)
- [ ] Mapper in `src/mappers/`
- [ ] Controller in `src/transports/http/controllers/`
- [ ] Routes in `src/transports/http/routes/`
- [ ] Validation schema in `src/transports/http/validations/`
- [ ] Prisma model in `prisma/schema.prisma`
- [ ] Tests for service layer
