import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const contactId = searchParams.get("contactId")
    const status = searchParams.get("status")

    let query = `
      SELECT p.id, p.contact_id, p.service_id, p.template_id, p.title, p.content, 
             p.total_amount, p.currency, p.status, p.pdf_url, p.expires_at, 
             p.sent_at, p.viewed_at, p.signed_at, p.created_at, p.updated_at,
             c.name as contact_name, c.email as contact_email, c.company as contact_company,
             s.name as service_name, s.category as service_category
      FROM proposals p
      LEFT JOIN contacts c ON p.contact_id = c.id
      LEFT JOIN services s ON p.service_id = s.id
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    if (contactId) {
      query += ` AND p.contact_id = $${paramIndex}`
      params.push(Number.parseInt(contactId))
      paramIndex++
    }

    if (status) {
      query += ` AND p.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    query += ` ORDER BY p.created_at DESC`

    const proposals = await sql(query, ...params)

    return NextResponse.json(proposals)
  } catch (error) {
    console.error("Error fetching proposals:", error)
    return NextResponse.json({ error: "Failed to fetch proposals" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, status, content, pdf_url, digital_signature_url } = body

    if (!id) {
      return NextResponse.json({ error: "Proposal ID is required" }, { status: 400 })
    }

    const updateFields: string[] = []
    const params: any[] = []
    let paramIndex = 1

    if (status) {
      updateFields.push(`status = $${paramIndex}`)
      params.push(status)
      paramIndex++
    }

    if (content) {
      updateFields.push(`content = $${paramIndex}`)
      params.push(content)
      paramIndex++
    }

    if (pdf_url) {
      updateFields.push(`pdf_url = $${paramIndex}`)
      params.push(pdf_url)
      paramIndex++
    }

    if (digital_signature_url) {
      updateFields.push(`digital_signature_url = $${paramIndex}`)
      params.push(digital_signature_url)
      paramIndex++
    }

    // Add timestamp fields based on status
    if (status === "sent") {
      updateFields.push(`sent_at = NOW()`)
    } else if (status === "viewed") {
      updateFields.push(`viewed_at = NOW()`)
    } else if (status === "signed") {
      updateFields.push(`signed_at = NOW()`)
    }

    updateFields.push(`updated_at = NOW()`)

    const query = `
      UPDATE proposals 
      SET ${updateFields.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING id, contact_id, service_id, title, status, updated_at
    `
    params.push(Number.parseInt(id))

    const result = await sql(query, ...params)

    if (result.length === 0) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating proposal:", error)
    return NextResponse.json({ error: "Failed to update proposal" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Creating proposal with data:", body)

    const {
      id,
      contact_id,
      service_id,
      template_id,
      title,
      content,
      total_amount,
      currency,
      status = "draft",
      expires_at,
    } = body

    // Validate required fields
    if (!contact_id || !content) {
      return NextResponse.json(
        {
          error: "contact_id and content are required",
        },
        { status: 400 },
      )
    }

    // If ID is provided (from Grok AI), use it as external reference
    const query = `
      INSERT INTO proposals (
        contact_id, service_id, template_id, title, content, 
        total_amount, currency, status, expires_at, 
        external_id, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()
      ) RETURNING id, contact_id, service_id, title, status, external_id, created_at
    `

    const params = [
      Number.parseInt(contact_id),
      service_id ? Number.parseInt(service_id) : null,
      template_id ? Number.parseInt(template_id) : null,
      title || "Propuesta Generada con IA",
      content,
      total_amount ? Number.parseFloat(total_amount) : null,
      currency || "EUR",
      status,
      expires_at || null,
      id || null, // Store Grok AI ID as external reference
    ]

    const result = await sql(query, ...params)
    console.log("Proposal created successfully:", result[0])

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating proposal:", error)
    return NextResponse.json(
      {
        error: "Failed to create proposal",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
