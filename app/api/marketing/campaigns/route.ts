import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET() {
  try {
    if (!sql) {
      // Return mock data if database not available
      return NextResponse.json([
        {
          id: 1,
          name: "Lanzamiento Producto Q1",
          type: "email",
          status: "active",
          subject: "¡Nuevo producto disponible!",
          sent_count: 1250,
          opened_count: 456,
          clicked_count: 89,
          open_rate: 36.5,
          click_rate: 7.1,
          created_at: "2024-01-10",
          scheduled_at: "2024-01-15 10:00",
        },
      ])
    }

    const campaigns = await sql`
      SELECT mc.*, ml.name as list_name
      FROM marketing_campaigns mc
      LEFT JOIN marketing_lists ml ON mc.list_id = ml.id
      ORDER BY mc.created_at DESC
    `

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error("Error fetching campaigns:", error)
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, type, subject, content, listId, scheduledAt } = await request.json()

    if (!sql) {
      return NextResponse.json({
        success: true,
        message: "Campaña creada (modo demo)",
        id: Math.floor(Math.random() * 1000),
      })
    }

    const result = await sql`
      INSERT INTO marketing_campaigns (
        name, type, subject, content, list_id, 
        scheduled_at, status, created_at
      ) VALUES (
        ${name}, ${type}, ${subject}, ${content}, 
        ${listId ? Number.parseInt(listId) : null}, 
        ${scheduledAt || null}, 
        ${scheduledAt ? "scheduled" : "draft"}, 
        CURRENT_TIMESTAMP
      )
      RETURNING id
    `

    return NextResponse.json({
      success: true,
      message: "Campaña creada exitosamente",
      id: result[0].id,
    })
  } catch (error) {
    console.error("Error creating campaign:", error)
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 })
  }
}
