---
description: Coding standards for SaaS multi-tenancy TypeScript backend
---

# Coding Standards

## Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Files | `kebab-case.ts` | `user-service.ts` |
| Classes | `PascalCase` | `UserService` |
| Interfaces | `PascalCase` | `UserEntity` |
| Functions/Methods | `camelCase` | `getUserById` |
| Variables | `camelCase` | `userName` |
| Constants | `SCREAMING_SNAKE` | `MAX_RETRY_COUNT` |
| DB columns | `snake_case` | `created_at` |
| API response keys | `snake_case` | `user_name` |
| Tenant schemas | `snake_case` | `tenant_acme_corp` |

## Function Rules

- Max 30 lines per function (aim for 15-20)
- Max 3 parameters; use options object for more
- Always declare return types on public methods
- Early returns over deep nesting
- `async/await` over `.then()` chains

## Type Rules

- **NEVER** use `any` without justification
- Use `unknown` for truly unknown types
- Use `readonly` for immutable properties
- All types/interfaces in `src/core/entities/`
- Separate master entity types from tenant entity types

## Tenant-Specific Rules

- Always include `tenantId` in log context
- Tenant middleware MUST run before tenant route handlers
- Never trust client-provided tenant identifiers without validation
- Connection pooling must account for schema count

## Git Commit Format

```
<type>(<scope>): <short description>
```

Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`, `ci`
