import { Response, NextFunction } from 'express';
import { TResponse, TErrorResponse } from '../core/entities/base/response';
import type { TenantRequest } from '../core/entities/tenant/TenantContext';
import env from '../configs/env';
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
 * Domain Gate Middleware.
 * Resolves the request domain and determines if it is MASTER or TENANT.
 * For TENANT domains, resolves the tenant from domain_mappings.
 * Sets `req.tenant` for downstream middleware.
 *
 * In development, supports `x-domain-dev` header for domain override.
 */
export const domainGate = async (
	req: TenantRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const isDev = env.app.env === 'development' || env.app.env === 'local';
		let requestDomain: string | null = null;

		if (isDev) {
			const devDomain = req.headers['x-domain-dev'] as string | undefined;
			if (devDomain) requestDomain = devDomain;
		}

		if (!requestDomain) {
			requestDomain = req.headers.host?.split(':')[0] || null;
		}

		if (!requestDomain) {
			return sendFailure(res,
				[{ field: 'domain', message: 'Cannot resolve domain', type: 'invalid' }],
				'Cannot resolve domain', 400
			);
		}

		// Master domain — skip tenant resolution
		if (requestDomain === env.app.masterDomain) {
			req.masterPrisma = prismaManager.getMasterClient();
			next();
			return;
		}

		// Tenant domain — resolve from domain_mappings
		const masterClient = prismaManager.getMasterClient();
		const domainMapping = await masterClient.domainMapping.findFirst({
			where: { domain: requestDomain },
			include: { tenant: true },
		});

		if (!domainMapping || !domainMapping.tenant) {
			return sendFailure(res,
				[{ field: 'domain', message: `Domain '${requestDomain}' is not registered`, type: 'not_found' }],
				`Domain '${requestDomain}' is not registered`, 404
			);
		}

		const tenant = domainMapping.tenant;
		if (tenant.status !== 'ACTIVE') {
			return sendFailure(res,
				[{ field: 'tenant', message: `Tenant '${tenant.name}' is ${tenant.status}`, type: 'forbidden' }],
				`Tenant is ${tenant.status}`, 403
			);
		}

		req.tenant = {
			id: tenant.id,
			name: tenant.name,
			slug: tenant.slug,
			schemaName: tenant.schemaName,
			status: tenant.status,
		};

		req.masterPrisma = masterClient;
		logger.debug(`[DomainGate] Resolved tenant: ${tenant.name} (${tenant.schemaName})`);
		next();
	} catch (error) {
		logger.error('[DomainGate] Error:', error);
		return sendFailure(res,
			[{ field: 'domain', message: 'Domain gate error', type: 'internal_error' }],
			'Domain gate error', 500
		);
	}
};
