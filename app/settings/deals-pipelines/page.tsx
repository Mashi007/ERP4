import type React from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { DollarSign, ClipboardList, LayoutGrid, Target, LineChart, Package, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Tile = {
  title: string
  description: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  highlighted?: boolean
}

const tiles: Tile[] = [
  {
    title: "Negocios",
    description: "Administra todos los campos necesarios para crear y actualizar negocios",
    href: "/settings/deals-pipelines/deals",
    icon: DollarSign,
    highlighted: true,
  },
  {
    title: "Actividades de ventas",
    description: "Configura tipos de actividad, resultados y su seguimiento",
    href: "/settings/deals-pipelines/sales-activities",
    icon: ClipboardList,
  },
  {
    title: "Embudos",
    description: "Define etapas, probabilidades y flujos de tu pipeline",
    href: "/settings/deals-pipelines/pipelines",
    icon: LayoutGrid,
  },
  {
    title: "Metas de actividad",
    description: "Establece objetivos de actividad para tu equipo",
    href: "/settings/deals-pipelines/activity-goals",
    icon: Target,
  },
  {
    title: "Cuotas y pronósticos",
    description: "Asigna cuotas y proyecta el desempeño de ventas",
    href: "/settings/deals-pipelines/quotas-forecasting",
    icon: LineChart,
  },
  {
    title: "Catálogo de productos",
    description: "Gestiona productos y servicios asociados a tus negocios",
    href: "/settings/deals-pipelines/product-catalog",
    icon: Package,
  },
]

export default function DealsPipelinesSettings() {
  return (
    <main className="px-6 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{"Negocios y Embudos"}</h1>
        <p className="text-gray-600">{"Gestiona tus productos, servicios y procesos de venta"}</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => {
          const Icon = tile.icon
          return (
            <Card
              key={tile.title}
              className={cn(
                "group relative flex h-full flex-col rounded-lg border transition-colors",
                tile.highlighted ? "bg-gray-50" : "bg-white",
                "hover:bg-gray-50",
              )}
            >
              <Link
                href={tile.href}
                className="flex flex-1 items-start gap-4 p-4 outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <div
                  className={cn(
                    "mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg border",
                    tile.highlighted ? "border-gray-200 bg-white" : "border-gray-200 bg-white",
                  )}
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5 text-gray-700" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">{tile.title}</h2>
                    <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{tile.description}</p>
                </div>
              </Link>
            </Card>
          )
        })}
      </div>
    </main>
  )
}
