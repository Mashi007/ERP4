import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { contactId, serviceId, customRequirements } = await request.json()

    if (!contactId || !serviceId) {
      return NextResponse.json({ error: "Contact ID and Service ID are required" }, { status: 400 })
    }

    const [contactResult, serviceResult, templateResult] = await Promise.all([
      sql`SELECT * FROM contacts WHERE id = ${contactId}`,
      sql`SELECT * FROM services WHERE id = ${serviceId} AND is_active = true`,
      sql`SELECT * FROM proposal_templates WHERE is_default = true AND is_active = true LIMIT 1`,
    ])

    if (contactResult.length === 0) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    if (serviceResult.length === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    const contact = contactResult[0]
    const service = serviceResult[0]
    const template = templateResult[0] || null

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

    const proposalResult = await sql`
      INSERT INTO proposals (
        contact_id, service_id, template_id, title, content, total_amount, currency, 
        status, expires_at, created_by, created_at, updated_at
      ) VALUES (
        ${contactId}, ${serviceId}, ${template?.id || null}, ${proposalTitle}, 
        ${proposalContent}, ${service.base_price}, ${service.currency}, 
        'draft', ${expiresAt.toISOString()}, 'system', NOW(), NOW()
      )
      RETURNING id, title, content, total_amount, currency, status, created_at
    `

    await sql`
      INSERT INTO proposal_ai_generations (
        proposal_id, prompt_used, ai_model, generation_time_ms, tokens_used, 
        variables_data, generated_content, created_at
      ) VALUES (
        ${proposalResult[0].id}, ${prompt}, 'grok-4', ${generationTime}, 
        ${result.usage?.totalTokens || 0}, 
        ${JSON.stringify({ contact, service, customRequirements })}, 
        ${proposalContent}, NOW()
      )
    `

    return NextResponse.json({
      proposal: proposalResult[0],
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
