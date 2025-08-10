"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Plus, Phone, Mail, Users, Clock, CheckCircle } from "lucide-react"

export default function ActivitiesPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: "call",
      title: "Llamada de seguimiento",
      contact: "Juan Pérez",
      company: "Tech Solutions Inc.",
      date: "2024-01-15",
      time: "10:30",
      duration: 30,
      status: "Completada",
      notes: "Discutimos los requerimientos del proyecto CRM",
    },
    {
      id: 2,
      type: "email",
      title: "Envío de propuesta",
      contact: "María García",
      company: "Marketing Pro",
      date: "2024-01-15",
      time: "11:15",
      duration: 15,
      status: "Completada",
      notes: "Propuesta enviada con detalles de servicios de marketing digital",
    },
    {
      id: 3,
      type: "meeting",
      title: "Reunión de presentación",
      contact: "Carlos López",
      company: "StartupXYZ",
      date: "2024-01-15",
      time: "14:00",
      duration: 60,
      status: "Programada",
      notes: "Presentación de soluciones para startup",
    },
    {
      id: 4,
      type: "call",
      title: "Llamada de cierre",
      contact: "Ana Martínez",
      company: "Enterprise Corp",
      date: "2024-01-15",
      time: "15:30",
      duration: 45,
      status: "Programada",
      notes: "Finalizar detalles del contrato anual",
    },
    {
      id: 5,
      type: "meeting",
      title: "Demo del producto",
      contact: "Roberto Silva",
      company: "Innovate LLC",
      date: "2024-01-16",
      time: "09:00",
      duration: 90,
      status: "Programada",
      notes: "Demostración completa de la plataforma",
    },
  ])

  const [newActivity, setNewActivity] = useState({
    type: "call",
    title: "",
    contact: "",
    company: "",
    date: "",
    time: "",
    duration: "30",
    notes: "",
  })

  const activityTypes = [
    { value: "call", label: "Llamada", icon: Phone },
    { value: "email", label: "Email", icon: Mail },
    { value: "meeting", label: "Reunión", icon: Users },
  ]

  const getActivityIcon = (type: string) => {
    const activityType = activityTypes.find((t) => t.value === type)
    return activityType ? activityType.icon : Phone
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completada":
        return "bg-green-100 text-green-800"
      case "Programada":
        return "bg-blue-100 text-blue-800"
      case "Cancelada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredActivities = activities.filter((activity) => activity.date === selectedDate)

  const handleAddActivity = () => {
    const activity = {
      ...newActivity,
      id: activities.length + 1,
      duration: Number.parseInt(newActivity.duration),
      status: "Programada",
    }
    setActivities([...activities, activity])
    setNewActivity({
      type: "call",
      title: "",
      contact: "",
      company: "",
      date: "",
      time: "",
      duration: "30",
      notes: "",
    })
    setIsDialogOpen(false)
  }

  const markAsCompleted = (id: number) => {
    setActivities(activities.map((activity) => (activity.id === id ? { ...activity, status: "Completada" } : activity)))
  }

  const todayActivities = activities.filter((activity) => activity.date === new Date().toISOString().split("T")[0])
  const completedToday = todayActivities.filter((activity) => activity.status === "Completada").length
  const scheduledToday = todayActivities.filter((activity) => activity.status === "Programada").length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Actividades</h1>
            <p className="text-gray-600">Programa y gestiona tus actividades diarias</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Actividad
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Programar Nueva Actividad</DialogTitle>
                <DialogDescription>Programa una nueva actividad con tus contactos.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Tipo
                  </Label>
                  <Select
                    value={newActivity.type}
                    onValueChange={(value) => setNewActivity({ ...newActivity, type: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {activityTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Título
                  </Label>
                  <Input
                    id="title"
                    value={newActivity.title}
                    onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact" className="text-right">
                    Contacto
                  </Label>
                  <Input
                    id="contact"
                    value={newActivity.contact}
                    onChange={(e) => setNewActivity({ ...newActivity, contact: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company" className="text-right">
                    Empresa
                  </Label>
                  <Input
                    id="company"
                    value={newActivity.company}
                    onChange={(e) => setNewActivity({ ...newActivity, company: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Fecha
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newActivity.date}
                    onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    Hora
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={newActivity.time}
                    onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration" className="text-right">
                    Duración (min)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newActivity.duration}
                    onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notas
                  </Label>
                  <Textarea
                    id="notes"
                    value={newActivity.notes}
                    onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddActivity}>Programar Actividad</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actividades Hoy</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayActivities.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedToday}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Programadas</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{scheduledToday}</div>
            </CardContent>
          </Card>
        </div>

        {/* Date Selector */}
        <div className="mb-6">
          <Label htmlFor="date-select" className="text-sm font-medium mb-2 block">
            Seleccionar fecha:
          </Label>
          <Input
            id="date-select"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-48"
          />
        </div>

        {/* Activities List */}
        <div className="space-y-4">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => {
              const ActivityIcon = getActivityIcon(activity.type)
              return (
                <Card key={activity.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-full bg-gray-100">
                          <ActivityIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{activity.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {activity.contact} - {activity.company}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {activity.time} ({activity.duration} min)
                            </span>
                          </div>
                          {activity.notes && (
                            <p className="text-sm text-muted-foreground mt-2 bg-gray-50 p-2 rounded">
                              {activity.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                        {activity.status === "Programada" && (
                          <Button size="sm" variant="outline" onClick={() => markAsCompleted(activity.id)}>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay actividades programadas para esta fecha.</p>
              <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Programar Actividad
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
