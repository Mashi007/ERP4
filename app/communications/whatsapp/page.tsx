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
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  MessageSquare,
  Smartphone,
  Settings,
  CheckCircle,
  AlertCircle,
  Users,
  Shield,
  QrCode,
  Link,
  MessageCircle,
  Clock,
  Bot,
} from "lucide-react"
import { WhatsappPairDialog } from "@/components/communications/whatsapp-pair-dialog"
import { WhatsAppChatLink } from "@/components/communications/whatsapp-chat-link"

export default function WhatsAppConfigurationPage() {
  const [whatsappConnected, setWhatsappConnected] = useState(false)
  const [deviceLinked, setDeviceLinked] = useState(false)
  const [businessApiEnabled, setBusinessApiEnabled] = useState(false)
  const [autoReply, setAutoReply] = useState(false)
  const [showPairDialog, setShowPairDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [businessConfig, setBusinessConfig] = useState({
    accessToken: "",
    phoneNumberId: "",
    businessAccountId: "",
    webhookUrl: "",
    verifyToken: "",
  })

  const [businessProfile, setBusinessProfile] = useState({
    name: "NormaPymes CRM",
    category: "software",
    description: "Sistema CRM para pequeñas y medianas empresas",
    website: "",
    email: "",
    address: "",
  })

  const [chatLinkConfig, setChatLinkConfig] = useState({
    phone: "593983000700",
    defaultMessage: "Hola, vi su sitio web y quisiera más información.",
    welcomeMessage: "¡Hola! 👋 Gracias por contactarnos. ¿En qué podemos ayudarte?",
  })

  const handleConnectBusinessApi = async () => {
    setIsLoading(true)
    try {
      // Simulate API connection
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setBusinessApiEnabled(true)
      setWhatsappConnected(true)
      toast.success("WhatsApp Business API conectado exitosamente")
    } catch (error) {
      toast.error("Error al conectar WhatsApp Business API")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLinkDevice = () => {
    setShowPairDialog(true)
  }

  const handleSaveConfiguration = async () => {
    setIsLoading(true)
    try {
      // Simulate saving configuration
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Configuración guardada exitosamente")
    } catch (error) {
      toast.error("Error al guardar configuración")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-green-600" />
            Vincular WhatsApp
          </h1>
          <p className="text-muted-foreground">Configura WhatsApp Business para comunicación automática con clientes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleLinkDevice}>
            <QrCode className="mr-2 h-4 w-4" />
            Vincular Dispositivo
          </Button>
          <Button onClick={handleSaveConfiguration} disabled={isLoading}>
            <Settings className="mr-2 h-4 w-4" />
            Guardar Configuración
          </Button>
        </div>
      </div>

      {/* Connection Status Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${businessApiEnabled ? "bg-green-100" : "bg-gray-100"}`}>
                  <MessageCircle className={`h-6 w-6 ${businessApiEnabled ? "text-green-600" : "text-gray-400"}`} />
                </div>
                <div>
                  <p className="font-medium">Business API</p>
                  <p className="text-sm text-muted-foreground">Mensajería automática</p>
                </div>
              </div>
              <Badge variant={businessApiEnabled ? "default" : "secondary"}>
                {businessApiEnabled ? "Conectado" : "Desconectado"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${deviceLinked ? "bg-blue-100" : "bg-gray-100"}`}>
                  <Smartphone className={`h-6 w-6 ${deviceLinked ? "text-blue-600" : "text-gray-400"}`} />
                </div>
                <div>
                  <p className="font-medium">Dispositivo</p>
                  <p className="text-sm text-muted-foreground">WhatsApp Web</p>
                </div>
              </div>
              <Badge variant={deviceLinked ? "default" : "secondary"}>
                {deviceLinked ? "Vinculado" : "No vinculado"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Link className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Chat Links</p>
                  <p className="text-sm text-muted-foreground">Enlaces directos</p>
                </div>
              </div>
              <Badge variant="default">Activo</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="business-api" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="business-api">Business API</TabsTrigger>
          <TabsTrigger value="device-linking">Vincular Dispositivo</TabsTrigger>
          <TabsTrigger value="chat-links">Enlaces de Chat</TabsTrigger>
          <TabsTrigger value="automation">Automatización</TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
        </TabsList>

        {/* Business API Configuration */}
        <TabsContent value="business-api" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>WhatsApp Business API</CardTitle>
                    <CardDescription>Configurar API oficial de WhatsApp Business</CardDescription>
                  </div>
                </div>
                <Badge variant={businessApiEnabled ? "default" : "secondary"}>
                  {businessApiEnabled ? "Conectado" : "Desconectado"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!businessApiEnabled ? (
                <div className="space-y-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      WhatsApp Business API permite enviar mensajes automáticos y gestionar conversaciones. Requiere
                      aprobación de Meta y una cuenta Business verificada.
                    </AlertDescription>
                  </Alert>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="access-token">Access Token</Label>
                      <Input
                        id="access-token"
                        type="password"
                        placeholder="••••••••••••••••"
                        value={businessConfig.accessToken}
                        onChange={(e) => setBusinessConfig((prev) => ({ ...prev, accessToken: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone-number-id">Phone Number ID</Label>
                      <Input
                        id="phone-number-id"
                        placeholder="123456789012345"
                        value={businessConfig.phoneNumberId}
                        onChange={(e) => setBusinessConfig((prev) => ({ ...prev, phoneNumberId: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-account-id">Business Account ID</Label>
                      <Input
                        id="business-account-id"
                        placeholder="123456789012345"
                        value={businessConfig.businessAccountId}
                        onChange={(e) => setBusinessConfig((prev) => ({ ...prev, businessAccountId: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="webhook-url">Webhook URL</Label>
                      <Input
                        id="webhook-url"
                        placeholder="https://tu-dominio.com/whatsapp-webhook"
                        value={businessConfig.webhookUrl}
                        onChange={(e) => setBusinessConfig((prev) => ({ ...prev, webhookUrl: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleConnectBusinessApi}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {isLoading ? "Conectando..." : "Conectar WhatsApp Business API"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Conectado: +52 55 1234 5678</span>
                  </div>

                  {/* Business Profile Configuration */}
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Perfil de Negocio
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="business-name">Nombre del negocio</Label>
                        <Input
                          id="business-name"
                          value={businessProfile.name}
                          onChange={(e) => setBusinessProfile((prev) => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="business-category">Categoría</Label>
                        <Select
                          value={businessProfile.category}
                          onValueChange={(value) => setBusinessProfile((prev) => ({ ...prev, category: value }))}
                        >
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
                          value={businessProfile.description}
                          onChange={(e) => setBusinessProfile((prev) => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="business-website">Sitio web</Label>
                        <Input
                          id="business-website"
                          placeholder="https://tu-sitio.com"
                          value={businessProfile.website}
                          onChange={(e) => setBusinessProfile((prev) => ({ ...prev, website: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline">Probar Mensaje</Button>
                    <Button variant="outline">Ver Estadísticas</Button>
                    <Button variant="outline" onClick={() => setBusinessApiEnabled(false)}>
                      Desconectar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Device Linking */}
        <TabsContent value="device-linking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <span>Vincular Dispositivo WhatsApp</span>
              </CardTitle>
              <CardDescription>Conecta tu dispositivo móvil para usar WhatsApp Web en el CRM</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!deviceLinked ? (
                <div className="space-y-4">
                  <Alert>
                    <QrCode className="h-4 w-4" />
                    <AlertDescription>
                      Para vincular tu dispositivo, escanea el código QR desde WhatsApp en tu teléfono. Ve a WhatsApp →
                      Dispositivos vinculados → Vincular dispositivo.
                    </AlertDescription>
                  </Alert>

                  <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg bg-muted/50">
                    <QrCode className="h-24 w-24 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">
                      Haz clic en "Generar Código QR" para vincular tu dispositivo
                    </p>
                    <Button onClick={handleLinkDevice} size="lg">
                      <QrCode className="mr-2 h-4 w-4" />
                      Generar Código QR
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Instrucciones:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Abre WhatsApp en tu teléfono</li>
                      <li>Ve a Configuración → Dispositivos vinculados</li>
                      <li>Toca "Vincular dispositivo"</li>
                      <li>Escanea el código QR que aparecerá</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Dispositivo vinculado exitosamente</span>
                  </div>

                  <div className="p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">iPhone de Juan</p>
                        <p className="text-sm text-muted-foreground">Última actividad: hace 2 minutos</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setDeviceLinked(false)}>
                        Desvincular
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chat Links */}
        <TabsContent value="chat-links" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Link className="h-5 w-5" />
                <span>Enlaces de Chat Directo</span>
              </CardTitle>
              <CardDescription>
                Configura enlaces para que los clientes inicien conversaciones directamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="chat-phone">Número de teléfono</Label>
                  <Input
                    id="chat-phone"
                    placeholder="+593983000700"
                    value={chatLinkConfig.phone}
                    onChange={(e) => setChatLinkConfig((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-message">Mensaje predeterminado</Label>
                  <Input
                    id="default-message"
                    placeholder="Hola, vi su sitio web..."
                    value={chatLinkConfig.defaultMessage}
                    onChange={(e) => setChatLinkConfig((prev) => ({ ...prev, defaultMessage: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="welcome-message">Mensaje de bienvenida automático</Label>
                <textarea
                  id="welcome-message"
                  className="w-full p-3 border rounded-md"
                  rows={3}
                  value={chatLinkConfig.welcomeMessage}
                  onChange={(e) => setChatLinkConfig((prev) => ({ ...prev, welcomeMessage: e.target.value }))}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Vista previa del enlace:</h4>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <WhatsAppChatLink phone={chatLinkConfig.phone} message={chatLinkConfig.defaultMessage} />
                </div>

                <div className="space-y-2">
                  <Label>URL generada:</Label>
                  <div className="p-2 bg-muted rounded text-sm font-mono break-all">
                    {`https://wa.me/${encodeURIComponent(chatLinkConfig.phone)}?text=${encodeURIComponent(chatLinkConfig.defaultMessage)}`}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automation */}
        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5" />
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

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horarios de atención
                </h3>
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
                    defaultValue="Gracias por tu mensaje. Nuestro horario de atención es de 9:00 AM a 6:00 PM. Te responderemos en cuanto estemos disponibles."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Plantillas de Mensajes</span>
              </CardTitle>
              <CardDescription>Gestiona plantillas aprobadas para WhatsApp Business</CardDescription>
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
                    status: "Aprobada",
                    usage: "156 usos",
                    preview: "Hola {{nombre}}, tu cita está confirmada para el {{fecha}} a las {{hora}}.",
                  },
                  {
                    name: "Recordatorio de pago",
                    status: "Aprobada",
                    usage: "89 usos",
                    preview: "Recordatorio: Tu factura {{numero}} vence el {{fecha}}. Paga en: {{link}}",
                  },
                  {
                    name: "Bienvenida nuevo cliente",
                    status: "Pendiente",
                    usage: "0 usos",
                    preview: "¡Bienvenido {{nombre}}! Gracias por elegir NormaPymes. Tu cuenta está lista.",
                  },
                ].map((template, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{template.name}</h4>
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

      {/* WhatsApp Pairing Dialog */}
      <WhatsappPairDialog
        open={showPairDialog}
        onOpenChange={setShowPairDialog}
        seed={crypto.randomUUID()}
        clientId="whatsapp-crm"
      />
    </div>
  )
}
