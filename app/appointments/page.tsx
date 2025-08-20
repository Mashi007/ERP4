"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  Filter,
  List,
  CalendarIcon,
  Clock,
  MapPin,
  User,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Appointment } from "@/lib/database"
import { getAppointments, deleteAppointment } from "./actions"
import NewAppointmentDialog from "./new-appointment-dialog"
import AppointmentCalendar from "./calendar-view"
import EditAppointmentDialog from "./edit-appointment-dialog"
import { useToast } from "@/hooks/use-toast"

// Helpers de fecha
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
function ymd(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}
function upsertAppointment(list: Appointment[], a: any): Appointment[] {
  // Upsert por id (si existe) o por clave derivada (title + ymd date)
  const d = toLocalDate(a?.appointment_date as unknown) ?? new Date()
  const key = `${String(a?.title ?? "").trim()}__${ymd(d)}`
  let foundIdx = -1
  if (a?.id != null) {
    foundIdx = list.findIndex((x: any) => x.id === a.id)
  }
  if (foundIdx === -1) {
    foundIdx = list.findIndex(
      (x: any) => `${String(x.title ?? "").trim()}__${ymd(toLocalDate(x.appointment_date as any) ?? d)}` === key,
    )
  }
  const merged: Appointment = { ...(list[foundIdx] ?? {}), ...a }
  if (foundIdx >= 0) {
    const next = list.slice()
    next[foundIdx] = merged
    return next
  }
  return [...list, merged]
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"list" | "calendar">("list")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const loadAppointments = async () => {
    setIsLoading(true)
    try {
      const appointmentsData = await getAppointments()
      setAppointments(appointmentsData)
    } catch (error) {
      console.error("Error cargando citas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAppointments()
  }, [])

  // Suscribirse a recordatorios creados desde "Embudo de Ventas"
  useEffect(() => {
    function focusCalendarFor(dateLike?: unknown) {
      setActiveTab("calendar")
      setSelectedDate(toLocalDate(dateLike) ?? new Date())
    }

    // BroadcastChannel (si está disponible)
    let ch: BroadcastChannel | null = null
    const onMessage = (ev: MessageEvent) => {
      const data = ev.data
      if (data?.type === "created" && data?.payload) {
        // Optimistic update para Lista y Calendario
        setAppointments((prev) => upsertAppointment(prev, data.payload))
        focusCalendarFor(data.payload.appointment_date)
        // Sincroniza con el servidor en background
        setTimeout(() => {
          loadAppointments()
        }, 800)
      }
    }
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      ch = new BroadcastChannel("crm-appointments")
      ch.addEventListener("message", onMessage)
    }

    // Fallback: CustomEvent en la misma pestaña
    const onWindowEvent = (e: Event) => {
      const detail: any = (e as CustomEvent).detail
      if (detail) {
        setAppointments((prev) => upsertAppointment(prev, detail))
        focusCalendarFor(detail.appointment_date)
        setTimeout(() => {
          loadAppointments()
        }, 800)
      }
    }
    window.addEventListener("appointments:created", onWindowEvent as EventListener)

    return () => {
      if (ch) {
        ch.removeEventListener("message", onMessage)
        ch.close()
      }
      window.removeEventListener("appointments:created", onWindowEvent as EventListener)
    }
  }, [])

  // Hooks de éxito locales
  const handleNewAppointmentSuccess = (created?: Appointment) => {
    loadAppointments()
    setActiveTab("calendar")
    setSelectedDate(toLocalDate(created?.appointment_date as unknown) ?? new Date())
  }
  const handleEditSuccess = (updated?: Appointment) => {
    loadAppointments()
    setActiveTab("calendar")
    setSelectedDate(toLocalDate(updated?.appointment_date as unknown) ?? new Date())
  }

  const handleEdit = (appt: Appointment) => {
    setSelectedAppointment(appt)
    setShowEditDialog(true)
  }
  const handleDelete = (id: number) => {
    setDeleteId(id)
  }
  const confirmDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await deleteAppointment(deleteId)
      toast({ title: "Cita eliminada", description: "La cita fue eliminada correctamente." })
      setDeleteId(null)
      loadAppointments()
    } catch (err) {
      console.error(err)
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar la cita. Inténtalo nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredAppointments = appointments.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.company && a.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.type && a.type.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const totalAppointments = appointments.length
  const scheduledAppointments = appointments.filter((a) => a.status === "scheduled").length
  const completedAppointments = appointments.filter((a) => a.status === "completed").length
  const cancelledAppointments = appointments.filter((a) => a.status === "cancelled").length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando citas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">Citas</h1>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                {totalAppointments} total
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar citas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowNewDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Cita
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalAppointments}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{scheduledAppointments}</div>
            <div className="text-sm text-gray-600">Programadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completedAppointments}</div>
            <div className="text-sm text-gray-600">Completadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{cancelledAppointments}</div>
            <div className="text-sm text-gray-600">Canceladas</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "list" | "calendar")} className="px-6">
        <TabsList className="grid w-full max-w-md grid-cols-2 mt-4">
          <TabsTrigger value="list" className="flex items-center space-x-2">
            <List className="h-4 w-4" />
            <span>Reuniones</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4" />
            <span>Calendario</span>
          </TabsTrigger>
        </TabsList>

        {/* LISTA */}
        <TabsContent value="list" className="mt-6">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="text-left font-medium text-gray-600 py-3">Título</TableHead>
                <TableHead className="text-left font-medium text-gray-600 py-3">Contacto</TableHead>
                <TableHead className="text-left font-medium text-gray-600 py-3">Fecha y Hora</TableHead>
                <TableHead className="text-left font-medium text-gray-600 py-3">Tipo</TableHead>
                <TableHead className="text-left font-medium text-gray-600 py-3">Ubicación</TableHead>
                <TableHead className="text-left font-medium text-gray-600 py-3">Estado</TableHead>
                <TableHead className="text-left font-medium text-gray-600 py-3">Propietario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow
                  key={appointment.id ?? `${appointment.title}-${appointment.appointment_date}`}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <TableCell className="py-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-medium text-gray-900">{appointment.title}</div>
                        {appointment.notes && <div className="text-sm text-gray-500 mt-1">{appointment.notes}</div>}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            aria-label="Acciones de la cita"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => handleEdit(appointment)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => handleDelete(appointment.id as number)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Eliminar</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-sm font-medium bg-gray-200 text-gray-800">
                          {String(appointment.company || "UK")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">{appointment.company || "Sin empresa"}</div>
                        <div className="text-sm text-gray-500">ID: {appointment.contact_id || "N/A"}</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {new Date(appointment.appointment_date as any).toLocaleDateString("es-ES")}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.appointment_time} {appointment.duration ? `(${appointment.duration}min)` : ""}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <Badge variant="outline" className="bg-gray-50">
                      {appointment.type || "—"}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{appointment.location || "No especificada"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                      {appointment.status || "scheduled"}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{appointment.sales_owner || "—"}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <div className="text-gray-500 mb-4">
                {searchTerm ? "No se encontraron citas que coincidan con tu búsqueda" : "No hay citas programadas"}
              </div>
              <Button onClick={() => setShowNewDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Programar primera cita
              </Button>
            </div>
          )}
        </TabsContent>

        {/* CALENDARIO */}
        <TabsContent value="calendar" className="mt-6">
          <AppointmentCalendar
            appointments={appointments}
            selectedDate={selectedDate}
            onSelectedDateChange={setSelectedDate}
          />
        </TabsContent>
      </Tabs>

      {/* Diálogos */}
      <NewAppointmentDialog
        open={showNewDialog}
        onOpenChange={setShowNewDialog}
        onSuccess={handleNewAppointmentSuccess}
      />
      <EditAppointmentDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        appointment={selectedAppointment}
        onSuccess={handleEditSuccess}
      />

      {/* Confirmación: Eliminar */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar cita</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. ¿Deseas eliminar esta cita definitivamente?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} onClick={() => setDeleteId(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" disabled={isDeleting} onClick={confirmDelete}>
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
