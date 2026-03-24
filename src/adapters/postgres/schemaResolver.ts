import type { TenantRequest } from '../../core/entities/tenant/TenantContext';
import type { BusinessPrismaClient, MasterPrismaClient } from './PrismaClientManager';
import { prismaManager } from './PrismaClientManager';

/**
 * Resolves the appropriate Prisma client from request context.
 * Controllers call this to get the correct client for database operations.
 */
export function resolveMasterPrisma(req: TenantRequest): MasterPrismaClient {
	if (req.masterPrisma) return req.masterPrisma;
	return prismaManager.getMasterClient();
}

export function resolveBusinessPrisma(req: TenantRequest): BusinessPrismaClient {
	if (req.tenantPrisma) return req.tenantPrisma;
	if (!req.tenant?.schemaName) {
		throw new Error('No tenant context available. Ensure tenantContextMiddleware is applied.');
	}
	return prismaManager.getBusinessClient(req.tenant.schemaName);
}
