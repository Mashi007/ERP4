"use client"

export type PipelineDeal = {
  id: number
  title: string
  company: string
  value: number
  stage: string
  probability: number
  expected_close_date: string | null
  notes?: string | null
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  contact_id?: number
  lead_source?: string
  industry?: string
  company_size?: string
  budget_range?: string
  decision_timeline?: string
  pain_points?: string
  competitors?: string
  next_steps?: string
}

const STORAGE_KEY = "crm:pipeline:deals"

export function loadDealsFromStorage(): PipelineDeal[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (Array.isArray(parsed)) {
      return parsed as PipelineDeal[]
    }
    return []
  } catch {
    return []
  }
}

export function saveDealsToStorage(list: PipelineDeal[]) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // ignore
  }
}

export function upsertDealToStorage(deal: PipelineDeal) {
  const list = loadDealsFromStorage()
  const idx = list.findIndex((d) => d.id === deal.id)
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...deal }
  } else {
    list.unshift(deal)
  }
  saveDealsToStorage(list)
  return list
}

export function mergeUniqueById(a: PipelineDeal[], b: PipelineDeal[]) {
  const map = new Map<number, PipelineDeal>()
  for (const d of [...a, ...b]) {
    map.set(d.id, { ...(map.get(d.id) || {}), ...d })
  }
  return Array.from(map.values()).sort((x, y) => y.id - x.id)
}

export function publishNewOpportunity(deal: PipelineDeal) {
  if (typeof window === "undefined") return
  const evt = new CustomEvent("pipeline:new-opportunity", { detail: { deal } })
  window.dispatchEvent(evt)
}
