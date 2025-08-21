import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const services = await sql`
      SELECT id, name, description, category, base_price, currency, duration_hours, 
             features, requirements, deliverables, is_active, created_at
      FROM services 
      WHERE is_active = true
      ORDER BY category, name
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
    const { name, description, category, base_price, currency, duration_hours, features, requirements, deliverables } =
      body

    if (!name || base_price === undefined) {
      return NextResponse.json({ error: "Name and base_price are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO services (
        name, description, category, base_price, currency, duration_hours, 
        features, requirements, deliverables, is_active, created_at, updated_at
      )
      VALUES (
        ${name}, 
        ${description || ""}, 
        ${category || "General"}, 
        ${base_price}, 
        ${currency || "EUR"}, 
        ${duration_hours || 0}, 
        ${JSON.stringify(features || [])}, 
        ${JSON.stringify(requirements || [])}, 
        ${JSON.stringify(deliverables || [])}, 
        true, 
        NOW(), 
        NOW()
      )
      RETURNING id, name, description, category, base_price, currency, duration_hours, 
                features, requirements, deliverables, is_active, created_at
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}
