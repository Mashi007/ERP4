"use client"

import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Appointment } from "@/lib/database"

// Helpers to normalize and compare dates
function toLocalDate(input: unknown): Date | null {
  if (!input) return null
  if (input instanceof Date) return new Date(input.getFullYear(), input.getMonth(), input.getDate())
  if (typeof input === "string") {
    const m = input.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
    const d = new Date(input)
    if (!isNaN(d.getTime())) return new Date(d.getFullYear(), d.getMonth(), d.getDate())
    return null
  }
  if (typeof input === "number") {
    const d = new Date(input)
    if (!isNaN(d.getTime())) return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  }
  return null
}

function ymd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

type Props = {
  appointments: Appointment[]
  selectedDate?: Date | null
  onSelectedDateChange?: (d: Date) => void
}

export default function AppointmentCalendar({ appointments, selectedDate, onSelectedDateChange }: Props) {
  const initial = selectedDate ?? new Date()
  const [cursor, setCursor] = useState<Date>(new Date(initial.getFullYear(), initial.getMonth(), 1))

  // Keep month in sync if parent changes selectedDate
  useEffect(() => {
    if (selectedDate) {
      setCursor(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))
    }
  }, [selectedDate])

  // Map of dayKey -> appointments
  const byDay = useMemo(() => {
    const map = new Map<string, Appointment[]>()
    for (const ap of appointments) {
      const d = toLocalDate(ap.appointment_date as unknown)
      if (!d) continue
      const key = ymd(d)
      const arr = map.get(key) ?? []
      arr.push(ap)
      map.set(key, arr)
    }
    return map
  }, [appointments])

  const days = useMemo(() => {
    const start = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
    const end = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0)
    const startOffset = start.getDay() // 0 Sun .. 6 Sat
    const totalDays = end.getDate()
    const cells: Date[] = []
    // Leading blanks (from previous month)
    for (let i = 0; i < startOffset; i++) {
      const d = new Date(start)
      d.setDate(d.getDate() - (startOffset - i))
      cells.push(d)
    }
    // Current month
    for (let d = 1; d <= totalDays; d++) {
      cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d))
    }
    // Trailing blanks to complete 6 rows
    while (cells.length % 7 !== 0 || cells.length < 42) {
      const last = cells[cells.length - 1]
      const d = new Date(last)
      d.setDate(d.getDate() + 1)
      cells.push(d)
    }
    return cells
  }, [cursor])

  const isSameDay = (a: Date, b: Date) => ymd(a) === ymd(b)
  const inCurrentMonth = (d: Date) => d.getMonth() === cursor.getMonth() && d.getFullYear() === cursor.getFullYear()

  const selected = selectedDate ?? new Date()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar grid */}
      <div className="lg:col-span-2 border rounded-lg">
        <div className="flex items-center justify-between p-3 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            aria-label="Mes anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-semibold">{cursor.toLocaleString("es-ES", { month: "long", year: "numeric" })}</div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            aria-label="Mes siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-7 text-center text-xs text-gray-500 p-2">
          <div>Dom</div>
          <div>Lun</div>
          <div>Mar</div>
          <div>Mié</div>
          <div>Jue</div>
          <div>Vie</div>
          <div>Sáb</div>
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map((d, i) => {
            const key = ymd(d)
            const items = byDay.get(key) ?? []
            const isSelected = isSameDay(d, selected)
            return (
              <button
                key={i}
                onClick={() => onSelectedDateChange?.(new Date(d))}
                className={[
                  "h-24 bg-white p-2 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300",
                  !inCurrentMonth(d) ? "text-gray-400" : "text-gray-900",
                  isSelected ? "ring-2 ring-gray-800" : "",
                ].join(" ")}
              >
                <div className="text-xs font-medium">{d.getDate()}</div>
                <div className="mt-1 flex flex-col gap-1">
                  {items.slice(0, 3).map((ap) => (
                    <div key={ap.id} className="truncate rounded bg-gray-100 px-2 py-0.5 text-[10px]">
                      {ap.title}
                    </div>
                  ))}
                  {items.length > 3 && <div className="text-[10px] text-gray-500">+{items.length - 3} más</div>}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Day details */}
      <div className="border rounded-lg overflow-hidden">
        <div className="p-3 border-b font-semibold">
          {selected.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
        <div className="p-3 space-y-2">
          {(byDay.get(ymd(selected)) ?? []).length === 0 ? (
            <div className="text-sm text-gray-500">No hay eventos para este día.</div>
          ) : (
            (byDay.get(ymd(selected)) ?? []).map((ap) => (
              <div key={ap.id} className="rounded border p-2">
                <div className="text-sm font-medium">{ap.title}</div>
                <div className="text-xs text-gray-600">
                  {ap.appointment_time} • {ap.company || "Sin empresa"} • {ap.type}
                </div>
                {ap.notes && <div className="text-xs text-gray-500 mt-1 line-clamp-2">{ap.notes}</div>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
