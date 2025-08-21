"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Users, User, Mail, Phone, Building, Briefcase, FileText, PenTool, Send, X } from "lucide-react"

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

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
  })

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
    // Simular carga de contactos
    setLoading(false)
    setContacts([])
  }, [])

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveContact = () => {
    console.log("[v0] Saving contact:", formData)
    // TODO: Implement actual save logic
    setIsCreateOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      position: "",
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

                <Input
                  placeholder="Buscar contacto existente o escribir nuevo nombre..."
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full"
                />

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

                <div className="flex items-center gap-2 mb-6">
                  {workflowState.steps.map((step, index) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          index === 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {step}
                      </div>
                      {index < workflowState.steps.length - 1 && <div className="w-4 h-px bg-gray-200 mx-1" />}
                    </div>
                  ))}
                </div>

                {/* Workflow Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Seleccionar Servicio
                  </Button>
                  <Button variant="outline" disabled>
                    <FileText className="mr-2 h-4 w-4" />
                    Seleccionar Plantilla
                  </Button>
                  <Button variant="outline" disabled>
                    <PenTool className="mr-2 h-4 w-4" />
                    Generar Propuesta
                  </Button>
                  <Button variant="outline" disabled>
                    <PenTool className="mr-2 h-4 w-4" />
                    Firma Digital
                  </Button>
                  <Button variant="outline" disabled className="col-span-2 bg-transparent">
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Documento
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4 mt-6 border-t">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveContact}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!formData.name || !formData.email}
                >
                  Guardar Contacto
                </Button>
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
