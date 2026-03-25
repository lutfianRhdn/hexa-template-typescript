---
description: Review code for quality, security, and architecture compliance
---

# Code Review Command

Perform a comprehensive code review on the specified files or recent changes.

## Steps

1. **Identify scope** — Determine which files or changes to review (from args, staged files, or recent commits)
2. **Read the `.claude/SKILL.md`** — Load the review skill for structured review criteria
3. **Architecture check** — Verify layer separation and dependency direction
4. **Type safety check** — Look for `any` usage, missing return types, improper null handling
5. **Security check** — Validate input handling, auth, and data exposure
6. **Performance check** — Look for N+1 queries, missing pagination, unoptimized fetches
7. **Error handling check** — Verify consistent error patterns, no swallowed errors
8. **Output structured review** — Present findings using the review output format from SKILL.md

## Usage

```
/review                    # Review recent changes (git diff)
/review src/core/          # Review specific directory
/review src/core/user.ts   # Review specific file
```
