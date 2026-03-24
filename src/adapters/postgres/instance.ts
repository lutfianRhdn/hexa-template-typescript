import { PrismaClient } from "@prisma/client";
import logger from "../../utils/logger";

export const prisma = new PrismaClient({ log: ["error"] });

export default class PostgresAdapter {
	static readonly adapterName = "postgres";

	static boot() {
		prisma.$connect()
			.then(() => logger.info("[Postgres Adapter] Connected"))
			.catch((err) => logger.error("[Postgres Adapter] Connection failed", err));
	}
}
