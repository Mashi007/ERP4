"use server"

import {
  sql as neonSql,
  mockDeals,
  mockContacts,
  mockActivities,
  mockAppointments,
  type Deal,
  type Contact,
  type Activity,
  type Appointment,
  getDataWithFallback,
} from "@/lib/database"

export type DateRange = { from?: string | null; to?: string | null }

export type DashboardData = {
  kpis: { revenueWon: number; revenueLost: number }
  funnelByStage: { stage: string; value: number }[]
  winLossPercentage: { wonPct: number; lostPct: number }
  contactsByOwner: { owner: string; total: number }[]
  tasksByOwner: { owner: string; open: number; completed: number }[]
  forecastByQuarterByStage: { quarter: number; stage: string; value: number }[]
  revenueBySource: { source: string; value: number }[]
  avgSalesCycleDays: number
  avgSalesCycleByOwner: { owner: string; days: number; count: number }[]
  stageConversion: { stage: string; conversionPct: number; sample: number }[]
  performanceByOwner: {
    owner: string
    wonValue: number
    openValue: number
    wonRate: number
    wonCount: number
    total: number
  }[]
  // Options for filters in the UI (always arrays)
  filters: {
    industries: string[]
    sources: string[]
  }
}

function parseDateSafe(s?: string | null): Date | null {
  if (!s) return null
  const d = new Date(s)
  return isNaN(d.getTime()) ? null : d
}

function inRange(d: Date | null, from?: string | null, to?: string | null) {
  if (!d) return true
  const f = from ? parseDateSafe(from) : null
  const t = to ? parseDateSafe(to) : null
  if (f) {
    const fromDay = new Date(Date.UTC(f.getUTCFullYear(), f.getUTCMonth(), f.getUTCDate()))
    if (d < fromDay) return false
  }
  if (t) {
    const toDay = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate(), 23, 59, 59))
    if (d > toDay) return false
  }
  return true
}

function isWon(stage?: string | null) {
  const s = (stage || "").toLowerCase()
  return s === "won" || s.includes("ganado")
}
function isLost(stage?: string | null) {
  const s = (stage || "").toLowerCase()
  return s === "lost" || s.includes("perdido")
}
function isOpen(stage?: string | null) {
  return !isWon(stage) && !isLost(stage)
}

const STAGE_ORDER = ["Nuevo", "Calificación", "Descubrimiento", "Demo", "Negociación", "Ganado", "Perdido"]

// In production, require DB. In preview/dev, allow fallback to mocks for smoother UX.
const STRICT_PROD = process.env.NODE_ENV === "production"

async function requireSql() {
  if (!neonSql || !process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL no está configurada o el cliente SQL no está disponible. El Dashboard requiere BD en producción.",
    )
  }
  return neonSql
}

