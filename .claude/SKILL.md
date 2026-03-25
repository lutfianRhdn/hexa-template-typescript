---
name: Backend Code Review & Architecture
description: Skill for reviewing backend TypeScript code quality, architecture compliance, and best practices
---

# Backend Code Review & Architecture Skill

## Overview
This skill provides structured guidance for reviewing TypeScript backend code, ensuring architecture compliance, code quality, and production-readiness.

## Review Process

### 1. Architecture Compliance
- Verify layer separation (transport → core → adapters)
- Check dependency direction (inward only)
- Ensure business logic lives in services, not controllers or repositories
- Validate that repositories are the only layer accessing the database
- Confirm dependency injection pattern is used correctly

### 2. Type Safety
- No usage of `any` without documented justification
- Proper use of interfaces for object shapes
- Generic types used where appropriate
- Return types explicitly declared on public methods
- Null/undefined handled explicitly

### 3. Error Handling
- Custom error classes with proper HTTP status codes
- Async errors caught and propagated correctly
- No swallowed errors (empty catch blocks)
- Error responses follow consistent format
- Sensitive information not leaked in error messages

### 4. Security Review
- Input validation on all endpoints
- Authentication middleware applied where needed
- Authorization checks before data access
- No SQL injection vulnerabilities
- Environment variables used for secrets
- CORS properly configured

### 5. Performance Review
- No N+1 query patterns
- Proper pagination implemented
- Unnecessary data not fetched from database
- Independent async operations parallelized
- Database indexes considered for query patterns

### 6. Code Quality
- Functions are small and focused (SRP)
- Naming is clear and consistent
- No code duplication (DRY)
- Comments explain "why", not "what"
- Magic numbers/strings extracted to constants

### 7. Testing
- Unit tests for business logic
- Edge cases covered
- Test names describe behavior, not implementation
- Mocks used appropriately (not over-mocking)

## Review Output Format

When reviewing code, provide feedback in this structure:

```
## Review Summary
- **Overall**: PASS / NEEDS_CHANGES / REJECT
- **Severity**: Info / Warning / Critical

## Findings
### [Category] Finding Title
- **File**: `path/to/file.ts`
- **Line**: 42
- **Severity**: Warning
- **Issue**: Description of the problem
- **Suggestion**: How to fix it
```
