# Hexagonal TypeScript API — SaaS Template

Multi-tenant SaaS REST API template berbasis **Hexagonal Architecture** (Ports and Adapters).

## Tech Stack
- Runtime: **Bun**
- Framework: **Express.js**
- ORM: **Prisma** (PostgreSQL, dual schema)
- Multi-tenant: Schema interception via `pg` pool patching
- Auth: **JWT** (multi-domain: MASTER / TENANT)
- Validation: **Zod**
- Logging: **Winston** + Daily Rotate

## Quick Start

```bash
# Install dependencies
bun install

# Copy and edit env
cp .env.example .env

# Generate Prisma clients (master + business)
bun run prisma:generate:all

# Push schemas to database
bun run prisma:push:all

# Seed initial data (admin user, tenant_template schema)
bun run prisma:seed

# Run development server
bun run start:dev
```

## Multi-Tenant Architecture

### Dual Prisma Schema
- `prisma-master.schema.prisma` — Platform tables: User (master admin), Tenant, SchemaRegistry, DomainMapping
- `prisma-business.schema.prisma` — Tenant tables: User, Profile, Setting (all in `tenant_template` schema)

### Schema Interception
`PrismaClientManager` patches the `pg` pool to replace `tenant_template` with the actual tenant schema name at runtime. Each tenant gets its own PostgreSQL schema with identical table structure.

### Domain Resolution Flow
```
Request → domainGate → authMiddleware → tenantContextMiddleware → Controller
                │                                    │
                ├─ MASTER domain → masterPrisma      │
                └─ TENANT domain → resolve tenant ───┘ → tenantPrisma
```

### Header `x-domain-dev`
In development mode, use the `x-domain-dev` header to simulate different domains:
```bash
# Master login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "x-domain-dev: master.localhost" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Tenant login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "x-domain-dev: tenant-a.localhost" \
  -H "Content-Type: application/json" \
  -d '{"username": "owner", "password": "owner123"}'
```

## Struktur Folder

```
src/
├── configs/              # Environment, registry, logger
├── adapters/
│   └── postgres/         # Multi-tenant Prisma infrastructure
│       ├── PrismaClientManager.ts    # Schema interception
│       ├── MasterPrismaClient.ts     # Master client accessor
│       ├── BusinessPrismaClient.ts   # Tenant client accessor
│       ├── TenantSchemaProvisioner.ts # Schema cloning
│       ├── schemaResolver.ts         # Request context resolver
│       └── repositories/
├── core/
│   ├── entities/              # Domain types (tenant context, auth)
│   ├── repositories/          # Port interfaces
│   ├── services/              # Business logic
│   └── errors/                # Custom error hierarchy
├── mappers/                   # Entity & response mappers
├── policies/                  # Auth, domain gate, tenant context, role, permission
├── transports/
│   └── api/                   # Express REST API
└── utils/                     # Logger, helpers
prisma/
├── prisma-master.schema.prisma    # Master schema
├── prisma-business.schema.prisma  # Business/tenant schema
└── seed.ts                        # Seed script
```

## Available Scripts

| Script | Description |
|---|---|
| `bun run start:dev` | Start dev server with hot reload |
| `bun run build` | Build TypeScript |
| `bun run prisma:generate:all` | Generate both Prisma clients |
| `bun run prisma:push:all` | Push both schemas to DB |
| `bun run prisma:studio:master` | Open Prisma Studio for master |
| `bun run prisma:studio:business` | Open Prisma Studio for business |
| `bun run prisma:seed` | Seed initial data |
| `bun run test` | Run tests |
