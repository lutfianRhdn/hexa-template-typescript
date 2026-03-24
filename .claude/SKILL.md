---
name: hexagonal-base-template
description: Guide for developing with the Hexagonal TypeScript Base Template (single-tenant)
---

# Hexagonal Base Template — AI Development Guide

## Architecture Overview

This is a **single-tenant** REST API template using Hexagonal Architecture:
- **Core** (domain): entities, repository interfaces (ports), services
- **Adapters**: Prisma PostgreSQL implementation
- **Transport**: Express REST API

## Adding a New Resource

### Step 1: Define Entity Types
Create `src/core/entities/<resource>/<resource>.ts`:
```typescript
export type TResource = {
  id: string;
  name: string;
  // ... fields matching Prisma model
  createdAt: Date;
  updatedAt: Date;
}
```

### Step 2: Define Repository Interface (Port)
Create `src/core/repositories/<resource>/<Resource>Repository.ts`:
```typescript
import Repository from "../Repository";
import { TResource } from "../../entities/<resource>/<resource>";

export default interface ResourceRepository extends Repository<TResource> {
  // Add custom query methods here
}
```

### Step 3: Add Prisma Model
Update `prisma/schema.prisma` with the new model.

### Step 4: Implement Repository (Adapter)
Create `src/adapters/postgres/repositories/<Resource>Repository.ts` extending the base Repository.

### Step 5: Create Service
Create `src/core/services/<Resource>Service.ts` extending Service.

### Step 6: Create Controller
Create `src/transports/api/controllers/<Resource>Controller.ts` extending Controller.

### Step 7: Create Router
Create `src/transports/api/routers/v1/<resources>.router.ts` and register it in `index.ts`.

### Step 8: Add Validation
Create `src/transports/api/validations/<resource>.validation.ts` with Zod schemas.

## Key Patterns

### Repository Injection
Repositories receive PrismaClient via `setPrismaClient()`. In the base template, this is the single global `prisma` instance from `src/adapters/postgres/instance.ts`.

### Response Format
All responses follow: `{ status, message, data, metadata, errors }`

### Error Handling
Use custom errors from `src/core/errors/index.ts`: `NotFoundError`, `ValidationError`, `AuthenticationError`, etc.
