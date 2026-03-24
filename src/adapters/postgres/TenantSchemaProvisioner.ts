import { Pool } from 'pg';
import env from '../../configs/env';
import logger from '../../utils/logger';

// ─────────────────────────────────────────────────────────────
// Tenant Schema Provisioner
// Clones the `tenant_template` schema structure into a new
// schema for a newly created tenant.
// ─────────────────────────────────────────────────────────────

export class TenantSchemaProvisioner {
	private pool: Pool;

	constructor() {
		this.pool = new Pool({ connectionString: env.adapter.postgres.url });
	}

	/**
	 * Provisions a new tenant schema by cloning `tenant_template`.
	 * 1. Creates the target schema
	 * 2. Copies all tables (structure only) from tenant_template
	 * 3. Copies sequences and relinks defaults
	 */
	async provision(schemaName: string): Promise<void> {
		const client = await this.pool.connect();
		try {
			await client.query('BEGIN');

			// 1. Create schema
			await client.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

			// 2. Get all tables from tenant_template
			const tablesResult = await client.query(`
				SELECT table_name FROM information_schema.tables
				WHERE table_schema = 'tenant_template' AND table_type = 'BASE TABLE'
			`);

			for (const row of tablesResult.rows) {
				const tableName = row.table_name;

				// Clone table structure
				await client.query(`
					CREATE TABLE "${schemaName}"."${tableName}"
					(LIKE "tenant_template"."${tableName}" INCLUDING ALL)
				`);

				// Clone sequences
				const seqResult = await client.query(`
					SELECT column_name, column_default
					FROM information_schema.columns
					WHERE table_schema = 'tenant_template'
					  AND table_name = $1
					  AND column_default LIKE 'nextval%'
				`, [tableName]);

				for (const seqRow of seqResult.rows) {
					const seqName = seqRow.column_default
						.replace(/nextval\('/, '')
						.replace(/'.*/, '')
						.replace('tenant_template.', '');

					const newSeqName = `${schemaName}.${seqName}`;
					await client.query(`CREATE SEQUENCE IF NOT EXISTS "${schemaName}"."${seqName}"`);
					await client.query(`
						ALTER TABLE "${schemaName}"."${tableName}"
						ALTER COLUMN "${seqRow.column_name}"
						SET DEFAULT nextval('${newSeqName}')
					`);
				}
			}

			await client.query('COMMIT');
			logger.info(`[TenantSchemaProvisioner] Schema '${schemaName}' provisioned successfully`);
		} catch (error) {
			await client.query('ROLLBACK');
			logger.error(`[TenantSchemaProvisioner] Failed to provision schema '${schemaName}':`, error as Error);
			throw error;
		} finally {
			client.release();
		}
	}

	async destroy(): Promise<void> {
		await this.pool.end();
	}
}

export const tenantSchemaProvisioner = new TenantSchemaProvisioner();
