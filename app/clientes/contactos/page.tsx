"use client"

import { DialogTrigger } from "@/components/ui/dialog"
import { DialogFooter } from "@/components/ui/dialog"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Plus,
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  Sparkles,
  Search,
  Users,
  FileText,
  PenTool,
  Send,
  Save,
  CheckCircle,
  ChevronRight,
  Edit,
  ArrowRight,
  Eye,
} from "lucide-react"
import { toast } from "sonner"
import ServiceSelector from "@/components/servicios/service-selector"
import TemplateSelector from "@/components/servicios/template-selector"

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
  sentDocument: any | null
  currentStep: number
}

export default function ContactosPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateContactOpen, setIsCreateContactOpen] = useState(false)
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  const [services, setServices] = useState<Service[]>([])
  const [isServiceSelectorOpen, setIsServiceSelectorOpen] = useState(false)
  const [isServiceSelectorBusy, setIsServiceSelectorBusy] = useState(false)
  const [isProposalGenerating, setIsProposalGenerating] = useState(false)
  const [currentFormType, setCurrentFormType] = useState<"create" | "edit">("create")

  const [contactSuggestions, setContactSuggestions] = useState<Contact[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const [templates, setTemplates] = useState<Template[]>([])
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false)
  const [isTemplateSelectorBusy, setIsTemplateSelectorBusy] = useState(false)
  const [workflowState, setWorkflowState] = useState<WorkflowState>({
    step: "service",
    selectedService: null,
    selectedTemplate: null,
    generatedProposal: null,
    signedDocument: null,
    sentDocument: null,
    currentStep: 1,
  })
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false)
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false)

  const [formMode, setFormMode] = useState<"create" | "edit">("create")

  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    job_title: "",
    sales_owner: "María García",
    stage: "Nuevo",
    status: "lead",
    nif: "",
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

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false)

  const [isContactDetailsOpen, setIsContactDetailsOpen] = useState(false)
  const [selectedContactForDetails, setSelectedContactForDetails] = useState<any>(null)

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

  const dropdownRef = useRef<HTMLDivElement>(null)

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
      console.log("[v0] Fetching contacts from API...")
      const response = await fetch("/api/contacts")
      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Contacts fetched successfully:", data.length, "contacts")
        setContacts(data)
        setContactSuggestions(data)
      } else {
        console.error("[v0] Failed to fetch contacts, status:", response.status)
        toast.error("Error al cargar contactos")
      }
    } catch (error) {
      console.error("[v0] Error fetching contacts:", error)
      toast.error("Error al cargar contactos")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveContact = async () => {
    console.log("[v0] Save button clicked, mode:", formMode)
    console.log("[v0] Button enabled check - name:", newContact.name || searchTerm, "email:", newContact.email)
    console.log("[v0] Starting contact save process")

    try {
      const contactToSave = {
        ...newContact,
        name: newContact.name || searchTerm,
        status: isWorkflowComplete() ? "client" : "lead",
      }

      console.log("[v0] Contact data being sent to API:", contactToSave)

      if (!contactToSave.name || !contactToSave.email) {
        console.log("[v0] Validation failed - missing required fields")
        toast.error("Nombre y email son requeridos")
        return
      }

      const workflowComplete = isWorkflowComplete()
      console.log("[v0] Workflow complete:", workflowComplete)

      if (formMode === "edit" && selectedContactForDetails) {
        // Update existing contact
        const response = await fetch(`/api/contacts/${selectedContactForDetails.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contactToSave),
        })

        console.log("[v0] API response status:", response.status)

        if (response.ok) {
          const updatedContact = await response.json()
          console.log("[v0] Contact updated successfully:", updatedContact)
          toast.success("Contacto actualizado exitosamente")
        } else {
          const errorData = await response.json()
          console.error("[v0] Error updating contact:", errorData)
          toast.error(errorData.error || "Error al actualizar contacto")
          return
        }
      } else {
        // Create new contact
        const response = await fetch("/api/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contactToSave),
        })

        console.log("[v0] API response status:", response.status)

        if (response.ok) {
          const savedContact = await response.json()
          console.log("[v0] Contact saved successfully:", savedContact)

          if (workflowComplete) {
            try {
              const savedClient = await saveToClients(contactToSave)
              console.log("[v0] Client status updated successfully:", savedClient)
              toast.success("Cliente creado exitosamente con propuesta completa")
            } catch (clientError) {
              console.error("[v0] Error updating client status:", clientError)
              toast.success("Contacto creado exitosamente, pero hubo un error al actualizar el estado de cliente")
            }
          } else {
            toast.success("Contacto creado exitosamente")
          }
        } else if (response.status === 409) {
          const errorData = await response.json()
          console.log("[v0] Duplicate email detected:", errorData)

          if (errorData.existingContact) {
            toast.error(
              `El email ya existe para: ${errorData.existingContact.name}. ¿Deseas actualizar el contacto existente?`,
            )
            setNewContact({
              ...newContact,
              ...errorData.existingContact,
            })
          } else {
            toast.error("El email ya existe en el sistema")
          }
          return
        } else {
          const errorData = await response.json()
          console.error("[v0] Error saving contact:", errorData)
          toast.error(errorData.error || "Error al crear contacto")
          return
        }
      }

      // Close dialog and reset form
      setIsCreateContactOpen(false)
      setFormMode("create")
      setSelectedContactForDetails(null)
      setNewContact({
        name: "",
        email: "",
        phone: "",
        company: "",
        job_title: "",
        nif: "",
        sales_owner: "María García",
        stage: "Nuevo",
        status: "lead",
      })
      setSearchTerm("")

      setWorkflowState({
        step: "service",
        selectedService: null,
        selectedTemplate: null,
        generatedProposal: null,
        signedDocument: null,
        sentDocument: null,
        currentStep: 1,
      })

      console.log("[v0] Refreshing contacts list after save...")
      await fetchContacts()
      console.log("[v0] Contacts list refreshed successfully")
    } catch (error) {
      console.error("[v0] Error in handleSaveContact:", error)
      toast.error("Error al procesar la solicitud")
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
      (contact.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (contact.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (contact.company?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showSuggestions])

  const searchContacts = async (query: string) => {
    if (query.length < 2) {
      setContactSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsSearching(true)
    try {
      const filteredContacts = contacts.filter(
        (contact) =>
          (contact.name?.toLowerCase() || "").includes(query.toLowerCase()) ||
          (contact.email?.toLowerCase() || "").includes(query.toLowerCase()) ||
          (contact.company?.toLowerCase() || "").includes(query.toLowerCase()),
      )

      setContactSuggestions(filteredContacts.slice(0, 8))
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
    console.log("[v0] Name change - value:", value)
    setNewContact({ ...newContact, name: value })
    searchContacts(value)
  }

  const handleCreateNewContact = () => {
    setNewContact({
      ...newContact,
      name: searchTerm,
    })
    setShowSuggestions(false)
    toast.success(`Nuevo contacto "${searchTerm}" creado`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleServiceSelection = () => {
    console.log("[v0] Opening service selector dialog")
    if (!isServiceSelectorOpen && !isServiceSelectorBusy) {
      setIsServiceSelectorBusy(true)
      setIsServiceSelectorOpen(true)
      // Reset busy state after a short delay to prevent rapid clicks
      setTimeout(() => setIsServiceSelectorBusy(false), 500)
    }
  }

  const handleServiceSelect = (service: any) => {
    console.log("[v0] Service selected:", service.name)
    setWorkflowState((prev) => ({
      ...prev,
      selectedService: service,
      currentStep: 2, // Move to template selection step
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
      currentStep: 3,
    }))
    setIsTemplateSelectorOpen(false)
    setIsTemplateSelectorBusy(false)
    toast.success(`Plantilla seleccionada: ${template.name}`)
  }

  const handleCatalogClick = (formType: "create" | "edit") => {
    setCurrentFormType(formType)
    setIsServiceSelectorOpen(true)
  }

  const handleTemplateSelection = () => {
    if (!workflowState.selectedService) {
      toast.error("Primero debes seleccionar un servicio")
      return
    }

    console.log("[v0] Opening template selector dialog")
    setIsTemplateSelectorOpen(true)
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
          currentStep: 4,
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
      sentDocument: null,
      currentStep: 1,
    })
  }

  const handleProposalClick = async (formType: "create" | "edit") => {
    const contactData = formType === "create" ? newContact : editContact

    if (!contactData.name || !contactData.email) {
      toast.error("Por favor completa la información del contacto")
      return
    }

    if (!workflowState.selectedService) {
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
          serviceId: workflowState.selectedService.id,
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
            message: `Hola ${contactData.name}, adjunto encontrarás nuestra propuesta personalizada para ${workflowState.selectedService.name}. ¡Esperamos tu respuesta!`,
          }),
        })

        if (sendResponse.ok) {
          toast.success(`Propuesta enviada por ${sendOption === "email" ? "email" : "WhatsApp"}`)
        } else {
          toast.error(`Error enviando por ${sendOption === "email" ? "email" : "WhatsApp"}`)
        }
      }

      if (formType === "create") {
        setIsCreateContactOpen(false)
        setNewContact({
          name: "",
          email: "",
          phone: "",
          company: "",
          job_title: "",
          sales_owner: "María García",
          stage: "Nuevo",
          status: "lead",
          nif: "",
        })
      } else {
        setIsEditDialogOpen(false)
      }

      setWorkflowState((prev) => ({
        ...prev,
        selectedService: null,
        selectedTemplate: null,
        step: "service",
        currentStep: 1,
      }))
      fetchContacts()
    } catch (error) {
      console.error("Error in proposal workflow:", error)
      toast.error("Error generando la propuesta")
    } finally {
      setIsProposalGenerating(false)
    }
  }

  const isWorkflowComplete = () => {
    return (
      workflowState.currentStep >= 5 &&
      workflowState.selectedService &&
      workflowState.selectedTemplate &&
      workflowState.generatedProposal
    )
  }

  const saveToClients = async (contactData: any) => {
    console.log("[v0] Saving to clients collection:", contactData)

    const clientData = {
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      company: contactData.company,
      cargo: contactData.job_title,
      // Include workflow data for clients
      service: workflowState.selectedService?.name,
      template: workflowState.selectedTemplate?.name,
      proposal: workflowState.generatedProposal,
      workflow_status: "completed",
    }

    const response = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clientData),
    })

    if (!response.ok) {
      throw new Error(`Failed to save to clients: ${response.status}`)
    }

    return await response.json()
  }

  const handleContactDetails = (contact: any) => {
    console.log("[v0] Opening contact details for:", contact.name)
    setFormMode("edit")
    setSelectedContactForDetails(contact)

    // Pre-populate the form fields with contact data
    setNewContact({
      name: contact.name || "",
      email: contact.email || "",
      phone: contact.phone || "",
      company: contact.company || "",
      job_title: contact.job_title || "",
      nif: contact.nif || "",
      sales_owner: contact.sales_owner || "María García",
      stage: contact.stage || "Nuevo",
      status: contact.status || "lead",
    })

    setSearchTerm(contact.name || "")
    setIsCreateContactOpen(true) // Use the same dialog
  }

  const handleNewContact = () => {
    setFormMode("create")
    setSelectedContactForDetails(null)

    // Reset form fields
    setNewContact({
      name: "",
      email: "",
      phone: "",
      company: "",
      job_title: "",
      nif: "",
      sales_owner: "María García",
      stage: "Nuevo",
      status: "lead",
    })

    setSearchTerm("")
    setWorkflowState({
      step: "service",
      selectedService: null,
      selectedTemplate: null,
      generatedProposal: null,
      signedDocument: null,
      sentDocument: null,
      currentStep: 1,
    })

    setIsCreateContactOpen(true)
  }

  const handleOpenContactDetails = (contact: any) => {
    console.log("[v0] Opening contact details for:", contact.name)
    // setSelectedContactForDetails(contact)
    // setIsContactDetailsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contactos</h1>
          <p className="text-muted-foreground">Gestiona tus leads y conviértelos en clientes</p>
        </div>
        <Dialog open={isCreateContactOpen} onOpenChange={setIsCreateContactOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleNewContact}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Contacto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[1000px] max-h-[95vh] overflow-hidden flex flex-col">
            <DialogHeader className="space-y-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold tracking-tight">
                  {formMode === "edit"
                    ? `Detalles del Contacto: ${selectedContactForDetails?.name || newContact.name || searchTerm}`
                    : "Crear Nuevo Contacto"}
                </DialogTitle>
                {workflowState.selectedService && (
                  <Badge className="bg-green-100 text-green-800 border-green-300 px-3 py-1 text-sm font-medium">
                    Servicio: {workflowState.selectedService.name}
                  </Badge>
                )}
              </div>
              <DialogDescription className="text-base text-muted-foreground leading-relaxed">
                {formMode === "edit"
                  ? "Edita la información del contacto y gestiona su información de manera eficiente."
                  : "Agrega un nuevo contacto a tu base de datos de leads y gestiona su información de manera eficiente."}
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-1">
              <div className="space-y-6 py-6">
                {formMode === "create" && (
                  <div className="space-y-4 relative">
                    <Label htmlFor="search" className="text-sm font-semibold flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      Nombre completo
                    </Label>

                    <div className="relative" ref={dropdownRef}>
                      <div className="relative">
                        <Input
                          placeholder="Buscar contacto existente o escribir nuevo nombre..."
                          value={searchTerm}
                          onChange={(e) => {
                            const value = e.target.value
                            console.log("[v0] Search input changed:", value)
                            setSearchTerm(value)
                            handleNameChange(value)

                            clearTimeout(searchTimeout.current)
                            searchTimeout.current = setTimeout(() => {
                              searchContacts(value)
                            }, 300)
                          }}
                          className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 pl-4 pr-12 rounded-xl shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                        <Mail className="h-4 w-4 text-white" />
                      </div>
                      Correo electrónico
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="correo@empresa.com"
                      value={newContact.email}
                      onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                      className="h-12 text-base border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 rounded-xl shadow-sm"
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
                      className="h-12 text-base border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 rounded-xl shadow-sm"
                    />
                  </div>

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
                      className="h-12 text-base border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 rounded-xl shadow-sm"
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
                      className="h-12 text-base border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 rounded-xl shadow-sm"
                    />
                  </div>
                </div>

                {/* Workflow Progress Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Progreso del Flujo</h3>
                    <Badge
                      variant="outline"
                      className="bg-white border-blue-300 text-blue-700 px-3 py-1 text-sm font-medium"
                    >
                      Paso {workflowState.currentStep} de 5
                    </Badge>
                  </div>

                  {/* Workflow Steps */}
                  <div className="flex items-center justify-between mb-8">
                    {[
                      { step: 1, label: "Servicio", completed: workflowState.selectedService !== null },
                      { step: 2, label: "Plantilla", completed: workflowState.selectedTemplate !== null },
                      { step: 3, label: "Generar", completed: workflowState.generatedProposal !== null },
                      { step: 4, label: "Firmar", completed: workflowState.signedDocument !== null },
                      { step: 5, label: "Enviar", completed: workflowState.sentDocument !== null },
                    ].map((item, index) => (
                      <div key={item.step} className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                            item.completed
                              ? "bg-green-500 text-white shadow-lg"
                              : workflowState.currentStep === item.step
                                ? "bg-blue-500 text-white shadow-lg ring-4 ring-blue-200"
                                : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {item.completed ? <CheckCircle className="h-5 w-5" /> : item.step}
                        </div>
                        <span
                          className={`ml-2 text-sm font-medium ${
                            item.completed
                              ? "text-green-700"
                              : workflowState.currentStep === item.step
                                ? "text-blue-700"
                                : "text-gray-500"
                          }`}
                        >
                          {item.label}
                        </span>
                        {index < 4 && (
                          <ChevronRight
                            className={`mx-3 h-4 w-4 ${item.completed ? "text-green-400" : "text-gray-300"}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Workflow Action Buttons */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <Button
                      onClick={handleServiceSelection}
                      disabled={isServiceSelectorBusy}
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12 text-sm font-medium rounded-xl"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Seleccionar Servi...
                    </Button>

                    <Button
                      onClick={handleTemplateSelection}
                      disabled={!workflowState.selectedService || isTemplateSelectorBusy}
                      variant={workflowState.selectedService ? "default" : "secondary"}
                      className={`h-12 text-sm font-medium rounded-xl transition-all duration-200 ${
                        workflowState.selectedService
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Seleccionar Plant...
                    </Button>

                    <Button
                      onClick={handleGenerateProposal}
                      disabled={
                        !workflowState.selectedService || !workflowState.selectedTemplate || isProposalGenerating
                      }
                      variant={
                        workflowState.selectedService && workflowState.selectedTemplate ? "default" : "secondary"
                      }
                      className={`h-12 text-sm font-medium rounded-xl transition-all duration-200 ${
                        workflowState.selectedService && workflowState.selectedTemplate
                          ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {isProposalGenerating ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      Generar Propuest...
                    </Button>

                    <Button
                      onClick={handleDigitalSignature}
                      disabled={!workflowState.generatedProposal}
                      variant={workflowState.generatedProposal ? "default" : "secondary"}
                      className={`h-12 text-sm font-medium rounded-xl transition-all duration-200 ${
                        workflowState.generatedProposal
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <PenTool className="mr-2 h-4 w-4" />
                      Firma Digital
                    </Button>

                    <Button
                      onClick={handleSendDocument}
                      disabled={!workflowState.signedDocument}
                      variant={workflowState.signedDocument ? "default" : "secondary"}
                      className={`h-12 text-sm font-medium rounded-xl transition-all duration-200 ${
                        workflowState.signedDocument
                          ? "bg-teal-600 hover:bg-teal-700 text-white shadow-lg hover:shadow-xl"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Documento
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex-shrink-0 border-t bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between w-full">
                <Button variant="outline" onClick={() => setIsCreateContactOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveContact}
                  disabled={!(newContact.name || searchTerm) || !newContact.email}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {formMode === "edit" ? "Actualizar Contacto" : "Guardar Contacto"}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar contactos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Propietario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50" onDoubleClick={() => handleRowDoubleClick(contact)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                        <div className="text-sm text-gray-500">{contact.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{contact.company || "-"}</div>
                    <div className="text-sm text-gray-500">{contact.job_title || "-"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="outline" className={getStatusColor(contact.status)}>
                      {getStatusText(contact.status)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contact.sales_owner || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleContactDetails(contact)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detalles
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
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
                        }}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      {contact.status === "lead" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedContact(contact)
                            setIsConvertDialogOpen(true)
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Convertir
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay contactos</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "No se encontraron contactos con ese criterio" : "Comienza agregando un nuevo contacto"}
            </p>
          </div>
        )}
      </div>

      {/* Service Selector Dialog */}
      {isServiceSelectorOpen && (
        <ServiceSelector
          isOpen={isServiceSelectorOpen}
          onClose={() => {
            console.log("[v0] Closing service selector dialog")
            setIsServiceSelectorOpen(false)
          }}
          onServiceSelect={(service) => {
            console.log("[v0] Service selected:", service.name)
            handleServiceSelect(service)
          }}
          services={services}
        />
      )}

      {/* Template Selector Dialog */}
      {isTemplateSelectorOpen && (
        <TemplateSelector
          isOpen={isTemplateSelectorOpen}
          onClose={() => {
            console.log("[v0] Closing template selector dialog")
            setIsTemplateSelectorOpen(false)
            setIsServiceSelectorBusy(false)
          }}
          onTemplateSelect={handleTemplateSelect}
          serviceId={workflowState.selectedService?.id}
        />
      )}
    </div>
  )
}
