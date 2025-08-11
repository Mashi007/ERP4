import ClientConversations from "@/components/clients/client-conversations"

type PageProps = {
  params: { id: string }
}

export default function ConversacionesPage({ params }: PageProps) {
  // Render the conversations UI for the given client
  return (
    <main className="p-4 md:p-6">
      <div className="mx-auto w-full max-w-5xl">
        <ClientConversations clientId={params.id} />
      </div>
    </main>
  )
}
