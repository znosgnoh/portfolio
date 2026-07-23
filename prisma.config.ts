import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const datasourceUrl =
  process.env.DIRECT_URL ||
  process.env.DATABASE_URL ||
  // Allow `prisma generate` without a live database (build / CI)
  'postgresql://postgres:postgres@localhost:5432/nosgnoh_life?schema=public';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: datasourceUrl,
  },
});
