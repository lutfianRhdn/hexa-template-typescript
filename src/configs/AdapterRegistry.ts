/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from "fs";
import * as path from "path";
import logger from "../utils/logger";

type Adapter = {
	name: string;
}
export default class AdapterRegistry {
	private adapters: { [key: string]: Adapter } = {};

	registerAdapter(adapter: any): void {
		this.adapters[adapter.name] = adapter;
	}

	getAdapter(name: string): Adapter {
		return this.adapters[name];
	}
	getAdapters(): { [key: string]: Adapter } {
		return this.adapters;
	}
	async loadAdapters(): Promise<void> {
		const adaptersDir = path.resolve(__dirname, "../adapters");
		const dirs = fs.readdirSync(adaptersDir);

		for (const dir of dirs) {
			try {
				const files = fs.readdirSync(adaptersDir + "/" + dir);
				const file = files.find((f: string) => f === "instance.js" || f === "instance.ts");

				if (file) {
					const module = await import(path.join(`${adaptersDir}/${dir}`, file));
					if (!module?.default) throw new Error("No default export found");

					this.registerAdapter(module.default);

					if (typeof module.default.boot !== "function") {
						throw new Error(
							`[Adapter Registry] Adapter ${module.default.name} does not have a boot method`
						);
					}

					module.default.boot();
					logger.info(
						`[Adapter Registry] Loaded adapter: ${module.default.name}`
					);

				}
			} catch (err: any) {
				logger.error(
					`[Adapter Registry] Failed to load adapter from ${dir}:`,
					{ error: err.message }
				);
			}
		}
	}
}
