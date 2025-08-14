export default function ClientPropuestasPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Propuestas</h1>
        <p className="text-sm text-muted-foreground">Gestiona las propuestas comerciales enviadas a este cliente.</p>
      </header>

      <section className="space-y-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-600">
            Próximamente: Lista de propuestas, estados de seguimiento y herramientas de gestión.
          </p>
        </div>
      </section>
    </div>
  )
}
