import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const result = await sql`
      SELECT 
        id::text,
        name,
        email,
        phone,
        company as address,
        'Cliente' as type,
        created_at::text
      FROM contacts 
      ORDER BY created_at DESC
    `

    const clients = result.map((row: any) => ({
      id: row.id,
      name: row.name || "Cliente Sin Nombre",
      email: row.email,
      phone: row.phone,
      address: row.address,
      type: row.type || "Cliente",
      created_at: row.created_at,
    }))

    return NextResponse.json({ clients })
  } catch (error) {
    console.error("Error loading clients:", error)
    return NextResponse.json({ error: "Failed to load clients" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientData = await request.json()

    const clientName =
      clientData.nombre || clientData.name || clientData.empresa || clientData.company || "Cliente Sin Nombre"
    const clientEmail = clientData.email
    const clientPhone = clientData.telefono || clientData.phone
    const clientCompany = clientData.empresa || clientData.company || clientName

    const result = await sql`
      INSERT INTO contacts (name, email, phone, company, job_title, status, sales_owner)
      VALUES (${clientName}, ${clientEmail}, ${clientPhone}, ${clientCompany}, ${clientData.cargo || ""}, 'active', 'system')
      RETURNING id::text, name, email, phone, company, created_at::text
    `

    const newClient = {
      id: result[0].id,
      name: result[0].name,
      email: result[0].email,
      phone: result[0].phone,
      address: result[0].company,
      type: "Cliente",
      created_at: result[0].created_at,
    }

    return NextResponse.json({ client: newClient })
  } catch (error) {
    console.error("Error creating client:", error)
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 })
  }
}
