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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="directorio">Directorio de Clientes</TabsTrigger>
          <TabsTrigger value="contactos">Contactos</TabsTrigger>
          <TabsTrigger value="todos">Vista Unificada</TabsTrigger>
        </TabsList>

        <TabsContent value="directorio" className="mt-6">
          <ClientList clients={clients} />
        </TabsContent>

        <TabsContent value="contactos" className="mt-6">
          <Suspense fallback={<ContactsPageSkeleton />}>
            <ContactsClient />
          </Suspense>
        </TabsContent>

        <TabsContent value="todos" className="mt-6">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Directorio de Clientes</h2>
              <ClientList clients={clients} />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Base de Contactos</h2>
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
