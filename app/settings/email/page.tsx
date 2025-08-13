"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Mail,
  Settings,
  CheckCircle,
  FolderSyncIcon as Sync,
  Shield,
  Clock,
  FileText,
  Plus,
  Edit,
  Play,
  Pause,
  Trash2,
  Send,
} from "lucide-react"

interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  usage: number
}

interface EmailSequence {
  id: string
  name: string
  emails: number
  status: "Activa" | "Pausada"
  description: string
}

export default function EmailSettingsPage() {
  const [gmailConnected, setGmailConnected] = useState(false)
  const [outlookConnected, setOutlookConnected] = useState(false)
  const [syncEnabled, setSyncEnabled] = useState(true)
  const [autoReply, setAutoReply] = useState(false)
  const [smtpConfigured, setSmtpConfigured] = useState(false)
  const [isSync, setIsSync] = useState(false)
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: "1",
      name: "Bienvenida a nuevos clientes",
      subject: "¡Bienvenido a nuestra empresa!",
      content: "Estimado cliente,\n\nNos complace darte la bienvenida...",
      usage: 45,
    },
    {
      id: "2",
      name: "Seguimiento de propuesta",
      subject: "Seguimiento de su propuesta",
      content: "Estimado cliente,\n\nEsperamos que esté bien. Nos ponemos en contacto...",
      usage: 23,
    },
    {
      id: "3",
      name: "Recordatorio de cita",
      subject: "Recordatorio: Cita programada",
      content: "Estimado cliente,\n\nLe recordamos su cita programada...",
      usage: 67,
    },
    {
      id: "4",
      name: "Agradecimiento post-venta",
      subject: "Gracias por su compra",
      content: "Estimado cliente,\n\nGracias por confiar en nosotros...",
      usage: 12,
    },
  ])
  const [sequences, setSequences] = useState<EmailSequence[]>([
    {
      id: "1",
      name: "Onboarding nuevos clientes",
      emails: 5,
      status: "Activa",
      description: "Secuencia de bienvenida para nuevos clientes",
    },
    {
      id: "2",
      name: "Seguimiento de propuestas",
      emails: 3,
      status: "Pausada",
      description: "Seguimiento automático de propuestas enviadas",
    },
    {
      id: "3",
      name: "Reactivación de clientes",
      emails: 4,
      status: "Activa",
      description: "Reactivar clientes inactivos",
    },
  ])

  const [templateDialog, setTemplateDialog] = useState(false)
  const [sequenceDialog, setSequenceDialog] = useState(false)
  const [sequenceEditDialog, setSequenceEditDialog] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [editingSequence, setEditingSequence] = useState<EmailSequence | null>(null)
  const [newTemplate, setNewTemplate] = useState({ name: "", subject: "", content: "" })
  const [newSequence, setNewSequence] = useState({ name: "", description: "", emails: 1 })
  const [autoReplyRules, setAutoReplyRules] = useState([
    { id: "1", condition: "Nuevos contactos", message: "Gracias por contactarnos. Te responderemos pronto." },
    { id: "2", condition: "Fuera de horario", message: "Recibimos tu mensaje fuera del horario laboral." },
  ])

  useEffect(() => {
    const loadConfiguration = () => {
      setGmailConnected(localStorage.getItem("gmail_connected") === "true")
      setOutlookConnected(localStorage.getItem("outlook_connected") === "true")
      setSmtpConfigured(localStorage.getItem("smtp_configured") === "true")
    }

    loadConfiguration()
  }, [])

  const handleGmailConnection = (connected: boolean) => {
    setGmailConnected(connected)
    localStorage.setItem("gmail_connected", connected.toString())
    window.dispatchEvent(new Event("storage"))
  }

  const handleOutlookConnection = (connected: boolean) => {
    setOutlookConnected(connected)
    localStorage.setItem("outlook_connected", connected.toString())
    window.dispatchEvent(new Event("storage"))
  }

  const handleSMTPTest = () => {
    const smtpServer = (document.getElementById("smtp-server") as HTMLInputElement)?.value
    const smtpPort = (document.getElementById("smtp-port") as HTMLInputElement)?.value
    const emailUser = (document.getElementById("email-user") as HTMLInputElement)?.value

    if (smtpServer && smtpPort && emailUser) {
      setSmtpConfigured(true)
      localStorage.setItem("smtp_configured", "true")
      window.dispatchEvent(new Event("storage"))
      alert("Conexión SMTP configurada correctamente")
    } else {
      alert("Por favor, complete todos los campos requeridos")
    }
  }

  const handleSyncNow = async () => {
    setIsSync(true)
    try {
      // Simulate sync process
      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert("Sincronización completada exitosamente")
    } catch (error) {
      alert("Error durante la sincronización")
    } finally {
      setIsSync(false)
    }
  }

  const handleCreateTemplate = () => {
    if (newTemplate.name && newTemplate.subject && newTemplate.content) {
      const template: EmailTemplate = {
        id: Date.now().toString(),
        name: newTemplate.name,
        subject: newTemplate.subject,
        content: newTemplate.content,
        usage: 0,
      }
      setTemplates([...templates, template])
      setNewTemplate({ name: "", subject: "", content: "" })
      setTemplateDialog(false)
      alert("Plantilla creada exitosamente")
    }
  }

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template)
    setNewTemplate({ name: template.name, subject: template.subject, content: template.content })
    setTemplateDialog(true)
  }

  const handleUpdateTemplate = () => {
    if (editingTemplate && newTemplate.name && newTemplate.subject && newTemplate.content) {
      setTemplates(
        templates.map((t) =>
          t.id === editingTemplate.id
            ? { ...t, name: newTemplate.name, subject: newTemplate.subject, content: newTemplate.content }
            : t,
        ),
      )
      setEditingTemplate(null)
      setNewTemplate({ name: "", subject: "", content: "" })
      setTemplateDialog(false)
      alert("Plantilla actualizada exitosamente")
    }
  }

  const handleUseTemplate = (template: EmailTemplate) => {
    setTemplates(templates.map((t) => (t.id === template.id ? { ...t, usage: t.usage + 1 } : t)))
    alert(`Usando plantilla: ${template.name}`)
  }

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta plantilla?")) {
      setTemplates(templates.filter((t) => t.id !== templateId))
      alert("Plantilla eliminada")
    }
  }

  const handleCreateSequence = () => {
    if (newSequence.name && newSequence.description) {
      const sequence: EmailSequence = {
        id: Date.now().toString(),
        name: newSequence.name,
        emails: newSequence.emails,
        status: "Pausada",
        description: newSequence.description,
      }
      setSequences([...sequences, sequence])
      setNewSequence({ name: "", description: "", emails: 1 })
      setSequenceDialog(false)
      alert("Secuencia creada exitosamente")
    }
  }

  const handleEditSequence = (sequence: EmailSequence) => {
    setEditingSequence(sequence)
    setNewSequence({
      name: sequence.name,
      description: sequence.description,
      emails: sequence.emails,
    })
    setSequenceEditDialog(true)
  }

  const handleUpdateSequence = () => {
    if (editingSequence && newSequence.name && newSequence.description) {
      setSequences(
        sequences.map((s) =>
          s.id === editingSequence.id
            ? { ...s, name: newSequence.name, description: newSequence.description, emails: newSequence.emails }
            : s,
        ),
      )
      setEditingSequence(null)
      setNewSequence({ name: "", description: "", emails: 1 })
      setSequenceEditDialog(false)
      alert("Secuencia actualizada exitosamente")
    }
  }

  const handleToggleSequence = (sequenceId: string) => {
    setSequences(
      sequences.map((s) => (s.id === sequenceId ? { ...s, status: s.status === "Activa" ? "Pausada" : "Activa" } : s)),
    )
  }

  const handleDeleteSequence = (sequenceId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta secuencia?")) {
      setSequences(sequences.filter((s) => s.id !== sequenceId))
      alert("Secuencia eliminada")
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración de Email</h1>
          <p className="text-muted-foreground">
            Conecta y configura tus cuentas de email para sincronización automática
          </p>
        </div>
        <Button onClick={handleSyncNow} disabled={isSync}>
          <Sync className={`mr-2 h-4 w-4 ${isSync ? "animate-spin" : ""}`} />
          {isSync ? "Sincronizando..." : "Sincronizar Ahora"}
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
                  <Button onClick={() => handleGmailConnection(true)} className="w-full bg-red-600 hover:bg-red-700">
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
                  <Button variant="outline" onClick={() => handleGmailConnection(false)}>
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
                  <Button
                    onClick={() => handleOutlookConnection(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
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
                  <Button variant="outline" onClick={() => handleOutlookConnection(false)}>
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
              {smtpConfigured && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">SMTP configurado correctamente</span>
                  </div>
                </div>
              )}

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
              <Button onClick={handleSMTPTest}>Probar Conexión</Button>
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
                <Dialog open={templateDialog} onOpenChange={setTemplateDialog}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setEditingTemplate(null)
                        setNewTemplate({ name: "", subject: "", content: "" })
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Nueva Plantilla
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingTemplate ? "Editar Plantilla" : "Nueva Plantilla"}</DialogTitle>
                      <DialogDescription>
                        {editingTemplate
                          ? "Modifica los detalles de la plantilla"
                          : "Crea una nueva plantilla de email"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="template-name">Nombre de la plantilla</Label>
                        <Input
                          id="template-name"
                          value={newTemplate.name}
                          onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                          placeholder="Ej: Bienvenida a nuevos clientes"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="template-subject">Asunto del email</Label>
                        <Input
                          id="template-subject"
                          value={newTemplate.subject}
                          onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                          placeholder="Ej: ¡Bienvenido a nuestra empresa!"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="template-content">Contenido del email</Label>
                        <Textarea
                          id="template-content"
                          value={newTemplate.content}
                          onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                          placeholder="Escribe el contenido de tu email aquí..."
                          rows={8}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setTemplateDialog(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}>
                        {editingTemplate ? "Actualizar" : "Crear"} Plantilla
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {templates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-muted-foreground">{template.usage} usos</p>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)}>
                        <Edit className="mr-1 h-3 w-3" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleUseTemplate(template)}>
                        <Send className="mr-1 h-3 w-3" />
                        Usar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteTemplate(template.id)}>
                        <Trash2 className="mr-1 h-3 w-3" />
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
              {/* Enhanced Auto-Reply Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-reply">Respuesta automática</Label>
                    <p className="text-sm text-muted-foreground">Enviar respuesta automática a emails entrantes</p>
                  </div>
                  <Switch id="auto-reply" checked={autoReply} onCheckedChange={setAutoReply} />
                </div>

                {autoReply && (
                  <div className="space-y-4 pl-4 border-l-2 border-primary">
                    <div className="space-y-2">
                      <Label htmlFor="auto-reply-message">Mensaje de respuesta automática</Label>
                      <Textarea
                        id="auto-reply-message"
                        className="w-full p-3 border rounded-md"
                        rows={4}
                        placeholder="Gracias por tu email. Hemos recibido tu mensaje y te responderemos pronto..."
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Reglas de respuesta automática</Label>
                      {autoReplyRules.map((rule) => (
                        <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{rule.condition}</p>
                            <p className="text-xs text-muted-foreground">{rule.message}</p>
                          </div>
                          <div className="space-x-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-3 w-3" />
                        Agregar Regla
                      </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="auto-reply-hours">Horario activo</Label>
                        <div className="flex space-x-2">
                          <Input id="auto-reply-start" type="time" defaultValue="09:00" />
                          <span className="self-center">-</span>
                          <Input id="auto-reply-end" type="time" defaultValue="18:00" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="auto-reply-days">Días activos</Label>
                        <div className="flex flex-wrap gap-1">
                          {["L", "M", "X", "J", "V", "S", "D"].map((day, index) => (
                            <Button
                              key={day}
                              variant={index < 5 ? "default" : "outline"}
                              size="sm"
                              className="w-8 h-8 p-0"
                            >
                              {day}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Enhanced Email Sequences Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Secuencias de Email</h3>
                  <Dialog open={sequenceDialog} onOpenChange={setSequenceDialog}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingSequence(null)
                          setNewSequence({ name: "", description: "", emails: 1 })
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Nueva Secuencia
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Nueva Secuencia de Email</DialogTitle>
                        <DialogDescription>Crea una nueva secuencia automatizada de emails</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="sequence-name">Nombre de la secuencia</Label>
                          <Input
                            id="sequence-name"
                            value={newSequence.name}
                            onChange={(e) => setNewSequence({ ...newSequence, name: e.target.value })}
                            placeholder="Ej: Onboarding nuevos clientes"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sequence-description">Descripción</Label>
                          <Textarea
                            id="sequence-description"
                            value={newSequence.description}
                            onChange={(e) => setNewSequence({ ...newSequence, description: e.target.value })}
                            placeholder="Describe el propósito de esta secuencia..."
                            rows={3}
                          />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="sequence-emails">Número de emails</Label>
                            <Input
                              id="sequence-emails"
                              type="number"
                              min="1"
                              max="10"
                              value={newSequence.emails}
                              onChange={(e) =>
                                setNewSequence({ ...newSequence, emails: Number.parseInt(e.target.value) || 1 })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sequence-trigger">Disparador</Label>
                            <select id="sequence-trigger" className="w-full p-2 border rounded-md">
                              <option>Nuevo contacto creado</option>
                              <option>Deal cerrado</option>
                              <option>Cita programada</option>
                              <option>Email recibido</option>
                              <option>Manual</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sequence-delay">Retraso entre emails</Label>
                          <div className="flex space-x-2">
                            <Input id="sequence-delay-value" type="number" min="1" defaultValue="1" className="w-20" />
                            <select className="flex-1 p-2 border rounded-md">
                              <option>Días</option>
                              <option>Horas</option>
                              <option>Semanas</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSequenceDialog(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleCreateSequence}>Crear Secuencia</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <Dialog open={sequenceEditDialog} onOpenChange={setSequenceEditDialog}>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Editar Secuencia: {editingSequence?.name}</DialogTitle>
                      <DialogDescription>Modifica la configuración de la secuencia</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-sequence-name">Nombre de la secuencia</Label>
                        <Input
                          id="edit-sequence-name"
                          value={newSequence.name}
                          onChange={(e) => setNewSequence({ ...newSequence, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-sequence-description">Descripción</Label>
                        <Textarea
                          id="edit-sequence-description"
                          value={newSequence.description}
                          onChange={(e) => setNewSequence({ ...newSequence, description: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-3">
                        <Label>Emails de la secuencia</Label>
                        {Array.from({ length: newSequence.emails }, (_, index) => (
                          <div key={index} className="p-3 border rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Email {index + 1}</h4>
                              <Badge variant="outline">{index === 0 ? "Inmediato" : `+${index} días`}</Badge>
                            </div>
                            <Input placeholder={`Asunto del email ${index + 1}`} />
                            <Textarea placeholder={`Contenido del email ${index + 1}`} rows={3} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setSequenceEditDialog(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleUpdateSequence}>Actualizar Secuencia</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <div className="space-y-3">
                  {sequences.map((sequence) => (
                    <div key={sequence.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">{sequence.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {sequence.emails} emails • {sequence.status}
                          </p>
                        </div>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditSequence(sequence)}>
                            <Edit className="mr-1 h-3 w-3" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleToggleSequence(sequence.id)}>
                            {sequence.status === "Activa" ? (
                              <>
                                <Pause className="mr-1 h-3 w-3" />
                                Pausar
                              </>
                            ) : (
                              <>
                                <Play className="mr-1 h-3 w-3" />
                                Activar
                              </>
                            )}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteSequence(sequence.id)}>
                            <Trash2 className="mr-1 h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-4 text-sm">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <p className="font-medium text-blue-600">156</p>
                          <p className="text-blue-600">Enviados</p>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <p className="font-medium text-green-600">89%</p>
                          <p className="text-green-600">Abiertos</p>
                        </div>
                        <div className="text-center p-2 bg-purple-50 rounded">
                          <p className="font-medium text-purple-600">34%</p>
                          <p className="text-purple-600">Clics</p>
                        </div>
                        <div className="text-center p-2 bg-orange-50 rounded">
                          <p className="font-medium text-orange-600">12%</p>
                          <p className="text-orange-600">Conversión</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
