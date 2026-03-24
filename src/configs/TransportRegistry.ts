/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from "fs";
import * as path from "path";
import logger from "../utils/logger";

type Transport = {
	name: string;
}
export default class TransportRegistry {
	static transports: { [key: string]: Transport } = {};

	registerTransport(transport: any): void {
		TransportRegistry.transports[transport.name] = transport;
	}
	async loadTransports(): Promise<void> {
		const transportsDir = path.resolve(__dirname, "../transports");
		const dirs = fs.readdirSync(transportsDir);

		for (const dir of dirs) {
			try {
				const file = fs
					.readdirSync(transportsDir + "/" + dir)
					.find((f: string) => f === "instance.js" || f === "instance.ts");
				if (file) {
					const module = await import(path.join(
						`${transportsDir}/${dir}`,
						file
					));
					if (!module?.default)
						throw new Error("No default export found");

					this.registerTransport(module.default);

					if (typeof module.default.boot !== "function") {
						throw new Error(
							`[Transport Registry] Transport ${module.default.name} does not have a boot method`
						);
					}

					module.default.boot();
					logger.info(
						`[Transport Registry] Loaded transport: ${module.default.name}`
					);
				}
			} catch (err: any) {
				logger.error(
					`[Transport Registry] Failed to load transport from ${dir}:`,
					{ error: err.message }
				);
			}
		}
	}
}
