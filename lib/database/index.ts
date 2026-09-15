import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { Pool, type PoolClient, type QueryResultRow } from "pg";

let pool: Pool | undefined;
let lastRetentionCheck = 0;

export class DatabaseNotConfigured extends Error {
  constructor() { super("DATABASE_URL no está configurada."); }
}
export function databaseConfigured() { return !!process.env.DATABASE_URL; }

/** One pool per server instance. Serverless keeps it small and lets the pooler fan out. */
export function getPool() {
  if (pool) return pool;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new DatabaseNotConfigured();
  pool = new Pool({
    connectionString,
    max: Number(process.env.DATABASE_POOL_MAX ?? 5),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: /localhost|127\.0\.0\.1/.test(connectionString) ? undefined : { rejectUnauthorized: true },
  });
  pool.on("error", () => { /* a dropped idle client must not take the process down */ });
  return pool;
}
export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []) {
  return (await getPool().query<T>(text, params)).rows;
}
export async function one<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []) {
  return (await query<T>(text, params))[0] ?? null;
}
/** Runs the callback inside a transaction, rolling back on any throw. */
export async function transaction<T>(run: (client: PoolClient) => Promise<T>) {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await run(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    try { await client.query("ROLLBACK"); } catch { /* connection already gone */ }
    throw error;
  } finally { client.release(); }
}
export async function closePool() { await pool?.end(); pool = undefined; }

export async function migrate() {
  await query("CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())");
  const directory = join(process.cwd(), "lib/database/migrations");
  for (const name of readdirSync(directory).filter(n => n.endsWith(".sql")).sort()) {
    if (await one("SELECT 1 FROM schema_migrations WHERE name = $1", [name])) continue;
    const sql = readFileSync(join(directory, name), "utf8");
    await transaction(async client => {
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [name]);
    });
  }
}
/** Applies retention at most once an hour per instance. */
export async function enforceRetention() {
  if (Date.now() - lastRetentionCheck < 3600000) return;
  lastRetentionCheck = Date.now();
  const exists = await one("SELECT 1 FROM information_schema.tables WHERE table_name = 'survey_responses'");
  if (!exists) return;
  await query("DELETE FROM survey_responses WHERE (completed_at IS NULL AND updated_at < now() - interval '7 days') OR completed_at < now() - interval '180 days'");
  await query("DELETE FROM contact_leads WHERE created_at < now() - interval '180 days'");
  await query("DELETE FROM rate_limits WHERE expires_at <= $1", [Date.now()]);
}
