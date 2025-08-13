"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, GripVertical } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type DealField = {
  id: number
  name: string
  label: string
  field_type: "text" | "number" | "select" | "date" | "boolean" | "textarea"
  is_required: boolean
  is_active: boolean
  options?: string[]
  default_value?: string
  position: number
}

const fieldTypes = [
  { value: "text", label: "Texto" },
  { value: "number", label: "Número" },
  { value: "select", label: "Lista desplegable" },
  { value: "date", label: "Fecha" },
  { value: "boolean", label: "Sí/No" },
  { value: "textarea", label: "Texto largo" },
]

export default function DealsSettingsPage() {
  const [fields, setFields] = useState<DealField[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingField, setEditingField] = useState<DealField | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    label: "",
    field_type: "text" as const,
    is_required: false,
    is_active: true,
    options: "",
    default_value: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadFields()
  }, [])

  const loadFields = async () => {
    // Simular carga de campos
    const mockFields: DealField[] = [
      {
        id: 1,
        name: "title",
        label: "Título del negocio",
        field_type: "text",
        is_required: true,
        is_active: true,
        position: 1,
      },
      { id: 2, name: "value", label: "Valor", field_type: "number", is_required: true, is_active: true, position: 2 },
      {
        id: 3,
        name: "stage",
        label: "Etapa",
        field_type: "select",
        is_required: true,
        is_active: true,
        position: 3,
        options: ["Prospecto", "Calificado", "Propuesta"],
      },
      {
        id: 4,
        name: "close_date",
        label: "Fecha de cierre",
        field_type: "date",
        is_required: false,
        is_active: true,
        position: 4,
      },
      {
        id: 5,
        name: "priority",
        label: "Prioridad",
        field_type: "select",
        is_required: false,
        is_active: true,
        position: 5,
        options: ["Alta", "Media", "Baja"],
      },
    ]
    setFields(mockFields)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const fieldData = {
        ...formData,
        options: formData.field_type === "select" ? formData.options.split(",").map((o) => o.trim()) : undefined,
        position: fields.length + 1,
      }

      if (editingField) {
        // Actualizar campo existente
        setFields(
          fields.map((f) => (f.id === editingField.id ? ({ ...fieldData, id: editingField.id } as DealField) : f)),
        )
        toast({ title: "Campo actualizado correctamente" })
      } else {
        // Crear nuevo campo
        const newField: DealField = { ...fieldData, id: Date.now() } as DealField
        setFields([...fields, newField])
        toast({ title: "Campo creado correctamente" })
      }

      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      toast({ title: "Error al guardar el campo", variant: "destructive" })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      label: "",
      field_type: "text",
      is_required: false,
      is_active: true,
      options: "",
      default_value: "",
    })
    setEditingField(null)
  }

  const handleEdit = (field: DealField) => {
    setEditingField(field)
    setFormData({
      name: field.name,
      label: field.label,
      field_type: field.field_type,
      is_required: field.is_required,
      is_active: field.is_active,
      options: field.options?.join(", ") || "",
      default_value: field.default_value || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setFields(fields.filter((f) => f.id !== id))
    toast({ title: "Campo eliminado correctamente" })
  }

  const toggleFieldStatus = (id: number) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, is_active: !f.is_active } : f)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Configuración de Negocios</h1>
          <p className="text-muted-foreground">
            Administra todos los campos necesarios para crear y actualizar negocios
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Campo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingField ? "Editar Campo" : "Nuevo Campo"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre del campo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ej: budget"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="label">Etiqueta</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="ej: Presupuesto"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="field_type">Tipo de campo</Label>
                <Select
                  value={formData.field_type}
                  onValueChange={(value: any) => setFormData({ ...formData, field_type: value })}
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

              {formData.field_type === "select" && (
                <div>
                  <Label htmlFor="options">Opciones (separadas por comas)</Label>
                  <Input
                    id="options"
                    value={formData.options}
                    onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                    placeholder="Opción 1, Opción 2, Opción 3"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="default_value">Valor por defecto</Label>
                <Input
                  id="default_value"
                  value={formData.default_value}
                  onChange={(e) => setFormData({ ...formData, default_value: e.target.value })}
                  placeholder="Valor opcional por defecto"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_required"
                    checked={formData.is_required}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked })}
                  />
                  <Label htmlFor="is_required">Campo requerido</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Campo activo</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">{editingField ? "Actualizar" : "Crear"} Campo</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campos de Negocios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Campo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Requerido</TableHead>
                <TableHead className="w-32">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell>
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{field.label}</div>
                      <div className="text-sm text-muted-foreground">{field.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{fieldTypes.find((t) => t.value === field.field_type)?.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <Switch checked={field.is_active} onCheckedChange={() => toggleFieldStatus(field.id)} />
                  </TableCell>
                  <TableCell>
                    {field.is_required ? (
                      <Badge variant="destructive">Requerido</Badge>
                    ) : (
                      <Badge variant="secondary">Opcional</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(field)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(field.id)}
                        disabled={field.is_required}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
