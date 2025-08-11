import { getOrgCurrency } from "@/lib/org-settings"
import { CurrencyForm } from "@/components/settings/currency-form"

export default async function MonedaSettingsPage() {
  const current = await getOrgCurrency("default")

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Configuración • Moneda</h1>
        <p className="text-sm text-muted-foreground">Selecciona la moneda de trabajo para toda la organización.</p>
      </header>
      <CurrencyForm initial={current} />
    </main>
  )
}
