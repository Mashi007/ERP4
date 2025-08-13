"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Video, Clock, CheckCircle, AlertCircle, FolderSyncIcon as Sync, Shield } from "lucide-react"

export default function CalendarSettingsPage() {
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false)
  const [outlookCalendarConnected, setOutlookCalendarConnected] = useState(false)
  const [zoomConnected, setZoomConnected] = useState(false)
  const [teamsConnected, setTeamsConnected] = useState(false)

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración de Calendario</h1>
          <p className="text-muted-foreground">Sincroniza calendarios y configura videoconferencias automáticas</p>
        </div>
        <Button>
          <Sync className="mr-2 h-4 w-4" />
          Sincronizar Calendarios
        </Button>
      </div>

      <Tabs defaultValue="calendars" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calendars">Calendarios</TabsTrigger>
          <TabsTrigger value="videoconference">Videoconferencias</TabsTrigger>
          <TabsTrigger value="availability">Disponibilidad</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="calendars" className="space-y-6">
          {/* Google Calendar */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Google Calendar</CardTitle>
                    <CardDescription>Sincronizar con Google Calendar</CardDescription>
                  </div>
                </div>
                <Badge variant={googleCalendarConnected ? "default" : "secondary"}>
                  {googleCalendarConnected ? "Conectado" : "Desconectado"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!googleCalendarConnected ? (
                <div className="space-y-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Sincronización bidireccional segura. Las citas se crearán automáticamente en ambos calendarios.
                    </AlertDescription>
                  </Alert>
                  <Button onClick={() => setGoogleCalendarConnected(true)} className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    Conectar Google Calendar
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Conectado: calendario@gmail.com</span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="google-sync-direction">Dirección de sincronización</Label>
                      <Select defaultValue="bidirectional">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bidirectional">Bidireccional</SelectItem>
                          <SelectItem value="to-google">Solo hacia Google</SelectItem>
                          <SelectItem value="from-google">Solo desde Google</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="google-calendar-select">Calendario principal</Label>
                      <Select defaultValue="primary">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">Calendario principal</SelectItem>
                          <SelectItem value="work">Trabajo</SelectItem>
                          <SelectItem value="crm">CRM Citas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setGoogleCalendarConnected(false)}>
                    Desconectar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Outlook Calendar */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle>Outlook Calendar</CardTitle>
                    <CardDescription>Sincronizar con Microsoft Outlook</CardDescription>
                  </div>
                </div>
                <Badge variant={outlookCalendarConnected ? "default" : "secondary"}>
                  {outlookCalendarConnected ? "Conectado" : "Desconectado"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!outlookCalendarConnected ? (
                <div className="space-y-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Compatible con Office 365 y Outlook.com. Sincronización en tiempo real.
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={() => setOutlookCalendarConnected(true)}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Conectar Outlook Calendar
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Conectado: usuario@outlook.com</span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="outlook-sync-direction">Dirección de sincronización</Label>
                      <Select defaultValue="bidirectional">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bidirectional">Bidireccional</SelectItem>
                          <SelectItem value="to-outlook">Solo hacia Outlook</SelectItem>
                          <SelectItem value="from-outlook">Solo desde Outlook</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="outlook-calendar-select">Calendario principal</Label>
                      <Select defaultValue="calendar">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="calendar">Calendario</SelectItem>
                          <SelectItem value="work">Trabajo</SelectItem>
                          <SelectItem value="meetings">Reuniones</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setOutlookCalendarConnected(false)}>
                    Desconectar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videoconference" className="space-y-6">
          {/* Zoom Integration */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Video className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Zoom</CardTitle>
                    <CardDescription>Crear reuniones de Zoom automáticamente</CardDescription>
                  </div>
                </div>
                <Badge variant={zoomConnected ? "default" : "secondary"}>
                  {zoomConnected ? "Conectado" : "Desconectado"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!zoomConnected ? (
                <div className="space-y-4">
                  <Alert>
                    <Video className="h-4 w-4" />
                    <AlertDescription>
                      Las citas se crearán automáticamente con enlaces de Zoom. Requiere cuenta Zoom Pro o superior.
                    </AlertDescription>
                  </Alert>
                  <Button onClick={() => setZoomConnected(true)} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Video className="mr-2 h-4 w-4" />
                    Conectar Zoom
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Conectado: usuario@zoom.us</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="zoom-auto-create">Crear reuniones automáticamente</Label>
                      <Switch id="zoom-auto-create" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="zoom-waiting-room">Sala de espera habilitada</Label>
                      <Switch id="zoom-waiting-room" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="zoom-recording">Grabación automática</Label>
                      <Switch id="zoom-recording" />
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setZoomConnected(false)}>
                    Desconectar Zoom
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Microsoft Teams */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Video className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Microsoft Teams</CardTitle>
                    <CardDescription>Integración con Microsoft Teams</CardDescription>
                  </div>
                </div>
                <Badge variant={teamsConnected ? "default" : "secondary"}>
                  {teamsConnected ? "Conectado" : "Desconectado"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!teamsConnected ? (
                <div className="space-y-4">
                  <Alert>
                    <Video className="h-4 w-4" />
                    <AlertDescription>
                      Crea reuniones de Teams automáticamente. Compatible con Office 365 Business.
                    </AlertDescription>
                  </Alert>
                  <Button onClick={() => setTeamsConnected(true)} className="w-full bg-purple-600 hover:bg-purple-700">
                    <Video className="mr-2 h-4 w-4" />
                    Conectar Microsoft Teams
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Conectado: usuario@empresa.com</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="teams-auto-create">Crear reuniones automáticamente</Label>
                      <Switch id="teams-auto-create" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="teams-lobby">Sala de espera habilitada</Label>
                      <Switch id="teams-lobby" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="teams-recording">Grabación automática</Label>
                      <Switch id="teams-recording" />
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setTeamsConnected(false)}>
                    Desconectar Teams
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Horarios de Disponibilidad</span>
              </CardTitle>
              <CardDescription>Configura tus horarios de trabajo y disponibilidad para citas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona horaria</Label>
                  <Select defaultValue="america/mexico_city">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america/mexico_city">América/Ciudad de México</SelectItem>
                      <SelectItem value="america/new_york">América/Nueva York</SelectItem>
                      <SelectItem value="europe/madrid">Europa/Madrid</SelectItem>
                      <SelectItem value="america/bogota">América/Bogotá</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buffer-time">Tiempo entre citas (minutos)</Label>
                  <Input id="buffer-time" type="number" defaultValue="15" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Horarios de trabajo</h3>
                {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((day, index) => (
                  <div key={day} className="flex items-center space-x-4">
                    <div className="w-20">
                      <Switch id={`day-${index}`} defaultChecked={index < 5} />
                      <Label htmlFor={`day-${index}`} className="ml-2">
                        {day}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input type="time" defaultValue="09:00" className="w-32" />
                      <span>a</span>
                      <Input type="time" defaultValue="18:00" className="w-32" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Configuración de citas</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="min-notice">Aviso mínimo (horas)</Label>
                    <Input id="min-notice" type="number" defaultValue="2" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-advance">Máximo con anticipación (días)</Label>
                    <Input id="max-advance" type="number" defaultValue="60" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-duration">Duración por defecto (minutos)</Label>
                    <Input id="default-duration" type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-daily">Máximo citas por día</Label>
                    <Input id="max-daily" type="number" defaultValue="8" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>Notificaciones de Calendario</span>
              </CardTitle>
              <CardDescription>Configura recordatorios y notificaciones para citas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Recordatorios para ti</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reminder-email">Email de recordatorio</Label>
                    <Switch id="reminder-email" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reminder-push">Notificación push</Label>
                    <Switch id="reminder-push" defaultChecked />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="reminder-time-1">Primer recordatorio</Label>
                      <Select defaultValue="24h">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15m">15 minutos antes</SelectItem>
                          <SelectItem value="1h">1 hora antes</SelectItem>
                          <SelectItem value="24h">24 horas antes</SelectItem>
                          <SelectItem value="48h">48 horas antes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reminder-time-2">Segundo recordatorio</Label>
                      <Select defaultValue="15m">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5m">5 minutos antes</SelectItem>
                          <SelectItem value="15m">15 minutos antes</SelectItem>
                          <SelectItem value="1h">1 hora antes</SelectItem>
                          <SelectItem value="none">Sin segundo recordatorio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Recordatorios para clientes</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="client-email-reminder">Email automático</Label>
                    <Switch id="client-email-reminder" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="client-sms-reminder">SMS automático</Label>
                    <Switch id="client-sms-reminder" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-reminder-time">Tiempo de recordatorio</Label>
                    <Select defaultValue="24h">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">1 hora antes</SelectItem>
                        <SelectItem value="24h">24 horas antes</SelectItem>
                        <SelectItem value="48h">48 horas antes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Confirmaciones</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="require-confirmation">Requerir confirmación del cliente</Label>
                    <Switch id="require-confirmation" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-cancel">Cancelar automáticamente si no confirma</Label>
                    <Switch id="auto-cancel" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmation-deadline">Plazo para confirmar (horas)</Label>
                    <Input id="confirmation-deadline" type="number" defaultValue="2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
