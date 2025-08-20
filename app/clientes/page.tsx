"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Plus, Building2, Mail, Phone, MapPin, Calendar, User, Trash2 } from "lucide-react"
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

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false)
  const [isEditClientDialogOpen, setIsEditClientDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isClientDetailsOpen, setIsClientDetailsOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

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
    } catch (error) {
      console.error("Error loading clients:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNewClient = async (clientData: any) => {
    try {
      console.log("[v0] Saving new client:", clientData)

      const newClient: Client = {
        id: Date.now().toString(),
        name: clientData.name || clientData.company || "Cliente Sin Nombre",
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
        type: clientData.type || "Cliente",
        created_at: new Date().toISOString(),
      }

      setClients((prev) => [newClient, ...prev])

      toast({
        title: "Cliente creado",
        description: `El cliente "${newClient.name}" se creó correctamente`,
      })

      console.log("[v0] Client created successfully:", newClient)
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
    setSelectedClient(client)
    setIsClientDetailsOpen(false) // Close details dialog
    setIsEditClientDialogOpen(true) // Open edit dialog
  }

  const handleSaveEditedClient = async (clientData: any) => {
    try {
      console.log("[v0] Saving edited client:", clientData)

      if (!selectedClient) return

      const updatedClient: Client = {
        ...selectedClient,
        name: clientData.name || clientData.company || selectedClient.name,
        email: clientData.email || selectedClient.email,
        phone: clientData.phone || selectedClient.phone,
        address: clientData.address || selectedClient.address,
        type: clientData.type || selectedClient.type,
      }

      setClients((prev) => prev.map((client) => (client.id === selectedClient.id ? updatedClient : client)))

      toast({
        title: "Cliente actualizado",
        description: `El cliente "${updatedClient.name}" se actualizó correctamente`,
      })

      console.log("[v0] Client updated successfully:", updatedClient)
    } catch (error) {
      console.error("Error updating client:", error)
      throw error
    }
  }

  const handleDeleteClient = async (clientId: string) => {
    try {
      console.log("[v0] Deleting client with ID:", clientId)

      setClients((prev) => prev.filter((client) => client.id !== clientId))

      toast({
        title: "Cliente eliminado",
        description: `El cliente con ID "${clientId}" se eliminó correctamente`,
      })

      console.log("[v0] Client deleted successfully with ID:", clientId)
    } catch (error) {
      console.error("Error deleting client:", error)
      throw error
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
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Building2 className="h-6 w-6 text-purple-600" />
              Detalles del Cliente
            </DialogTitle>
          </DialogHeader>

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
        initialData={
          selectedClient
            ? {
                name: selectedClient.name,
                company: selectedClient.name,
                email: selectedClient.email,
                phone: selectedClient.phone,
                address: selectedClient.address,
                type: selectedClient.type,
              }
            : undefined
        }
        title="Editar Cliente"
        submitButtonText="Guardar Cambios"
      />
    </div>
  )
}
