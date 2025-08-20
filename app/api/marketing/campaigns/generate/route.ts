import { type NextRequest, NextResponse } from "next/server"
import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"

export async function POST(request: NextRequest) {
  try {
    const { prompt, audience, campaignType } = await request.json()

    const result = await streamText({
      model: xai("grok-4"),
      messages: [
        {
          role: "system",
          content: `Eres un experto en marketing digital y copywriting. Tu tarea es crear campañas de marketing efectivas y personalizadas.

Contexto del CRM:
- Sistema de gestión de clientes con módulos de contactos, deals, servicios
- Audiencia objetivo: ${audience || "clientes generales"}
- Tipo de campaña: ${campaignType || "email marketing"}

Genera una campaña completa que incluya:
1. Título/Asunto atractivo
2. Contenido del email/mensaje
3. Call-to-action claro
4. Segmentación recomendada
5. Métricas a seguir

Formato de respuesta en JSON:
{
  "title": "Título de la campaña",
  "subject": "Asunto del email",
  "content": "Contenido completo del mensaje",
  "cta": "Call to action",
  "segmentation": "Recomendaciones de segmentación",
  "metrics": ["métrica1", "métrica2", "métrica3"],
  "recommendations": "Recomendaciones adicionales"
}`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      maxTokens: 1500,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error generating campaign:", error)
    return NextResponse.json({ error: "Error generating campaign with Grok AI" }, { status: 500 })
  }
}
