import { NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET() {
  try {
    if (!sql) {
      return NextResponse.json(
        { ok: false, message: "Sin conexión: DATABASE_URL no configurada o cliente no inicializado." },
        { status: 200 },
      )
    }
    // Simple sanity check
    const rows = await sql`SELECT 1 as ok`
    const okValue = Array.isArray(rows) ? (rows[0] as any)?.ok : (rows as any)?.[0]?.ok
    const ok = okValue === 1 || okValue === "1"
    return NextResponse.json({
      ok,
      message: ok ? "Conexión a Neon exitosa." : "Consulta realizada, pero respuesta inesperada.",
    })
  } catch (error: any) {
    return NextResponse.json({ ok: false, message: `Error: ${error?.message ?? "desconocido"}` }, { status: 200 })
  }
}
