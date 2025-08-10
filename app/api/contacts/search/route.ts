import { NextResponse } from "next/server"
import { sql, mockContacts } from "@/lib/database"
import type { Contact } from "@/lib/database"

function lastNameFrom(fullName: string) {
  const parts = (fullName || "").split(/\s+/).filter(Boolean)
  return parts.length ? parts[parts.length - 1] : ""
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const qRaw = searchParams.get("q") || ""
  const by = (searchParams.get("by") || "last").toLowerCase() // "last" (default) or "any"
  const q = qRaw.trim().toLowerCase()

  if (!q || q.length < 1) {
    return NextResponse.json({ results: [] })
  }

  // If DB connected, run a server-side query
  if (sql && process.env.DATABASE_URL) {
    try {
      if (by === "any") {
        const rows = (await sql`
          SELECT id, name, email, phone, company, job_title, status, tags, sales_owner, avatar_url, created_at, updated_at
          FROM contacts
          WHERE name ILIKE ${"%" + q + "%"}
             OR email ILIKE ${"%" + q + "%"}
             OR company ILIKE ${"%" + q + "%"}
          ORDER BY name
          LIMIT 50
        `) as any[]

        return NextResponse.json({ results: rows as Contact[] })
      } else {
        // by === "last": search by name, then filter by last name on server
        const rows = (await sql`
          SELECT id, name, email, phone, company, job_title, status, tags, sales_owner, avatar_url, created_at, updated_at
          FROM contacts
          WHERE name ILIKE ${"%" + q + "%"}
          ORDER BY name
          LIMIT 100
        `) as any[]

        const filtered = rows
          .filter((r) =>
            lastNameFrom(r.name || "")
              .toLowerCase()
              .includes(q),
          )
          .slice(0, 20) as Contact[]

        return NextResponse.json({ results: filtered })
      }
    } catch (e) {
      console.error("Contacts search failed, falling back to mock:", e)
      // fall through to mock
    }
  }

  // Fallback to mock data
  let results: Contact[] = []
  if (by === "any") {
    results = mockContacts
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.email || "").toLowerCase().includes(q) ||
          (c.company || "").toLowerCase().includes(q),
      )
      .slice(0, 50)
  } else {
    // by === 'last'
    results = mockContacts.filter((c) => lastNameFrom(c.name).toLowerCase().includes(q)).slice(0, 20)
  }

  return NextResponse.json({ results })
}
