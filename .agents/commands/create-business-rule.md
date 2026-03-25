---
description: Create or update custom business rules in a module with confirmation flow (tenant-aware)
---

# Create Business Rules Command

Add or modify business rules in a module. Requires a clear business rules description and explicit user confirmation before making any changes. Handles both master-level and tenant-level business rules.

## Input Requirements

1. **Business rules description** (REQUIRED) — The user MUST provide a clear description of the business rules. If not provided, ask for it before proceeding.
2. **Target** — Either a new module name OR an existing module to modify.
3. **Scope** — Is this a master (global) rule or a tenant-scoped rule?

## Steps

### Phase 1: Gather & Understand

1. **Get business rules description** — Parse from argument or ask the user to describe:
   - What is the business rule?
   - What entities/modules are affected?
   - What validations/constraints are needed?
   - What are the edge cases?
   - Is this a **master** rule (applies globally) or a **tenant** rule (per-tenant)?
2. **Determine target** — Is this:
   - A **new module**? → Will scaffold full module with business rules baked in
   - An **existing module**? → Will modify service/entity/validation layers
3. **Determine scope** — Master or tenant:
   - **Master rules** → Affect `master.prisma`, use master Prisma client
   - **Tenant rules** → Affect `business.prisma`, use tenant Prisma client
4. **Analyze impact** — Identify which files will be created or modified

### Phase 2: Confirm with User (MANDATORY)

5. **Present implementation plan** — Show the user:
   ```
   ## Business Rules Implementation Plan
   
   ### Rules Description
   [user's business rules description]
   
   ### Target: [new module / existing module name]
   ### Scope: [Master / Tenant]
   
   ### Changes Required
   - [ ] Entity: [new fields, types, or constraints]
   - [ ] Service: [validation logic, business rules implementation]
   - [ ] Repository: [new queries, correct Prisma client]
   - [ ] Validation Schema: [request validation updates]
   - [ ] Mapper: [new field mappings if needed]
   - [ ] Prisma Model: [master.prisma / business.prisma]
   
   ### Tenant Impact
   - [ ] Affects existing tenant data: [yes/no]
   - [ ] Requires migration on all tenant schemas: [yes/no]
   - [ ] Cross-tenant implications: [none / describe]
   
   ### Implementation Details
   [detailed explanation of how each rule will be implemented]
   
   ### Edge Cases Handled
   [list of edge cases and how they're addressed]
   ```
6. **Wait for explicit confirmation** — Do NOT proceed without the user typing "yes", "ok", "proceed", or similar. If the user requests changes, update the plan and re-confirm.

### Phase 3: Implement (only after confirmation)

7. **For NEW module:**
   - Create entity in `src/core/entities/`
   - Create port in `src/core/ports/`
   - Create service in `src/core/services/` with business rules (tenant-agnostic)
   - Create repository in `src/adapters/repositories/` (tenant-aware or master)
   - Create mapper in `src/mappers/`
   - Create controller in `src/transports/http/controllers/`
   - Create routes in `src/transports/http/routes/` (with tenant middleware if tenant-scoped)
   - Create validation in `src/transports/http/validations/`
   - Add Prisma model in `prisma/business.prisma` or `prisma/master.prisma`

8. **For EXISTING module:**
   - Update entity types in `src/core/entities/`
   - Add business rules validation in service (`src/core/services/`)
   - Update repository if new queries needed (`src/adapters/repositories/`)
   - Update mapper if new fields (`src/mappers/`)
   - Update validation schema (`src/transports/http/validations/`)
   - Update Prisma model if schema changes needed

### Phase 4: Verify

9. **Compile check** — Run `npx tsc --noEmit`
10. **Architecture check** — Business rules in service layer ONLY
11. **Tenant check** — Correct Prisma client used, tenant middleware applied
12. **Review** — Self-review using `/review` command

## Business Rules Best Practices

- **Service layer ONLY** — ALL business rules MUST live in the service layer
- **Tenant-agnostic services** — Services should NOT know about schema switching
- **Validation layers**: Input shape validation at transport, business validation in service
- **Custom errors** — Specific error classes for rule violations:
  ```typescript
  throw new BusinessRuleError('INSUFFICIENT_STOCK', 'Cannot order more than available stock');
  throw new BusinessRuleError('TENANT_LIMIT_REACHED', 'Maximum users per tenant exceeded');
  ```
- **Pure functions** — Extract complex rules for testability
- **Guard clauses** — Early returns for violations
- **Constants** — Named thresholds, no magic numbers
- **Tenant-aware logging** — Always include tenantId in log context

## Usage

```
/create-business-rule
# Agent will ask for description, target, and scope

/create-business-rule order "Orders above 10M IDR require approval, min quantity 5, no weekend orders"

/create-business-rule --edit product "Min margin 20%, SKU format XX-YYYY-ZZZ, safety stock threshold"

/create-business-rule --master subscription "Max 3 tenants per free plan, auto-suspend after 30 days unpaid"
```

## Example Flow

```
User: /create-business-rule order "Discount max 30%, orders > 10M need approval"

Agent: Here's my implementation plan:

## Business Rules: Order Module (Tenant-scoped)
### Rules:
1. Maximum discount is 30%
2. Orders with total > 10,000,000 IDR require manager approval

### Changes:
- [x] Add `approval_status` field to Order entity
- [x] Add `validateDiscount()` in OrderService
- [x] Add `checkApprovalRequired()` in OrderService
- [x] Update OrderValidation schema
- [x] Update `business.prisma` Order model
- [x] Tenant middleware verified on order routes

### Tenant Impact:
- Requires migration on all tenant schemas
- No cross-tenant implications

Shall I proceed? (yes/no)

User: yes

Agent: [implements the changes]
```
