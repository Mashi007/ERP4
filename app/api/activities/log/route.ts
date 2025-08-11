import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: Request) {
  try {
    const raw = await req.json()

    // Normalize input (accept snake_case and camelCase)
    const type = raw?.type
    const title = raw?.title
    const contactId = raw?.contactId ?? raw?.contact_id ?? null
    const dealId = raw?.dealId ?? raw?.deal_id ?? null
    const company = raw?.company ?? null
    const activityDate = raw?.activityDate ?? raw?.activity_date ?? null // ISO string or null
    const activityTime = raw?.activityTime ?? raw?.activity_time ?? null
    const duration = raw?.duration ?? null
    const status = raw?.status ?? null
    const notes = raw?.notes ?? null
    const salesOwner = raw?.salesOwner ?? raw?.sales_owner ?? null

    if (!type || !title) {
      return NextResponse.json(
        { success: false, error: "Campos requeridos: type y title" },
        { status: 400 },
      )
    }

    // Ensure table exists (idempotent)
    await sql.query(`
      create table if not exists activities (
        id serial primary key,
        type text not null,
        title text not null,
        contact_id int,
        deal_id int,
        company text,
        activity_date timestamptz default now(),
        activity_time text,
        duration int,
        status text,
        notes text,
        sales_owner text,
        created_at timestamptz default now(),
        updated_at timestamptz default now()
      );
    `)

    const insertText = `
      insert into activities
        (type, title, contact_id, deal_id, company, activity_date, activity_time, duration, status, notes, sales_owner)
      values
        ($1,   $2,    $3,         $4,     $5,      coalesce($6::timestamptz, now()), $7, $8, $9, $10, $11)
      returning id, type, title, contact_id, deal_id, company, activity_date, activity_time, duration, status, notes, sales_owner, created_at, updated_at
    `
    const params = [
      String(type),
      String(title),
      contactId == null ? null : Number(contactId),
      dealId == null ? null : Number(dealId),
      company,
      activityDate,
      activityTime,
      duration == null ? null : Number(duration),
      status,
      notes,
      salesOwner,
    ]

    const rows = await sql.query(insertText, params)
    const activity = Array.isArray(rows) ? rows[0] : (rows as any)?.[0]

    if (!activity) {
      return NextResponse.json(
        { success: false, error: "No se pudo registrar la actividad" },
        { status: 500 },
      )
    }

    // Return the activity. Client UIs should emit BroadcastChannel('crm-activities') with type "activity:created"
    // right after receiving this response to refresh in tiempo real.
    return NextResponse.json({ success: true, activity }, { status: 201 })
  } catch (err) {
    console.error("activities/log POST error", err)
    return NextResponse.json(
      { success: false, error: "No se pudo registrar la actividad" },
      { status: 500 },
    )
  }
}
