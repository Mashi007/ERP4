import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const services = await sql`
      SELECT id, name, description, base_price, currency, tax_rate, is_active, created_at
      FROM products 
      WHERE is_service = true AND is_active = true
      ORDER BY created_at DESC
    `

    return NextResponse.json(services)
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, base_price, currency, tax_rate, is_service, is_active } = body

    if (!name || base_price === undefined) {
      return NextResponse.json({ error: "Name and base_price are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO products (name, description, base_price, currency, tax_rate, is_service, is_active, created_at)
      VALUES (${name}, ${description || ""}, ${base_price}, ${currency || "EUR"}, ${tax_rate || 0}, ${is_service || true}, ${is_active || true}, NOW())
      RETURNING id, name, description, base_price, currency, tax_rate, is_active, created_at
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}
