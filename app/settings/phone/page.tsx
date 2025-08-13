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
import { Phone, MessageSquare, Settings, CheckCircle, AlertCircle, Users, Shield, Zap } from "lucide-react"

export default function PhoneSettingsPage() {
  const [twilioConnected, setTwilioConnected] = useState(false)
  const [whatsappConnected, setWhatsappConnected] = useState(false)
  const [smsEnabled, setSmsEnabled] = useState(true)
  const [autoReply, setAutoReply] = useState(false)

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración de Teléfono y WhatsApp</h1>
          <p className="text-muted-foreground">
            Configura SMS, llamadas y WhatsApp Business para comunicación con clientes
          </p>
        </div>
        <Button>
          <Phone className="mr-2 h-4 w-4" />
          Probar Configuración
        </Button>
      </div>

      <Tabs defaultValue="sms" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sms">SMS y Llamadas</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp Business</TabsTrigger>
          <TabsTrigger value="automation">Automatización</TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
        </TabsList>

        <TabsContent value="sms" className="space-y-6">
          {/* Twilio Configuration */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Phone className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle>Twilio SMS y Llamadas</CardTitle>
                    <CardDescription>Configurar Twilio para SMS y llamadas telefónicas</CardDescription>
                  </div>
                </div>
                <Badge variant={twilioConnected ? "default" : "secondary"}>
                  {twilioConnected ? "Conectado" : "Desconectado"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!twilioConnected ? (
                <div className="space-y-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Twilio es un proveedor confiable para SMS y llamadas. Necesitarás una cuenta Twilio activa.
                    </AlertDescription>
                  </Alert>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="twilio-sid">Account SID</Label>
                      <Input id="twilio-sid" placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twilio-token">Auth Token</Label>
                      <Input id="twilio-token" type="password" placeholder="••••••••••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twilio-phone">Número de teléfono</Label>
                      <Input id="twilio-phone" placeholder="+1234567890" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twilio-webhook">Webhook URL</Label>
                      <Input id="twilio-webhook" placeholder="https://tu-dominio.com/webhook" />
                    </div>
                  </div>
                  <Button onClick={() => setTwilioConnected(true)} className="w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    Conectar Twilio
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Conectado: +52 55 1234 5678</span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="sms-enabled">SMS habilitado</Label>
                        <Switch id="sms-enabled" checked={smsEnabled} onCheckedChange={setSmsEnabled} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="calls-enabled">Llamadas habilitadas</Label>
                        <Switch id="calls-enabled" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="delivery-reports">Reportes de entrega</Label>
                        <Switch id="delivery-reports" defaultChecked />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sms-rate-limit">Límite de SMS por hora</Label>
                      <Input id="sms-rate-limit" type="number" defaultValue="100" />
                      <Label htmlFor="call-timeout">Timeout de llamadas (segundos)</Label>
                      <Input id="call-timeout" type="number" defaultValue="30" />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">Probar SMS</Button>
                    <Button variant="outline">Probar Llamada</Button>
                    <Button variant="outline" onClick={() => setTwilioConnected(false)}>
                      Desconectar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Phone Number Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Gestión de Números</span>
              </CardTitle>
              <CardDescription>Administra números de teléfono y configuraciones regionales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Números disponibles</h3>
                  <Button variant="outline" size="sm">
                    Comprar Número
                  </Button>
                </div>

                <div className="space-y-3">
                  {[
                    { number: "+52 55 1234 5678", type: "Principal", country: "México", status: "Activo" },
                    { number: "+1 555 123 4567", type: "Secundario", country: "Estados Unidos", status: "Activo" },
                  ].map((phone, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{phone.number}</p>
                        <p className="text-sm text-muted-foreground">
                          {phone.type} • {phone.country}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={phone.status === "Activo" ? "default" : "secondary"}>{phone.status}</Badge>
                        <Button variant="outline" size="sm">
                          Configurar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6">
          {/* WhatsApp Business API */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>WhatsApp Business API</CardTitle>
                    <CardDescription>Configurar WhatsApp Business para mensajería automática</CardDescription>
                  </div>
                </div>
                <Badge variant={whatsappConnected ? "default" : "secondary"}>
                  {whatsappConnected ? "Conectado" : "Desconectado"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!whatsappConnected ? (
                <div className="space-y-4">
                  <Alert>
                    <MessageSquare className="h-4 w-4" />
                    <AlertDescription>
                      WhatsApp Business API permite enviar mensajes automáticos y gestionar conversaciones. Requiere
                      aprobación de Meta.
                    </AlertDescription>
                  </Alert>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp-token">Access Token</Label>
                      <Input id="whatsapp-token" type="password" placeholder="••••••••••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp-phone-id">Phone Number ID</Label>
                      <Input id="whatsapp-phone-id" placeholder="123456789012345" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp-business-id">WhatsApp Business Account ID</Label>
                      <Input id="whatsapp-business-id" placeholder="123456789012345" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp-webhook">Webhook URL</Label>
                      <Input id="whatsapp-webhook" placeholder="https://tu-dominio.com/whatsapp-webhook" />
                    </div>
                  </div>
                  <Button onClick={() => setWhatsappConnected(true)} className="w-full bg-green-600 hover:bg-green-700">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Conectar WhatsApp Business
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Conectado: +52 55 1234 5678</span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="whatsapp-enabled">WhatsApp habilitado</Label>
                        <Switch id="whatsapp-enabled" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="read-receipts">Confirmaciones de lectura</Label>
                        <Switch id="read-receipts" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="typing-indicators">Indicadores de escritura</Label>
                        <Switch id="typing-indicators" defaultChecked />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message-rate-limit">Límite de mensajes por día</Label>
                      <Input id="message-rate-limit" type="number" defaultValue="1000" />
                      <Label htmlFor="business-hours">Horario de atención</Label>
                      <Select defaultValue="24h">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24h">24 horas</SelectItem>
                          <SelectItem value="business">Horario comercial</SelectItem>
                          <SelectItem value="custom">Personalizado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">Probar Mensaje</Button>
                    <Button variant="outline">Ver Estadísticas</Button>
                    <Button variant="outline" onClick={() => setWhatsappConnected(false)}>
                      Desconectar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* WhatsApp Business Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Perfil de Negocio</span>
              </CardTitle>
              <CardDescription>Configura la información de tu negocio en WhatsApp</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Nombre del negocio</Label>
                  <Input id="business-name" defaultValue="NormaPymes CRM" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-category">Categoría</Label>
                  <Select defaultValue="software">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="software">Software y Tecnología</SelectItem>
                      <SelectItem value="consulting">Consultoría</SelectItem>
                      <SelectItem value="services">Servicios Profesionales</SelectItem>
                      <SelectItem value="retail">Comercio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-description">Descripción</Label>
                  <textarea
                    id="business-description"
                    className="w-full p-3 border rounded-md"
                    rows={3}
                    placeholder="Describe tu negocio..."
                    defaultValue="Sistema CRM para pequeñas y medianas empresas"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-website">Sitio web</Label>
                  <Input id="business-website" placeholder="https://tu-sitio.com" />
                </div>
              </div>
              <Button>Actualizar Perfil</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Automatización de Mensajes</span>
              </CardTitle>
              <CardDescription>Configura respuestas automáticas y flujos de conversación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-reply-enabled">Respuesta automática</Label>
                    <p className="text-sm text-muted-foreground">Responder automáticamente a mensajes entrantes</p>
                  </div>
                  <Switch id="auto-reply-enabled" checked={autoReply} onCheckedChange={setAutoReply} />
                </div>

                {autoReply && (
                  <div className="space-y-4 pl-4 border-l-2 border-primary">
                    <div className="space-y-2">
                      <Label htmlFor="auto-reply-message">Mensaje de respuesta automática</Label>
                      <textarea
                        id="auto-reply-message"
                        className="w-full p-3 border rounded-md"
                        rows={4}
                        placeholder="¡Hola! Gracias por contactarnos. Te responderemos pronto..."
                        defaultValue="¡Hola! 👋 Gracias por contactar a NormaPymes. Hemos recibido tu mensaje y te responderemos en breve durante nuestro horario de atención."
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="auto-reply-delay">Retraso (segundos)</Label>
                        <Input id="auto-reply-delay" type="number" defaultValue="5" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="auto-reply-frequency">Frecuencia</Label>
                        <Select defaultValue="once">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="once">Solo una vez por conversación</SelectItem>
                            <SelectItem value="daily">Una vez por día</SelectItem>
                            <SelectItem value="always">Siempre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Horarios de atención automática</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="business-hours-start">Hora de inicio</Label>
                    <Input id="business-hours-start" type="time" defaultValue="09:00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-hours-end">Hora de fin</Label>
                    <Input id="business-hours-end" type="time" defaultValue="18:00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="out-of-hours-message">Mensaje fuera de horario</Label>
                  <textarea
                    id="out-of-hours-message"
                    className="w-full p-3 border rounded-md"
                    rows={3}
                    placeholder="Mensaje para mostrar fuera del horario de atención..."
                    defaultValue="Gracias por tu mensaje. Nuestro horario de atención es de 9:00 AM a 6:00 PM. Te responderemos en cuanto estemos disponibles."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Palabras clave automáticas</h3>
                <div className="space-y-3">
                  {[
                    {
                      keyword: "precio",
                      response: "Nuestros precios varían según el plan. ¿Te gustaría agendar una llamada?",
                    },
                    { keyword: "demo", response: "¡Perfecto! Te puedo agendar una demo. ¿Cuándo te viene mejor?" },
                    { keyword: "soporte", response: "Te conectaré con nuestro equipo de soporte técnico." },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">"{item.keyword}"</p>
                        <p className="text-sm text-muted-foreground">{item.response}</p>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        <Button variant="outline" size="sm">
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Agregar Palabra Clave
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Plantillas de Mensajes</span>
              </CardTitle>
              <CardDescription>Crea y gestiona plantillas para WhatsApp y SMS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Plantillas Aprobadas</h3>
                <Button>Nueva Plantilla</Button>
              </div>

              <div className="space-y-3">
                {[
                  {
                    name: "Confirmación de cita",
                    type: "WhatsApp",
                    status: "Aprobada",
                    usage: "156 usos",
                    preview: "Hola {{nombre}}, tu cita está confirmada para el {{fecha}} a las {{hora}}.",
                  },
                  {
                    name: "Recordatorio de pago",
                    type: "SMS",
                    status: "Aprobada",
                    usage: "89 usos",
                    preview: "Recordatorio: Tu factura {{numero}} vence el {{fecha}}. Paga en: {{link}}",
                  },
                  {
                    name: "Bienvenida nuevo cliente",
                    type: "WhatsApp",
                    status: "Pendiente",
                    usage: "0 usos",
                    preview: "¡Bienvenido {{nombre}}! Gracias por elegir NormaPymes. Tu cuenta está lista.",
                  },
                ].map((template, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{template.name}</h4>
                        <Badge variant="outline">{template.type}</Badge>
                        <Badge variant={template.status === "Aprobada" ? "default" : "secondary"}>
                          {template.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.usage}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{template.preview}</p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        Usar
                      </Button>
                      <Button variant="outline" size="sm">
                        Duplicar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Las plantillas de WhatsApp requieren aprobación de Meta antes de poder usarse. El proceso puede tomar
                  24-48 horas.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
