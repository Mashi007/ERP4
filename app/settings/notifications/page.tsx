"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, Mail, MessageSquare, Phone, Settings, Clock, Users, CheckCircle } from "lucide-react"

export default function NotificationsSettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [digestEnabled, setDigestEnabled] = useState(true)

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración de Notificaciones</h1>
          <p className="text-muted-foreground">Configura cómo y cuándo recibir notificaciones del sistema</p>
        </div>
        <Button>
          <Bell className="mr-2 h-4 w-4" />
          Probar Notificaciones
        </Button>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal">Notificaciones Personales</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="digest">Resúmenes</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Notificaciones por Email</CardTitle>
                    <CardDescription>Recibe alertas importantes por correo electrónico</CardDescription>
                  </div>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
            </CardHeader>
            {emailNotifications && (
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-medium">Actividades de Ventas</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="new-lead">Nuevo lead</Label>
                        <Switch id="new-lead" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="deal-won">Negocio ganado</Label>
                        <Switch id="deal-won" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="deal-lost">Negocio perdido</Label>
                        <Switch id="deal-lost" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="stage-change">Cambio de etapa</Label>
                        <Switch id="stage-change" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Comunicaciones</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="new-email">Nuevo email</Label>
                        <Switch id="new-email" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="missed-call">Llamada perdida</Label>
                        <Switch id="missed-call" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="whatsapp-message">Mensaje WhatsApp</Label>
                        <Switch id="whatsapp-message" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="appointment-reminder">Recordatorio de cita</Label>
                        <Switch id="appointment-reminder" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-frequency">Frecuencia de notificaciones</Label>
                  <Select defaultValue="immediate">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Inmediata</SelectItem>
                      <SelectItem value="hourly">Cada hora</SelectItem>
                      <SelectItem value="daily">Diaria</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            )}
          </Card>

          {/* SMS Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>Notificaciones por SMS</CardTitle>
                    <CardDescription>Alertas urgentes por mensaje de texto</CardDescription>
                  </div>
                </div>
                <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
              </div>
            </CardHeader>
            {smsNotifications && (
              <CardContent className="space-y-4">
                <Alert>
                  <Phone className="h-4 w-4" />
                  <AlertDescription>
                    Las notificaciones SMS solo se envían para eventos críticos. Se aplicarán tarifas de SMS.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="sms-phone">Número de teléfono</Label>
                  <Input id="sms-phone" placeholder="+52 55 1234 5678" />
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Eventos críticos</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-system-down">Sistema inactivo</Label>
                      <Switch id="sms-system-down" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-urgent-lead">Lead urgente</Label>
                      <Switch id="sms-urgent-lead" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-payment-failed">Pago fallido</Label>
                      <Switch id="sms-payment-failed" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Push Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Bell className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Notificaciones Push</CardTitle>
                    <CardDescription>Alertas en tiempo real en tu navegador</CardDescription>
                  </div>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>
            </CardHeader>
            {pushNotifications && (
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-new-activity">Nueva actividad</Label>
                      <Switch id="push-new-activity" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-task-due">Tarea vencida</Label>
                      <Switch id="push-task-due" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-meeting-soon">Reunión próxima</Label>
                      <Switch id="push-meeting-soon" defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="push-quiet-hours">Horario silencioso</Label>
                    <div className="flex items-center space-x-2">
                      <Input type="time" defaultValue="22:00" className="w-24" />
                      <span>a</span>
                      <Input type="time" defaultValue="08:00" className="w-24" />
                    </div>
                  </div>
                </div>

                <Button variant="outline">
                  <Bell className="mr-2 h-4 w-4" />
                  Probar Notificación Push
                </Button>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Notificaciones del Sistema</span>
              </CardTitle>
              <CardDescription>Alertas sobre el estado y funcionamiento del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Estado del Sistema</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="system-maintenance">Mantenimiento programado</Label>
                      <Switch id="system-maintenance" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="system-updates">Actualizaciones disponibles</Label>
                      <Switch id="system-updates" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="system-errors">Errores del sistema</Label>
                      <Switch id="system-errors" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="backup-status">Estado de respaldos</Label>
                      <Switch id="backup-status" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Seguridad</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-attempts">Intentos de acceso fallidos</Label>
                      <Switch id="login-attempts" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="new-device">Acceso desde nuevo dispositivo</Label>
                      <Switch id="new-device" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-change">Cambio de contraseña</Label>
                      <Switch id="password-change" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="suspicious-activity">Actividad sospechosa</Label>
                      <Switch id="suspicious-activity" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Límites y Cuotas</h4>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="storage-limit">Límite de almacenamiento (80%)</Label>
                    <Switch id="storage-limit" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="api-limit">Límite de API (90%)</Label>
                    <Switch id="api-limit" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-limit">Límite de emails (80%)</Label>
                    <Switch id="email-limit" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-limit">Límite de SMS (90%)</Label>
                    <Switch id="sms-limit" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Notificaciones a Clientes</span>
              </CardTitle>
              <CardDescription>Configura las notificaciones automáticas que reciben tus clientes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Confirmaciones Automáticas</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="client-appointment-confirm">Confirmación de cita</Label>
                      <Switch id="client-appointment-confirm" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="client-quote-sent">Cotización enviada</Label>
                      <Switch id="client-quote-sent" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="client-invoice-sent">Factura enviada</Label>
                      <Switch id="client-invoice-sent" defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="client-payment-received">Pago recibido</Label>
                      <Switch id="client-payment-received" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="client-project-update">Actualización de proyecto</Label>
                      <Switch id="client-project-update" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="client-support-ticket">Ticket de soporte</Label>
                      <Switch id="client-support-ticket" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Recordatorios</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="client-appointment-reminder">Recordatorio de cita</Label>
                      <p className="text-sm text-muted-foreground">24 horas antes</p>
                    </div>
                    <Switch id="client-appointment-reminder" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="client-payment-reminder">Recordatorio de pago</Label>
                      <p className="text-sm text-muted-foreground">3 días antes del vencimiento</p>
                    </div>
                    <Switch id="client-payment-reminder" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="client-follow-up">Seguimiento post-venta</Label>
                      <p className="text-sm text-muted-foreground">7 días después</p>
                    </div>
                    <Switch id="client-follow-up" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Canales de Notificación</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="client-email-urgent" defaultChecked />
                        <Label htmlFor="client-email-urgent" className="text-sm">
                          Urgentes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="client-email-normal" defaultChecked />
                        <Label htmlFor="client-email-normal" className="text-sm">
                          Normales
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>SMS</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="client-sms-urgent" defaultChecked />
                        <Label htmlFor="client-sms-urgent" className="text-sm">
                          Urgentes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="client-sms-normal" />
                        <Label htmlFor="client-sms-normal" className="text-sm">
                          Normales
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>WhatsApp</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="client-whatsapp-urgent" />
                        <Label htmlFor="client-whatsapp-urgent" className="text-sm">
                          Urgentes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="client-whatsapp-normal" />
                        <Label htmlFor="client-whatsapp-normal" className="text-sm">
                          Normales
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="digest" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle>Resúmenes Periódicos</CardTitle>
                    <CardDescription>Recibe resúmenes de actividad del CRM</CardDescription>
                  </div>
                </div>
                <Switch checked={digestEnabled} onCheckedChange={setDigestEnabled} />
              </div>
            </CardHeader>
            {digestEnabled && (
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-medium">Resumen Diario</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="daily-digest">Activar resumen diario</Label>
                        <Switch id="daily-digest" defaultChecked />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="daily-time">Hora de envío</Label>
                        <Input id="daily-time" type="time" defaultValue="08:00" />
                      </div>
                      <div className="space-y-2">
                        <Label>Incluir en el resumen:</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Switch id="daily-new-leads" defaultChecked />
                            <Label htmlFor="daily-new-leads" className="text-sm">
                              Nuevos leads
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="daily-deals-won" defaultChecked />
                            <Label htmlFor="daily-deals-won" className="text-sm">
                              Negocios ganados
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="daily-appointments" defaultChecked />
                            <Label htmlFor="daily-appointments" className="text-sm">
                              Citas del día
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="daily-tasks" defaultChecked />
                            <Label htmlFor="daily-tasks" className="text-sm">
                              Tareas pendientes
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Resumen Semanal</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="weekly-digest">Activar resumen semanal</Label>
                        <Switch id="weekly-digest" defaultChecked />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weekly-day">Día de envío</Label>
                        <Select defaultValue="monday">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monday">Lunes</SelectItem>
                            <SelectItem value="tuesday">Martes</SelectItem>
                            <SelectItem value="wednesday">Miércoles</SelectItem>
                            <SelectItem value="thursday">Jueves</SelectItem>
                            <SelectItem value="friday">Viernes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Incluir en el resumen:</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Switch id="weekly-performance" defaultChecked />
                            <Label htmlFor="weekly-performance" className="text-sm">
                              Rendimiento de ventas
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="weekly-pipeline" defaultChecked />
                            <Label htmlFor="weekly-pipeline" className="text-sm">
                              Estado del pipeline
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="weekly-goals" defaultChecked />
                            <Label htmlFor="weekly-goals" className="text-sm">
                              Progreso de metas
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="weekly-activities" />
                            <Label htmlFor="weekly-activities" className="text-sm">
                              Resumen de actividades
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Resumen Mensual</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="monthly-digest">Activar resumen mensual</Label>
                      <Switch id="monthly-digest" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthly-day">Día del mes</Label>
                      <Select defaultValue="1">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Día 1</SelectItem>
                          <SelectItem value="15">Día 15</SelectItem>
                          <SelectItem value="last">Último día</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Los resúmenes se envían automáticamente por email. Puedes ver ejemplos en la sección de plantillas.
                  </AlertDescription>
                </Alert>
              </CardContent>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
