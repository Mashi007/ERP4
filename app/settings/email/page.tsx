"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Settings, CheckCircle, FolderSyncIcon as Sync, Shield, Clock, FileText } from "lucide-react"

export default function EmailSettingsPage() {
  const [gmailConnected, setGmailConnected] = useState(false)
  const [outlookConnected, setOutlookConnected] = useState(false)
  const [syncEnabled, setSyncEnabled] = useState(true)
  const [autoReply, setAutoReply] = useState(false)

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración de Email</h1>
          <p className="text-muted-foreground">
            Conecta y configura tus cuentas de email para sincronización automática
          </p>
        </div>
        <Button>
          <Sync className="mr-2 h-4 w-4" />
          Sincronizar Ahora
        </Button>
      </div>

      <Tabs defaultValue="accounts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="accounts">Cuentas</TabsTrigger>
          <TabsTrigger value="sync">Sincronización</TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
          <TabsTrigger value="automation">Automatización</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-6">
          {/* Gmail Connection */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Mail className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle>Gmail</CardTitle>
                    <CardDescription>Conectar cuenta de Gmail para sincronización</CardDescription>
                  </div>
                </div>
                <Badge variant={gmailConnected ? "default" : "secondary"}>
                  {gmailConnected ? "Conectado" : "Desconectado"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!gmailConnected ? (
                <div className="space-y-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Utilizamos OAuth 2.0 para una conexión segura. No almacenamos tu contraseña.
                    </AlertDescription>
                  </Alert>
                  <Button onClick={() => setGmailConnected(true)} className="w-full bg-red-600 hover:bg-red-700">
                    <Mail className="mr-2 h-4 w-4" />
                    Conectar con Gmail
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Conectado como: usuario@gmail.com</span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="gmail-sync">Sincronización automática</Label>
                      <Switch id="gmail-sync" checked={syncEnabled} onCheckedChange={setSyncEnabled} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gmail-frequency">Frecuencia (minutos)</Label>
                      <Input id="gmail-frequency" type="number" defaultValue="15" />
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setGmailConnected(false)}>
                    Desconectar Gmail
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Outlook Connection */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Microsoft Outlook</CardTitle>
                    <CardDescription>Conectar cuenta de Outlook/Office 365</CardDescription>
                  </div>
                </div>
                <Badge variant={outlookConnected ? "default" : "secondary"}>
                  {outlookConnected ? "Conectado" : "Desconectado"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!outlookConnected ? (
                <div className="space-y-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Conexión segura con Microsoft Graph API. Compatible con Office 365 y Outlook.com.
                    </AlertDescription>
                  </Alert>
                  <Button onClick={() => setOutlookConnected(true)} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Mail className="mr-2 h-4 w-4" />
                    Conectar con Outlook
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Conectado como: usuario@outlook.com</span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="outlook-sync">Sincronización automática</Label>
                      <Switch id="outlook-sync" checked={syncEnabled} onCheckedChange={setSyncEnabled} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="outlook-frequency">Frecuencia (minutos)</Label>
                      <Input id="outlook-frequency" type="number" defaultValue="15" />
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setOutlookConnected(false)}>
                    Desconectar Outlook
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SMTP/IMAP Manual Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Configuración Manual (SMTP/IMAP)</span>
              </CardTitle>
              <CardDescription>Para otros proveedores de email o configuración personalizada</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtp-server">Servidor SMTP</Label>
                  <Input id="smtp-server" placeholder="smtp.ejemplo.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">Puerto SMTP</Label>
                  <Input id="smtp-port" type="number" placeholder="587" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imap-server">Servidor IMAP</Label>
                  <Input id="imap-server" placeholder="imap.ejemplo.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imap-port">Puerto IMAP</Label>
                  <Input id="imap-port" type="number" placeholder="993" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-user">Usuario</Label>
                  <Input id="email-user" type="email" placeholder="usuario@ejemplo.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-password">Contraseña</Label>
                  <Input id="email-password" type="password" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="ssl-enabled" defaultChecked />
                <Label htmlFor="ssl-enabled">Usar SSL/TLS</Label>
              </div>
              <Button>Probar Conexión</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sync className="h-5 w-5" />
                <span>Configuración de Sincronización</span>
              </CardTitle>
              <CardDescription>Controla cómo y cuándo se sincronizan tus emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-medium">Sincronización Entrante</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sync-incoming">Emails entrantes</Label>
                      <Switch id="sync-incoming" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sync-attachments">Adjuntos</Label>
                      <Switch id="sync-attachments" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sync-days">Días hacia atrás</Label>
                      <Input id="sync-days" type="number" defaultValue="30" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Sincronización Saliente</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sync-outgoing">Emails enviados</Label>
                      <Switch id="sync-outgoing" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="track-opens">Rastrear aperturas</Label>
                      <Switch id="track-opens" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="track-clicks">Rastrear clics</Label>
                      <Switch id="track-clicks" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Asociación Automática</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-contact">Crear contactos automáticamente</Label>
                    <Switch id="auto-contact" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-deal">Asociar a negocios existentes</Label>
                    <Switch id="auto-deal" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Plantillas de Email</span>
              </CardTitle>
              <CardDescription>Crea y gestiona plantillas para emails frecuentes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Plantillas Disponibles</h3>
                <Button>Nueva Plantilla</Button>
              </div>

              <div className="space-y-3">
                {[
                  { name: "Bienvenida a nuevos clientes", usage: "45 usos" },
                  { name: "Seguimiento de propuesta", usage: "23 usos" },
                  { name: "Recordatorio de cita", usage: "67 usos" },
                  { name: "Agradecimiento post-venta", usage: "12 usos" },
                ].map((template, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-muted-foreground">{template.usage}</p>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        Usar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Automatización de Emails</span>
              </CardTitle>
              <CardDescription>Configura respuestas automáticas y secuencias de email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-reply">Respuesta automática</Label>
                    <p className="text-sm text-muted-foreground">Enviar respuesta automática a emails entrantes</p>
                  </div>
                  <Switch id="auto-reply" checked={autoReply} onCheckedChange={setAutoReply} />
                </div>

                {autoReply && (
                  <div className="space-y-2 pl-4 border-l-2 border-primary">
                    <Label htmlFor="auto-reply-message">Mensaje de respuesta automática</Label>
                    <textarea
                      id="auto-reply-message"
                      className="w-full p-3 border rounded-md"
                      rows={4}
                      placeholder="Gracias por tu email. Hemos recibido tu mensaje y te responderemos pronto..."
                    />
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Secuencias de Email</h3>
                <div className="space-y-3">
                  {[
                    { name: "Onboarding nuevos clientes", emails: "5 emails", status: "Activa" },
                    { name: "Seguimiento de propuestas", emails: "3 emails", status: "Pausada" },
                    { name: "Reactivación de clientes", emails: "4 emails", status: "Activa" },
                  ].map((sequence, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{sequence.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {sequence.emails} • {sequence.status}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        <Button variant="outline" size="sm">
                          {sequence.status === "Activa" ? "Pausar" : "Activar"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  <FileText className="mr-2 h-4 w-4" />
                  Crear Nueva Secuencia
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