export async function fetchDashboardData(range: DateRange = {}): Promise<DashboardData> {
  let deals: Deal[] = []
  let contacts: Contact[] = []
  let activities: Activity[] = []
  let appointments: Appointment[] = []

  if (STRICT_PROD) {
    const sql = await requireSql()
    const [dealsRows, contactsRows, activitiesRows, appointmentsRows] = await Promise.all([
      sql`select * from deals`,
      sql`select * from contacts`,
      sql`select * from activities`,
      sql`select * from appointments`,
    ])
    deals = (dealsRows as unknown as Deal[]) ?? []
    contacts = (contactsRows as unknown as Contact[]) ?? []
    activities = (activitiesRows as unknown as Activity[]) ?? []
    appointments = (appointmentsRows as unknown as Appointment[]) ?? []
  } else {
    deals = await getDataWithFallback<Deal>(async () => {
      if (!neonSql) throw new Error("DB not configured")
      const rows = await neonSql`select * from deals`
      return rows as unknown as Deal[]
    }, mockDeals)

    contacts = await getDataWithFallback<Contact>(async () => {
      if (!neonSql) throw new Error("DB not configured")
      const rows = await neonSql`select * from contacts`
      return rows as unknown as Contact[]
    }, mockContacts)

    activities = await getDataWithFallback<Activity>(async () => {
      if (!neonSql) throw new Error("DB not configured")
      const rows = await neonSql`select * from activities`
      return rows as unknown as Activity[]
    }, mockActivities)

    appointments = await getDataWithFallback<Appointment>(async () => {
      if (!neonSql) throw new Error("DB not configured")
      const rows = await neonSql`select * from appointments`
      return rows as unknown as Appointment[]
    }, mockAppointments)
  }

  const { from, to } = range

  // Distinct options for filters (always arrays)
  const industriesOpt = Array.from(
    new Set((deals ?? []).map((d) => d.industry).filter((v): v is string => Boolean(v))),
  ).sort()
  const sourcesOpt = Array.from(
    new Set((deals ?? []).map((d) => d.lead_source).filter((v): v is string => Boolean(v))),
  ).sort()

  let dealsInRange =
    deals?.filter((d) => inRange(parseDateSafe(d.expected_close_date || d.updated_at || d.created_at), from, to)) ?? []
  const contactsInRange = contacts?.filter((c) => inRange(parseDateSafe(c.created_at), from, to)) ?? []
  const activitiesInRange = activities?.filter((a) => inRange(parseDateSafe(a.activity_date), from, to)) ?? []
  const appointmentsInRange = appointments?.filter((a) => inRange(parseDateSafe(a.appointment_date), from, to)) ?? []
  void appointmentsInRange

  // In dev/preview, if the selected range doesn't intersect with mock data, fall back to full dataset so UI isn't empty.
  if (!STRICT_PROD && dealsInRange.length === 0) dealsInRange = deals ?? []

  // KPIs
  const revenueWon = dealsInRange.filter((d) => isWon(d.stage)).reduce((sum, d) => sum + (Number(d.value) || 0), 0) || 0
  const revenueLost =
    dealsInRange.filter((d) => isLost(d.stage)).reduce((sum, d) => sum + (Number(d.value) || 0), 0) || 0

  // Funnel: value of open opportunities by stage
  const funnelMap = new Map<string, number>()
  for (const d of dealsInRange) {
    if (!isOpen(d.stage)) continue
    const key = d.stage || "Desconocido"
    funnelMap.set(key, (funnelMap.get(key) || 0) + (Number(d.value) || 0))
  }
  const funnelByStage = Array.from(funnelMap, ([stage, value]) => ({ stage, value })).sort((a, b) => b.value - a.value)

  // Win/Loss %
  const wonCount = dealsInRange.filter((d) => isWon(d.stage)).length
  const lostCount = dealsInRange.filter((d) => isLost(d.stage)).length
  const totalWL = wonCount + lostCount
  const winLossPercentage = {
    wonPct: totalWL ? (wonCount / totalWL) * 100 : 0,
    lostPct: totalWL ? (lostCount / totalWL) * 100 : 0,
  }

  // Contacts by owner
  const cByOwner = new Map<string, number>()
  for (const c of contactsInRange) {
    const owner = c.sales_owner || "—"
    cByOwner.set(owner, (cByOwner.get(owner) || 0) + 1)
  }
  const contactsByOwner = Array.from(cByOwner, ([owner, total]) => ({ owner, total }))

  // Tasks by owner
  const tByOwner = new Map<string, { open: number; completed: number }>()
  for (const a of activitiesInRange) {
    const owner = a.sales_owner || "—"
    const bucket = tByOwner.get(owner) || { open: 0, completed: 0 }
    const completed = (a.status || "").toLowerCase().startsWith("complet")
    if (completed) bucket.completed += 1
    else bucket.open += 1
    tByOwner.set(owner, bucket)
  }
  const tasksByOwner = Array.from(tByOwner, ([owner, v]) => ({ owner, ...v }))

  // Forecast by quarter & stage
  const forecast: { quarter: number; stage: string; value: number }[] = []
  for (const d of dealsInRange) {
    const dt = parseDateSafe(d.expected_close_date || d.updated_at || d.created_at)
    if (!dt) continue
    const quarter = Math.floor(dt.getUTCMonth() / 3) + 1
    forecast.push({ quarter, stage: d.stage || "Nuevo", value: Number(d.value) || 0 })
  }

  // Revenue by source (won)
  const rBySource = new Map<string, number>()
  for (const d of dealsInRange) {
    if (!isWon(d.stage)) continue
    const src = d.lead_source || "Otro"
    rBySource.set(src, (rBySource.get(src) || 0) + (Number(d.value) || 0))
  }
  const revenueBySource = Array.from(rBySource, ([source, value]) => ({ source, value }))

  // Average sales cycle (won)
  const ONE_DAY = 1000 * 60 * 60 * 24
  const cycles: number[] = []
  const ownerCycles = new Map<string, number[]>()
  for (const d of dealsInRange) {
    if (!isWon(d.stage)) continue
    const created = parseDateSafe(d.created_at)
    const closed = parseDateSafe(d.expected_close_date) || parseDateSafe(d.updated_at)
    if (!created || !closed) continue
    const ms = closed.getTime() - created.getTime()
    const days = ms / ONE_DAY
    if (!isFinite(days) || days <= 0) continue
    cycles.push(days)
    const owner = d.sales_owner || "—"
    const arr = ownerCycles.get(owner) || []
    arr.push(days)
    ownerCycles.set(owner, arr)
  }
  const avgSalesCycleDays =
    cycles.length > 0 ? Number((cycles.reduce((a, b) => a + b, 0) / cycles.length).toFixed(1)) : 0
  const avgSalesCycleByOwner =
    Array.from(ownerCycles, ([owner, arr]) => {
      const avg = arr.reduce((a, b) => a + b, 0) / arr.length
      return { owner, days: Number(avg.toFixed(1)), count: arr.length }
    }).sort((a, b) => a.days - b.days) ?? []

  // Stage conversion (estimated)
  const byStage = new Map<string, { count: number; sumProb: number }>()
  for (const d of dealsInRange) {
    const stage = d.stage || "Desconocido"
    const row = byStage.get(stage) || { count: 0, sumProb: 0 }
    const prob = typeof d.probability === "number" ? d.probability : 0
    row.count += 1
    row.sumProb += prob
    byStage.set(stage, row)
  }
  const stageConversion =
    STAGE_ORDER.filter((s) => byStage.has(s)).map((stage) => {
      const row = byStage.get(stage)!
      let pct = row.count ? row.sumProb / row.count : 0
      if (stage.toLowerCase().includes("ganado") || stage.toLowerCase() === "won") pct = 100
      if (stage.toLowerCase().includes("perdido") || stage.toLowerCase() === "lost") pct = 0
      return { stage, conversionPct: Number(pct.toFixed(1)), sample: row.count }
    }) ?? []

  // Performance by owner
  const perfMap = new Map<string, { wonValue: number; openValue: number; wonCount: number; total: number }>()
  for (const d of dealsInRange) {
    const owner = d.sales_owner || "—"
    const row = perfMap.get(owner) || { wonValue: 0, openValue: 0, wonCount: 0, total: 0 }
    row.total += 1
    if (isWon(d.stage)) {
      row.wonValue += Number(d.value) || 0
      row.wonCount += 1
    } else if (isOpen(d.stage)) {
      row.openValue += Number(d.value) || 0
    }
    perfMap.set(owner, row)
  }
  const performanceByOwner =
    Array.from(perfMap, ([owner, v]) => {
      const wonRate = v.total ? (v.wonCount / v.total) * 100 : 0
      return {
        owner,
        wonValue: v.wonValue,
        openValue: v.openValue,
        wonRate: Number(wonRate.toFixed(1)),
        wonCount: v.wonCount,
        total: v.total,
      }
    }).sort((a, b) => b.wonValue - a.wonValue) ?? []

  return {
    kpis: { revenueWon, revenueLost },
    funnelByStage,
    winLossPercentage,
    contactsByOwner,
    tasksByOwner,
    forecastByQuarterByStage: forecast,
    revenueBySource,
    avgSalesCycleDays,
    avgSalesCycleByOwner,
    stageConversion,
    performanceByOwner,
    filters: {
      industries: industriesOpt,
      sources: sourcesOpt,
    },
  }
}

// Keep backward compatibility with older imports
export { fetchDashboardData as getDashboardData }
