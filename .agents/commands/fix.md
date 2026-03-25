---
description: Debug and fix errors in the application
---

# Fix Command

Diagnose and fix errors, whether they are build errors, runtime errors, or test failures.

## Steps

1. **Identify the error** — Read error message from user or run `npm run build` / `npm test` to reproduce
2. **Analyze root cause** — Trace the error to its source file and line
3. **Check related files** — Review imports, types, and dependencies involved
4. **Apply fix** — Make the minimal necessary change to resolve the issue
5. **Verify fix** — Run `tsc --noEmit` to check compilation, then run relevant tests
6. **Check for side effects** — Ensure the fix doesn't break other functionality
7. **Report** — Summarize what was wrong and what was fixed

## Usage

```
/fix                          # Fix build errors
/fix src/core/user.service.ts  # Fix specific file
/fix "TypeError: Cannot read properties of undefined"  # Fix specific error
```
