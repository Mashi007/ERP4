export function parseISODateOnly(iso: string): Date {
  // Parses YYYY-MM-DD without timezone shifting; otherwise falls back to Date()
  if (typeof iso === "string" && /^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const [y, m, d] = iso.split("-").map((n) => Number.parseInt(n, 10))
    const dt = new Date()
    dt.setFullYear(y, m - 1, d)
    dt.setHours(0, 0, 0, 0)
    return dt
  }
  return new Date(iso)
}

/**
 * Devuelve solo día, mes y año en español.
 * Ejemplo: "27 de agosto de 2025"
 */
export function formatDateEs(input?: string | Date | null): string {
  if (!input) return "Sin fecha"
  const date = typeof input === "string" ? parseISODateOnly(input) : input
  if (Number.isNaN(date.getTime())) return "Sin fecha"
  return new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date)
}

/**
 * Devuelve día/mes/año HH:mm en español.
 * Ejemplo: "27/08/2025 14:05"
 */
export function formatDateTimeEs(input: string | number | Date) {
  const d = input instanceof Date ? input : new Date(input)
  if (Number.isNaN(d.getTime())) return "Sin fecha"
  const day = d.toLocaleDateString("es-ES", { day: "2-digit" })
  const month = d.toLocaleDateString("es-ES", { month: "2-digit" })
  const year = d.toLocaleDateString("es-ES", { year: "numeric" })
  const time = d.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
  return `${day}/${month}/${year} ${time}`
}
