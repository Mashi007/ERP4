"use server"

export type DashboardFilters = {
  start?: string
  end?: string
  owner?: string
}

type Deal = {
  id: string
  title: string
  stage: string
  owner: string
  amount: number
  status: "open" | "won" | "lost"
  created_at: string
}

type Appointment = {
  id: string
  title: string
  appointment_date: string
  appointment_time?: string
  company?: string
}

function parseDate(d?: string) {
  const date = d ? new Date(d) : undefined
  return date && !isNaN(date.getTime()) ? date : undefined
}

function within(date: Date, start?: Date, end?: Date) {
  if (start && date < start) return false
  if (end && date > end) return false
  return true
}

// Mock data generator (replace by real DB queries when ready)
function mockData(filters: DashboardFilters) {
  const owners = ["Ana", "Luis", "María", "Carlos"]
  const deals: Deal[] = Array.from({ length: 24 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - Math.floor(Math.random() * 90))
    const stages = ["Nuevo", "Calificación", "Propuesta", "Negociación", "Ganado", "Perdido"]
    const stage = stages[Math.floor(Math.random() * stages.length)]
    const status = stage === "Ganado" ? "won" : stage === "Perdido" ? "lost" : "open"
    return {
      id: `D${i + 1}`,
      title: `Oportunidad ${i + 1}`,
      stage,
      owner: owners[i % owners.length],
      amount: Math.floor(Math.random() * 8000) + 1000,
      status,
      created_at: d.toISOString(),
    }
  })

  const appointments: Appointment[] = Array.from({ length: 8 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + Math.floor(Math.random() * 20))
    return {
      id: `A${i + 1}`,
      title: `Cita ${i + 1}`,
      appointment_date: d.toISOString(),
      appointment_time: `${String(9 + (i % 8)).padStart(2, "0")}:00`,
      company: ["ACME", "Globex", "Innova"][i % 3],
    }
  })

  const start = parseDate(filters.start)
  const end = parseDate(filters.end)
  const owner = filters.owner

  const dealsFiltered = deals.filter((d) => within(new Date(d.created_at), start, end) && (!owner || d.owner === owner))

  const totals = {
    totalContacts: 120 + (owner ? 0 : 35),
    totalDeals: dealsFiltered.length,
    activitiesCount: 75,
    appointmentsCount: appointments.length,
    totalRevenue: dealsFiltered.reduce((sum, d) => sum + (d.status === "won" ? d.amount : 0), 0),
    campaignsCount: 4,
    conversationsCount: 12,
  }

  const dealsByStageMap = new Map<string, { count: number; value: number }>()
  dealsFiltered.forEach((d) => {
    const prev = dealsByStageMap.get(d.stage) || { count: 0, value: 0 }
    dealsByStageMap.set(d.stage, { count: prev.count + 1, value: prev.value + d.amount })
  })
  const dealsByStage = Array.from(dealsByStageMap, ([stage, v]) => ({ stage, ...v }))

  const activitiesByType = [
    { type: "Llamada", count: 12 },
    { type: "Email", count: 22 },
    { type: "Reunión", count: 8 },
    { type: "Nota", count: 6 },
  ]

  const byMonth = new Map<string, number>()
  dealsFiltered.forEach((d) => {
    const k = d.created_at.slice(0, 7)
    byMonth.set(k, (byMonth.get(k) || 0) + (d.status === "won" ? d.amount : 0))
  })
  const months = Array.from(byMonth, ([month, revenue]) => ({ month, revenue })).sort((a, b) =>
    a.month.localeCompare(b.month),
  )

  const funnelStages = ["Nuevo", "Calificación", "Propuesta", "Negociación", "Ganado"]
  const counts = funnelStages.map((s) => dealsFiltered.filter((d) => d.stage === s).length)
  const stageConversion = funnelStages.map((s, idx) => {
    const count = counts[idx]
    const prev = idx === 0 ? Math.max(1, counts[0]) : counts[idx - 1] || 1
    const rate = prev ? (100 * count) / prev : 0
    return { stage: s, rate, count }
  })

  const won = dealsFiltered.filter((d) => d.status === "won").length
  const lost = dealsFiltered.filter((d) => d.status === "lost").length
  const totalClosed = Math.max(1, won + lost)
  const winLoss = {
    wonPct: (100 * won) / totalClosed,
    lostPct: (100 * lost) / totalClosed,
  }

  const marketing = {
    avgOpenRate: 32.4,
    avgClickRate: 4.7,
    topCampaigns: [
      { id: "C1", name: "Lanzamiento Q3", status: "running", open_rate: 35.2, click_rate: 5.3 },
      { id: "C2", name: "Webinar", status: "completed", open_rate: 29.1, click_rate: 3.2 },
    ],
  }

  const recentConversations = [
    {
      id: "M1",
      subject: "Revisión de propuesta",
      last_message_at: new Date().toISOString(),
      contact_name: "Ana Torres",
      contact_company: "ACME",
    },
    { id: "M2", subject: "Seguimiento reunión", last_message_at: new Date().toISOString(), contact_company: "Globex" },
  ]

  return {
    owners,
    totals,
    dealsByStage,
    activitiesByType,
    revenueByMonth: months,
    stageConversion,
    upcomingAppointments: appointments,
    marketing,
    recentConversations,
    winLoss,
  }
}

export async function getSalesOwners(): Promise<string[]> {
  // Replace with SQL: SELECT DISTINCT owner FROM deals ORDER BY owner
  return mockData({}).owners
}

export async function getDashboardFullData(filters: DashboardFilters) {
  // Replace this with real DB queries applying filters
  return mockData(filters)
}

export async function generateDashboardReport(filters?: DashboardFilters) {
  const data = mockData(filters || {})
  const lines = [
    `Oportunidades: ${data.totals.totalDeals}`,
    `Ingresos filtrados: $${Intl.NumberFormat().format(data.totals.totalRevenue)}`,
    `Citas próximas: ${data.upcomingAppointments.length}`,
  ]
  return { insights: lines.join("\n") }
}
