import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET() {
  try {
    if (!sql) {
      // Return mock data if database not available
      return NextResponse.json([
        {
          id: 1,
          name: "Lista Principal",
          description: "Todos los contactos activos",
          contact_count: 1250,
          status: "active",
          created_at: "2024-01-01",
          tags: ["Clientes", "Activos"],
        },
        {
          id: 2,
          name: "Nuevos Suscriptores",
          description: "Contactos recién registrados",
          contact_count: 340,
          status: "active",
          created_at: "2024-01-10",
          tags: ["Nuevos", "Suscriptores"],
        },
      ])
    }

    const lists = await sql`
      SELECT ml.*, 
             COUNT(mlc.contact_id) as contact_count
      FROM marketing_lists ml
      LEFT JOIN marketing_list_contacts mlc ON ml.id = mlc.list_id AND mlc.status = 'active'
      GROUP BY ml.id
      ORDER BY ml.created_at DESC
    `

    return NextResponse.json(lists)
  } catch (error) {
    console.error("Error fetching marketing lists:", error)
    return NextResponse.json({ error: "Failed to fetch lists" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, tags } = await request.json()

    if (!sql) {
      return NextResponse.json({
        success: true,
        message: "Lista creada (modo demo)",
        id: Math.floor(Math.random() * 1000),
      })
    }

    const result = await sql`
      INSERT INTO marketing_lists (name, description, tags, status, created_at)
      VALUES (${name}, ${description}, ${tags}, 'active', CURRENT_TIMESTAMP)
      RETURNING id
    `

    return NextResponse.json({
      success: true,
      message: "Lista creada exitosamente",
      id: result[0].id,
    })
  } catch (error) {
    console.error("Error creating marketing list:", error)
    return NextResponse.json({ error: "Failed to create list" }, { status: 500 })
  }
}
