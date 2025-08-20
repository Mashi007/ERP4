"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowLeft } from "lucide-react"
import { X, Check, Users, Building, Mail, Phone, Search } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

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
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("ISO 9001")
  const [showUploadAnother, setShowUploadAnother] = useState<boolean>(false)
  const [showAdditionalUploadFields, setShowAdditionalUploadFields] = useState<boolean>(false)
  const [showProjectManagerDialog, setShowProjectManagerDialog] = useState(false)
  const [searchProfessional, setSearchProfessional] = useState("")

  const [currentUserRole, setCurrentUserRole] = useState("Administrador") // In real app, get from auth context
  const [showAddNewManager, setShowAddNewManager] = useState(false)
  const [newManagerForm, setNewManagerForm] = useState({ name: "", email: "" })
  const [professionals, setProfessionals] = useState([
    { id: 1, name: "Daniel Casañas", email: "d.casanas@kohde.us" },
    { id: 2, name: "INNOVACION CONOCIMIENTO Y DESARROLLO 2050 SL", email: "manmenrt@gmail.es" },
    { id: 3, name: "Mamen Rodriguez Toro", email: "manmenrt@hotmail.com" },
    { id: 4, name: "Noelia Sanchez", email: "noe@icdgroup.es" },
    { id: 5, name: "Vicente Exposito", email: "vexpbv@gmail.com" },
  ])

  const [showConsultantsDialog, setShowConsultantsDialog] = useState(false)
  const [selectedConsultants, setSelectedConsultants] = useState<string[]>([])
  const [consultantSearch, setConsultantSearch] = useState("")
  const [newConsultantName, setNewConsultantName] = useState("")
  const [newConsultantEmail, setNewConsultantEmail] = useState("")

  const [showClientSelectionDialog, setShowClientSelectionDialog] = useState(false)
  const [availableClients, setAvailableClients] = useState<any[]>([])
  const [clientSearchTerm, setClientSearchTerm] = useState("")

  const availableConsultants = [
    "Daniel Casañas, d.casanas@kohde.us",
    "INNOVACION CONOCIMIENTO Y DESARROLLO 2050 SL, manmenrt@gmail.es",
    "Mamen Rodriguez Toro, manmenrt@hotmail.com",
    "Noelia Sanchez, noe@icdgroup.es",
    "Vicente Exposito, vexpbv@gmail.com",
  ]

  const currentUserPermissions: string[] = []

  const isAdmin = () => {
    return (
      currentUserRole === "Administrador" || currentUserRole === "system_admin" || currentUserRole === "users_manage"
    )
  }

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
    setEditingValue(project.details.hasTraining || "NO") // Default to NO if undefined
    setObservations("") // Clear previous observations
    console.log("[v0] Training form activated for project:", project.id)
  }

  const handleShareDocuments = (project: any) => {
    setEditingProject(project)
    setEditingField("documents")
    setEditingValue(project.details.documents)
    setShowDocumentsDialog(true)
    setUploadedDocuments([]) // Reset uploaded documents
    setSelectedDocumentType("ISO 9001") // Set default document type
    setShowAdditionalUploadFields(false) // Reset additional fields
    console.log("[v0] Share documents form activated for project:", project.id)
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

  const handleAddProjectManager = (project: any) => {
    setEditingProject(project)
    setEditingField("projectManager")
    setEditingValue(project.details.projectManager)
    setShowProjectManagerDialog(true)
    console.log("[v0] Opening project manager dialog")
  }

  const handleAddNewManager = () => {
    if (newManagerForm.name && newManagerForm.email) {
      const newProfessional = {
        id: Date.now().toString(),
        name: newManagerForm.name,
        email: newManagerForm.email,
      }

      setProfessionals((prev) => [...prev, newProfessional])
      setNewManagerForm({ name: "", email: "" })
      setShowAddNewManager(false)

      // Auto-select the new manager
      const fullName = `${newProfessional.name}, ${newProfessional.email}`
      setEditingValue(fullName)

      console.log("[v0] New project manager added:", newProfessional)
    }
  }

  const handleSelectProfessional = (professional: any) => {
    const fullName = `${professional.name}, ${professional.email}`
    setEditingValue(fullName)
    console.log("[v0] Selected professional:", fullName)
  }

  const handleSaveProjectManager = () => {
    if (editingProject && editingValue) {
      const updatedProjects = projects.map((p) =>
        p.id === editingProject.id ? { ...p, details: { ...p.details, projectManager: editingValue } } : p,
      )
      setProjects(updatedProjects)

      if (selectedProject && selectedProject.id === editingProject.id) {
        setSelectedProject({
          ...selectedProject,
          details: { ...selectedProject.details, projectManager: editingValue },
        })
      }

      setShowProjectManagerDialog(false)
      setEditingProject(null)
      setEditingField("")
      setEditingValue("")
      setSearchProfessional("")
      console.log("[v0] Project manager saved:", editingValue)
    }
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
    setUploadedDocuments([])
    setSelectedDocumentType("")
    setShowAdditionalUploadFields(false)
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

  const filteredProfessionals = professionals.filter(
    (prof) =>
      prof.name.toLowerCase().includes(searchProfessional.toLowerCase()) ||
      prof.email.toLowerCase().includes(searchProfessional.toLowerCase()),
  )

  const handleEditConsultants = (project: any) => {
    console.log("[v0] Opening consultants dialog for project:", project.id)
    setEditingProject(project)
    setSelectedConsultants(project.details.consultants.split(", ").filter(Boolean))
    setShowConsultantsDialog(true)
  }

  const handleSaveConsultants = () => {
    if (editingProject && selectedConsultants.length > 0) {
      const updatedProjects = projects.map((p) =>
        p.id === editingProject.id
          ? { ...p, details: { ...p.details, consultants: selectedConsultants.join(", ") } }
          : p,
      )
      setProjects(updatedProjects)

      if (selectedProject?.id === editingProject.id) {
        setSelectedProject({
          ...editingProject,
          details: { ...editingProject.details, consultants: selectedConsultants.join(", ") },
        })
      }

      setShowConsultantsDialog(false)
      setSelectedConsultants([])
      setConsultantSearch("")
      setNewConsultantName("")
      setNewConsultantEmail("")
      console.log("[v0] Consultants updated successfully")
    }
  }

  const handleAddNewConsultant = () => {
    if (newConsultantName.trim() && newConsultantEmail.trim()) {
      const newConsultant = `${newConsultantName.trim()}, ${newConsultantEmail.trim()}`
      setSelectedConsultants((prev) => [...prev, newConsultant])
      setNewConsultantName("")
      setNewConsultantEmail("")
      console.log("[v0] New consultant added:", newConsultant)
    }
  }

  const handleSelectClient = (project: any) => {
    setEditingProject(project)
    setShowClientSelectionDialog(true)
    loadAvailableClients()
    console.log("[v0] Opening client selection dialog for project:", project.id)
  }

  const loadAvailableClients = async () => {
    try {
      console.log("[v0] Loading clients from API...")
      const response = await fetch("/api/clients")
      if (response.ok) {
        const clients = await response.json()
        console.log("[v0] API response:", clients)
        setAvailableClients(Array.isArray(clients) ? clients : [])
      } else {
        console.log("[v0] API failed, using fallback data")
        // Fallback to mock data if API fails
        setAvailableClients([
          {
            id: 1,
            name: "OCA INSTITUTO DE CERTIFICACION SL",
            email: "contacto@oca.com",
            phone: "123456789",
            company: "OCA",
            type: "Instituto",
          },
          {
            id: 2,
            name: "ID CONSULTING 2060 SL",
            email: "info@idconsulting.com",
            phone: "987654321",
            company: "ID Consulting",
            type: "Consultora",
          },
          {
            id: 3,
            name: "CERTIFICADORA AUDITORES",
            email: "auditores@cert.com",
            phone: "555666777",
            company: "Certificadora",
            type: "Auditora",
          },
          {
            id: 4,
            name: "EMPRESA ABC S.L.",
            email: "contacto@empresaabc.com",
            phone: "+34 912 345 678",
            company: "Empresa ABC",
            type: "Empresa",
          },
        ])
      }
    } catch (error) {
      console.error("[v0] Error loading clients:", error)
      setAvailableClients([
        {
          id: 1,
          name: "OCA INSTITUTO DE CERTIFICACION SL",
          email: "contacto@oca.com",
          phone: "123456789",
          company: "OCA",
          type: "Instituto",
        },
        {
          id: 2,
          name: "ID CONSULTING 2060 SL",
          email: "info@idconsulting.com",
          phone: "987654321",
          company: "ID Consulting",
          type: "Consultora",
        },
        {
          id: 3,
          name: "CERTIFICADORA AUDITORES",
          email: "auditores@cert.com",
          phone: "555666777",
          company: "Certificadora",
          type: "Auditora",
        },
        {
          id: 4,
          name: "EMPRESA ABC S.L.",
          email: "contacto@empresaabc.com",
          phone: "+34 912 345 678",
          company: "Empresa ABC",
          type: "Empresa",
        },
      ])
    }
  }

  const handleSaveSelectedClient = (selectedClient: any) => {
    if (editingProject && selectedClient) {
      const updatedProjects = projects.map((p) =>
        p.id === editingProject.id ? { ...p, details: { ...p.details, client: selectedClient.name } } : p,
      )
      setProjects(updatedProjects)

      if (selectedProject?.id === editingProject.id) {
        setSelectedProject({
          ...editingProject,
          details: { ...editingProject.details, client: selectedClient.name },
        })
      }

      setShowClientSelectionDialog(false)
      setClientSearchTerm("")
      console.log("[v0] Client updated successfully:", selectedClient.name)
    }
  }

  const filteredClients = Array.isArray(availableClients)
    ? availableClients.filter(
        (client) =>
          client.name?.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
          client.email?.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
          client.address?.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
          client.phone?.toLowerCase().includes(clientSearchTerm.toLowerCase()),
      )
    : []

  if (showFullScreenDetails && selectedProject) {
    return (
      <div className="min-h-screen bg-gray-50">
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

        {editingField && !showDocumentsDialog && !showProjectManagerDialog && (
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
                        onChange={(e) => {
                          setEditingValue(e.target.value)
                          console.log("[v0] Training status changed to:", e.target.value)
                        }}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6]"
                        required
                      >
                        <option value="SI">SI</option>
                        <option value="NO">NO</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                      <textarea
                        value={observations}
                        onChange={(e) => {
                          setObservations(e.target.value)
                          console.log("[v0] Observations updated:", e.target.value)
                        }}
                        className="w-full border rounded-lg px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6]"
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
                <Button
                  onClick={handleSaveField}
                  className="flex-1 bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white"
                  disabled={editingField === "hasTraining" && !editingValue}
                >
                  Guardar
                </Button>
                <Button onClick={handleCancelEdit} variant="outline" className="flex-1 bg-transparent">
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {showProjectManagerDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-96 max-w-md">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-[#8B5CF6]">Añadir Jefe de Proyecto</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowProjectManagerDialog(false)
                    setSearchProfessional("")
                    setShowAddNewManager(false)
                    setNewManagerForm({ name: "", email: "" })
                    console.log("[v0] Project manager dialog closed")
                  }}
                  className="p-1 hover:bg-gray-100"
                >
                  ✕
                </Button>
              </div>

              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3">Escoja un Profesional</p>

                <div className="relative mb-3">
                  <input
                    type="text"
                    value={searchProfessional}
                    onChange={(e) => setSearchProfessional(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6]"
                    placeholder="Buscar profesional..."
                  />
                </div>

                <div className="max-h-48 overflow-y-auto border rounded-lg mb-3">
                  {filteredProfessionals.map((professional) => (
                    <div
                      key={professional.id}
                      onClick={() => handleSelectProfessional(professional)}
                      className="p-3 hover:bg-[#8B5CF6]/10 cursor-pointer border-b last:border-b-0 transition-colors"
                    >
                      <div className="text-sm font-medium text-gray-900">{professional.name}</div>
                      <div className="text-xs text-gray-500">{professional.email}</div>
                    </div>
                  ))}
                  {filteredProfessionals.length === 0 && (
                    <div className="p-3 text-sm text-gray-500 text-center">No se encontraron profesionales</div>
                  )}
                </div>

                {isAdmin() && (
                  <div className="border-t pt-3 mb-3">
                    {!showAddNewManager ? (
                      <Button
                        onClick={() => setShowAddNewManager(true)}
                        variant="outline"
                        className="w-full text-[#8B5CF6] border-[#8B5CF6] hover:bg-[#8B5CF6]/10"
                      >
                        + Agregar Nuevo Jefe de Proyecto
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">Nuevo Jefe de Proyecto</p>
                        <input
                          type="text"
                          value={newManagerForm.name}
                          onChange={(e) => setNewManagerForm((prev) => ({ ...prev, name: e.target.value }))}
                          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6]"
                          placeholder="Nombre completo *"
                          required
                        />
                        <input
                          type="email"
                          value={newManagerForm.email}
                          onChange={(e) => setNewManagerForm((prev) => ({ ...prev, email: e.target.value }))}
                          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6]"
                          placeholder="Correo electrónico *"
                          required
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={handleAddNewManager}
                            className="flex-1 bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white"
                            disabled={!newManagerForm.name || !newManagerForm.email}
                          >
                            Agregar
                          </Button>
                          <Button
                            onClick={() => {
                              setShowAddNewManager(false)
                              setNewManagerForm({ name: "", email: "" })
                            }}
                            variant="outline"
                            className="flex-1"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!isAdmin() && (
                  <div className="border-t pt-3 mb-3">
                    <p className="text-xs text-gray-500 text-center bg-gray-50 p-2 rounded-lg">
                      Solo los administradores pueden agregar nuevos jefes de proyecto
                    </p>
                  </div>
                )}

                {editingValue && (
                  <div className="mt-3 p-2 bg-[#8B5CF6]/10 rounded-lg">
                    <p className="text-xs text-gray-600">Seleccionado:</p>
                    <p className="text-sm font-medium text-[#8B5CF6]">{editingValue}</p>
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <Button
                    onClick={handleSaveProjectManager}
                    className="flex-1 bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white"
                    disabled={!editingValue}
                  >
                    Guardar
                  </Button>
                  <Button
                    onClick={() => {
                      setShowProjectManagerDialog(false)
                      setSearchProfessional("")
                      setEditingValue("")
                      setShowAddNewManager(false)
                      setNewManagerForm({ name: "", email: "" })
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDocumentsDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto mx-4">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-[#1A4F7A]">Compartir ISO</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </Button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Documento <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedDocumentType}
                      onChange={(e) => {
                        setSelectedDocumentType(e.target.value)
                        console.log("[v0] Document type selected:", e.target.value)
                      }}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6] bg-white"
                      required
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
                    <div className="border-2 border-dashed border-[#8B5CF6] rounded-lg p-4 text-center hover:border-[#7C3AED] transition-colors">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-[#8B5CF6] hover:text-[#7C3AED] flex items-center justify-center gap-2"
                      >
                        <span>📎</span>
                        Seleccionar archivos o arrastrar aquí
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Vencimiento <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Usuarios Asignados <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6] bg-white">
                      <option value="">Seleccionar usuarios</option>
                      <option value="admin">Administrador</option>
                      <option value="user1">Usuario 1</option>
                      <option value="user2">Usuario 2</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Acceso</label>
                  <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6] bg-white">
                    <option value="read">Solo visualización</option>
                    <option value="write">Lectura y escritura</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-[#8B5CF6] focus:ring-[#8B5CF6]" />
                    <span className="text-sm text-gray-700">Notificar por email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-[#8B5CF6] focus:ring-[#8B5CF6]" />
                    <span className="text-sm text-gray-700">Requerir confirmación de lectura</span>
                  </label>
                </div>

                {uploadedDocuments.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Documentos Cargados</h3>
                    <div className="space-y-2">
                      {uploadedDocuments.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-500">📄</span>
                            <span className="text-sm font-medium">{doc.name}</span>
                            <Badge className="bg-[#8B5CF6] text-white text-xs">{doc.normaISO}</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveDocument(doc.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            🗑️
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button onClick={handleCancelEdit} variant="outline" className="px-6 py-2 bg-transparent">
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSaveDocuments}
                    className="px-6 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                    disabled={!selectedDocumentType || uploadedDocuments.length === 0}
                  >
                    Guardar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showConsultantsDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Asignar Consultores</h2>
                <button
                  onClick={() => {
                    setShowConsultantsDialog(false)
                    setSelectedConsultants([])
                    setConsultantSearch("")
                    setNewConsultantName("")
                    setNewConsultantEmail("")
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Buscar Consultores</label>
                  <input
                    type="text"
                    value={consultantSearch}
                    onChange={(e) => setConsultantSearch(e.target.value)}
                    placeholder="Buscar por nombre o email..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Consultores Disponibles</label>
                  <div className="border border-gray-200 rounded-md max-h-48 overflow-y-auto">
                    {availableConsultants
                      .filter((consultant) => consultant.toLowerCase().includes(consultantSearch.toLowerCase()))
                      .map((consultant, index) => (
                        <div
                          key={index}
                          className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-purple-50 transition-colors ${
                            selectedConsultants.includes(consultant) ? "bg-purple-100" : ""
                          }`}
                          onClick={() => {
                            setSelectedConsultants((prev) =>
                              prev.includes(consultant) ? prev.filter((c) => c !== consultant) : [...prev, consultant],
                            )
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">{consultant.split(",")[0]}</div>
                              <div className="text-sm text-gray-500">{consultant.split(",")[1]?.trim()}</div>
                            </div>
                            {selectedConsultants.includes(consultant) && <Check className="h-5 w-5 text-purple-600" />}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {(currentUserRole === "Administrador" ||
                  currentUserPermissions.includes("users_manage") ||
                  currentUserPermissions.includes("system_admin")) && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Agregar Nuevo Consultor</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                        <input
                          type="text"
                          value={newConsultantName}
                          onChange={(e) => setNewConsultantName(e.target.value)}
                          placeholder="Nombre del consultor"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          value={newConsultantEmail}
                          onChange={(e) => setNewConsultantEmail(e.target.value)}
                          placeholder="email@ejemplo.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleAddNewConsultant}
                      disabled={!newConsultantName.trim() || !newConsultantEmail.trim()}
                      className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Agregar Consultor
                    </button>
                  </div>
                )}

                {!(
                  currentUserRole === "Administrador" ||
                  currentUserPermissions.includes("users_manage") ||
                  currentUserPermissions.includes("system_admin")
                ) && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      No tienes permisos para agregar nuevos consultores. Contacta al administrador.
                    </p>
                  </div>
                )}

                {selectedConsultants.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consultores Seleccionados ({selectedConsultants.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedConsultants.map((consultant, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                        >
                          {consultant.split(",")[0]}
                          <button
                            onClick={() => {
                              setSelectedConsultants((prev) => prev.filter((c) => c !== consultant))
                            }}
                            className="ml-2 text-purple-600 hover:text-purple-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                <button
                  onClick={() => {
                    setShowConsultantsDialog(false)
                    setSelectedConsultants([])
                    setConsultantSearch("")
                    setNewConsultantName("")
                    setNewConsultantEmail("")
                  }}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveConsultants}
                  disabled={selectedConsultants.length === 0}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Guardar Consultores
                </button>
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
                    <td
                      className="px-4 py-4 text-sm cursor-pointer hover:bg-blue-50 transition-colors"
                      onDoubleClick={() => {
                        console.log("[v0] Double-clicked on project number")
                        handleUpdateStatus(selectedProject)
                      }}
                    >
                      <div className="text-blue-600 font-medium">{selectedProject.details.number}</div>
                      <div className="text-blue-500 text-xs">{selectedProject.details.project}</div>
                    </td>
                    <td
                      className="px-4 py-4 text-sm text-blue-600 font-medium cursor-pointer hover:bg-blue-50 transition-colors"
                      onDoubleClick={() => {
                        console.log("[v0] Double-clicked on client")
                        handleSelectClient(selectedProject)
                      }}
                    >
                      {selectedProject.details.client}
                    </td>
                    <td
                      className="px-4 py-4 text-sm cursor-pointer hover:bg-blue-50 transition-colors"
                      onDoubleClick={() => {
                        console.log("[v0] Double-clicked on project")
                        handleEditStandards(selectedProject)
                      }}
                    >
                      <div className="font-medium text-gray-900">{selectedProject.details.project}</div>
                    </td>
                    <td
                      className="px-4 py-4 text-sm cursor-pointer hover:bg-blue-50 transition-colors"
                      onDoubleClick={() => {
                        console.log("[v0] Double-clicked on linked services")
                        handleEditStandards(selectedProject)
                      }}
                    >
                      <div className="text-blue-600 font-medium">{selectedProject.details.linkedServices}</div>
                      <div className="text-gray-600 text-xs">Certificación ISO</div>
                      <div className="text-blue-600 text-xs mt-1">🔗 {selectedProject.details.associatedStandards}</div>
                    </td>
                    <td
                      className="px-4 py-4 text-sm cursor-pointer hover:bg-blue-50 transition-colors"
                      onDoubleClick={() => {
                        console.log("[v0] Double-clicked on project status")
                        handleUpdateStatus(selectedProject)
                      }}
                    >
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
                            className="text-xs font-medium text-blue-600 flex items-center gap-1 cursor-pointer hover:text-blue-800"
                            onDoubleClick={(e) => {
                              e.stopPropagation()
                              console.log("[v0] Double-clicked on shared documents")
                              handleShareDocuments(selectedProject)
                            }}
                          >
                            <span className="text-blue-500">📎</span>
                            {selectedProject.details.documents}
                          </div>
                        ) : (
                          <div
                            className="text-xs font-medium text-red-600 flex items-center gap-1 cursor-pointer hover:text-red-800"
                            onDoubleClick={(e) => {
                              e.stopPropagation()
                              console.log("[v0] Double-clicked on documents not shared")
                              handleShareDocuments(selectedProject)
                            }}
                          >
                            <span className="text-red-500">❌</span>
                            {selectedProject.details.documents}
                          </div>
                        )}
                      </div>
                    </td>
                    <td
                      className="px-4 py-4 text-sm cursor-pointer hover:bg-blue-50 transition-colors"
                      onDoubleClick={() => {
                        console.log("[v0] Double-clicked on training center")
                        handleUpdateTraining(selectedProject)
                      }}
                    >
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
                    <td
                      className="px-4 py-4 text-sm cursor-pointer hover:bg-blue-50 transition-colors"
                      onDoubleClick={() => {
                        console.log("[v0] Double-clicked on certifying company")
                        handleAddCertifyingCompany(selectedProject)
                      }}
                    >
                      <div className="text-blue-600 mb-1 font-medium">{selectedProject.details.certifyingCompany}</div>
                      <div className="text-blue-600 font-medium">{selectedProject.details.auditors}</div>
                    </td>
                    <td
                      className="px-4 py-4 text-sm cursor-pointer hover:bg-blue-50 transition-colors"
                      onDoubleClick={() => {
                        console.log("[v0] Double-clicked on validation dates")
                        handleValidateProject(selectedProject)
                      }}
                    >
                      <div className="text-gray-600 text-xs mb-1">{selectedProject.details.sharedDate}</div>
                      <div className="text-gray-600 text-xs">{selectedProject.details.validationDate}</div>
                    </td>
                    <td
                      className="px-4 py-4 text-sm text-gray-600 cursor-pointer hover:bg-blue-50 transition-colors"
                      onDoubleClick={() => {
                        console.log("[v0] Double-clicked on consultants")
                        handleEditConsultants(selectedProject)
                      }}
                    >
                      {selectedProject.details.consultants}
                    </td>
                    <td
                      className="px-4 py-4 text-sm text-gray-600 cursor-pointer hover:bg-blue-50 transition-colors"
                      onDoubleClick={() => {
                        console.log("[v0] Double-clicked on project manager")
                        handleAddProjectManager(selectedProject)
                      }}
                    >
                      {selectedProject.details.projectManager}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-1">
                            <span className="text-gray-400 text-lg">⋮</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64">
                          <DropdownMenuItem
                            onClick={() => {
                              console.log("[v0] Training menu item clicked")
                              handleUpdateTraining(selectedProject)
                            }}
                            className="flex items-center gap-3 py-3 hover:bg-gray-50 cursor-pointer"
                          >
                            <span className="text-lg">📚</span>
                            <span className="text-sm text-gray-700">Centro de Facturación Tiene Formación</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              console.log("[v0] Share documents menu item clicked")
                              handleShareDocuments(selectedProject)
                            }}
                            className="flex items-center gap-3 py-3 hover:bg-gray-50 cursor-pointer"
                          >
                            <span className="text-lg">🔗</span>
                            <span className="text-sm text-gray-700">Compartir Documentos</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              console.log("[v0] Project status menu item clicked")
                              handleUpdateStatus(selectedProject)
                            }}
                            className="flex items-center gap-3 py-3 hover:bg-gray-50 cursor-pointer"
                          >
                            <span className="text-lg">📊</span>
                            <span className="text-sm text-gray-700">Estado Proyecto Documentos</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              console.log("[v0] Standards menu item clicked")
                              handleEditStandards(selectedProject)
                            }}
                            className="flex items-center gap-3 py-3 hover:bg-gray-50 cursor-pointer"
                          >
                            <span className="text-lg">🔄</span>
                            <span className="text-sm text-gray-700">Norma(s) Servicios Vinculados del Contrato</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              console.log("[v0] Validation menu item clicked")
                              handleValidateProject(selectedProject)
                            }}
                            className="flex items-center gap-3 py-3 hover:bg-gray-50 cursor-pointer"
                          >
                            <span className="text-lg">✓</span>
                            <span className="text-sm text-gray-700">Fecha Compartido Fecha Validación</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              console.log("[v0] Certifying company menu item clicked")
                              handleAddCertifyingCompany(selectedProject)
                            }}
                            className="flex items-center gap-3 py-3 hover:bg-gray-50 cursor-pointer"
                          >
                            <span className="text-lg">🏢</span>
                            <span className="text-sm text-gray-700">Empresa Certificadora Auditores</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              console.log("[v0] Auditing company menu item clicked")
                              handleAddAuditingCompany(selectedProject)
                            }}
                            className="flex items-center gap-3 py-3 hover:bg-gray-50 cursor-pointer"
                          >
                            <span className="text-lg">🏛️</span>
                            <span className="text-sm text-gray-700">Empresa Certificadora Auditores</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              console.log("[v0] Project manager menu item clicked")
                              handleAddProjectManager(selectedProject)
                            }}
                            className="flex items-center gap-3 py-3 hover:bg-gray-50 cursor-pointer"
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
        </div>

        <Dialog open={showClientSelectionDialog} onOpenChange={setShowClientSelectionDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Seleccionar Cliente</h2>
                    <p className="text-sm text-gray-600">Busca y selecciona un cliente del directorio</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nombre, email o empresa..."
                    value={clientSearchTerm}
                    onChange={(e) => setClientSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                {/* Clients List */}
                <div className="max-h-96 overflow-y-auto border rounded-lg">
                  {filteredClients.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {filteredClients.map((client) => (
                        <div
                          key={client.id}
                          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleSaveSelectedClient(client)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <Building className="h-4 w-4 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{client.name}</h3>
                                <p className="text-sm text-gray-600">{client.company}</p>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {client.email}
                                  </span>
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {client.phone}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-purple-600 border-purple-200">
                              {client.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No se encontraron clientes</p>
                      <p className="text-sm">Intenta con otros términos de búsqueda</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowClientSelectionDialog(false)
                    setClientSearchTerm("")
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
