"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileText, Plus, Edit, Trash2, Eye, Copy, Save, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Template {
  id: number
  name: string
  description: string
  content: string
  category: string
  type: "proposal" | "campaign" | "email"
  variables?: any
  is_active: boolean
  created_at: string
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [editDialog, setEditDialog] = useState(false)
  const [previewDialog, setPreviewDialog] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [previewData, setPreviewData] = useState("")
  const [activeTab, setActiveTab] = useState("proposal")

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    content: "",
    category: "",
    type: "proposal" as const,
    variables: {},
  })

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const [proposalRes, campaignRes, emailRes] = await Promise.all([
        fetch("/api/templates/proposals"),
        fetch("/api/templates/campaigns"),
        fetch("/api/templates/emails"),
      ])

      const [proposals, campaigns, emails] = await Promise.all([
        proposalRes.ok ? proposalRes.json() : [],
        campaignRes.ok ? campaignRes.json() : [],
        emailRes.ok ? emailRes.json() : [],
      ])

      const allTemplates = [
        ...proposals.map((t: any) => ({ ...t, type: "proposal" })),
        ...campaigns.map((t: any) => ({ ...t, type: "campaign" })),
        ...emails.map((t: any) => ({ ...t, type: "email" })),
      ]

      setTemplates(allTemplates)
    } catch (error) {
      console.error("Error loading templates:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las plantillas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveTemplate = async () => {
    try {
      const templateData = editingTemplate || newTemplate
      const endpoint = editingTemplate
        ? `/api/templates/${templateData.type}s/${editingTemplate.id}`
        : `/api/templates/${templateData.type}s`

      const method = editingTemplate ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(templateData),
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: `Plantilla ${editingTemplate ? "actualizada" : "creada"} correctamente`,
        })
        setEditDialog(false)
        setEditingTemplate(null)
        setNewTemplate({
          name: "",
          description: "",
          content: "",
          category: "",
          type: "proposal",
          variables: {},
        })
        loadTemplates()
      } else {
        throw new Error("Error saving template")
      }
    } catch (error) {
      console.error("Error saving template:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la plantilla",
        variant: "destructive",
      })
    }
  }

  const deleteTemplate = async (template: Template) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta plantilla?")) return

    try {
      const response = await fetch(`/api/templates/${template.type}s/${template.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Plantilla eliminada correctamente",
        })
        loadTemplates()
      } else {
        throw new Error("Error deleting template")
      }
    } catch (error) {
      console.error("Error deleting template:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la plantilla",
        variant: "destructive",
      })
    }
  }

  const previewTemplateWithData = async (template: Template) => {
    try {
      const response = await fetch("/api/templates/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: template.content,
          variables: template.variables || {},
          sampleData: {
            contact: {
              name: "Juan Pérez",
              email: "juan.perez@empresa.com",
              company: "Empresa Demo",
              phone: "+34 600 123 456",
            },
            service: {
              name: "Consultoría Digital",
              description: "Análisis y estrategia de transformación digital",
              base_price: 2500,
              currency: "EUR",
            },
            current_date: new Date().toLocaleDateString(),
          },
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPreviewData(data.preview)
        setPreviewTemplate(template)
        setPreviewDialog(true)
      }
    } catch (error) {
      console.error("Error previewing template:", error)
      toast({
        title: "Error",
        description: "No se pudo generar la vista previa",
        variant: "destructive",
      })
    }
  }

  const duplicateTemplate = (template: Template) => {
    setNewTemplate({
      name: `${template.name} (Copia)`,
      description: template.description,
      content: template.content,
      category: template.category,
      type: template.type,
      variables: template.variables || {},
    })
    setEditDialog(true)
  }

  const filteredTemplates = templates.filter((t) => t.type === activeTab)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Plantillas</h1>
          <p className="text-muted-foreground">
            Administra plantillas para propuestas, campañas y emails con variables dinámicas
          </p>
        </div>
        <Button onClick={() => setEditDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Plantilla
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="proposal">Propuestas</TabsTrigger>
          <TabsTrigger value="campaign">Campañas</TabsTrigger>
          <TabsTrigger value="email">Emails</TabsTrigger>
        </TabsList>

        <TabsContent value="proposal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Plantillas de Propuestas
              </CardTitle>
              <CardDescription>
                Plantillas con variables dinámicas para generar propuestas personalizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {filteredTemplates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{template.name}</h3>
                        <Badge variant={template.is_active ? "default" : "secondary"}>
                          {template.is_active ? "Activa" : "Inactiva"}
                        </Badge>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => previewTemplateWithData(template)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => duplicateTemplate(template)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingTemplate(template)
                          setEditDialog(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteTemplate(template)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaign" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Plantillas de Campañas
              </CardTitle>
              <CardDescription>Plantillas para campañas de marketing por email y SMS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {filteredTemplates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{template.name}</h3>
                        <Badge variant={template.is_active ? "default" : "secondary"}>
                          {template.is_active ? "Activa" : "Inactiva"}
                        </Badge>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => previewTemplateWithData(template)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => duplicateTemplate(template)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingTemplate(template)
                          setEditDialog(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteTemplate(template)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Plantillas de Email
              </CardTitle>
              <CardDescription>Plantillas para comunicaciones por email</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {filteredTemplates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{template.name}</h3>
                        <Badge variant={template.is_active ? "default" : "secondary"}>
                          {template.is_active ? "Activa" : "Inactiva"}
                        </Badge>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => previewTemplateWithData(template)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => duplicateTemplate(template)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingTemplate(template)
                          setEditDialog(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteTemplate(template)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit/Create Template Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? "Editar Plantilla" : "Nueva Plantilla"}</DialogTitle>
            <DialogDescription>
              {editingTemplate
                ? "Modifica los datos de la plantilla"
                : "Crea una nueva plantilla con variables dinámicas"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={editingTemplate?.name || newTemplate.name}
                  onChange={(e) => {
                    if (editingTemplate) {
                      setEditingTemplate({ ...editingTemplate, name: e.target.value })
                    } else {
                      setNewTemplate({ ...newTemplate, name: e.target.value })
                    }
                  }}
                  placeholder="Nombre de la plantilla"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={editingTemplate?.type || newTemplate.type}
                  onValueChange={(value: any) => {
                    if (editingTemplate) {
                      setEditingTemplate({ ...editingTemplate, type: value })
                    } else {
                      setNewTemplate({ ...newTemplate, type: value })
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proposal">Propuesta</SelectItem>
                    <SelectItem value="campaign">Campaña</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Input
                  id="category"
                  value={editingTemplate?.category || newTemplate.category}
                  onChange={(e) => {
                    if (editingTemplate) {
                      setEditingTemplate({ ...editingTemplate, category: e.target.value })
                    } else {
                      setNewTemplate({ ...newTemplate, category: e.target.value })
                    }
                  }}
                  placeholder="Ej: Comercial, Técnica, Marketing"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={editingTemplate?.description || newTemplate.description}
                onChange={(e) => {
                  if (editingTemplate) {
                    setEditingTemplate({ ...editingTemplate, description: e.target.value })
                  } else {
                    setNewTemplate({ ...newTemplate, description: e.target.value })
                  }
                }}
                placeholder="Descripción de la plantilla"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenido de la Plantilla</Label>
              <div className="text-sm text-muted-foreground mb-2">
                Usa variables como: <code>{"{{contact.name}}"}</code>, <code>{"{{service.name}}"}</code>,{" "}
                <code>{"{{service.base_price}}"}</code>
              </div>
              <Textarea
                id="content"
                value={editingTemplate?.content || newTemplate.content}
                onChange={(e) => {
                  if (editingTemplate) {
                    setEditingTemplate({ ...editingTemplate, content: e.target.value })
                  } else {
                    setNewTemplate({ ...newTemplate, content: e.target.value })
                  }
                }}
                placeholder="Contenido de la plantilla con variables..."
                rows={15}
                className="font-mono text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialog(false)
                setEditingTemplate(null)
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button onClick={saveTemplate}>
              <Save className="mr-2 h-4 w-4" />
              {editingTemplate ? "Actualizar" : "Crear"} Plantilla
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialog} onOpenChange={setPreviewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vista Previa: {previewTemplate?.name}</DialogTitle>
            <DialogDescription>Vista previa con datos de ejemplo</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: previewData }} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialog(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
