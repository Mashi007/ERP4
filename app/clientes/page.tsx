import { listClients, type Client } from "./queries"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Building2, Mail, Phone, MapPin, Calendar } from "lucide-react"

export default async function ClientesPage() {
  const clients: Client[] = await listClients()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <p className="text-gray-600">Módulo de gestión de clientes</p>
      </div>

      <Tabs defaultValue="directorio" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger
            value="directorio"
            className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm font-medium"
          >
            Directorio de Clientes
          </TabsTrigger>
          <TabsTrigger
            value="contactos"
            className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm font-medium"
          >
            Contactos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="directorio" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Header with search and add button */}
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
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Cliente
                  </Button>
                </div>
              </div>
            </div>

            {/* Client cards grid */}
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
                            <h3 className="font-semibold text-gray-900 text-sm">
                              {client.name || "Cliente Sin Nombre"}
                            </h3>
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
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Primer Cliente
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contactos" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-center py-12">
              <p className="text-gray-500">Contenido de contactos no disponible</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
