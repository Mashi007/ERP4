"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ChevronDown, ChevronRight, Search, User } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ContactField {
  field_name: string
  field_label: string
  field_type: string
  is_required: boolean
  field_group: string
  help_text?: string
  default_value?: string
  field_options?: Array<{ value: string; label: string }>
}

interface ContactGroup {
  group_name: string
  group_label: string
  group_order: number
  is_collapsible?: boolean
}

interface DynamicContactFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (contactData: any) => Promise<void>
  editingContact?: any
}

const STAGE_OPTIONS = [
  { value: "Nuevo", label: "Nuevo" },
  { value: "Calificación", label: "Calificación" },
  { value: "Propuesta", label: "Propuesta" },
  { value: "Negociación", label: "Negociación" },
  { value: "Cierre", label: "Cierre" },
  { value: "Ganado", label: "Ganado" },
  { value: "Perdido", label: "Perdido" },
]

const DEFAULT_FIELDS: ContactField[] = [
  {
    field_name: "name",
    field_label: "Nombre",
    field_type: "text",
    is_required: true,
    field_group: "general",
    help_text: "Nombre completo",
  },
  {
    field_name: "email",
    field_label: "Email",
    field_type: "email",
    is_required: true,
    field_group: "general",
    help_text: "Correo electrónico",
  },
  {
    field_name: "phone",
    field_label: "Teléfono",
    field_type: "phone",
    is_required: false,
    field_group: "general",
    help_text: "Número de teléfono",
  },
  {
    field_name: "company",
    field_label: "Empresa",
    field_type: "text",
    is_required: false,
    field_group: "general",
    help_text: "Nombre de la empresa",
  },
  {
    field_name: "job_title",
    field_label: "Cargo",
    field_type: "text",
    is_required: false,
    field_group: "general",
    help_text: "Cargo o posición",
  },
  {
    field_name: "address",
    field_label: "Dirección",
    field_type: "text",
    is_required: false,
    field_group: "general",
    help_text: "Dirección física",
  },
  {
    field_name: "city",
    field_label: "Ciudad",
    field_type: "text",
    is_required: false,
    field_group: "general",
    help_text: "Ciudad",
  },
  {
    field_name: "country",
    field_label: "País",
    field_type: "text",
    is_required: false,
    field_group: "general",
    help_text: "País",
  },
  {
    field_name: "notes",
    field_label: "Notas",
    field_type: "textarea",
    is_required: false,
    field_group: "general",
    help_text: "Notas adicionales",
  },
  {
    field_name: "stage",
    field_label: "Etapa",
    field_type: "select",
    is_required: true,
    field_group: "general",
    help_text: "Etapa del cliente",
    field_options: STAGE_OPTIONS,
  },
]

const DEFAULT_GROUPS: ContactGroup[] = [
  {
    group_name: "general",
    group_label: "Información General",
    group_order: 1,
    is_collapsible: false,
  },
]

