import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, description, base_price, currency, tax_rate } = body
    const serviceId = Number.parseInt(params.id)

    if (!name || base_price === undefined) {
      return NextResponse.json({ error: "Name and base_price are required" }, { status: 400 })
    }

    const result = await sql`
      UPDATE products 
      SET name = ${name}, description = ${description || ""}, base_price = ${base_price}, 
          currency = ${currency || "EUR"}, tax_rate = ${tax_rate || 0}
      WHERE id = ${serviceId} AND is_service = true
      RETURNING id, name, description, base_price, currency, tax_rate, is_active, created_at
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
      UPDATE products 
      SET is_active = false
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
