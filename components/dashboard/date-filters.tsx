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
  responsibleUsers?: Array<{ id: string; name: string }>
  // Optional initial values (falls back to URL)
  initialFrom?: string
  initialTo?: string
  initialIndustry?: string
  initialSource?: string
  initialResponsibleUser?: string
}

export function DateFilters({
  industries = [],
  sources = [],
  responsibleUsers = [],
  initialFrom = "",
  initialTo = "",
  initialIndustry = "",
  initialSource = "",
  initialResponsibleUser = "",
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
  const urlResponsibleUser = sp.get("responsibleUser") || initialResponsibleUser

  const [from, setFrom] = useState(urlFrom)
  const [to, setTo] = useState(urlTo)
  const [industry, setIndustry] = useState(urlIndustry)
  const [source, setSource] = useState(urlSource)
  const [responsibleUser, setResponsibleUser] = useState(urlResponsibleUser)

  // keep state in sync if URL changes elsewhere
  useEffect(() => {
    if (urlFrom !== from) setFrom(urlFrom)
    if (urlTo !== to) setTo(urlTo)
    if (urlIndustry !== industry) setIndustry(urlIndustry)
    if (urlSource !== source) setSource(urlSource)
    if (urlResponsibleUser !== responsibleUser) setResponsibleUser(urlResponsibleUser)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlFrom, urlTo, urlIndustry, urlSource, urlResponsibleUser])

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
    if (responsibleUser) params.set("responsibleUser", responsibleUser)
    else params.delete("responsibleUser")

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  function reset() {
    const params = new URLSearchParams(sp.toString())
    ;["from", "to", "industry", "source", "responsibleUser"].forEach((k) => params.delete(k))
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
      <div className="grid gap-1 min-w-44">
        <Label>Responsable Comercial</Label>
        <Select value={responsibleUser} onValueChange={setResponsibleUser}>
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {(responsibleUsers ?? []).map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
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

export default DateFilters
