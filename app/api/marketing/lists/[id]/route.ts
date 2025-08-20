import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, description, tags } = await request.json()
    const listId = Number.parseInt(params.id)

    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: "El nombre es requerido" }, { status: 400 })
    }

    // Update the marketing list
    const result = await sql`
      UPDATE marketing_lists 
      SET 
        name = ${name.trim()},
        description = ${description?.trim() || null},
        tags = ${JSON.stringify(tags || [])},
        updated_at = NOW()
      WHERE id = ${listId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Lista no encontrada" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    })
  } catch (error) {
    console.error("Error updating marketing list:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const listId = Number.parseInt(params.id)

    // Delete the marketing list
    const result = await sql`
      DELETE FROM marketing_lists 
      WHERE id = ${listId}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Lista no encontrada" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Lista eliminada exitosamente",
    })
  } catch (error) {
    console.error("Error deleting marketing list:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
