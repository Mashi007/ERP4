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
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowDetails(false)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DialogTitle className="text-xl text-[#1A4F7A]">Detalles del Proyecto</DialogTitle>
            </div>
          </DialogHeader>

          {selectedProject && (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-xs font-medium text-gray-600">#</TableHead>
                      <TableHead className="text-xs font-medium text-gray-600">CLIENTE</TableHead>
                      <TableHead className="text-xs font-medium text-gray-600">PROYECTO</TableHead>
                      <TableHead className="text-xs font-medium text-gray-600">
                        NORMA(S) SERVICIOS VINCULADOS DEL CONTRATO
                      </TableHead>
                      <TableHead className="text-xs font-medium text-gray-600">ESTADO PROYECTO DOCUMENTOS</TableHead>
                      <TableHead className="text-xs font-medium text-gray-600">
                        CENTRO DE FACTURACIÓN TIENE FORMACIÓN
                      </TableHead>
                      <TableHead className="text-xs font-medium text-gray-600">
                        EMPRESA CERTIFICADORA AUDITORES
                      </TableHead>
                      <TableHead className="text-xs font-medium text-gray-600">
                        FECHA COMPARTIDO FECHA VALIDACIÓN
                      </TableHead>
                      <TableHead className="text-xs font-medium text-gray-600">CONSULTORES</TableHead>
                      <TableHead className="text-xs font-medium text-gray-600">JEFE DE PROYECTO</TableHead>
                      <TableHead className="text-xs font-medium text-gray-600">ACCIONES</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-sm">
                        <div className="text-blue-600 cursor-pointer">0027-25</div>
                        <div className="text-blue-600 cursor-pointer text-xs">ID CONSULTING 2060 SL</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="text-blue-600 cursor-pointer">{selectedProject.client}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="font-medium">{selectedProject.projectCode}</div>
                        <div className="text-blue-600 text-xs mt-1">{selectedProject.associatedStandards}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="text-blue-600 cursor-pointer">{selectedProject.linkedServices}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <Badge className="bg-purple-100 text-purple-800 text-xs">Pend. Iniciar</Badge>
                        <div className="mt-1">
                          <Badge className="bg-red-100 text-red-800 text-xs">Documentos Sin Compartir</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div>{selectedProject.billingCenter}</div>
                        <Badge className="bg-red-500 text-white text-xs mt-1">NO</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="text-blue-600">{selectedProject.certifyingCompany}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="text-xs">
                          <div>Creado: {selectedProject.sharedDate.created}</div>
                          <div>Aceptado: {selectedProject.sharedDate.accepted}</div>
                          <div>Validado: {selectedProject.sharedDate.validated}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{selectedProject.consultants.join(", ")}</TableCell>
                      <TableCell className="text-sm">{selectedProject.projectManager}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
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
                            <DropdownMenuItem onClick={() => handleMenuAction("add-auditing-company", selectedProject)}>
                              <Building className="mr-2 h-4 w-4" />
                              Añadir Empresa Auditora
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMenuAction("add-project-manager", selectedProject)}>
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

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-blue-600">Documentos Compartidos</h3>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Mostrar</span>
                    <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm">registros por página</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-xs font-medium text-gray-600">URL DOCUMENTO</TableHead>
                        <TableHead className="text-xs font-medium text-gray-600">URL AYUDA</TableHead>
                        <TableHead className="text-xs font-medium text-gray-600">PERMISO</TableHead>
                        <TableHead className="text-xs font-medium text-gray-600">FECHA ENVIADO</TableHead>
                        <TableHead className="text-xs font-medium text-gray-600">ESTADO</TableHead>
                        <TableHead className="text-xs font-medium text-gray-600">ACCIONES</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sharedDocuments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No se ha encontrado ningún registro
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
                                  <Button variant="ghost" size="sm">
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

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">No hay registros disponibles</div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Anterior
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Siguiente
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
