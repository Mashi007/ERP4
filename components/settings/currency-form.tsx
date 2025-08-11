"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { useCurrency } from "@/components/providers/currency-provider"

type CurrencyCode = "EUR" | "USD" | "MXN"

const OPTIONS: { code: CurrencyCode; name: string }[] = [
  { code: "EUR", name: "Euro" },
  { code: "USD", name: "Dólar estadounidense" },
  { code: "MXN", name: "Peso mexicano" },
]

export function CurrencyForm({ initial }: { initial: CurrencyCode }) {
  const router = useRouter()
  const currencyCtx = useCurrency()
  const [currency, setCurrency] = React.useState<CurrencyCode>(initial)
  const [saving, setSaving] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)

  const preview = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(123456.78)

  async function onSave() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/settings/currency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data?.ok === false) {
        setMessage(data?.error || "No se pudo guardar la moneda.")
        return
      }
      currencyCtx?.setCode?.(currency) // aplica inmediatamente en la UI
      setMessage("Moneda actualizada.")
      router.refresh() // refresca SSR (Dashboard, etc.)
    } catch {
      setMessage("Error de red al guardar.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <CardContent className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Afecta a todos los módulos: Dashboard, Ventas, Clientes y Reportes.
      </p>

      <div className="space-y-2">
        <Label>Selecciona la moneda</Label>
        <Select value={currency} onValueChange={(v) => setCurrency(v as CurrencyCode)}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Selecciona" />
          </SelectTrigger>
          <SelectContent>
            {OPTIONS.map((o) => (
              <SelectItem key={o.code} value={o.code}>
                {o.code} • {o.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={onSave} disabled={saving}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
        {message && <span className="text-sm text-muted-foreground">{message}</span>}
      </div>

      <div className="text-xs text-muted-foreground">Vista previa: {preview}</div>
    </CardContent>
  )
}

export default CurrencyForm
