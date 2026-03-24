import { Request, Response } from "express";
import { TErrorResponse, TMetadataResponse, TResponse } from "../../../core/entities/base/response";
import { Service, TEntity } from "../../../core/services/Service";
import { FilterObject } from "../../../core/repositories/Repository";

type TDataMetadataResponse<T, M> = { data: T | T[] | null; metadata: M; };

interface ResponseMapper<TEntity, TResponse> {
	toListResponse(entities: TEntity[] | TEntity): TResponse[] | TResponse;
	toResponse?(entity: TEntity): TResponse;
}

export default class Controller<T, M> {
	protected getSuccessResponse(
		res: Response,
		{ data, metadata }: TDataMetadataResponse<T, M>,
		message?: string,
		statusCode: number = 200
	): Response<TResponse<T, M>> {
		return res.status(statusCode).json({
			status: "success", message: message || "Request was successful", data, metadata,
		} as TResponse<T | T[], M>);
	}

	protected getFailureResponse(
		res: Response,
		{ data, metadata }: TDataMetadataResponse<T, M>,
		errors: TErrorResponse[] | null,
		message?: string,
		code?: number
	): Response<TResponse<T, M>> {
		return res.status(code || 400).json({
			status: "failed", message: message || "Request failed", data, errors: errors || undefined, metadata,
		} as TResponse<T, M>);
	}

	protected handleError(
		res: Response, error: unknown, message: string, statusCode: number = 500,
		emptyData: T | T[], emptyMetadata: M
	) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		return this.getFailureResponse(
			res, { data: emptyData, metadata: emptyMetadata },
			[{ field: 'server', message: errorMessage, type: 'internal_error' }],
			message, statusCode
		);
	}

	findAll<E extends TEntity, TResponseItem extends T>(
		serviceClass: Service<E>, mapperClass: ResponseMapper<E, TResponseItem>
	) {
		return async (req: Request, res: Response) => {
			try {
				const { page, limit, search_key, search_value, ...filters } = req.query;
				const pageNum = page ? parseInt(page as string, 10) : 1;
				const limitNum = limit === 'all' ? undefined : (limit ? parseInt(limit as string, 10) : 10);
				const search = search_key && search_value
					? [{ field: search_key as string, value: search_value as string }] : undefined;
				const result = await serviceClass.findAll(pageNum, limitNum, search, filters as FilterObject);
				const dataMapped = mapperClass.toListResponse(result.data);
				const metadata: TMetadataResponse = {
					page: result.page, limit: result.limit,
					total_records: result.total, total_pages: result.totalPages,
				};
				return this.getSuccessResponse(res, { data: dataMapped as TResponseItem[], metadata: metadata as M }, "Data retrieved successfully");
			} catch (error) {
				return this.handleError(res, error, "Failed to retrieve data", 500, [] as TResponseItem[], { page: 1, limit: 10, total_records: 0, total_pages: 0 } as M);
			}
		};
	}

	create<E extends TEntity, TResponseItem extends T>(
		serviceClass: Service<E>, mapperClass: ResponseMapper<E, TResponseItem>, successMessage: string = "Data created successfully"
	) {
		return async (req: Request, res: Response) => {
			try {
				const newEntity = await serviceClass.create(req.body as E);
				const mappedData = mapperClass.toResponse ? mapperClass.toResponse(newEntity) : mapperClass.toListResponse([newEntity]);
				return this.getSuccessResponse(res, { data: mappedData as TResponseItem, metadata: {} as M }, successMessage);
			} catch (error) {
				return this.handleError(res, error, "Failed to create data", 500, {} as TResponseItem, {} as M);
			}
		};
	}

	update<E extends TEntity, TResponseItem extends T>(
		serviceClass: Service<E>, mapperClass: ResponseMapper<E, TResponseItem>, successMessage: string = "Data updated successfully"
	) {
		return async (req: Request, res: Response) => {
			try {
				const id = req.params.id as string;
				const updatedEntity = await serviceClass.update(id, req.body as Partial<E>);
				const mappedData = mapperClass.toResponse ? mapperClass.toResponse(updatedEntity) : mapperClass.toListResponse([updatedEntity]);
				return this.getSuccessResponse(res, { data: mappedData as TResponseItem, metadata: {} as M }, successMessage);
			} catch (error) {
				return this.handleError(res, error, "Failed to update data", 500, {} as TResponseItem, {} as M);
			}
		};
	}

	delete<E extends TEntity>(serviceClass: Service<E>, successMessage: string = "Data deleted successfully") {
		return async (req: Request, res: Response) => {
			try {
				const id = req.params.id as string;
				await serviceClass.delete(id);
				return this.getSuccessResponse(res, { data: {} as T, metadata: {} as M }, successMessage);
			} catch (error) {
				return this.handleError(res, error, "Failed to delete data", 500, {} as T, {} as M);
			}
		};
	}
}
