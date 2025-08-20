import { listClients, type Client } from "./queries"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function ClientesPage() {
  const clients: Client[] = await listClients()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <p className="text-gray-600">Módulo de gestión de clientes</p>
      </div>

      <Tabs defaultValue="directorio" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
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
          <TabsTrigger
            value="todos"
            className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm font-medium"
          >
            Vista Unificada
          </TabsTrigger>
        </TabsList>

        <TabsContent value="directorio" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-center py-12">
              <p className="text-gray-500">Contenido del directorio no disponible</p>
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

        <TabsContent value="todos" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-center py-12">
              <p className="text-gray-500">Vista unificada no disponible</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
