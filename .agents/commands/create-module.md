---
description: Scaffold a new module with all necessary layers following Hexagonal Architecture
---

# Create Module Command

Scaffold a complete module with controller, service, repository, entity, mapper, routes, and validation schema.

## Steps

1. **Get module name** — From user argument (e.g., `/create-module product`)
2. **Read ARCHITECTURE.md** — Understand the project structure
3. **Create entity** — `src/core/entities/{module}.entity.ts` with interface and types
4. **Create ports** — `src/core/ports/{module}.port.ts` with repository interface
5. **Create service** — `src/core/services/{module}.service.ts` extending base Service class
6. **Create repository** — `src/adapters/repositories/{module}.repository.ts` extending base Repository
7. **Create mapper** — `src/mappers/{module}.mapper.ts` for camelCase ↔ snake_case conversion
8. **Create controller** — `src/transports/http/controllers/{module}.controller.ts`
9. **Create routes** — `src/transports/http/routes/{module}.routes.ts`
10. **Create validation** — `src/transports/http/validations/{module}.validation.ts`
11. **Register routes** — Add routes to the main router
12. **Create tests** — Basic test files for service and controller

## Usage

```
/create-module product
/create-module order
/create-module category
```
