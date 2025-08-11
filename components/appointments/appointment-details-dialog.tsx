"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Appointment } from "@/lib/database"
import { Calendar, Building2, FileText, Clock } from "lucide-react"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: Appointment | null
}

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

export default function AppointmentDetailsDialog({ open, onOpenChange, appointment }: Props) {
  const date = appointment ? toLocalDate((appointment as any).appointment_date) : null

  const dateStr = date?.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }) ?? "—"
  const timeStr = (appointment as any)?.appointment_time || "—"
  const company = (appointment as any)?.company || "—"
  const type = (appointment as any)?.type || "—"
  const notes = (appointment as any)?.notes || ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="appointment-details-description" className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">{"Detalle de la cita"}</DialogTitle>
          <DialogDescription id="appointment-details-description">
            {"Información de la cita seleccionada."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-500">{"Título"}</div>
            <div className="text-sm font-medium break-words">{(appointment as any)?.title || "—"}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <div className="text-xs text-gray-500">{"Fecha"}</div>
                <div className="text-sm font-medium">{dateStr}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <div className="text-xs text-gray-500">{"Hora"}</div>
                <div className="text-sm font-medium">{timeStr}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <Building2 className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <div className="text-xs text-gray-500">{"Empresa"}</div>
                <div className="text-sm font-medium break-words">{company}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <div className="text-xs text-gray-500">{"Tipo"}</div>
                <div className="text-sm font-medium">{type}</div>
              </div>
            </div>
          </div>

          {notes ? (
            <div>
              <div className="text-xs text-gray-500">{"Notas"}</div>
              <div className="text-sm whitespace-pre-wrap break-words">{notes}</div>
            </div>
          ) : null}
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={() => onOpenChange(false)}>{"Cerrar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
