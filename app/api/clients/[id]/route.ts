import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const clientData = await request.json()
    const clientId = params.id

    const clientName =
      clientData.nombre || clientData.name || clientData.empresa || clientData.company || "Cliente Sin Nombre"
    const clientEmail = clientData.email
    const clientPhone = clientData.telefono || clientData.phone
    const clientCompany = clientData.empresa || clientData.company || clientName

    const result = await sql`
      UPDATE contacts 
      SET 
        name = ${clientName},
        email = ${clientEmail},
        phone = ${clientPhone},
        company = ${clientCompany},
        job_title = ${clientData.cargo || ""},
        updated_at = NOW()
      WHERE id = ${Number.parseInt(clientId)}
      RETURNING id::text, name, email, phone, company, created_at::text, updated_at::text
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    const updatedClient = {
      id: result[0].id,
      name: result[0].name,
      email: result[0].email,
      phone: result[0].phone,
      address: result[0].company,
      type: "Cliente",
      created_at: result[0].created_at,
    }

    return NextResponse.json({ client: updatedClient })
  } catch (error) {
    console.error("Error updating client:", error)
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const clientId = params.id

    await sql`
      DELETE FROM contacts 
      WHERE id = ${Number.parseInt(clientId)}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting client:", error)
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 })
  }
}
