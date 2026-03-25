---
description: Debug and fix errors in the SaaS application
---

# Fix Command

Diagnose and fix errors including tenant-related issues.

## Steps

1. **Identify the error** — Read error or run `npm run build` / `npm test`
2. **Check tenant context** — If error involves data access, verify tenant context flow
3. **Analyze root cause** — Trace to source file and line
4. **Check Prisma client** — Verify correct client used (master vs tenant)
5. **Check architecture** — Ensure fix doesn't break layer separation
6. **Apply fix** — Minimal necessary change
7. **Verify** — Run `tsc --noEmit` and relevant tests
8. **Check side effects** — Especially cross-tenant impact
9. **Report** — Summarize root cause and fix

## Usage

```
/fix                          # Fix build errors
/fix src/core/user.service.ts  # Fix specific file
```
