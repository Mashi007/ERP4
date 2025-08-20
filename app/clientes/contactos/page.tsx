"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Plus, Search, ArrowRight, Edit } from "lucide-react"
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

  // Form states
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    job_title: "",
    sales_owner: "María García",
  })

  const [editContact, setEditContact] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    job_title: "",
    sales_owner: "",
  })

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
        body: JSON.stringify({
          ...newContact,
          status: "lead",
        }),
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
        return "bg-blue-100 text-blue-800"
      case "qualified":
        return "bg-green-100 text-green-800"
      case "client":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Contacto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Contacto</DialogTitle>
              <DialogDescription>Agrega un nuevo contacto a tu base de datos de leads.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">
                  Empresa
                </Label>
                <Input
                  id="company"
                  value={newContact.company}
                  onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="job_title" className="text-right">
                  Cargo
                </Label>
                <Input
                  id="job_title"
                  value={newContact.job_title}
                  onChange={(e) => setNewContact({ ...newContact, job_title: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateContact}>Crear Contacto</Button>
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.map((contact) => (
              <TableRow
                key={contact.id}
                className="cursor-pointer hover:bg-muted/50"
                onDoubleClick={() => handleRowDoubleClick(contact)}
              >
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>{contact.company}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>{contact.job_title}</TableCell>
                <TableCell>{contact.sales_owner}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(contact.status)}>
                    {contact.status === "lead"
                      ? "Lead"
                      : contact.status === "qualified"
                        ? "Calificado"
                        : contact.status === "client"
                          ? "Cliente"
                          : contact.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleRowDoubleClick(contact)}>
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
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron contactos</p>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Contacto</DialogTitle>
            <DialogDescription>Modifica la información del contacto.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Nombre
              </Label>
              <Input
                id="edit-name"
                value={editContact.name}
                onChange={(e) => setEditContact({ ...editContact, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={editContact.email}
                onChange={(e) => setEditContact({ ...editContact, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-phone" className="text-right">
                Teléfono
              </Label>
              <Input
                id="edit-phone"
                value={editContact.phone}
                onChange={(e) => setEditContact({ ...editContact, phone: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-company" className="text-right">
                Empresa
              </Label>
              <Input
                id="edit-company"
                value={editContact.company}
                onChange={(e) => setEditContact({ ...editContact, company: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-job-title" className="text-right">
                Cargo
              </Label>
              <Input
                id="edit-job-title"
                value={editContact.job_title}
                onChange={(e) => setEditContact({ ...editContact, job_title: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditContact}>Guardar Cambios</Button>
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
