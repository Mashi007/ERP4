"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { CurrencyCode } from "@/lib/currency"
import { formatWithCurrency, setCurrency as setGlobalCurrency, getCurrency as getGlobalCurrency } from "@/lib/currency"

type CurrencyContextValue = {
  code: CurrencyCode
  setCode: (code: CurrencyCode) => void
  // Formats numbers using current currency, default without decimals to match existing UI
  format: (
    amount: number,
    options?: Intl.NumberFormatOptions & { minimumFractionDigits?: number; maximumFractionDigits?: number },
  ) => string
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

// Expose an imperative setter so legacy code can import { setCode } from this module
let setCodeRef: ((code: CurrencyCode) => void) | null = null

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // Initialize from global helper or localStorage for UX continuity
  const initial =
    (typeof window !== "undefined" && (window.localStorage.getItem("currency:code") as CurrencyCode | null)) ||
    getGlobalCurrency?.() ||
    ("EUR" as CurrencyCode)

  const [code, internalSetCode] = useState<CurrencyCode>(initial)

  // Keep lib/currency in sync so legacy helpers continue to work
  useEffect(() => {
    try {
      setGlobalCurrency(code)
      if (typeof window !== "undefined") {
        window.localStorage.setItem("currency:code", code)
      }
    } catch {
      // no-op
    }
  }, [code])

  // Register imperative setter
  useEffect(() => {
    setCodeRef = (c: CurrencyCode) => internalSetCode(c)
    return () => {
      setCodeRef = null
    }
  }, [])

  const setCode = useCallback((c: CurrencyCode) => internalSetCode(c), [])

  const format = useCallback(
    (
      amount: number,
      options?: Intl.NumberFormatOptions & { minimumFractionDigits?: number; maximumFractionDigits?: number },
    ) => formatWithCurrency(Number.isFinite(amount) ? amount : 0, code, options),
    [code],
  )

  const value = useMemo<CurrencyContextValue>(() => ({ code, setCode, format }), [code, setCode, format])

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

// Named export for legacy/imperative updates from other modules
export function setCode(code: CurrencyCode) {
  if (setCodeRef) {
    setCodeRef(code)
  } else {
    // Fallback: persist and sync global helper so it takes effect on mount
    try {
      if (typeof window !== "undefined") window.localStorage.setItem("currency:code", code)
      setGlobalCurrency(code)
    } catch {
      // no-op
    }
  }
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext)
  // Provide a safe fallback to avoid runtime errors if provider is missing
  if (!ctx) {
    const fallbackCode = (getGlobalCurrency?.() || "EUR") as CurrencyCode
    return {
      code: fallbackCode,
      setCode: (c) => setCode(c),
      format: (amount, options) => formatWithCurrency(amount ?? 0, fallbackCode, options),
    }
  }
  return ctx
}

export default CurrencyProvider
