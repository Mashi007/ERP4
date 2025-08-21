import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const proposalId = Number.parseInt(params.id)

    const communications = await sql`
      SELECT pc.*, c.name as contact_name, c.email as contact_email
      FROM proposal_communications pc
      LEFT JOIN contacts c ON pc.contact_id = c.id
      WHERE pc.proposal_id = ${proposalId}
      ORDER BY pc.created_at DESC
    `

    return NextResponse.json(communications)
  } catch (error) {
    console.error("Error fetching proposal communications:", error)
    return NextResponse.json({ error: "Failed to fetch communications" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const proposalId = Number.parseInt(params.id)
    const { type, recipient, subject, message, status } = await request.json()

    // Get proposal contact
    const proposalResult = await sql`
      SELECT contact_id FROM proposals WHERE id = ${proposalId}
    `

    if (proposalResult.length === 0) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    const result = await sql`
      INSERT INTO proposal_communications (
        proposal_id, contact_id, communication_type, recipient, subject, message, 
        status, created_at
      ) VALUES (
        ${proposalId}, ${proposalResult[0].contact_id}, ${type}, ${recipient}, 
        ${subject}, ${message}, ${status || "pending"}, NOW()
      )
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating communication log:", error)
    return NextResponse.json({ error: "Failed to create communication log" }, { status: 500 })
  }
}
