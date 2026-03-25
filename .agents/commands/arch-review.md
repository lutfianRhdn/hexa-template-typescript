---
description: Full architecture review with refactoring recommendations (Senior Software Engineer role)
---

# Architecture Review Command

Comprehensive architecture and code quality review as a Senior Software Engineer.

## Review Process

### 1. Layer Boundary Analysis
Verify import directions:
- `transports/` → `core/services/` ✅
- `transports/` → `adapters/repositories/` ✅ (DI only)
- `core/services/` → `core/ports/` ✅
- `adapters/repositories/` → `core/ports/` ✅

Flag violations:
- `core/` → `adapters/` — 🟥 CRITICAL
- `core/` → `transports/` — 🟥 CRITICAL
- Express types in `core/` — 🟧 HIGH
- Prisma types in `core/services/` — 🟧 HIGH

### 2. Inheritance Compliance
- Every service must `extend Service`
- Every repository must `extend Repository`

### 3. DI Pattern
- Repositories created in controllers, passed to service constructors
- Flag `new SomeRepository()` inside service files

### 4. Code Quality
- SRP: flag services with > 5 public methods
- DRY: duplicated validation/mapping logic
- YAGNI: abstractions with only one implementation
- Cyclomatic complexity > 10 branches

### 5. TypeScript Quality
- `any` usage (flag every instance)
- Missing return types on public methods
- Unsafe `!` non-null assertions

### 6. Performance Anti-Patterns
- N+1 queries (loops with `await repository.findById()`)
- Missing pagination on list endpoints
- Sequential `await` calls that could be `Promise.all`

### 7. Test Coverage Gaps
- Services without unit tests
- Controllers without integration tests
- Missing edge case tests (not found, validation failure, unauthorized)

## Output Format

```
## Architecture Review Report

### Overall Assessment
- **Verdict**: PASS / NEEDS_CHANGES / REJECT
- **Quality Score**: A / B / C / D

### Layer Violations
...

### Code Quality Findings
#### 🟥 [CRITICAL] Finding
- **File**: `src/path/to/file.ts:42`
- **Issue**: ...
- **Fix**: ...

### Summary
| Priority | Count | Items |
```

## Usage

```
/arch-review
/arch-review src/core/services/
```
