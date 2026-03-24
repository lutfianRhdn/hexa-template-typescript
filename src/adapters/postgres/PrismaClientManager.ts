import { PrismaClient as MasterPrismaClientType } from '.prisma/master-client';
import { PrismaClient as BusinessPrismaClientType } from '.prisma/business-client';
import { Pool } from 'pg';
import env from '../../configs/env';
import logger from '../../utils/logger';

export type MasterPrismaClient = MasterPrismaClientType;
export type BusinessPrismaClient = BusinessPrismaClientType;

// ─────────────────────────────────────────────────────────────
// Prisma Client Manager
// Manages master + per-tenant business clients with
// schema interception via pg pool patching.
// ─────────────────────────────────────────────────────────────

class PrismaClientManager {
	private masterClient: MasterPrismaClientType | null = null;
	private businessClients = new Map<string, BusinessPrismaClientType>();

	// ── Master ──
	getMasterClient(): MasterPrismaClientType {
		if (!this.masterClient) {
			this.masterClient = new MasterPrismaClientType({ log: ['error'] });
			logger.info('[PrismaClientManager] Master client created');
		}
		return this.masterClient;
	}

	// ── Business (tenant) ──
	getBusinessClient(schemaName: string): BusinessPrismaClientType {
		const existing = this.businessClients.get(schemaName);
		if (existing) return existing;

		const client = new BusinessPrismaClientType({
			log: ['error'],
			datasourceUrl: env.adapter.postgres.url,
		});

		this.patchClientOnConnect(client, schemaName);
		this.businessClients.set(schemaName, client);
		logger.info(`[PrismaClientManager] Created business client for schema: ${schemaName}`);
		return client;
	}

	// ── Schema Interception ──
	// Patches the pg Pool used by Prisma so that every SQL query
	// replaces `tenant_template` with the actual tenant schema name.
	private patchClientOnConnect(
		client: BusinessPrismaClientType,
		targetSchema: string
	): void {
		client.$connect().then(() => {
			const engine = (client as any)._engine;
			if (!engine) {
				logger.warn('[PrismaClientManager] Cannot patch: no engine found');
				return;
			}

			// Prisma 5/6 internal pool access
			const pool: Pool | undefined =
				engine.pool ?? engine.connectionPool?.pool ?? engine._pool;

			if (!pool) {
				logger.warn('[PrismaClientManager] Cannot patch: no pool found');
				return;
			}

			const originalQuery = pool.query.bind(pool);

			(pool as any).query = (...args: any[]) => {
				if (typeof args[0] === 'string') {
					args[0] = args[0].replace(/\btenant_template\b/g, targetSchema);
				} else if (args[0] && typeof args[0] === 'object' && typeof args[0].text === 'string') {
					args[0].text = args[0].text.replace(/\btenant_template\b/g, targetSchema);
				}
				return (originalQuery as any)(...args);
			};

			logger.debug(`[PrismaClientManager] Patched pool for schema: ${targetSchema}`);
		}).catch((err: Error) => {
			logger.error(`[PrismaClientManager] Connect failed for schema ${targetSchema}:`, err);
		});
	}

	// ── Cleanup ──
	async disconnectAll(): Promise<void> {
		const disconnectPromises: Promise<void>[] = [];
		if (this.masterClient) disconnectPromises.push(this.masterClient.$disconnect());
		for (const [, client] of this.businessClients) {
			disconnectPromises.push(client.$disconnect());
		}
		await Promise.all(disconnectPromises);
		this.businessClients.clear();
		logger.info('[PrismaClientManager] All clients disconnected');
	}
}

export const prismaManager = new PrismaClientManager();
