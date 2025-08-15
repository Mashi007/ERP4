import type { NextRequest } from "next/server"
import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"

export async function POST(request: NextRequest) {
  try {
    const { prompt, selectedContacts, context } = await request.json()

    if (!prompt) {
      return new Response("Prompt is required", { status: 400 })
    }

    const result = streamText({
      model: xai("grok-4", {
        apiKey: process.env.XAI_API_KEY,
      }),
      prompt: prompt,
      system: `Eres un experto en email marketing y redacción comercial. Tu tarea es crear emails profesionales y efectivos para campañas de marketing.

Contexto: ${context || "Campaña de email marketing general"}
Número de contactos seleccionados: ${selectedContacts || 0}

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
      temperature: 0.7,
      maxTokens: 1000,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error generating email:", error)
    return new Response("Failed to generate email with Grok AI", { status: 500 })
  }
}
