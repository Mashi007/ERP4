export async function GET() {
  try {
    const defaultSources = [
      "Website",
      "Referencia",
      "Redes Sociales",
      "Email Marketing",
      "Publicidad Online",
      "Evento",
      "Llamada en Frío",
      "Partner",
    ]

    return Response.json(defaultSources)

    // TODO: Uncomment this after running the migration script
    // const result = await sql`
    //   SELECT DISTINCT source
    //   FROM contacts
    //   WHERE source IS NOT NULL AND source != ''
    //   ORDER BY source
    // `
    // const sources = result.rows.map((row) => row.source)
    // return Response.json(sources)
  } catch (error) {
    console.error("Error fetching sources:", error)
    return Response.json([], { status: 500 })
  }
}
