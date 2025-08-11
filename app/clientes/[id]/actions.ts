"use server"

import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { getClientById } from "@/app/clientes/queries"

export async function askClientAI(prevState: any, formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "")
  const question = String(formData.get("q") ?? "").trim()
  if (!question) {
    return { ok: false, answer: "Escribe una pregunta para generar el informe." }
  }

  const client = await getClientById(clientId)
  const context = `
Cliente: ${client?.name ?? "N/D"}
Empresa: ${client?.company ?? "N/D"}
Cargo: ${client?.title ?? "N/D"}
Email: ${client?.email ?? "N/D"}
Teléfono: ${client?.phone ?? "N/D"}
  `.trim()

  const { text } = await generateText({
    model: xai("grok-3"),
    system:
      "Eres un asistente de CRM. Resumes y generas informes ejecutivos claros y accionables. Devuelve español neutro y secciones con viñetas cuando aporte claridad.",
    prompt: `Contexto del cliente:\n${context}\n\nPregunta: ${question}\n\nGenera un informe corto, con recomendaciones.`,
  })

  return { ok: true, answer: text }
}
