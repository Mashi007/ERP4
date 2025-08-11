import { NextResponse } from "next/server"
import { getDashboardDateRange, setDashboardDateRange } from "@/lib/dashboard-settings"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const orgId = searchParams.get("orgId") || "default"
  const value = await getDashboardDateRange(orgId)
  return NextResponse.json(value)
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}) as any)
  const orgId = body.orgId || "default"
  const from = typeof body.from === "string" ? body.from : null
  const to = typeof body.to === "string" ? body.to : null
  const res = await setDashboardDateRange({ from, to }, orgId)
  if (!res.ok) {
    return NextResponse.json({ ok: false, error: res.error }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
