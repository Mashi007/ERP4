import { type NextRequest, NextResponse } from "next/server"
import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"

export async function POST(request: NextRequest) {
  try {
    const { prompt, selectedContacts, context } = await request.json()

    const result = await streamText({
      model: xai("grok-4"),
      messages: [
        {
          role: "system",
          content: `Eres un experto en email marketing y redacción comercial. Tu tarea es crear emails profesionales y efectivos para campañas de marketing.

Contexto: ${context}
Número de contactos seleccionados: ${selectedContacts}

Instrucciones:
- Crea un email profesional y atractivo
- Incluye un asunto llamativo
- El contenido debe ser persuasivo pero no agresivo
- Personaliza el mensaje para el contexto empresarial
- Incluye un call-to-action claro
- Mantén un tono profesional pero cercano
- El email debe ser conciso pero informativo

Formato de respuesta:
{
  "subject": "Asunto del email",
  "content": "Contenido completo del email con saludo, cuerpo y despedida"
}`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      maxTokens: 1000,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error generating email:", error)
    return NextResponse.json({ error: "Error generating email with AI" }, { status: 500 })
  }
}
