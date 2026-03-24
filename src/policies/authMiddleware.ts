import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { TErrorResponse, TResponse } from '../core/entities/base/response';
import env from '../configs/env';
import { prisma } from '../adapters/postgres/instance';

export interface AuthRequest extends Request {
  user?: { id: string; username: string; name: string; role: string };
}

const sendFailure = (
	res: Response,
	errors: TErrorResponse[],
	message: string,
	code: number
): Response =>
	res.status(code).json({
		status: "failed",
		message,
		data: null,
		errors,
		metadata: null,
	} as TResponse<null, null>);

export const authMiddleware = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			return sendFailure(res,
				[{ field: 'authorization', message: 'No authorization header', type: 'required' }],
				'No authorization header', 401
			);
		}

		const token = authHeader.startsWith('Bearer ')
			? authHeader.substring(7)
			: authHeader;

		const jwtSecret = env.app.key || 'your-secret-key';
		const decoded = jwt.verify(token, jwtSecret) as {
			id: string; username: string; name: string; role: string;
		};

		const user = await prisma.user.findUnique({ where: { id: decoded.id } });
		if (!user || !user.isActive) {
			return sendFailure(res,
				[{ field: 'user', message: 'User not found or inactive', type: 'not_found' }],
				'Unauthorized', 401
			);
		}

		req.user = { id: user.id, username: user.username, name: user.name, role: user.role };
		next();
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			return sendFailure(res,
				[{ field: 'token', message: 'Invalid token', type: 'invalid' }],
				'Invalid token', 401
			);
		}
		if (error instanceof jwt.TokenExpiredError) {
			return sendFailure(res,
				[{ field: 'token', message: 'Token expired', type: 'invalid' }],
				'Token expired', 401
			);
		}
		return sendFailure(res,
			[{ field: 'authentication', message: 'Authentication error', type: 'internal_error' }],
			'Authentication error', 500
		);
	}
};
