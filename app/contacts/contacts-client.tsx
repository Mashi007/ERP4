"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import DynamicContactForm from "@/components/contacts/dynamic-contact-form"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Mail, Phone, Building, User, AlertCircle } from "lucide-react"

interface Contact {
  id: number
  name: string
  email?: string
  phone?: string
  company?: string
  job_title?: string
  nif?: string
  status?: string
  created_at: string
  updated_at: string
}

export default function ContactsClient() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showContactForm, setShowContactForm] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/contacts")

      if (response.ok) {
        const data = await response.json()
        setContacts(data.contacts || [])
      } else if (response.status === 404) {
        // Database not configured
        setError("Base de datos no configurada")
        setContacts([])
      } else {
        throw new Error("Error loading contacts")
      }
    } catch (error) {
      console.error("Error loading contacts:", error)
      setError("Error al cargar contactos")
      setContacts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSaveContact = async (contactData: any) => {
    try {
      const url = editingContact ? `/api/contacts/${editingContact.id}` : "/api/contacts"
      const method = editingContact ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: `Contacto ${editingContact ? "actualizado" : "creado"} correctamente`,
        })
        loadContacts()
        setEditingContact(null)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error saving contact")
      }
    } catch (error) {
      console.error("Error saving contact:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar el contacto",
        variant: "destructive",
      })
      throw error // Re-throw to prevent form from closing
    }
  }

  const handleDeleteContact = async (contact: Contact) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar a ${contact.name}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/contacts/${contact.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Contacto eliminado correctamente",
        })
        loadContacts()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error deleting contact")
      }
    } catch (error) {
      console.error("Error deleting contact:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar el contacto",
        variant: "destructive",
      })
    }
  }

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadgeVariant = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "nuevo":
        return "default"
      case "calificado":
        return "secondary"
      case "ganado":
        return "default"
      case "perdido":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contactos</h1>
          <p className="text-muted-foreground">Gestiona tu base de datos de contactos</p>
        </div>
        <Button onClick={() => setShowContactForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Contacto
        </Button>
      </div>

      {error && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Configuración de base de datos requerida</p>
                <p className="text-sm text-orange-700 mt-1">{error}</p>
                <p className="text-sm text-orange-700 mt-2">
                  Para habilitar la gestión de contactos, ejecuta los scripts de configuración de la base de datos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Contactos</CardTitle>
              <CardDescription>
                {contacts.length} contacto{contacts.length !== 1 ? "s" : ""} en total
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar contactos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredContacts.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {contacts.length === 0 ? "No hay contactos" : "No se encontraron contactos"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {contacts.length === 0
                  ? "Comienza agregando tu primer contacto"
                  : "Intenta con un término de búsqueda diferente"}
              </p>
              {contacts.length === 0 && (
                <Button onClick={() => setShowContactForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Primer Contacto
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Información de Contacto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder-user.jpg`} />
                          <AvatarFallback className="text-xs">{getInitials(contact.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{contact.name}</div>
                          {contact.job_title && (
                            <div className="text-sm text-muted-foreground">{contact.job_title}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {contact.company && (
                          <>
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span>{contact.company}</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {contact.email && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span>{contact.email}</span>
                          </div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{contact.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {contact.status && (
                        <Badge variant={getStatusBadgeVariant(contact.status)}>{contact.status}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(contact.created_at).toLocaleDateString("es-ES")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingContact(contact)
                              setShowContactForm(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteContact(contact)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <DynamicContactForm
        isOpen={showContactForm}
        onClose={() => {
          setShowContactForm(false)
          setEditingContact(null)
        }}
        onSave={handleSaveContact}
        editingContact={editingContact}
      />
    </div>
  )
}
