import { ClientAISummary } from "@/components/clients/client-ai-ask"

export default function ClientResumePage({ params }: { params: { id: string } }) {
  return (
    <div className="grid gap-6">
      <ClientAISummary clientId={params.id} />
      <section className="grid gap-2">
        <h2 className="text-lg font-semibold">Notas rápidas</h2>
        <p className="text-sm text-gray-600">
          Próximamente: KPIs del cliente, últimas conversaciones y oportunidades relacionadas.
        </p>
      </section>
    </div>
  )
}
