"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Loader2, FileText, Clock, Pencil, Trash2 } from "lucide-react"

type Activity = {
  id: number
  type: string | null
  title: string | null
  contact_id: number | null
  deal_id: number | null
  company: string | null
  activity_date: string | null
  activity_time: string | null
  duration: number | null
  status: string | null
  notes: string | null
  sales_owner: string | null
  created_at: string | null
  updated_at: string | null
}

function uniqueById<T extends { id: number }>(items: T[]) {
  const map = new Map<number, T>()
  for (const it of items) map.set(it.id, it)
  return Array.from(map.values())
}

function broadcast<T>(type: string, payload: T) {
  try {
    if ("BroadcastChannel" in window) {
      const ch = new BroadcastChannel("crm-activities")
      ch.postMessage({ type, payload })
      ch.close()
    }
  } catch {
    // no-op
  }
}

// Histórico SOLO de la oportunidad. Requiere dealId.
export function LeadHistory({
  dealId,
  title = "Histórico de la Oportunidad",
  limit = 50,
  enableInlineEdit = true,
  className = "",
}: {
  dealId: number
  title?: string
  limit?: number
  enableInlineEdit?: boolean
  className?: string
}) {
  const [items, setItems] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const scopeDealId = useMemo(() => dealId, [dealId])
  const channelRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    let canceled = false
    async function load() {
      if (scopeDealId == null) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/activities/by-lead?dealId=${encodeURIComponent(String(scopeDealId))}`, {
          cache: "no-store",
        })
        const json = await res.json()
        if (!canceled) {
          if (!res.ok || !json?.success) {
            setError(json?.error ?? "Error al cargar histórico")
          } else {
            const list = Array.isArray(json.activities) ? (json.activities as Activity[]) : []
            setItems(uniqueById(list).slice(0, limit))
          }
        }
      } catch (e: any) {
        if (!canceled) setError(e?.message ?? "Error de red")
      } finally {
        if (!canceled) setLoading(false)
      }
    }
    load()
    return () => {
      canceled = true
    }
  }, [scopeDealId, limit])

  // Escucha de eventos para mantener sincronizado SOLO el deal actual y evitar duplicados
  useEffect(() => {
    try {
      if ("BroadcastChannel" in window) {
        // Cerrar canal previo si existía
        if (channelRef.current) {
          channelRef.current.close()
          channelRef.current = null
        }
        const ch = new BroadcastChannel("crm-activities")
        channelRef.current = ch
        const onMsg = (ev: MessageEvent) => {
          const { type, payload } = ev.data || {}
          if (!payload) return
          const p = payload as Activity | { id: number; deal_id?: number }
          // Solo aplicar si corresponde a esta oportunidad
          if ((p as Activity).deal_id != null && (p as Activity).deal_id !== scopeDealId) return

          if (type === "activity:updated") {
            setItems((prev) =>
              uniqueById(prev.map((x) => (x.id === (p as Activity).id ? { ...x, ...(p as Activity) } : x))),
            )
          } else if (type === "activity:deleted") {
            setItems((prev) => prev.filter((x) => x.id !== (p as any).id))
          } else if (type === "activity:created") {
            setItems((prev) => {
              const next = [p as Activity, ...prev]
              return uniqueById(next).slice(0, limit)
            })
          }
        }
        ch.addEventListener("message", onMsg)
        return () => {
          ch.removeEventListener("message", onMsg)
          ch.close()
          channelRef.current = null
        }
      }
    } catch {
      // no-op
    }
  }, [scopeDealId, limit])

  async function updateActivity(a: Activity) {
    if (!enableInlineEdit) return
    const newTitle = window.prompt("Editar título", a.title ?? "") ?? undefined
    if (newTitle === undefined) return
    const newStatus = window.prompt("Editar estado (opcional)", a.status ?? "") ?? null
    const newNotes = window.prompt("Editar notas (opcional)", a.notes ?? "") ?? null

    try {
      const res = await fetch("/api/activities", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: a.id, title: newTitle, status: newStatus, notes: newNotes }),
      })
      const json = await res.json()
      if (!res.ok || !json?.success) throw new Error(json?.error ?? "No se pudo actualizar")
      const updated: Activity = json.activity
      setItems((prev) => uniqueById(prev.map((x) => (x.id === updated.id ? updated : x))))
      broadcast("activity:updated", updated)
    } catch (e: any) {
      setError(e?.message ?? "No se pudo actualizar")
    }
  }

  async function deleteActivity(a: Activity) {
    if (!window.confirm(`¿Eliminar actividad "${a.title ?? "sin título"}"?`)) return
    try {
      const res = await fetch(`/api/activities?id=${a.id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok || !json?.success) throw new Error(json?.error ?? "No se pudo eliminar")
      setItems((prev) => prev.filter((x) => x.id !== a.id))
      broadcast("activity:deleted", { id: a.id, deal_id: scopeDealId })
    } catch (e: any) {
      setError(e?.message ?? "No se pudo eliminar")
    }
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        <div className="text-xs text-muted-foreground">dealId: {scopeDealId}</div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Cargando histórico...
          </div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-muted-foreground">Sin actividades para esta oportunidad.</div>
        ) : (
          <ul className="space-y-3">
            {items.map((a, idx) => {
              const dt = a.activity_date || a.updated_at || a.created_at
              return (
                <li key={a.id}>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-sm">{a.title || a.type || "Actividad"}</span>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {a.status || "—"}
                        </Badge>
                        {a.company ? <span className="text-xs text-muted-foreground">• {a.company}</span> : null}
                      </div>
                      {a.notes ? <div className="mt-1 text-xs text-muted-foreground">{a.notes}</div> : null}
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{dt ? new Date(dt).toLocaleString() : "—"}</span>
                        {a.duration ? <Separator orientation="vertical" className="h-3" /> : null}
                        {a.duration ? <span>{a.duration} min</span> : null}
                      </div>
                    </div>
                    {enableInlineEdit && (
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Editar"
                          aria-label="Editar"
                          onClick={() => updateActivity(a)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Eliminar"
                          aria-label="Eliminar"
                          onClick={() => deleteActivity(a)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {idx < items.length - 1 ? <Separator className="mt-3" /> : null}
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export default LeadHistory
