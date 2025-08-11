"use client"

import { CardContent } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import type React from "react"
import { Card } from "@/components/ui/card"
import { useCurrency } from "@/components/providers/currency-provider"

export function WonLostPercent({
  won,
  lost,
}: {
  won: number
  lost: number
}) {
  return (
    <Card className="p-4">
      <div className="text-sm font-medium">Porcentaje de oportunidades ganadas/perdidas</div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-600">Ganadas</div>
          <div className="mt-1 h-3 w-full rounded bg-emerald-100">
            <div className="h-3 rounded bg-emerald-500" style={{ width: `${won}%` }} />
          </div>
          <div className="mt-1 text-sm font-medium">{won}%</div>
        </div>
        <div>
          <div className="text-xs text-gray-600">Perdidas</div>
          <div className="mt-1 h-3 w-full rounded bg-rose-100">
            <div className="h-3 rounded bg-rose-500" style={{ width: `${lost}%` }} />
          </div>
          <div className="mt-1 text-sm font-medium">{lost}%</div>
        </div>
      </div>
    </Card>
  )
}

export function ListCurrency({
  title,
  rows,
  labelKey = "label",
  valueKey = "total",
}: {
  title: string
  rows: Array<Record<string, any>>
  labelKey?: string
  valueKey?: string
}) {
  const { format } = useCurrency()
  return (
    <Card className="p-4">
      <div className="text-sm font-medium">{title}</div>
      <ul className="mt-3 space-y-2">
        {rows.length === 0 ? (
          <li className="text-sm text-gray-500">Sin datos</li>
        ) : (
          rows.map((r, idx) => (
            <li key={idx} className="flex items-center justify-between text-sm">
              <span className="truncate">{String(r[labelKey] ?? r.stage ?? r.source ?? r.owner)}</span>
              <span className="font-medium tabular-nums">{format(Number(r[valueKey] ?? 0))}</span>
            </li>
          ))
        )}
      </ul>
    </Card>
  )
}

export function ListCount({
  title,
  rows,
  labelKey = "label",
  countKey = "count",
}: {
  title: string
  rows: Array<Record<string, any>>
  labelKey?: string
  countKey?: string
}) {
  return (
    <Card className="p-4">
      <div className="text-sm font-medium">{title}</div>
      <ul className="mt-3 space-y-2">
        {rows.length === 0 ? (
          <li className="text-sm text-gray-500">Sin datos</li>
        ) : (
          rows.map((r, idx) => (
            <li key={idx} className="flex items-center justify-between text-sm">
              <span className="truncate">{String(r[labelKey] ?? r.stage ?? r.owner)}</span>
              <span className="font-medium tabular-nums">{Number(r[countKey] ?? 0)}</span>
            </li>
          ))
        )}
      </ul>
    </Card>
  )
}

export function TareasPorPropietario({ data }: { data: { owner: string; open: number; completed: number }[] }) {
  return <ListCount title="Tareas por propietario" rows={data} labelKey="owner" countKey="completed" />
}

