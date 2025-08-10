import { NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

export async function GET() {
  try {
    if (!process.env.XAI_API_KEY) {
      return NextResponse.json({ ok: false, message: "Sin conexión: falta XAI_API_KEY." }, { status: 200 })
    }
    const { text } = await generateText({
      model: xai("grok-3"),
      prompt: "ping",
      maxTokens: 5,
    })
    return NextResponse.json({ ok: !!text, message: "xAI Grok respondió correctamente." })
  } catch (error: any) {
    return NextResponse.json({ ok: false, message: `Error: ${error?.message ?? "desconocido"}` }, { status: 200 })
  }
}
