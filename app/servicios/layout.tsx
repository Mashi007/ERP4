import type { ReactNode } from "react"
import { ServiciosSubnav } from "@/components/servicios/servicios-subnav"

export default function ServiciosLayout({ children }: { children: ReactNode }) {
  return (
    <main className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Servicios</h1>
        <p className="text-sm text-muted-foreground">Gestión de catálogo y propuestas.</p>
      </header>
      <ServiciosSubnav />
      <section>{children}</section>
    </main>
  )
}
