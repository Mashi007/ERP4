export type CurrencyCode = "EUR" | "USD" | "MXN"

// Global, actualizado por el CurrencyProvider en cliente.
let currentCurrency: CurrencyCode = "EUR"

/** Actualiza la moneda global (llamado por el CurrencyProvider). */
export function setCurrency(code: CurrencyCode) {
  currentCurrency = code
}

/** Lee la moneda global actual. */
export function getCurrency(): CurrencyCode {
  return currentCurrency
}

/** Formateador genérico usando la moneda global. */
export function formatCurrency(
  amount: number,
  options?: Intl.NumberFormatOptions & { minimumFractionDigits?: number; maximumFractionDigits?: number },
): string {
  const safe = Number.isFinite(amount) ? amount : 0
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currentCurrency,
      maximumFractionDigits: 0,
      ...options,
    }).format(safe)
  } catch {
    const symbol = currentCurrency === "EUR" ? "€" : currentCurrency === "MXN" ? "MX$" : "$"
    return `${symbol} ${Math.round(safe).toLocaleString()}`
  }
}

/** Helper legacy: ahora delega al formateador dinámico. */
export function formatEUR(amount: number, options?: Intl.NumberFormatOptions) {
  return formatCurrency(amount, options)
}

/** Útil en Server Components para un formateo determinista. */
export function formatWithCurrency(
  amount: number,
  code: CurrencyCode,
  options?: Intl.NumberFormatOptions & { minimumFractionDigits?: number; maximumFractionDigits?: number },
): string {
  const safe = Number.isFinite(amount) ? amount : 0
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
      ...options,
    }).format(safe)
  } catch {
    const symbol = code === "EUR" ? "€" : code === "MXN" ? "MX$" : "$"
    return `${symbol} ${Math.round(safe).toLocaleString()}`
  }
}
