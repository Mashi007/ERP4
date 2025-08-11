import Link from "next/link"
import { listClients, type Client } from "./queries"
import ClientList from "@/components/clients/client-list"
import { Button } from "@/components/ui/button"

export default async function ClientesPage() {
  const clients: Client[] = await listClients()

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Directorio de clientes conectado con Contactos</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/contacts">Ir a Contactos</Link>
        </Button>
      </div>

      <ClientList clients={clients} />
    </div>
  )
}
