import { Request, Response } from 'express';
import Controller from './Controller';
import { AuthService } from '../../../core/services/AuthService';
import { TLoginResponse, TLoginMetadataResponse, LoginPayload } from '../../../core/entities/user/auth';
import { AuthRequest } from '../../../policies/authMiddleware';

export class AuthController extends Controller<TLoginResponse, TLoginMetadataResponse> {
	private authService: AuthService;

	constructor() {
		super();
		this.authService = new AuthService();
	}

	login = async (req: Request, res: Response) => {
		try {
			const { username, password } = req.body as { username: string; password: string };
			const payload: LoginPayload = { username, password };
			const result = await this.authService.login(payload);

			return this.getSuccessResponse(
				res,
				{
					data: result.user,
					metadata: { token: result.token },
				},
				'Login successful'
			);
		} catch (error) {
			return this.handleError(
				res, error, 'Login failed', 401,
				null as unknown as TLoginResponse,
				{} as TLoginMetadataResponse
			);
		}
	};

	me = async (req: AuthRequest, res: Response) => {
		try {
			if (!req.user?.id) {
				return this.getFailureResponse(
					res,
					{ data: null as unknown as TLoginResponse, metadata: {} as TLoginMetadataResponse },
					[{ field: 'auth', message: 'Unauthorized', type: 'authentication_error' }],
					'Unauthorized', 401
				);
			}

			const user = await this.authService.me(req.user.id);
			return this.getSuccessResponse(
				res,
				{ data: user, metadata: {} as TLoginMetadataResponse },
				'User info retrieved'
			);
		} catch (error) {
			return this.handleError(
				res, error, 'Failed to get user info', 500,
				null as unknown as TLoginResponse,
				{} as TLoginMetadataResponse
			);
		}
	};

	logout = async (_req: Request, res: Response) => {
		return this.getSuccessResponse(
			res,
			{ data: null as unknown as TLoginResponse, metadata: {} as TLoginMetadataResponse },
			'Logout successful'
		);
	};
}
