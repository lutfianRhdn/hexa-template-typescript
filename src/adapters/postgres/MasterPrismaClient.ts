import { prismaManager } from "./PrismaClientManager";

/**
 * Convenience accessor for the platform-level (master) Prisma client.
 * e.g. `masterPrisma.user.findMany(...)`
 */
export function getMasterPrisma() {
	return prismaManager.getMasterClient();
}