export default function DynamicContactForm({ isOpen, onClose, onSave, editingContact }: DynamicContactFormProps) {
  const [fields, setFields] = useState<ContactField[]>(DEFAULT_FIELDS)
  const [groups, setGroups] = useState<ContactGroup[]>(DEFAULT_GROUPS)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())
  const [contactSearchOpen, setContactSearchOpen] = useState(false)
  const [contactSearchQuery, setContactSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      loadFields()
    }
  }, [isOpen])

  useEffect(() => {
    if (editingContact && fields.length > 0) {
      const initialData: Record<string, any> = {}
      fields.forEach((field) => {
        if (editingContact[field.field_name] !== undefined) {
          initialData[field.field_name] = editingContact[field.field_name]
        } else if (field.default_value) {
          initialData[field.field_name] = field.default_value
        }
      })
      setFormData(initialData)
    } else if (fields.length > 0) {
      const initialData: Record<string, any> = {}
      fields.forEach((field) => {
        if (field.default_value) {
          initialData[field.field_name] = field.default_value
        }
      })
      setFormData(initialData)
    }
  }, [editingContact, fields])

  const loadFields = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/settings/contacts/active-fields")

      if (response.ok) {
        const data = await response.json()
        if (data.fields && data.fields.length > 0) {
          setFields(data.fields)
          setGroups(data.groups || DEFAULT_GROUPS)

          if (data.source === "default_fallback") {
            console.log("Using default contact fields:", data.message || data.error)
          }
        } else {
          console.log("No fields returned from API, using defaults")
          setFields(DEFAULT_FIELDS)
          setGroups(DEFAULT_GROUPS)
        }
      } else {
        console.log("API error, using default fields. Status:", response.status)
        setFields(DEFAULT_FIELDS)
        setGroups(DEFAULT_GROUPS)
      }
    } catch (error) {
      console.error("Error loading contact fields:", error)
      console.log("Network error, using default fields")
      setFields(DEFAULT_FIELDS)
      setGroups(DEFAULT_GROUPS)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))

    if (fieldName === "name" && !editingContact) {
      setContactSearchQuery(value)
      if (value.length >= 2) {
        searchContacts(value)
      } else {
        setSearchResults([])
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const requiredFields = fields.filter((field) => field.is_required)
    const missingFields = requiredFields.filter((field) => !formData[field.field_name]?.toString().trim())

    if (missingFields.length > 0) {
      toast({
        title: "Campos requeridos",
        description: `Por favor completa: ${missingFields.map((f) => f.field_label).join(", ")}`,
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      await onSave(formData)
      onClose()
      setFormData({})
      setContactSearchQuery("")
      setSearchResults([])
    } catch (error) {
      console.error("Error saving contact:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el contacto",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const toggleGroupCollapse = (groupName: string) => {
    setCollapsedGroups((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(groupName)) {
        newSet.delete(groupName)
      } else {
        newSet.add(groupName)
      }
      return newSet
    })
  }

  const searchContacts = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    try {
      const response = await fetch(`/api/contacts/search?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.contacts || [])
      }
    } catch (error) {
      console.error("Error searching contacts:", error)
    } finally {
      setSearchLoading(false)
    }
  }

  const selectContact = (contact: any) => {
    const updatedFormData = { ...formData }

    if (contact.name) updatedFormData.name = contact.name
    if (contact.email) updatedFormData.email = contact.email
    if (contact.phone) updatedFormData.phone = contact.phone
    if (contact.company) updatedFormData.company = contact.company
    if (contact.job_title) updatedFormData.job_title = contact.job_title
    if (contact.address) updatedFormData.address = contact.address
    if (contact.city) updatedFormData.city = contact.city
    if (contact.country) updatedFormData.country = contact.country
    if (contact.notes) updatedFormData.notes = contact.notes

    if (!updatedFormData.stage) {
      updatedFormData.stage = "Nuevo"
    }

    setFormData(updatedFormData)
    setContactSearchOpen(false)
    setContactSearchQuery(contact.name || "")
  }

  const renderField = (field: ContactField) => {
    const value = formData[field.field_name] || ""

    if (field.field_name === "name" && !editingContact) {
      return (
        <Popover open={contactSearchOpen} onOpenChange={setContactSearchOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                value={contactSearchQuery}
                onChange={(e) => {
                  setContactSearchQuery(e.target.value)
                  handleInputChange(field.field_name, e.target.value)
                }}
                placeholder={field.help_text}
                className="pr-8"
              />
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Buscar contactos existentes..."
                value={contactSearchQuery}
                onValueChange={(value) => {
                  setContactSearchQuery(value)
                  searchContacts(value)
                }}
              />
              <CommandList>
                {searchLoading ? (
                  <div className="p-4 text-center text-sm text-gray-500">Buscando...</div>
                ) : searchResults.length > 0 ? (
                  <CommandGroup>
                    {searchResults.map((contact) => (
                      <CommandItem
                        key={contact.id}
                        onSelect={() => selectContact(contact)}
                        className="flex items-center gap-2 p-3"
                      >
                        <User className="h-4 w-4" />
                        <div className="flex flex-col">
                          <span className="font-medium">{contact.name}</span>
                          <span className="text-xs text-gray-500">
                            {contact.company && `${contact.company} • `}
                            {contact.email}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : contactSearchQuery.length >= 2 ? (
                  <CommandEmpty>No se encontraron contactos</CommandEmpty>
                ) : null}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )
    }

    switch (field.field_type) {
      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={(e) => handleInputChange(field.field_name, e.target.value)}
            placeholder={field.help_text}
            rows={3}
          />
        )

      case "select":
        return (
          <Select value={value} onValueChange={(newValue) => handleInputChange(field.field_name, newValue)}>
            <SelectTrigger>
              <SelectValue placeholder={field.help_text || "Seleccionar..."} />
            </SelectTrigger>
            <SelectContent>
              {field.field_options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value === true || value === "true"}
              onCheckedChange={(checked) => handleInputChange(field.field_name, checked)}
            />
            <span className="text-sm text-muted-foreground">{value === true || value === "true" ? "Sí" : "No"}</span>
          </div>
        )

      case "date":
        return <Input type="date" value={value} onChange={(e) => handleInputChange(field.field_name, e.target.value)} />

      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.field_name, e.target.value)}
            placeholder={field.help_text}
          />
        )

      case "email":
        return (
          <Input
            type="email"
            value={value}
            onChange={(e) => handleInputChange(field.field_name, e.target.value)}
            placeholder={field.help_text || "correo@empresa.com"}
          />
        )

      case "phone":
        return (
          <Input
            type="tel"
            value={value}
            onChange={(e) => handleInputChange(field.field_name, e.target.value)}
            placeholder={field.help_text || "+1 234 567 8900"}
          />
        )

      case "url":
        return (
          <Input
            type="url"
            value={value}
            onChange={(e) => handleInputChange(field.field_name, e.target.value)}
            placeholder={field.help_text || "https://ejemplo.com"}
          />
        )

      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.field_name, e.target.value)}
            placeholder={field.help_text}
          />
        )
    }
  }

  const groupedFields = groups
    .map((group) => ({
      ...group,
      fields: fields.filter((field) => field.field_group === group.group_name),
    }))
    .filter((group) => group.fields.length > 0)

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingContact ? "Editar Contacto" : "Agregar Nuevo Contacto"}</DialogTitle>
          <DialogDescription>
            {editingContact
              ? "Modifica la información del contacto"
              : "Agrega un nuevo contacto a tu CRM. Los campos marcados con * son obligatorios."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {groupedFields.map((group, groupIndex) => (
            <div key={group.group_name} className="space-y-4">
              {group.is_collapsible ? (
                <button
                  type="button"
                  onClick={() => toggleGroupCollapse(group.group_name)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="text-lg font-semibold">{group.group_label}</h3>
                  {collapsedGroups.has(group.group_name) ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              ) : (
                <h3 className="text-lg font-semibold">{group.group_label}</h3>
              )}

              {(!group.is_collapsible || !collapsedGroups.has(group.group_name)) && (
                <div className="grid gap-4 md:grid-cols-2">
                  {group.fields.map((field) => (
                    <div key={field.field_name} className="space-y-2">
                      <Label className="flex items-center gap-1">
                        {field.field_label}
                        {field.is_required && <span className="text-red-500">*</span>}
                      </Label>
                      {renderField(field)}
                      {field.help_text && <p className="text-xs text-muted-foreground">{field.help_text}</p>}
                    </div>
                  ))}
                </div>
              )}

              {groupIndex < groupedFields.length - 1 && <Separator />}
            </div>
          ))}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {editingContact ? "Guardando..." : "Creando..."}
                </>
              ) : editingContact ? (
                "Guardar Cambios"
              ) : (
                "Agregar Contacto"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
