"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  Plus,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Trash2,
  MessageCircle,
  Ticket,
} from "lucide-react"
import DynamicContactForm from "@/components/contacts/dynamic-contact-form"
import { useToast } from "@/hooks/use-toast"

interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  type?: string
  created_at?: string
}

interface Communication {
  id: string
  type: "email" | "phone" | "meeting" | "note" | "whatsapp" | "ticket"
  subject?: string
  content: string
  date: string
  status: "sent" | "received" | "scheduled" | "completed" | "open" | "closed"
}

interface CommunicationForm {
  type: "email" | "phone" | "meeting" | "note" | "whatsapp" | "ticket"
  subject?: string
  content: string
  date?: string
  duration?: string
  participants?: string
  priority?: "low" | "medium" | "high"
  ticketCategory?: string
  ticketType?: string
}

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false)
  const [isEditClientDialogOpen, setIsEditClientDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isClientDetailsOpen, setIsClientDetailsOpen] = useState(false)
  const [isCommPageOpen, setIsCommPageOpen] = useState(false)
  const [selectedCommClient, setSelectedCommClient] = useState<Client | null>(null)
  const [communications, setCommunications] = useState<Communication[]>([])
  const [isCommFormOpen, setIsCommFormOpen] = useState(false)
  const [commFormType, setCommFormType] = useState<"email" | "phone" | "meeting" | "note" | "whatsapp" | "ticket">(
    "email",
  )
  const [commForm, setCommForm] = useState<CommunicationForm>({
    type: "email",
    content: "",
    priority: "medium",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setLoading(true)
      console.log("[v0] Loading clients from database...")

      const response = await fetch("/api/clients")

      if (!response.ok) {
        throw new Error("Failed to fetch clients")
      }

      const data = await response.json()
      console.log("[v0] Database clients query result:", data.clients.length, "clients found")

      setClients(data.clients)
      console.log("[v0] Clients loaded successfully:", data.clients)
    } catch (error) {
      console.error("[v0] Error loading clients from database:", error)
      // Fallback to mock data if database fails
      console.log("[v0] Falling back to mock data")
      const mockClients: Client[] = [
        {
          id: "1",
          name: "Empresa ABC S.L.",
          email: "contacto@empresaabc.com",
          phone: "+34 912 345 678",
          address: "Calle Mayor 123, Madrid",
          type: "Empresa",
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Consultoría XYZ",
          email: "info@consultoriaxyz.com",
          phone: "+34 987 654 321",
          address: "Avenida Principal 456, Barcelona",
          type: "Consultoría",
          created_at: new Date().toISOString(),
        },
      ]
      setClients(mockClients)

      toast({
        title: "Advertencia",
        description: "Se cargaron datos de ejemplo. Verifica la conexión a la base de datos.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNewClient = async (clientData: any) => {
    try {
      console.log("[v0] Saving new client to database:", clientData)

      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData),
      })

      if (!response.ok) {
        throw new Error("Failed to save client")
      }

      const data = await response.json()
      console.log("[v0] Database insert result:", data.client)

      setClients((prev) => [data.client, ...prev])

      toast({
        title: "Cliente creado",
        description: `El cliente "${data.client.name}" se guardó en la base de datos`,
      })

      console.log("[v0] Client saved to database successfully:", data.client)
      setIsNewClientDialogOpen(false)
    } catch (error) {
      console.error("[v0] Error saving client to database:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el cliente en la base de datos",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleNewClientClick = () => {
    console.log("[v0] Opening new client dialog")
    setIsNewClientDialogOpen(true)
  }

  const handleViewDetails = (client: Client) => {
    console.log("[v0] Opening client details for:", client.name)
    setSelectedClient(client)
    setIsClientDetailsOpen(true)
  }

  const handleCloseDetails = () => {
    setIsClientDetailsOpen(false)
    setSelectedClient(null)
  }

  const handleEditClient = (client: Client) => {
    console.log("[v0] Opening edit dialog for client:", client.name)

    const mappedClientData = {
      nombre: client.name,
      email: client.email,
      telefono: client.phone,
      direccion: client.address,
      empresa: client.name, // Use name as company name fallback
      tipo: client.type,
      // Add any other fields that might be needed
      cargo: "", // Default empty values for fields not in client object
      ciudad: "",
      pais: "",
      notas: "",
    }

    setSelectedClient(client)
    setIsClientDetailsOpen(false) // Close details dialog
    setIsEditClientDialogOpen(true) // Open edit dialog
  }

  const handleSaveEditedClient = async (clientData: any) => {
    try {
      console.log("[v0] Saving edited client to database:", clientData)
      console.log("[v0] Selected client before update:", selectedClient)

      if (!selectedClient) return

      const response = await fetch(`/api/clients/${selectedClient.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData),
      })

      if (!response.ok) {
        throw new Error("Failed to update client")
      }

      const data = await response.json()
      console.log("[v0] Database update result:", data.client)

      const updatedClient: Client = {
        ...selectedClient,
        ...data.client,
        type: selectedClient.type,
      }

      console.log("[v0] Updated client data:", updatedClient)

      setClients((prev) => prev.map((client) => (client.id === selectedClient.id ? updatedClient : client)))

      toast({
        title: "Cliente actualizado",
        description: `El cliente "${updatedClient.name}" se actualizó en la base de datos`,
      })

      console.log("[v0] Client updated in database successfully:", updatedClient)

      setIsEditClientDialogOpen(false)
      setSelectedClient(null)
      console.log("[v0] Edit dialog closed and state reset")
    } catch (error) {
      console.error("[v0] Error updating client in database:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el cliente en la base de datos",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleDeleteClient = async (clientId: string) => {
    try {
      console.log("[v0] Deleting client from database with ID:", clientId)

      const response = await fetch(`/api/clients/${clientId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete client")
      }

      setClients((prev) => prev.filter((client) => client.id !== clientId))

      toast({
        title: "Cliente eliminado",
        description: `El cliente se eliminó de la base de datos correctamente`,
      })

      console.log("[v0] Client deleted from database successfully with ID:", clientId)
      setIsClientDetailsOpen(false)
      setSelectedClient(null)
    } catch (error) {
      console.error("[v0] Error deleting client from database:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el cliente de la base de datos",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleCommunications = (client: Client) => {
    console.log("[v0] Opening communications for client:", client.name)
    setSelectedCommClient(client)
    setIsCommPageOpen(true)
    // Load mock communications data
    const mockComms: Communication[] = [
      {
        id: "1",
        type: "email",
        subject: "Propuesta comercial",
        content: "Enviada propuesta comercial para servicios de consultoría",
        date: new Date(Date.now() - 86400000).toISOString(),
        status: "sent",
      },
      {
        id: "2",
        type: "phone",
        content: "Llamada de seguimiento - Cliente interesado en ampliar servicios",
        date: new Date(Date.now() - 172800000).toISOString(),
        status: "completed",
      },
    ]
    setCommunications(mockComms)
  }

  const handleNewCommunication = (type: "email" | "phone" | "meeting" | "note" | "whatsapp" | "ticket") => {
    console.log("[v0] Creating new communication of type:", type, "for client:", selectedCommClient?.name)

    const initialForm: CommunicationForm = {
      type,
      content: "",
      priority: "medium",
      date: new Date().toISOString().split("T")[0],
      ...(type === "email" && {
        subject: `Comunicación con ${selectedCommClient?.name}`,
      }),
      ...(type === "meeting" && {
        duration: "60",
        participants: selectedCommClient?.name || "",
      }),
      ...(type === "whatsapp" && {
        subject: `WhatsApp con ${selectedCommClient?.name}`,
      }),
      ...(type === "ticket" && {
        subject: `Ticket de soporte - ${selectedCommClient?.name}`,
        ticketCategory: "general",
        ticketType: "consulta",
      }),
    }

    setCommForm(initialForm)
    setCommFormType(type)
    setIsCommFormOpen(true)
  }

  const handleSaveCommunication = async () => {
    try {
      console.log("[v0] Saving communication:", commForm)

      const newComm: Communication = {
        id: Date.now().toString(),
        type: commForm.type,
        subject: commForm.subject,
        content: commForm.content,
        date: new Date().toISOString(),
        status:
          commForm.type === "email"
            ? "sent"
            : commForm.type === "phone"
              ? "completed"
              : commForm.type === "meeting"
                ? "scheduled"
                : commForm.type === "whatsapp"
                  ? "sent"
                  : commForm.type === "ticket"
                    ? "open"
                    : "completed",
      }

      setCommunications((prev) => [newComm, ...prev])

      toast({
        title: "Comunicación registrada",
        description: `${
          commForm.type === "email"
            ? "Email enviado"
            : commForm.type === "phone"
              ? "Llamada registrada"
              : commForm.type === "meeting"
                ? "Reunión programada"
                : commForm.type === "whatsapp"
                  ? "WhatsApp enviado"
                  : commForm.type === "ticket"
                    ? "Ticket creado"
                    : "Nota agregada"
        } para ${selectedCommClient?.name}`,
      })

      setIsCommFormOpen(false)
      setCommForm({ type: "email", content: "", priority: "medium" })
    } catch (error) {
      console.error("[v0] Error saving communication:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la comunicación",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isCommPageOpen && selectedCommClient) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setIsCommPageOpen(false)} className="mb-4">
            ← Volver a Clientes
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{selectedCommClient.name}</h1>
          <p className="text-gray-600">Centro de comunicaciones</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Opciones de Comunicación</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white h-20 flex-col gap-2"
                onClick={() => handleNewCommunication("email")}
              >
                <Mail className="h-6 w-6" />
                Enviar Email
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white h-20 flex-col gap-2"
                onClick={() => handleNewCommunication("phone")}
              >
                <Phone className="h-6 w-6" />
                Realizar Llamada
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white h-20 flex-col gap-2"
                onClick={() => handleNewCommunication("meeting")}
              >
                <Calendar className="h-6 w-6" />
                Programar Reunión
              </Button>
              <Button
                className="bg-orange-600 hover:bg-orange-700 text-white h-20 flex-col gap-2"
                onClick={() => handleNewCommunication("note")}
              >
                <User className="h-6 w-6" />
                Agregar Nota
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white h-20 flex-col gap-2"
                onClick={() => handleNewCommunication("whatsapp")}
              >
                <MessageCircle className="h-6 w-6" />
                WhatsApp
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white h-20 flex-col gap-2"
                onClick={() => handleNewCommunication("ticket")}
              >
                <Ticket className="h-6 w-6" />
                Ticket
              </Button>
            </div>
          </div>
        </div>

        <Dialog open={isCommFormOpen} onOpenChange={setIsCommFormOpen}>
          <DialogContent className="max-w-2xl">
            <DialogTitle className="flex items-center gap-2 text-xl">
              {commFormType === "email" && <Mail className="h-6 w-6 text-blue-600" />}
              {commFormType === "phone" && <Phone className="h-6 w-6 text-green-600" />}
              {commFormType === "meeting" && <Calendar className="h-6 w-6 text-purple-600" />}
              {commFormType === "note" && <User className="h-6 w-6 text-orange-600" />}
              {commFormType === "whatsapp" && <MessageCircle className="h-6 w-6 text-emerald-600" />}
              {commFormType === "ticket" && <Ticket className="h-6 w-6 text-red-600" />}
              {commFormType === "email"
                ? "Enviar Email"
                : commFormType === "phone"
                  ? "Registrar Llamada"
                  : commFormType === "meeting"
                    ? "Programar Reunión"
                    : commFormType === "whatsapp"
                      ? "Enviar WhatsApp"
                      : commFormType === "ticket"
                        ? "Crear Ticket"
                        : "Agregar Nota"}
            </DialogTitle>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Cliente: {selectedCommClient.name}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  {selectedCommClient.email && <p>Email: {selectedCommClient.email}</p>}
                  {selectedCommClient.phone && <p>Teléfono: {selectedCommClient.phone}</p>}
                  {selectedCommClient.address && <p>Dirección: {selectedCommClient.address}</p>}
                </div>
              </div>

              {(commFormType === "email" || commFormType === "whatsapp" || commFormType === "ticket") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {commFormType === "ticket" ? "Título del Ticket" : "Asunto"}
                  </label>
                  <Input
                    value={commForm.subject || ""}
                    onChange={(e) => setCommForm((prev) => ({ ...prev, subject: e.target.value }))}
                    placeholder={
                      commFormType === "email"
                        ? "Asunto del email"
                        : commFormType === "whatsapp"
                          ? "Asunto del WhatsApp"
                          : "Título del ticket"
                    }
                  />
                </div>
              )}

              {commFormType === "ticket" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      value={commForm.ticketCategory || "general"}
                      onChange={(e) => setCommForm((prev) => ({ ...prev, ticketCategory: e.target.value }))}
                    >
                      <option value="general">General</option>
                      <option value="tecnico">Técnico</option>
                      <option value="comercial">Comercial</option>
                      <option value="facturacion">Facturación</option>
                      <option value="soporte">Soporte</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      value={commForm.ticketType || "consulta"}
                      onChange={(e) => setCommForm((prev) => ({ ...prev, ticketType: e.target.value }))}
                    >
                      <option value="consulta">Consulta</option>
                      <option value="incidencia">Incidencia</option>
                      <option value="solicitud">Solicitud</option>
                      <option value="reclamo">Reclamo</option>
                      <option value="sugerencia">Sugerencia</option>
                    </select>
                  </div>
                </div>
              )}

              {commFormType === "meeting" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                    <Input
                      type="date"
                      value={commForm.date || ""}
                      onChange={(e) => setCommForm((prev) => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duración (minutos)</label>
                    <Input
                      value={commForm.duration || ""}
                      onChange={(e) => setCommForm((prev) => ({ ...prev, duration: e.target.value }))}
                      placeholder="60"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {commFormType === "email"
                    ? "Mensaje"
                    : commFormType === "phone"
                      ? "Resumen de la llamada"
                      : commFormType === "meeting"
                        ? "Agenda de la reunión"
                        : commFormType === "whatsapp"
                          ? "Mensaje de WhatsApp"
                          : commFormType === "ticket"
                            ? "Descripción del ticket"
                            : "Contenido de la nota"}
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={6}
                  value={commForm.content}
                  onChange={(e) => setCommForm((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder={
                    commFormType === "email"
                      ? "Escribe tu mensaje aquí..."
                      : commFormType === "phone"
                        ? "Describe el contenido de la llamada..."
                        : commFormType === "meeting"
                          ? "Agenda y objetivos de la reunión..."
                          : commFormType === "whatsapp"
                            ? "Escribe tu mensaje de WhatsApp..."
                            : commFormType === "ticket"
                              ? "Describe el problema o solicitud..."
                              : "Escribe tu nota aquí..."
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  value={commForm.priority}
                  onChange={(e) =>
                    setCommForm((prev) => ({ ...prev, priority: e.target.value as "low" | "medium" | "high" }))
                  }
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCommFormOpen(false)}>
                Cancelar
              </Button>
              <Button
                className={
                  commFormType === "email"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : commFormType === "phone"
                      ? "bg-green-600 hover:bg-green-700"
                      : commFormType === "meeting"
                        ? "bg-purple-600 hover:bg-purple-700"
                        : commFormType === "whatsapp"
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : commFormType === "ticket"
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-orange-600 hover:bg-orange-700"
                }
                onClick={handleSaveCommunication}
                disabled={!commForm.content.trim()}
              >
                {commFormType === "email"
                  ? "Enviar Email"
                  : commFormType === "phone"
                    ? "Registrar Llamada"
                    : commFormType === "meeting"
                      ? "Programar Reunión"
                      : commFormType === "whatsapp"
                        ? "Enviar WhatsApp"
                        : commFormType === "ticket"
                          ? "Crear Ticket"
                          : "Guardar Nota"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Historial de Comunicaciones</h2>
          </div>
          <div className="p-6">
            {communications.length > 0 ? (
              <div className="space-y-4">
                {communications.map((comm) => (
                  <div key={comm.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {comm.type === "email" && <Mail className="h-5 w-5 text-blue-600" />}
                        {comm.type === "phone" && <Phone className="h-5 w-5 text-green-600" />}
                        {comm.type === "meeting" && <Calendar className="h-5 w-5 text-purple-600" />}
                        {comm.type === "note" && <User className="h-5 w-5 text-orange-600" />}
                        {comm.type === "whatsapp" && <MessageCircle className="h-5 w-5 text-emerald-600" />}
                        {comm.type === "ticket" && <Ticket className="h-5 w-5 text-red-600" />}
                        <div>
                          {comm.subject && <h3 className="font-medium text-gray-900">{comm.subject}</h3>}
                          <p className="text-sm text-gray-600">{comm.content}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={comm.status === "completed" ? "default" : "outline"}
                          className={
                            comm.status === "sent"
                              ? "bg-blue-100 text-blue-800"
                              : comm.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : comm.status === "scheduled"
                                  ? "bg-purple-100 text-purple-800"
                                  : comm.status === "open"
                                    ? "bg-red-100 text-red-800"
                                    : comm.status === "closed"
                                      ? "bg-gray-100 text-gray-800"
                                      : "bg-gray-100 text-gray-800"
                          }
                        >
                          {comm.status === "sent"
                            ? "Enviado"
                            : comm.status === "completed"
                              ? "Completado"
                              : comm.status === "scheduled"
                                ? "Programado"
                                : comm.status === "open"
                                  ? "Abierto"
                                  : comm.status === "closed"
                                    ? "Cerrado"
                                    : "Recibido"}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{new Date(comm.date).toLocaleDateString("es-ES")}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay comunicaciones registradas</h3>
                <p className="text-gray-600">Las comunicaciones con este cliente aparecerán aquí</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <p className="text-gray-600">Módulo de gestión de clientes</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Directorio de Clientes</h2>
              <p className="text-sm text-gray-600">Gestiona y visualiza todos tus clientes</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar clientes..."
                  className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleNewClientClick}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Cliente
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {clients && clients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer hover:border-purple-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Building2 className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{client.name || "Cliente Sin Nombre"}</h3>
                        <Badge variant="outline" className="text-xs mt-1">
                          {client.type || "Empresa"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {client.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    {client.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="truncate">{client.address}</span>
                      </div>
                    )}
                    {client.created_at && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Creado: {new Date(client.created_at).toLocaleDateString("es-ES")}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">ID: {client.id}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                          onClick={() => handleCommunications(client)}
                        >
                          Comunicaciones
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent"
                          onClick={() => handleViewDetails(client)}
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay clientes registrados</h3>
              <p className="text-gray-600 mb-6">Comienza agregando tu primer cliente al directorio</p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleNewClientClick}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Cliente
              </Button>
            </div>
          )}
        </div>
      </div>

      <DynamicContactForm
        isOpen={isNewClientDialogOpen}
        onClose={() => setIsNewClientDialogOpen(false)}
        onSave={handleSaveNewClient}
      />

      <Dialog open={isClientDetailsOpen} onOpenChange={setIsClientDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building2 className="h-6 w-6 text-purple-600" />
            Detalles del Cliente
          </DialogTitle>

          {selectedClient && (
            <div className="space-y-6">
              <div className="flex items-start justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Building2 className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedClient.name}</h2>
                    <Badge variant="outline" className="mt-1">
                      {selectedClient.type || "Empresa"}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 bg-transparent hover:bg-red-50"
                    onClick={() => handleDeleteClient(selectedClient.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 border-b pb-2">Información de Contacto</h3>

                  {selectedClient.email && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Email</p>
                        <p className="text-sm text-gray-600">{selectedClient.email}</p>
                      </div>
                    </div>
                  )}

                  {selectedClient.phone && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Teléfono</p>
                        <p className="text-sm text-gray-600">{selectedClient.phone}</p>
                      </div>
                    </div>
                  )}

                  {selectedClient.address && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Dirección</p>
                        <p className="text-sm text-gray-600">{selectedClient.address}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 border-b pb-2">Información del Sistema</h3>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">ID del Cliente</p>
                      <p className="text-sm text-gray-600">{selectedClient.id}</p>
                    </div>
                  </div>

                  {selectedClient.created_at && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Fecha de Creación</p>
                        <p className="text-sm text-gray-600">
                          {new Date(selectedClient.created_at).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Estado</p>
                      <p className="text-sm text-green-600">Activo</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={handleCloseDetails}>
                  Cerrar
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => handleEditClient(selectedClient)}
                >
                  Editar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DynamicContactForm
        isOpen={isEditClientDialogOpen}
        onClose={() => {
          setIsEditClientDialogOpen(false)
          setSelectedClient(null)
        }}
        onSave={handleSaveEditedClient}
        editingContact={
          selectedClient
            ? {
                nombre: selectedClient.name,
                email: selectedClient.email,
                telefono: selectedClient.phone,
                direccion: selectedClient.address,
                empresa: selectedClient.name,
                tipo: selectedClient.type,
                cargo: "",
                ciudad: "",
                pais: "",
                notas: "",
              }
            : null
        }
      />
    </div>
  )
}
