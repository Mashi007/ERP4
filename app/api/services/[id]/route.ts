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
      UPDATE products 
      SET name = ${name}, 
          description = ${description || ""}, 
          price = ${base_price}, 
          currency = ${currency || "EUR"}, 
          updated_at = NOW()
      WHERE id = ${serviceId} AND is_service = true
      RETURNING id, name, description, price as base_price, currency, created_at, updated_at,
                'General' as category, 0 as duration_hours,
                '[]' as features, '[]' as requirements, '[]' as deliverables,
                true as is_active
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    const service = {
      ...result[0],
      features: JSON.parse(result[0].features || "[]"),
      requirements: JSON.parse(result[0].requirements || "[]"),
      deliverables: JSON.parse(result[0].deliverables || "[]"),
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const serviceId = Number.parseInt(params.id)

    const result = await sql`
      DELETE FROM products 
      WHERE id = ${serviceId} AND is_service = true
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
      SELECT id, name, description, price as base_price, currency, created_at, updated_at,
             'General' as category, 0 as duration_hours,
             '[]' as features, '[]' as requirements, '[]' as deliverables,
             true as is_active
      FROM products 
      WHERE id = ${serviceId} AND is_service = true
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    const service = {
      ...result[0],
      features: JSON.parse(result[0].features || "[]"),
      requirements: JSON.parse(result[0].requirements || "[]"),
      deliverables: JSON.parse(result[0].deliverables || "[]"),
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error("Error fetching service:", error)
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 })
  }
}
