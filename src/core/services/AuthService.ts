import * as jwt from 'jsonwebtoken';
import { compareSync } from 'bcrypt-ts';
import env from '../../configs/env';
import { LoginPayload, LoginResult, TLoginResponse, UserDomain } from '../entities/user/auth';
import { prismaManager } from '../../adapters/postgres/PrismaClientManager';

export class AuthService {
	async login(payload: LoginPayload): Promise<LoginResult> {
		const { username, password, domain, schemaName } = payload;

		if (domain === 'MASTER') {
			return this.loginMaster(username, password);
		}

		if (!schemaName) throw new Error('Schema name is required for tenant login');
		return this.loginTenant(username, password, schemaName);
	}

	private async loginMaster(username: string, password: string): Promise<LoginResult> {
		const masterClient = prismaManager.getMasterClient();
		const user = await masterClient.user.findUnique({ where: { username } });

		if (!user || !compareSync(password, user.password)) {
			throw new Error('Invalid username or password');
		}

		const jwtPayload = {
			id: user.id,
			username: user.username,
			name: user.name,
			domain: 'MASTER' as UserDomain,
		};

		const jwtSecret = env.app.key || 'your-secret-key';
		const token = jwt.sign(jwtPayload, jwtSecret, { expiresIn: '24h' });

		const userResponse: TLoginResponse = {
			id: user.id,
			name: user.name,
			username: user.username,
			domain: 'MASTER',
			role: null,
			tenant: null,
		};

		return { token, user: userResponse };
	}

	private async loginTenant(
		username: string,
		password: string,
		schemaName: string
	): Promise<LoginResult> {
		const businessClient = prismaManager.getBusinessClient(schemaName);
		const user = await businessClient.user.findUnique({ where: { username } });

		if (!user || !compareSync(password, user.password)) {
			throw new Error('Invalid username or password');
		}

		if (!user.isActive) throw new Error('Account is inactive');

		const masterClient = prismaManager.getMasterClient();
		const tenant = await masterClient.tenant.findFirst({
			where: { schemaName },
		});

		const jwtPayload = {
			id: user.id,
			username: user.username,
			name: user.name,
			domain: 'TENANT' as UserDomain,
			tenantSchema: schemaName,
			role: user.role,
		};

		const jwtSecret = env.app.key || 'your-secret-key';
		const token = jwt.sign(jwtPayload, jwtSecret, { expiresIn: '24h' });

		const userResponse: TLoginResponse = {
			id: user.id,
			name: user.name,
			username: user.username,
			domain: 'TENANT',
			role: user.role,
			tenant: tenant ? {
				id: tenant.id,
				name: tenant.name,
				slug: tenant.slug,
				schema_name: tenant.schemaName,
			} : null,
		};

		return { token, user: userResponse };
	}

	async me(userId: string, domain: UserDomain, tenantSchema?: string): Promise<TLoginResponse> {
		if (domain === 'MASTER') {
			const masterClient = prismaManager.getMasterClient();
			const user = await masterClient.user.findUnique({ where: { id: userId } });
			if (!user) throw new Error('User not found');
			return {
				id: user.id, name: user.name, username: user.username,
				domain: 'MASTER', role: null, tenant: null,
			};
		}

		if (!tenantSchema) throw new Error('Tenant schema required');
		const businessClient = prismaManager.getBusinessClient(tenantSchema);
		const user = await businessClient.user.findUnique({ where: { id: userId } });
		if (!user) throw new Error('User not found');

		const masterClient = prismaManager.getMasterClient();
		const tenant = await masterClient.tenant.findFirst({ where: { schemaName: tenantSchema } });

		return {
			id: user.id, name: user.name, username: user.username,
			domain: 'TENANT', role: user.role,
			tenant: tenant ? { id: tenant.id, name: tenant.name, slug: tenant.slug, schema_name: tenant.schemaName } : null,
		};
	}
}
