import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    const result = await sql`
      SELECT DISTINCT source 
      FROM contacts 
      WHERE source IS NOT NULL AND source != ''
      ORDER BY source
    `

    const sources = result.rows.map((row) => row.source)
    return Response.json(sources)
  } catch (error) {
    console.error("Error fetching sources:", error)
    return Response.json([], { status: 500 })
  }
}
