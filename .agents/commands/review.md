---
description: Review code for quality, security, and Hexagonal Architecture compliance
---

# Code Review Command

Perform a comprehensive code review focused on Hexagonal Architecture compliance.

## Steps

1. **Identify scope** — Determine which files or changes to review
2. **Read `.claude/SKILL.md`** — Load the review skill for structured criteria
3. **Architecture compliance** — Verify layer separation, dependency direction, DI pattern
4. **Inheritance check** — All services extend `Service`, all repos extend `Repository`
5. **Type safety** — No `any`, proper return types, domain entities in services
6. **Mapper usage** — Data transformation through mappers, not inline
7. **Security** — Input validation, auth, data exposure
8. **Performance** — N+1 queries, pagination, selective fetching
9. **Error handling** — Custom errors, no swallowed exceptions
10. **Output structured review** — Use review format from SKILL.md

## Usage

```
/review                    # Review recent changes (git diff)
/review src/core/          # Review core layer
/review src/adapters/      # Review adapter layer
```
