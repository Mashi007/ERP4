// Utilidades de fecha en español, usadas en tarjetas y listados

export function formatDateEs(
  dateLike: Date | string | number | null | undefined,
  opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
): string {
  if (!dateLike) return ""
  const d = toDate(dateLike)
  if (!d) return ""
  return new Intl.DateTimeFormat("es", opts).format(d)
}

export function formatDateTimeEs(
  dateLike: Date | string | number | null | undefined,
  opts: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  },
): string {
  if (!dateLike) return ""
  const d = toDate(dateLike)
  if (!d) return ""
  return new Intl.DateTimeFormat("es", opts).format(d)
}

export function toDate(input: Date | string | number | null | undefined): Date | null {
  if (!input) return null
  const d = input instanceof Date ? input : new Date(input)
  return isNaN(d.getTime()) ? null : d
}
