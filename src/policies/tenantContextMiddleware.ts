import { Response, NextFunction } from 'express';
import { TResponse, TErrorResponse } from '../core/entities/base/response';
import type { TenantRequest } from '../core/entities/tenant/TenantContext';
import { prismaManager } from '../adapters/postgres/PrismaClientManager';
import logger from '../utils/logger';

const sendFailure = (
	res: Response,
	errors: TErrorResponse[],
	message: string,
	code: number
): Response =>
	res.status(code).json({
		status: "failed",
		message,
		data: null,
		errors,
		metadata: null,
	} as TResponse<null, null>);

/**
 * Tenant Context Middleware.
 * MUST run AFTER domainGate + authMiddleware.
 * Injects the tenant-scoped Prisma client into `req.tenantPrisma`.
 */
export const tenantContextMiddleware = async (
	req: TenantRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		// If user is MASTER, allow through without tenant context
		if (req.user?.domain === 'MASTER') {
			next();
			return;
		}

		// Tenant must be set by domainGate
		if (!req.tenant) {
			return sendFailure(res,
				[{ field: 'tenant', message: 'Tenant context not found', type: 'not_found' }],
				'Tenant context not found', 400
			);
		}

		// Resolve tenant Prisma client
		const schemaName = req.tenant.schemaName;
		req.tenantPrisma = prismaManager.getBusinessClient(schemaName);

		logger.debug(`[TenantContext] Resolved client for schema: ${schemaName}`);
		next();
	} catch (error) {
		logger.error('[TenantContext] Error:', error);
		return sendFailure(res,
			[{ field: 'tenant', message: 'Failed to resolve tenant context', type: 'internal_error' }],
			'Failed to resolve tenant context', 500
		);
	}
};
