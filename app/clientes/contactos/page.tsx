"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Search,
  ArrowRight,
  Edit,
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  TrendingUp,
  Package,
  Sparkles,
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

  useEffect(() => {
    fetchContacts()
    fetchServices()
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

  const searchContacts = async (query: string) => {
    if (query.length < 2) {
      setContactSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/contacts/search?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const suggestions = await response.json()
        setContactSuggestions(suggestions.slice(0, 5)) // Limit to 5 suggestions
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error("Error searching contacts:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleContactSelect = (contact: Contact) => {
    setNewContact({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      job_title: contact.job_title,
      sales_owner: contact.sales_owner,
      stage: contact.stage || "Nuevo",
      status: contact.status,
    })
    setShowSuggestions(false)
    setContactSuggestions([])
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
    setSelectedService(service)
    setIsServiceSelectorOpen(false)
    toast.success(`Servicio seleccionado: ${service.name}`)
  }

  const handleCatalogClick = (formType: "create" | "edit") => {
    setCurrentFormType(formType)
    setIsServiceSelectorOpen(true)
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
              <div className="space-y-3 relative">
                <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  Nombre completo
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    placeholder="Buscar contacto existente o escribir nuevo nombre..."
                    value={newContact.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onFocus={() => {
                      if (newContact.name.length >= 2) {
                        searchContacts(newContact.name)
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowSuggestions(false), 200)
                    }}
                    className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>

                {showSuggestions && contactSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
                    <div className="p-3 text-xs font-medium text-gray-600 border-b bg-gray-50">
                      Contactos existentes - Selecciona para auto-completar
                    </div>
                    {contactSuggestions.map((contact) => (
                      <div
                        key={contact.id}
                        className="p-4 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                        onClick={() => handleContactSelect(contact)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate text-base">{contact.name}</p>
                            <p className="text-sm text-gray-600 truncate">{contact.company}</p>
                            <p className="text-xs text-gray-500 truncate">{contact.email}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-xs bg-blue-50 text-blue-700 border-blue-200 font-medium"
                          >
                            {contact.stage || "Nuevo"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
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
                    className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>

                <div className="space-y-3">
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
                    className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
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
                    className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>

                <div className="space-y-3">
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
                    className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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

            <DialogFooter className="flex flex-col gap-4 pt-8 border-t border-gray-100">
              {selectedService && (
                <div className="w-full p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-green-800">{selectedService.name}</h4>
                      <p className="text-sm text-green-600">{selectedService.description}</p>
                      <p className="text-xs text-green-500 mt-1">
                        {selectedService.currency} {selectedService.base_price} • {selectedService.duration}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedService(null)}
                      className="text-green-700 border-green-300 hover:bg-green-100"
                    >
                      Cambiar
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex gap-4 w-full">
                <Button
                  variant="outline"
                  onClick={() => handleCatalogClick("create")}
                  className="flex-1 h-12 border-2 border-green-300 text-green-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:border-green-400 transition-all duration-200 font-semibold shadow-sm"
                >
                  <Package className="mr-3 h-5 w-5" />
                  {selectedService ? "Cambiar Servicio" : "Seleccionar Servicio"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleProposalClick("create")}
                  disabled={isProposalGenerating || !selectedService}
                  className="flex-1 h-12 border-2 border-blue-300 text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:border-blue-400 transition-all duration-200 font-semibold shadow-sm disabled:opacity-50"
                >
                  {isProposalGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                      Generando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-3 h-5 w-5" />
                      Generar Propuesta IA
                    </>
                  )}
                </Button>
              </div>

              <div className="flex gap-4 w-full">
                <Button
                  variant="outline"
                  onClick={() => setIsNewContactOpen(false)}
                  className="flex-1 h-12 border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 font-semibold"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateContact}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                >
                  Crear Contacto
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar contactos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 border-b border-gray-200">
              <TableHead className="font-semibold text-gray-900 py-4 px-6">Nombre</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4 px-4">Empresa</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4 px-4">Email</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4 px-4">Teléfono</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4 px-4">Cargo</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4 px-4">Responsable</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4 px-4 text-center">Etapa</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4 px-4 text-center">Estado</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4 px-4 text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.map((contact, index) => (
              <TableRow
                key={contact.id}
                className={`cursor-pointer transition-all duration-200 hover:bg-blue-50/50 border-b border-gray-100 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                }`}
                onDoubleClick={() => handleRowDoubleClick(contact)}
              >
                <TableCell className="font-medium text-gray-900 py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium">{contact.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span>{contact.company}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600 py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{contact.email}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600 py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{contact.phone}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{contact.job_title}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 py-4 px-4">
                  <span className="text-sm font-medium">{contact.sales_owner}</span>
                </TableCell>
                <TableCell className="py-4 px-4 text-center">
                  <Badge
                    variant="outline"
                    className={`font-medium px-3 py-1 text-xs border ${
                      contact.stage === "Ganado"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : contact.stage === "Perdido"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : contact.stage === "Negociación"
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : contact.stage === "Propuesta"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : contact.stage === "Calificación"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : contact.stage === "Cierre"
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  >
                    {contact.stage || "Nuevo"}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-4 text-center">
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(contact.status)} font-medium px-3 py-1 text-xs border`}
                  >
                    {getStatusText(contact.status)}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-4">
                  <div className="flex items-center justify-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRowDoubleClick(contact)}
                      className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {contact.status === "lead" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedContact(contact)
                          setIsConvertDialogOpen(true)
                        }}
                        className="h-8 w-8 p-0 hover:bg-emerald-100 hover:text-emerald-600 transition-colors"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No se encontraron contactos</p>
            <p className="text-gray-400 text-sm">Intenta ajustar los filtros de búsqueda</p>
          </div>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold tracking-tight">Editar Contacto</DialogTitle>
              {selectedService && (
                <Badge className="bg-green-100 text-green-800 border-green-300">Servicio: {selectedService.name}</Badge>
              )}
            </div>
            <DialogDescription className="text-base text-muted-foreground leading-relaxed">
              Modifica la información del contacto y gestiona sus datos de manera eficiente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 py-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="edit-name" className="text-sm font-semibold flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  Nombre completo
                </Label>
                <Input
                  id="edit-name"
                  placeholder="Ej: Juan Pérez"
                  value={editContact.name}
                  onChange={(e) => setEditContact({ ...editContact, name: e.target.value })}
                  className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="edit-email" className="text-sm font-semibold flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                  Correo electrónico
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="juan.perez@empresa.com"
                  value={editContact.email}
                  onChange={(e) => setEditContact({ ...editContact, email: e.target.value })}
                  className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="edit-phone" className="text-sm font-semibold flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  Teléfono
                </Label>
                <Input
                  id="edit-phone"
                  placeholder="+34 600 123 456"
                  value={editContact.phone}
                  onChange={(e) => setEditContact({ ...editContact, phone: e.target.value })}
                  className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="edit-company" className="text-sm font-semibold flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                    <Building className="h-4 w-4 text-white" />
                  </div>
                  Empresa
                </Label>
                <Input
                  id="edit-company"
                  placeholder="Nombre de la empresa"
                  value={editContact.company}
                  onChange={(e) => setEditContact({ ...editContact, company: e.target.value })}
                  className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="edit-job-title" className="text-sm font-semibold flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Briefcase className="h-4 w-4 text-white" />
                </div>
                Cargo
              </Label>
              <Input
                id="edit-job-title"
                placeholder="Director de Marketing"
                value={editContact.job_title}
                onChange={(e) => setEditContact({ ...editContact, job_title: e.target.value })}
                className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-sm">
              <div className="space-y-3">
                <Label htmlFor="edit-status" className="text-sm font-bold flex items-center gap-3 text-blue-900">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-sm"></div>
                  Estado
                </Label>
                <Select
                  value={editContact.status}
                  onValueChange={(value) => setEditContact({ ...editContact, status: value })}
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
                <Label htmlFor="edit-stage" className="text-sm font-bold flex items-center gap-3 text-blue-900">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                    <TrendingUp className="h-3 w-3 text-white" />
                  </div>
                  Etapa
                </Label>
                <Select
                  value={editContact.stage}
                  onValueChange={(value) => setEditContact({ ...editContact, stage: value })}
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

          <DialogFooter className="flex flex-col gap-4 pt-8 border-t border-gray-100">
            {selectedService && (
              <div className="w-full p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-green-800">{selectedService.name}</h4>
                    <p className="text-sm text-green-600">{selectedService.description}</p>
                    <p className="text-xs text-green-500 mt-1">
                      {selectedService.currency} {selectedService.base_price} • {selectedService.duration}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedService(null)}
                    className="text-green-700 border-green-300 hover:bg-green-100"
                  >
                    Cambiar
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-4 w-full">
              <Button
                variant="outline"
                onClick={() => handleCatalogClick("edit")}
                className="flex-1 h-12 border-2 border-green-300 text-green-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:border-green-400 transition-all duration-200 font-semibold shadow-sm"
              >
                <Package className="mr-3 h-5 w-5" />
                {selectedService ? "Cambiar Servicio" : "Seleccionar Servicio"}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleProposalClick("edit")}
                disabled={isProposalGenerating || !selectedService}
                className="flex-1 h-12 border-2 border-blue-300 text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:border-blue-400 transition-all duration-200 font-semibold shadow-sm disabled:opacity-50"
              >
                {isProposalGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-3 h-5 w-5" />
                    Generar Propuesta IA
                  </>
                )}
              </Button>
            </div>

            <div className="flex gap-4 w-full">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1 h-12 border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 font-semibold"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleEditContact}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                Guardar Cambios
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isServiceSelectorOpen} onOpenChange={setIsServiceSelectorOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Seleccionar Servicio</DialogTitle>
            <DialogDescription>
              Elige un servicio del catálogo para generar una propuesta personalizada
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleServiceSelect(service)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {service.category}
                      </Badge>
                      <span className="text-sm text-gray-500">{service.duration}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-green-600">
                      {service.currency} {service.base_price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {services.length === 0 && <div className="text-center py-8 text-gray-500">No hay servicios disponibles</div>}
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
  )
}
