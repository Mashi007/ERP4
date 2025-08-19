"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Settings, Save, X, Eye, EyeOff } from "lucide-react"

interface FormField {
  id: string
  field_name: string
  field_label: string
  field_type: string
  is_required: boolean
  field_group: string
  help_text?: string
  default_value?: string
  field_options?: Array<{ value: string; label: string }>
  is_active: boolean
  field_order: number
}

interface FormConfig {
  id: string
  form_name: string
  form_label: string
  description: string
  is_active: boolean
  fields: FormField[]
}

const FIELD_TYPES = [
  { value: "text", label: "Texto" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Teléfono" },
  { value: "number", label: "Número" },
  { value: "textarea", label: "Área de texto" },
  { value: "select", label: "Lista desplegable" },
  { value: "boolean", label: "Sí/No" },
  { value: "date", label: "Fecha" },
  { value: "url", label: "URL" },
]

const DEFAULT_FORMS: FormConfig[] = [
  {
    id: "contacts",
    form_name: "contacts",
    form_label: "Formulario de Contactos",
    description: "Gestiona los campos del formulario de contactos",
    is_active: true,
    fields: [
      {
        id: "1",
        field_name: "name",
        field_label: "Nombre",
        field_type: "text",
        is_required: true,
        field_group: "general",
        help_text: "Nombre completo del contacto",
        is_active: true,
        field_order: 1,
      },
      {
        id: "2",
        field_name: "email",
        field_label: "Email",
        field_type: "email",
        is_required: false,
        field_group: "contact_info",
        help_text: "correo@empresa.com",
        is_active: true,
        field_order: 2,
      },
      {
        id: "3",
        field_name: "phone",
        field_label: "Teléfono",
        field_type: "phone",
        is_required: false,
        field_group: "contact_info",
        help_text: "+1 234 567 8900",
        is_active: true,
        field_order: 3,
      },
      {
        id: "4",
        field_name: "company",
        field_label: "Empresa",
        field_type: "text",
        is_required: false,
        field_group: "business",
        help_text: "Nombre de la empresa",
        is_active: true,
        field_order: 4,
      },
    ],
  },
  {
    id: "appointments",
    form_name: "appointments",
    form_label: "Formulario de Citas",
    description: "Configura los campos para crear y editar citas",
    is_active: true,
    fields: [
      {
        id: "5",
        field_name: "title",
        field_label: "Título",
        field_type: "text",
        is_required: true,
        field_group: "general",
        help_text: "Título de la cita",
        is_active: true,
        field_order: 1,
      },
      {
        id: "6",
        field_name: "appointment_date",
        field_label: "Fecha",
        field_type: "date",
        is_required: true,
        field_group: "general",
        help_text: "Fecha de la cita",
        is_active: true,
        field_order: 2,
      },
      {
        id: "7",
        field_name: "duration",
        field_label: "Duración (minutos)",
        field_type: "number",
        is_required: false,
        field_group: "general",
        help_text: "Duración en minutos",
        default_value: "60",
        is_active: true,
        field_order: 3,
      },
    ],
  },
  {
    id: "leads",
    form_name: "leads",
    form_label: "Formulario de Leads",
    description: "Administra los campos para captura de leads",
    is_active: true,
    fields: [
      {
        id: "8",
        field_name: "lead_name",
        field_label: "Nombre del Lead",
        field_type: "text",
        is_required: true,
        field_group: "general",
        help_text: "Nombre del prospecto",
        is_active: true,
        field_order: 1,
      },
      {
        id: "9",
        field_name: "lead_source",
        field_label: "Fuente del Lead",
        field_type: "select",
        is_required: false,
        field_group: "general",
        help_text: "¿Cómo nos conoció?",
        field_options: [
          { value: "website", label: "Sitio web" },
          { value: "referral", label: "Referencia" },
          { value: "social_media", label: "Redes sociales" },
          { value: "advertising", label: "Publicidad" },
        ],
        is_active: true,
        field_order: 2,
      },
    ],
  },
  {
    id: "funnel",
    form_name: "funnel",
    form_label: "Formularios de Embudo",
    description: "Configura los campos para formularios de embudo de ventas",
    is_active: true,
    fields: [
      {
        id: "10",
        field_name: "funnel_stage",
        field_label: "Etapa del Embudo",
        field_type: "select",
        is_required: true,
        field_group: "funnel",
        help_text: "Etapa actual en el embudo de ventas",
        field_options: [
          { value: "awareness", label: "Conciencia" },
          { value: "interest", label: "Interés" },
          { value: "consideration", label: "Consideración" },
          { value: "intent", label: "Intención" },
          { value: "evaluation", label: "Evaluación" },
          { value: "purchase", label: "Compra" },
        ],
        is_active: true,
        field_order: 1,
      },
      {
        id: "11",
        field_name: "lead_score",
        field_label: "Puntuación del Lead",
        field_type: "number",
        is_required: false,
        field_group: "scoring",
        help_text: "Puntuación automática del lead (0-100)",
        default_value: "0",
        is_active: true,
        field_order: 2,
      },
      {
        id: "12",
        field_name: "campaign_source",
        field_label: "Fuente de Campaña",
        field_type: "text",
        is_required: false,
        field_group: "tracking",
        help_text: "Campaña de marketing que generó el lead",
        is_active: true,
        field_order: 3,
      },
      {
        id: "13",
        field_name: "conversion_probability",
        field_label: "Probabilidad de Conversión",
        field_type: "select",
        is_required: false,
        field_group: "scoring",
        help_text: "Probabilidad estimada de conversión",
        field_options: [
          { value: "low", label: "Baja (0-25%)" },
          { value: "medium", label: "Media (26-50%)" },
          { value: "high", label: "Alta (51-75%)" },
          { value: "very_high", label: "Muy Alta (76-100%)" },
        ],
        is_active: true,
        field_order: 4,
      },
      {
        id: "14",
        field_name: "next_action",
        field_label: "Próxima Acción",
        field_type: "textarea",
        is_required: false,
        field_group: "follow_up",
        help_text: "Describe la próxima acción a realizar",
        is_active: true,
        field_order: 5,
      },
    ],
  },
  {
    id: "opportunities",
    form_name: "opportunities",
    form_label: "Formulario de Oportunidades",
    description: "Gestiona los campos para crear y seguir oportunidades de venta",
    is_active: true,
    fields: [
      {
        id: "15",
        field_name: "opportunity_name",
        field_label: "Nombre de la Oportunidad",
        field_type: "text",
        is_required: true,
        field_group: "general",
        help_text: "Nombre descriptivo de la oportunidad",
        is_active: true,
        field_order: 1,
      },
      {
        id: "16",
        field_name: "opportunity_value",
        field_label: "Valor de la Oportunidad",
        field_type: "number",
        is_required: true,
        field_group: "financial",
        help_text: "Valor monetario estimado de la oportunidad",
        is_active: true,
        field_order: 2,
      },
      {
        id: "17",
        field_name: "close_date",
        field_label: "Fecha de Cierre Estimada",
        field_type: "date",
        is_required: true,
        field_group: "timeline",
        help_text: "Fecha estimada para cerrar la oportunidad",
        is_active: true,
        field_order: 3,
      },
      {
        id: "18",
        field_name: "sales_stage",
        field_label: "Etapa de Venta",
        field_type: "select",
        is_required: true,
        field_group: "pipeline",
        help_text: "Etapa actual en el pipeline de ventas",
        field_options: [
          { value: "prospecting", label: "Prospección" },
          { value: "qualification", label: "Calificación" },
          { value: "needs_analysis", label: "Análisis de Necesidades" },
          { value: "proposal", label: "Propuesta" },
          { value: "negotiation", label: "Negociación" },
          { value: "closed_won", label: "Cerrada Ganada" },
          { value: "closed_lost", label: "Cerrada Perdida" },
        ],
        is_active: true,
        field_order: 4,
      },
      {
        id: "19",
        field_name: "probability",
        field_label: "Probabilidad de Cierre (%)",
        field_type: "number",
        is_required: false,
        field_group: "forecasting",
        help_text: "Probabilidad de cerrar la oportunidad (0-100%)",
        default_value: "50",
        is_active: true,
        field_order: 5,
      },
      {
        id: "20",
        field_name: "competitor",
        field_label: "Competidor Principal",
        field_type: "text",
        is_required: false,
        field_group: "competitive",
        help_text: "Principal competidor en esta oportunidad",
        is_active: true,
        field_order: 6,
      },
      {
        id: "21",
        field_name: "decision_maker",
        field_label: "Tomador de Decisiones",
        field_type: "text",
        is_required: false,
        field_group: "stakeholders",
        help_text: "Persona que toma la decisión final",
        is_active: true,
        field_order: 7,
      },
      {
        id: "22",
        field_name: "budget_confirmed",
        field_label: "Presupuesto Confirmado",
        field_type: "boolean",
        is_required: false,
        field_group: "qualification",
        help_text: "¿El cliente ha confirmado tener presupuesto?",
        is_active: true,
        field_order: 8,
      },
    ],
  },
]

export default function FormsConfigurationPage() {
  const [forms, setForms] = useState<FormConfig[]>(DEFAULT_FORMS)
  const [selectedForm, setSelectedForm] = useState<FormConfig | null>(null)
  const [editingField, setEditingField] = useState<FormField | null>(null)
  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [fieldForm, setFieldForm] = useState({
    field_name: "",
    field_label: "",
    field_type: "text",
    is_required: false,
    field_group: "general",
    help_text: "",
    default_value: "",
    field_options: [] as Array<{ value: string; label: string }>,
    is_active: true,
  })

  useEffect(() => {
    loadForms()
  }, [])

  const loadForms = async () => {
    try {
      setLoading(true)
      // Simulate API call - in real implementation, fetch from database
      await new Promise((resolve) => setTimeout(resolve, 500))
      setForms(DEFAULT_FORMS)
    } catch (error) {
      console.error("Error loading forms:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los formularios",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFormSelect = (form: FormConfig) => {
    setSelectedForm(form)
  }

  const handleAddField = () => {
    setEditingField(null)
    setFieldForm({
      field_name: "",
      field_label: "",
      field_type: "text",
      is_required: false,
      field_group: "general",
      help_text: "",
      default_value: "",
      field_options: [],
      is_active: true,
    })
    setIsFieldDialogOpen(true)
  }

  const handleEditField = (field: FormField) => {
    setEditingField(field)
    setFieldForm({
      field_name: field.field_name,
      field_label: field.field_label,
      field_type: field.field_type,
      is_required: field.is_required,
      field_group: field.field_group,
      help_text: field.help_text || "",
      default_value: field.default_value || "",
      field_options: field.field_options || [],
      is_active: field.is_active,
    })
    setIsFieldDialogOpen(true)
  }

  const handleSaveField = async () => {
    if (!selectedForm) return

    try {
      const newField: FormField = {
        id: editingField?.id || Date.now().toString(),
        ...fieldForm,
        field_order: editingField?.field_order || selectedForm.fields.length + 1,
      }

      const updatedForm = {
        ...selectedForm,
        fields: editingField
          ? selectedForm.fields.map((f) => (f.id === editingField.id ? newField : f))
          : [...selectedForm.fields, newField],
      }

      setForms(forms.map((f) => (f.id === selectedForm.id ? updatedForm : f)))
      setSelectedForm(updatedForm)
      setIsFieldDialogOpen(false)

      toast({
        title: "Campo guardado",
        description: `El campo "${fieldForm.field_label}" se guardó correctamente`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el campo",
        variant: "destructive",
      })
    }
  }

  const handleDeleteField = (fieldId: string) => {
    if (!selectedForm) return

    const updatedForm = {
      ...selectedForm,
      fields: selectedForm.fields.filter((f) => f.id !== fieldId),
    }

    setForms(forms.map((f) => (f.id === selectedForm.id ? updatedForm : f)))
    setSelectedForm(updatedForm)

    toast({
      title: "Campo eliminado",
      description: "El campo se eliminó correctamente",
    })
  }

  const handleToggleFieldActive = (fieldId: string) => {
    if (!selectedForm) return

    const updatedForm = {
      ...selectedForm,
      fields: selectedForm.fields.map((f) => (f.id === fieldId ? { ...f, is_active: !f.is_active } : f)),
    }

    setForms(forms.map((f) => (f.id === selectedForm.id ? updatedForm : f)))
    setSelectedForm(updatedForm)
  }

  const handleToggleFieldRequired = (fieldId: string) => {
    if (!selectedForm) return

    const updatedForm = {
      ...selectedForm,
      fields: selectedForm.fields.map((f) => (f.id === fieldId ? { ...f, is_required: !f.is_required } : f)),
    }

    setForms(forms.map((f) => (f.id === selectedForm.id ? updatedForm : f)))
    setSelectedForm(updatedForm)
  }

  const addFieldOption = () => {
    setFieldForm({
      ...fieldForm,
      field_options: [...fieldForm.field_options, { value: "", label: "" }],
    })
  }

  const updateFieldOption = (index: number, key: "value" | "label", value: string) => {
    const newOptions = [...fieldForm.field_options]
    newOptions[index][key] = value
    setFieldForm({ ...fieldForm, field_options: newOptions })
  }

  const removeFieldOption = (index: number) => {
    setFieldForm({
      ...fieldForm,
      field_options: fieldForm.field_options.filter((_, i) => i !== index),
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuración de Formularios</h1>
          <p className="text-muted-foreground mt-2">Administra los campos de todos los formularios del sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forms List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Formularios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {forms.map((form) => (
              <div
                key={form.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedForm?.id === form.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                }`}
                onClick={() => handleFormSelect(form)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{form.form_label}</h3>
                    <p className="text-sm text-muted-foreground">{form.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {form.fields.length} campos
                      </Badge>
                      {form.is_active && (
                        <Badge variant="default" className="text-xs">
                          Activo
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Form Fields Configuration */}
        <div className="lg:col-span-2">
          {selectedForm ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedForm.form_label}</CardTitle>
                    <p className="text-muted-foreground">{selectedForm.description}</p>
                  </div>
                  <Button onClick={handleAddField} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Agregar Campo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedForm.fields.map((field) => (
                    <div
                      key={field.id}
                      className={`p-4 rounded-lg border ${
                        field.is_active ? "border-border" : "border-dashed border-muted-foreground/30"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{field.field_label}</h4>
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
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>
                              <strong>Nombre:</strong> {field.field_name}
                            </p>
                            <p>
                              <strong>Tipo:</strong> {FIELD_TYPES.find((t) => t.value === field.field_type)?.label}
                            </p>
                            <p>
                              <strong>Grupo:</strong> {field.field_group}
                            </p>
                            {field.help_text && (
                              <p>
                                <strong>Ayuda:</strong> {field.help_text}
                              </p>
                            )}
                            {field.default_value && (
                              <p>
                                <strong>Valor por defecto:</strong> {field.default_value}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFieldActive(field.id)}
                            title={field.is_active ? "Desactivar campo" : "Activar campo"}
                          >
                            {field.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFieldRequired(field.id)}
                            title={field.is_required ? "Hacer opcional" : "Hacer requerido"}
                          >
                            <Badge variant={field.is_required ? "destructive" : "secondary"} className="text-xs">
                              {field.is_required ? "Req" : "Opt"}
                            </Badge>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditField(field)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteField(field.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {selectedForm.fields.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No hay campos configurados para este formulario</p>
                      <Button onClick={handleAddField} className="mt-4">
                        Agregar primer campo
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Selecciona un formulario para configurar sus campos</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Field Configuration Dialog */}
      <Dialog open={isFieldDialogOpen} onOpenChange={setIsFieldDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingField ? "Editar Campo" : "Agregar Nuevo Campo"}</DialogTitle>
            <DialogDescription>Configura las propiedades del campo del formulario</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="field_name">Nombre del Campo</Label>
                <Input
                  id="field_name"
                  value={fieldForm.field_name}
                  onChange={(e) => setFieldForm({ ...fieldForm, field_name: e.target.value })}
                  placeholder="ej: email, phone, company"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="field_label">Etiqueta</Label>
                <Input
                  id="field_label"
                  value={fieldForm.field_label}
                  onChange={(e) => setFieldForm({ ...fieldForm, field_label: e.target.value })}
                  placeholder="ej: Email, Teléfono, Empresa"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="field_type">Tipo de Campo</Label>
                <Select
                  value={fieldForm.field_type}
                  onValueChange={(value) => setFieldForm({ ...fieldForm, field_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="field_group">Grupo</Label>
                <Input
                  id="field_group"
                  value={fieldForm.field_group}
                  onChange={(e) => setFieldForm({ ...fieldForm, field_group: e.target.value })}
                  placeholder="ej: general, contact_info, business"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="help_text">Texto de Ayuda</Label>
              <Input
                id="help_text"
                value={fieldForm.help_text}
                onChange={(e) => setFieldForm({ ...fieldForm, help_text: e.target.value })}
                placeholder="Texto que aparece como placeholder o ayuda"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default_value">Valor por Defecto</Label>
              <Input
                id="default_value"
                value={fieldForm.default_value}
                onChange={(e) => setFieldForm({ ...fieldForm, default_value: e.target.value })}
                placeholder="Valor inicial del campo"
              />
            </div>

            {fieldForm.field_type === "select" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Opciones</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addFieldOption}>
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar Opción
                  </Button>
                </div>
                <div className="space-y-2">
                  {fieldForm.field_options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Valor"
                        value={option.value}
                        onChange={(e) => updateFieldOption(index, "value", e.target.value)}
                      />
                      <Input
                        placeholder="Etiqueta"
                        value={option.label}
                        onChange={(e) => updateFieldOption(index, "label", e.target.value)}
                      />
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFieldOption(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_required"
                  checked={fieldForm.is_required}
                  onCheckedChange={(checked) => setFieldForm({ ...fieldForm, is_required: checked })}
                />
                <Label htmlFor="is_required">Campo requerido</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={fieldForm.is_active}
                  onCheckedChange={(checked) => setFieldForm({ ...fieldForm, is_active: checked })}
                />
                <Label htmlFor="is_active">Campo activo</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFieldDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveField}>
              <Save className="h-4 w-4 mr-2" />
              {editingField ? "Guardar Cambios" : "Agregar Campo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
