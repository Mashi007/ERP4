import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET() {
  try {
    if (!sql) {
      return NextResponse.json(
        {
          error: "Database not configured",
          contacts: [],
        },
        { status: 500 },
      )
    }

    const contacts = await sql`
      SELECT 
        id, name, email, phone, company, job_title, nif, status,
        created_at, updated_at
      FROM contacts
      ORDER BY created_at DESC
    `

    return NextResponse.json({ contacts })
  } catch (error) {
    console.error("Error fetching contacts:", error)

    if (
      error instanceof Error &&
      (error.message.includes("does not exist") ||
        error.message.includes("relation") ||
        error.message.includes("table"))
    ) {
      return NextResponse.json(
        {
          error: "Contacts table not found. Please run the database setup script.",
          contacts: [],
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to fetch contacts",
        contacts: [],
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const body = await request.json()

    // Extract standard fields
    const { name, email, phone, company, job_title, nif, status = "Nuevo", ...customFields } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Check if contacts table exists and has the required columns
    try {
      const result = await sql`
        INSERT INTO contacts (
          name, email, phone, company, job_title, nif, status
        )
        VALUES (
          ${name.trim()}, ${email || null}, ${phone || null}, 
          ${company || null}, ${job_title || null}, ${nif || null}, ${status}
        )
        RETURNING *
      `

      return NextResponse.json({ contact: result[0] })
    } catch (insertError) {
      console.error("Error inserting contact:", insertError)

      if (insertError instanceof Error && insertError.message.includes("does not exist")) {
        return NextResponse.json(
          { error: "Contacts table not found. Please run the database setup script." },
          { status: 404 },
        )
      }

      throw insertError
    }
  } catch (error) {
    console.error("Error creating contact:", error)
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 })
  }
}
