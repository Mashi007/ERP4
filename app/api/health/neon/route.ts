import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          ok: false,
          error: "DATABASE_URL not configured",
          details: null,
        },
        { status: 500 },
      )
    }

    const sql = neon(process.env.DATABASE_URL)

    // Test basic connectivity with a simple query
    const result = await sql`SELECT 1 as test`

    // Get basic table counts for health check
    const [deals, contacts, activities, appointments] = await Promise.allSettled([
      sql`SELECT COUNT(*) as count FROM deals LIMIT 1`.catch(() => ({ count: null })),
      sql`SELECT COUNT(*) as count FROM contacts LIMIT 1`.catch(() => ({ count: null })),
      sql`SELECT COUNT(*) as count FROM activities LIMIT 1`.catch(() => ({ count: null })),
      sql`SELECT COUNT(*) as count FROM appointments LIMIT 1`.catch(() => ({ count: null })),
    ])

    return NextResponse.json({
      ok: true,
      error: null,
      details: {
        deals: null,
        contacts: null,
        activities: null,
        appointments: null,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Neon health check failed:", error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Database connection failed",
        details: null,
      },
      { status: 500 },
    )
  }
}
