"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Plus,
  Search,
  Users,
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  FileText,
  PenTool,
  Send,
  X,
  Edit,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  company: string
  position?: string
  status: string
  created_at: string
  flowProgress?: {
    service: boolean
    template: boolean
    generate: boolean
    sign: boolean
    send: boolean
  }
  selectedService?: any
  selectedTemplate?: any
}

interface WorkflowState {
  currentStep: number
  steps: string[]
  selectedService: any
  selectedTemplate: any
  generatedProposal: any
  signedDocument: any
  sentDocument: any
}

interface ContactFormData {
  id?: string
  name: string
  email: string
  phone: string
  company: string
  position: string
}

interface Service {
  id: string
  name: string
  category: string
  description: string
  price: number
  base_price: number
}

interface Template {
  id: number
  name: string
  description: string
  content: string
  variables: any
  category: string
  is_active: boolean
  created_at: string
}

export default function ContactosPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingContactId, setEditingContactId] = useState<string | null>(null)

  const [searchSuggestions, setSearchSuggestions] = useState<Contact[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
  })

  const [flowProgress, setFlowProgress] = useState({
    service: false,
    template: false,
    generate: false,
    sign: false,
    send: false,
  })

  const hasFlowProgress = useMemo(() => {
    return Object.values(flowProgress).some((value) => value === true)
  }, [flowProgress])

  const [workflowState, setWorkflowState] = useState<WorkflowState>({
    currentStep: 1,
    steps: ["Servicio", "Plantilla", "Generar", "Firmar", "Enviar"],
    selectedService: null,
    selectedTemplate: null,
    generatedProposal: null,
    signedDocument: null,
    sentDocument: null,
  })

  const [isServiceCatalogOpen, setIsServiceCatalogOpen] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  const [templates, setTemplates] = useState<Template[]>([])
  const [templatesLoading, setTemplatesLoading] = useState(false)
  const [templateSearchTerm, setTemplateSearchTerm] = useState("")
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<string>("all")

  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false)
  const [signatureLoading, setSignatureLoading] = useState(false)
  const [proposalDocument, setProposalDocument] = useState<any>(null)
  const [signatureData, setSignatureData] = useState<string | null>(null)

  const [editingContact, setEditingContact] = useState<Contact | null>(null)

  const [proposalGenerating, setProposalGenerating] = useState(false)
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false)

  useEffect(() => {
    loadContacts()
    loadServices()
  }, [])

  useEffect(() => {
    if (isTemplateSelectorOpen) {
      loadTemplates()
    }
  }, [isTemplateSelectorOpen])

  const loadContacts = async () => {
    try {
      setLoading(true)
      console.log("[v0] Loading contacts from database...")
      const response = await fetch("/api/contacts")
      if (response.ok) {
        const contactsData = await response.json()
        console.log("[v0] Contacts loaded successfully:", contactsData.length, "contacts")
        setContacts(contactsData)
      } else {
        console.log("[v0] Failed to load contacts, status:", response.status)
      }
    } catch (error) {
      console.error("[v0] Error loading contacts:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadServices = async () => {
    try {
      const response = await fetch("/api/services")
      if (response.ok) {
        const servicesData = await response.json()
        setServices(servicesData)
      }
    } catch (error) {
      console.error("[v0] Error loading services:", error)
    }
  }

  const loadTemplates = async () => {
    try {
      setTemplatesLoading(true)
      console.log("[v0] Loading templates from proposals system...")
      const response = await fetch("/api/templates/proposals")
      if (response.ok) {
        const templatesData = await response.json()
        console.log("[v0] Templates loaded successfully:", templatesData.length, "templates")
        setTemplates(templatesData)
      } else {
        console.error("[v0] Failed to load templates, status:", response.status)
      }
    } catch (error) {
      console.error("[v0] Error loading templates:", error)
    } finally {
      setTemplatesLoading(false)
    }
  }

  const handleNameSearch = (value: string) => {
    setFormData((prev) => ({ ...prev, name: value }))

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // Start search when 4+ characters
    if (value.length >= 4) {
      setSearchLoading(true)
      setShowSuggestions(true)

      // Simulate API search (replace with actual API call)
      const filtered = contacts.filter(
        (contact) =>
          contact.name?.toLowerCase().includes(value.toLowerCase()) ||
          contact.email?.toLowerCase().includes(value.toLowerCase()) ||
          contact.company?.toLowerCase().includes(value.toLowerCase()),
      )

      setSearchSuggestions(filtered)
      setSearchLoading(false)

      // Auto-fade after 1.5 seconds if no results
      const timeout = setTimeout(() => {
        if (filtered.length === 0) {
          setShowSuggestions(false)
        }
      }, 1500)

      setSearchTimeout(timeout)
    } else {
      setShowSuggestions(false)
      setSearchSuggestions([])
    }
  }

  const selectExistingContact = (contact: Contact) => {
    setFormData({
      id: contact.id.toString(),
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company || "",
      position: contact.position || "",
    })
    setShowSuggestions(false)
    setSearchSuggestions([])
  }

  const handleEditContact = (contact: Contact) => {
    setFormData({
      id: contact.id.toString(),
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company || "",
      position: contact.position || "",
    })

    if (contact.flowProgress) {
      setFlowProgress(contact.flowProgress)
    } else {
      setFlowProgress({
        service: false,
        template: false,
        generate: false,
        sign: false,
        send: false,
      })
    }

    setIsEditMode(true)
    setEditingContactId(contact.id.toString())
    setIsCreateOpen(true)
    setEditingContact(contact)
  }

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveContact = async () => {
    // Basic validation
    if (!formData.name || !formData.email) {
      alert("Por favor, complete los campos obligatorios")
      return
    }

    const contactToSave = {
      ...formData,
      id: isEditMode ? editingContactId : Date.now().toString(),
      flowProgress: flowProgress,
      status: hasFlowProgress ? "active" : "lead",
      created_at: isEditMode ? undefined : new Date().toISOString(),
      selectedService: selectedService,
      selectedTemplate: selectedTemplate,
    }

    try {
      console.log("[v0] Saving contact:", contactToSave)

      if (isEditMode) {
        await updateContact(contactToSave)
        if (hasFlowProgress) {
          await saveToClients(contactToSave)
        }
        alert("Contacto actualizado exitosamente")
      } else {
        if (hasFlowProgress) {
          console.log("[v0] Guardando en Contactos y Clientes:", contactToSave)
          await saveToContacts(contactToSave)
          await saveToClients(contactToSave)
          alert("Contacto guardado en Contactos y Clientes")
        } else {
          console.log("[v0] Guardando solo en Contactos:", contactToSave)
          await saveToContacts(contactToSave)
          alert("Contacto guardado en Contactos")
        }
      }

      // Reset form and close dialog
      resetForm()
      setIsCreateOpen(false)
      await loadContacts()
    } catch (error) {
      console.error("[v0] Error al guardar contacto:", error)
      alert("Error al guardar el contacto: " + error.message)
    }
  }

  const updateContact = async (contact: any) => {
    console.log("[v0] Updating contact with ID:", contact.id)
    const response = await fetch(`/api/contacts/${contact.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Failed to update contact:", errorText)
      throw new Error("Failed to update contact")
    }

    const updatedContact = await response.json()
    console.log("[v0] Contact updated successfully:", updatedContact)

    setContacts((prev) => prev.map((c) => (c.id.toString() === contact.id ? { ...c, ...updatedContact } : c)))
  }

  const saveToContacts = async (contact: any) => {
    console.log("[v0] Calling saveToContacts with:", contact)
    const existingContact = contacts.find((c) => c.email.toLowerCase() === contact.email.toLowerCase())

    if (existingContact) {
      console.log("[v0] Updating existing contact:", existingContact.id)
      const response = await fetch(`/api/contacts/${existingContact.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      })
      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Failed to update contact:", errorText)
        throw new Error("Failed to update contact")
      }

      // Update local state with updated contact
      const updatedContact = await response.json()
      console.log("[v0] Contact updated in database:", updatedContact)
      setContacts((prev) => prev.map((c) => (c.id === existingContact.id ? { ...c, ...updatedContact } : c)))
    } else {
      console.log("[v0] Creating new contact")
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      })
      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Failed to create contact:", errorText)
        throw new Error("Failed to create contact")
      }

      // Add new contact to local state
      const newContact = await response.json()
      console.log("[v0] New contact created in database:", newContact)
      setContacts((prev) => [...prev, newContact])
    }
  }

  const saveToClients = async (contact: any) => {
    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      })

      if (!response.ok) throw new Error("Failed to save to clients")
      return await response.json()
    } catch (error) {
      console.error("[v0] Error saving to clients:", error)
      throw error
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      position: "",
    })
    setFlowProgress({
      service: false,
      template: false,
      generate: false,
      sign: false,
      send: false,
    })
    setWorkflowState({
      currentStep: 1,
      steps: ["Servicio", "Plantilla", "Generar", "Firmar", "Enviar"],
      selectedService: null,
      selectedTemplate: null,
      generatedProposal: null,
      signedDocument: null,
      sentDocument: null,
    })
    setIsEditMode(false)
    setEditingContactId(null)
    setSelectedService(null)
    setSelectedTemplate(null)
  }

  const handleFlowProgressChange = (step: string, value: boolean) => {
    setFlowProgress((prev) => ({
      ...prev,
      [step]: value,
    }))
  }

  const canEnableStep = (stepKey: string) => {
    const steps = ["service", "template", "generate", "sign", "send"]
    const currentIndex = steps.indexOf(stepKey)

    if (currentIndex === 0) return true // Service is always available

    // Check if previous step is completed
    const previousStep = steps[currentIndex - 1]
    return flowProgress[previousStep as keyof typeof flowProgress]
  }

  const handleServiceSelection = (service: Service) => {
    setSelectedService(service)
    setFlowProgress((prev) => ({ ...prev, service: true }))
    setIsServiceCatalogOpen(false)
    console.log("[v0] Service selected:", service)
  }

  const handleTemplateSelection = (template: Template) => {
    setSelectedTemplate(template)
    setFlowProgress((prev) => ({ ...prev, template: true }))
    setIsTemplateSelectorOpen(false)
    console.log("[v0] Template selected:", template)
  }

  const handleGenerateProposal = async () => {
    if (!selectedService || !selectedTemplate) {
      alert("Por favor, selecciona servicio y plantilla primero")
      return
    }

    try {
      setProposalGenerating(true)
      console.log("[v0] Generating proposal with Grok AI...")

      const proposalData = {
        contactData: {
          nombre_fiscal: formData.company || formData.name,
          email: formData.email,
          telefono: formData.phone,
          empresa: formData.company,
          cargo: formData.position,
          domicilio: "Dirección a completar",
          cif_empresa: "CIF a completar",
        },
        serviceData: selectedService,
        templateData: selectedTemplate,
      }

      console.log("[v0] Sending data to Grok AI:", proposalData)

      const response = await fetch("/api/generate-proposal-grok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proposalData),
      })

      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)

      const generatedProposal = await response.json()
      console.log("[v0] Grok AI proposal generated:", generatedProposal)

      if (generatedProposal.content && generatedProposal.content.startsWith("```html")) {
        generatedProposal.content = generatedProposal.content.replace(/```html\n?/, "").replace(/\n?```$/, "")
      }

      setProposalDocument(generatedProposal)
      setWorkflowState((prev) => ({
        ...prev,
        generatedProposal: generatedProposal,
      }))
      setFlowProgress((prev) => ({ ...prev, generate: true }))

      alert("Propuesta generada exitosamente con Grok AI")
    } catch (error) {
      console.error("[v0] Error generando propuesta:", error)
      alert(`Error al generar propuesta: ${error.message}`)
    } finally {
      setProposalGenerating(false)
    }
  }

  const handleDigitalSign = async () => {
    if (!proposalDocument || !proposalDocument.content) {
      alert("Primero debes generar una propuesta antes de firmar")
      return
    }

    try {
      setSignatureLoading(true)
      console.log("[v0] Loading proposal document for signature...")

      if (!proposalDocument.pdfUrl || proposalDocument.pdfUrl.includes("generated-")) {
        console.log("[v0] Generating PDF from HTML content...")

        const pdfResponse = await fetch("/api/generate-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            htmlContent: proposalDocument.content,
            contactId: formData.id || Date.now(),
            proposalId: proposalDocument.id,
          }),
        })

        if (pdfResponse.ok) {
          const pdfData = await pdfResponse.json()
          setProposalDocument((prev) => ({
            ...prev,
            pdfUrl: pdfData.pdfUrl,
            htmlContent: pdfData.htmlContent,
          }))
        }
      }

      setIsSignatureModalOpen(true)
    } catch (error) {
      console.error("[v0] Error loading document for signature:", error)
      alert("Error al cargar documento: " + error.message)
    } finally {
      setSignatureLoading(false)
    }
  }

  const handleSignatureComplete = async (signature: string) => {
    try {
      setSignatureLoading(true)
      console.log("[v0] Processing digital signature...")

      let proposalId = proposalDocument.id

      // If the proposal ID is not numeric (Grok AI generated), save it to database first
      if (isNaN(Number(proposalId))) {
        console.log("[v0] Saving Grok AI proposal to database...")
        const saveResponse = await fetch("/api/proposals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contact_id: editingContact?.id || null,
            service_id: workflowState.selectedService?.id || null,
            template_id: workflowState.selectedTemplate?.id || null,
            title: `Propuesta para ${formData.name}`,
            content: proposalDocument.content,
            status: "draft",
            total_amount: workflowState.selectedService?.base_price || "0",
            currency: workflowState.selectedService?.currency || "EUR",
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          }),
        })

        if (!saveResponse.ok) {
          throw new Error("Failed to save proposal to database")
        }

        const savedProposal = await saveResponse.json()
        proposalId = savedProposal.id
        console.log("[v0] Proposal saved with ID:", proposalId)
      }

      const signatureResponse = await fetch(`/api/proposals/${proposalId}/signature`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signatureData: signature,
          signerName: formData.name,
          signerEmail: formData.email,
          signedAt: new Date().toISOString(),
        }),
      })

      if (!signatureResponse.ok) {
        const errorData = await signatureResponse.json()
        console.error("[v0] Signature API error:", errorData)
        throw new Error(errorData.error || "Failed to process signature")
      }

      const signedDocument = await signatureResponse.json()

      // Update workflow state with signed document
      setWorkflowState((prev) => ({
        ...prev,
        signedDocument: signedDocument,
      }))

      setFlowProgress((prev) => ({ ...prev, sign: true }))
      setSignatureData(signature)
      setIsSignatureModalOpen(false)

      console.log("[v0] Document signed successfully")
      alert("Documento firmado digitalmente con éxito")
    } catch (error) {
      console.error("[v0] Error processing signature:", error)
      alert("Error al procesar la firma digital")
    } finally {
      setSignatureLoading(false)
    }
  }

  const handleSendDocument = async () => {
    if (!canEnableStep("send")) return

    try {
      console.log("[v0] Sending document...")
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setFlowProgress((prev) => ({ ...prev, send: true }))
      alert("Documento enviado exitosamente")
    } catch (error) {
      console.error("[v0] Error sending document:", error)
      alert("Error al enviar el documento")
    }
  }

  const handleDeleteContact = async (contactId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este contacto?")) return

    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== contactId))
        alert("Contacto eliminado exitosamente")
      } else {
        throw new Error("Failed to delete contact")
      }
    } catch (error) {
      console.error("[v0] Error deleting contact:", error)
      alert("Error al eliminar el contacto")
    }
  }

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredTemplates = useMemo(() => {
    let filtered = templates.filter((template) => template.is_active)

    // Filter by service category if a service is selected
    if (selectedService && selectedTemplateCategory !== "all") {
      filtered = filtered.filter(
        (template) =>
          template.category.toLowerCase() === selectedService.category.toLowerCase() ||
          template.category.toLowerCase() === "general",
      )
    }

    // Filter by search term
    if (templateSearchTerm) {
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(templateSearchTerm.toLowerCase()) ||
          template.description.toLowerCase().includes(templateSearchTerm.toLowerCase()),
      )
    }

    return filtered
  }, [templates, selectedService, selectedTemplateCategory, templateSearchTerm])

  const templateCategories = useMemo(() => {
    const categories = ["all", ...new Set(templates.map((t) => t.category.toLowerCase()))]
    return categories
  }, [templates])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contactos</h1>
          <p className="text-muted-foreground">Gestiona tus leads y conviértelos en clientes</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Contacto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="mb-4">
              <div className="flex flex-row items-center justify-between">
                <DialogTitle className="text-xl font-semibold">
                  {isEditMode ? "Editar Contacto" : "Crear Nuevo Contacto"}
                </DialogTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsCreateOpen(false)} className="h-6 w-6 p-0 z-10">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {isEditMode
                  ? "Actualiza la información del contacto y gestiona su progreso de flujo."
                  : "Agrega un nuevo contacto a tu base de datos de leads y gestiona su información de manera eficiente."}
              </p>
            </DialogHeader>

            <div className="space-y-6">
              {/* Contact Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-sm">Nombre completo</span>
                </div>

                <div className="relative">
                  <Input
                    placeholder="Buscar contacto existente o escribir nuevo nombre..."
                    value={formData.name}
                    onChange={(e) => handleNameSearch(e.target.value)}
                    className="w-full"
                  />

                  {/* Search suggestions dropdown */}
                  {showSuggestions && (
                    <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                      {searchLoading ? (
                        <div className="p-3 text-center text-sm text-gray-500">Buscando...</div>
                      ) : searchSuggestions.length > 0 ? (
                        <>
                          <div className="p-2 text-xs text-gray-500 border-b">Contactos encontrados:</div>
                          {searchSuggestions.map((contact) => (
                            <div
                              key={contact.id}
                              className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                              onClick={() => selectExistingContact(contact)}
                            >
                              <div className="font-medium text-sm">{contact.name}</div>
                              <div className="text-xs text-gray-500">{contact.email}</div>
                              {contact.company && <div className="text-xs text-gray-400">{contact.company}</div>}
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="p-3 text-center text-sm text-gray-500">
                          No se encontraron contactos
                          <div className="text-xs mt-1">Continúa escribiendo para crear un nuevo contacto</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <Mail className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-sm font-medium">Correo electrónico</span>
                    </div>
                    <Input
                      type="email"
                      placeholder="juan.perez@empresa.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                        <Phone className="h-3 w-3 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium">Teléfono</span>
                    </div>
                    <Input
                      placeholder="+34 600 123 456"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <Building className="h-3 w-3 text-orange-600" />
                      </div>
                      <span className="text-sm font-medium">Empresa</span>
                    </div>
                    <Input
                      placeholder="Nombre de la empresa"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <Briefcase className="h-3 w-3 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium">Cargo</span>
                    </div>
                    <Input
                      placeholder="Director de Marketing"
                      value={formData.position}
                      onChange={(e) => handleInputChange("position", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Progreso del Flujo</h3>
                  <span className="text-sm text-muted-foreground">Paso 1 de 5</span>
                </div>

                {/* Flow progress indicators */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { key: "service", label: "Servicio" },
                    { key: "template", label: "Plantilla" },
                    { key: "generate", label: "Generar" },
                    { key: "sign", label: "Firmar" },
                    { key: "send", label: "Enviar" },
                  ].map((step, index) => (
                    <div
                      key={step.key}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        flowProgress[step.key as keyof typeof flowProgress]
                          ? "bg-green-100 text-green-800"
                          : index === 0
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-600",
                      )}
                    >
                      {step.label}
                    </div>
                  ))}
                </div>

                {/* Workflow Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  <Button
                    onClick={() => setIsServiceCatalogOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 justify-start"
                    disabled={!canEnableStep("service")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {selectedService ? `Servicio: ${selectedService.name}` : "Seleccionar Servicio"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setIsTemplateSelectorOpen(true)}
                    className="justify-start"
                    disabled={!canEnableStep("template")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {selectedTemplate ? `Plantilla: ${selectedTemplate.name}` : "Seleccionar Plantilla"}
                  </Button>

                  {/* Updating generate proposal button to show Grok AI loading state */}
                  <Button
                    variant="outline"
                    onClick={handleGenerateProposal}
                    className="justify-start bg-transparent"
                    disabled={!canEnableStep("generate") || proposalGenerating}
                  >
                    <PenTool className="mr-2 h-4 w-4" />
                    {proposalGenerating ? "Generando con IA..." : "Generar Propuesta"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleDigitalSign}
                    className="justify-start bg-transparent"
                    disabled={!canEnableStep("sign") || signatureLoading}
                  >
                    <PenTool className="mr-2 h-4 w-4" />
                    {signatureLoading
                      ? "Cargando..."
                      : workflowState.signedDocument
                        ? "Documento Firmado"
                        : "Firma Digital"}
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={handleSendDocument}
                  className="w-full justify-center bg-transparent"
                  disabled={!canEnableStep("send")}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Documento
                </Button>
              </div>

              <div className="flex justify-between items-center pt-4 mt-6 border-t">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </Button>

                <div className="flex items-center space-x-3">
                  {/* Indicator of where it will be saved */}
                  <div className="text-sm">
                    {hasFlowProgress ? (
                      <span className="text-green-600 font-medium">Se guardará en: Contactos y Clientes</span>
                    ) : (
                      <span className="text-blue-600 font-medium">Se guardará en: Contactos</span>
                    )}
                  </div>

                  <Button
                    onClick={handleSaveContact}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!formData.name || !formData.email}
                  >
                    {isEditMode
                      ? hasFlowProgress
                        ? "Actualizar Cliente"
                        : "Actualizar Contacto"
                      : hasFlowProgress
                        ? "Guardar Cliente"
                        : "Guardar Contacto"}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Lista de Contactos</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar contactos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Badge variant="outline" className="text-sm">
                {filteredContacts.length} contactos
              </Badge>
            </div>
          </div>
        </div>

        {/* Conditional rendering for contacts table vs empty state */}
        {filteredContacts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contact.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contact.phone || "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contact.company || "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={contact.status === "client" ? "default" : "secondary"}
                        className={
                          contact.status === "client" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }
                      >
                        {contact.status === "client" ? "Cliente" : "Contacto"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(contact.created_at).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditContact(contact)}
                        className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">No hay contactos</h3>
                <p className="text-sm text-gray-500 mt-1">Comienza agregando tu primer contacto.</p>
              </div>
              <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Crear Primer Contacto
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isServiceCatalogOpen} onOpenChange={setIsServiceCatalogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Catálogo de Servicios</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Selecciona un servicio para continuar con el flujo de trabajo
            </p>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => handleServiceSelection(service)}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <h3 className="font-medium text-sm">{service.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{service.category}</p>
                <p className="text-xs text-gray-600 mt-2">{service.description}</p>
                <p className="text-sm font-medium text-blue-600 mt-2">€{service.price}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isTemplateSelectorOpen} onOpenChange={setIsTemplateSelectorOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Seleccionar Plantilla de Propuesta</DialogTitle>
            <p className="text-sm text-muted-foreground">
              {selectedService
                ? `Plantillas compatibles con ${selectedService.name} (${selectedService.category})`
                : "Selecciona una plantilla para generar la propuesta"}
            </p>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar plantillas por nombre o descripción..."
                    value={templateSearchTerm}
                    onChange={(e) => setTemplateSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={selectedTemplateCategory}
                  onChange={(e) => setSelectedTemplateCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas las categorías</option>
                  {templateCategories.slice(1).map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Templates Grid */}
            {templatesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-sm text-gray-600">Cargando plantillas...</span>
              </div>
            ) : filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelection(template)}
                    className={cn(
                      "p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md",
                      selectedTemplate?.id === template.id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm text-gray-900 line-clamp-2">{template.name}</h3>
                      <Badge variant="outline" className="ml-2 text-xs shrink-0">
                        {template.category}
                      </Badge>
                    </div>

                    <p className="text-xs text-gray-600 mb-3 line-clamp-3">
                      {template.description || "Plantilla de propuesta profesional"}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(template.created_at).toLocaleDateString("es-ES")}</span>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>Plantilla</span>
                      </div>
                    </div>

                    {/* Template Preview Indicator */}
                    {template.content && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Vista previa disponible</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay plantillas disponibles</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {templateSearchTerm || selectedTemplateCategory !== "all"
                    ? "No se encontraron plantillas que coincidan con los filtros aplicados."
                    : selectedService
                      ? `No hay plantillas disponibles para la categoría ${selectedService.category}.`
                      : "No hay plantillas de propuesta disponibles en el sistema."}
                </p>
                {(templateSearchTerm || selectedTemplateCategory !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTemplateSearchTerm("")
                      setSelectedTemplateCategory("all")
                    }}
                    className="text-sm"
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>
            )}

            {/* Selected Template Summary */}
            {selectedTemplate && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <FileText className="h-3 w-3 text-white" />
                  </div>
                  <span className="font-medium text-blue-900">Plantilla Seleccionada</span>
                </div>
                <p className="text-sm text-blue-800">
                  <strong>{selectedTemplate.name}</strong> - {selectedTemplate.description}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Categoría: {selectedTemplate.category} | Creada:{" "}
                  {new Date(selectedTemplate.created_at).toLocaleDateString("es-ES")}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 mt-6 border-t">
            <Button variant="outline" onClick={() => setIsTemplateSelectorOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => setIsTemplateSelectorOpen(false)}
              disabled={!selectedTemplate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Confirmar Selección
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {isSignatureModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Firma Digital del Documento</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSignatureModalOpen(false)}
                  disabled={signatureLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Revise el documento y agregue su firma digital para continuar
              </p>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {proposalDocument ? (
                <div className="space-y-6">
                  {/* Document Preview */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium mb-2">Vista Previa del Documento</h4>
                    <div className="bg-white p-4 rounded border min-h-[300px]">
                      {proposalDocument.pdfUrl ? (
                        <iframe
                          src={proposalDocument.pdfUrl}
                          className="w-full h-[400px] border-0"
                          title="Proposal Document"
                        />
                      ) : (
                        <div className="text-center py-8 text-gray-500">Cargando vista previa del documento...</div>
                      )}
                    </div>
                  </div>

                  {/* Signature Pad */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-4">Agregar Firma Digital</h4>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <canvas
                          id="signature-pad"
                          width="600"
                          height="200"
                          className="border rounded mx-auto cursor-crosshair"
                          style={{ touchAction: "none" }}
                        />
                        <p className="text-sm text-gray-600 mt-2">Dibuje su firma en el área de arriba</p>
                      </div>

                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          onClick={() => {
                            const canvas = document.getElementById("signature-pad") as HTMLCanvasElement
                            const ctx = canvas?.getContext("2d")
                            if (ctx) {
                              ctx.clearRect(0, 0, canvas.width, canvas.height)
                            }
                          }}
                        >
                          Limpiar
                        </Button>
                        <Button
                          onClick={() => {
                            const canvas = document.getElementById("signature-pad") as HTMLCanvasElement
                            if (canvas) {
                              const signatureDataUrl = canvas.toDataURL()
                              handleSignatureComplete(signatureDataUrl)
                            }
                          }}
                          disabled={signatureLoading}
                        >
                          {signatureLoading ? "Procesando..." : "Firmar Documento"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Document Information */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Información del Documento</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>
                        <strong>Contacto:</strong> {formData.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {formData.email}
                      </p>
                      <p>
                        <strong>Servicio:</strong> {selectedService?.name}
                      </p>
                      <p>
                        <strong>Plantilla:</strong> {selectedTemplate?.name}
                      </p>
                      <p>
                        <strong>Fecha:</strong> {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Cargando documento...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
