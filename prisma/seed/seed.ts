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
        firstName: 'Maksym',
        lastName: 'Koiev',
        email: 'temp_00000000-0000-0000-0000-000000000001@tarot.local',
        passwordHash: '$2b$10$22.02/02.02/02',
      },
      {
        id: '00000000-0000-0000-0000-000000000002',
        firstName: 'Madonna',
        email: 'temp_00000000-0000-0000-0000-000000000002@tarot.local',
        passwordHash: '$2b$10$22.02/02.02/02',
      },
      {
        id: '00000000-0000-0000-0000-000000000003',
        firstName: 'Jean',
        lastName: 'Claude Van Damme',
        email: 'temp_00000000-0000-0000-0000-000000000003@tarot.local',
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
