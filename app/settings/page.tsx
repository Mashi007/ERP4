import type React from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Users, PanelsTopLeft, Database, PlugZap, SettingsIcon, ChevronRight, Banknote } from "lucide-react"

type SettingItem = {
  title: string
  description: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const items: SettingItem[] = [
  {
    title: "Prospectos, Contactos y Cuentas",
    description: "Administra las personas y empresas con las que trabajas",
    href: "/settings/leads-contacts-accounts",
    icon: Users,
  },
  {
    title: "Negocios y Embudos",
    description: "Gestiona tus productos, servicios y procesos de venta",
    href: "/settings/deals-pipelines",
    icon: PanelsTopLeft,
  },
  {
    title: "Datos e Importación",
    description: "Importa información desde archivos u otros CRMs",
    href: "/settings/data-import",
    icon: Database,
  },
  {
    title: "Aplicaciones e Integraciones",
    description: "Extiende el CRM con sistemas y aplicaciones externas",
    href: "/settings/integrations",
    icon: PlugZap,
  },
  {
    title: "Ajustes de la cuenta",
    description: "Configura opciones globales, facturación y suscripciones",
    href: "/settings/account",
    icon: SettingsIcon,
  },
  {
    title: "Moneda",
    description: "Configura la moneda de trabajo (EUR, USD, MXN) que afecta a todos los módulos",
    href: "/settings/moneda",
    icon: Banknote,
  },
]

export default function ConfiguracionInicio() {
  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600">Administra tu CRM: personas, embudos, integraciones y cuenta.</p>
        </header>

        <Card className="p-2 md:p-4">
          <ul role="list" aria-label="Secciones de configuración" className="divide-y">
            {items.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.href} role="listitem">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-start gap-4 rounded-lg px-4 py-4 transition-colors md:px-5",
                      "hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    )}
                  >
                    <div
                      className="mt-1 flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white"
                      aria-hidden="true"
                    >
                      <Icon className="h-5 w-5 text-gray-700" />
                    </div>

                    <div className="flex-1">
                      <h2 className="text-base font-semibold text-gray-900">{item.title}</h2>
                      <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                    </div>

                    <ChevronRight className="mt-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>
    </div>
  )
}
