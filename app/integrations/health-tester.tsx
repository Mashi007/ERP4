"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw, Database, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface HealthResult {
  neon: {
    ok: boolean
    data?: any
    error?: string
  }
  xai: {
    ok: boolean
    message?: string
    error?: string
  }
}

export function HealthTester() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<HealthResult | null>(null)
  const { toast } = useToast()

  const runHealthCheck = async () => {
    setIsLoading(true)
    try {
      // Test Neon Database
      const neonResponse = await fetch("/api/health/neon")
      const neonData = await neonResponse.json()

      // Test xAI
      const xaiResponse = await fetch("/api/health/xai")
      const xaiData = await xaiResponse.json()

      const healthResults: HealthResult = {
        neon: {
          ok: neonResponse.ok,
          data: neonData,
          error: !neonResponse.ok ? neonData.error : undefined,
        },
        xai: {
          ok: xaiResponse.ok,
          message: xaiData.message || "xAI Grok respondió correctamente.",
          error: !xaiResponse.ok ? xaiData.error : undefined,
        },
      }

      setResults(healthResults)

      const allOk = healthResults.neon.ok && healthResults.xai.ok
      toast({
        title: allOk ? "Todas las integraciones funcionan" : "Algunas integraciones fallan",
        description: allOk ? "Neon y xAI están operativos" : "Revisa los detalles de las conexiones que fallan",
        variant: allOk ? "default" : "destructive",
      })
    } catch (error) {
      toast({
        title: "Error en las pruebas",
        description: "No se pudieron completar las verificaciones",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {results && (
        <div className="space-y-3">
          {/* Neon Database Result */}
          <div className="flex items-start justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-medium">Base de datos (Neon)</div>
                {results.neon.ok ? (
                  <div className="text-sm text-green-600 font-medium">
                    OK ·{" "}
                    {JSON.stringify({
                      ok: true,
                      error: null,
                      details: {
                        deals: null,
                        contacts: null,
                        activities: null,
                        appointments: null,
                      },
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-red-600">ERROR · {results.neon.error || "Connection failed"}</div>
                )}
              </div>
            </div>
            <Badge className={results.neon.ok ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {results.neon.ok ? "OK" : "ERROR"}
            </Badge>
          </div>

          {/* xAI Result */}
          <div className="flex items-start justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-blue-500" />
              <div>
                <div className="font-medium">xAI</div>
                {results.xai.ok ? (
                  <div className="text-sm text-green-600 font-medium">
                    OK ·{" "}
                    {JSON.stringify({
                      ok: true,
                      message: results.xai.message,
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-red-600">ERROR · {results.xai.error || "Connection failed"}</div>
                )}
              </div>
            </div>
            <Badge className={results.xai.ok ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {results.xai.ok ? "OK" : "ERROR"}
            </Badge>
          </div>
        </div>
      )}

      <Button onClick={runHealthCheck} disabled={isLoading} className="w-full sm:w-auto">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Probando...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            {results ? "Reintentar" : "Probar integraciones"}
          </>
        )}
      </Button>
    </div>
  )
}
