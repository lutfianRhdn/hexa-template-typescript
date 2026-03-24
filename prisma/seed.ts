import { PrismaClient as MasterPrismaClient } from '.prisma/master-client';
import { PrismaClient as BusinessPrismaClient } from '.prisma/business-client';
import { hashSync } from 'bcrypt-ts';
import { Pool } from 'pg';

const masterPrisma = new MasterPrismaClient();

async function main() {
  console.log('Seeding database...');

  const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/mydb';
  const pool = new Pool({ connectionString: DATABASE_URL });

  // Ensure schemas exist
  await pool.query('CREATE SCHEMA IF NOT EXISTS master');
  await pool.query('CREATE SCHEMA IF NOT EXISTS tenant_template');
  console.log('Schemas created: master, tenant_template');

  await pool.end();

  // Seed master admin
  const adminPassword = hashSync('admin123', 10);
  await masterPrisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      name: 'Platform Administrator',
      username: 'admin',
      password: adminPassword,
    },
  });
  console.log('Master admin created: admin / admin123');

  // Seed example tenant
  const tenant = await masterPrisma.tenant.upsert({
    where: { slug: 'example-tenant' },
    update: {},
    create: {
      name: 'Example Tenant',
      slug: 'example-tenant',
      schemaName: 'tenant_example',
      status: 'ACTIVE',
    },
  });

  // Seed domain mapping
  await masterPrisma.domainMapping.upsert({
    where: { domain: 'example.localhost' },
    update: {},
    create: {
      domain: 'example.localhost',
      tenantId: tenant.id,
      isPrimary: true,
    },
  });

  // Seed schema registry
  await masterPrisma.schemaRegistry.upsert({
    where: { schemaName: 'tenant_example' },
    update: {},
    create: {
      schemaName: 'tenant_example',
      type: 'TENANT',
      ownerSchemaName: 'master',
      status: 'ACTIVE',
      provisionedAt: new Date(),
      tenantId: tenant.id,
    },
  });

  console.log('Example tenant created: example.localhost -> tenant_example');
  console.log('');
  console.log('NOTE: Run TenantSchemaProvisioner.provision("tenant_example")');  
  console.log('to create the actual tenant schema tables.');
  console.log('');
  console.log('Seed completed!');
}

main()
  .catch(console.error)
  .finally(() => masterPrisma.$disconnect());
