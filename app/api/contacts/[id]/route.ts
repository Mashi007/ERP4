import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "Contact ID is required" }, { status: 400 })
    }

    const contacts = await sql`
      SELECT 
        id, name, email, phone, company, job_title, nif, status,
        created_at, updated_at
      FROM contacts
      WHERE id = ${id}
    `

    if (contacts.length === 0) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    return NextResponse.json({ contact: contacts[0] })
  } catch (error) {
    console.error("Error fetching contact:", error)

    if (
      error instanceof Error &&
      (error.message.includes("does not exist") ||
        error.message.includes("relation") ||
        error.message.includes("table"))
    ) {
      return NextResponse.json(
        { error: "Contacts table not found. Please run the database setup script." },
        { status: 404 },
      )
    }

    return NextResponse.json({ error: "Failed to fetch contact" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const id = params.id
    const body = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Contact ID is required" }, { status: 400 })
    }

    // Extract standard fields
    const { name, email, phone, company, job_title, nif, status, ...customFields } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    try {
      const result = await sql`
        UPDATE contacts
        SET 
          name = ${name.trim()},
          email = ${email || null},
          phone = ${phone || null},
          company = ${company || null},
          job_title = ${job_title || null},
          nif = ${nif || null},
          status = ${status || "Nuevo"},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `

      if (result.length === 0) {
        return NextResponse.json({ error: "Contact not found" }, { status: 404 })
      }

      return NextResponse.json({ contact: result[0] })
    } catch (updateError) {
      console.error("Error updating contact:", updateError)

      if (updateError instanceof Error && updateError.message.includes("does not exist")) {
        return NextResponse.json(
          { error: "Contacts table not found. Please run the database setup script." },
          { status: 404 },
        )
      }

      throw updateError
    }
  } catch (error) {
    console.error("Error updating contact:", error)
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "Contact ID is required" }, { status: 400 })
    }

    try {
      const result = await sql`
        DELETE FROM contacts
        WHERE id = ${id}
        RETURNING id, name
      `

      if (result.length === 0) {
        return NextResponse.json({ error: "Contact not found" }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        deleted_contact: result[0],
      })
    } catch (deleteError) {
      console.error("Error deleting contact:", deleteError)

      if (deleteError instanceof Error && deleteError.message.includes("does not exist")) {
        return NextResponse.json(
          { error: "Contacts table not found. Please run the database setup script." },
          { status: 404 },
        )
      }

      throw deleteError
    }
  } catch (error) {
    console.error("Error deleting contact:", error)
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 })
  }
}
