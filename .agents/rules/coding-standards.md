---
description: Coding standards for Hexagonal Architecture TypeScript backend
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

## File Organization

- One class per file
- Group imports: node_modules → project → relative
- Separate import groups with blank lines

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

## Error Rules

- Custom error classes (extend `AppError`)
- Include `statusCode` and `errorCode`
- Catch specific errors, not generic `catch (e)`
- Log with context (userId, requestId)

## Git Commit Format

```
<type>(<scope>): <short description>
```

Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`, `ci`
