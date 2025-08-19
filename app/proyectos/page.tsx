"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Calendar, Users, ArrowLeft, X } from "lucide-react"

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

  const [showDetails, setShowDetails] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)

  const handleShowDetails = (project: any) => {
    setSelectedProject(project)
    setShowDetails(true)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#1A4F7A]">Proyectos</h2>
          <p className="text-muted-foreground">Gestiona y supervisa todos los proyectos de la organización</p>
        </div>
        <Button className="bg-[#1A4F7A] hover:bg-[#1A4F7A]/90">
          <Plus className="mr-2 h-4 w-4" />
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
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {project.startDate} - {project.endDate}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
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

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="fixed inset-0 w-screen h-screen max-w-none max-h-none overflow-hidden flex flex-col m-0 p-0 rounded-none border-0">
          <DialogHeader className="flex-row items-center justify-between space-y-0 pb-4 border-b px-6 pt-4 bg-white">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setShowDetails(false)} className="p-1">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DialogTitle className="text-xl font-semibold text-[#1A4F7A]">Detalles del Proyecto</DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowDetails(false)} className="p-1">
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="flex-1 overflow-auto px-6 py-6 space-y-6 bg-gray-50">
            {selectedProject && (
              <>
                <div className="bg-white rounded-lg border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                            #
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                            Cliente
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                            Proyecto
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                            Norma(s) Servicios Vinculados del Contrato
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                            Estado Proyecto Documentos
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                            Centro de Facturación Tiene Formación
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                            Empresa Certificadora Auditores
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                            Fecha Compartido Fecha Validación
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[9%]">
                            Consultores
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[9%]">
                            Jefe de Proyecto
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 text-sm text-blue-600">
                            {selectedProject.details.number}
                            <br />
                            <span className="text-blue-500">{selectedProject.details.project}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-blue-600">{selectedProject.details.client}</td>
                          <td className="px-6 py-4 text-sm">
                            <div className="text-gray-900 font-medium">{selectedProject.details.project}</div>
                            <div className="text-blue-600 text-xs mt-1">
                              🔗 {selectedProject.details.associatedStandards}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="text-blue-600">{selectedProject.details.linkedServices}</div>
                            <div className="text-gray-600 text-xs mt-1">Certificación ISO</div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <Badge className="bg-blue-100 text-blue-800 mb-2">
                              {selectedProject.details.projectStatus}
                            </Badge>
                            <div className="text-red-600 text-xs">{selectedProject.details.documents}</div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="text-gray-900 mb-1">{selectedProject.details.billingCenter}</div>
                            <Badge className="bg-red-500 text-white">{selectedProject.details.hasTraining}</Badge>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="text-blue-600 mb-1">{selectedProject.details.certifyingCompany}</div>
                            <div className="text-blue-600">{selectedProject.details.auditors}</div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="text-gray-600 text-xs mb-1">{selectedProject.details.sharedDate}</div>
                            <div className="text-gray-600 text-xs">{selectedProject.details.validationDate}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{selectedProject.details.consultants}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{selectedProject.details.projectManager}</td>
                          <td className="px-6 py-4 text-sm">
                            <Button variant="ghost" size="sm" className="p-1">
                              <span className="text-gray-400">⋮</span>
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-lg border">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-red-500">📎</span>
                      <h3 className="text-lg font-semibold text-blue-600">Documentos Compartidos</h3>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Mostrar</span>
                        <select className="border rounded px-2 py-1 text-sm">
                          <option>10</option>
                          <option>25</option>
                          <option>50</option>
                        </select>
                        <span className="text-sm text-gray-600">registros por página</span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]">
                              URL Documento
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                              URL Ayuda
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                              Permiso
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                              Fecha Enviado
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                              Estado
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                              No se ha encontrado ningún registro
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                      <span>No hay registros disponibles</span>
                      <div className="flex items-center gap-2">
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
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
