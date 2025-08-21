import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, description, category, base_price, currency, duration_hours, features, requirements, deliverables } =
      body
    const serviceId = Number.parseInt(params.id)

    if (!name || base_price === undefined) {
      return NextResponse.json({ error: "Name and base_price are required" }, { status: 400 })
    }

    const result = await sql`
      UPDATE services 
      SET name = ${name}, 
          description = ${description || ""}, 
          category = ${category || "General"}, 
          base_price = ${base_price}, 
          currency = ${currency || "EUR"}, 
          duration_hours = ${duration_hours || 0}, 
          features = ${JSON.stringify(features || [])}, 
          requirements = ${JSON.stringify(requirements || [])}, 
          deliverables = ${JSON.stringify(deliverables || [])}, 
          updated_at = NOW()
      WHERE id = ${serviceId} AND is_active = true
      RETURNING id, name, description, category, base_price, currency, duration_hours, 
                features, requirements, deliverables, is_active, created_at, updated_at
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const serviceId = Number.parseInt(params.id)

    const result = await sql`
      UPDATE services 
      SET is_active = false, updated_at = NOW()
      WHERE id = ${serviceId} AND is_active = true
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const serviceId = Number.parseInt(params.id)

    const result = await sql`
      SELECT id, name, description, category, base_price, currency, duration_hours, 
             features, requirements, deliverables, is_active, created_at, updated_at
      FROM services 
      WHERE id = ${serviceId} AND is_active = true
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching service:", error)
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 })
  }
}
