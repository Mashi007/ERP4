"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Health = { ok: boolean; message?: string }

async function check(path: string): Promise<Health> {
  try {
    const res = await fetch(path, { cache: "no-store" })
    if (!res.ok) return { ok: false, message: `HTTP ${res.status}` }
    const json = await res.json().catch(() => null)
    return { ok: true, message: typeof json === "object" ? JSON.stringify(json) : undefined }
  } catch (e: any) {
    return { ok: false, message: e?.message || "Network error" }
  }
}

export default function HealthTester() {
  const [neon, setNeon] = useState<Health | null>(null)
  const [xai, setXai] = useState<Health | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const [a, b] = await Promise.all([check("/api/health/neon"), check("/api/health/xai")])
    setNeon(a)
    setXai(b)
    setLoading(false)
  }

  useEffect(() => {
    void run()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Comprobación de Integraciones</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <div className="font-medium">Base de datos (Neon)</div>
          <div className={neon?.ok ? "text-emerald-600" : "text-rose-600"}>
            {neon ? (neon.ok ? "OK" : "ERROR") : "—"} {neon?.message ? `· ${neon.message}` : ""}
          </div>
        </div>
        <div>
          <div className="font-medium">xAI</div>
          <div className={xai?.ok ? "text-emerald-600" : "text-rose-600"}>
            {xai ? (xai.ok ? "OK" : "ERROR") : "—"} {xai?.message ? `· ${xai.message}` : ""}
          </div>
        </div>
        <Button size="sm" onClick={run} disabled={loading}>
          {loading ? "Verificando..." : "Reintentar"}
        </Button>
      </CardContent>
    </Card>
  )
}
