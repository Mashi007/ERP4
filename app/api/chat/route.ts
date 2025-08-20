import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"
import { getCRMContext } from "@/lib/chat-ai"

// Enable edge runtime for faster responses
export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Get CRM context for better responses
    const crmContext = await getCRMContext()

    // Build system prompt with CRM context
    const systemPrompt = `Eres un asistente de CRM inteligente especializado en ventas y gestión de relaciones con clientes.

${crmContext}

INSTRUCCIONES:
- Responde en español de manera profesional y útil
- Usa los datos del CRM para proporcionar insights específicos y detallados
- Sugiere acciones concretas cuando sea apropiado
- Si no tienes información suficiente, pregunta por más detalles
- Mantén las respuestas concisas pero informativas
- Puedes hacer análisis, sugerir estrategias, y responder preguntas sobre el pipeline
- Proporciona recomendaciones basadas en mejores prácticas de CRM y ventas
- Ayuda con análisis de datos, seguimiento de oportunidades, y gestión de contactos`

    const result = await streamText({
      model: xai("grok-4", {
        apiKey: process.env.XAI_API_KEY,
      }),
      system: systemPrompt,
      messages,
      maxTokens: 2048,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error connecting to Grok AI:", error)
    // Return a clear error response to the client
    return new Response("Error al conectar con el servicio de IA Grok.", { status: 500 })
  }
}
