FROM oven/bun:latest AS builder

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY prisma ./prisma
RUN bun run prisma:generate:all

COPY . .
RUN bun run build

FROM oven/bun:latest AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 8080

CMD ["bun", "dist/index.js"]
