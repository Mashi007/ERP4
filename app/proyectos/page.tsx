"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowLeft } from "lucide-react"

export default function ProyectosPage() {
  const [projects] = useState([
    {
      id: 1,
      name: "Implementación CRM Enterprise",
      description: "Sistema completo de gestión de relaciones con clientes",
      status: "En Progreso",
      progress: 65,
      startDate: "2025-01-01",
      endDate: "2025-03-31",
      team: ["Juan Pérez", "María García", "Carlos López"],
      priority: "Alta",
      details: {
        number: "0027-25",
        client: "OCA INSTITUTO DE CERTIFICACION SL",
        project: "ID CONSULTING 2060 SL",
        linkedServices: "PROYECTOS 2023/2024 - Certificación ISO",
        associatedStandards: "NORMAS ASOCIADAS:",
        projectStatus: "Pend. Iniciar",
        documents: "Documentos Sin Compartir",
        billingCenter: "ID CONSULTING 2060 SL",
        hasTraining: "NO",
        certifyingCompany: "CERTIFICADORA",
        auditors: "AUDITORES",
        sharedDate: "Creado: 15/07/2025 05:22",
        validationDate: "Aceptado: 15/07/2025 12:22 Validado: -",
        consultants: "Consultores asignados",
        projectManager: "Jefe de proyecto asignado",
      },
    },
    {
      id: 2,
      name: "Migración Base de Datos",
      description: "Actualización del sistema de base de datos principal",
      status: "Planificado",
      progress: 15,
      startDate: "2025-02-01",
      endDate: "2025-04-15",
      team: ["Ana Martín", "Pedro Ruiz"],
      priority: "Media",
      details: {
        number: "0028-25",
        client: "ABC COMPANY",
        project: "ID MIGRATION 2061 SL",
        linkedServices: "SERVICIOS DE MIGRACIÓN",
        associatedStandards: "NORMAS DE BASE DE DATOS",
        projectStatus: "Planificado",
        documents: "Documentos Pendientes",
        billingCenter: "ID MIGRATION 2061 SL",
        hasTraining: "SI",
        certifyingCompany: "CERTIFICADORA XYZ",
        auditors: "AUDITORES XYZ",
        sharedDate: "Creado: 16/07/2025 08:30",
        validationDate: "Aceptado: - Validado: -",
        consultants: "Consultores XYZ",
        projectManager: "Jefe de Proyecto XYZ",
      },
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En Progreso":
        return "bg-blue-500"
      case "Completado":
        return "bg-green-500"
      case "Planificado":
        return "bg-yellow-500"
      case "Pausado":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "bg-red-100 text-red-800"
      case "Media":
        return "bg-yellow-100 text-yellow-800"
      case "Baja":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const [showFullScreenDetails, setShowFullScreenDetails] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)

  const handleShowDetails = (project: any) => {
    setSelectedProject(project)
    setShowFullScreenDetails(true)
  }

  const handleBackToProjects = () => {
    setShowFullScreenDetails(false)
    setSelectedProject(null)
  }

  const handleUpdateTraining = (project: any) => {
    console.log("[v0] Actualizar Formación:", project.name)
  }

  const handleShareDocuments = (project: any) => {
    console.log("[v0] Compartir Documentos:", project.name)
  }

  const handleUpdateStatus = (project: any) => {
    console.log("[v0] Actualizar Estado:", project.name)
  }

  const handleEditStandards = (project: any) => {
    console.log("[v0] Editar/Actualizar Normas:", project.name)
  }

  const handleValidateProject = (project: any) => {
    console.log("[v0] Validar Proyecto:", project.name)
  }

  const handleAddCertifyingCompany = (project: any) => {
    console.log("[v0] Añadir Empresa Certificadora:", project.name)
  }

  const handleAddAuditingCompany = (project: any) => {
    console.log("[v0] Añadir Empresa Auditora:", project.name)
  }

  const handleAddProjectManager = (project: any) => {
    console.log("[v0] Añadir Jefe de Proyecto:", project.name)
  }

  if (showFullScreenDetails && selectedProject) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToProjects}
                className="flex items-center gap-2 text-[#1A4F7A] hover:bg-[#1A4F7A]/10"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a Proyectos
              </Button>
              <h1 className="text-2xl font-bold text-[#1A4F7A]">Detalles del Proyecto</h1>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Mostrar</span>
                  <select className="border rounded-lg px-3 py-2 text-sm bg-white min-w-[80px]">
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                  <span className="text-sm text-gray-600">registros por página</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Buscar:</span>
                  <input
                    type="text"
                    className="border rounded-lg px-3 py-2 text-sm min-w-[200px]"
                    placeholder="Buscar proyectos..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white">
                    📊
                  </Button>
                  <Button size="sm" className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white">
                    📄
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proyecto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Norma(s) Servicios Vinculados del Contrato
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado Proyecto Documentos
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Centro de Facturación Tiene Formación
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empresa Certificadora Auditores
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Compartido Fecha Validación
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Consultores
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jefe de Proyecto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm">
                      <div className="text-blue-600 font-medium">{selectedProject.details.number}</div>
                      <div className="text-blue-500 text-xs">{selectedProject.details.project}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-blue-600 font-medium">{selectedProject.details.client}</td>
                    <td className="px-4 py-4 text-sm">
                      <div className="font-medium text-gray-900">{selectedProject.details.project}</div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="text-blue-600 font-medium">{selectedProject.details.linkedServices}</div>
                      <div className="text-gray-600 text-xs">Certificación ISO</div>
                      <div className="text-blue-600 text-xs mt-1">🔗 {selectedProject.details.associatedStandards}</div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <Badge className="bg-blue-100 text-blue-800 mb-1">{selectedProject.details.projectStatus}</Badge>
                      <div className="text-red-600 text-xs font-medium">{selectedProject.details.documents}</div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="text-gray-900 mb-1 font-medium">{selectedProject.details.billingCenter}</div>
                      <Badge className="bg-red-500 text-white">{selectedProject.details.hasTraining}</Badge>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="text-blue-600 mb-1 font-medium">{selectedProject.details.certifyingCompany}</div>
                      <div className="text-blue-600 font-medium">{selectedProject.details.auditors}</div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="text-gray-600 text-xs mb-1">{selectedProject.details.sharedDate}</div>
                      <div className="text-gray-600 text-xs">{selectedProject.details.validationDate}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{selectedProject.details.consultants}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{selectedProject.details.projectManager}</td>
                    <td className="px-4 py-4 text-sm">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-1">
                            <span className="text-gray-400 text-lg">⋮</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64">
                          <DropdownMenuItem
                            onClick={() => handleUpdateTraining(selectedProject)}
                            className="flex items-center gap-3 py-3"
                          >
                            <span className="text-lg">📚</span>
                            <span className="text-sm text-gray-700">Actualizar Formación</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleShareDocuments(selectedProject)}
                            className="flex items-center gap-3 py-3"
                          >
                            <span className="text-lg">🔗</span>
                            <span className="text-sm text-gray-700">Compartir Documentos</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(selectedProject)}
                            className="flex items-center gap-3 py-3"
                          >
                            <span className="text-lg">📊</span>
                            <span className="text-sm text-gray-700">Actualizar Estado</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditStandards(selectedProject)}
                            className="flex items-center gap-3 py-3"
                          >
                            <span className="text-lg">🔄</span>
                            <span className="text-sm text-gray-700">Editar/Actualizar Normas</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleValidateProject(selectedProject)}
                            className="flex items-center gap-3 py-3"
                          >
                            <span className="text-lg">✓</span>
                            <span className="text-sm text-gray-700">Validar Proyecto</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAddCertifyingCompany(selectedProject)}
                            className="flex items-center gap-3 py-3"
                          >
                            <span className="text-lg">🏢</span>
                            <span className="text-sm text-gray-700">Añadir Empresa Certificadora</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAddAuditingCompany(selectedProject)}
                            className="flex items-center gap-3 py-3"
                          >
                            <span className="text-lg">🏛️</span>
                            <span className="text-sm text-gray-700">Añadir Empresa Auditora</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAddProjectManager(selectedProject)}
                            className="flex items-center gap-3 py-3"
                          >
                            <span className="text-lg">👤</span>
                            <span className="text-sm text-gray-700">Añadir Jefe de Proyecto</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-red-500 text-xl">📎</span>
                <h2 className="text-xl font-bold text-blue-600">Documentos Compartidos</h2>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Mostrar</span>
                  <select className="border rounded-lg px-3 py-2 text-sm bg-white">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                  </select>
                  <span className="text-sm text-gray-600">registros por página</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        URL Documento
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        URL Ayuda
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Permiso
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha Enviado
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                        No se ha encontrado ningún registro
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
                <span>No hay registros disponibles</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    ← Anterior
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Siguiente →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#1A4F7A]">Proyectos</h2>
          <p className="text-muted-foreground">Gestiona y supervisa todos los proyectos de la organización</p>
        </div>
        <Button className="bg-[#1A4F7A] hover:bg-[#1A4F7A]/90">
          {/* Placeholder for Plus icon */}
          <span className="mr-2 h-4 w-4">+</span>
          Nuevo Proyecto
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge className={getPriorityColor(project.priority)}>{project.priority}</Badge>
                <Badge className={`${getStatusColor(project.status)} text-white`}>{project.status}</Badge>
              </div>
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                {/* Placeholder for Calendar and Users icons */}
                <div className="flex items-center gap-2">
                  <span className="mr-2 h-4 w-4">📅</span>
                  <span>
                    {project.startDate} - {project.endDate}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="mr-2 h-4 w-4">👥</span>
                  <span>{project.team.length} miembros</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => handleShowDetails(project)}
                >
                  Detalles
                </Button>
                <Button size="sm" className="flex-1 bg-[#1A4F7A] hover:bg-[#1A4F7A]/90">
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
