import { neon } from "@neondatabase/serverless"

export type Client = {
  id: string
  name: string
  email: string | null
  company?: string | null
  title?: string | null
  phone?: string | null
  avatarUrl?: string | null
  score?: number | null
  status?: string | null
}

const DATABASE_URL = process.env.DATABASE_URL
const sql = DATABASE_URL ? neon(DATABASE_URL) : null

const MOCK_CLIENTS: Client[] = [
  {
    id: "1",
    name: "Laura Norda (sample)",
    email: "lauranorda@example.com",
    company: "Acme Inc",
    title: "CFO",
    phone: "+16473456789",
    avatarUrl: "/placeholder-user.jpg",
    score: 29,
    status: "Activo",
  },
  {
    id: "2",
    name: "Nick Raymond (sample)",
    email: "nickraymond@example.com",
    company: "E Corp",
    title: "Sales Director",
    phone: "+19266814415",
    avatarUrl: "/placeholder-user.jpg",
    score: 31,
    status: "Activo",
  },
]

function normalizeRow(row: any): Client {
  const nameFromParts = [row?.first_name, row?.last_name].filter(Boolean).join(" ").trim()
  const name =
    row?.name ??
    row?.full_name ??
    (nameFromParts.length ? nameFromParts : undefined) ??
    row?.email?.split("@")?.[0] ??
    `Cliente ${row?.id ?? ""}`

  const company = row?.company_name ?? row?.company ?? row?.account ?? row?.account_name ?? null
  const title = row?.job_title ?? row?.title ?? row?.position ?? null
  const phone = row?.phone ?? row?.mobile ?? row?.phone_number ?? null
  const avatarUrl = row?.avatar_url ?? row?.photo_url ?? null
  const score = typeof row?.score === "number" ? row.score : typeof row?.fit_score === "number" ? row.fit_score : null
  const status = row?.status ?? row?.lead_status ?? row?.state ?? null

  return {
    id: String(row?.id ?? crypto.randomUUID()),
    name,
    email: row?.email ?? null,
    company,
    title,
    phone,
    avatarUrl,
    score,
    status,
  }
}

export async function listClients(limit = 50): Promise<Client[]> {
  if (!sql) return MOCK_CLIENTS.slice(0, limit)

  try {
    const rows = (await sql`
      SELECT * FROM contacts
      LIMIT ${limit}
    `) as any[]
    return rows.map(normalizeRow)
  } catch (e) {
    console.error("listClients fallback due to DB error:", e)
    return MOCK_CLIENTS.slice(0, limit)
  }
}

export async function getClient(id: string): Promise<Client | null> {
  if (!sql) return MOCK_CLIENTS.find((c) => c.id === id) ?? null

  try {
    const rows = (await sql`
      SELECT * FROM contacts
      WHERE id = ${id}
      LIMIT 1
    `) as any[]
    const row = rows?.[0]
    return row ? normalizeRow(row) : null
  } catch (e) {
    console.error("getClient fallback due to DB error:", e)
    return MOCK_CLIENTS.find((c) => c.id === id) ?? null
  }
}

// Alias compatible con llamadas existentes
export async function getClientById(id: string) {
  return getClient(id)
}
