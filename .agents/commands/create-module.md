---
description: Scaffold a new module for SaaS with tenant-aware layers
---

# Create Module Command

Scaffold a complete module with tenant-aware Hexagonal Architecture.

## Steps

1. **Get module name** — From argument (e.g., `/create-module product`)
2. **Determine scope** — Is this a **master** module (global) or **tenant** module (per-tenant)?
3. **Read ARCHITECTURE.md** — Understand project structure
4. **Create entity** — `src/core/entities/{module}.entity.ts`
5. **Create port** — `src/core/ports/{module}.port.ts`
6. **Create service** — `src/core/services/{module}.service.ts` (extends Service, tenant-agnostic)
7. **Create repository** — `src/adapters/repositories/{module}.repository.ts` (extends Repository)
   - If tenant module: use tenant Prisma client
   - If master module: use master Prisma client
8. **Create mapper** — `src/mappers/{module}.mapper.ts`
9. **Create controller** — `src/transports/http/controllers/{module}.controller.ts`
10. **Create routes** — `src/transports/http/routes/{module}.routes.ts`
    - If tenant module: include tenant middleware
11. **Create validation** — `src/transports/http/validations/{module}.validation.ts`
12. **Add Prisma model** — `prisma/business.prisma` (tenant) or `prisma/master.prisma` (global)
13. **Verify** — Run `tsc --noEmit`

## Usage

```
/create-module product      # Tenant module (default)
/create-module plan --master  # Master/global module
```
