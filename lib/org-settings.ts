import { neon } from "@neondatabase/serverless"

export type CurrencyCode = "EUR" | "USD" | "MXN"

const isDatabaseAvailable = !!(process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL)
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL

export const sql = isDatabaseAvailable ? neon(databaseUrl!) : null

async function ensureTables() {
  if (!sql) return // Skip table creation if no database connection

  await sql /*sql*/`
    create table if not exists org_settings (
      org_id text primary key,
      currency_code text not null default 'EUR'
    );
  `
}

/**
 * Devuelve la moneda guardada para la org. Por defecto 'EUR'.
 */
export async function getOrgCurrency(orgId = "default"): Promise<CurrencyCode> {
  if (!sql || !isDatabaseAvailable) {
    return "EUR"
  }

  await ensureTables()
  const rows = await sql /*sql*/`
    select currency_code from org_settings
    where org_id = ${orgId}
    limit 1;
  `
  const code = (rows?.[0]?.currency_code as string | undefined) || "EUR"
  if (code === "EUR" || code === "USD" || code === "MXN") return code
  return "EUR"
}

/**
 * Upsert de la moneda de la organización.
 */
export async function setOrgCurrency(orgId: string, currency: CurrencyCode) {
  if (!sql || !isDatabaseAvailable) {
    return currency
  }

  await ensureTables()
  await sql /*sql*/`
    insert into org_settings (org_id, currency_code)
    values (${orgId}, ${currency})
    on conflict (org_id)
    do update set currency_code = excluded.currency_code;
  `
  return currency
}
