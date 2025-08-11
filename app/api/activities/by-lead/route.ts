import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

type Activity = {
  id: number
  type: string | null
  title: string | null
  contact_id: number | null
  deal_id: number | null
  company: string | null
  activity_date: string | null
  activity_time: string | null
  duration: number | null
  status: string | null
  notes: string | null
  sales_owner: string | null
  created_at: string | null
  updated_at: string | null
}

// Histórico SOLO por oportunidad: requiere dealId y filtra por deal_id.
// Además, usamos DISTINCT ON(id) para evitar duplicados si existen filas repetidas.
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const dealIdRaw = searchParams.get("dealId")
    const dealId = dealIdRaw != null ? Number(dealIdRaw) : Number.NaN

    if (!dealIdRaw || Number.isNaN(dealId)) {
      return NextResponse.json(
        { success: false, error: "Se requiere un dealId válido (histórico solo por oportunidad)." },
        { status: 400 },
      )
    }

    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      // Sin DB: devolver vacío para no romper UI
      return NextResponse.json({ success: true, activities: [] as Activity[] }, { status: 200 })
    }

    const sql = neon(dbUrl)

    // DISTINCT ON asegura no devolver duplicados por id si la tabla tiene entradas repetidas accidentalmente.
    const query = `
      SELECT DISTINCT ON (id)
        id, type, title, contact_id, deal_id, company,
        activity_date, activity_time, duration, status, notes, sales_owner,
        created_at, updated_at
      FROM activities
      WHERE deal_id = $1
      ORDER BY id, COALESCE(updated_at, created_at, activity_date) DESC
      LIMIT 200
    `
    // Usar sql.query(text, params) para placeholders.
    const result = await sql.query<Activity>(query, [dealId])
    const activities: Activity[] = (result as any).rows ?? (Array.isArray(result) ? (result as any) : [])

    return NextResponse.json({ success: true, activities }, { status: 200 })
  } catch (err) {
    console.error("/api/activities/by-lead GET error", err)
    // Fallback: vacío para mantener UI funcionando
    return NextResponse.json({ success: true, activities: [] as Activity[] }, { status: 200 })
  }
}