export function EmbudoValorPorEtapa({ data }: { data: { stage: string; value: number }[] }) {
  const { format } = useCurrency()
  const max = Math.max(1, ...data.map((d) => d.value))
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Valor de oportunidades abiertas por etapa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.length === 0 ? <Empty /> : null}
        {data.map((d) => (
          <div key={d.stage}>
            <div className="flex items-center justify-between text-sm">
              <span className="truncate">{d.stage}</span>
              <span className="font-medium">{format(d.value)}</span>
            </div>
            <div className="h-2 rounded bg-muted">
              <div className="h-2 rounded bg-emerald-500" style={{ width: `${Math.max(2, (d.value / max) * 100)}%` }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function ContactosPorPropietario({ data }: { data: { owner: string; total: number }[] }) {
  return <ListCount title="Contactos por propietario de ventas" rows={data} labelKey="owner" countKey="total" />
}

export function PronosticoPorEtapa({
  data,
}: {
  data: { quarter: number; stage: string; value: number }[]
}) {
  const { format } = useCurrency()
  // Agrupar por trimestre
  const grouped = data.reduce(
    (acc, d) => {
      const key = `Q${d.quarter}`
      if (!acc[key]) acc[key] = []
      acc[key].push(d)
      return acc
    },
    {} as Record<string, { quarter: number; stage: string; value: number }[]>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Ingresos pronosticados por etapa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? <Empty /> : null}
        {Object.entries(grouped).map(([q, rows]) => (
          <div key={q} className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">{q}</div>
            {rows
              .sort((a, b) => b.value - a.value)
              .map((r) => (
                <Row key={r.stage + r.quarter} left={r.stage} right={<span>{format(r.value)}</span>} />
              ))}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function IngresosPorFuente({ data }: { data: { source: string; value: number }[] }) {
  return <ListCurrency title="Ingresos ganados por fuente" rows={data} labelKey="source" valueKey="value" />
}

export function TiempoMedioDeCiclo({
  avgDays,
  byOwner,
}: {
  avgDays: number
  byOwner: { owner: string; days: number; count: number }[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Tiempo medio de ciclo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-lg">
          Promedio global: <span className="font-semibold tabular-nums">{avgDays.toFixed(1)} días</span>
        </div>
        {byOwner.length === 0 ? <Empty /> : null}
        {byOwner.map((r) => (
          <Row
            key={r.owner}
            left={r.owner}
            right={
              <span className="text-sm tabular-nums">
                {r.days.toFixed(1)} días · {r.count} ganadas
              </span>
            }
          />
        ))}
      </CardContent>
    </Card>
  )
}

export function ConversionPorEtapa({ data }: { data: { stage: string; conversionPct: number; sample: number }[] }) {
  const max = 100
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Tasa de conversión por etapa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.length === 0 ? <Empty /> : null}
        {data.map((d) => (
          <div key={d.stage}>
            <div className="flex items-center justify-between text-sm">
              <span className="truncate">{d.stage}</span>
              <span className="font-medium tabular-nums">{d.conversionPct.toFixed(1)}%</span>
            </div>
            <div className="h-2 rounded bg-muted">
              <div
                className="h-2 rounded bg-sky-500"
                style={{ width: `${Math.max(2, (d.conversionPct / max) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-muted-foreground">muestras: {d.sample}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function RendimientoPorPropietario({
  data,
}: {
  data: { owner: string; wonValue: number; openValue: number; wonRate: number; wonCount: number; total: number }[]
}) {
  const { format } = useCurrency()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Rendimiento por propietario</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.length === 0 ? <Empty /> : null}
        {data.map((r) => (
          <div key={r.owner} className="flex items-center justify-between gap-4 text-sm">
            <div className="min-w-28 truncate font-medium">{r.owner}</div>
            <div className="flex flex-1 items-center gap-2">
              <Pill label="Ganado" value={format(r.wonValue)} color="emerald" />
              <Pill label="Abierto" value={format(r.openValue)} color="slate" />
              <Pill label="Win rate" value={`${r.wonRate.toFixed(1)}%`} color="sky" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function ConversionPorEtapaComparada({
  data,
}: {
  data: { segment: string; stage: string; conversionPct: number; sample: number }[]
}) {
  // Mostrar como tabla simple segment x stage
  const stages = Array.from(new Set(data.map((d) => d.stage)))
  const segments = Array.from(new Set(data.map((d) => d.segment)))

  function get(segment: string, stage: string) {
    const row = data.find((d) => d.segment === segment && d.stage === stage)
    return row ? `${row.conversionPct.toFixed(1)}% (${row.sample})` : "—"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Comparativa de conversión por etapa (segmentos top)</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="p-2 text-muted-foreground">Segmento</th>
              {stages.map((s) => (
                <th key={s} className="p-2 text-muted-foreground">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {segments.map((seg) => (
              <tr key={seg} className="border-t">
                <td className="p-2 font-medium">{seg}</td>
                {stages.map((s) => (
                  <td key={seg + s} className="p-2 tabular-nums">
                    {get(seg, s)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

export function CicloPorSegmento({ data }: { data: { segment: string; days: number; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.days))
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Tiempo medio de ciclo por segmento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.length === 0 ? <Empty /> : null}
        {data.map((d) => (
          <div key={d.segment}>
            <div className="flex items-center justify-between text-sm">
              <span className="truncate">{d.segment}</span>
              <span className="font-medium tabular-nums">{d.days.toFixed(1)} días</span>
            </div>
            <div className="h-2 rounded bg-muted">
              <div className="h-2 rounded bg-violet-500" style={{ width: `${Math.max(2, (d.days / max) * 100)}%` }} />
            </div>
            <div className="text-[10px] text-muted-foreground">muestras: {d.count}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

/* Helpers UI */
function Row({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-28 truncate">{left}</div>
      <div className="text-right">{right}</div>
    </div>
  )
}

function Empty() {
  return <div className="text-sm text-muted-foreground">Sin datos en el rango/segmento seleccionado.</div>
}

function Pill({ label, value, color }: { label: string; value: string; color: "emerald" | "slate" | "sky" }) {
  const map = {
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    slate: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300",
    sky: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  }
  return (
    <span className={`inline-flex items-center gap-2 rounded px-2 py-0.5 text-xs ${map[color]}`}>
      <span className="font-medium">{label}</span>
      <span className="tabular-nums">{value}</span>
    </span>
  )
}
