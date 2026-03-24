import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { TErrorResponse, TResponse } from '../core/entities/base/response';
import env from '../configs/env';
import { prismaManager } from '../adapters/postgres/PrismaClientManager';
import type { TenantRequest, AuthUser, UserDomain } from '../core/entities/tenant/TenantContext';

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
 * Multi-domain auth middleware.
 * Verifies JWT and resolves MASTER or TENANT user.
 * For TENANT users, also validates the user exists in the tenant schema.
 */
export const authMiddleware = async (
	req: TenantRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			return sendFailure(res,
				[{ field: 'authorization', message: 'No authorization header', type: 'required' }],
				'No authorization header', 401
			);
		}

		const token = authHeader.startsWith('Bearer ')
			? authHeader.substring(7)
			: authHeader;

		const jwtSecret = env.app.key || 'your-secret-key';
		const decoded = jwt.verify(token, jwtSecret) as {
			id: string;
			username: string;
			name: string;
			domain: UserDomain;
			tenantSchema?: string;
			role?: string;
		};

		if (decoded.domain === 'MASTER') {
			const masterClient = prismaManager.getMasterClient();
			const user = await masterClient.user.findUnique({ where: { id: decoded.id } });
			if (!user) {
				return sendFailure(res,
					[{ field: 'user', message: 'Master user not found', type: 'not_found' }],
					'Unauthorized', 401
				);
			}

			req.user = {
				id: user.id,
				username: user.username,
				name: user.name,
				domain: 'MASTER',
			} as AuthUser;

			req.masterPrisma = masterClient;
			next();
			return;
		}

		// TENANT domain
		const schemaName = decoded.tenantSchema;
		if (!schemaName) {
			return sendFailure(res,
				[{ field: 'tenantSchema', message: 'Tenant schema not found in token', type: 'invalid' }],
				'Invalid tenant token', 401
			);
		}

		const businessClient = prismaManager.getBusinessClient(schemaName);
		const tenantUser = await businessClient.user.findUnique({ where: { id: decoded.id } });

		if (!tenantUser || !tenantUser.isActive) {
			return sendFailure(res,
				[{ field: 'user', message: 'Tenant user not found or inactive', type: 'not_found' }],
				'Unauthorized', 401
			);
		}

		req.user = {
			id: tenantUser.id,
			username: tenantUser.username,
			name: tenantUser.name,
			domain: 'TENANT',
			tenantSchema: schemaName,
			role: tenantUser.role,
		} as AuthUser;

		req.tenantPrisma = businessClient;
		req.masterPrisma = prismaManager.getMasterClient();
		next();
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			return sendFailure(res,
				[{ field: 'token', message: 'Invalid token', type: 'invalid' }],
				'Invalid token', 401
			);
		}
		if (error instanceof jwt.TokenExpiredError) {
			return sendFailure(res,
				[{ field: 'token', message: 'Token expired', type: 'invalid' }],
				'Token expired', 401
			);
		}
		return sendFailure(res,
			[{ field: 'authentication', message: 'Authentication error', type: 'internal_error' }],
			'Authentication error', 500
		);
	}
};
