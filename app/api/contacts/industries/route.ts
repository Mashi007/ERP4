import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    const result = await sql`
      SELECT DISTINCT company as industry 
      FROM contacts 
      WHERE company IS NOT NULL AND company != ''
      ORDER BY company
    `

    const industries = result.rows.map((row) => row.industry)
    return Response.json(industries)
  } catch (error) {
    console.error("Error fetching industries:", error)
    return Response.json([], { status: 500 })
  }
}
