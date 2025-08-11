import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// Update activity
export async function PUT(req: Request) {
  try {
    const raw = await req.json()
    const id = raw?.id != null ? Number(raw.id) : NaN
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ success: false, error: "ID inválido" }, { status: 400 })
    }

    // Allowed updatable fields
    const fields: Record<string, any> = {
      type: raw?.type,
      title: raw?.title,
      contact_id: raw?.contactId ?? raw?.contact_id,
      deal_id: raw?.dealId ?? raw?.deal_id,
      company: raw?.company,
      activity_date: raw?.activityDate ?? raw?.activity_date,
      activity_time: raw?.activityTime ?? raw?.activity_time,
      duration: raw?.duration,
      status: raw?.status,
      notes: raw?.notes,
      sales_owner: raw?.salesOwner ?? raw?.sales_owner,
    }

    const sets: string[] = []
    const params: any[] = []
    let i = 1
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) {
        sets.push(`${k} = $${i++}`)
        // Cast numbers where needed
        if ((k === "contact_id" || k === "deal_id" || k === "duration") && v != null) {
          params.push(Number(v))
        } else {
          params.push(v)
        }
      }
    }

    if (sets.length === 0) {
      return NextResponse.json(
        { success: false, error: "Nada para actualizar" },
        { status: 400 },
      )
    }

    // updated_at always
    sets.push(`updated_at = now()`)

    const updateText = `
      update activities
      set ${sets.join(", ")}
      where id = $${i}
      returning id, type, title, contact_id, deal_id, company, activity_date, activity_time, duration, status, notes, sales_owner, created_at, updated_at
    `
    params.push(id)

    const rows = await sql.query(updateText, params)
    const activity = Array.isArray(rows) ? rows[0] : (rows as any)?.[0]
    if (!activity) {
      return NextResponse.json(
        { success: false, error: "Actividad no encontrada" },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, activity })
  } catch (err) {
    console.error("activities PUT error", err)
    return NextResponse.json(
      { success: false, error: "No se pudo actualizar la actividad" },
      { status: 500 },
    )
  }
}

// Delete activity
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const idRaw = searchParams.get("id")
    const id = idRaw != null ? Number(idRaw) : NaN
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ success: false, error: "ID inválido" }, { status: 400 })
    }

    const delText = `delete from activities where id = $1 returning id`
    const rows = await sql.query(delText, [id])
    const deleted = Array.isArray(rows) ? rows[0] : (rows as any)?.[0]
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Actividad no encontrada" },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, id: deleted.id })
  } catch (err) {
    console.error("activities DELETE error", err)
    return NextResponse.json(
      { success: false, error: "No se pudo eliminar la actividad" },
      { status: 500 },
    )
  }
}
