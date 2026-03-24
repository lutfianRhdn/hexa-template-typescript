# Hexagonal TypeScript API — Template Collection

Template project REST API berbasis **Hexagonal Architecture** (Ports and Adapters)
dengan TypeScript, Bun, Express, Prisma, dan PostgreSQL.

## Tersedia Dua Template

| Template | Branch | Deskripsi |
|---|---|---|
| Base Template | `base-template` | Single-tenant, satu Prisma schema |
| SaaS Template | `saas-template` | Multi-tenant, dual Prisma schema |

## Cara Menggunakan

### Mulai dari Base Template

```bash
git clone <repo-url> my-project
cd my-project
git checkout base-template
cp .env.example .env
# Edit .env sesuai kebutuhan
bun install
bun run prisma:generate
bun run prisma:push
bun run start:dev
```

### Mulai dari SaaS Template

```bash
git clone <repo-url> my-saas-project
cd my-saas-project
git checkout saas-template
cp .env.example .env
# Edit .env sesuai kebutuhan
bun install
bun run prisma:generate:all
bun run prisma:push:all
bun run prisma:seed
bun run start:dev
```

## Struktur Arsitektur

Lihat [ARCHITECTURE.md](ARCHITECTURE.md) untuk penjelasan lengkap.

## Panduan Kontribusi

Lihat [CONTRIBUTING.md](CONTRIBUTING.md).

## Skill Claude

Kedua template dilengkapi file `.claude/SKILL.md` yang berisi panduan
pengembangan untuk Claude AI. Install skill tersebut di Claude untuk
mendapatkan bantuan yang context-aware dengan project ini.
