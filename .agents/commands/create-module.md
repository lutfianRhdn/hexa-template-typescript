---
description: Scaffold a new module following Hexagonal Architecture pattern
---

# Create Module Command

Scaffold a complete module with all layers following Hexagonal Architecture.

## Steps

1. **Get module name** — From argument (e.g., `/create-module product`)
2. **Read ARCHITECTURE.md** — Understand project structure
3. **Create entity** — `src/core/entities/{module}.entity.ts`
4. **Create port** — `src/core/ports/{module}.port.ts` (repository interface)
5. **Create service** — `src/core/services/{module}.service.ts` (extends Service, uses port)
6. **Create repository** — `src/adapters/repositories/{module}.repository.ts` (extends Repository, implements port)
7. **Create mapper** — `src/mappers/{module}.mapper.ts`
8. **Create controller** — `src/transports/http/controllers/{module}.controller.ts`
9. **Create routes** — `src/transports/http/routes/{module}.routes.ts`
10. **Create validation** — `src/transports/http/validations/{module}.validation.ts`
11. **Register routes** — Add to main router/app
12. **Add Prisma model** — Add model to `prisma/schema.prisma`
13. **Verify** — Run `tsc --noEmit` to check compilation

## Important Rules

- Service MUST extend base `Service` class
- Repository MUST extend base `Repository` class
- Service uses port interface, NOT concrete repository
- Controller instantiates repo and injects into service
- Mapper handles camelCase ↔ snake_case

## Usage

```
/create-module product
/create-module order
```
