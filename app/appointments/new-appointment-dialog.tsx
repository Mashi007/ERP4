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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Appointment, Contact } from "@/lib/database"
import { createAppointment } from "./actions"
import { useToast } from "@/hooks/use-toast"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (appointment?: Appointment) => void
}

type SearchState = {
  query: string
  loading: boolean
  results: Contact[]
  selected: Contact | null
  error?: string
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("")
}

export default function NewAppointmentDialog({ open, onOpenChange, onSuccess }: Props) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  // Form state (except contact which is selected separately)
  const [form, setForm] = useState({
    title: "",
    appointment_date: "",
    appointment_time: "",
    duration: "60",
    type: "meeting",
    location: "",
    notes: "",
  })

  const handleChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  // Contact search state
  const [search, setSearch] = useState<SearchState>({
    query: "",
    loading: false,
    results: [],
    selected: null,
  })

  // Debounced search by last name
  useEffect(() => {
    let active = true
    const q = search.query.trim()
    if (q.length < 2 || search.selected) {
      // if selected, hide dropdown; if query < 2, do nothing
      setSearch((s) => ({ ...s, loading: false }))
      return
    }

    setSearch((s) => ({ ...s, loading: true, error: undefined }))
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/contacts/search?q=${encodeURIComponent(q)}`)
        if (!res.ok) throw new Error("Error buscando contactos")
        const data: { results: Contact[] } = await res.json()
        if (!active) return
        setSearch((s) => ({ ...s, results: data.results, loading: false }))
      } catch (err: any) {
        if (!active) return
        setSearch((s) => ({ ...s, loading: false, error: err?.message || "Error de red" }))
      }
    }, 300)

    return () => {
      active = false
      clearTimeout(t)
    }
  }, [search.query, search.selected])

  const handleSelectContact = (c: Contact) => {
    setSearch((s) => ({
      ...s,
      selected: c,
      results: [],
      // Keep last name in the input for user context
      query: (c.name.split(" ").filter(Boolean).slice(-1)[0] || "").toString(),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!search.selected) {
      toast({
        title: "Selecciona un contacto",
        description: "Debes elegir un contacto para crear la cita.",
        variant: "destructive",
      })
      return
    }

    const fd = new FormData()
    fd.set("title", form.title)
    fd.set("appointment_date", form.appointment_date)
    fd.set("appointment_time", form.appointment_time)
    fd.set("duration", form.duration || "60")
    fd.set("type", form.type)
    fd.set("location", form.location)
    fd.set("notes", form.notes)
    // Link with Contacts DB
    fd.set("contact_id", String(search.selected.id))
    fd.set("company", search.selected.company || "")

    startTransition(async () => {
      try {
        const created = await createAppointment(fd)
        toast({ title: "Cita creada", description: "Se creó la cita correctamente." })
        onOpenChange(false)
        // reset
        setForm({
          title: "",
          appointment_date: "",
          appointment_time: "",
          duration: "60",
          type: "meeting",
          location: "",
          notes: "",
        })
        setSearch({ query: "", loading: false, results: [], selected: null })
        onSuccess?.(created)
      } catch (err) {
        console.error(err)
        toast({
          title: "Error al crear la cita",
          description: "Inténtalo nuevamente.",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nueva cita</DialogTitle>
          <DialogDescription>Completa los datos. El contacto se busca por apellido.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Ej. Reunión de seguimiento"
                value={form.title}
                onChange={handleChange("title")}
                required
              />
            </div>

            {/* Contacto (buscar por apellido) */}
            <div className="space-y-2 md:col-span-1 relative">
              <Label htmlFor="contact-search">Contacto (buscar por apellido)</Label>
              <Input
                id="contact-search"
                placeholder="Ej. García"
                value={search.query}
                onChange={(e) => setSearch((s) => ({ ...s, query: e.target.value, selected: null }))}
                autoComplete="off"
                aria-autocomplete="list"
                aria-controls="contact-results"
                aria-expanded={!search.selected && search.query.trim().length >= 2}
              />

              {/* Selected contact preview */}
              {search.selected && (
                <div className="mt-2 flex items-start gap-2 rounded-md border p-2 overflow-hidden">
                  <Avatar className="h-7 w-7 shrink-0">
                    {search.selected.avatar_url ? (
                      <AvatarImage
                        src={
                          search.selected.avatar_url ||
                          "/placeholder.svg?height=28&width=28&query=contact-avatar" ||
                          "/placeholder.svg"
                        }
                        alt={search.selected.name}
                      />
                    ) : (
                      <AvatarFallback>{getInitials(search.selected.name)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="text-sm w-full min-w-0">
                    <div className="font-medium truncate">{search.selected.name}</div>
                    {search.selected.company && (
                      <div className="text-xs text-muted-foreground break-words">{search.selected.company}</div>
                    )}
                    {search.selected.email && (
                      <div className="text-xs text-muted-foreground break-all">{search.selected.email}</div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="ml-auto h-7 px-2 text-xs"
                    onClick={() => setSearch((s) => ({ ...s, selected: null, results: [] }))}
                  >
                    Cambiar
                  </Button>
                </div>
              )}

              {/* Results dropdown: constrained to input width and wrapping long content */}
              {!search.selected && search.query.trim().length >= 2 && (
                <div
                  id="contact-results"
                  className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 w-full max-h-60 overflow-auto overflow-x-hidden rounded-md border bg-background shadow-lg"
                >
                  {search.loading ? (
                    <div className="p-3 text-sm text-muted-foreground">Buscando...</div>
                  ) : search.error ? (
                    <div className="p-3 text-sm text-red-600">{search.error}</div>
                  ) : search.results.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground">Sin resultados</div>
                  ) : (
                    <ul className="divide-y">
                      {search.results.map((c) => (
                        <li key={c.id}>
                          <button
                            type="button"
                            onClick={() => handleSelectContact(c)}
                            className="flex w-full items-center gap-3 p-2 text-left hover:bg-muted/50"
                          >
                            <Avatar className="h-7 w-7 shrink-0">
                              {c.avatar_url ? (
                                <AvatarImage
                                  src={
                                    c.avatar_url ||
                                    "/placeholder.svg?height=28&width=28&query=contact-avatar" ||
                                    "/placeholder.svg"
                                  }
                                  alt={c.name}
                                />
                              ) : (
                                <AvatarFallback>{getInitials(c.name)}</AvatarFallback>
                              )}
                            </Avatar>
                            <div className="flex min-w-0 flex-col w-full">
                              <span className="truncate text-sm font-medium">{c.name}</span>
                              {c.company && (
                                <span className="text-xs text-muted-foreground break-words">{c.company}</span>
                              )}
                              {c.email && <span className="text-xs text-muted-foreground break-all">{c.email}</span>}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Fecha */}
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

            {/* Hora */}
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

            {/* Duración */}
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

            {/* Tipo */}
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
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

            {/* Ubicación */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                placeholder="Ej. Videollamada"
                value={form.location}
                onChange={handleChange("location")}
              />
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              placeholder="Detalles adicionales..."
              value={form.notes}
              onChange={handleChange("notes")}
              className="resize-y"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creando..." : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
