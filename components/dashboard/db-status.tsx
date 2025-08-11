"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type HealthResponse = {
  ok: boolean
  message?: string
} | null

export function DbStatusBanner() {
  const [health, setHealth] = useState<HealthResponse>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/health/neon", { cache: "no-store" })
        const json = (await res.json()) as HealthResponse
        if (mounted) setHealth(json)
      } catch {
        if (mounted) setHealth({ ok: false, message: "Network error" })
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  // Hide when loading or when the DB is healthy (success banner removed)
  if (!health || health.ok) return null

  // Show only when there is a DB issue
  return (
    <Alert className="border-red-300/60 bg-red-50">
      <AlertTitle>{"Base de datos no disponible"}</AlertTitle>
      <AlertDescription className="text-sm">
        {health.message ?? "Sin conexión a la BD. Mostrando datos de ejemplo."}
      </AlertDescription>
    </Alert>
  )
}
