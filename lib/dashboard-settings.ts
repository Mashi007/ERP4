"use server"

import { neon } from "@neondatabase/serverless"

export type ServerDateRange = { from: string | null; to: string | null }
const KEY = "dashboard_date_range"

// Adjust this if you support multiple organizaciones
const DEFAULT_ORG_ID = "default"

function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set")
  }
  return neon(process.env.DATABASE_URL)
}

export async function getDashboardDateRange(orgId: string = DEFAULT_ORG_ID): Promise<ServerDateRange> {
  const sql = getSql()
  try {
    const rows = await sql /*sql*/`
      select value
      from org_settings
      where org_id = ${orgId} and key = ${KEY}
      limit 1;
    `
    if (rows?.[0]?.value) {
      const v = rows[0].value as any
      return { from: v.from ?? null, to: v.to ?? null }
    }
  } catch {
    // ignore and return defaults
  }
  return { from: null, to: null }
}

export async function setDashboardDateRange(range: ServerDateRange, orgId: string = DEFAULT_ORG_ID) {
  const sql = getSql()
  try {
    await sql /*sql*/`
      insert into org_settings (org_id, key, value)
      values (${orgId}, ${KEY}, ${JSON.stringify(range)}::jsonb)
      on conflict (org_id, key) do update
      set value = ${JSON.stringify(range)}::jsonb;
    `
    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}
