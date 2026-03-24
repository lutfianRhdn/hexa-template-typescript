import { Request, Response } from 'express';
import Controller from './Controller';
import { AuthService } from '../../../core/services/AuthService';
import { TLoginResponse, TLoginMetadataResponse, LoginPayload } from '../../../core/entities/user/auth';
import type { TenantRequest } from '../../../core/entities/tenant/TenantContext';
import { prismaManager } from '../../../adapters/postgres/PrismaClientManager';
import env from '../../../configs/env';

export class AuthController extends Controller<TLoginResponse, TLoginMetadataResponse> {
	private authService: AuthService;

	constructor() {
		super();
		this.authService = new AuthService();
	}

	private resolveRequestDomain(req: Request): string | null {
		const isDev = env.app.env === 'development' || env.app.env === 'local';
		if (isDev) {
			const devDomain = req.headers['x-domain-dev'] as string | undefined;
			if (devDomain) return devDomain;
		}
		const host = req.headers.host?.split(':')[0];
		return host || null;
	}

	login = async (req: Request, res: Response) => {
		try {
			const { username, password } = req.body as { username: string; password: string };
			const requestDomain = this.resolveRequestDomain(req);

			if (!requestDomain) {
				return this.handleError(res, new Error('Cannot resolve domain'), 'Login failed', 400,
					null as unknown as TLoginResponse, {} as TLoginMetadataResponse);
			}

			const masterDomain = env.app.masterDomain;

			if (requestDomain === masterDomain) {
				const payload: LoginPayload = { username, password, domain: 'MASTER' };
				const result = await this.authService.login(payload);
				return this.getSuccessResponse(res, {
					data: result.user, metadata: { token: result.token },
				}, 'Login successful');
			}

			// Tenant login — resolve domain from domain_mappings
			const masterClient = prismaManager.getMasterClient();
			const domainMapping = await masterClient.domainMapping.findFirst({
				where: { domain: requestDomain },
				include: { tenant: true },
			});

			if (!domainMapping || !domainMapping.tenant) {
				return this.handleError(res, new Error(`Domain '${requestDomain}' is not registered`),
					'Login failed', 404, null as unknown as TLoginResponse, {} as TLoginMetadataResponse);
			}

			const tenant = domainMapping.tenant;
			const payload: LoginPayload = { username, password, domain: 'TENANT', schemaName: tenant.schemaName };
			const result = await this.authService.login(payload);
			return this.getSuccessResponse(res, {
				data: result.user, metadata: { token: result.token },
			}, 'Login successful');
		} catch (error) {
			return this.handleError(res, error, 'Login failed', 401,
				null as unknown as TLoginResponse, {} as TLoginMetadataResponse);
		}
	};

	me = async (req: TenantRequest, res: Response) => {
		try {
			if (!req.user?.id) {
				return this.getFailureResponse(res,
					{ data: null as unknown as TLoginResponse, metadata: {} as TLoginMetadataResponse },
					[{ field: 'auth', message: 'Unauthorized', type: 'authentication_error' }],
					'Unauthorized', 401);
			}
			const user = await this.authService.me(req.user.id, req.user.domain, req.user.tenantSchema);
			return this.getSuccessResponse(res,
				{ data: user, metadata: {} as TLoginMetadataResponse }, 'User info retrieved');
		} catch (error) {
			return this.handleError(res, error, 'Failed to get user info', 500,
				null as unknown as TLoginResponse, {} as TLoginMetadataResponse);
		}
	};

	logout = async (_req: Request, res: Response) => {
		return this.getSuccessResponse(res,
			{ data: null as unknown as TLoginResponse, metadata: {} as TLoginMetadataResponse },
			'Logout successful');
	};
}
