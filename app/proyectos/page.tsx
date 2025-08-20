"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowLeft } from "lucide-react"

export default function ProyectosPage() {
  const [projects, setProjects] = useState([
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
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState<string>("")
  const [editingProject, setEditingProject] = useState<any>(null)
  const [observations, setObservations] = useState<string>("")
  const [sharedDocuments, setSharedDocuments] = useState<any[]>([])
  const [showDocumentsDialog, setShowDocumentsDialog] = useState(false)
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([])
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("")
  const [showUploadAnother, setShowUploadAnother] = useState<boolean>(false)
  const [showAdditionalUploadFields, setShowAdditionalUploadFields] = useState<boolean>(false)

  const handleShowDetails = (project: any) => {
    setSelectedProject(project)
    setShowFullScreenDetails(true)
  }

  const handleBackToProjects = () => {
    setShowFullScreenDetails(false)
    setSelectedProject(null)
  }

  const handleUpdateTraining = (project: any) => {
    setEditingProject(project)
    setEditingField("hasTraining")
    setEditingValue(project.details.hasTraining)
    setObservations("")
  }

  const handleShareDocuments = (project: any) => {
    setEditingProject(project)
    setEditingField("documents")
    setEditingValue(project.details.documents)
    setShowDocumentsDialog(true)
  }

  const handleUpdateStatus = (project: any) => {
    setEditingProject(project)
    setEditingField("projectStatus")
    setEditingValue(project.details.projectStatus)
    setObservations("")
  }

  const handleEditStandards = (project: any) => {
    setEditingProject(project)
    setEditingField("linkedServices")
    setEditingValue(project.details.linkedServices)
  }

  const handleValidateProject = (project: any) => {
    setEditingProject(project)
    setEditingField("validationDate")
    setEditingValue(project.details.validationDate)
  }

  const handleAddCertifyingCompany = (project: any) => {
    setEditingProject(project)
    setEditingField("certifyingCompany")
    setEditingValue(project.details.certifyingCompany)
  }

  const handleAddAuditingCompany = (project: any) => {
    setEditingProject(project)
    setEditingField("auditors")
    setEditingValue(project.details.auditors)
  }

  const handleAddProjectManager = (project: any) => {
    setEditingProject(project)
    setEditingField("projectManager")
    setEditingValue(project.details.projectManager)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const newDocument = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: selectedDocumentType || "ISO 9001",
          normaISO: selectedDocumentType || "ISO 9001",
          size: file.size,
          uploadDate: new Date().toLocaleDateString(),
          file: file,
        }
        setUploadedDocuments((prev) => [...prev, newDocument])
      })
      setShowUploadAnother(true)
    }
    event.target.value = ""
  }

  const handleRemoveDocument = (documentId: number) => {
    setUploadedDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
  }

  const handleSaveField = () => {
    if (editingProject && editingField) {
      if (editingField === "hasTraining") {
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === editingProject.id
              ? {
                  ...project,
                  details: {
                    ...project.details,
                    hasTraining: editingValue,
                    billingCenter: observations || project.details.billingCenter,
                  },
                }
              : project,
          ),
        )

        if (selectedProject && selectedProject.id === editingProject.id) {
          setSelectedProject({
            ...selectedProject,
            details: {
              ...selectedProject.details,
              hasTraining: editingValue,
              billingCenter: observations || selectedProject.details.billingCenter,
            },
          })
        }

        console.log(`[v0] Updated hasTraining:`, editingValue)
        console.log(`[v0] Updated billingCenter with observations:`, observations)
      } else if (editingField === "projectStatus") {
        const updatedDocumentStatus =
          editingValue === "Finalizado" || editingValue === "Iniciado"
            ? "Ver Detalle Documentos Compartidos"
            : "Documentos Sin Compartir"

        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === editingProject.id
              ? {
                  ...project,
                  details: {
                    ...project.details,
                    projectStatus: editingValue,
                    documents: updatedDocumentStatus,
                  },
                }
              : project,
          ),
        )

        if (selectedProject && selectedProject.id === editingProject.id) {
          setSelectedProject({
            ...selectedProject,
            details: {
              ...selectedProject.details,
              projectStatus: editingValue,
              documents: updatedDocumentStatus,
            },
          })
        }

        console.log(`[v0] Updated projectStatus:`, editingValue)
        console.log(`[v0] Updated documents status:`, updatedDocumentStatus)
        if (observations) {
          console.log(`[v0] Project status observations:`, observations)
        }
      } else {
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === editingProject.id
              ? {
                  ...project,
                  details: {
                    ...project.details,
                    [editingField]: editingValue,
                  },
                }
              : project,
          ),
        )

        if (selectedProject && selectedProject.id === editingProject.id) {
          setSelectedProject({
            ...selectedProject,
            details: {
              ...selectedProject.details,
              [editingField]: editingValue,
            },
          })
        }

        console.log(`[v0] Updated ${editingField}:`, editingValue)
      }
    }
    setEditingField(null)
    setEditingValue("")
    setEditingProject(null)
    setObservations("")
  }

  const handleSaveDocuments = () => {
    if (editingProject) {
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === editingProject.id
            ? {
                ...project,
                details: {
                  ...project.details,
                  documents: "Ver Detalle Documentos Compartidos",
                },
              }
            : project,
        ),
      )

      if (selectedProject && selectedProject.id === editingProject.id) {
        setSelectedProject({
          ...selectedProject,
          details: {
            ...selectedProject.details,
            documents: "Ver Detalle Documentos Compartidos",
          },
        })
      }
    }
    setShowDocumentsDialog(false)
    setEditingProject(null)
  }

  const handleCancelEdit = () => {
    setEditingField(null)
    setEditingValue("")
    setEditingProject(null)
    setObservations("")
    setShowDocumentsDialog(false)
  }

  const getFieldDisplayName = (field: string) => {
    const fieldNames: { [key: string]: string } = {
      hasTraining: "Formación",
      documents: "Documentos",
      projectStatus: "Estado del Proyecto",
      linkedServices: "Servicios Vinculados",
      validationDate: "Fecha de Validación",
      certifyingCompany: "Empresa Certificadora",
      auditors: "Empresa Auditora",
      projectManager: "Jefe de Proyecto",
    }
    return fieldNames[field] || field
  }

  const handleUploadAnotherResponse = (uploadAnother: boolean) => {
    setShowUploadAnother(false)
    if (uploadAnother) {
      setShowAdditionalUploadFields(true)
      setSelectedDocumentType("") // Reset document type for new upload
    }
  }

  if (showFullScreenDetails && selectedProject) {
    return (
      <div className="min-h-screen bg-gray-50">
        {showDocumentsDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[90vw] h-[80vh] max-w-6xl flex flex-col">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-semibold text-[#1A4F7A]">Compartir ISO</h3>
                <button onClick={handleCancelEdit} className="text-gray-400 hover:text-gray-600 text-2xl">
                  ×
                </button>
              </div>

              <div className="flex-1 p-6 overflow-auto">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Documento <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#8B5CF6]"
                        value={selectedDocumentType}
                        onChange={(e) => setSelectedDocumentType(e.target.value)}
                      >
                        <option value="">Seleccionar tipo</option>
                        <option value="ISO 9001">ISO 9001</option>
                        <option value="ISO 14001">ISO 14001</option>
                        <option value="ISO 45001">ISO 45001</option>
                        <option value="ISO 27001">ISO 27001</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cargar Documento <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.xls,.xlsx"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="document-upload"
                        />
                        <label
                          htmlFor="document-upload"
                          className="flex-1 border-2 border-dashed border-gray-300 rounded-lg px-4 py-2 text-center cursor-pointer hover:border-[#8B5CF6] hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-sm text-gray-600">📎 Seleccionar archivos o arrastrar aquí</span>
                        </label>
                      </div>
                    </div>

                    {showAdditionalUploadFields && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Documento Adicional <span className="text-red-500">*</span>
                          </label>
                          <select
                            className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#8B5CF6]"
                            value={selectedDocumentType}
                            onChange={(e) => setSelectedDocumentType(e.target.value)}
                          >
                            <option value="">Seleccionar tipo</option>
                            <option value="ISO 9001">ISO 9001</option>
                            <option value="ISO 14001">ISO 14001</option>
                            <option value="ISO 45001">ISO 45001</option>
                            <option value="ISO 27001">ISO 27001</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cargar Documento Adicional <span className="text-red-500">*</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              multiple
                              accept=".pdf,.doc,.docx,.xls,.xlsx"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="additional-document-upload"
                            />
                            <label
                              htmlFor="additional-document-upload"
                              className="flex-1 border-2 border-dashed border-gray-300 rounded-lg px-4 py-2 text-center cursor-pointer hover:border-[#8B5CF6] hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-sm text-gray-600">📎 Seleccionar archivos o arrastrar aquí</span>
                            </label>
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Vencimiento <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8B5CF6]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Usuarios Asignados <span className="text-red-500">*</span>
                      </label>
                      <select className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#8B5CF6]">
                        <option value="">Seleccionar usuarios</option>
                        <option value="all">Todos los usuarios</option>
                        <option value="admin">Solo administradores</option>
                        <option value="specific">Usuarios específicos</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Acceso</label>
                      <select className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#8B5CF6]">
                        <option value="view">Solo visualización</option>
                        <option value="download">Visualización y descarga</option>
                        <option value="edit">Edición completa</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded text-[#8B5CF6] focus:ring-[#8B5CF6]" />
                        <span className="text-sm text-gray-700">Notificar por email</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded text-[#8B5CF6] focus:ring-[#8B5CF6]" />
                        <span className="text-sm text-gray-700">Requerir confirmación de lectura</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción del Documento</label>
                    <textarea
                      className="w-full border rounded-lg px-3 py-2 h-20 resize-none focus:ring-2 focus:ring-[#8B5CF6]"
                      placeholder="Ingrese una descripción detallada del documento..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded text-[#8B5CF6] focus:ring-[#8B5CF6]" />
                        <span className="text-sm text-gray-700">Notificar por email</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded text-[#8B5CF6] focus:ring-[#8B5CF6]" />
                        <span className="text-sm text-gray-700">Requerir confirmación de lectura</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Permisos Asignados:</h4>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="permission" value="lectura" className="text-red-500" defaultChecked />
                        <span className="text-sm">Lectura</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="permission" value="escritura" />
                        <span className="text-sm">Escritura</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Mostrar</span>
                      <select className="border rounded-lg px-3 py-2 text-sm bg-white">
                        <option>25</option>
                        <option>50</option>
                        <option>100</option>
                      </select>
                      <span className="text-sm text-gray-600">registros por página</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Buscar:</span>
                      <input
                        type="text"
                        className="border rounded-lg px-3 py-2 text-sm min-w-[200px]"
                        placeholder="Buscar documentos..."
                      />
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            <input type="checkbox" className="rounded" />
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Norma ISO</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uploadedDocuments.length > 0 ? (
                          uploadedDocuments.map((doc) => (
                            <tr key={doc.id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <input type="checkbox" className="rounded" />
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-blue-500">📄</span>
                                  <div>
                                    <div className="font-medium text-gray-900">{doc.name}</div>
                                    <div className="text-xs text-gray-500">
                                      {(doc.size / 1024).toFixed(1)} KB • {doc.uploadDate}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <Badge className="bg-blue-100 text-blue-800">{doc.type}</Badge>
                              </td>
                              <td className="px-4 py-3">
                                <Badge className="bg-purple-100 text-purple-800">{doc.normaISO}</Badge>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                    Ver
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs text-red-600 hover:text-red-700 bg-transparent"
                                    onClick={() => handleRemoveDocument(doc.id)}
                                  >
                                    Eliminar
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                              No se ha encontrado ningún registro
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>No hay registros disponibles</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled>
                        Primero
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        ← Anterior
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        Siguiente →
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        Último
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">
                    Los campos marcados con <span className="text-red-500 font-bold">*</span> son obligatorios
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                <Button onClick={handleSaveDocuments} className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white px-8">
                  Guardar
                </Button>
                <Button onClick={handleCancelEdit} variant="outline" className="px-8 bg-transparent">
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {showUploadAnother && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Documento Cargado Exitosamente</h3>
              <p className="text-gray-600 mb-6">¿Desea cargar otro documento?</p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => handleUploadAnotherResponse(false)} className="px-4 py-2">
                  No
                </Button>
                <Button
                  onClick={() => handleUploadAnotherResponse(true)}
                  className="px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                >
                  Sí, cargar otro
                </Button>
              </div>
            </div>
          </div>
        )}

        {editingField && !showDocumentsDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md">
              <h3 className="text-lg font-semibold mb-4 text-[#1A4F7A]">
                {editingField === "hasTraining"
                  ? "Actualizar Formación del Proyecto"
                  : `Editar ${getFieldDisplayName(editingField)}`}
              </h3>
              <div className="space-y-4">
                {editingField === "hasTraining" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tiene Formación</label>
                      <select
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                      >
                        <option value="SI">SI</option>
                        <option value="NO">NO</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                      <textarea
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 h-24 resize-none"
                        placeholder="Ingrese observaciones sobre la formación..."
                      />
                    </div>
                  </>
                ) : editingField === "projectStatus" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado del Proyecto <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6]"
                      >
                        <option value="" disabled className="text-gray-400">
                          Escoja un Estado
                        </option>
                        <option value="Cancelado">Cancelado</option>
                        <option value="Finalizado">Finalizado</option>
                        <option value="Iniciado">Iniciado</option>
                        <option value="Iniciado (Pendiente 1er 50%)">Iniciado (Pendiente 1er 50%)</option>
                        <option value="Pend. Iniciar">Pend. Iniciar</option>
                      </select>
                    </div>
                    <div className="mt-3">
                      <textarea
                        placeholder="Observaciones adicionales sobre el estado del proyecto..."
                        className="w-full border rounded-lg px-3 py-2 h-20 resize-none text-sm"
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 h-24 resize-none"
                    placeholder={`Ingrese ${getFieldDisplayName(editingField).toLowerCase()}...`}
                  />
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={handleSaveField} className="flex-1 bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white">
                  Guardar
                </Button>
                <Button onClick={handleCancelEdit} variant="outline" className="flex-1 bg-transparent">
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

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
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    📊
                  </Button>
                  <Button size="sm" className="flex-1 bg-[#1A4F7A] hover:bg-[#1A4F7A]/90">
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
                      <div className="space-y-1">
                        <Badge
                          className={`${
                            selectedProject.details.projectStatus === "Pend. Iniciar"
                              ? "bg-blue-100 text-blue-800"
                              : selectedProject.details.projectStatus === "Finalizado"
                                ? "bg-green-100 text-green-800"
                                : selectedProject.details.projectStatus === "Cancelado"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {selectedProject.details.projectStatus}
                        </Badge>
                        {selectedProject.details.documents === "Ver Detalle Documentos Compartidos" ? (
                          <div
                            className="text-xs font-medium text-blue-600 cursor-pointer hover:text-blue-800 hover:underline flex items-center gap-1"
                            onClick={() => {
                              const documentsSection = document.getElementById("documentos-compartidos-section")
                              if (documentsSection) {
                                documentsSection.scrollIntoView({ behavior: "smooth" })
                              }
                            }}
                          >
                            <span className="text-blue-500">📎</span>
                            {selectedProject.details.documents}
                          </div>
                        ) : (
                          <div className="text-xs font-medium text-red-600 flex items-center gap-1">
                            <span className="text-red-500">❌</span>
                            {selectedProject.details.documents}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="text-gray-900 mb-1 font-medium">{selectedProject.details.billingCenter}</div>
                      <Badge
                        className={
                          selectedProject.details.hasTraining === "SI"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }
                      >
                        {selectedProject.details.hasTraining}
                      </Badge>
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
                            <span className="text-sm text-gray-700">Centro de Facturación Tiene Formación</span>
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
                            <span className="text-sm text-gray-700">Estado Proyecto Documentos</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditStandards(selectedProject)}
                            className="flex items-center gap-3 py-3"
                          >
                            <span className="text-lg">🔄</span>
                            <span className="text-sm text-gray-700">Norma(s) Servicios Vinculados del Contrato</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleValidateProject(selectedProject)}
                            className="flex items-center gap-3 py-3"
                          >
                            <span className="text-lg">✓</span>
                            <span className="text-sm text-gray-700">Fecha Compartido Fecha Validación</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAddCertifyingCompany(selectedProject)}
                            className="flex items-center gap-3 py-3"
                          >
                            <span className="text-lg">🏢</span>
                            <span className="text-sm text-gray-700">Empresa Certificadora Auditores</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAddAuditingCompany(selectedProject)}
                            className="flex items-center gap-3 py-3"
                          >
                            <span className="text-lg">🏛️</span>
                            <span className="text-sm text-gray-700">Empresa Certificadora Auditores</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAddProjectManager(selectedProject)}
                            className="flex items-center gap-3 py-3"
                          >
                            <span className="text-lg">👤</span>
                            <span className="text-sm text-gray-700">Jefe de Proyecto</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm" id="documentos-compartidos-section">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xl ${selectedProject.details.documents === "Ver Detalle Documentos Compartidos" ? "text-blue-500" : "text-red-500"}`}
                  >
                    {selectedProject.details.documents === "Ver Detalle Documentos Compartidos" ? "📎" : "❌"}
                  </span>
                  <h2
                    className={`text-xl font-bold ${selectedProject.details.documents === "Ver Detalle Documentos Compartidos" ? "text-blue-600" : "text-red-600"}`}
                  >
                    {selectedProject.details.documents === "Ver Detalle Documentos Compartidos"
                      ? "Documentos Compartidos"
                      : "Documentos Sin Compartir"}
                  </h2>
                </div>
                {selectedProject.details.documents === "Ver Detalle Documentos Compartidos" && (
                  <Badge className="bg-green-100 text-green-800 px-3 py-1">✓ Activo</Badge>
                )}
              </div>

              {selectedProject.details.documents === "Ver Detalle Documentos Compartidos" ? (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700 flex items-center gap-2">
                    <span className="text-blue-500">ℹ️</span>
                    Los documentos han sido compartidos y están disponibles para visualización.
                  </p>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 flex items-center gap-2">
                    <span className="text-red-500">⚠️</span>
                    Los documentos aún no han sido compartidos. Actualice el estado del proyecto para habilitar el
                    compartir documentos.
                  </p>
                </div>
              )}

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
