import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString =
    process.env.DATABASE_URL ||
    // Allows Next.js build / `prisma generate` when env is not loaded yet
    'postgresql://postgres:postgres@localhost:5432/nosgnoh_life?schema=public';

  const adapter = new PrismaPg({
    connectionString,
    ssl: connectionString.includes('localhost')
      ? undefined
      : { rejectUnauthorized: false },
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
