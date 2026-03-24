# Hexagonal TypeScript API — Base Template

Single-tenant REST API template berbasis **Hexagonal Architecture** (Ports and Adapters).

## Tech Stack
- Runtime: **Bun**
- Framework: **Express.js**
- ORM: **Prisma** (PostgreSQL)
- Auth: **JWT**
- Validation: **Zod**
- Logging: **Winston** + Daily Rotate

## Quick Start

```bash
# Install dependencies
bun install

# Copy and edit env
cp .env.example .env

# Generate Prisma client
bun run prisma:generate

# Push schema to database
bun run prisma:push

# Run development server
bun run start:dev
```

## Struktur Folder

```
src/
├── configs/           # Environment, registry, logger
├── adapters/
│   └── postgres/      # Prisma adapter + repositories
├── core/
│   ├── entities/      # Domain types
│   ├── repositories/  # Port interfaces
│   ├── services/      # Business logic
│   └── errors/        # Custom error hierarchy
├── mappers/           # Entity & response mappers
├── policies/          # Auth & role middleware
├── transports/
│   └── api/           # Express REST API
│       ├── controllers/
│       ├── routers/
│       ├── validations/
│       └── middlewares/
└── utils/             # Logger, helpers
```

## Available Scripts

| Script | Description |
|---|---|
| `bun run start:dev` | Start dev server with hot reload |
| `bun run build` | Build TypeScript |
| `bun run prisma:generate` | Generate Prisma client |
| `bun run prisma:push` | Push schema to DB |
| `bun run prisma:studio` | Open Prisma Studio |
| `bun run test` | Run tests |

## Menambah Resource Baru

Lihat [CONTRIBUTING.md](../CONTRIBUTING.md) atau `.claude/SKILL.md` untuk panduan lengkap.
