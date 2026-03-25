---
description: Debug and fix errors in the application
---

# Fix Command

Diagnose and fix errors, whether build, runtime, or test failures.

## Steps

1. **Identify the error** — Read error or run `npm run build` / `npm test`
2. **Analyze root cause** — Trace to source file and line
3. **Check architecture** — Verify fix doesn't break layer separation
4. **Apply fix** — Minimal necessary change
5. **Verify** — Run `tsc --noEmit` and relevant tests
6. **Check side effects** — Ensure nothing else broke
7. **Report** — Summarize root cause and fix

## Usage

```
/fix                          # Fix build errors
/fix src/core/user.service.ts  # Fix specific file
```
