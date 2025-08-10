import type React from "react"
import {
  CalendarDays,
  Handshake,
  MailOpen,
  Megaphone,
  MessagesSquare,
  Presentation,
  Users,
  Workflow,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ActivitiesChart,
  PipelineChart,
  RevenueByMonthChart,
  StageConversionChart,
  WinLossCard,
} from "@/components/dashboard-charts"
import FilterBar from "@/components/dashboard/filter-bar"
import { getDashboardFullData, generateDashboardReport, getSalesOwners, type DashboardFilters } from "./actions"
import Link from "next/link"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const start = typeof searchParams?.start === "string" ? searchParams.start : undefined
  const end = typeof searchParams?.end === "string" ? searchParams.end : undefined
  const owner = typeof searchParams?.owner === "string" ? searchParams.owner : undefined

  const filters: DashboardFilters = { start: start ?? undefined, end: end ?? undefined, owner: owner ?? undefined }

  const [data, report, owners] = await Promise.all([
    getDashboardFullData(filters),
    generateDashboardReport(filters),
    getSalesOwners().catch(() => [] as string[]),
  ])

  const { insights } = report

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Resumen en tiempo real de Contactos, Embudo, Actividades, Citas, Marketing y Comunicaciones.
          </p>
        </div>
        <FilterBar owners={owners} initialStart={start} initialEnd={end} initialOwner={owner} />
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="h-5 w-5 text-emerald-600" />}
          title="Contactos"
          value={data.totals.totalContacts}
        />
        <StatCard
          icon={<Handshake className="h-5 w-5 text-emerald-600" />}
          title="Oportunidades"
          value={data.totals.totalDeals}
        />
        <StatCard
          icon={<Workflow className="h-5 w-5 text-emerald-600" />}
          title="Actividades"
          value={data.totals.activitiesCount}
        />
        <StatCard
          icon={<CalendarDays className="h-5 w-5 text-emerald-600" />}
          title="Citas"
          value={data.totals.appointmentsCount}
        />
        <StatCard
          icon={<Presentation className="h-5 w-5 text-emerald-600" />}
          title="Ingresos (pipeline)"
          value={`$${Intl.NumberFormat().format(data.totals.totalRevenue)}`}
        />
        <StatCard
          icon={<Megaphone className="h-5 w-5 text-emerald-600" />}
          title="Campañas"
          value={data.totals.campaignsCount}
        />
        <StatCard
          icon={<MessagesSquare className="h-5 w-5 text-emerald-600" />}
          title="Conversaciones"
          value={data.totals.conversationsCount}
        />
        <StatCard
          icon={<MailOpen className="h-5 w-5 text-emerald-600" />}
          title="Avg. Open/Click"
          value={`${data.marketing.avgOpenRate.toFixed(1)}% / ${data.marketing.avgClickRate.toFixed(1)}%`}
        />
      </section>

      {/* Gráficos principales */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <PipelineChart data={data.dealsByStage} className="xl:col-span-2" />
        <WinLossCard wonPct={data.winLoss.wonPct} lostPct={data.winLoss.lostPct} />
      </section>

      {/* Actividades, Ingresos por mes y Conversión */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ActivitiesChart data={data.activitiesByType} className="lg:col-span-1" />
        <RevenueByMonthChart data={data.revenueByMonth} className="lg:col-span-2" />
      </section>

      <section>
        <StageConversionChart data={data.stageConversion} />
      </section>

      {/* Próximas citas y Marketing */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Próximas citas
              <Badge variant="secondary">{data.upcomingAppointments.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.upcomingAppointments.length === 0 && (
              <div className="text-sm text-muted-foreground">No hay citas próximas.</div>
            )}
            {data.upcomingAppointments.map((a) => {
              const d = new Date(a.appointment_date as any)
              const time = (a as any).appointment_time ?? ""
              return (
                <div
                  key={(a as any).id ?? `${d.toISOString()}-${a.title}`}
                  className="flex items-center justify-between border rounded-md px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate">{a.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{(a as any).company || "—"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{d.toLocaleDateString()}</div>
                    <div className="text-xs text-muted-foreground">{time}</div>
                  </div>
                </div>
              )
            })}
            <div className="text-right">
              <Link href="/appointments" className="text-xs underline text-muted-foreground hover:text-foreground">
                Ver todas
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Insights IA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{insights}</div>
          </CardContent>
        </Card>
      </section>

      <Separator />
      <footer className="text-xs text-muted-foreground">
        Usa los filtros para explorar periodos y dueños de ventas. Los datos se recalculan al aplicar cambios.
      </footer>
    </main>
  )
}

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-emerald-50 flex items-center justify-center">{icon}</div>
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">{title}</div>
            <div className="text-lg font-semibold truncate">{value}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
