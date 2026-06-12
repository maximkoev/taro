import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';
import { DATABASE_URL } from '../../env.helper';

const adapter = new PrismaPg({
  connectionString: DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.user.createMany({
    data: [
      {
        id: '00000000-0000-0000-0000-000000000001',
        username: 'Maksym Koiev',
        passwordHash: '$2b$10$22.02/02.02/02',
      },
      {
        id: '00000000-0000-0000-0000-000000000002',
        username: 'Madonna',
        passwordHash: '$2b$10$22.02/02.02/02',
      },
      {
        id: '00000000-0000-0000-0000-000000000003',
        username: 'Jean Claude Van Damme',
        passwordHash: '$2b$10$22.02/02.02/02',
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
