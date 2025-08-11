import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { getOrgCurrency } from "@/lib/org-settings"
import { useState } from "react"
import { setCode } from "@/components/providers/currency-provider"
import { useCurrency } from "@/components/providers/currency-provider"

export default async function AccountSettingsPage() {
  const initial = await getOrgCurrency("default")
  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Ajustes de la cuenta</h1>
          <p className="text-gray-600">Configura la moneda por organización. Afecta todos los módulos.</p>
        </header>

        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Moneda</CardTitle>
          </CardHeader>
          <CurrencySettingsForm initial={initial} />
        </Card>
      </div>
    </div>
  )
}

function CurrencySettingsForm({ initial }: { initial: "EUR" | "USD" | "MXN" }) {
  "use client"
  const [currency, setCurrency] = useState<"EUR" | "USD" | "MXN">(initial)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const { setCode: setCurrencyCode } = setCode ? { setCode } : { setCode: (_: any) => {} }
  const ctx = useCurrency?.()
  const applyInApp = ctx?.setCode ?? ((_: any) => {})

  async function onSave() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/settings/currency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency }),
      })
      const data = await res.json()
      if (!res.ok || !data?.ok) {
        setMessage(data?.error || "No se pudo guardar la moneda.")
      } else {
        // Update provider immediately so UI reflects the change without reload
        applyInApp(currency)
        setMessage("Moneda actualizada.")
      }
    } catch {
      setMessage("Error de red al guardar.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label>Selecciona la moneda</Label>
        <Select value={currency} onValueChange={(v) => setCurrency(v as any)}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Selecciona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EUR">EUR • Euro</SelectItem>
            <SelectItem value="USD">USD • Dólar estadounidense</SelectItem>
            <SelectItem value="MXN">MXN • Peso mexicano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={onSave} disabled={saving}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
        {message && <span className="text-sm text-muted-foreground">{message}</span>}
      </div>

      <p className="text-xs text-muted-foreground">
        Esta preferencia se usa para el formateo con Intl.NumberFormat en toda la aplicación.
      </p>
    </CardContent>
  )
}
