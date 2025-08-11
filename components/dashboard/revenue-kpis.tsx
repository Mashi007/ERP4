"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { useCurrency } from "@/components/providers/currency-provider"

export function RevenueKPIs({
  revenueWon,
  revenueLost,
}: {
  revenueWon: number
  revenueLost: number
}) {
  const { format } = useCurrency()

  const items = useMemo(
    () => [
      { title: "Ingresos ganados", value: format(revenueWon), accent: "text-emerald-600" },
      { title: "Ingresos perdidos", value: format(revenueLost), accent: "text-rose-600" },
    ],
    [revenueWon, revenueLost, format],
  )

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((i) => (
        <Card key={i.title} className="p-4">
          <div className="text-sm text-gray-600">{i.title}</div>
          <div className={`mt-2 text-3xl font-semibold tabular-nums ${i.accent}`}>{i.value}</div>
        </Card>
      ))}
    </div>
  )
}
