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
  stage?: string // Added stage field to Client interface
  type?: string
  created_at?: string
}

interface Communication {
  id: string
  type: "email" | "phone" | "meeting" | "note" | "whatsapp" | "ticket"
  subject?: string
  content: string
  date?: string
  duration?: string
  participants?: string
  priority?: "low" | "medium" | "high"
  ticketCategory?: string
  ticketType?: string
  assignedTo?: string
  delegatedTo?: string
  escalatedTo?: string
  delegationReason?: string
  escalationReason?: string
  delegationHistory?: Array<{
    action: "delegated" | "escalated"
    from: string
    to: string
    reason: string
    date: string
  }>
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
  delegatedTo?: string
  delegationReason?: string
  escalatedTo?: string
  escalationReason?: string
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

  const mockUsers = [
    { id: "1", name: "Ana García", role: "Soporte Técnico", department: "IT" },
    { id: "2", name: "Carlos López", role: "Supervisor", department: "Soporte" },
    { id: "3", name: "María Rodríguez", role: "Manager", department: "Ventas" },
    { id: "4", name: "Juan Pérez", role: "Director", department: "Operaciones" },
    { id: "5", name: "Laura Martín", role: "Especialista", department: "Facturación" },
  ]

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

  const fetchClients = async () => {
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

  const handleSaveNewClient = async (contactData: any) => {
    try {
      // Create client record
      const clientResponse = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...contactData,
          status: "client", // Mark as client instead of contact
        }),
      })

      if (!clientResponse.ok) {
        throw new Error("Failed to create client")
      }

      const newClient = await clientResponse.json()

      // Create opportunity record if stage is provided
      if (contactData.stage) {
        const opportunityResponse = await fetch("/api/deals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: `Oportunidad - ${contactData.name}`,
            client_id: newClient.id,
            stage: contactData.stage,
            value: 0,
            probability:
              contactData.stage === "Nuevo"
                ? 10
                : contactData.stage === "Calificación"
                  ? 25
                  : contactData.stage === "Propuesta"
                    ? 50
                    : contactData.stage === "Negociación"
                      ? 75
                      : contactData.stage === "Cierre"
                        ? 90
                        : contactData.stage === "Ganado"
                          ? 100
                          : 0,
            expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days from now
            description: `Oportunidad creada automáticamente para ${contactData.name}`,
            sales_owner: contactData.sales_owner || "Daniel Casañas",
          }),
        })

        if (!opportunityResponse.ok) {
          console.warn("Failed to create opportunity, but client was created successfully")
        }
      }

      toast({
        title: "Cliente creado",
        description: `${contactData.name} ha sido agregado como cliente${contactData.stage ? " y se creó una oportunidad" : ""}`,
      })

      // Refresh clients list
      fetchClients()
    } catch (error) {
      console.error("Error creating client:", error)
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

  const handleOpenCommForm = (type: Communication["type"]) => {
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
        assignedTo: "current-user",
        delegationHistory: [],
      }),
    }

    setCommForm(initialForm)
    setCommFormType(type)
    setIsCommFormOpen(true)
  }

  const handleDelegateTicket = () => {
    if (!commForm.delegatedTo || !commForm.delegationReason) return

    const delegationEntry = {
      action: "delegated" as const,
      from: "Usuario Actual",
      to: mockUsers.find((u) => u.id === commForm.delegatedTo)?.name || "Usuario Desconocido",
      reason: commForm.delegationReason,
      date: new Date().toISOString(),
    }

    setCommForm((prev) => ({
      ...prev,
      assignedTo: prev.delegatedTo,
      delegationHistory: [...(prev.delegationHistory || []), delegationEntry],
      delegatedTo: "",
      delegationReason: "",
    }))
  }

  const handleEscalateTicket = () => {
    if (!commForm.escalatedTo || !commForm.escalationReason) return

    const escalationEntry = {
      action: "escalated" as const,
      from: "Usuario Actual",
      to: mockUsers.find((u) => u.id === commForm.escalatedTo)?.name || "Usuario Desconocido",
      reason: commForm.escalationReason,
      date: new Date().toISOString(),
    }

    setCommForm((prev) => ({
      ...prev,
      assignedTo: prev.escalatedTo,
      delegationHistory: [...(prev.delegationHistory || []), escalationEntry],
      escalatedTo: "",
      escalationReason: "",
    }))
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
        assignedTo: commForm.assignedTo,
        delegatedTo: commForm.delegatedTo,
        escalatedTo: commForm.escalatedTo,
        delegationReason: commForm.delegationReason,
        escalationReason: commForm.escalationReason,
        delegationHistory: commForm.delegationHistory,
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

  const handleContractedServices = (client: Client) => {
    console.log("[v0] Opening contracted services for client:", client.name)
    // TODO: Implement contracted services logic
  }

  const handlePotentialServices = (client: Client) => {
    console.log("[v0] Opening potential services for client:", client.name)
    // TODO: Implement potential services logic
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
                onClick={() => handleOpenCommForm("email")}
              >
                <Mail className="h-6 w-6" />
                Enviar Email
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white h-20 flex-col gap-2"
                onClick={() => handleOpenCommForm("phone")}
              >
                <Phone className="h-6 w-6" />
                Realizar Llamada
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white h-20 flex-col gap-2"
                onClick={() => handleOpenCommForm("meeting")}
              >
                <Calendar className="h-6 w-6" />
                Programar Reunión
              </Button>
              <Button
                className="bg-orange-600 hover:bg-orange-700 text-white h-20 flex-col gap-2"
                onClick={() => handleOpenCommForm("note")}
              >
                <User className="h-6 w-6" />
                Agregar Nota
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white h-20 flex-col gap-2"
                onClick={() => handleOpenCommForm("whatsapp")}
              >
                <MessageCircle className="h-6 w-6" />
                WhatsApp
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white h-20 flex-col gap-2"
                onClick={() => handleOpenCommForm("ticket")}
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
                <>
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

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Delegación y Escalamiento</h4>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Delegar a</label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                          value={commForm.delegatedTo || ""}
                          onChange={(e) => setCommForm((prev) => ({ ...prev, delegatedTo: e.target.value }))}
                        >
                          <option value="">Seleccionar usuario</option>
                          {mockUsers.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name} - {user.role}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Escalar a</label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                          value={commForm.escalatedTo || ""}
                          onChange={(e) => setCommForm((prev) => ({ ...prev, escalatedTo: e.target.value }))}
                        >
                          <option value="">Seleccionar supervisor</option>
                          {mockUsers
                            .filter(
                              (user) =>
                                user.role.includes("Supervisor") ||
                                user.role.includes("Manager") ||
                                user.role.includes("Director"),
                            )
                            .map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.name} - {user.role}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    {commForm.delegatedTo && (
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Motivo de delegación</label>
                        <Input
                          placeholder="Explique por qué delega este ticket..."
                          value={commForm.delegationReason || ""}
                          onChange={(e) => setCommForm((prev) => ({ ...prev, delegationReason: e.target.value }))}
                        />
                        <Button
                          type="button"
                          size="sm"
                          className="mt-2 bg-blue-600 hover:bg-blue-700"
                          onClick={handleDelegateTicket}
                        >
                          Confirmar Delegación
                        </Button>
                      </div>
                    )}

                    {commForm.escalatedTo && (
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Motivo de escalamiento</label>
                        <Input
                          placeholder="Explique por qué escala este ticket..."
                          value={commForm.escalationReason || ""}
                          onChange={(e) => setCommForm((prev) => ({ ...prev, escalationReason: e.target.value }))}
                        />
                        <Button
                          type="button"
                          size="sm"
                          className="mt-2 bg-orange-600 hover:bg-orange-700"
                          onClick={handleEscalateTicket}
                        >
                          Confirmar Escalamiento
                        </Button>
                      </div>
                    )}

                    {commForm.delegationHistory && commForm.delegationHistory.length > 0 && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Historial de Trazabilidad</h5>
                        <div className="space-y-2">
                          {commForm.delegationHistory.map((entry, index) => (
                            <div key={index} className="text-sm">
                              <div className="flex items-center gap-2">
                                <Badge variant={entry.action === "delegated" ? "default" : "destructive"}>
                                  {entry.action === "delegated" ? "Delegado" : "Escalado"}
                                </Badge>
                                <span className="text-gray-600">
                                  de {entry.from} a {entry.to}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(entry.date).toLocaleDateString("es-ES")}
                                </span>
                              </div>
                              <p className="text-gray-700 mt-1 ml-2">{entry.reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Asignado actualmente a</label>
                      <div className="p-2 bg-blue-50 rounded-lg text-sm text-blue-800">
                        {commForm.assignedTo === "current-user"
                          ? "Usuario Actual"
                          : mockUsers.find((u) => u.id === commForm.assignedTo)?.name || "Usuario Desconocido"}
                      </div>
                    </div>
                  </div>
                </>
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
                    {client.stage && (
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            client.stage === "Ganado"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : client.stage === "Perdido"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : client.stage === "Negociación"
                                  ? "bg-orange-50 text-orange-700 border-orange-200"
                                  : client.stage === "Propuesta"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : client.stage === "Calificación"
                                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                      : "bg-gray-50 text-gray-700 border-gray-200"
                          }`}
                        >
                          Etapa: {client.stage}
                        </Badge>
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
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white border-0"
                          onClick={() => handleContractedServices(client)}
                        >
                          Servicios contratados
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white border-0"
                          onClick={() => handlePotentialServices(client)}
                        >
                          Servicios potenciales
                        </Button>
                      </div>
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
