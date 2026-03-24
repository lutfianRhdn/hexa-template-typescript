---
name: hexagonal-saas-template
description: Guide for developing with the Hexagonal TypeScript SaaS Template (multi-tenant)
---

# Hexagonal SaaS Template — AI Development Guide

## Architecture Overview

This is a **multi-tenant SaaS** REST API template using Hexagonal Architecture:
- **Core** (domain): entities, repository interfaces (ports), services
- **Adapters**: Prisma PostgreSQL with schema interception for multi-tenancy
- **Transport**: Express REST API with domain gate and tenant context

## Multi-Tenant Data Flow

### Domain Resolution
1. `domainGate` middleware resolves the request domain (via Host header or `x-domain-dev` header)
2. MASTER domain → platform admin context
3. TENANT domain → lookup `domain_mappings` table, resolve tenant

### Schema Interception
`PrismaClientManager.patchClientOnConnect()` intercepts all SQL queries on the tenant's pg pool and replaces `tenant_template` with the actual tenant schema name (e.g., `tenant_abc123`).

### Prisma Client Injection
Repositories receive their Prisma client via `setPrismaClient()`. The correct client (master or tenant-scoped) is injected from the controller layer based on the request context.

## Adding a New Resource (Tenant-Scoped)

### Step 1: Define Entity Types
Create `src/core/entities/<resource>/<resource>.ts`

### Step 2: Add Prisma Model to Business Schema
Update `prisma/prisma-business.schema.prisma` and regenerate: `bun run prisma:generate:business`

### Step 3: Implement Repository (Adapter)
Create repository extending base `Repository`. **Important**: do NOT hardcode the Prisma client. Use `setPrismaClient()` to receive it from the controller.

### Step 4: Create Service
Extend the base `Service` class.

### Step 5: Create Controller
In the controller, resolve the tenant Prisma client from `req.tenantPrisma` and inject it into the repository:
```typescript
import { TenantRequest } from '../../../core/entities/tenant/TenantContext';

export class MyController extends Controller<TMyResponse, TMetadata> {
  handleRequest = async (req: TenantRequest, res: Response) => {
    const repo = new MyRepository();
    repo.setPrismaClient(req.tenantPrisma); // Inject tenant-scoped client
    const service = new MyService(repo);
    // ... use service
  };
}
```

### Step 6: Create Router
Register it in `src/transports/api/routers/v1/index.ts` with appropriate middleware:
```typescript
import { authMiddleware } from '../../../../policies/authMiddleware';
import { tenantContextMiddleware } from '../../../../policies/tenantContextMiddleware';

v1Router.use('/my-resource', authMiddleware, tenantContextMiddleware, myResourceRouter);
```

## Key Patterns

### MASTER vs TENANT Routes
- MASTER routes: Only `authMiddleware`, access `req.masterPrisma`
- TENANT routes: `authMiddleware` + `tenantContextMiddleware`, access `req.tenantPrisma`

### Creating a New Tenant
Use `TenantSchemaProvisioner.provision(schemaName)` to clone the `tenant_template` schema. Then create the tenant record in master and add a domain mapping.

### Error Handling
Use custom errors from `src/core/errors/index.ts`. The error handler middleware catches them and returns standardized responses.

### Response Format
All responses follow: `{ status, message, data, metadata, errors }`
