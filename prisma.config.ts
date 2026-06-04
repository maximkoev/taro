import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import { DATABASE_URL } from './env.helper';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed/seed.ts',
  },
  datasource: {
    url: DATABASE_URL,
  },
});
