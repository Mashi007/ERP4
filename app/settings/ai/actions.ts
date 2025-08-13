"use server"

export async function testXaiConnection() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/health/xai`)
    const data = await response.json()
    return { success: response.ok, data }
  } catch (error) {
    return { success: false, error: "Connection failed" }
  }
}

export async function testNeonConnection() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/health/neon`)
    const data = await response.json()
    return { success: response.ok, data }
  } catch (error) {
    return { success: false, error: "Connection failed" }
  }
}

export async function aiHealthCheck() {
  try {
    const [xaiResult, neonResult] = await Promise.all([testXaiConnection(), testNeonConnection()])

    return {
      xai: xaiResult,
      neon: neonResult,
      overall: xaiResult.success && neonResult.success,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      xai: { success: false, error: "Connection failed" },
      neon: { success: false, error: "Connection failed" },
      overall: false,
      timestamp: new Date().toISOString(),
    }
  }
}

export async function getAICoverage() {
  const isConfigured = !!process.env.XAI_API_KEY

  const features = [
    {
      key: "chat-ai",
      title: "Chat con IA",
      file: "app/chat/actions.ts",
      fn: "sendMessage",
      status: isConfigured ? "active" : "fallback",
    },
    {
      key: "ai-reports",
      title: "Reportes con IA",
      file: "lib/ai-reports.ts",
      fn: "generateInsights",
      status: isConfigured ? "active" : "fallback",
    },
    {
      key: "client-ai-ask",
      title: "Consultas de clientes",
      file: "components/clients/client-ai-ask.tsx",
      fn: "askAboutClient",
      status: isConfigured ? "active" : "fallback",
    },
    {
      key: "pipeline-sync",
      title: "Sincronización pipeline",
      file: "lib/pipeline-sync.ts",
      fn: "syncPipelineData",
      status: isConfigured ? "active" : "fallback",
    },
  ]

  return { isConfigured, features }
}
