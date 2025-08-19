"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  Calendar,
  Users,
  MoreHorizontal,
  FileText,
  Share,
  CheckCircle,
  Edit,
  Building,
  UserPlus,
  ArrowLeft,
} from "lucide-react"

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
      client: "OCA INSTITUTO DE CERTIFICACION SL",
      projectCode: "ID CONSULTING 2060 SL",
      linkedServices: "PROYECTOS 2023/2024\nCertificación ISO",
      associatedStandards: "NORMAS ASOCIADAS:",
      projectStatus: "Pend. Iniciar",
      documents: "Documentos Sin Compartir",
      billingCenter: "ID CONSULTING 2060 SL",
      certifyingCompany: "CERTIFICADORA AUDITORES",
      sharedDate: {
        created: "15/07/2025 05:22",
        accepted: "15/07/2025 12:22",
        validated: "-",
      },
      consultants: ["Consultor 1", "Consultor 2"],
      projectManager: "Jefe Proyecto 1",
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
      client: "CLIENTE 2",
      projectCode: "ID CONSULTING 2061 SL",
      linkedServices: "SERVICIOS 2023/2024",
      associatedStandards: "NORMAS ASOCIADAS:",
      projectStatus: "Planificado",
      documents: "Documentos Compartidos",
      billingCenter: "ID CONSULTING 2061 SL",
      certifyingCompany: "CERTIFICADORA AUDITORES 2",
      sharedDate: {
        created: "16/07/2025 06:30",
        accepted: "16/07/2025 13:45",
        validated: "17/07/2025 09:00",
      },
      consultants: ["Consultor 3", "Consultor 4"],
      projectManager: "Jefe Proyecto 2",
    },
  ])

  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState("10")

  const sharedDocuments = [
    // Empty for now to match the "No se ha encontrado ningún registro" state
  ]

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

  const handleViewDetails = (project: any) => {
    setSelectedProject(project)
    setShowDetails(true)
  }

  const handleMenuAction = (action: string, project: any) => {
    console.log(`[v0] Menu action: ${action} for project:`, project.name)
    // Here you would implement the actual functionality for each action
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
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => handleViewDetails(project)}
                >
                  Ver Detalles
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
        <DialogContent className="max-w-[calc(100vw-280px)] w-[calc(100vw-280px)] ml-[240px] max-h-[95vh] h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0 pb-4 border-b">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setShowDetails(false)} className="hover:bg-gray-100">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <DialogTitle className="text-2xl font-bold text-[#1A4F7A]">Detalles del Proyecto</DialogTitle>
            </div>
          </DialogHeader>

          {selectedProject && (
            <div className="flex-1 overflow-y-auto space-y-8 py-6">
              <div className="bg-white rounded-lg border shadow-sm">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-[#1A4F7A]/5 to-[#1A4F7A]/10 border-b-2 border-[#1A4F7A]/20">
                        <TableHead className="text-sm font-semibold text-[#1A4F7A] py-4 px-6">#</TableHead>
                        <TableHead className="text-sm font-semibold text-[#1A4F7A] py-4 px-6">CLIENTE</TableHead>
                        <TableHead className="text-sm font-semibold text-[#1A4F7A] py-4 px-6">PROYECTO</TableHead>
                        <TableHead className="text-sm font-semibold text-[#1A4F7A] py-4 px-6 min-w-[200px]">
                          NORMA(S) SERVICIOS VINCULADOS DEL CONTRATO
                        </TableHead>
                        <TableHead className="text-sm font-semibold text-[#1A4F7A] py-4 px-6 min-w-[180px]">
                          ESTADO PROYECTO DOCUMENTOS
                        </TableHead>
                        <TableHead className="text-sm font-semibold text-[#1A4F7A] py-4 px-6 min-w-[180px]">
                          CENTRO DE FACTURACIÓN TIENE FORMACIÓN
                        </TableHead>
                        <TableHead className="text-sm font-semibold text-[#1A4F7A] py-4 px-6 min-w-[180px]">
                          EMPRESA CERTIFICADORA AUDITORES
                        </TableHead>
                        <TableHead className="text-sm font-semibold text-[#1A4F7A] py-4 px-6 min-w-[160px]">
                          FECHA COMPARTIDO FECHA VALIDACIÓN
                        </TableHead>
                        <TableHead className="text-sm font-semibold text-[#1A4F7A] py-4 px-6">CONSULTORES</TableHead>
                        <TableHead className="text-sm font-semibold text-[#1A4F7A] py-4 px-6">
                          JEFE DE PROYECTO
                        </TableHead>
                        <TableHead className="text-sm font-semibold text-[#1A4F7A] py-4 px-6">ACCIONES</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="hover:bg-gray-50/50 transition-colors">
                        <TableCell className="py-6 px-6">
                          <div className="text-blue-600 cursor-pointer font-medium hover:text-blue-800">0027-25</div>
                          <div className="text-blue-600 cursor-pointer text-sm hover:text-blue-800">
                            ID CONSULTING 2060 SL
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-6">
                          <div className="text-blue-600 cursor-pointer font-medium hover:text-blue-800">
                            {selectedProject.client}
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-6">
                          <div className="font-semibold text-gray-900">{selectedProject.projectCode}</div>
                          <div className="text-blue-600 text-sm mt-2 hover:text-blue-800 cursor-pointer">
                            {selectedProject.associatedStandards}
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-6">
                          <div className="text-blue-600 cursor-pointer hover:text-blue-800 whitespace-pre-line">
                            {selectedProject.linkedServices}
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-6">
                          <Badge className="bg-purple-100 text-purple-800 text-sm px-3 py-1 mb-2">Pend. Iniciar</Badge>
                          <div>
                            <Badge className="bg-red-100 text-red-800 text-sm px-3 py-1">
                              Documentos Sin Compartir
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-6">
                          <div className="font-medium text-gray-900 mb-2">{selectedProject.billingCenter}</div>
                          <Badge className="bg-red-500 text-white text-sm px-3 py-1">NO</Badge>
                        </TableCell>
                        <TableCell className="py-6 px-6">
                          <div className="text-blue-600 font-medium hover:text-blue-800 cursor-pointer">
                            {selectedProject.certifyingCompany}
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-6">
                          <div className="space-y-1 text-sm">
                            <div>
                              <span className="font-medium">Creado:</span> {selectedProject.sharedDate.created}
                            </div>
                            <div>
                              <span className="font-medium">Aceptado:</span> {selectedProject.sharedDate.accepted}
                            </div>
                            <div>
                              <span className="font-medium">Validado:</span> {selectedProject.sharedDate.validated}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-6">
                          <div className="text-sm">{selectedProject.consultants.join(", ")}</div>
                        </TableCell>
                        <TableCell className="py-6 px-6">
                          <div className="text-sm font-medium">{selectedProject.projectManager}</div>
                        </TableCell>
                        <TableCell className="py-6 px-6">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                                <MoreHorizontal className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64">
                              <DropdownMenuItem onClick={() => handleMenuAction("update-training", selectedProject)}>
                                <FileText className="mr-2 h-4 w-4" />
                                Actualizar Formación
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMenuAction("share-documents", selectedProject)}>
                                <Share className="mr-2 h-4 w-4" />
                                Compartir Documentos
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMenuAction("update-status", selectedProject)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Actualizar Estado
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMenuAction("edit-standards", selectedProject)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar/Actualizar Normas
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMenuAction("validate-project", selectedProject)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Validar Proyecto
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleMenuAction("add-certifying-company", selectedProject)}
                              >
                                <Building className="mr-2 h-4 w-4" />
                                Añadir Empresa Certificadora
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleMenuAction("add-auditing-company", selectedProject)}
                              >
                                <Building className="mr-2 h-4 w-4" />
                                Añadir Empresa Auditora
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleMenuAction("add-project-manager", selectedProject)}
                              >
                                <UserPlus className="mr-2 h-4 w-4" />
                                Añadir Jefe de Proyecto
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="bg-white rounded-lg border shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="h-6 w-6 text-red-500" />
                  <h3 className="text-xl font-bold text-blue-600">Documentos Compartidos</h3>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Mostrar</span>
                    <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm font-medium">registros por página</span>
                  </div>
                </div>

                <div className="overflow-x-auto border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                        <TableHead className="text-sm font-semibold text-gray-700 py-4 px-6">URL DOCUMENTO</TableHead>
                        <TableHead className="text-sm font-semibold text-gray-700 py-4 px-6">URL AYUDA</TableHead>
                        <TableHead className="text-sm font-semibold text-gray-700 py-4 px-6">PERMISO</TableHead>
                        <TableHead className="text-sm font-semibold text-gray-700 py-4 px-6">FECHA ENVIADO</TableHead>
                        <TableHead className="text-sm font-semibold text-gray-700 py-4 px-6">ESTADO</TableHead>
                        <TableHead className="text-sm font-semibold text-gray-700 py-4 px-6">ACCIONES</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sharedDocuments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                            <div className="flex flex-col items-center gap-2">
                              <FileText className="h-12 w-12 text-gray-300" />
                              <span className="text-lg">No se ha encontrado ningún registro</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        sharedDocuments.map((doc: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{doc.urlDocument}</TableCell>
                            <TableCell>{doc.urlHelp}</TableCell>
                            <TableCell>{doc.permission}</TableCell>
                            <TableCell>{doc.dateSent}</TableCell>
                            <TableCell>{doc.status}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Ver</DropdownMenuItem>
                                  <DropdownMenuItem>Editar</DropdownMenuItem>
                                  <DropdownMenuItem>Eliminar</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-gray-500 font-medium">No hay registros disponibles</div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" disabled className="px-4 bg-transparent">
                      Anterior
                    </Button>
                    <Button variant="outline" size="sm" disabled className="px-4 bg-transparent">
                      Siguiente
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-shrink-0 border-t pt-4 pb-2">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="bg-transparent border-[#1A4F7A] text-[#1A4F7A] hover:bg-[#1A4F7A] hover:text-white"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDetails(false)}
                className="bg-transparent border-gray-400 text-gray-600 hover:bg-gray-100"
              >
                Cerrar
              </Button>
              <Button className="bg-[#1A4F7A] hover:bg-[#1A4F7A]/90 text-white">Guardar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
