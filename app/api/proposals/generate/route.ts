import { type NextRequest, NextResponse } from "next/server"
import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"

export async function POST(request: NextRequest) {
  try {
    const { clientId, clientName, service, template, proposalTitle } = await request.json()

    const prompt = `
Eres un experto en redacción de propuestas comerciales. Genera una propuesta profesional y persuasiva con la siguiente información:

INFORMACIÓN DEL CLIENTE:
- Nombre: ${clientName}
- ID: ${clientId}

SERVICIO SELECCIONADO:
- Nombre: ${service.name}
- Descripción: ${service.description}
- Precio base: ${service.base_price} ${service.currency}

TIPO DE PROPUESTA:
- Formato: ${template.name}
- Descripción: ${template.description}
- Tipo: ${template.type}

TÍTULO DE LA PROPUESTA: ${proposalTitle}

INSTRUCCIONES:
1. Crea una propuesta comercial completa y profesional
2. Incluye una introducción personalizada para ${clientName}
3. Describe detalladamente el servicio ${service.name}
4. Explica los beneficios y valor agregado
5. Incluye términos y condiciones básicos
6. Añade una sección de próximos pasos
7. Mantén un tono profesional pero cercano
8. Estructura la propuesta de manera clara y organizada
9. Incluye el precio de manera estratégica
10. Termina con una llamada a la acción convincente

Formato la propuesta de manera profesional con secciones claramente definidas.
`

    const result = await streamText({
      model: xai("grok-4", {
        apiKey: process.env.XAI_API_KEY,
      }),
      prompt,
      maxTokens: 2000,
      temperature: 0.7,
    })

    // Convert stream to text
    let proposalText = ""
    for await (const chunk of result.textStream) {
      proposalText += chunk
    }

    return NextResponse.json({
      proposal: proposalText,
      service: service.name,
      template: template.name,
      clientName,
    })
  } catch (error) {
    console.error("Error generating proposal:", error)
    return NextResponse.json({ error: "Failed to generate proposal" }, { status: 500 })
  }
}
