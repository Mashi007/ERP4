import { neon } from "@neondatabase/serverless"

async function main() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error("DATABASE_URL is not set")
    return
  }

  const sql = neon(databaseUrl)

  console.log("Creating indexes on activities...")
  try {
    await sql(`
      CREATE INDEX IF NOT EXISTS idx_activities_deal_id_activity_date_desc
        ON activities (deal_id, activity_date DESC);
    `)
    await sql(`
      CREATE INDEX IF NOT EXISTS idx_activities_contact_id_activity_date_desc
        ON activities (contact_id, activity_date DESC);
    `)
    await sql(`
      CREATE INDEX IF NOT EXISTS idx_activities_activity_date
        ON activities (activity_date);
    `)
    console.log("Indexes created or already exist.")
  } catch (err) {
    console.error("Error creating indexes:", err)
  }
}

main()
