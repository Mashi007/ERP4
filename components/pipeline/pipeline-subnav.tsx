"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const items = [
  { href: "/pipeline/oportunidades", label: "Oportunidades" },
  { href: "/pipeline/embudo", label: "Embudo" },
]

export function PipelineSubnav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Submenú Ventas" className="w-full">
      <ul className="flex items-center gap-2 border-b pb-2">
        {items.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/pipeline/embudo" && pathname?.startsWith(item.href))
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
