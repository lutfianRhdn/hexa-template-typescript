import { Request } from "express";
import type { MasterPrismaClient, BusinessPrismaClient } from "../../../adapters/postgres/PrismaClientManager";


export type UserDomain = "MASTER" | "TENANT";


export interface AuthUser {
	id: string;
	username: string;
	name: string;
	/** Domain context: MASTER or TENANT */
	domain: UserDomain;
	/** Only for TENANT users — the tenant schema name */
	tenantSchema?: string;
	/** Only for TENANT users — role within the tenant */
	role?: string;
}


export interface TenantInfo {
	id: string;
	name: string;
	slug: string;
	schemaName: string;
	status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
}


export interface TenantRequest extends Request {
	user?: AuthUser;
	tenant?: TenantInfo;
	masterPrisma?: MasterPrismaClient;
	tenantPrisma?: BusinessPrismaClient;
}


export function hasTenantContext(req: TenantRequest): req is TenantRequest & {
	tenantPrisma: BusinessPrismaClient;
	tenant: TenantInfo;
} {
	return !!req.tenantPrisma && !!req.tenant;
}


export function isMasterUser(req: TenantRequest): boolean {
	return req.user?.domain === "MASTER";
}


export function isTenantUser(req: TenantRequest): boolean {
	return req.user?.domain === "TENANT";
}
