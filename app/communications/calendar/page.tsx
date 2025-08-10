"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Users, Settings, CheckCircle, AlertCircle, FolderSyncIcon as Sync, Bell } from 'lucide-react'

export default function CalendarConfigPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [syncEnabled, setSyncEnabled] = useState(true)
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [defaultDuration, setDefaultDuration] = useState("30")

  const connectedCalendars = [
    {
      id: 1,
      name: "Google Calendar Principal",
      email: "gd.casanas@gmail.com",
      status: "connected",
      lastSync: "Hace 5 minutos",
      eventsCount: 24
    },
    {
      id: 2,
      name: "Calendario de Trabajo",
      email: "trabajo@empresa.com",
      status: "pending",
      lastSync: "Nunca",
      eventsCount: 0
    }
  ]

  const syncSettings = [
    {
      id: "meetings",
      name: "Reuniones del CRM",
      description: "Sincronizar reuniones creadas en el CRM",
      enabled: true
    },
    {
      id: "calls",
      name: "Llamadas programadas",
      description: "Agregar llamadas como eventos de calendario",
      enabled: true
    },
    {
      id: "tasks",
      name: "Tareas con fecha",
      description: "Mostrar tareas con fecha límite",
      enabled: false
    },
    {
      id: "deals",
      name: "Fechas de cierre de deals",
      description: "Recordatorios de fechas de cierre",
      enabled: true
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Calendar className="mr-3 h-8 w-8 text-blue-600" />
            Configuración de Calendario
          </h1>
          <p className="text-gray-600">Gestiona la integración de tu calendario con el CRM</p>
        </div>

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
              Estado de Conexión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {connectedCalendars.map((calendar) => (
                <div key={calendar.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      calendar.status === 'connected' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <h4 className="font-medium">{calendar.name}</h4>
                      <p className="text-sm text-gray-600">{calendar.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={calendar.status === 'connected' ? 'default' : 'secondary'}>
                      {calendar.status === 'connected' ? 'Conectado' : 'Pendiente'}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      Última sync: {calendar.lastSync}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Agregar Nuevo Calendario
              </Button>
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
                <p className="text-sm text-gray-600">
                  Mantener el calendario sincronizado automáticamente
                </p>
              </div>
              <Switch
                id="sync-enabled"
                checked={syncEnabled}
                onCheckedChange={setSyncEnabled}
              />
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
                    onCheckedChange={() => {}}
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
                <Select defaultValue="15">
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
                <p className="text-sm text-gray-600">
                  Enviar recordatorios automáticos para reuniones
                </p>
              </div>
              <Switch
                id="reminder-enabled"
                checked={reminderEnabled}
                onCheckedChange={setReminderEnabled}
              />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-medium">Horario de trabajo</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm w-20">Lunes:</span>
                    <Select defaultValue="9">
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 24}, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {i.toString().padStart(2, '0')}:00
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-sm">a</span>
                    <Select defaultValue="17">
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 24}, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {i.toString().padStart(2, '0')}:00
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Zona horaria</Label>
                <Select defaultValue="america/mexico_city">
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
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline">
            Cancelar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Settings className="h-4 w-4 mr-2" />
            Guardar Configuración
          </Button>
        </div>
      </div>
    </div>
  )
}
