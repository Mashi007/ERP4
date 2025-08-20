import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { CurrencyProvider } from "@/components/providers/currency-provider"
import { getOrgCurrency } from "@/lib/org-settings"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CRM System",
  description: "Sistema de gestión de relaciones con clientes",
  generator: "v0.dev",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const orgCurrency = await getOrgCurrency("default")

  return (
    <html lang="es">
      <body className={inter.className}>
        <CurrencyProvider initialCode={orgCurrency}>
          <div className="flex h-screen bg-gradient-to-br from-background via-muted/20 to-background">
            <Sidebar />
            <main className="flex-1 overflow-auto bg-gradient-to-b from-transparent to-muted/10 backdrop-blur-sm">
              <div className="min-h-full p-6">{children}</div>
            </main>
          </div>
        </CurrencyProvider>
      </body>
    </html>
  )
}
