import { type NextRequest, NextResponse } from "next/server"

const GROK_API_URL = "https://api.x.ai/v1/chat/completions"

export async function POST(request: NextRequest) {
  let contactData: any = null
  let serviceData: any = null
  let templateData: any = null

  try {
    const requestData = await request.json()
    contactData = requestData.contactData
    serviceData = requestData.serviceData
    templateData = requestData.templateData

    console.log("[v0] Grok AI API called with data:", { contactData, serviceData, templateData })

    const grokPrompt = `
    Genera una propuesta comercial profesional usando estos datos:

    CLIENTE: ${contactData.nombre_fiscal}
    EMAIL: ${contactData.email}
    SERVICIO: ${serviceData.name} - ${serviceData.description}
    PRECIO: €${serviceData.price}

    PLANTILLA BASE:
    ${templateData.content}

    Reemplaza todas las variables \${variable} con datos reales del cliente.
    Mantén formato profesional y estructura clara.
    `

    const grokResponse = await fetch(GROK_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "Eres experto en propuestas comerciales." },
          { role: "user", content: grokPrompt },
        ],
        model: "grok-4",
        temperature: 0.7,
      }),
    })

    if (!grokResponse.ok) {
      console.error("[v0] Grok API error:", grokResponse.status)
      throw new Error(`Grok API error: ${grokResponse.status}`)
    }

    const result = await grokResponse.json()
    const content = result.choices[0]?.message?.content

    console.log("[v0] Grok AI generated content:", content)

    const proposalDocument = {
      id: `prop_${Date.now()}`,
      content: content,
      pdfUrl: `/proposals/generated-${Date.now()}.pdf`,
      status: "generated",
      created_at: new Date().toISOString(),
      metadata: {
        service: serviceData.name,
        aiModel: "grok-4",
      },
    }

    return NextResponse.json(proposalDocument, { status: 201 })
  } catch (error) {
    console.error("[v0] Grok AI error:", error)

    const fallbackProposal = {
      id: `prop_${Date.now()}`,
      content: `Propuesta para ${contactData?.nombre_fiscal || "Cliente"}\nServicio: ${serviceData?.name || "Servicio"}\nPrecio: €${serviceData?.price || "0"}`,
      status: "generated-fallback",
      created_at: new Date().toISOString(),
      metadata: {
        service: serviceData?.name || "unknown",
        aiModel: "fallback",
      },
    }

    return NextResponse.json(fallbackProposal, { status: 201 })
  }
}
