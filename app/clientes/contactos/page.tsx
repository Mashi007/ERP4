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
  FileText,
  Package,
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

export default function ContactosPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isNewContactOpen, setIsNewContactOpen] = useState(false)
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

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
  }, [])

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
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-semibold">Crear Nuevo Contacto</DialogTitle>
              </div>
              <DialogDescription className="text-sm text-muted-foreground">
                Agrega un nuevo contacto a tu base de datos de leads.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-6">
              <div className="space-y-2 relative">
                <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
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
                      // Delay hiding suggestions to allow clicking
                      setTimeout(() => setShowSuggestions(false), 200)
                    }}
                    className="h-11"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>

                {showSuggestions && contactSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    <div className="p-2 text-xs text-gray-500 border-b">
                      Contactos existentes - Selecciona para auto-completar
                    </div>
                    {contactSuggestions.map((contact) => (
                      <div
                        key={contact.id}
                        className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => handleContactSelect(contact)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{contact.name}</p>
                            <p className="text-sm text-gray-500 truncate">{contact.company}</p>
                            <p className="text-xs text-gray-400 truncate">{contact.email}</p>
                          </div>
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {contact.stage || "Nuevo"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="juan.perez@empresa.com"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+34 600 123 456"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-600" />
                    Empresa
                  </Label>
                  <Input
                    id="company"
                    placeholder="Nombre de la empresa"
                    value={newContact.company}
                    onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job_title" className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                    Cargo
                  </Label>
                  <Input
                    id="job_title"
                    placeholder="Director de Marketing"
                    value={newContact.job_title}
                    onChange={(e) => setNewContact({ ...newContact, job_title: e.target.value })}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50/30 rounded-lg border border-blue-200">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-semibold flex items-center gap-2 text-blue-800">
                    <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                    Estado
                  </Label>
                  <Select
                    value={newContact.status}
                    onValueChange={(value) => setNewContact({ ...newContact, status: value })}
                  >
                    <SelectTrigger className="h-11 bg-white border-blue-300 focus:border-blue-500">
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

                <div className="space-y-2">
                  <Label htmlFor="stage" className="text-sm font-semibold flex items-center gap-2 text-blue-800">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    Etapa
                  </Label>
                  <Select
                    value={newContact.stage}
                    onValueChange={(value) => setNewContact({ ...newContact, stage: value })}
                  >
                    <SelectTrigger className="h-11 bg-white border-blue-300 focus:border-blue-500">
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

            <DialogFooter className="flex flex-col gap-3 pt-6 border-t">
              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  onClick={() => {
                    // TODO: Implement catalog functionality
                    toast.success("Abriendo catálogo...")
                  }}
                  className="flex-1 border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400"
                >
                  <Package className="mr-2 h-4 w-4" />
                  Catálogo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // TODO: Implement proposal functionality
                    toast.success("Creando propuesta...")
                  }}
                  className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Propuesta
                </Button>
              </div>

              <div className="flex gap-3 w-full">
                <Button variant="outline" onClick={() => setIsNewContactOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleCreateContact} className="flex-1 bg-blue-600 hover:bg-blue-700">
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">Editar Contacto</DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground">
              Modifica la información del contacto.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  Nombre completo
                </Label>
                <Input
                  id="edit-name"
                  placeholder="Ej: Juan Pérez"
                  value={editContact.name}
                  onChange={(e) => setEditContact({ ...editContact, name: e.target.value })}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  Correo electrónico
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="juan.perez@empresa.com"
                  value={editContact.email}
                  onChange={(e) => setEditContact({ ...editContact, email: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone" className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                  Teléfono
                </Label>
                <Input
                  id="edit-phone"
                  placeholder="+34 600 123 456"
                  value={editContact.phone}
                  onChange={(e) => setEditContact({ ...editContact, phone: e.target.value })}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-company" className="text-sm font-medium flex items-center gap-2">
                  <Building className="h-4 w-4 text-blue-600" />
                  Empresa
                </Label>
                <Input
                  id="edit-company"
                  placeholder="Nombre de la empresa"
                  value={editContact.company}
                  onChange={(e) => setEditContact({ ...editContact, company: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-job-title" className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-600" />
                Cargo
              </Label>
              <Input
                id="edit-job-title"
                placeholder="Director de Marketing"
                value={editContact.job_title}
                onChange={(e) => setEditContact({ ...editContact, job_title: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50/30 rounded-lg border border-blue-200">
              <div className="space-y-2">
                <Label htmlFor="edit-status" className="text-sm font-semibold flex items-center gap-2 text-blue-800">
                  <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                  Estado
                </Label>
                <Select
                  value={editContact.status}
                  onValueChange={(value) => setEditContact({ ...editContact, status: value })}
                >
                  <SelectTrigger className="h-11 bg-white border-blue-300 focus:border-blue-500">
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

              <div className="space-y-2">
                <Label htmlFor="edit-stage" className="text-sm font-semibold flex items-center gap-2 text-blue-800">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Etapa
                </Label>
                <Select
                  value={editContact.stage}
                  onValueChange={(value) => setEditContact({ ...editContact, stage: value })}
                >
                  <SelectTrigger className="h-11 bg-white border-blue-300 focus:border-blue-500">
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

          <DialogFooter className="flex flex-col gap-3 pt-6 border-t">
            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                onClick={() => {
                  // TODO: Implement catalog functionality
                  toast.success("Abriendo catálogo...")
                }}
                className="flex-1 border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400"
              >
                <Package className="mr-2 h-4 w-4" />
                Catálogo
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // TODO: Implement proposal functionality
                  toast.success("Creando propuesta...")
                }}
                className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
              >
                <FileText className="mr-2 h-4 w-4" />
                Propuesta
              </Button>
            </div>

            <div className="flex gap-3 w-full">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleEditContact} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Guardar Cambios
              </Button>
            </div>
          </DialogFooter>
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
