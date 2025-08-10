import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Bot, Database } from "lucide-react"
import HealthTester from "./health-tester"

export default function IntegrationsStatusPage() {
  const hasNeonEnv = !!process.env.DATABASE_URL
  const hasXaiEnv = !!process.env.XAI_API_KEY

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Estado de Integraciones</h1>
        <p className="text-sm text-muted-foreground">Verifica la instalación y conectividad de Neon y xAI Grok.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Neon (Postgres)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-sm">
              Instalación: <span className="font-medium">Detectada por importaciones del proyecto</span>
            </div>
            <Badge variant="secondary">Package: @neondatabase/serverless</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-sm">
              Configuración:{" "}
              {hasNeonEnv ? (
                <span className="font-medium text-emerald-600">OK (DATABASE_URL presente)</span>
              ) : (
                <span className="font-medium text-red-600">Faltan variables</span>
              )}
            </div>
            <Badge variant={hasNeonEnv ? "default" : "destructive"}>
              {hasNeonEnv ? "DATABASE_URL" : "Sin DATABASE_URL"}
            </Badge>
          </div>
          <Separator />
          <HealthTester kind="neon" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            xAI Grok (AI SDK)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-sm">
              Instalación: <span className="font-medium">Detectada por importaciones del proyecto</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Package: @ai-sdk/xai</Badge>
              <Badge variant="secondary">Package: ai</Badge>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-sm">
              Configuración:{" "}
              {hasXaiEnv ? (
                <span className="font-medium text-emerald-600">OK (XAI_API_KEY presente)</span>
              ) : (
                <span className="font-medium text-red-600">Faltan variables</span>
              )}
            </div>
            <Badge variant={hasXaiEnv ? "default" : "destructive"}>
              {hasXaiEnv ? "XAI_API_KEY" : "Sin XAI_API_KEY"}
            </Badge>
          </div>
          <Separator />
          <HealthTester kind="xai" />
          <p className="text-xs text-muted-foreground">
            El proveedor xAI usa XAI_API_KEY y se invoca con xai("grok-3") usando el AI SDK (generateText). [^1]
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
