"use client"

import type React from "react"

import { useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateAppointment } from "./actions"
import type { Appointment } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: Appointment | null
  onSuccess?: (updated?: Appointment) => void
}

export default function EditAppointmentDialog({ open, onOpenChange, appointment, onSuccess }: Props) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const [form, setForm] = useState({
    title: "",
    company: "",
    appointment_date: "",
    appointment_time: "",
    duration: "60",
    type: "meeting",
    location: "",
    notes: "",
    status: "scheduled",
  })

  useEffect(() => {
    if (appointment) {
      setForm({
        title: appointment.title ?? "",
        company: appointment.company ?? "",
        appointment_date: appointment.appointment_date ?? "",
        appointment_time: appointment.appointment_time ?? "",
        duration: String(appointment.duration ?? 60),
        type: appointment.type ?? "meeting",
        location: appointment.location ?? "",
        notes: appointment.notes ?? "",
        status: appointment.status ?? "scheduled",
      })
    }
  }, [appointment])

  const handleChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!appointment) return

    startTransition(async () => {
      try {
        const payload = {
          title: form.title,
          company: form.company,
          appointment_date: form.appointment_date,
          appointment_time: form.appointment_time,
          duration: Number.parseInt(form.duration || "60", 10),
          type: form.type,
          location: form.location || null,
          notes: form.notes || null,
          status: form.status,
        }
        const updated = await updateAppointment(appointment.id, payload as any)
        toast({ title: "Cita actualizada", description: "Se guardaron los cambios." })
        onOpenChange(false)
        onSuccess?.(updated)
      } catch (err) {
        console.error(err)
        toast({
          title: "Error al actualizar",
          description: "No se pudo guardar. Inténtalo nuevamente.",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar cita</DialogTitle>
          <DialogDescription>Modifica los datos y guarda los cambios.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" value={form.title} onChange={handleChange("title")} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input id="company" value={form.company} onChange={handleChange("company")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointment_date">Fecha</Label>
              <Input
                id="appointment_date"
                type="date"
                value={form.appointment_date}
                onChange={handleChange("appointment_date")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointment_time">Hora</Label>
              <Input
                id="appointment_time"
                type="time"
                value={form.appointment_time}
                onChange={handleChange("appointment_time")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duración (min)</Label>
              <Input
                id="duration"
                type="number"
                min={5}
                step={5}
                value={form.duration}
                onChange={handleChange("duration")}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Reunión</SelectItem>
                  <SelectItem value="demo">Demo</SelectItem>
                  <SelectItem value="call">Llamada</SelectItem>
                  <SelectItem value="consultation">Consulta</SelectItem>
                  <SelectItem value="presentation">Presentación</SelectItem>
                  <SelectItem value="follow-up">Seguimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input id="location" value={form.location} onChange={handleChange("location")} />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Programada</SelectItem>
                  <SelectItem value="completed">Completada</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea id="notes" value={form.notes} onChange={handleChange("notes")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
              {isPending ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
