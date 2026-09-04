import { Pool } from "pg";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../drizzle/schema.js";
import * as eliteSchema from "../../drizzle/elite.js";

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;

type Database = NodePgDatabase<Record<string, unknown>>;
let pool: Pool | null = null;
let db: Database | null = null;
let connected = false;

function init() {
  if (!connectionString) {
    connected = false;
    return;
  }
  try {
    const needsSsl =
      connectionString.includes("supabase.co") ||
      /sslmode=(require|verify-full|verify-ca)/.test(connectionString);
    pool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30_000,
      ...(needsSsl ? { ssl: { rejectUnauthorized: false } } : {}),
    });
    db = drizzle(pool, { schema: { ...schema, ...eliteSchema } } as any) as Database;
    connected = true;
  } catch {
    pool = null;
    db = null;
    connected = false;
  }
}

init();

export const isDbConnected = () => connected;
export const getPool = () => pool;
export const getDb = () => db;

export async function pingDb(): Promise<boolean> {
  if (!pool || !connected) return false;
  try {
    await pool.query("SELECT 1");
    return true;
  } catch (err) {
    console.error("[db] ping failed:", err);
    connected = false;
    return false;
  }
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  if (!pool || !connected) throw new Error("Database not connected");
  const result = await pool.query(text, params);
  return result.rows as T[];
}

export { schema, eliteSchema };
