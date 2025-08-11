"use server"

import { sql as neonSql, mockContacts, getDataWithFallback, type Contact } from "@/lib/database"

// Devuelve un cliente/contacto por id (usa BD si está disponible; si no, mocks)
export async function getClient(id: string): Promise<Contact | null> {
  if (!id) return null
  try {
    // Intentar BD en primer lugar
    if (neonSql) {
      const rows = await neonSql`select * from contacts where id = ${id} limit 1`
      const row = Array.isArray(rows) ? (rows as any[])[0] : (rows as any)?.[0]
      return (row as unknown as Contact) ?? null
    }
  } catch {
    // fallthrough a mocks
  }
  // Fallback a mocks si no hay BD o falla
  const mocks = await getDataWithFallback<Contact>(async () => {
    if (!neonSql) throw new Error("DB not configured")
    const rows = await neonSql`select * from contacts limit 100`
    return rows as unknown as Contact[]
  }, mockContacts)
  return mocks.find((c) => String(c.id) === String(id)) ?? null
}
