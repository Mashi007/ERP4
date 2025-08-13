import { AnthropicStream, StreamingTextResponse } from "ai"
import Anthropic from "@anthropic-ai/sdk"
import { getCRMContext } from "@/lib/chat-ai"

// Create Anthropic client using the API key from environment variables
const anthropic = new Anthropic({
  apiKey:
    process.env.ANTHROPIC_API_KEY ||
    "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",
})

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

    // Request chat completion from Anthropic API in streaming mode
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022", // Latest Claude model
      stream: true,
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages,
    })

    // Convert response to a friendly text stream
    const stream = AnthropicStream(response)

    // Respond with the stream so the frontend can consume it
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("Error connecting to Anthropic:", error)
    // Return a clear error response to the client
    return new Response("Error al conectar con el servicio de IA Claude.", { status: 500 })
  }
}
