import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

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
