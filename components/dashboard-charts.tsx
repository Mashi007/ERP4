"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useCurrency } from "@/components/providers/currency-provider"

type PipelineDatum = { stage: string; count: number; value: number }
type ActivityDatum = { type: string; count: number }
type RevenueMonth = { month: string; revenue: number }
type StageConv = { stage: string; rate: number; count: number }

export function PipelineChart({ data = [], className }: { data?: PipelineDatum[]; className?: string }) {
  const { format } = useCurrency()
  const max = Math.max(1, ...data.map((d) => d.value || 0))
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Embudo por etapa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.length === 0 && <div className="text-sm text-muted-foreground">Sin datos.</div>}
        {data.map((d) => (
          <div key={d.stage}>
            <div className="flex justify-between text-xs mb-1">
              <span className="truncate">{d.stage}</span>
              <span className="text-muted-foreground">
                {format(d.value || 0)} {" · "} {d.count}
              </span>
            </div>
            <div className="h-2 rounded bg-muted overflow-hidden">
              <div
                className="h-full bg-emerald-600"
                style={{ width: `${Math.min(100, (100 * (d.value || 0)) / max)}%` }}
                aria-label={`Etapa ${d.stage}`}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function ActivitiesChart({ data = [], className }: { data?: ActivityDatum[]; className?: string }) {
  const max = Math.max(1, ...data.map((d) => d.count || 0))
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Actividades por tipo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.length === 0 && <div className="text-sm text-muted-foreground">Sin datos.</div>}
        {data.map((d) => (
          <div key={d.type}>
            <div className="flex justify-between text-xs mb-1">
              <span className="truncate">{d.type}</span>
              <span className="text-muted-foreground">{d.count}</span>
            </div>
            <div className="h-2 rounded bg-muted overflow-hidden">
              <div
                className="h-full bg-emerald-600"
                style={{ width: `${Math.min(100, (100 * (d.count || 0)) / max)}%` }}
                aria-label={`Tipo ${d.type}`}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function RevenueByMonthChart({ data = [], className }: { data?: RevenueMonth[]; className?: string }) {
  const { code } = useCurrency()
  const max = Math.max(1, ...data.map((d) => d.revenue || 0))
  const fmt = new Intl.NumberFormat(undefined, { style: "currency", currency: code, maximumFractionDigits: 0 })
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Ingresos por mes</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 && <div className="text-sm text-muted-foreground">Sin datos.</div>}
        <div className="grid grid-cols-12 gap-2">
          {data.map((d) => (
            <div key={d.month} className="flex flex-col items-center justify-end gap-1">
              <div
                className="w-4 sm:w-6 bg-emerald-600 rounded"
                style={{ height: `${Math.max(4, (120 * (d.revenue || 0)) / max)}px` }}
                aria-label={`Mes ${d.month}`}
                title={fmt.format(d.revenue || 0)}
              />
              <div className="text-[10px] text-muted-foreground">{d.month.slice(5)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function StageConversionChart({ data = [], className }: { data?: StageConv[]; className?: string }) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Conversión entre etapas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.length === 0 && <div className="text-sm text-muted-foreground">Sin datos.</div>}
        {data.map((d) => (
          <div key={d.stage} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="truncate">{d.stage}</span>
              <span className="font-semibold">{d.rate.toFixed(1)}%</span>
            </div>
            <div className="h-2 rounded bg-muted overflow-hidden">
              <div className="h-full bg-emerald-600" style={{ width: `${Math.min(100, Math.max(0, d.rate))}%` }} />
            </div>
            <div className="text-[11px] text-muted-foreground">{d.count} oportunidades</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
