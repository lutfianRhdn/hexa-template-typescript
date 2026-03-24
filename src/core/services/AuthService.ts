import * as jwt from 'jsonwebtoken';
import { compareSync } from 'bcrypt-ts';
import env from '../../configs/env';
import { LoginPayload, LoginResult, TLoginResponse } from '../entities/user/auth';
import { prisma } from '../../adapters/postgres/instance';

export class AuthService {
	async login(payload: LoginPayload): Promise<LoginResult> {
		const { username, password } = payload;

		const user = await prisma.user.findUnique({ where: { username } });
		if (!user || !compareSync(password, user.password)) {
			throw new Error('Username atau password salah');
		}
		if (!user.isActive) throw new Error('Akun tidak aktif');

		const jwtSecret = env.app.key || 'your-secret-key';
		const jwtPayload = {
			id: user.id,
			username: user.username,
			name: user.name,
			role: user.role,
		};

		const token = jwt.sign(jwtPayload, jwtSecret, { expiresIn: '24h' });

		const userResponse: TLoginResponse = {
			id: user.id,
			name: user.name,
			username: user.username,
			role: user.role,
		};

		return { token, user: userResponse };
	}

	async me(userId: string): Promise<TLoginResponse> {
		const user = await prisma.user.findUnique({ where: { id: userId } });
		if (!user) throw new Error('User tidak ditemukan');

		return {
			id: user.id,
			name: user.name,
			username: user.username,
			role: user.role,
		};
	}
}
