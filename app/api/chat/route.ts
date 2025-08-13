import { streamText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
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
      model: anthropic("claude-3-5-sonnet-20241022", {
        apiKey:
          process.env.ANTHROPIC_API_KEY ||
          "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",
      }),
      system: systemPrompt,
      messages,
      maxTokens: 2048,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error connecting to Claude AI:", error)
    // Return a clear error response to the client
    return new Response("Error al conectar con el servicio de IA Claude.", { status: 500 })
  }
}
