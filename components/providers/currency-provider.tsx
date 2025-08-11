"use client"

import * as React from "react"
import { setCurrency as bridgeSetCurrency } from "@/lib/currency"

export type CurrencyCode = "EUR" | "USD" | "MXN"

type CurrencyContextValue = {
  code: CurrencyCode
  setCode: (code: CurrencyCode) => void
  format: (value: number, opts?: Intl.NumberFormatOptions) => string
}

const CurrencyContext = React.createContext<CurrencyContextValue | null>(null)

// External setter bridge. Will be assigned by the provider on mount.
let setCodeExternal: ((code: CurrencyCode) => void) | null = null

/**
 * Cambia la moneda global desde cualquier parte del cliente.
 * Si el provider aún no montó, aplica el cambio al helper global para evitar parpadeos.
 */
export function setCode(code: CurrencyCode) {
  // Update global helper immediately
  try {
    bridgeSetCurrency(code)
  } catch {
    // ignore
  }
  // If provider is mounted, propagate to React state
  setCodeExternal?.(code)
}

export function useCurrency() {
  const ctx = React.useContext(CurrencyContext)
  if (!ctx) {
    // Fallback seguro pre-hidratación
    const fallbackCode: CurrencyCode = "EUR"
    const f = new Intl.NumberFormat(undefined, { style: "currency", currency: fallbackCode, maximumFractionDigits: 0 })
    return {
      code: fallbackCode,
      setCode: () => {},
      format: (n: number, options?: Intl.NumberFormatOptions) => {
        const safe = Number.isFinite(n) ? n : 0
        if (options) {
          try {
            return new Intl.NumberFormat(undefined, { style: "currency", currency: fallbackCode, ...options }).format(
              safe,
            )
          } catch {
            // ignore
          }
        }
        return f.format(safe)
      },
    } as CurrencyContextValue
  }
  return ctx
}

export function CurrencyProvider({
  children,
  initialCode = "EUR",
}: {
  children: React.ReactNode
  initialCode?: CurrencyCode
}) {
  const [code, setCodeState] = React.useState<CurrencyCode>(initialCode)

  // Asigna el puente externo al montar
  React.useEffect(() => {
    setCodeExternal = (next: CurrencyCode) => {
      setCodeState(next)
      bridgeSetCurrency(next)
    }
    return () => {
      setCodeExternal = null
    }
  }, [])

  // Lee la moneda actual de la organización al montar, sin cache.
  React.useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch("/api/settings/currency", { cache: "no-store" })
        if (!res.ok) return
        const data = (await res.json()) as { currency?: CurrencyCode }
        if (active && data?.currency) {
          setCodeState(data.currency)
          bridgeSetCurrency(data.currency)
        }
      } catch {
        // silenciar errores de red
      }
    })()
    return () => {
      active = false
    }
  }, [])

  // Mantén sincronizado el helper global usado por formatEUR/formatCurrency
  React.useEffect(() => {
    bridgeSetCurrency(code)
  }, [code])

  const setCodeCtx = React.useCallback((next: CurrencyCode) => {
    setCodeState(next)
    bridgeSetCurrency(next)
  }, [])

  const format = React.useCallback(
    (value: number, opts?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: code,
        maximumFractionDigits: 0,
        ...opts,
      }).format(Number.isFinite(value) ? value : 0),
    [code],
  )

  const value = React.useMemo<CurrencyContextValue>(
    () => ({ code, setCode: setCodeCtx, format }),
    [code, setCodeCtx, format],
  )

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}
