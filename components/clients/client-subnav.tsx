"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

type Props = {
  clientId: string
}

export function ClientSubnav({ clientId }: Props) {
  const pathname = usePathname()

  const items = [
    { href: `/clientes/${clientId}`, label: "Resumen" },
    { href: `/clientes/${clientId}/conversaciones`, label: "Conversaciones" },
    { href: `/clientes/${clientId}/archivos`, label: "Archivos" },
    { href: `/clientes/${clientId}/oportunidades`, label: "Oportunidades" },
    { href: `/clientes/${clientId}/tickets`, label: "Tickets" },
    { href: `/clientes/${clientId}/detalles`, label: "Detalles" },
  ]

  return (
    <nav aria-label="Submenú Cliente" className="w-full">
      <ul className="flex items-center gap-2 border-b pb-2">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  "hover:bg-gray-100",
                  isActive ? "text-gray-900 bg-gray-100" : "text-gray-600",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
