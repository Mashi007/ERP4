import { NextResponse } from "next/server"
import { getOrgCurrency, setOrgCurrency, type CurrencyCode } from "@/lib/org-settings"

export async function GET() {
  try {
    const currency = await getOrgCurrency("default")
    return NextResponse.json({ currency })
  } catch (e) {
    console.error("GET /api/settings/currency error", e)
    return NextResponse.json({ currency: "EUR" as CurrencyCode })
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { currency?: CurrencyCode }
    const next = body.currency
    if (!next || !["EUR", "USD", "MXN"].includes(next)) {
      return NextResponse.json({ ok: false, error: "Moneda inválida" }, { status: 400 })
    }
    await setOrgCurrency("default", next)
    return NextResponse.json({ ok: true, currency: next })
  } catch (e) {
    console.error("POST /api/settings/currency error", e)
    return NextResponse.json({ ok: false, error: "Error al guardar la moneda" }, { status: 500 })
  }
}
