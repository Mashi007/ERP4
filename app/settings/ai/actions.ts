"use server"

import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

type HealthOK = {
  ok: true
  latencyMs: number
  model: string
  sample: string
}

type HealthError = {
  ok: false
  latencyMs: number
  reason: "MISSING_API_KEY" | "REQUEST_FAILED"
  error?: string
}

export type AIHealth = HealthOK | HealthError

// Catalog of AI features implemented in this project.
export const AI_FEATURES = [
  // lib/ai-enhanced.ts
  {
    key: "dashboard-insights",
    title: "Dashboard · Insights",
    file: "lib/ai-enhanced.ts",
    fn: "generateDashboardInsights",
  },
  {
    key: "appointment-insights",
    title: "Citas · Insights",
    file: "lib/ai-enhanced.ts",
    fn: "generateAppointmentInsights",
  },
  {
    key: "marketing-campaign",
    title: "Marketing · Generación de campañas",
    file: "lib/ai-enhanced.ts",
    fn: "generateMarketingCampaign",
  },
  {
    key: "marketing-insights",
    title: "Marketing · Insights de campañas",
    file: "lib/ai-enhanced.ts",
    fn: "generateMarketingInsights",
  },
  {
    key: "communication-strategy",
    title: "Contactos · Estrategia de comunicación",
    file: "lib/ai-enhanced.ts",
    fn: "generateCommunicationStrategy",
  },
  {
    key: "activity-recommendations",
    title: "Actividades · Recomendaciones",
    file: "lib/ai-enhanced.ts",
    fn: "generateActivityRecommendations",
  },

  // lib/ai-reports.ts
  {
    key: "pipeline-report",
    title: "Embudo · Informe ejecutivo",
    file: "lib/ai-reports.ts",
    fn: "generatePipelineReport",
  },
  { key: "deal-insights", title: "Oportunidades · Insights", file: "lib/ai-reports.ts", fn: "generateDealInsights" },
  {
    key: "contact-strategy",
    title: "Contactos · Estrategia",
    file: "lib/ai-reports.ts",
    fn: "generateContactStrategy",
  },

  // lib/chat-ai.ts
  {
    key: "chat-assistant",
    title: "Asistente · Chat CRM",
    file: "lib/chat-ai.ts",
    fn: "generateChatResponse / streamChatResponse",
  },

  // app/clientes/[id]/actions.ts
  {
    key: "client-ai-summary",
    title: "Cliente · Resumen con IA",
    file: "app/clientes/[id]/actions.ts",
    fn: "askClientAI",
  },
] as const

export type AIFeatureStatus = {
  key: string
  title: string
  file: string
  fn: string
  status: "active" | "fallback"
}

export async function getAICoverage(): Promise<{
  isConfigured: boolean
  features: AIFeatureStatus[]
}> {
  const isConfigured = !!process.env.XAI_API_KEY
  const features = AI_FEATURES.map((f) => ({
    ...f,
    status: isConfigured ? "active" : "fallback",
  }))
  return { isConfigured, features }
}

/**
 * Minimal health check to verify xAI reachability via AI SDK.
 * Uses a tiny prompt and low maxTokens to keep it fast and cheap.
 */
export async function aiHealthCheck(): Promise<AIHealth> {
  const start = Date.now()
  const hasKey = !!process.env.XAI_API_KEY
  if (!hasKey) {
    return { ok: false, latencyMs: 0, reason: "MISSING_API_KEY" }
  }

  try {
    const { text } = await generateText({
      model: xai("grok-3"),
      prompt: "ping",
      maxTokens: 5,
    })
    return {
      ok: true,
      latencyMs: Date.now() - start,
      model: "grok-3",
      sample: text.trim(),
    }
  } catch (error: any) {
    return {
      ok: false,
      latencyMs: Date.now() - start,
      reason: "REQUEST_FAILED",
      error: String(error?.message ?? error),
    }
  }
}
