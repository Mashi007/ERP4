import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const contactId = Number.parseInt(params.id)

    // Update contact status to 'client'
    const result = await sql`
      UPDATE contacts 
      SET status = 'client', updated_at = NOW()
      WHERE id = ${contactId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Contact converted to client successfully",
      contact: result[0],
    })
  } catch (error) {
    console.error("Error converting contact:", error)
    return NextResponse.json({ error: "Failed to convert contact" }, { status: 500 })
  }
}
