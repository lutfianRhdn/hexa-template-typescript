---
description: Pre-commit verification checks
---

# Pre-Commit Hook

Run these checks before committing:

## Checks

1. **TypeScript compilation** — `npx tsc --noEmit`
2. **Lint** — `npm run lint` if available
3. **Architecture check** — Verify no cross-layer imports:
   - `src/core/` must NOT import from `src/adapters/`
   - `src/adapters/` must NOT import from `src/transports/`
4. **Test affected** — Run tests related to changed files
5. **Env check** — No secrets hardcoded in source files
6. **Console cleanup** — No stray `console.log` (use logger)

## On Failure

- Report which checks failed with file/line references
- Suggest fixes
- Do NOT commit until all checks pass
