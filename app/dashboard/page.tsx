import { getDashboardData } from "./actions"
import { DateFilters } from "@/components/dashboard/date-filters"
import { RevenueKPIs } from "@/components/dashboard/revenue-kpis"
import { WonLostPercent, ListCurrency, ListCount, TareasPorPropietario } from "@/components/dashboard/charts"
import { DbStatusBanner } from "@/components/dashboard/db-status"
import { getOrgCurrency } from "@/lib/org-settings"
import { industryOptions, sourceOptions } from "@/lib/options"
import { getUsers } from "@/lib/users"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  // Asegura moneda cargada en el layout/provider (servidor)
  await getOrgCurrency("default")

  const from = typeof searchParams.from === "string" ? searchParams.from : undefined
  const to = typeof searchParams.to === "string" ? searchParams.to : undefined
  // Nota: industry/source hoy no filtran en el servidor, pero se mantienen en la URL para sincronizar la UI.
  const industry = typeof searchParams.industry === "string" ? searchParams.industry : undefined
  const source = typeof searchParams.source === "string" ? searchParams.source : undefined
  const responsibleUser = typeof searchParams.responsibleUser === "string" ? searchParams.responsibleUser : undefined
  void industry
  void source
  void responsibleUser

  const data = await getDashboardData({ from, to })
  const responsibleUsers = await getUsers()

  // Use imported options instead of fallback arrays
  const industryOptionsToUse = (data.filters?.industries ?? []).length ? data.filters.industries : industryOptions
  const sourceOptionsToUse = (data.filters?.sources ?? []).length ? data.filters.sources : sourceOptions

  // Agregar pronóstico por etapa (sumando por etapa los valores de cada trimestre)
  const forecastTotalsMap = new Map<string, number>()
  for (const r of data.forecastByQuarterByStage ?? []) {
    const prev = forecastTotalsMap.get(r.stage) ?? 0
    forecastTotalsMap.set(r.stage, prev + (r.value ?? 0))
  }
  const forecastTotalsRows = Array.from(forecastTotalsMap, ([stage, total]) => ({ stage, total }))

  return (
    <div className="mx-auto w-full max-w-7xl p-4">
      <div className="mb-4">
        <DbStatusBanner />
      </div>

      <div className="mb-6">
        <DateFilters
          industries={industryOptionsToUse}
          sources={sourceOptionsToUse}
          responsibleUsers={responsibleUsers}
        />
      </div>

      <div className="mb-6">
        <RevenueKPIs revenueWon={data.kpis.revenueWon ?? 0} revenueLost={data.kpis.revenueLost ?? 0} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <WonLostPercent
          won={Number(data.winLossPercentage?.wonPct ?? 0)}
          lost={Number(data.winLossPercentage?.lostPct ?? 0)}
        />

        <ListCurrency
          title="Valor de oportunidades abiertas por etapa"
          rows={(data.funnelByStage ?? []).map((r) => ({ stage: r.stage, total: r.value ?? 0 }))}
          labelKey="stage"
        />

        <ListCount
          title="Contactos por propietario de ventas"
          rows={(data.contactsByOwner ?? []).map((r) => ({ owner: r.owner, count: r.total ?? 0 }))}
          labelKey="owner"
          countKey="count"
        />

        {/* Tareas por propietario (usa el componente ya preparado) */}
        <TareasPorPropietario data={data.tasksByOwner ?? []} />

        <ListCurrency title="Ingresos pronosticados por etapa" rows={forecastTotalsRows} labelKey="stage" />

        <ListCurrency
          title="Ingresos ganados por fuente"
          rows={(data.revenueBySource ?? []).map((r) => ({ source: r.source, total: r.value ?? 0 }))}
          labelKey="source"
        />
      </div>
    </div>
  )
}
