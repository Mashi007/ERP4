"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Users, User, Mail, Phone, Building, Briefcase, FileText, PenTool, Send, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  company: string
  status: string
  created_at: string
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

export default function ContactosPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)

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

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/contacts")
      if (response.ok) {
        const contactsData = await response.json()
        setContacts(contactsData)
      }
    } catch (error) {
      console.error("[v0] Error loading contacts:", error)
    } finally {
      setLoading(false)
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
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      position: "", // This field might not exist in Contact interface
    })
    setShowSuggestions(false)
    setSearchSuggestions([])
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
      id: formData.id || Date.now().toString(),
      flowProgress: flowProgress,
    }

    try {
      if (hasFlowProgress) {
        // Save to both contacts and clients (has flow progress)
        console.log("[v0] Guardando en Contactos y Clientes:", contactToSave)

        await saveToContacts(contactToSave)
        await saveToClients(contactToSave)

        alert("Contacto guardado en Contactos y Clientes")
      } else {
        // Save only to contacts (no flow progress)
        console.log("[v0] Guardando solo en Contactos:", contactToSave)

        await saveToContacts(contactToSave)

        alert("Contacto guardado en Contactos")
      }

      // Reset form and close dialog
      resetForm()
      setIsCreateOpen(false)
      await loadContacts()
    } catch (error) {
      console.error("[v0] Error al guardar contacto:", error)
      alert("Error al guardar el contacto")
    }
  }

  const saveToContacts = async (contact: any) => {
    const existingContact = contacts.find((c) => c.email.toLowerCase() === contact.email.toLowerCase())

    if (existingContact) {
      const response = await fetch(`/api/contacts/${existingContact.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      })
      if (!response.ok) throw new Error("Failed to update contact")
    } else {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      })
      if (!response.ok) throw new Error("Failed to create contact")
    }
  }

  const saveToClients = async (contact: any) => {
    // Logic for saving to clients table
    console.log("[v0] Guardado en tabla de clientes:", contact)
    // This would be implemented based on your clients API
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
  }

  const handleFlowProgressChange = (step: string, value: boolean) => {
    setFlowProgress((prev) => ({
      ...prev,
      [step]: value,
    }))
  }

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
                <DialogTitle className="text-xl font-semibold">Crear Nuevo Contacto</DialogTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsCreateOpen(false)} className="h-6 w-6 p-0 z-10">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Agrega un nuevo contacto a tu base de datos de leads y gestiona su información de manera eficiente.
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
                    onClick={() => handleFlowProgressChange("service", true)}
                    className="bg-blue-600 hover:bg-blue-700 justify-start"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Seleccionar Servicio
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleFlowProgressChange("template", true)}
                    className="justify-start"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Seleccionar Plantilla
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleFlowProgressChange("generate", true)}
                    className="justify-start"
                  >
                    <PenTool className="mr-2 h-4 w-4" />
                    Generar Propuesta
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleFlowProgressChange("sign", true)}
                    className="justify-start"
                  >
                    <PenTool className="mr-2 h-4 w-4" />
                    Firma Digital
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={() => handleFlowProgressChange("send", true)}
                  className="w-full justify-center"
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
                    {hasFlowProgress ? "Guardar Cliente" : "Guardar Contacto"}
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

        <div className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
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
      </div>
    </div>
  )
}
