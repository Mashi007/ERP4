import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const templates = await sql`
      SELECT id, name, description, template_content as content, variables, 
             category, is_default, is_active, created_at
      FROM proposal_templates 
      ORDER BY created_at DESC
    `

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Error fetching proposal templates:", error)
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, content, category, variables } = await request.json()

    if (!name || !content) {
      return NextResponse.json({ error: "Name and content are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO proposal_templates (
        name, description, template_content, variables, category, 
        is_active, created_at, updated_at
      ) VALUES (
        ${name}, ${description}, ${content}, ${JSON.stringify(variables || {})}, 
        ${category || "General"}, true, NOW(), NOW()
      )
      RETURNING id, name, description, template_content as content, variables, 
                category, is_active, created_at
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating proposal template:", error)
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
  }
}
