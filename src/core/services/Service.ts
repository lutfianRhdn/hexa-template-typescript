import Repository, { PaginationResult, SearchConfig, FilterObject } from "../repositories/Repository";
import { TUser } from "../entities/user/user";

export type TEntity = TUser | Record<string, unknown>;

export class Service<T extends TEntity | Record<string, unknown>> {
	repository?: Repository<T>;

	constructor(repository?: Repository<T>) {
		this.repository = repository;
	}

	async findById(id: string): Promise<T | null> {
		if (!this.repository) throw new Error("Repository not available for this service");
		return this.repository.getById(id);
	}

	async findAll(
		page: number = 1,
		limit?: number,
		search?: SearchConfig[],
		filters?: FilterObject,
		orderBy?: Record<string, 'asc' | 'desc'>,
	): Promise<PaginationResult<T>> {
		if (!this.repository) throw new Error("Repository not available for this service");
		return this.repository.getAll(page, limit, search, filters, orderBy);
	}

	async create(item: T): Promise<T> {
		if (!this.repository) throw new Error("Repository not available for this service");
		return this.repository.create(item);
	}

	async update(id: string, item: Partial<T>): Promise<T> {
		if (!this.repository) throw new Error("Repository not available for this service");
		return this.repository.update(id, item);
	}

	async delete(id: string): Promise<void> {
		if (!this.repository) throw new Error("Repository not available for this service");
		return this.repository.softDelete(id);
	}

	async hardDelete(id: string): Promise<void> {
		if (!this.repository) throw new Error("Repository not available for this service");
		return this.repository.delete(id);
	}
}
