---
description: Review code for quality, security, tenant isolation, and architecture compliance
---

# Code Review Command

Perform a comprehensive code review with focus on SaaS multi-tenancy and Hexagonal Architecture.

## Steps

1. **Identify scope** — Determine which files or changes to review
2. **Read `.claude/SKILL.md`** — Load the SaaS review skill
3. **Tenant isolation check** — Verify tenant context, correct Prisma client, no cross-tenant access
4. **Architecture compliance** — Layer separation, dependency direction, DI pattern
5. **Inheritance check** — Services extend `Service`, repos extend `Repository`
6. **Type safety** — No `any`, proper return types, domain entities in services
7. **Security** — Tenant middleware, JWT validation, no data leakage
8. **Performance** — N+1 queries, connection pooling, pagination
9. **Error handling** — Tenant-specific errors, no internals exposed
10. **Output structured review** — Use format from SKILL.md

## Usage

```
/review                    # Review recent changes
/review src/core/          # Review core layer
/review src/adapters/      # Review adapter layer (check tenant clients)
```
