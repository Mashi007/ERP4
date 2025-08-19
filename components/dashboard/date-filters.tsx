"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Props = {
  // Optional arrays of options; if not provided, component still works using just date filters.
  industries?: string[]
  sources?: string[]
  // Optional initial values (falls back to URL)
  initialFrom?: string
  initialTo?: string
  initialIndustry?: string
  initialSource?: string
}

export function DateFilters({
  industries = [],
  sources = [],
  initialFrom = "",
  initialTo = "",
  initialIndustry = "",
  initialSource = "",
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // derive current from URL (server canonical), then fall back to initial props
  const urlFrom = sp.get("from") || initialFrom
  const urlTo = sp.get("to") || initialTo
  const urlIndustry = sp.get("industry") || initialIndustry
  const urlSource = sp.get("source") || initialSource

  const [from, setFrom] = useState(urlFrom)
  const [to, setTo] = useState(urlTo)
  const [industry, setIndustry] = useState(urlIndustry)
  const [source, setSource] = useState(urlSource)

  // keep state in sync if URL changes elsewhere
  useEffect(() => {
    if (urlFrom !== from) setFrom(urlFrom)
    if (urlTo !== to) setTo(urlTo)
    if (urlIndustry !== industry) setIndustry(urlIndustry)
    if (urlSource !== source) setSource(urlSource)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlFrom, urlTo, urlIndustry, urlSource])

  const canApply = useMemo(() => true, [])

  function apply() {
    const params = new URLSearchParams(sp.toString())
    // dates
    if (from) params.set("from", from)
    else params.delete("from")
    if (to) params.set("to", to)
    else params.delete("to")
    // industry/source
    if (industry) params.set("industry", industry)
    else params.delete("industry")
    if (source) params.set("source", source)
    else params.delete("source")

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  function reset() {
    const params = new URLSearchParams(sp.toString())
    ;["from", "to", "industry", "source"].forEach((k) => params.delete(k))
    startTransition(() => {
      router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`)
    })
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
      <div className="grid gap-1">
        <Label htmlFor="from">Desde</Label>
        <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
      </div>
      <div className="grid gap-1">
        <Label htmlFor="to">Hasta</Label>
        <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <div className="grid gap-1 min-w-44">
        <Label>Industria</Label>
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger>
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {(industries ?? []).map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1 min-w-44">
        <Label>Fuente</Label>
        <Select value={source} onValueChange={setSource}>
          <SelectTrigger>
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {(sources ?? []).map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button onClick={apply} disabled={!canApply || isPending}>
          Aplicar
        </Button>
        <Button variant="outline" onClick={reset} disabled={isPending}>
          Reset
        </Button>
      </div>
    </div>
  )
}
