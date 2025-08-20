import { Suspense } from "react"
import { listClients, type Client } from "./queries"
import ClientList from "@/components/clients/client-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ContactsClient from "@/app/contacts/contacts-client"

export default async function ClientesPage() {
  const clients: Client[] = await listClients()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <p className="text-gray-600">Gestión unificada de clientes, contactos y directorio</p>
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
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Directorio Exclusivo de Clientes</h2>
              <p className="text-sm text-gray-600">Gestión completa del directorio de clientes empresariales</p>
            </div>
            <ClientList clients={clients} />
          </div>
        </TabsContent>

        <TabsContent value="contactos" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Contactos de Clientes</h2>
              <p className="text-sm text-gray-600">Base de contactos vinculada exclusivamente a clientes</p>
            </div>
            <Suspense fallback={<ContactsPageSkeleton />}>
              <ContactsClient />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="todos" className="mt-6">
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Vista Unificada - Clientes</h2>
                <p className="text-sm text-gray-600">
                  Directorio completo y contactos integrados en el módulo de clientes
                </p>
              </div>
              <ClientList clients={clients} />
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Contactos Asociados</h2>
                <p className="text-sm text-gray-600">Todos los contactos vinculados a los clientes del sistema</p>
              </div>
              <Suspense fallback={<ContactsPageSkeleton />}>
                <ContactsClient />
              </Suspense>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ContactsPageSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  )
}
