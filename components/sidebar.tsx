"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/clientes", label: "Clientes" },
  { href: "/contacts", label: "Contactos" },
  { href: "/appointments", label: "Citas" },
  { href: "/pipeline", label: "Ventas" },
  { href: "/servicios", label: "Servicios" }, // NEW
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="sticky top-0 hidden h-svh w-56 shrink-0 border-r bg-background p-3 md:block">
      <nav className="flex flex-col gap-1">
        {items.map((i) => {
          const active = pathname === i.href || pathname?.startsWith(i.href + "/")
          return (
            <Link
              key={i.href}
              href={i.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm hover:bg-accent",
                active ? "bg-accent font-medium text-accent-foreground" : "text-foreground",
              )}
            >
              {i.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
