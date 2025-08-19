"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  BarChart3,
  Users,
  Target,
  Package,
  Calendar,
  Settings,
  Menu,
  ChevronDown,
  ChevronRight,
  Megaphone,
  FolderKanban,
} from "lucide-react"

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
      { name: "Directorio", href: "/clientes" },
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
    name: "Gest. Proyectos",
    href: "/proyectos",
    icon: FolderKanban,
    subItems: [
      { name: "Gest. Normas", href: "/proyectos/normas" },
      { name: "Proyectos", href: "/proyectos" },
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
    name: "Marketing",
    href: "/marketing",
    icon: Megaphone,
    subItems: [
      { name: "Campañas", href: "/marketing" },
      { name: "Email Marketing", href: "/marketing/email" },
    ],
  },
  {
    name: "Configuración",
    href: "/settings",
    icon: Settings,
    subItems: [
      { name: "General", href: "/settings" },
      { name: "Usuarios", href: "/settings/users" },
      { name: "Datos de la Empresa", href: "/settings/company" },
      { name: "Formularios", href: "/settings/forms" },
      { name: "Calendario", href: "/communications/calendar" },
      { name: "Comunicaciones", href: "/communications/configuration" },
      { name: "Vincular WhatsApp", href: "/communications/whatsapp" },
    ],
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
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 mt-10 bg-gradient-to-r from-[#1A4F7A] to-[#2563eb] shadow-lg">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20Norma.jpg-YPDdPAzITwhmyNAXSwzvRsneG7Uhf4.jpeg"
            alt="NormaPymes"
            className="h-72 w-auto object-contain drop-shadow-lg"
          />
        </Link>
      </div>
      <ScrollArea className="flex-1 bg-gradient-to-b from-slate-50 to-white">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4">
          {navigation.map((item) => {
            const Icon = item.icon
            const hasSubItems = item.subItems && item.subItems.length > 0
            const expanded = isExpanded(item.name)

            return (
              <div key={item.name} className="mb-1">
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition-all duration-200 cursor-pointer font-medium shadow-sm hover:shadow-md",
                    "hover:bg-gradient-to-r hover:from-[#1A4F7A]/10 hover:to-[#2563eb]/10 hover:text-[#1A4F7A] hover:scale-[1.02]",
                    isActive(item.href) &&
                      "bg-gradient-to-r from-[#1A4F7A] to-[#2563eb] text-white shadow-lg scale-[1.02]",
                  )}
                  onClick={() => {
                    if (hasSubItems) {
                      toggleExpanded(item.name)
                    }
                  }}
                >
                  <Icon className="h-5 w-5" />
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
                  <div className="ml-8 mt-2 space-y-1 border-l-2 border-[#1A4F7A]/20 pl-4">
                    {item.subItems?.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all duration-200 text-sm font-medium",
                          "hover:bg-[#1A4F7A]/5 hover:text-[#1A4F7A] hover:translate-x-1",
                          isSubItemActive(subItem.href) &&
                            "bg-[#1A4F7A]/10 text-[#1A4F7A] font-semibold border-l-2 border-[#1A4F7A]",
                        )}
                      >
                        <div className="w-2 h-2 rounded-full bg-current opacity-50"></div>
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
      <div className={cn("hidden border-r bg-white shadow-xl md:block", className)}>
        <SidebarContent />
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden bg-[#1A4F7A] text-white border-[#1A4F7A] hover:bg-[#1A4F7A]/90"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col bg-white">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
