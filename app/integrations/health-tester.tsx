"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Check = {
  name: string
  url: string
  status: "idle" | "ok" | "error"
  message?: string
}

export default function HealthTester() {
  const [checks, setChecks] = React.useState<Check[]>([
    { name: "Neon (DB)", url: "/api/health/neon", status: "idle" },
    { name: "xAI (Grok)", url: "/api/health/xai", status: "idle" },
  ])

  async function run(index: number) {
    setChecks((c) => c.map((ch, i) => (i === index ? { ...ch, status: "idle", message: "" } : ch)))
    try {
      const res = await fetch(checks[index].url, { cache: "no-store" })
      const ok = res.ok
      const msg = ok ? "OK" : `HTTP ${res.status}`
      setChecks((c) => c.map((ch, i) => (i === index ? { ...ch, status: ok ? "ok" : "error", message: msg } : ch)))
    } catch (e: any) {
      setChecks((c) =>
        c.map((ch, i) => (i === index ? { ...ch, status: "error", message: e?.message ?? "Network error" } : ch)),
      )
    }
  }

  async function runAll() {
    for (let i = 0; i < checks.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await run(i)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pruebas de Integración</CardTitle>
        <Button onClick={runAll}>Probar todo</Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {checks.map((c, i) => (
          <div key={c.name} className="flex items-center justify-between rounded-md border p-3">
            <div className="space-y-0.5">
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.url}</div>
              {c.message ? <div className="text-xs">{c.message}</div> : null}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={c.status === "ok" ? "default" : c.status === "error" ? "destructive" : "secondary"}>
                {c.status.toUpperCase()}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => run(i)}>
                Probar
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
