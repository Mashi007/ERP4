import { sql } from "@/lib/database"

/**
 * Checks if the "nif" column exists on "contacts".
 */
export async function hasContactsNifColumn(): Promise<boolean> {
  if (!sql || !process.env.DATABASE_URL) return false
  try {
    const rows = await sql`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'contacts'
          AND column_name = 'nif'
      ) AS "exists"
    `
    const value = (rows?.[0] as any)?.exists
    return value === true || value === "t"
  } catch (err) {
    console.error("Failed to check nif column:", err)
    return false
  }
}

let ensuredOnce = false

/**
 * Ensures the "nif" column exists. Returns true if it exists or was created.
 * Gracefully returns false if it cannot ensure (e.g., permissions).
 */
export async function ensureContactsNifColumn(): Promise<boolean> {
  if (!sql || !process.env.DATABASE_URL) return false

  // Avoid running DDL repeatedly within the same runtime
  if (ensuredOnce) {
    return hasContactsNifColumn()
  }

  try {
    await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS nif TEXT`
    ensuredOnce = true
    return true
  } catch (err) {
    console.warn("Could not ensure contacts.nif column (will fallback):", err)
    // If ALTER failed, at least check existence
    return hasContactsNifColumn()
  }
}
