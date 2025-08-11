import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { getOrgCurrency } from "@/lib/org-settings"
import { CurrencyForm } from "@/components/settings/currency-form"

export default async function AccountSettingsPage() {
  // Server Component: fetch initial value
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
          {/* Client component handles state and saving */}
          <CurrencyForm initial={initial} />
        </Card>
      </div>
    </div>
  )
}
