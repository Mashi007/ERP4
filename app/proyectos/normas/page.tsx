"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Plus, FileText, Download, Eye } from "lucide-react"

export default function GestNormasPage() {
  const [normas] = useState([
    {
      id: 1,
      codigo: "ISO-9001",
      nombre: "Sistema de Gestión de Calidad",
      version: "2015",
      estado: "Vigente",
      fechaRevision: "2024-12-01",
      responsable: "María García",
      categoria: "Calidad",
    },
    {
      id: 2,
      codigo: "ISO-27001",
      nombre: "Sistema de Gestión de Seguridad de la Información",
      version: "2022",
      estado: "En Revisión",
      fechaRevision: "2025-01-15",
      responsable: "Carlos López",
      categoria: "Seguridad",
    },
    {
      id: 3,
      codigo: "ISO-14001",
      nombre: "Sistema de Gestión Ambiental",
      version: "2015",
      estado: "Vigente",
      fechaRevision: "2024-11-20",
      responsable: "Ana Martín",
      categoria: "Ambiental",
    },
  ])

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Vigente":
        return "bg-green-100 text-green-800"
      case "En Revisión":
        return "bg-yellow-100 text-yellow-800"
      case "Vencida":
        return "bg-red-100 text-red-800"
      case "Borrador":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case "Calidad":
        return "bg-purple-100 text-purple-800"
      case "Seguridad":
        return "bg-red-100 text-red-800"
      case "Ambiental":
        return "bg-green-100 text-green-800"
      case "Operacional":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#1A4F7A]">Gestión de Normas</h2>
          <p className="text-muted-foreground">Administra y supervisa el cumplimiento de normas y estándares</p>
        </div>
        <Button className="bg-[#1A4F7A] hover:bg-[#1A4F7A]/90">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Norma
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar normas..." className="pl-8" />
        </div>
      </div>

      <div className="grid gap-4">
        {normas.map((norma) => (
          <Card key={norma.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    {norma.codigo}
                  </Badge>
                  <Badge className={getCategoriaColor(norma.categoria)}>{norma.categoria}</Badge>
                </div>
                <Badge className={getEstadoColor(norma.estado)}>{norma.estado}</Badge>
              </div>
              <CardTitle className="text-lg">{norma.nombre}</CardTitle>
              <CardDescription>
                Versión {norma.version} • Responsable: {norma.responsable}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Última revisión: {norma.fechaRevision}</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar
                  </Button>
                  <Button size="sm" className="bg-[#1A4F7A] hover:bg-[#1A4F7A]/90">
                    <FileText className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
