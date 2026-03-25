---
description: Coding standards and conventions for TypeScript backend development
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

- One class per file (exceptions: small related classes/interfaces)
- Export at the bottom of the file or use named exports inline
- Group imports: node_modules → project modules → relative imports
- Separate import groups with blank lines

## Function Rules

- Max 30 lines per function (aim for 15-20)
- Max 3 parameters. Use an options object for more
- Always declare return types on public methods
- Use early returns to reduce nesting
- Prefer `async/await` over `.then()` chains

## Type Rules

- **NEVER** use `any` without a `// eslint-disable-next-line` comment explaining why
- Use `unknown` instead of `any` for truly unknown types
- Use discriminated unions over broad types
- Use `readonly` for properties that should not change
- Define all types/interfaces in `src/core/entities/`

## Error Rules

- Always use custom error classes (extend `AppError`)
- Include `statusCode` and `errorCode` in every error
- Catch specific errors, not generic `catch (e)`
- Log errors with context (userId, requestId, operation)

## Comment Rules

- Don't comment WHAT the code does (it should be self-documenting)
- Comment WHY the code makes a specific choice
- Use JSDoc for public APIs
- TODO comments must include ticket/issue reference

## Git Commit Format

```
<type>(<scope>): <short description>

<body - optional, explain WHY not WHAT>

<footer - optional, breaking changes or issue refs>
```

Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`, `ci`
