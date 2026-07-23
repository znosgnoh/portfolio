import 'dotenv/config';
import { hash } from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL || 'nosgnohz@gmail.com';
  const password = process.env.ADMIN_PASSWORD || 'change-me';

  const passwordHash = await hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Nosgnoh',
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('Seeded admin user:', email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
