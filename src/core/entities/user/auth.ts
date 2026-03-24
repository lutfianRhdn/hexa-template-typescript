import type { UserDomain } from '../tenant/TenantContext';

export type TLoginRequest = {
	username: string;
	password: string;
}

export type TLoginResponse = {
	id: string;
	name: string;
	username: string;
	domain: UserDomain;
	role: string | null;
	tenant: {
		id: string;
		name: string;
		slug: string;
		schema_name: string;
	} | null;
}

export type TLoginMetadataResponse = {
	token: string;
}

export type LoginPayload = {
	username: string;
	password: string;
	/** MASTER or TENANT */
	domain: UserDomain;
	/** Required for TENANT login — the schema to authenticate against */
	schemaName?: string;
};

export type LoginResult = {
	token: string;
	user: TLoginResponse;
};

/**
 * Master user from master.users table
 */
export interface MasterUserRecord {
	id: string;
	name: string;
	username: string;
	password: string;
}

/**
 * Tenant user from tenant_xxx.users table
 */
export interface TenantUserRecord {
	id: string;
	name: string;
	username: string;
	password: string;
	role: string;
	isActive: boolean;
	lastLoginAt: Date | null;
}
