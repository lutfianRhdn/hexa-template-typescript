import { Response, NextFunction } from 'express';
import type { TenantRequest } from '../core/entities/tenant/TenantContext';
import { TErrorResponse, TResponse } from '../core/entities/base/response';

const sendFailureResponse = (
  res: Response,
  errors: TErrorResponse[],
  message: string,
  code: number
): Response => {
  return res.status(code).json({
    status: "failed",
    message,
    data: null,
    errors,
    metadata: null,
  } as TResponse<null, null>);
};

/**
 * Permission middleware (placeholder).
 * Extend this with your permission checking logic.
 */
export const permissionMiddleware = (requiredPermission: string) => {
  return (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return sendFailureResponse(
          res,
          [{ field: 'user', message: 'User not authenticated', type: 'invalid' }],
          'User not authenticated',
          401
        );
      }

      // TODO: Implement permission checking logic
      // For now, allow all authenticated users
      next();
    } catch (error) {
      return sendFailureResponse(
        res,
        [{ field: 'authorization', message: 'Permission verification error', type: 'internal_error' }],
        'Permission verification error',
        500
      );
    }
  };
};
