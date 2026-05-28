import * as dotenv from 'dotenv';

dotenv.config();
const user = getEnv('POSTGRES_USER');
const password = getEnv('POSTGRES_PASSWORD');
const host = getEnv('POSTGRES_HOST');
const db = getEnv('POSTGRES_DB');
export const DATABASE_URL = `postgresql://${user}:${password}@${host}:5432/${db}`;

function getEnv(key: string): string {
  const value = process.env[key];
  if (isNotEmptyString(value)) {
    return value;
  }
  console.error(`Environment variable ${key} is required but not set`);
  process.exit(1);
}

function isNotEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
