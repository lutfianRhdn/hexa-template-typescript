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

export const roleMiddleware = (allowedRoles: string[]) => {
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
      if (!req.user.role) {
        // Master users have no role — pass through if no role required
        if (req.user.domain === 'MASTER') return next();
        return sendFailureResponse(
          res,
          [{ field: 'role', message: 'User role not found', type: 'not_found' }],
          'User role not found',
          403
        );
      }
      if (!allowedRoles.includes(req.user.role)) {
        return sendFailureResponse(
          res,
          [{
            field: 'role',
            message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
            type: 'invalid'
          }],
          'Insufficient permissions',
          403
        );
      }
      next();
    } catch (error) {
      return sendFailureResponse(
        res,
        [{ field: 'authorization', message: 'Role verification error', type: 'internal_error' }],
        'Role verification error',
        500
      );
    }
  };
};

export const adminOnly = roleMiddleware(['ADMIN']);
export const ownerOrAdmin = roleMiddleware(['OWNER', 'ADMIN']);
