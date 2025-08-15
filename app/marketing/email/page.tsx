import EmailMarketingSection from "@/components/marketing/email-marketing-section"

export default function EmailMarketingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <svg className="mr-3 h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Email Marketing
          </h1>
          <p className="text-gray-600">
            Selecciona clientes, redacta emails con Grok AI y envía campañas personalizadas
          </p>
        </div>

        {/* Email Marketing Section */}
        <EmailMarketingSection />
      </div>
    </div>
  )
}
