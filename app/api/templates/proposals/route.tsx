import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const templates = await sql`
      SELECT id, name, subject as description, content, 
             '{}' as variables, type as category, 
             is_active, created_at
      FROM campaign_templates 
      WHERE type = 'proposal' OR type IS NULL
      ORDER BY created_at DESC
    `

    if (templates.length === 0) {
      return NextResponse.json([
        {
          id: 1,
          name: "Propuesta Comercial Estándar",
          description: "Plantilla estándar para propuestas comerciales",
          content: `
            <h1>Propuesta Comercial</h1>
            <p>Estimado/a {{contact.name}},</p>
            <p>Nos complace presentarle nuestra propuesta para el servicio de {{service.name}}.</p>
            
            <h2>Descripción del Servicio</h2>
            <p>{{service.description}}</p>
            
            <h2>Características Principales</h2>
            <ul>{{service.features}}</ul>
            
            <h2>Entregables</h2>
            <p>{{service.deliverables}}</p>
            
            <h2>Inversión</h2>
            <p>Precio: {{service.base_price}} {{service.currency}}</p>
            <p>Duración: {{service.duration}}</p>
            
            <h2>Información de Contacto</h2>
            <p>Cliente: {{contact.name}}</p>
            <p>Empresa: {{contact.company}}</p>
            <p>Email: {{contact.email}}</p>
            <p>Teléfono: {{contact.phone}}</p>
            
            <p>Esperamos su pronta respuesta.</p>
            <p>Saludos cordiales,</p>
          `,
          variables: {},
          category: "General",
          is_active: true,
          created_at: new Date().toISOString(),
        },
      ])
    }

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
      INSERT INTO campaign_templates (
        name, subject, content, type, is_active, created_at, updated_at
      ) VALUES (
        ${name}, ${description || ""}, ${content}, 'proposal', true, NOW(), NOW()
      )
      RETURNING id, name, subject as description, content, 
                type as category, is_active, created_at
    `

    const template = {
      ...result[0],
      variables: variables || {},
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error("Error creating proposal template:", error)
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
  }
}
