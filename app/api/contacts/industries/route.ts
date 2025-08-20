export async function GET() {
  try {
    const dashboardIndustries = [
      "Consultoría",
      "Educación",
      "Manufactura",
      "Marketing",
      "Software",
      "Startup",
      "Tecnología",
    ]

    return Response.json(dashboardIndustries)

    // TODO: Uncomment this after running the migration script to add industry column
    // const result = await sql`
    //   SELECT DISTINCT industry
    //   FROM contacts
    //   WHERE industry IS NOT NULL AND industry != ''
    //   ORDER BY industry
    // `
    // const industries = result.rows.map((row) => row.industry)
    // return Response.json(industries)
  } catch (error) {
    console.error("Error fetching industries:", error)
    return Response.json([], { status: 500 })
  }
}
