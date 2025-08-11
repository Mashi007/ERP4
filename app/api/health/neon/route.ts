import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  const url = process.env.DATABASE_URL
  if (!url) {
    return NextResponse.json(
      {
        ok: false,
        error: "DATABASE_URL is not set",
        details: null,
      },
      { status: 200 },
    )
  }

  const sql = neon(url)
  try {
    // Probar conexión
    await sql /*sql*/`select 1;`

    // Intentar contar filas por tabla (si no existen, atrapamos error)
    async function safeCount(table: string) {
      try {
        const rows = await sql /*sql*/`select count(*)::int as c from ${sql(table)};`
        const c = (rows as any)?.[0]?.c ?? 0
        return c
      } catch {
        return null
      }
    }

    const [deals, contacts, activities, appointments] = await Promise.all([
      safeCount("deals"),
      safeCount("contacts"),
      safeCount("activities"),
      safeCount("appointments"),
    ])

    return NextResponse.json(
      {
        ok: true,
        error: null,
        details: { deals, contacts, activities, appointments },
      },
      { status: 200 },
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: String(error?.message || error),
        details: null,
      },
      { status: 200 },
    )
  }
}
