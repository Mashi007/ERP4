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
    subItems: [],
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
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 mt-10 bg-gradient-to-r from-primary via-primary/90 to-secondary shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
        <Link href="/" className="flex items-center gap-2 font-semibold relative z-10">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20Norma.jpg-YPDdPAzITwhmyNAXSwzvRsneG7Uhf4.jpeg"
            alt="NormaPymes"
            className="h-72 w-auto object-contain drop-shadow-2xl"
          />
        </Link>
      </div>
      <ScrollArea className="flex-1 bg-gradient-to-b from-muted/30 via-background to-muted/20">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-6">
          {navigation.map((item) => {
            const Icon = item.icon
            const hasSubItems = item.subItems && item.subItems.length > 0
            const expanded = isExpanded(item.name)

            return (
              <div key={item.name} className="mb-2">
                <div
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-4 py-3 text-muted-foreground transition-all duration-300 cursor-pointer font-medium relative overflow-hidden",
                    "hover:bg-gradient-to-r hover:from-primary/10 hover:via-primary/5 hover:to-secondary/10",
                    "hover:text-primary hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20",
                    "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/20 before:to-secondary/20 before:opacity-0 before:transition-opacity before:duration-300",
                    "hover:before:opacity-100",
                    "after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:translate-x-[-100%] after:transition-transform after:duration-700",
                    "hover:after:translate-x-[100%]",
                    isActive(item.href) &&
                      "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-xl shadow-primary/30 scale-[1.02] pulse-glow",
                  )}
                  onClick={() => {
                    if (hasSubItems) {
                      toggleExpanded(item.name)
                    }
                  }}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-all duration-300 relative z-10",
                      "group-hover:scale-110 group-hover:drop-shadow-lg",
                      isActive(item.href) && "drop-shadow-lg",
                    )}
                  />
                  {hasSubItems ? (
                    <>
                      <span className="flex-1 relative z-10 font-semibold">{item.name}</span>
                      <div className="relative z-10">
                        {expanded ? (
                          <ChevronDown className="h-4 w-4 transition-transform duration-300 rotate-180" />
                        ) : (
                          <ChevronRight className="h-4 w-4 transition-transform duration-300" />
                        )}
                      </div>
                    </>
                  ) : (
                    <Link href={item.href} className="flex-1 relative z-10 font-semibold">
                      {item.name}
                    </Link>
                  )}
                </div>
                {hasSubItems && expanded && (
                  <div className="ml-8 mt-3 space-y-2 border-l-2 border-gradient-to-b from-primary/40 to-secondary/40 pl-4 relative">
                    <div className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-primary to-secondary opacity-60"></div>
                    {item.subItems?.map((subItem, index) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all duration-300 text-sm font-medium group relative overflow-hidden",
                          "hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 hover:text-primary hover:translate-x-2 hover:shadow-md",
                          "before:absolute before:left-0 before:top-0 before:w-0 before:h-full before:bg-gradient-to-r before:from-primary before:to-secondary before:transition-all before:duration-300",
                          "hover:before:w-1",
                          isSubItemActive(subItem.href) &&
                            "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-semibold translate-x-2 shadow-md before:w-1",
                        )}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            "bg-gradient-to-r from-primary to-secondary opacity-60",
                            "group-hover:opacity-100 group-hover:scale-125 group-hover:shadow-lg group-hover:shadow-primary/50",
                            isSubItemActive(subItem.href) && "opacity-100 scale-125 shadow-lg shadow-primary/50",
                          )}
                        ></div>
                        <span className="relative z-10">{subItem.name}</span>
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
      <div
        className={cn("hidden border-r bg-card/50 backdrop-blur-sm shadow-2xl md:block border-border/50", className)}
      >
        <SidebarContent />
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden bg-gradient-to-r from-primary to-secondary text-primary-foreground border-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col bg-card/95 backdrop-blur-sm">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
