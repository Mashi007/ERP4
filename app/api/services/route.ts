import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const services = await sql`
      SELECT id, name, description, price as base_price, currency, created_at,
             'General' as category, 0 as duration_hours, 
             '[]' as features, '[]' as requirements, '[]' as deliverables,
             true as is_active
      FROM products 
      WHERE is_service = true
      ORDER BY name
    `

    const formattedServices = services.map((service) => ({
      ...service,
      features: JSON.parse(service.features || "[]"),
      requirements: JSON.parse(service.requirements || "[]"),
      deliverables: JSON.parse(service.deliverables || "[]"),
    }))

    return NextResponse.json(formattedServices)
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, category, base_price, currency, duration_hours, features, requirements, deliverables } =
      body

    if (!name || base_price === undefined) {
      return NextResponse.json({ error: "Name and base_price are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO products (
        name, description, price, currency, is_service, created_at, updated_at
      )
      VALUES (
        ${name}, 
        ${description || ""}, 
        ${base_price}, 
        ${currency || "EUR"}, 
        true,
        NOW(), 
        NOW()
      )
      RETURNING id, name, description, price as base_price, currency, created_at,
                'General' as category, 0 as duration_hours,
                '[]' as features, '[]' as requirements, '[]' as deliverables,
                true as is_active
    `

    const service = {
      ...result[0],
      features: JSON.parse(result[0].features || "[]"),
      requirements: JSON.parse(result[0].requirements || "[]"),
      deliverables: JSON.parse(result[0].deliverables || "[]"),
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}
