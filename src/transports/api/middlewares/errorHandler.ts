import { Request, Response, NextFunction } from 'express';
import { TErrorResponse } from '../../../core/entities/base/response';
import { AppError, ValidationError } from '../../../core/errors';
import logger from '../../../utils/logger';

export const errorHandler = (
  error: unknown, req: Request, res: Response, next: NextFunction
): void => {
  logger.error('[Error Handler]:', { error, url: req.url, method: req.method });
  if (res.headersSent) return next(error);

  if (error instanceof AppError) {
    const errors: TErrorResponse[] = [{
      field: error instanceof ValidationError ? (error.field || 'validation') : 'request',
      message: error.message,
      type: error.errorType as TErrorResponse['type'],
    }];
    res.status(error.statusCode).json({ status: 'failed', message: error.message, data: null, errors, metadata: {} });
    return;
  }

  if (error instanceof Error) {
    let statusCode = 400;
    let errorType = 'invalid';
    if (error.message.toLowerCase().includes('not found')) { statusCode = 404; errorType = 'not_found'; }
    if (error.message.toLowerCase().includes('unauthorized')) { statusCode = 401; errorType = 'authentication_error'; }

    const errors: TErrorResponse[] = [{ field: 'validation', message: error.message, type: errorType as TErrorResponse['type'] }];
    res.status(statusCode).json({ status: 'failed', message: error.message, data: null, errors, metadata: {} });
    return;
  }

  res.status(500).json({
    status: 'failed', message: 'Internal server error', data: null,
    errors: [{ field: 'server', message: 'An unexpected error occurred', type: 'internal_error' }], metadata: {},
  });
};
