"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import {
  Calendar,
  Clock,
  Users,
  Settings,
  CheckCircle,
  FolderSyncIcon as Sync,
  Plus,
  RefreshCw,
  Unlink,
} from "lucide-react"

export default function CalendarConfigPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [syncEnabled, setSyncEnabled] = useState(true)
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [defaultDuration, setDefaultDuration] = useState("30")
  const [reminderTime, setReminderTime] = useState("15")
  const [timezone, setTimezone] = useState("america/mexico_city")
  const [workingHours, setWorkingHours] = useState({
    monday: { enabled: true, start: "09:00", end: "17:00" },
    tuesday: { enabled: true, start: "09:00", end: "17:00" },
    wednesday: { enabled: true, start: "09:00", end: "17:00" },
    thursday: { enabled: true, start: "09:00", end: "17:00" },
    friday: { enabled: true, start: "09:00", end: "17:00" },
    saturday: { enabled: false, start: "09:00", end: "17:00" },
    sunday: { enabled: false, start: "09:00", end: "17:00" },
  })
  const [connectedCalendars, setConnectedCalendars] = useState([
    {
      id: 1,
      name: "Google Calendar Principal",
      email: "gd.casanas@gmail.com",
      provider: "google",
      status: "connected",
      lastSync: "Hace 5 minutos",
      eventsCount: 24,
      syncDirection: "bidirectional",
    },
    {
      id: 2,
      name: "Calendario de Trabajo",
      email: "trabajo@empresa.com",
      provider: "outlook",
      status: "pending",
      lastSync: "Nunca",
      eventsCount: 0,
      syncDirection: "bidirectional",
    },
  ])
  const [syncSettings, setSyncSettings] = useState([
    {
      id: "meetings",
      name: "Reuniones del CRM",
      description: "Sincronizar reuniones creadas en el CRM",
      enabled: true,
    },
    {
      id: "calls",
      name: "Llamadas programadas",
      description: "Agregar llamadas como eventos de calendario",
      enabled: true,
    },
    {
      id: "tasks",
      name: "Tareas con fecha",
      description: "Mostrar tareas con fecha límite",
      enabled: false,
    },
    {
      id: "deals",
      name: "Fechas de cierre de deals",
      description: "Recordatorios de fechas de cierre",
      enabled: true,
    },
  ])

  const handleSyncCalendar = async (calendarId: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/calendar/sync/${calendarId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        setConnectedCalendars((prev) =>
          prev.map((cal) => (cal.id === calendarId ? { ...cal, lastSync: "Ahora mismo", status: "connected" } : cal)),
        )
        toast({
          title: "Sincronización exitosa",
          description: "El calendario se ha sincronizado correctamente",
        })
      }
    } catch (error) {
      toast({
        title: "Error de sincronización",
        description: "No se pudo sincronizar el calendario",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnectCalendar = async (provider: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/calendar/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      })

      if (response.ok) {
        const newCalendar = await response.json()
        setConnectedCalendars((prev) => [...prev, newCalendar])
        toast({
          title: "Calendario conectado",
          description: `${provider} se ha conectado exitosamente`,
        })
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar el calendario",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnectCalendar = async (calendarId: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/calendar/disconnect/${calendarId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setConnectedCalendars((prev) => prev.filter((cal) => cal.id !== calendarId))
        toast({
          title: "Calendario desconectado",
          description: "El calendario se ha desconectado correctamente",
        })
      }
    } catch (error) {
      toast({
        title: "Error al desconectar",
        description: "No se pudo desconectar el calendario",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveConfiguration = async () => {
    setIsLoading(true)
    try {
      const configData = {
        syncEnabled,
        reminderEnabled,
        defaultDuration,
        reminderTime,
        timezone,
        workingHours,
        syncSettings,
      }

      const response = await fetch("/api/calendar/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configData),
      })

      if (response.ok) {
        toast({
          title: "Configuración guardada",
          description: "Los cambios se han guardado exitosamente",
        })
      }
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleSyncSetting = (settingId: string) => {
    setSyncSettings((prev) =>
      prev.map((setting) => (setting.id === settingId ? { ...setting, enabled: !setting.enabled } : setting)),
    )
  }

  const handleWorkingHourChange = (day: string, field: string, value: string | boolean) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: { ...prev[day as keyof typeof prev], [field]: value },
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Calendar className="mr-3 h-8 w-8 text-blue-600" />
              Configuración de Calendario
            </h1>
            <p className="text-gray-600">Gestiona la integración de tu calendario con el CRM</p>
          </div>
          <Button
            onClick={() => connectedCalendars.forEach((cal) => handleSyncCalendar(cal.id))}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Sincronizar Todo
          </Button>
        </div>

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                Estado de Conexión
              </div>
              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Calendario
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Conectar Nuevo Calendario</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid gap-3">
                        <Button
                          onClick={() => handleConnectCalendar("Google Calendar")}
                          disabled={isLoading}
                          className="w-full justify-start"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Google Calendar
                        </Button>
                        <Button
                          onClick={() => handleConnectCalendar("Outlook Calendar")}
                          disabled={isLoading}
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Outlook Calendar
                        </Button>
                        <Button
                          onClick={() => handleConnectCalendar("Apple Calendar")}
                          disabled={isLoading}
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Apple Calendar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {connectedCalendars.map((calendar) => (
                <div
                  key={calendar.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        calendar.status === "connected" ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    />
                    <div>
                      <h4 className="font-medium">{calendar.name}</h4>
                      <p className="text-sm text-gray-600">{calendar.email}</p>
                      <p className="text-xs text-gray-500">
                        Sincronización:{" "}
                        {calendar.syncDirection === "bidirectional" ? "Bidireccional" : "Unidireccional"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <Badge variant={calendar.status === "connected" ? "default" : "secondary"}>
                        {calendar.status === "connected" ? "Conectado" : "Pendiente"}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">Última sync: {calendar.lastSync}</p>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSyncCalendar(calendar.id)}
                        disabled={isLoading}
                      >
                        <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDisconnectCalendar(calendar.id)}
                        disabled={isLoading}
                      >
                        <Unlink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sync Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sync className="mr-2 h-5 w-5 text-blue-600" />
              Configuración de Sincronización
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sync-enabled" className="text-base font-medium">
                  Sincronización Automática
                </Label>
                <p className="text-sm text-gray-600">Mantener el calendario sincronizado automáticamente</p>
              </div>
              <Switch id="sync-enabled" checked={syncEnabled} onCheckedChange={setSyncEnabled} />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">¿Qué sincronizar?</h4>
              {syncSettings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label htmlFor={setting.id} className="font-medium">
                      {setting.name}
                    </Label>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                  <Switch
                    id={setting.id}
                    checked={setting.enabled}
                    onCheckedChange={() => handleToggleSyncSetting(setting.id)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Meeting Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-purple-600" />
              Configuración de Reuniones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="default-duration" className="text-base font-medium">
                  Duración por defecto
                </Label>
                <Select value={defaultDuration} onValueChange={setDefaultDuration}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="45">45 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="90">1.5 horas</SelectItem>
                    <SelectItem value="120">2 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reminder-time" className="text-base font-medium">
                  Recordatorio por defecto
                </Label>
                <Select value={reminderTime} onValueChange={setReminderTime}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutos antes</SelectItem>
                    <SelectItem value="15">15 minutos antes</SelectItem>
                    <SelectItem value="30">30 minutos antes</SelectItem>
                    <SelectItem value="60">1 hora antes</SelectItem>
                    <SelectItem value="1440">1 día antes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reminder-enabled" className="text-base font-medium">
                  Recordatorios Automáticos
                </Label>
                <p className="text-sm text-gray-600">Enviar recordatorios automáticos para reuniones</p>
              </div>
              <Switch id="reminder-enabled" checked={reminderEnabled} onCheckedChange={setReminderEnabled} />
            </div>
          </CardContent>
        </Card>

        {/* Availability Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-orange-600" />
              Horario de Disponibilidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-medium">Zona horaria</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america/mexico_city">América/Ciudad de México</SelectItem>
                      <SelectItem value="america/new_york">América/Nueva York</SelectItem>
                      <SelectItem value="europe/madrid">Europa/Madrid</SelectItem>
                      <SelectItem value="america/los_angeles">América/Los Ángeles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-4 block">Horario de trabajo</Label>
                <div className="space-y-3">
                  {Object.entries(workingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="w-24">
                        <Switch
                          checked={hours.enabled}
                          onCheckedChange={(enabled) => handleWorkingHourChange(day, "enabled", enabled)}
                        />
                        <Label className="ml-2 capitalize">
                          {day === "monday"
                            ? "Lunes"
                            : day === "tuesday"
                              ? "Martes"
                              : day === "wednesday"
                                ? "Miércoles"
                                : day === "thursday"
                                  ? "Jueves"
                                  : day === "friday"
                                    ? "Viernes"
                                    : day === "saturday"
                                      ? "Sábado"
                                      : "Domingo"}
                        </Label>
                      </div>
                      {hours.enabled && (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="time"
                            value={hours.start}
                            onChange={(e) => handleWorkingHourChange(day, "start", e.target.value)}
                            className="w-32"
                          />
                          <span className="text-sm">a</span>
                          <Input
                            type="time"
                            value={hours.end}
                            onChange={(e) => handleWorkingHourChange(day, "end", e.target.value)}
                            className="w-32"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={handleSaveConfiguration} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
            <Settings className="h-4 w-4 mr-2" />
            {isLoading ? "Guardando..." : "Guardar Configuración"}
          </Button>
        </div>
      </div>
    </div>
  )
}
