import type { FC } from "react"
import { ClientFiles } from "@/components/clients/client-files"

type PageProps = {
  params: { id?: string }
}

const ArchivosPage: FC<PageProps> = ({ params }) => {
  const clientId = params?.id ?? "1"

  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Archivos</h1>
        <p className="text-sm text-muted-foreground">
          Administra, reemplaza y describe los documentos asociados a este cliente.
        </p>
      </header>

      <section aria-label="Tabla de archivos del cliente">
        <ClientFiles clientId={clientId} />
      </section>
    </main>
  )
}

export default ArchivosPage
