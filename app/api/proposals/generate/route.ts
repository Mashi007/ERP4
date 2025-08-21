import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { contactId, serviceId, templateId, contactData, customRequirements } = await request.json()

    if (!serviceId) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 })
    }

    let contact
    if (contactId) {
      const contactResult = await sql`SELECT * FROM contacts WHERE id = ${contactId}`
      if (contactResult.length === 0) {
        return NextResponse.json({ error: "Contact not found" }, { status: 404 })
      }
      contact = contactResult[0]
    } else if (contactData) {
      contact = contactData
    } else {
      return NextResponse.json({ error: "Contact ID or contact data is required" }, { status: 400 })
    }

    const serviceResult = await sql`
      SELECT id, name, description, base_price, currency, 
             COALESCE(category_id::text, 'General') as category,
             0 as duration_hours,
             '[]'::json as features,
             '[]'::json as requirements, 
             '[]'::json as deliverables,
             is_active
      FROM products 
      WHERE id = ${serviceId} AND is_service = true AND is_active = true
    `

    if (serviceResult.length === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    const service = serviceResult[0]

    let template = null
    if (templateId) {
      const templateResult = await sql`
        SELECT * FROM campaign_templates 
        WHERE id = ${templateId} AND type = 'proposal' AND is_active = true
      `
      if (templateResult.length > 0) {
        template = templateResult[0]
      }
    }

    if (!template) {
      const defaultTemplateResult = await sql`
        SELECT * FROM campaign_templates 
        WHERE type = 'proposal' AND name ILIKE '%estándar%' AND is_active = true 
        LIMIT 1
      `
      template = defaultTemplateResult[0] || null
    }

    const prompt = `
Eres un experto consultor comercial especializado en redacción de propuestas profesionales. Genera una propuesta comercial completa y persuasiva utilizando la siguiente información:

INFORMACIÓN DEL CLIENTE:
- Nombre: ${contact.name}
- Email: ${contact.email}
- Teléfono: ${contact.phone || "No especificado"}
- Empresa: ${contact.company || "No especificada"}
- Cargo: ${contact.job_title || "No especificado"}
- Estado actual: ${contact.status || "Prospecto"}

SERVICIO PROPUESTO:
- Nombre: ${service.name}
- Descripción: ${service.description}
- Categoría: ${service.category}
- Precio base: ${service.base_price} ${service.currency}
- Duración estimada: ${service.duration_hours} horas
- Características incluidas: ${service.features ? service.features.join(", ") : "No especificadas"}
- Entregables: ${service.deliverables ? service.deliverables.join(", ") : "No especificados"}
- Requisitos: ${service.requirements ? service.requirements.join(", ") : "No especificados"}

${customRequirements ? `REQUISITOS ADICIONALES DEL CLIENTE:\n${customRequirements}` : ""}

INSTRUCCIONES PARA LA PROPUESTA:
1. **Encabezado profesional** con saludo personalizado para ${contact.name}${contact.company ? ` de ${contact.company}` : ""}
2. **Resumen ejecutivo** que capture la esencia del proyecto
3. **Análisis de necesidades** basado en el perfil del cliente
4. **Descripción detallada del servicio** ${service.name} con todos sus beneficios
5. **Metodología de trabajo** explicando cómo se ejecutará el proyecto
6. **Cronograma** basado en las ${service.duration_hours} horas estimadas
7. **Entregables específicos** listando cada componente que recibirá el cliente
8. **Inversión y valor** presentando el precio de ${service.base_price} ${service.currency} de manera estratégica
9. **Términos y condiciones** profesionales pero claros
10. **Próximos pasos** con llamada a la acción convincente

FORMATO Y ESTILO:
- Usa HTML semántico con estructura clara (h1, h2, h3, p, ul, li)
- Mantén un tono profesional pero cercano y consultivo
- Incluye elementos visuales como listas y secciones bien definidas
- Personaliza el contenido específicamente para ${contact.name} y su contexto empresarial
- Enfócate en los beneficios y el ROI para el cliente
- Usa un lenguaje persuasivo pero honesto y transparente

La propuesta debe ser completa, profesional y lista para enviar al cliente.
`

    const startTime = Date.now()

    const result = await generateText({
      model: xai("grok-4"),
      prompt,
      maxTokens: 3000,
      temperature: 0.7,
    })

    const generationTime = Date.now() - startTime
    const proposalContent = result.text

    const proposalTitle = `Propuesta de ${service.name} para ${contact.name}`
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // 30 days expiration

    const contactResult = await sql`
      INSERT INTO contacts (
        name, email, phone, company, job_title, status, 
        sales_owner, nif, tags, created_at, updated_at
      ) VALUES (
        ${contact.name}, ${contact.email}, ${contact.phone || null}, 
        ${contact.company || null}, ${contact.job_title || null}, 
        'qualified', 'Sistema IA', ${contact.nif || null}, 
        ARRAY['ai_generated', ${service.category}], 
        NOW(), NOW()
      )
      ON CONFLICT (email) DO UPDATE SET
        tags = ARRAY['ai_generated', ${service.category}],
        updated_at = NOW()
      RETURNING id, name, email, created_at
    `

    const proposalInsertResult = await sql`
      INSERT INTO proposals (
        title, content, contact_id, service_id, template_id,
        total_amount, currency, status, expires_at, 
        created_at, updated_at
      ) VALUES (
        ${proposalTitle}, ${proposalContent}, ${contactResult[0].id}, 
        ${serviceId}, ${templateId || null}, ${service.base_price}, 
        ${service.currency}, 'draft', ${expiresAt.toISOString()}, 
        NOW(), NOW()
      )
      RETURNING id, title, content, total_amount, currency, status, created_at, expires_at
    `

    const savedProposal = proposalInsertResult[0]

    const noteContent = `Propuesta generada: ${proposalTitle}\n\nContenido:\n${proposalContent}`

    // Store as activity record for tracking
    await sql`
      INSERT INTO activities (
        contact_id, type, title, notes, status, 
        sales_owner, activity_date, created_at, updated_at
      ) VALUES (
        ${contactResult[0].id}, 'proposal', ${proposalTitle}, 
        ${noteContent}, 'completed', 'Sistema IA', NOW(), NOW(), NOW()
      )
    `

    return NextResponse.json({
      proposal: {
        id: savedProposal.id,
        title: savedProposal.title,
        content: savedProposal.content,
        total_amount: savedProposal.total_amount,
        currency: savedProposal.currency,
        status: savedProposal.status,
        created_at: savedProposal.created_at,
        expires_at: savedProposal.expires_at,
      },
      generationTime,
      tokensUsed: result.usage?.totalTokens || 0,
      success: true,
    })
  } catch (error) {
    console.error("Error generating proposal:", error)
    return NextResponse.json(
      {
        error: "Failed to generate proposal",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
