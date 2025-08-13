"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Mail, Calendar, Phone, Building, Zap } from "lucide-react"
import Link from "next/link"

const useEmailConfigStatus = () => {
  const [emailStatus, setEmailStatus] = useState("pending")

  useEffect(() => {
    const checkEmailConfig = () => {
      const gmailConnected = localStorage.getItem("gmail_connected") === "true"
      const outlookConnected = localStorage.getItem("outlook_connected") === "true"
      const smtpConfigured = localStorage.getItem("smtp_configured") === "true"

      if (gmailConnected || outlookConnected || smtpConfigured) {
        setEmailStatus("configured")
      } else {
        setEmailStatus("pending")
      }
    }

    checkEmailConfig()

    const handleStorageChange = () => checkEmailConfig()
    window.addEventListener("storage", handleStorageChange)

    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return emailStatus
}

const configurationSections = [
  {
    id: "contacts",
    title: "Contactos y Clientes",
    description: "Gestión de campos personalizados y configuración de contactos",
    icon: Users,
    href: "/settings/contacts",
    status: "configured",
    category: "principal",
  },
  {
    id: "deals-pipelines",
    title: "Negocios y Embudos",
    description: "Configuración de pipeline de ventas y gestión de oportunidades",
    icon: Building,
    href: "/settings/deals-pipelines",
    status: "configured",
    category: "principal",
  },
  {
    id: "email",
    title: "Configuración de Email",
    description: "Configurar servidores SMTP y plantillas de email",
    icon: Mail,
    href: "/settings/email",
    status: "dynamic",
    category: "comunicaciones",
  },
  {
    id: "calendar",
    title: "Calendario",
    description: "Integración con calendarios externos y configuración de citas",
    icon: Calendar,
    href: "/settings/calendar",
    status: "pending",
    category: "comunicaciones",
  },
  {
    id: "phone",
    title: "Telefonía",
    description: "Configuración de VoIP y registro de llamadas",
    icon: Phone,
    href: "/settings/phone",
    status: "pending",
    category: "comunicaciones",
  },
  {
    id: "integrations",
    title: "Integraciones",
    description: "Conectar con herramientas externas y APIs",
    icon: Zap,
    href: "/integrations",
    status: "configured",
    category: "empresa",
  },
]

const categories = [
  {
    id: "principal",
    title: "Configuración Principal",
    description: "Configuraciones básicas del sistema",
  },
  {
    id: "comunicaciones",
    title: "Comunicaciones",
    description: "Email, teléfono y calendario",
  },
  {
    id: "empresa",
    title: "Empresa",
    description: "Configuraciones empresariales y de seguridad",
  },
]

export default function SettingsPage() {
  const emailStatus = useEmailConfigStatus()

  const getStatusBadge = (status: string, itemId?: string) => {
    const actualStatus = itemId === "email" ? emailStatus : status

    switch (actualStatus) {
      case "configured":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Configurado</Badge>
      case "pending":
        return <Badge variant="secondary">Pendiente</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">No configurado</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground text-lg">Personaliza tu CRM según las necesidades de tu empresa</p>
      </div>

      {categories.map((category) => {
        const categoryItems = configurationSections.filter((item) => item.category === category.id)

        if (categoryItems.length === 0) return null

        return (
          <div key={category.id} className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{category.title}</h2>
              <p className="text-muted-foreground">{category.description}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <CardTitle className="text-base">{item.title}</CardTitle>
                            {getStatusBadge(item.status, item.id)}
                          </div>
                        </div>
                      </div>
                      <CardDescription className="text-sm">{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Link href={item.href}>
                        <Button className="w-full bg-transparent" variant="outline">
                          Configurar
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
