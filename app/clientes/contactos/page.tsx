"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Edit,
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  TrendingUp,
  Package,
  Sparkles,
  Search,
  Users,
  FileText,
  PenTool,
  Send,
  Save,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  company: string
  job_title: string
  status: string
  sales_owner: string
  stage?: string
  created_at: string
  updated_at: string
  nif?: string
}

interface Service {
  id: number
  name: string
  description: string
  category: string
  base_price: number
  currency: string
  duration: string
  features: string[]
  deliverables: string[]
}

interface Template {
  id: number
  name: string
  content: string
  category: string
}

interface WorkflowState {
  step: "service" | "template" | "generate" | "signature" | "send" | "complete"
  selectedService: Service | null
  selectedTemplate: Template | null
  generatedProposal: any | null
  signedDocument: any | null
}

export default function ContactosPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isNewContactOpen, setIsNewContactOpen] = useState(false)
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isServiceSelectorOpen, setIsServiceSelectorOpen] = useState(false)
  const [isProposalGenerating, setIsProposalGenerating] = useState(false)
  const [currentFormType, setCurrentFormType] = useState<"create" | "edit">("create")

  const [contactSuggestions, setContactSuggestions] = useState<Contact[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const [templates, setTemplates] = useState<Template[]>([])
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false)
  const [workflowState, setWorkflowState] = useState<WorkflowState>({
    step: "service",
    selectedService: null,
    selectedTemplate: null,
    generatedProposal: null,
    signedDocument: null,
  })
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false)
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Form states
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    job_title: "",
    sales_owner: "María García",
    stage: "Nuevo",
    status: "lead",
  })

  const [editContact, setEditContact] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    job_title: "",
    sales_owner: "",
    stage: "",
    status: "",
  })

  const [isServiceSelectorBusy, setIsServiceSelectorBusy] = useState(false)
  const [isTemplateSelectorBusy, setIsTemplateSelectorBusy] = useState(false)

  const stageOptions = [
    { value: "Nuevo", label: "Nuevo" },
    { value: "Calificación", label: "Calificación" },
    { value: "Propuesta", label: "Propuesta" },
    { value: "Negociación", label: "Negociación" },
    { value: "Cierre", label: "Cierre" },
    { value: "Ganado", label: "Ganado" },
    { value: "Perdido", label: "Perdido" },
  ]

  const statusOptions = [
    { value: "lead", label: "Lead" },
    { value: "qualified", label: "Calificado" },
    { value: "client", label: "Cliente" },
    { value: "inactive", label: "Inactivo" },
  ]

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/templates/proposals")
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      }
    } catch (error) {
      console.error("Error fetching templates:", error)
    }
  }

  useEffect(() => {
    fetchContacts()
    fetchServices()
    fetchTemplates()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services")
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch (error) {
      console.error("Error fetching services:", error)
    }
  }

  const fetchContacts = async () => {
    try {
      const response = await fetch("/api/contacts")
      if (response.ok) {
        const data = await response.json()
        setContacts(data)
      }
    } catch (error) {
      console.error("Error fetching contacts:", error)
      toast.error("Error al cargar contactos")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateContact = async () => {
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContact),
      })

      if (response.ok) {
        toast.success("Contacto creado exitosamente")
        setIsNewContactOpen(false)
        setNewContact({
          name: "",
          email: "",
          phone: "",
          company: "",
          job_title: "",
          sales_owner: "María García",
          stage: "Nuevo",
          status: "lead",
        })
        fetchContacts()
      } else {
        toast.error("Error al crear contacto")
      }
    } catch (error) {
      console.error("Error creating contact:", error)
      toast.error("Error al crear contacto")
    }
  }

  const handleEditContact = async () => {
    if (!selectedContact) return

    try {
      const response = await fetch(`/api/contacts/${selectedContact.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editContact),
      })

      if (response.ok) {
        toast.success("Contacto actualizado exitosamente")
        setIsEditDialogOpen(false)
        setSelectedContact(null)
        fetchContacts()
      } else {
        toast.error("Error al actualizar contacto")
      }
    } catch (error) {
      console.error("Error updating contact:", error)
      toast.error("Error al actualizar contacto")
    }
  }

  const handleConvertToClient = async () => {
    if (!selectedContact) return

    try {
      const response = await fetch(`/api/contacts/${selectedContact.id}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        toast.success("Contacto convertido a cliente exitosamente")
        setIsConvertDialogOpen(false)
        setSelectedContact(null)
        fetchContacts()
      } else {
        toast.error("Error al convertir contacto")
      }
    } catch (error) {
      console.error("Error converting contact:", error)
      toast.error("Error al convertir contacto")
    }
  }

  const handleRowDoubleClick = (contact: Contact) => {
    setSelectedContact(contact)
    setEditContact({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      job_title: contact.job_title,
      sales_owner: contact.sales_owner,
      stage: contact.stage || "Nuevo",
      status: contact.status,
    })
    setIsEditDialogOpen(true)
  }

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "lead":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "qualified":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "client":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "inactive":
        return "bg-gray-50 text-gray-700 border-gray-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "lead":
        return "Lead"
      case "qualified":
        return "Calificado"
      case "client":
        return "Cliente"
      case "inactive":
        return "Inactivo"
      default:
        return status
    }
  }

  const searchTimeout = useRef<any>(null)

  const searchContacts = async (query: string) => {
    if (query.length < 2) {
      setContactSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsSearching(true)
    try {
      // Use the main contacts endpoint with search filtering
      const filteredContacts = contacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(query.toLowerCase()) ||
          contact.email.toLowerCase().includes(query.toLowerCase()) ||
          contact.company.toLowerCase().includes(query.toLowerCase()),
      )

      setContactSuggestions(filteredContacts.slice(0, 8)) // Show more suggestions
      setShowSuggestions(true)
    } catch (error) {
      console.error("Error searching contacts:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleContactSelect = (contact: Contact) => {
    setNewContact({
      name: contact.name,
      email: contact.email || "",
      phone: contact.phone || "",
      company: contact.company || "",
      job_title: contact.job_title || "",
      nif: contact.nif || "",
      status: contact.status || "lead",
      stage: "Nuevo",
      sales_owner: contact.sales_owner || "María García",
    })
    setShowSuggestions(false)
    setSearchTerm(contact.name)
    toast.success(`Contacto ${contact.name} seleccionado y datos cargados`)
  }

  const handleNameChange = (value: string) => {
    setNewContact({ ...newContact, name: value })
    searchContacts(value)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleServiceSelect = (service: Service) => {
    console.log("[v0] Service selected:", service.name)
    setWorkflowState((prev) => ({
      ...prev,
      selectedService: service,
      step: "template",
    }))
    setIsServiceSelectorOpen(false)
    setIsServiceSelectorBusy(false)
    toast.success(`Servicio seleccionado: ${service.name}`)
  }

  const handleTemplateSelect = (template: Template) => {
    console.log("[v0] Template selected:", template.name)
    setWorkflowState((prev) => ({
      ...prev,
      selectedTemplate: template,
      step: "generate",
    }))
    setIsTemplateSelectorOpen(false)
    setIsTemplateSelectorBusy(false)
    toast.success(`Plantilla seleccionada: ${template.name}`)
  }

  const handleCatalogClick = (formType: "create" | "edit") => {
    setCurrentFormType(formType)
    setIsServiceSelectorOpen(true)
  }

  const handleServiceSelection = () => {
    if (isServiceSelectorBusy || isServiceSelectorOpen) {
      console.log("[v0] Service selector already busy or open, ignoring click")
      return
    }

    console.log("[v0] Opening service selector dialog")
    setIsServiceSelectorBusy(true)
    setIsServiceSelectorOpen(true)

    // Reset busy state after a short delay
    setTimeout(() => {
      setIsServiceSelectorBusy(false)
    }, 1000)
  }

  const handleTemplateSelection = () => {
    if (isTemplateSelectorBusy || isTemplateSelectorOpen) {
      console.log("[v0] Template selector already busy or open, ignoring click")
      return
    }

    console.log("[v0] Template selection clicked, current service:", workflowState.selectedService)
    if (workflowState.selectedService) {
      setIsTemplateSelectorBusy(true)
      setIsTemplateSelectorOpen(true)

      // Reset busy state after a short delay
      setTimeout(() => {
        setIsTemplateSelectorBusy(false)
      }, 1000)
    } else {
      toast.error("Primero debe seleccionar un servicio")
    }
  }

  const handleGenerateProposal = async () => {
    if (!workflowState.selectedService || !workflowState.selectedTemplate) {
      toast.error("Debe seleccionar un servicio y una plantilla primero")
      return
    }

    const contactData = currentFormType === "create" ? newContact : editContact
    if (!contactData?.name || !contactData?.email) {
      toast.error("Información del contacto incompleta")
      return
    }

    setIsProposalGenerating(true)
    console.log("[v0] Generating AI proposal with:", {
      contact: contactData,
      service: workflowState.selectedService,
      template: workflowState.selectedTemplate,
    })

    try {
      const response = await fetch("/api/proposals/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactId: contactData.id || null,
          serviceId: workflowState.selectedService.id,
          templateId: workflowState.selectedTemplate.id,
          contactData: {
            name: contactData.name,
            email: contactData.email,
            phone: contactData.phone,
            company: contactData.company,
            job_title: contactData.job_title,
          },
        }),
      })

      if (response.ok) {
        const proposal = await response.json()
        console.log("[v0] AI proposal generated successfully:", proposal)

        setWorkflowState((prev) => ({
          ...prev,
          generatedProposal: proposal,
          step: "signature",
        }))

        toast.success("Propuesta generada exitosamente con IA")
      } else {
        const error = await response.json()
        console.error("[v0] Error generating proposal:", error)
        toast.error("Error al generar la propuesta: " + (error.message || "Error desconocido"))
      }
    } catch (error) {
      console.error("[v0] Network error generating proposal:", error)
      toast.error("Error de conexión al generar la propuesta")
    } finally {
      setIsProposalGenerating(false)
    }
  }

  const handleDigitalSignature = async () => {
    if (!workflowState.generatedProposal) {
      toast.error("Debe generar una propuesta primero")
      return
    }

    console.log("[v0] Opening digital signature for proposal:", workflowState.generatedProposal.id)
    setIsSignatureDialogOpen(true)
  }

  const handleSendDocument = async () => {
    if (!workflowState.signedDocument) {
      toast.error("Debe firmar el documento primero")
      return
    }

    console.log("[v0] Opening send document dialog for:", workflowState.signedDocument)
    setIsSendDialogOpen(true)
  }

  const resetWorkflow = () => {
    setWorkflowState({
      step: "service",
      selectedService: null,
      selectedTemplate: null,
      generatedProposal: null,
      signedDocument: null,
    })
  }

  const handleProposalClick = async (formType: "create" | "edit") => {
    const contactData = formType === "create" ? newContact : editContact

    if (!contactData.name || !contactData.email) {
      toast.error("Por favor completa la información del contacto")
      return
    }

    if (!selectedService) {
      toast.error("Por favor selecciona un servicio del catálogo")
      return
    }

    setIsProposalGenerating(true)

    try {
      let contactId: number

      if (formType === "create") {
        const contactResponse = await fetch("/api/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contactData),
        })

        if (!contactResponse.ok) {
          throw new Error("Error creating contact")
        }

        const createdContact = await contactResponse.json()
        contactId = createdContact.id
      } else {
        if (!selectedContact) {
          throw new Error("No contact selected for editing")
        }
        contactId = selectedContact.id

        const updateResponse = await fetch(`/api/contacts/${contactId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contactData),
        })

        if (!updateResponse.ok) {
          throw new Error("Error updating contact")
        }
      }

      const proposalResponse = await fetch("/api/proposals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId,
          serviceId: selectedService.id,
          customRequirements: `Propuesta personalizada para ${contactData.name} de ${contactData.company}`,
        }),
      })

      if (!proposalResponse.ok) {
        throw new Error("Error generating proposal")
      }

      const proposal = await proposalResponse.json()

      const pdfResponse = await fetch(`/api/proposals/${proposal.id}/pdf`, {
        method: "POST",
      })

      if (!pdfResponse.ok) {
        throw new Error("Error generating PDF")
      }

      const pdfData = await pdfResponse.json()

      toast.success("¡Propuesta generada exitosamente!")

      const sendOption = await new Promise<string>((resolve) => {
        const dialog = document.createElement("div")
        dialog.innerHTML = `
          <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <h3 class="text-lg font-semibold mb-4">Enviar Propuesta</h3>
              <p class="text-gray-600 mb-6">¿Cómo deseas enviar la propuesta a ${contactData.name}?</p>
              <div class="flex gap-3">
                <button id="email-btn" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  📧 Email
                </button>
                <button id="whatsapp-btn" class="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  📱 WhatsApp
                </button>
                <button id="download-btn" class="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                  📥 Descargar
                </button>
              </div>
            </div>
          </div>
        `
        document.body.appendChild(dialog)

        dialog.querySelector("#email-btn")?.addEventListener("click", () => {
          document.body.removeChild(dialog)
          resolve("email")
        })

        dialog.querySelector("#whatsapp-btn")?.addEventListener("click", () => {
          document.body.removeChild(dialog)
          resolve("whatsapp")
        })

        dialog.querySelector("#download-btn")?.addEventListener("click", () => {
          document.body.removeChild(dialog)
          resolve("download")
        })
      })

      if (sendOption === "download") {
        window.open(pdfData.pdfUrl, "_blank")
      } else {
        const sendResponse = await fetch(`/api/proposals/${proposal.id}/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            method: sendOption,
            recipient: sendOption === "email" ? contactData.email : contactData.phone,
            message: `Hola ${contactData.name}, adjunto encontrarás nuestra propuesta personalizada para ${selectedService.name}. ¡Esperamos tu respuesta!`,
          }),
        })

        if (sendResponse.ok) {
          toast.success(`Propuesta enviada por ${sendOption === "email" ? "email" : "WhatsApp"}`)
        } else {
          toast.error(`Error enviando por ${sendOption === "email" ? "email" : "WhatsApp"}`)
        }
      }

      if (formType === "create") {
        setIsNewContactOpen(false)
        setNewContact({
          name: "",
          email: "",
          phone: "",
          company: "",
          job_title: "",
          sales_owner: "María García",
          stage: "Nuevo",
          status: "lead",
        })
      } else {
        setIsEditDialogOpen(false)
      }

      setSelectedService(null)
      fetchContacts()
    } catch (error) {
      console.error("Error in proposal workflow:", error)
      toast.error("Error generando la propuesta")
    } finally {
      setIsProposalGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contactos</h1>
          <p className="text-muted-foreground">Gestiona tus leads y conviértelos en clientes</p>
        </div>
        <Dialog open={isNewContactOpen} onOpenChange={setIsNewContactOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Contacto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold tracking-tight">Crear Nuevo Contacto</DialogTitle>
                {selectedService && (
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    Servicio: {selectedService.name}
                  </Badge>
                )}
              </div>
              <DialogDescription className="text-base text-muted-foreground leading-relaxed">
                Agrega un nuevo contacto a tu base de datos de leads y gestiona su información de manera eficiente.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-8 py-8">
              <div className="space-y-4 relative">
                <Label htmlFor="search" className="text-sm font-semibold flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  Nombre completo
                </Label>

                <div className="relative">
                  <Input
                    id="search"
                    placeholder="Buscar contacto existente o escribir nuevo nombre..."
                    value={searchTerm}
                    onChange={(e) => {
                      const value = e.target.value
                      setSearchTerm(value)
                      setNewContact({ ...newContact, name: value })

                      // Debounce search
                      clearTimeout(searchTimeout.current)
                      searchTimeout.current = setTimeout(() => {
                        searchContacts(value)
                      }, 300)
                    }}
                    className="h-14 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 pl-4 pr-12 rounded-xl shadow-sm"
                  />

                  {isSearching && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                    </div>
                  )}

                  {!isSearching && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>

                {showSuggestions && contactSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-auto">
                    <div className="p-4 text-sm font-semibold text-gray-700 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        Contactos encontrados ({contactSuggestions.length}) - Selecciona para auto-completar
                      </div>
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                      {contactSuggestions.map((contact, index) => (
                        <div
                          key={contact.id}
                          className={`p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200 ${
                            index === 0 ? "bg-blue-25" : ""
                          }`}
                          onClick={() => handleContactSelect(contact)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                              <User className="h-6 w-6 text-white" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate text-lg">{contact.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Building className="h-3 w-3 text-gray-400" />
                                <p className="text-sm text-gray-600 truncate">{contact.company || "Sin empresa"}</p>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <p className="text-xs text-gray-500 truncate">{contact.email || "Sin email"}</p>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <Badge
                                variant="outline"
                                className={`text-xs font-medium ${getStatusColor(contact.status || "lead")}`}
                              >
                                {getStatusText(contact.status || "lead")}
                              </Badge>
                              <div className="text-xs text-gray-400">
                                {new Date(contact.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-gray-50 border-t text-center rounded-b-xl">
                      <p className="text-xs text-gray-600">
                        {contactSuggestions.length === 8
                          ? "Mostrando primeros 8 resultados"
                          : `${contactSuggestions.length} contacto(s) encontrado(s)`}
                      </p>
                    </div>
                  </div>
                )}

                {showSuggestions && contactSuggestions.length === 0 && searchTerm.length >= 2 && !isSearching && (
                  <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl p-6 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Search className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">No se encontraron contactos</p>
                        <p className="text-sm text-gray-500 mt-1">Continúa escribiendo para crear un nuevo contacto</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                      <Mail className="h-4 w-4 text-white" />
                    </div>
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="juan.perez@empresa.com"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    className="h-12 text-base border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 rounded-xl"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="phone" className="text-sm font-semibold flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                      <Phone className="h-4 w-4 text-white" />
                    </div>
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+34 600 123 456"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    className="h-12 text-base border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label htmlFor="company" className="text-sm font-semibold flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                      <Building className="h-4 w-4 text-white" />
                    </div>
                    Empresa
                  </Label>
                  <Input
                    id="company"
                    placeholder="Nombre de la empresa"
                    value={newContact.company}
                    onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                    className="h-12 text-base border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 rounded-xl"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="job_title" className="text-sm font-semibold flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                      <Briefcase className="h-4 w-4 text-white" />
                    </div>
                    Cargo
                  </Label>
                  <Input
                    id="job_title"
                    placeholder="Director de Marketing"
                    value={newContact.job_title}
                    onChange={(e) => setNewContact({ ...newContact, job_title: e.target.value })}
                    className="h-12 text-base border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-sm">
                <div className="space-y-3">
                  <Label htmlFor="status" className="text-sm font-bold flex items-center gap-3 text-blue-900">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-sm"></div>
                    Estado
                  </Label>
                  <Select
                    value={newContact.status}
                    onValueChange={(value) => setNewContact({ ...newContact, status: value })}
                  >
                    <SelectTrigger className="h-12 bg-white border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="stage" className="text-sm font-bold flex items-center gap-3 text-blue-900">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                      <TrendingUp className="h-3 w-3 text-white" />
                    </div>
                    Etapa
                  </Label>
                  <Select
                    value={newContact.stage}
                    onValueChange={(value) => setNewContact({ ...newContact, stage: value })}
                  >
                    <SelectTrigger className="h-12 bg-white border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm">
                      <SelectValue placeholder="Seleccionar etapa" />
                    </SelectTrigger>
                    <SelectContent>
                      {stageOptions.map((stage) => (
                        <SelectItem key={stage.value} value={stage.value}>
                          {stage.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col gap-6 pt-8 border-t border-gray-100">
              <div className="w-full">
                <div className="flex items-center justify-between mb-6 px-2">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        workflowState.step === "service" || workflowState.selectedService
                          ? "bg-green-500 shadow-lg shadow-green-200"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span
                      className={`text-xs font-medium ${
                        workflowState.step === "service" || workflowState.selectedService
                          ? "text-green-700"
                          : "text-gray-500"
                      }`}
                    >
                      Servicio
                    </span>
                  </div>
                  <div className="flex-1 h-0.5 bg-gray-200 mx-2">
                    <div
                      className={`h-full transition-all duration-500 ${
                        workflowState.selectedService ? "bg-green-500 w-full" : "bg-gray-200 w-0"
                      }`}
                    ></div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        workflowState.step === "template" || workflowState.selectedTemplate
                          ? "bg-purple-500 shadow-lg shadow-purple-200"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span
                      className={`text-xs font-medium ${
                        workflowState.step === "template" || workflowState.selectedTemplate
                          ? "text-purple-700"
                          : "text-gray-500"
                      }`}
                    >
                      Plantilla
                    </span>
                  </div>
                  <div className="flex-1 h-0.5 bg-gray-200 mx-2">
                    <div
                      className={`h-full transition-all duration-500 ${
                        workflowState.selectedTemplate ? "bg-purple-500 w-full" : "bg-gray-200 w-0"
                      }`}
                    ></div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        workflowState.step === "generate" || workflowState.generatedProposal
                          ? "bg-blue-500 shadow-lg shadow-blue-200"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span
                      className={`text-xs font-medium ${
                        workflowState.step === "generate" || workflowState.generatedProposal
                          ? "text-blue-700"
                          : "text-gray-500"
                      }`}
                    >
                      Generar
                    </span>
                  </div>
                  <div className="flex-1 h-0.5 bg-gray-200 mx-2">
                    <div
                      className={`h-full transition-all duration-500 ${
                        workflowState.generatedProposal ? "bg-blue-500 w-full" : "bg-gray-200 w-0"
                      }`}
                    ></div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        workflowState.step === "signature" || workflowState.signedDocument
                          ? "bg-orange-500 shadow-lg shadow-orange-200"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span
                      className={`text-xs font-medium ${
                        workflowState.step === "signature" || workflowState.signedDocument
                          ? "text-orange-700"
                          : "text-gray-500"
                      }`}
                    >
                      Firma
                    </span>
                  </div>
                  <div className="flex-1 h-0.5 bg-gray-200 mx-2">
                    <div
                      className={`h-full transition-all duration-500 ${
                        workflowState.signedDocument ? "bg-orange-500 w-full" : "bg-gray-200 w-0"
                      }`}
                    ></div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        workflowState.step === "send" || workflowState.step === "complete"
                          ? "bg-indigo-500 shadow-lg shadow-indigo-200"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span
                      className={`text-xs font-medium ${
                        workflowState.step === "send" || workflowState.step === "complete"
                          ? "text-indigo-700"
                          : "text-gray-500"
                      }`}
                    >
                      Enviar
                    </span>
                  </div>
                </div>

                {workflowState.selectedService && (
                  <div className="w-full p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 mb-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-800">{workflowState.selectedService.name}</h4>
                          <p className="text-sm text-green-600 line-clamp-1">
                            {workflowState.selectedService.description}
                          </p>
                          <p className="text-xs text-green-500 mt-1 font-medium">
                            {workflowState.selectedService.currency} {workflowState.selectedService.base_price} •
                            {workflowState.selectedService.duration}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetWorkflow}
                        className="text-green-700 border-green-300 hover:bg-green-100 bg-white shadow-sm"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Cambiar
                      </Button>
                    </div>
                  </div>
                )}

                {workflowState.selectedTemplate && (
                  <div className="w-full p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 mb-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-purple-800">{workflowState.selectedTemplate.name}</h4>
                          <p className="text-sm text-purple-600">Plantilla seleccionada</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsTemplateSelectorOpen(true)}
                        className="text-purple-700 border-purple-300 hover:bg-purple-100 bg-white shadow-sm"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Cambiar
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 w-full">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Button
                    variant="outline"
                    onClick={handleServiceSelection}
                    disabled={isServiceSelectorBusy} // Disable button when busy
                    className={`h-14 border-2 transition-all duration-300 font-semibold shadow-sm ${
                      workflowState.step === "service"
                        ? "border-green-400 text-green-700 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 shadow-green-100"
                        : workflowState.selectedService
                          ? "border-green-300 text-green-600 bg-green-50"
                          : "border-gray-300 text-gray-500 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <Package className="mr-3 h-5 w-5" />
                    {isServiceSelectorBusy
                      ? "Cargando..."
                      : workflowState.selectedService
                        ? `✓ ${workflowState.selectedService.name}`
                        : "Seleccionar Servicio"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleTemplateSelection}
                    disabled={!workflowState.selectedService || isTemplateSelectorBusy} // Proper validation and busy state
                    className={`h-14 border-2 transition-all duration-300 font-semibold shadow-sm ${
                      workflowState.step === "template"
                        ? "border-blue-400 text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 shadow-blue-100"
                        : workflowState.selectedTemplate
                          ? "border-blue-300 text-blue-600 bg-blue-50"
                          : "border-gray-300 text-gray-500 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <FileText className="mr-3 h-5 w-5" />
                    {isTemplateSelectorBusy
                      ? "Cargando..."
                      : workflowState.selectedTemplate
                        ? `✓ ${workflowState.selectedTemplate.name}`
                        : "Seleccionar Plantilla"}
                  </Button>
                </div>

                <div className="w-full mb-4">
                  <Button
                    variant="outline"
                    onClick={handleGenerateProposal}
                    disabled={!workflowState.selectedService || !workflowState.selectedTemplate || isProposalGenerating}
                    className={`h-14 border-2 transition-all duration-300 font-semibold shadow-sm ${
                      workflowState.step === "generate"
                        ? "border-purple-400 text-purple-700 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 shadow-purple-100"
                        : workflowState.generatedProposal
                          ? "border-purple-300 text-purple-600 bg-purple-50"
                          : "border-gray-300 text-gray-500 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <Sparkles className="mr-3 h-5 w-5" />
                    {isProposalGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generando con IA...
                      </>
                    ) : workflowState.generatedProposal ? (
                      "✓ Propuesta Generada"
                    ) : (
                      "Generar Propuesta IA"
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Button
                    variant="outline"
                    onClick={handleDigitalSignature}
                    disabled={!workflowState.generatedProposal}
                    className={`h-14 border-2 transition-all duration-300 font-semibold shadow-sm ${
                      workflowState.step === "signature"
                        ? "border-orange-400 text-orange-700 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 shadow-orange-100"
                        : workflowState.signedDocument
                          ? "border-orange-300 text-orange-600 bg-orange-50"
                          : "border-gray-300 text-gray-500 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <PenTool className="mr-3 h-5 w-5" />
                    {workflowState.signedDocument ? "✓ Documento Firmado" : "Firma Digital"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleSendDocument}
                    disabled={!workflowState.signedDocument}
                    className={`h-14 border-2 transition-all duration-300 font-semibold shadow-sm ${
                      workflowState.step === "send"
                        ? "border-teal-400 text-teal-700 bg-gradient-to-r from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 shadow-teal-100"
                        : "border-gray-300 text-gray-500 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <Send className="mr-3 h-5 w-5" />
                    Enviar Documento
                  </Button>
                </div>

                <div className="w-full pt-4 border-t border-gray-200">
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="flex-1 h-12 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleCreateContact}
                      disabled={workflowState.step !== "complete"}
                      className={`flex-1 h-12 font-semibold shadow-lg transition-all duration-300 ${
                        workflowState.step === "complete"
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Save className="mr-2 h-5 w-5" />
                      Guardar Contacto
                    </Button>
                  </div>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isTemplateSelectorOpen} onOpenChange={setIsTemplateSelectorOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Seleccionar Plantilla</DialogTitle>
              <DialogDescription>Elige una plantilla para generar la propuesta personalizada</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{template.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{template.category}</p>
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 max-h-20 overflow-hidden">
                        {template.content.substring(0, 200)}...
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {templates.length === 0 && (
              <div className="text-center py-8 text-gray-500">No hay plantillas disponibles</div>
            )}
          </DialogContent>
        </Dialog>

        {/* Convert to Client Dialog */}
        <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convertir a Cliente</DialogTitle>
              <DialogDescription>¿Estás seguro de que quieres convertir este contacto en cliente?</DialogDescription>
            </DialogHeader>
            {selectedContact && (
              <div className="py-4">
                <p>
                  <strong>Nombre:</strong> {selectedContact.name}
                </p>
                <p>
                  <strong>Empresa:</strong> {selectedContact.company}
                </p>
                <p>
                  <strong>Email:</strong> {selectedContact.email}
                </p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConvertDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleConvertToClient}>Convertir a Cliente</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
