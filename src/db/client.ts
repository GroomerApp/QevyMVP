import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

let _db: DrizzleDb | null = null;

/**
 * Lazily connect on first query. Module-load-time connection would make the
 * production build require DATABASE_URL, which it should not.
 */
function getDb(): DrizzleDb {
  if (_db) return _db;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not set');
  // Supabase pooler: disable prepared statements.
  _db = drizzle(postgres(connectionString, { prepare: false }), { schema });
  return _db;
}

export const db = new Proxy({} as DrizzleDb, {
  get: (_t, prop) => Reflect.get(getDb(), prop),
});

export type Db = DrizzleDb;
