import { HealthTester } from "./health-tester"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Zap, AlertCircle } from "lucide-react"

export const metadata = {
  title: "Integraciones",
  description: "Estado y configuración de integraciones del sistema",
}

export default function IntegrationsPage() {
  const isDatabaseConfigured = !!process.env.DATABASE_URL
  const isXaiConfigured = !!process.env.XAI_API_KEY

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Database className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">Integraciones</h1>
      </div>

      {/* Neon Database Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-lg">
            <Database className="h-5 w-5" />
            Neon (Postgres)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Instalación:</div>
              <div className="text-sm">Detectada por importaciones del proyecto</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Package:</div>
              <div className="text-sm font-mono">@neondatabase/serverless</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Configuración:</span>
            {isDatabaseConfigured ? (
              <>
                <span className="text-sm text-green-600 font-medium">OK (DATABASE_URL presente)</span>
                <Badge variant="secondary" className="text-xs">
                  DATABASE_URL
                </Badge>
              </>
            ) : (
              <>
                <span className="text-sm text-red-600 font-medium">ERROR (DATABASE_URL faltante)</span>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* xAI Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-lg">
            <Zap className="h-5 w-5" />
            xAI (Grok)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Instalación:</div>
              <div className="text-sm">Integración nativa del sistema</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Modelo:</div>
              <div className="text-sm font-mono">grok-3</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Configuración:</span>
            {isXaiConfigured ? (
              <>
                <span className="text-sm text-green-600 font-medium">OK (XAI_API_KEY presente)</span>
                <Badge variant="secondary" className="text-xs">
                  XAI_API_KEY
                </Badge>
              </>
            ) : (
              <>
                <span className="text-sm text-red-600 font-medium">ERROR (XAI_API_KEY faltante)</span>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Health Testing Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comprobación de Integraciones</CardTitle>
        </CardHeader>
        <CardContent>
          <HealthTester />
        </CardContent>
      </Card>
    </div>
  )
}
