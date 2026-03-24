import 'dotenv/config'

export default {
	app: {
		name: process.env.APP_NAME || "Hexagonal_SaaS_API",
		env: process.env.APP_ENV || "local",
		debug: process.env.APP_DEBUG || true,
		key:
			process.env.APP_KEY ||
			"base64:NXBteWZhcDZidzJtZGJsZ2pmeXRtZ2J3OTdseXBzNXg=",
		masterDomain: process.env.MASTER_DOMAIN || "master.localhost",
	},
	adapter: {
		postgres: {
			url: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/mydb",
		},
		redis: {
			host: process.env.ADAPTER_REDIS_HOST || "localhost",
			port: process.env.ADAPTER_REDIS_PORT || 6379,
			password: process.env.ADAPTER_REDIS_PASSWORD || "",
		},
	},
	transport: {
		http: {
			port: process.env.TRANSPORT_HTTP_PORT || 8080,
		},
	},
	logging: {
		level: process.env.LOG_LEVEL || "debug",
		dir: process.env.LOG_DIR || "logs",
		rotation: {
			maxSize: process.env.LOG_MAX_SIZE || "20m",
			maxFiles: process.env.LOG_MAX_FILES || "14d",
		},
	},
};
