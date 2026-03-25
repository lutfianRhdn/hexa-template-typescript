---
description: Create or update custom business rules in a module with confirmation flow
---

# Create Business Rules Command

Add or modify business rules in a module. Requires a clear business rules description and explicit user confirmation before making any changes.

## Input Requirements

1. **Business rules description** (REQUIRED) — The user MUST provide a clear description of the business rules. If not provided, ask for it before proceeding.
2. **Target** — Either a new module name OR an existing module to modify.

## Steps

### Phase 1: Gather & Understand

1. **Get business rules description** — Parse from argument or ask the user to describe:
   - What is the business rule?
   - What entities/modules are affected?
   - What validations/constraints are needed?
   - What are the edge cases?
2. **Determine target** — Is this:
   - A **new module**? → Will scaffold full module with business rules baked in
   - An **existing module**? → Will modify service/entity/validation layers
3. **Analyze impact** — Identify which files will be created or modified

### Phase 2: Confirm with User (MANDATORY)

4. **Present implementation plan** — Show the user:
   ```
   ## Business Rules Implementation Plan
   
   ### Rules Description
   [user's business rules description]
   
   ### Target: [new module / existing module name]
   
   ### Changes Required
   - [ ] Entity: [new fields, types, or constraints]
   - [ ] Service: [validation logic, business rules implementation]
   - [ ] Repository: [new queries if needed]
   - [ ] Validation Schema: [request validation updates]
   - [ ] Mapper: [new field mappings if needed]
   
   ### Implementation Details
   [detailed explanation of how each rule will be implemented]
   
   ### Edge Cases Handled
   [list of edge cases and how they're addressed]
   ```
5. **Wait for explicit confirmation** — Do NOT proceed without the user typing "yes", "ok", "proceed", or similar confirmation. If the user requests changes, update the plan and re-confirm.

### Phase 3: Implement (only after confirmation)

6. **For NEW module:**
   - Create entity with business rule constraints in `src/core/entities/`
   - Create port interface in `src/core/ports/`
   - Create service with business rules validation in `src/core/services/`
   - Create repository in `src/adapters/repositories/`
   - Create mapper in `src/mappers/`
   - Create controller in `src/transports/http/controllers/`
   - Create routes in `src/transports/http/routes/`
   - Create validation schema with business rule constraints in `src/transports/http/validations/`
   - Add Prisma model in `prisma/schema.prisma`

7. **For EXISTING module:**
   - Update entity types/interfaces in `src/core/entities/`
   - Add business rules validation methods in the service (`src/core/services/`)
   - Update repository methods if new queries needed (`src/adapters/repositories/`)
   - Update mapper if new fields added (`src/mappers/`)
   - Update validation schema for new constraints (`src/transports/http/validations/`)
   - Update Prisma model if schema changes needed

### Phase 4: Verify

8. **Compile check** — Run `npx tsc --noEmit`
9. **Architecture check** — Verify business rules live in service layer (NOT in controllers/repos)
10. **Review** — Self-review using `/review` command on affected files

## Business Rules Best Practices

- **Service layer ONLY** — All business rules MUST be implemented in the service layer
- **Validation at transport** — Input shape validation at transport layer, business validation in service
- **Custom errors** — Create specific error classes for business rule violations:
  ```typescript
  throw new BusinessRuleError('INSUFFICIENT_STOCK', 'Cannot order more than available stock');
  ```
- **Pure functions** — Extract complex rules into pure validation functions for testability
- **Guard clauses** — Use early returns for rule violations
- **Constants** — Extract magic numbers/thresholds into named constants
- **Documentation** — Add JSDoc explaining WHY the rule exists

## Usage

```
/create-business-rule
# Agent will ask for business rules description and target module

/create-business-rule order "Orders above 10M IDR require manager approval, minimum order quantity is 5, orders cannot be placed on weekends"

/create-business-rule --edit product "Products must have minimum margin of 20%, SKU format must be XX-YYYY-ZZZ, stock cannot go below safety threshold"
```

## Example Flow

```
User: /create-business-rule order "Discount max 30%, orders > 10M need approval"

Agent: Here's my implementation plan:

## Business Rules: Order Module
### Rules:
1. Maximum discount is 30%
2. Orders with total > 10,000,000 IDR require manager approval

### Changes:
- [x] Add `approval_status` field to Order entity
- [x] Add `validateDiscount()` in OrderService
- [x] Add `checkApprovalRequired()` in OrderService  
- [x] Update OrderValidation schema
- [x] Update Prisma Order model

Shall I proceed with this implementation? (yes/no)

User: yes

Agent: [implements the changes]
```
