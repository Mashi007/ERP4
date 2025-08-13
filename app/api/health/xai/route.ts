import { NextResponse } from "next/server"
import { xai } from "@ai-sdk/xai"
import { generateText } from "ai"

export async function GET() {
  try {
    if (!process.env.XAI_API_KEY) {
      return NextResponse.json(
        {
          ok: false,
          error: "XAI_API_KEY not configured",
          message: null,
        },
        { status: 500 },
      )
    }

    const startTime = Date.now()

    const { text } = await generateText({
      model: xai("grok-3"),
      prompt: "Responde solo con: 'Sistema operativo'",
      maxTokens: 10,
    })

    const latency = Date.now() - startTime

    return NextResponse.json({
      ok: true,
      message: "xAI Grok respondió correctamente.",
      model: "grok-3",
      latencyMs: latency,
      response: text.trim(),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("xAI health check failed:", error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "xAI connection failed",
        message: null,
      },
      { status: 500 },
    )
  }
}
