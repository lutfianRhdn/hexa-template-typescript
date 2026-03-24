import RepositoryInterface from "../../../core/repositories/Repository";
import { EntityMapper } from "../../../mappers/EntityMapper";
import { EntityId } from "../../../core/entities/base/id-types";

interface PrismaDelegate<T> {
	findUnique(args: { where: Record<string, unknown>; include?: Record<string, boolean | object>; }): Promise<T | null>;
	findMany(args?: { where?: Record<string, unknown>; skip?: number; take?: number; orderBy?: Record<string, 'asc' | 'desc'> | Record<string, 'asc' | 'desc'>[]; include?: Record<string, boolean | object>; }): Promise<T[]>;
	count(args?: { where?: Record<string, unknown> }): Promise<number>;
	create(args: { data: unknown }): Promise<T>;
	update(args: { where: { id: number | string }; data: unknown }): Promise<T>;
	delete(args: { where: { id: number | string } }): Promise<T>;
}

export interface FieldMapping {
	dbField: string;
	entityField: string;
	transform?: (value: unknown) => unknown;
}

export interface RelationMapping {
	dbField: string;
	entityField: string;
	isArray?: boolean;
	mapper: (dbRecord: unknown) => unknown;
	include?: boolean | object;
}

export interface EntityMapConfig {
	fields: FieldMapping[];
	relations?: RelationMapping[];
}

export interface SearchConfig { field: string; value: string; }
export interface PaginationResult<T> { data: T[]; total: number; page: number; limit: number; totalPages: number; }

function toSnakeCase(str: string): string {
	return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function convertToSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const snakeKey = toSnakeCase(key);
			const value = obj[key];
			if (value instanceof Date) result[snakeKey] = value;
			else if (value && typeof value === 'object' && !Array.isArray(value)) result[snakeKey] = convertToSnakeCase(value as Record<string, unknown>);
			else result[snakeKey] = value;
		}
	}
	return result;
}

// ─────────────────────────────────────────────────────────────
// Base Repository
// Prisma client is INJECTED from the controller/transport layer,
// so each request can use the correct schema-specific client.
// ─────────────────────────────────────────────────────────────

export default abstract class Repository<T extends Record<string, unknown>> implements RepositoryInterface<T> {
	protected tableName: string;
	protected mapper: EntityMapper<T>;
	protected idType: 'string' | 'number' = 'string';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private _prismaClient: any = null;

	constructor(tableName: string, mapConfig: EntityMapConfig) {
		this.tableName = tableName;
		this.mapper = new EntityMapper<T>(mapConfig);
	}

	/**
	 * Set the Prisma client for this repository instance.
	 * In a multi-tenant context, this is the tenant-scoped client.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	setPrismaClient(client: any): this {
		this._prismaClient = client;
		return this;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	protected get prisma(): any {
		if (!this._prismaClient) {
			throw new Error(
				`[Repository:${this.tableName}] Prisma client not injected. ` +
				'Call setPrismaClient() before using repository methods.'
			);
		}
		return this._prismaClient;
	}

	protected getModel(): PrismaDelegate<T> {
		const model = (this.prisma as Record<string, unknown>)[this.tableName] as unknown as PrismaDelegate<T>;
		return model;
	}

	protected parseId(id: string): EntityId {
		if (this.idType === 'number') {
			const numericId = parseInt(id, 10);
			if (isNaN(numericId)) throw new Error(`Invalid ID format: expected number, got "${id}"`);
			return numericId;
		}
		return id;
	}

	protected supportsSoftDelete(): boolean {
		const softDeleteModels = ['user'];
		return softDeleteModels.includes(this.tableName);
	}

	async getById(id: string): Promise<T | null> {
		const model = this.getModel();
		const parsedId = this.parseId(id);
		const whereClause: Record<string, unknown> = { id: parsedId };
		if (this.supportsSoftDelete()) whereClause.deletedAt = null;
		const records = await model.findMany({ where: whereClause, take: 1, include: this.mapper.getIncludes() });
		const record = records.length > 0 ? records[0] : null;
		return record ? this.mapper.mapToEntity(record) : null;
	}

	async getAll(
		page: number = 1, limit?: number,
		search?: SearchConfig[], filters?: Record<string, unknown>,
		orderBy?: Record<string, 'asc' | 'desc'>
	): Promise<PaginationResult<T>> {
		const model = this.getModel();
		const effectiveLimit = limit ?? undefined;
		const skip = effectiveLimit ? (page - 1) * effectiveLimit : 0;
		const where: Record<string, unknown> = {};
		if (this.supportsSoftDelete()) where.deletedAt = null;
		if (filters) Object.assign(where, filters);
		if (search && search.length > 0) {
			const validSearch = search.filter(s => s.field && s.value);
			if (validSearch.length > 0) {
				where.OR = validSearch.map(s => ({ [s.field]: { contains: s.value, mode: 'insensitive' } }));
			}
		}
		const total = await model.count({ where });
		const records = await model.findMany({ where, skip: effectiveLimit ? skip : undefined, take: effectiveLimit, orderBy: orderBy || { id: 'asc' }, include: this.mapper.getIncludes() });
		const data = this.mapper.mapToEntities(records);
		const totalPages = effectiveLimit ? Math.ceil(total / effectiveLimit) : 1;
		return { data, total, page: effectiveLimit ? page : 1, limit: effectiveLimit ?? total, totalPages };
	}

	async create(item: T): Promise<T> {
		const model = this.getModel();
		const snakeCaseData = convertToSnakeCase(item as Record<string, unknown>);
		const created = await model.create({ data: snakeCaseData });
		return this.mapper.mapToEntity(created);
	}

	async update(id: string, item: Partial<T>): Promise<T> {
		const model = this.getModel();
		const parsedId = this.parseId(id);
		const snakeCaseData = convertToSnakeCase(item as Record<string, unknown>);
		const updated = await model.update({ where: { id: parsedId }, data: snakeCaseData });
		return this.mapper.mapToEntity(updated);
	}

	async softDelete(id: string): Promise<void> {
		const model = this.getModel();
		const parsedId = this.parseId(id);
		if (!this.supportsSoftDelete()) return this.delete(id);
		await model.update({ where: { id: parsedId }, data: { isActive: false, deletedAt: new Date() } as unknown });
	}

	async delete(id: string): Promise<void> {
		const model = this.getModel();
		const parsedId = this.parseId(id);
		await model.delete({ where: { id: parsedId } });
	}
}
