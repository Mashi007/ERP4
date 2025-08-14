"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BarChart3, Users, Target, Package, Calendar, Settings, Menu, ChevronDown, ChevronRight } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    subItems: [{ name: "Panel Principal", href: "/dashboard" }],
  },
  {
    name: "Clientes",
    href: "/clientes",
    icon: Users,
    subItems: [
      { name: "Contactos", href: "/contacts" },
      { name: "Lista de Clientes", href: "/clientes" },
      { name: "Conversaciones", href: "/communications/conversations" },
      { name: "Calendario", href: "/communications/calendar" },
      { name: "Configuración", href: "/communications/configuration" },
      { name: "Vincular WhatsApp", href: "/communications/whatsapp" },
    ],
  },
  {
    name: "Ventas",
    href: "/pipeline",
    icon: Target,
    subItems: [
      { name: "Embudo", href: "/pipeline/embudo" },
      { name: "Oportunidades", href: "/pipeline/oportunidades" },
    ],
  },
  {
    name: "Servicios",
    href: "/servicios",
    icon: Package,
    subItems: [
      { name: "Catálogo", href: "/servicios" },
      { name: "Propuestas", href: "/servicios/propuestas" },
    ],
  },
  {
    name: "Citas",
    href: "/appointments",
    icon: Calendar,
  },
  {
    name: "Configuración",
    href: "/settings",
    icon: Settings,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName],
    )
  }

  const isExpanded = (itemName: string) => expandedItems.includes(itemName)

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/" || pathname === "/dashboard"
    }
    return pathname.startsWith(href)
  }

  const isSubItemActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/" || pathname === "/dashboard"
    }
    return pathname === href
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <img src="/normapymes-logo.jpg" alt="NormaPymes" className="h-8 w-auto object-contain" />
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navigation.map((item) => {
            const Icon = item.icon
            const hasSubItems = item.subItems && item.subItems.length > 0
            const expanded = isExpanded(item.name)

            return (
              <div key={item.name}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary cursor-pointer",
                    isActive(item.href) && "bg-muted text-primary",
                  )}
                  onClick={() => {
                    if (hasSubItems) {
                      toggleExpanded(item.name)
                    }
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {hasSubItems ? (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </>
                  ) : (
                    <Link href={item.href} className="flex-1">
                      {item.name}
                    </Link>
                  )}
                </div>
                {hasSubItems && expanded && (
                  <div className="ml-6 space-y-1">
                    {item.subItems?.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary text-sm",
                          isSubItemActive(subItem.href) && "bg-muted text-primary",
                        )}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </ScrollArea>
    </div>
  )

  return (
    <>
      <div className={cn("hidden border-r bg-muted/40 md:block", className)}>
        <SidebarContent />
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden bg-transparent">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
