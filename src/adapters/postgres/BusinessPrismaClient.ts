import { prismaManager, type BusinessPrismaClient } from "./PrismaClientManager";

/**
 * Convenience accessor for tenant-scoped Prisma clients.
 * Returns a client that has been patched to replace
 * `tenant_template` with the given `schemaName`.
 */
export function getBusinessPrisma(schemaName: string): BusinessPrismaClient {
	return prismaManager.getBusinessClient(schemaName);
}
