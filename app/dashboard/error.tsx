"use client"

import { useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service if desired
    console.error("Dashboard error:", error)
  }, [error])

  return (
    <div className="p-4">
      <Alert className="border-red-300/60 bg-red-50">
        <AlertTitle>Error en Dashboard</AlertTitle>
        <AlertDescription className="mt-2 space-y-2 text-sm">
          <p>
            En producción, el Dashboard requiere conexión a la base de datos. Verifica que la variable{" "}
            <code className="rounded bg-black/5 px-1">DATABASE_URL</code> esté configurada y que las tablas existan.
          </p>
          {error?.message ? <p className="text-red-700">Detalle: {error.message}</p> : null}
          {error?.digest ? <p className="text-xs opacity-70">Digest: {error.digest}</p> : null}
        </AlertDescription>
      </Alert>

      <div className="mt-4 flex gap-2">
        <Button onClick={reset}>Reintentar</Button>
        <a
          href="/api/health/neon"
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-md border px-3 py-2 text-sm"
        >
          Ver estado BD
        </a>
      </div>
    </div>
  )
}
