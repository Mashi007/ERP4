"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, XCircle, RefreshCw, Zap, Database } from "lucide-react"
import { aiHealthCheck } from "@/app/settings/ai/actions"
import { useToast } from "@/hooks/use-toast"

interface HealthCheckResult {
  xai: { success: boolean; data?: any; error?: string }
  neon: { success: boolean; data?: any; error?: string }
  overall: boolean
  timestamp: string
}

export function AIStatusClient() {
  const [isLoading, setIsLoading] = useState(false)
  const [lastCheck, setLastCheck] = useState<HealthCheckResult | null>(null)
  const { toast } = useToast()

  const handleHealthCheck = async () => {
    setIsLoading(true)
    try {
      const result = await aiHealthCheck()
      setLastCheck(result)

      toast({
        title: result.overall ? "Conexiones exitosas" : "Problemas detectados",
        description: result.overall
          ? "Todas las conexiones AI están funcionando correctamente"
          : "Se encontraron problemas en algunas conexiones",
        variant: result.overall ? "default" : "destructive",
      })
    } catch (error) {
      toast({
        title: "Error en la prueba",
        description: "No se pudo completar la verificación de conexiones",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span>Estado de conexiones AI</span>
            <Button onClick={handleHealthCheck} disabled={isLoading} size="sm" variant="outline">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              {isLoading ? "Probando..." : "Probar conexión"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {lastCheck ? (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* xAI Connection Status */}
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium">xAI (Grok)</div>
                      <div className="text-xs text-muted-foreground">Modelo de lenguaje</div>
                    </div>
                  </div>
                  <Badge className={lastCheck.xai.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {lastCheck.xai.success ? (
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Conectado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        Error
                      </span>
                    )}
                  </Badge>
                </div>

                {/* Neon Connection Status */}
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">Neon Database</div>
                      <div className="text-xs text-muted-foreground">Base de datos PostgreSQL</div>
                    </div>
                  </div>
                  <Badge className={lastCheck.neon.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {lastCheck.neon.success ? (
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Conectado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        Error
                      </span>
                    )}
                  </Badge>
                </div>
              </div>

              {/* Overall Status */}
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Estado general del sistema</div>
                    <div className="text-xs text-muted-foreground">
                      Última verificación: {new Date(lastCheck.timestamp).toLocaleString("es-ES")}
                    </div>
                  </div>
                  <Badge className={lastCheck.overall ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                    {lastCheck.overall ? "Operativo" : "Degradado"}
                  </Badge>
                </div>
              </div>

              {/* Error Details */}
              {(!lastCheck.xai.success || !lastCheck.neon.success) && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <div className="text-sm font-medium text-red-800 mb-2">Detalles de errores:</div>
                  <div className="space-y-1 text-xs text-red-700">
                    {!lastCheck.xai.success && <div>• xAI: {lastCheck.xai.error || "Connection failed"}</div>}
                    {!lastCheck.neon.success && <div>• Neon: {lastCheck.neon.error || "Connection failed"}</div>}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <RefreshCw className="mx-auto h-8 w-8 mb-2" />
              <p>Haz clic en "Probar conexión" para verificar el estado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
