"use server"

export type Client = {
  id: string
  nombre: string
  empresa?: string | null
  email?: string | null
  telefono?: string | null
}

/**
 * Obtiene un cliente por id. Implementación tolerante:
 * - Intenta buscar usando el endpoint de búsqueda de contactos si existe.
 * - Si no hay coincidencias, devuelve un placeholder mínimamente válido para evitar romper la UI.
 */
export async function getClient(id: string): Promise<Client> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/contacts/search?query=${encodeURIComponent(id)}`,
      {
        // Cuando NEXT_PUBLIC_BASE_URL no esté configurada, fetch relativo será manejado por Next.
        cache: "no-store",
      },
    ).catch(() => fetch(`/api/contacts/search?query=${encodeURIComponent(id)}`, { cache: "no-store" }))
    if (res?.ok) {
      const data = (await res.json()) as Array<any>
      const found = Array.isArray(data) ? (data.find((c) => String(c.id) === String(id)) ?? data[0]) : null
      if (found) {
        return {
          id: String(found.id ?? id),
          nombre: String(found.name ?? found.nombre ?? "Cliente"),
          empresa: found.company ?? found.empresa ?? null,
          email: found.email ?? null,
          telefono: found.phone ?? found.telefono ?? null,
        }
      }
    }
  } catch {
    // ignore network errors and fall through
  }
  // Fallback mínimo
  return {
    id: String(id),
    nombre: "Cliente",
    empresa: null,
    email: null,
    telefono: null,
  }
}
