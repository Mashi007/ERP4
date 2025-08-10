"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Props = {
  owners?: string[]
  initialStart?: string
  initialEnd?: string
  initialOwner?: string
  className?: string
}

function normalizeDate(value?: string) {
  if (!value) return ""
  const d = new Date(value)
  if (isNaN(d.getTime())) return ""
  return d.toISOString().slice(0, 10)
}

export default function FilterBar({
  owners = [],
  initialStart = "",
  initialEnd = "",
  initialOwner = "",
  className,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [start, setStart] = useState<string>(normalizeDate(initialStart))
  const [end, setEnd] = useState<string>(normalizeDate(initialEnd))
  const [owner, setOwner] = useState<string>(initialOwner ?? "")

  const apply = () => {
    const params = new URLSearchParams(searchParams?.toString() || "")
    params.delete("start")
    params.delete("end")
    params.delete("owner")
    if (start) params.set("start", start)
    if (end) params.set("end", end)
    if (owner) params.set("owner", owner)

    startTransition(() => {
      router.push(`/dashboard?${params.toString()}`, { scroll: false })
      router.refresh()
    })
  }

  const clearAll = () => {
    setStart("")
    setEnd("")
    setOwner("")
    startTransition(() => {
      router.push(`/dashboard`, { scroll: false })
      router.refresh()
    })
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end bg-muted/40 rounded-md p-3",
        className,
      )}
      aria-label="Filtros del dashboard"
    >
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground" htmlFor="filter-start">
          Desde
        </label>
        <Input id="filter-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} className="h-9" />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground" htmlFor="filter-end">
          Hasta
        </label>
        <Input id="filter-end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="h-9" />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground" htmlFor="filter-owner">
          Dueño de ventas
        </label>
        <select
          id="filter-owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          className="h-9 w-full rounded-md border bg-background px-2 text-sm"
        >
          <option value="">Todos</option>
          {owners.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={apply}
          disabled={isPending}
          className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isPending ? "Aplicando…" : "Aplicar"}
        </Button>
        <Button type="button" variant="outline" onClick={clearAll} className="h-9 bg-transparent">
          Limpiar
        </Button>
      </div>
    </div>
  )
}
