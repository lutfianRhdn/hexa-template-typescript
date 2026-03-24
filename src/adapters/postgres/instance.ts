import { prismaManager } from './PrismaClientManager';
import logger from '../../utils/logger';

export default class PostgresAdapter {
	static readonly adapterName = "postgres";

	static boot() {
		const masterClient = prismaManager.getMasterClient();
		masterClient.$connect()
			.then(() => logger.info('[Postgres Adapter] Master client connected'))
			.catch((err: Error) => logger.error('[Postgres Adapter] Master connection failed', err));
	}
}
