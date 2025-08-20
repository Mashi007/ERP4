"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Calendar,
  Hash,
  Type,
  ToggleLeft,
  FileText,
  Link,
  List,
  Folder,
  Save,
  X,
  ArrowLeft,
  Users,
  Settings,
  CheckCircle,
  Database,
} from "lucide-react"
import NextLink from "next/link"

interface ContactField {
  id: number
  field_name: string
  field_label: string
  field_type: string
  is_required: boolean
  is_active: boolean
  field_order: number
  default_value?: string
  validation_rules: any
  field_options: any[]
  help_text?: string
  field_group: string
  group_label?: string
  group_description?: string
}

interface ContactGroup {
  id: number
  group_name: string
  group_label: string
  group_description?: string
  group_order: number
  is_active: boolean
  is_collapsible: boolean
  field_count?: number
}

const fieldTypeIcons = {
  text: Type,
  email: Mail,
  phone: Phone,
  number: Hash,
  select: List,
  date: Calendar,
  boolean: ToggleLeft,
  textarea: FileText,
  url: Link,
}

const fieldTypes = [
  { value: "text", label: "Texto" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Teléfono" },
  { value: "number", label: "Número" },
  { value: "select", label: "Lista desplegable" },
  { value: "date", label: "Fecha" },
  { value: "boolean", label: "Sí/No" },
  { value: "textarea", label: "Texto largo" },
  { value: "url", label: "URL" },
]

export default function ContactsConfigPage() {
  const [fields, setFields] = useState<ContactField[]>([])
  const [groups, setGroups] = useState<ContactGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [editingField, setEditingField] = useState<ContactField | null>(null)
  const [editingGroup, setEditingGroup] = useState<ContactGroup | null>(null)
  const [showFieldDialog, setShowFieldDialog] = useState(false)
  const [showGroupDialog, setShowGroupDialog] = useState(false)
  const [usingDefaults, setUsingDefaults] = useState(false)
  const [setupRequired, setSetupRequired] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      const [fieldsResponse, groupsResponse] = await Promise.all([
        fetch("/api/settings/contacts/fields"),
        fetch("/api/settings/contacts/groups"),
      ])

      if (fieldsResponse.ok) {
        const fieldsData = await fieldsResponse.json()
        setFields(fieldsData.fields || [])
        setUsingDefaults(fieldsData.usingDefaults || false)
        setSetupRequired(fieldsData.setupRequired || false)
      }

      if (groupsResponse.ok) {
        const groupsData = await groupsResponse.json()
        setGroups(groupsData || [])
      }
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de configuración",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveField = async (fieldData: Partial<ContactField>) => {
    try {
      const url = "/api/settings/contacts/fields"
      const method = editingField ? "PUT" : "POST"
      const body = editingField ? { ...fieldData, id: editingField.id } : fieldData

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: `Campo ${editingField ? "actualizado" : "creado"} correctamente. Los cambios se aplicarán al módulo de contactos.`,
        })
        loadData()
        setShowFieldDialog(false)
        setEditingField(null)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error saving field")
      }
    } catch (error) {
      console.error("Error saving field:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar el campo",
        variant: "destructive",
      })
    }
  }

  const handleSaveGroup = async (groupData: Partial<ContactGroup>) => {
    try {
      const url = "/api/settings/contacts/groups"
      const method = editingGroup ? "PUT" : "POST"
      const body = editingGroup ? { ...groupData, id: editingGroup.id } : groupData

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: `Grupo ${editingGroup ? "actualizado" : "creado"} correctamente. Los cambios se aplicarán al módulo de contactos.`,
        })
        loadData()
        setShowGroupDialog(false)
        setEditingGroup(null)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error saving group")
      }
    } catch (error) {
      console.error("Error saving group:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar el grupo",
        variant: "destructive",
      })
    }
  }

  const handleToggleField = async (field: ContactField) => {
    try {
      const response = await fetch("/api/settings/contacts/fields", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: field.id,
          is_active: !field.is_active,
        }),
      })

      if (response.ok) {
        loadData()
        toast({
          title: "Éxito",
          description: `Campo ${field.is_active ? "desactivado" : "activado"} correctamente en el módulo de contactos`,
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error updating field")
      }
    } catch (error) {
      console.error("Error toggling field:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo actualizar el campo",
        variant: "destructive",
      })
    }
  }

  const handleDeleteField = async (field: ContactField) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este campo? Se eliminará del módulo de contactos.")) return

    try {
      const response = await fetch(`/api/settings/contacts/fields?id=${field.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        loadData()
        toast({
          title: "Éxito",
          description: "Campo eliminado correctamente del módulo de contactos",
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error deleting field")
      }
    } catch (error) {
      console.error("Error deleting field:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar el campo",
        variant: "destructive",
      })
    }
  }

  const handleDeleteGroup = async (group: ContactGroup) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este grupo?")) return

    try {
      const response = await fetch(`/api/settings/contacts/groups?id=${group.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        loadData()
        toast({
          title: "Éxito",
          description: "Grupo eliminado correctamente",
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error deleting group")
      }
    } catch (error) {
      console.error("Error deleting group:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar el grupo",
        variant: "destructive",
      })
    }
  }

  const groupedFields = groups.map((group) => ({
    ...group,
    fields: fields.filter((field) => field.field_group === group.group_name),
  }))

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <NextLink href="/settings">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Configuración
          </Button>
        </NextLink>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contactos y Clientes</h1>
            <p className="text-muted-foreground">
              Configura los campos personalizados que se aplicarán al módulo de contactos
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={showGroupDialog} onOpenChange={setShowGroupDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setEditingGroup(null)}>
                <Folder className="mr-2 h-4 w-4" />
                Nuevo Grupo
              </Button>
            </DialogTrigger>
            <GroupDialog group={editingGroup} onSave={handleSaveGroup} onClose={() => setShowGroupDialog(false)} />
          </Dialog>
          <Dialog open={showFieldDialog} onOpenChange={setShowFieldDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingField(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Campo
              </Button>
            </DialogTrigger>
            <FieldDialog
              field={editingField}
              groups={groups}
              onSave={handleSaveField}
              onClose={() => setShowFieldDialog(false)}
            />
          </Dialog>
        </div>
      </div>

      {usingDefaults && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-orange-800">
              <Database className="h-5 w-5" />
              <div>
                <p className="font-medium">Usando configuración por defecto</p>
                <p className="text-sm text-orange-700 mt-1">
                  {setupRequired
                    ? "Las tablas de configuración no existen en la base de datos."
                    : "La base de datos no está configurada."}
                </p>
                <p className="text-sm text-orange-700 mt-2">
                  Para habilitar la configuración personalizada de campos, ejecuta el script:{" "}
                  <code className="bg-orange-100 px-1 rounded">scripts/15-create-contacts-config.sql</code>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!usingDefaults && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Configuración personalizada activa</p>
                <p className="text-sm text-green-700 mt-1">
                  Los campos que configures aquí se aplicarán automáticamente al formulario de contactos en el módulo de
                  Contactos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-blue-800">
            <Settings className="h-5 w-5" />
            <div>
              <p className="font-medium">Configuración de Campos del Módulo de Contactos</p>
              <p className="text-sm text-blue-700 mt-1">
                Los usuarios verán estos campos al crear o editar contactos. Los campos inactivos no aparecerán en el
                formulario.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="fields" className="space-y-4">
        <TabsList>
          <TabsTrigger value="fields">Campos del Formulario</TabsTrigger>
          <TabsTrigger value="groups">Grupos de Campos</TabsTrigger>
          <TabsTrigger value="preview">Vista Previa</TabsTrigger>
        </TabsList>

        <TabsContent value="fields" className="space-y-4">
          {groupedFields.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay grupos configurados</h3>
                  <p className="text-muted-foreground mb-4">
                    Crea grupos para organizar los campos del formulario de contactos
                  </p>
                  <Button onClick={() => setShowGroupDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear primer grupo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            groupedFields.map((group) => (
              <Card key={group.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Folder className="h-5 w-5" />
                        {group.group_label}
                        <Badge variant="secondary">{group.fields.length} campos</Badge>
                        {usingDefaults && (
                          <Badge variant="outline" className="text-xs">
                            Memoria
                          </Badge>
                        )}
                      </CardTitle>
                      {group.group_description && <CardDescription>{group.group_description}</CardDescription>}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingGroup(group)
                        setShowGroupDialog(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {group.fields.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4">
                        No hay campos en este grupo. Los campos que agregues aparecerán en el formulario de contactos.
                      </p>
                    ) : (
                      group.fields.map((field) => {
                        const IconComponent = fieldTypeIcons[field.field_type as keyof typeof fieldTypeIcons] || Type
                        return (
                          <div
                            key={field.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                              <IconComponent className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{field.field_label}</span>
                                  {field.is_required && (
                                    <Badge variant="destructive" className="text-xs">
                                      Requerido
                                    </Badge>
                                  )}
                                  {!field.is_active && (
                                    <Badge variant="secondary" className="text-xs">
                                      Inactivo
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {field.field_name} • {fieldTypes.find((t) => t.value === field.field_type)?.label}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleField(field)}
                                title={field.is_active ? "Ocultar del formulario" : "Mostrar en el formulario"}
                              >
                                {field.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingField(field)
                                  setShowFieldDialog(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteField(field)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          {groups.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay grupos configurados</h3>
                  <p className="text-muted-foreground mb-4">
                    Los grupos te permiten organizar los campos del formulario de contactos en secciones lógicas
                  </p>
                  <Button onClick={() => setShowGroupDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear primer grupo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {groups.map((group) => (
                <Card key={group.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{group.group_label}</CardTitle>
                      <Badge variant="secondary">{group.field_count || 0} campos</Badge>
                    </div>
                    {group.group_description && <CardDescription>{group.group_description}</CardDescription>}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Orden: {group.group_order}</span>
                        {group.is_collapsible && (
                          <Badge variant="outline" className="text-xs">
                            Plegable
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingGroup(group)
                            setShowGroupDialog(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteGroup(group)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vista Previa del Formulario de Contacto</CardTitle>
              <CardDescription>
                Así se verá el formulario de contacto en el módulo de Contactos con la configuración actual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactFormPreview fields={fields} groups={groups} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function FieldDialog({
  field,
  groups,
  onSave,
  onClose,
}: {
  field: ContactField | null
  groups: ContactGroup[]
  onSave: (data: Partial<ContactField>) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    field_name: field?.field_name || "",
    field_label: field?.field_label || "",
    field_type: field?.field_type || "text",
    is_required: field?.is_required || false,
    field_group: field?.field_group || (groups.length > 0 ? groups[0].group_name : "general"),
    help_text: field?.help_text || "",
    default_value: field?.default_value || "",
    field_options: field?.field_options || [],
  })

  const [options, setOptions] = useState<string[]>(
    field?.field_options?.map((opt: any) => opt.label || opt.value || opt) || [],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const fieldOptions =
      formData.field_type === "select"
        ? options
            .filter((opt) => opt.trim())
            .map((opt) => ({
              value: opt.toLowerCase().replace(/\s+/g, "_"),
              label: opt,
            }))
        : []

    onSave({
      ...formData,
      field_options: fieldOptions,
    })
  }

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{field ? "Editar Campo" : "Nuevo Campo"}</DialogTitle>
        <DialogDescription>
          {field
            ? "Modifica la configuración del campo que aparecerá en el formulario de contactos"
            : "Crea un nuevo campo que aparecerá en el formulario de contactos"}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="field_label">Etiqueta del Campo</Label>
            <Input
              id="field_label"
              value={formData.field_label}
              onChange={(e) => setFormData({ ...formData, field_label: e.target.value })}
              placeholder="Ej: Nombre completo"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="field_name">Nombre Técnico</Label>
            <Input
              id="field_name"
              value={formData.field_name}
              onChange={(e) => setFormData({ ...formData, field_name: e.target.value })}
              placeholder="Ej: full_name"
              required
              disabled={!!field}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="field_type">Tipo de Campo</Label>
            <Select
              value={formData.field_type}
              onValueChange={(value) => setFormData({ ...formData, field_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fieldTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="field_group">Grupo</Label>
            <Select
              value={formData.field_group}
              onValueChange={(value) => setFormData({ ...formData, field_group: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.group_name} value={group.group_name}>
                    {group.group_label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {formData.field_type === "select" && (
          <div className="space-y-2">
            <Label>Opciones</Label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...options]
                      newOptions[index] = e.target.value
                      setOptions(newOptions)
                    }}
                    placeholder="Opción"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setOptions(options.filter((_, i) => i !== index))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => setOptions([...options, ""])}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Opción
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="help_text">Texto de Ayuda</Label>
          <Textarea
            id="help_text"
            value={formData.help_text}
            onChange={(e) => setFormData({ ...formData, help_text: e.target.value })}
            placeholder="Descripción o instrucciones para este campo"
            rows={2}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_required"
            checked={formData.is_required}
            onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked })}
          />
          <Label htmlFor="is_required">Campo requerido</Label>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Guardar
          </Button>
        </div>
      </form>
    </DialogContent>
  )
}

function GroupDialog({
  group,
  onSave,
  onClose,
}: {
  group: ContactGroup | null
  onSave: (data: Partial<ContactGroup>) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    group_name: group?.group_name || "",
    group_label: group?.group_label || "",
    group_description: group?.group_description || "",
    is_collapsible: group?.is_collapsible || false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{group ? "Editar Grupo" : "Nuevo Grupo"}</DialogTitle>
        <DialogDescription>
          {group
            ? "Modifica la configuración del grupo de campos"
            : "Crea un nuevo grupo para organizar los campos del formulario"}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="group_label">Nombre del Grupo</Label>
          <Input
            id="group_label"
            value={formData.group_label}
            onChange={(e) => setFormData({ ...formData, group_label: e.target.value })}
            placeholder="Ej: Información Personal"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="group_name">Identificador Técnico</Label>
          <Input
            id="group_name"
            value={formData.group_name}
            onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
            placeholder="Ej: personal_info"
            required
            disabled={!!group}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="group_description">Descripción</Label>
          <Textarea
            id="group_description"
            value={formData.group_description}
            onChange={(e) => setFormData({ ...formData, group_description: e.target.value })}
            placeholder="Descripción del grupo de campos"
            rows={2}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_collapsible"
            checked={formData.is_collapsible}
            onCheckedChange={(checked) => setFormData({ ...formData, is_collapsible: checked })}
          />
          <Label htmlFor="is_collapsible">Grupo plegable</Label>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Guardar
          </Button>
        </div>
      </form>
    </DialogContent>
  )
}

function ContactFormPreview({ fields, groups }: { fields: ContactField[]; groups: ContactGroup[] }) {
  const activeFields = fields.filter((f) => f.is_active)
  const groupedFields = groups
    .map((group) => ({
      ...group,
      fields: activeFields.filter((field) => field.field_group === group.group_name),
    }))
    .filter((group) => group.fields.length > 0)

  if (groupedFields.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No hay campos configurados para mostrar. Los campos que configures aparecerán en el formulario de contactos.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Vista previa:</strong> Así se verá el formulario en el módulo de Contactos
        </p>
      </div>

      {groupedFields.map((group) => (
        <div key={group.id} className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{group.group_label}</h3>
            {group.group_description && <p className="text-sm text-muted-foreground">{group.group_description}</p>}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {group.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label className="flex items-center gap-1">
                  {field.field_label}
                  {field.is_required && <span className="text-red-500">*</span>}
                </Label>
                {field.field_type === "textarea" ? (
                  <Textarea placeholder={field.help_text} disabled />
                ) : field.field_type === "select" ? (
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                  </Select>
                ) : field.field_type === "boolean" ? (
                  <div className="flex items-center space-x-2">
                    <Switch disabled />
                    <span className="text-sm text-muted-foreground">Sí/No</span>
                  </div>
                ) : (
                  <Input
                    type={field.field_type === "email" ? "email" : field.field_type === "number" ? "number" : "text"}
                    placeholder={field.help_text}
                    disabled
                  />
                )}
                {field.help_text && <p className="text-xs text-muted-foreground">{field.help_text}</p>}
              </div>
            ))}
          </div>
          {group !== groupedFields[groupedFields.length - 1] && <Separator />}
        </div>
      ))}
    </div>
  )
}
