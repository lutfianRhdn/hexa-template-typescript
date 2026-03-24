import Repository from './Repository';
import { EntityMapConfig } from './Repository';
import { TUser } from '../../../core/entities/user/user';
import { prisma } from '../instance';

const userMapConfig: EntityMapConfig = {
	fields: [
		{ dbField: 'id', entityField: 'id' },
		{ dbField: 'name', entityField: 'name' },
		{ dbField: 'username', entityField: 'username' },
		{ dbField: 'password', entityField: 'password' },
		{ dbField: 'role', entityField: 'role' },
		{ dbField: 'isActive', entityField: 'isActive' },
		{ dbField: 'createdAt', entityField: 'createdAt' },
		{ dbField: 'updatedAt', entityField: 'updatedAt' },
	],
};

export class UserRepository extends Repository<TUser & Record<string, unknown>> {
	constructor() {
		super('user', userMapConfig);
		this.setPrismaClient(prisma);
	}

	async findByUsername(username: string): Promise<(TUser & Record<string, unknown>) | null> {
		const user = await prisma.user.findUnique({ where: { username } });
		if (!user) return null;
		return this.mapper.mapToEntity(user as unknown as Record<string, unknown>);
	}
}
