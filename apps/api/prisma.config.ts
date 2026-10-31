import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // process.env (not env()) so that `prisma generate` works without a database,
    // e.g. during the Docker build; commands that need one still fail clearly.
    url: process.env.DATABASE_URL,
  },
});
