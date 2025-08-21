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
  User,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  FileText,
  PenTool,
  Send,
} from "lucide-react"
import DynamicContactForm from "@/components/contacts/dynamic-contact-form"
import { useToast } from "@/hooks/use-toast"

interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  job_title?: string
  selectedService?: {
    id: number
    name: string
    category: string
  }
  workflowProgress?: {
    serviceSelected: boolean
    templateSelected: boolean
    proposalGenerated: boolean
    documentSigned: boolean
    documentSent: boolean
  }
  status: "active" | "completed" | "archived"
  created_at?: string
  last_activity?: string
  hasFlowProgress: boolean
}

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isClientDetailsOpen, setIsClientDetailsOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadClients()
  }, [])

  useEffect(() => {
    const filtered = clients.filter(
      (client) =>
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.selectedService?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredClients(filtered)
  }, [clients, searchTerm])

  const loadClients = async () => {
    try {
      setLoading(true)
      console.log("[v0] Loading clients from database...")

      const response = await fetch("/api/contacts")

      if (!response.ok) {
        throw new Error("Failed to fetch contacts")
      }

      const data = await response.json()
      console.log("[v0] Contacts loaded successfully:", data.contacts?.length || 0, "contacts")

      const clientContacts = (data.contacts || [])
        .filter(
          (contact: any) =>
            contact.status === "client" ||
            contact.hasFlowProgress === true ||
            // Check if contact has any workflow activity
            contact.selectedService ||
            contact.workflowProgress,
        )
        .map((contact: any) => ({
          id: contact.id.toString(),
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          company: contact.company,
          job_title: contact.job_title,
          selectedService: contact.selectedService,
          workflowProgress: contact.workflowProgress || {
            serviceSelected: !!contact.selectedService,
            templateSelected: false,
            proposalGenerated: false,
            documentSigned: false,
            documentSent: false,
          },
          status: contact.status === "client" ? "active" : "active",
          created_at: contact.created_at,
          last_activity: contact.updated_at,
          hasFlowProgress: contact.hasFlowProgress || !!contact.selectedService,
        }))

      setClients(clientContacts)
      console.log("[v0] Clients loaded successfully:", clientContacts.length, "clients")
    } catch (error) {
      console.error("[v0] Error loading clients from database:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes. Verifica la conexión a la base de datos.",
        variant: "destructive",
      })
      setClients([])
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNewClient = async (contactData: any) => {
    try {
      const clientResponse = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...contactData,
          status: "client",
          hasFlowProgress: true,
        }),
      })

      if (!clientResponse.ok) {
        throw new Error("Failed to create client")
      }

      toast({
        title: "Cliente creado",
        description: `${contactData.name} ha sido agregado como cliente`,
      })

      loadClients()
      setIsNewClientDialogOpen(false)
    } catch (error) {
      console.error("Error creating client:", error)
      toast({
        title: "Error",
        description: "No se pudo crear el cliente",
        variant: "destructive",
      })
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

  const handleEditClient = (client: Client) => {
    // Navigate to contacts page with edit mode
    window.location.href = `/clientes/contactos?edit=${client.id}`
  }

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este cliente?")) {
      return
    }

    try {
      const response = await fetch(`/api/contacts/${clientId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete client")
      }

      toast({
        title: "Cliente eliminado",
        description: "El cliente ha sido eliminado correctamente",
      })

      loadClients()
      setIsClientDetailsOpen(false)
    } catch (error) {
      console.error("Error deleting client:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el cliente",
        variant: "destructive",
      })
    }
  }

  const getWorkflowCompletion = (progress: any) => {
    if (!progress) return 0
    const steps = [
      progress.serviceSelected,
      progress.templateSelected,
      progress.proposalGenerated,
      progress.documentSigned,
      progress.documentSent,
    ]
    const completed = steps.filter(Boolean).length
    return Math.round((completed / steps.length) * 100)
  }

  const getWorkflowStatusBadge = (progress: any) => {
    const completion = getWorkflowCompletion(progress)
    if (completion === 100) {
      return <Badge className="bg-green-100 text-green-800">Completado</Badge>
    } else if (completion >= 60) {
      return <Badge className="bg-blue-100 text-blue-800">En progreso</Badge>
    } else if (completion > 0) {
      return <Badge className="bg-yellow-100 text-yellow-800">Iniciado</Badge>
    }
    return <Badge variant="outline">Sin iniciar</Badge>
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
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleNewClientClick}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Cliente
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Cargando clientes...</p>
            </div>
          ) : filteredClients && filteredClients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Cliente</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Empresa</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Servicio</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Estado del Flujo</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Última Actividad</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{client.name}</p>
                            {client.email && <p className="text-sm text-gray-600">{client.email}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          {client.company && <p className="font-medium text-gray-900">{client.company}</p>}
                          {client.job_title && <p className="text-sm text-gray-600">{client.job_title}</p>}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {client.selectedService ? (
                          <div>
                            <p className="font-medium text-gray-900">{client.selectedService.name}</p>
                            <p className="text-sm text-gray-600">{client.selectedService.category}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400">Sin servicio</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-2">
                          {getWorkflowStatusBadge(client.workflowProgress)}
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <div className="flex gap-1">
                              <CheckCircle
                                className={`h-3 w-3 ${client.workflowProgress?.serviceSelected ? "text-green-500" : "text-gray-300"}`}
                              />
                              <Clock
                                className={`h-3 w-3 ${client.workflowProgress?.templateSelected ? "text-green-500" : "text-gray-300"}`}
                              />
                              <FileText
                                className={`h-3 w-3 ${client.workflowProgress?.proposalGenerated ? "text-green-500" : "text-gray-300"}`}
                              />
                              <PenTool
                                className={`h-3 w-3 ${client.workflowProgress?.documentSigned ? "text-green-500" : "text-gray-300"}`}
                              />
                              <Send
                                className={`h-3 w-3 ${client.workflowProgress?.documentSent ? "text-green-500" : "text-gray-300"}`}
                              />
                            </div>
                            <span>{getWorkflowCompletion(client.workflowProgress)}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {client.last_activity && (
                          <p className="text-sm text-gray-600">
                            {new Date(client.last_activity).toLocaleDateString("es-ES")}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditClient(client)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(client)}>
                            Ver Workflow
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                            onClick={() => handleDeleteClient(client.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay clientes registrados</h3>
              <p className="text-gray-600 mb-6">Comienza agregando tu primer cliente al directorio</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleNewClientClick}>
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
        <DialogContent className="max-w-4xl">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building2 className="h-6 w-6 text-blue-600" />
            Detalles del Cliente - {selectedClient?.name}
          </DialogTitle>

          {selectedClient && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 border-b pb-2">Información del Cliente</h3>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Nombre</p>
                        <p className="text-sm text-gray-600">{selectedClient.name}</p>
                      </div>
                    </div>

                    {selectedClient.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Email</p>
                          <p className="text-sm text-gray-600">{selectedClient.email}</p>
                        </div>
                      </div>
                    )}

                    {selectedClient.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Teléfono</p>
                          <p className="text-sm text-gray-600">{selectedClient.phone}</p>
                        </div>
                      </div>
                    )}

                    {selectedClient.company && (
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Empresa</p>
                          <p className="text-sm text-gray-600">{selectedClient.company}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 border-b pb-2">Estado del Workflow</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle
                          className={`h-5 w-5 ${selectedClient.workflowProgress?.serviceSelected ? "text-green-500" : "text-gray-300"}`}
                        />
                        <span className="text-sm font-medium">Servicio Seleccionado</span>
                      </div>
                      <Badge variant={selectedClient.workflowProgress?.serviceSelected ? "default" : "outline"}>
                        {selectedClient.workflowProgress?.serviceSelected ? "Completado" : "Pendiente"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock
                          className={`h-5 w-5 ${selectedClient.workflowProgress?.templateSelected ? "text-green-500" : "text-gray-300"}`}
                        />
                        <span className="text-sm font-medium">Plantilla Seleccionada</span>
                      </div>
                      <Badge variant={selectedClient.workflowProgress?.templateSelected ? "default" : "outline"}>
                        {selectedClient.workflowProgress?.templateSelected ? "Completado" : "Pendiente"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText
                          className={`h-5 w-5 ${selectedClient.workflowProgress?.proposalGenerated ? "text-green-500" : "text-gray-300"}`}
                        />
                        <span className="text-sm font-medium">Propuesta Generada</span>
                      </div>
                      <Badge variant={selectedClient.workflowProgress?.proposalGenerated ? "default" : "outline"}>
                        {selectedClient.workflowProgress?.proposalGenerated ? "Completado" : "Pendiente"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <PenTool
                          className={`h-5 w-5 ${selectedClient.workflowProgress?.documentSigned ? "text-green-500" : "text-gray-300"}`}
                        />
                        <span className="text-sm font-medium">Documento Firmado</span>
                      </div>
                      <Badge variant={selectedClient.workflowProgress?.documentSigned ? "default" : "outline"}>
                        {selectedClient.workflowProgress?.documentSigned ? "Completado" : "Pendiente"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Send
                          className={`h-5 w-5 ${selectedClient.workflowProgress?.documentSent ? "text-green-500" : "text-gray-300"}`}
                        />
                        <span className="text-sm font-medium">Documento Enviado</span>
                      </div>
                      <Badge variant={selectedClient.workflowProgress?.documentSent ? "default" : "outline"}>
                        {selectedClient.workflowProgress?.documentSent ? "Completado" : "Pendiente"}
                      </Badge>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900">Progreso Total</span>
                        <span className="text-lg font-bold text-blue-900">
                          {getWorkflowCompletion(selectedClient.workflowProgress)}%
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getWorkflowCompletion(selectedClient.workflowProgress)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsClientDetailsOpen(false)}>
                  Cerrar
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handleEditClient(selectedClient)}
                >
                  Editar Cliente
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
