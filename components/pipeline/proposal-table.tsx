"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarPlus, Paperclip, Send, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

type DealLite = {
  id: number
  title: string
  contact_email?: string
  contact_id?: number
  company?: string
}

interface ProposalTableProps {
  deal: DealLite
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function toLocalDateTimeInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0")
  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  const d = pad(date.getDate())
  const hh = pad(date.getHours())
  const mm = pad(date.getMinutes())
  return `${y}-${m}-${d}T${hh}:${mm}`
}

// Broadcast helper with fallback
function broadcastAppointmentCreated(payload: any) {
  try {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const ch = new BroadcastChannel("crm-appointments")
      ch.postMessage({ type: "created", payload })
      ch.close()
      return
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("appointments:created", { detail: payload }))
    }
  } catch {
    // no-op
  }
}

export default function ProposalTable({ deal }: ProposalTableProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploadedAt, setUploadedAt] = useState<Date | null>(null)
  const [action, setAction] = useState<"recordatorio" | "email" | "">("")
  const defaultFollowUp = useMemo(() => toLocalDateTimeInputValue(addDays(new Date(), 3)), [])
  const [followUpAt, setFollowUpAt] = useState<string>(defaultFollowUp)
  const [isWorking, setIsWorking] = useState(false)

  const onPickFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setUploadedAt(new Date())
      toast({ title: "Propuesta adjunta", description: `Archivo: ${f.name}` })
    }
  }

  async function createReminder() {
    try {
      if (!followUpAt) {
        toast({ title: "Selecciona una fecha", variant: "destructive" })
        return
      }
      setIsWorking(true)
      const payload = {
        title: `Seguimiento: ${deal.title}`,
        description: "Recordatorio de seguimiento por propuesta",
        appointment_date: new Date(followUpAt).toISOString(),
        contact_email: deal.contact_email || "",
        contact_id: deal.contact_id ?? null,
        deal_id: deal.id,
        location: deal.company || null,
      }
      const res = await fetch("/api/appointments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("No se pudo crear la cita")
      const data = await res.json()

      // Notificar en vivo a "Citas"
      broadcastAppointmentCreated(data.appointment)

      toast({
        title: "Recordatorio creado",
        description: `Se agregó a Citas para ${new Date(data.appointment.appointment_date).toLocaleString()}`,
      })
      setAction("")
    } catch (err) {
      console.error(err)
      toast({ title: "Error al crear recordatorio", variant: "destructive" })
    } finally {
      setIsWorking(false)
    }
  }

  async function sendEmail() {
    try {
      if (!deal.contact_email) {
        toast({
          title: "El contacto no tiene email",
          description: "Agrega un email antes de enviar.",
          variant: "destructive",
        })
        return
      }
      if (!file) {
        toast({
          title: "Adjunta la propuesta",
          description: "Selecciona un archivo para adjuntar.",
          variant: "destructive",
        })
        return
      }
      setIsWorking(true)
      const form = new FormData()
      form.append("to", deal.contact_email)
      form.append("subject", `Propuesta - ${deal.title}`)
      form.append("text", "Hola, adjuntamos la propuesta relacionada a la oportunidad. Quedamos atentos.")
      form.append("attachment", file, file.name)

      const res = await fetch("/api/email/send", { method: "POST", body: form })
      if (!res.ok) throw new Error("No se pudo enviar el email")
      const data = await res.json()
      toast({ title: "Email enviado", description: `Se envió a ${data.to}` })
      setAction("")
    } catch (err) {
      console.error(err)
      toast({ title: "Error al enviar email", variant: "destructive" })
    } finally {
      setIsWorking(false)
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Propuesta y acciones</h3>

      <Table className="border rounded-md overflow-hidden">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[45%]">Propuesta</TableHead>
            <TableHead className="w-[25%]">Fecha</TableHead>
            <TableHead className="w-[30%]">Nueva acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Label htmlFor="proposal_file" className="sr-only">
                    Adjuntar propuesta
                  </Label>
                  <Input id="proposal_file" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={onPickFile} />
                  {file && (
                    <div className="mt-2 text-xs text-gray-600 break-words">
                      <span className="inline-flex items-center gap-1">
                        <Paperclip className="h-3 w-3" />
                        {file.name} • {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  )}
                </div>
                {file && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Quitar archivo"
                    onClick={() => {
                      setFile(null)
                      setUploadedAt(null)
                    }}
                    className="shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>

            <TableCell>
              <div className="text-sm">{uploadedAt ? uploadedAt.toLocaleString() : "—"}</div>
            </TableCell>

            <TableCell>
              <div className="flex flex-col gap-2">
                <Select value={action} onValueChange={(v: "recordatorio" | "email") => setAction(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar acción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recordatorio">Recordatorio</SelectItem>
                    <SelectItem value="email">Enviar email</SelectItem>
                  </SelectContent>
                </Select>

                {action === "recordatorio" && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="datetime-local"
                      value={followUpAt}
                      onChange={(e) => setFollowUpAt(e.target.value)}
                      className="max-w-[240px]"
                    />
                    <Button type="button" onClick={createReminder} disabled={isWorking}>
                      <CalendarPlus className="h-4 w-4 mr-2" />
                      Crear recordatorio
                    </Button>
                  </div>
                )}

                {action === "email" && (
                  <div>
                    <Button type="button" onClick={sendEmail} disabled={isWorking}>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar email
                    </Button>
                  </div>
                )}
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <p className="text-xs text-gray-500">
        La fecha se registra automáticamente al adjuntar una propuesta. Las acciones pueden ejecutarse en cualquier
        momento.
      </p>
    </div>
  )
}
