---
description: Pre-commit verification checks before any git commit
---

# Pre-Commit Hook

Run these checks before committing code:

## Checks

1. **TypeScript compilation** — Run `npx tsc --noEmit` to verify no type errors
2. **Lint check** — Run `npm run lint` if available
3. **Test affected** — Run tests related to changed files
4. **Import check** — Verify no circular imports introduced
5. **Env check** — Ensure no secrets or `.env` values are hardcoded in source files
6. **Console cleanup** — Check for stray `console.log` statements (should use logger)

## On Failure

- Report which checks failed with specific file and line references
- Suggest fixes for each failure
- Do NOT commit until all checks pass
