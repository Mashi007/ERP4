import type { ReactNode } from "react"
import { ClientSubnav } from "@/components/clients/client-subnav"

export default function ClientLayout({
  children,
  params,
}: {
  children: ReactNode
  params: { id: string }
}) {
  const { id } = params

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="px-6 pt-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Cliente</h1>
          <p className="text-gray-600">Perfil del cliente y módulos relacionados</p>
        </div>

        <ClientSubnav clientId={id} />
      </header>

      <main className="p-6">{children}</main>
    </div>
  )
}
