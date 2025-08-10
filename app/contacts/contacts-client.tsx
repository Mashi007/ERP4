"use client"

import type React from "react"

import { useMemo, useState } from "react"
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Search,
  Plus,
  MoreHorizontal,
  TableIcon,
  Filter,
  Star,
  Download,
  Mail,
  ChevronDown,
  Settings,
  Pencil,
  Trash2,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Contact } from "@/lib/database"
import { createContact, updateContact, deleteContact } from "./actions"
import { useToast } from "@/hooks/use-toast"

interface ContactsClientProps {
  initialContacts: Contact[]
}

export default function ContactsClient({ initialContacts }: ContactsClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [isCreating, setIsCreating] = useState(false)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { toast } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "Qualified":
        return "bg-green-100 text-green-800 border-green-200"
      case "Won":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTagColor = (tag: string) => {
    const colors = {
      "Industry Expert": "bg-blue-100 text-blue-800",
      "Decision maker": "bg-purple-100 text-purple-800",
      "High-Value Customer": "bg-purple-100 text-purple-800",
      "Customer Advocate": "bg-gray-100 text-gray-800",
      Influencer: "bg-orange-100 text-orange-800",
      Champion: "bg-red-100 text-red-800",
    }
    return colors[tag as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getInitialColor = (name: string) => {
    const colors = [
      "bg-pink-200 text-pink-800",
      "bg-orange-200 text-orange-800",
      "bg-blue-200 text-blue-800",
      "bg-purple-200 text-purple-800",
      "bg-green-200 text-green-800",
      "bg-gray-200 text-gray-800",
      "bg-yellow-200 text-yellow-800",
      "bg-indigo-200 text-indigo-800",
    ]
    const index = name.length % colors.length
    return colors[index]
  }

  const filteredContacts = useMemo(() => {
    const q = searchTerm.toLowerCase()
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(q) ||
        (contact.company && contact.company.toLowerCase().includes(q)) ||
        (contact.email && contact.email.toLowerCase().includes(q)),
    )
  }, [contacts, searchTerm])

  async function handleAddContact(formData: FormData) {
    setIsCreating(true)
    try {
      const newContact = await createContact(formData)
      setContacts((prev) => [newContact, ...prev])
      setIsCreateOpen(false)
      toast({
        title: "Contacto creado",
        description: `${newContact.name} ha sido agregado exitosamente.`,
      })
      const form = document.getElementById("contact-form") as HTMLFormElement | null
      form?.reset()
    } catch (error) {
      console.error("❌ [Client] Error creando contacto:", error)
      toast({
        title: "Error",
        description: "No se pudo crear el contacto. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  function openEdit(contact: Contact) {
    setEditingContact(contact)
    setIsEditOpen(true)
  }

  async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!editingContact) return
    const formData = new FormData(e.currentTarget)
    const payload = {
      name: (formData.get("name") as string) || undefined,
      company: (formData.get("company") as string) || undefined,
      job_title: (formData.get("job_title") as string) || undefined,
      email: (formData.get("email") as string) || undefined,
      phone: (formData.get("phone") as string) || undefined,
      status: (formData.get("status") as string) || undefined,
    } as Partial<Contact>

    setIsUpdating(true)
    try {
      const updated = await updateContact(editingContact.id, payload)
      setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
      toast({ title: "Contacto actualizado", description: `${updated.name} se actualizó correctamente.` })
      setIsEditOpen(false)
      setEditingContact(null)
    } catch (err) {
      console.error("❌ [Client] Error actualizando contacto:", err)
      toast({
        title: "Error",
        description: "No se pudo actualizar el contacto.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  function openDelete(contact: Contact) {
    setDeletingContact(contact)
    setIsDeleteOpen(true)
  }

  async function handleDeleteConfirmed() {
    if (!deletingContact) return
    setIsDeleting(true)
    try {
      await deleteContact(deletingContact.id)
      setContacts((prev) => prev.filter((c) => c.id !== deletingContact.id))
      toast({
        title: "Contacto eliminado",
        description: `${deletingContact.name} fue eliminado.`,
      })
      setIsDeleteOpen(false)
      setDeletingContact(null)
    } catch (err) {
      console.error("❌ [Client] Error eliminando contacto:", err)
      toast({
        title: "Error",
        description: "No se pudo eliminar el contacto.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">Contactos</h1>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                {contacts.length} en total
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" aria-hidden="true" />
              <Input
                placeholder="Buscar en tu CRM"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
                aria-label="Buscar"
              />
            </div>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" aria-label="Nuevo (rápido)">
              <Plus className="h-4 w-4 mr-1" />
            </Button>
            <Button variant="outline" size="sm" aria-label="Enviar correo">
              <Mail className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" aria-label="Ajustes">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Todos los contactos</span>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                {contacts.length}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Personalizar tabla
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Importar contactos
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar contacto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Contacto</DialogTitle>
                  <DialogDescription>
                    Agrega un nuevo contacto a tu CRM. Los campos marcados con * son obligatorios.
                  </DialogDescription>
                </DialogHeader>
                <form id="contact-form" action={handleAddContact}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Nombre *
                      </Label>
                      <Input id="name" name="name" required className="col-span-3" placeholder="Nombre completo" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="company" className="text-right">
                        Empresa
                      </Label>
                      <Input id="company" name="company" className="col-span-3" placeholder="Nombre de la empresa" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="job_title" className="text-right">
                        Cargo
                      </Label>
                      <Input id="job_title" name="job_title" className="col-span-3" placeholder="Título del puesto" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        className="col-span-3"
                        placeholder="correo@empresa.com"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">
                        Teléfono
                      </Label>
                      <Input id="phone" name="phone" className="col-span-3" placeholder="+1 234 567 8900" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        Estado
                      </Label>
                      <Select name="status" defaultValue="New">
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">Nuevo</SelectItem>
                          <SelectItem value="Qualified">Calificado</SelectItem>
                          <SelectItem value="Won">Ganado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateOpen(false)}
                      disabled={isCreating}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creando...
                        </>
                      ) : (
                        "Agregar Contacto"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Table Controls */}
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <TableIcon className="h-4 w-4 mr-2" />
            Tabla
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Acciones masivas
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar por
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="px-6">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="text-left font-medium text-gray-600 py-3">
                Nombre
                <ChevronDown className="h-4 w-4 inline ml-1" />
              </TableHead>
              <TableHead className="text-left font-medium text-gray-600 py-3">
                Cuenta
                <ChevronDown className="h-4 w-4 inline ml-1" />
              </TableHead>
              <TableHead className="text-left font-medium text-gray-600 py-3">
                Cargo
                <ChevronDown className="h-4 w-4 inline ml-1" />
              </TableHead>
              <TableHead className="text-left font-medium text-gray-600 py-3">
                Correo
                <ChevronDown className="h-4 w-4 inline ml-1" />
              </TableHead>
              <TableHead className="text-left font-medium text-gray-600 py-3">
                Móvil
                <ChevronDown className="h-4 w-4 inline ml-1" />
              </TableHead>
              <TableHead className="text-left font-medium text-gray-600 py-3">
                Estado
                <ChevronDown className="h-4 w-4 inline ml-1" />
              </TableHead>
              <TableHead className="text-left font-medium text-gray-600 py-3">
                Etiquetas
                <ChevronDown className="h-4 w-4 inline ml-1" />
              </TableHead>
              <TableHead className="text-left font-medium text-gray-600 py-3">
                Propietario de ventas
                <ChevronDown className="h-4 w-4 inline ml-1" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.map((contact) => (
              <TableRow key={contact.id} className="border-b border-gray-100 hover:bg-gray-50">
                <TableCell className="py-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      {contact.avatar_url ? (
                        <AvatarImage
                          src={contact.avatar_url || "/placeholder.svg?height=32&width=32&query=avatar"}
                          alt={`Avatar de ${contact.name}`}
                        />
                      ) : (
                        <AvatarFallback className={`text-sm font-medium ${getInitialColor(contact.name)}`}>
                          {getInitials(contact.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="font-medium text-emerald-700 hover:underline cursor-pointer">{contact.name}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0"
                          aria-label={`Opciones para ${contact.name}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => openEdit(contact)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => openDelete(contact)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <span className="text-emerald-700 hover:underline cursor-pointer">{contact.company || "-"}</span>
                </TableCell>
                <TableCell className="py-4 text-gray-900">{contact.job_title || "-"}</TableCell>
                <TableCell className="py-4">
                  {contact.email ? (
                    <span className="text-emerald-700 hover:underline cursor-pointer">{contact.email}</span>
                  ) : (
                    <span className="text-gray-400 cursor-pointer hover:text-emerald-700">
                      + Hacer clic para agregar
                    </span>
                  )}
                </TableCell>
                <TableCell className="py-4">
                  {contact.phone && contact.phone !== "+ Click to add" ? (
                    <span className="text-gray-900">{contact.phone}</span>
                  ) : (
                    <span className="text-gray-400 cursor-pointer hover:text-emerald-700">
                      + Hacer clic para agregar
                    </span>
                  )}
                </TableCell>
                <TableCell className="py-4">
                  <Badge className={`${getStatusColor(contact.status)} border`}>{contact.status}</Badge>
                </TableCell>
                <TableCell className="py-4">
                  {contact.tags && contact.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag, index) => (
                        <Badge key={index} className={`text-xs ${getTagColor(tag)}`}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 cursor-pointer hover:text-emerald-700">+ Click to add</span>
                  )}
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-gray-400" aria-hidden="true" />
                    <span className="text-gray-900">{contact.sales_owner}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Empty state */}
      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No se encontraron contactos</div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar primer contacto
          </Button>
        </div>
      )}

      {/* Edit dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Editar contacto</DialogTitle>
            <DialogDescription>Actualiza la información y guarda los cambios.</DialogDescription>
          </DialogHeader>
          {editingContact && (
            <form onSubmit={handleEditSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Nombre *
                  </Label>
                  <Input
                    id="edit-name"
                    name="name"
                    required
                    className="col-span-3"
                    defaultValue={editingContact.name ?? ""}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-company" className="text-right">
                    Empresa
                  </Label>
                  <Input
                    id="edit-company"
                    name="company"
                    className="col-span-3"
                    defaultValue={editingContact.company ?? ""}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-job_title" className="text-right">
                    Cargo
                  </Label>
                  <Input
                    id="edit-job_title"
                    name="job_title"
                    className="col-span-3"
                    defaultValue={editingContact.job_title ?? ""}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    className="col-span-3"
                    defaultValue={editingContact.email ?? ""}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-phone" className="text-right">
                    Teléfono
                  </Label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    className="col-span-3"
                    defaultValue={editingContact.phone ?? ""}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Estado</Label>
                  <Select name="status" defaultValue={editingContact.status ?? "New"}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">Nuevo</SelectItem>
                      <SelectItem value="Qualified">Calificado</SelectItem>
                      <SelectItem value="Won">Ganado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={isUpdating}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    "Guardar cambios"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar contacto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará el contacto{" "}
              <span className="font-medium">{deletingContact?.name ?? ""}</span> y sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteConfirmed}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
