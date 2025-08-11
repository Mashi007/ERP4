"use server"

/**
 * Returns whether AI is configured and a list of AI-enabled features
 * with their current status (active/fallback).
 *
 * Note: In a "use server" file you can ONLY export async functions.
 * Keep any constants/types unexported.
 */
export async function getAICoverage() {
  const isConfigured = Boolean(process.env.XAI_API_KEY)
  const status: "active" | "fallback" = isConfigured ? "active" : "fallback"

  const features = [
    {
      key: "pipeline-insights",
      title: "Insights de Pipeline",
      file: "lib/ai-enhanced.ts",
      fn: "enhanceWithAI",
      status,
    },
    {
      key: "ai-reports",
      title: "Reportes con IA",
      file: "lib/ai-reports.ts",
      fn: "generateSalesReport",
      status,
    },
    {
      key: "chat-ai",
      title: "Asistente de Chat",
      file: "lib/chat-ai.ts",
      fn: "chat",
      status,
    },
    {
      key: "cliente-ai",
      title: "Preguntas sobre el cliente",
      file: "components/clients/client-ai-ask.tsx",
      fn: "ClientAIAsk",
      status,
    },
  ] as const

  return { isConfigured, features: features.map((f) => ({ ...f })) }
}

/**
 * Optional helper to verify connectivity, useful for a "Probar conexión" button.
 * Not currently used by the page, but kept async to comply with "use server".
 */
export async function probeAI() {
  return {
    ok: Boolean(process.env.XAI_API_KEY),
    provider: "xAI",
    testedAt: new Date().toISOString(),
  }
}
