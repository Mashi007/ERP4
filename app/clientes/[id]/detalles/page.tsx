import { getClient } from "../queries"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default async function ClientDetallesPage({
  params,
}: {
  params: { id: string }
}) {
  const c = await getClient(params.id)

  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Detalles del cliente</h2>
          <p className="text-sm text-gray-600">Campos y metadatos del contacto/cliente.</p>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-500">Nombre</div>
          <div className="font-medium">{c?.name ?? "—"}</div>
        </div>
        <div>
          <div className="text-gray-500">Empresa</div>
          <div className="font-medium">{c?.company ?? "—"}</div>
        </div>
        <div>
          <div className="text-gray-500">Cargo</div>
          <div className="font-medium">{c?.title ?? "—"}</div>
        </div>
        <div>
          <div className="text-gray-500">Email</div>
          <div className="font-medium">{c?.email ?? "—"}</div>
        </div>
        <div>
          <div className="text-gray-500">Teléfono</div>
          <div className="font-medium">{c?.phone ?? "—"}</div>
        </div>
        <div>
          <div className="text-gray-500">Score</div>
          <div className="font-medium">{c?.score ?? "—"}</div>
        </div>
      </CardContent>
    </Card>
  )
}
