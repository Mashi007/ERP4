"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Edit, Eye, Database, MemoryStick, Pencil } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Pipeline {
  id: number
  pipeline_name: string
  pipeline_label: string
  pipeline_description?: string
  is_active: boolean
  is_default: boolean
  pipeline_order: number
  stage_count?: number
  created_at: string
  updated_at: string
}

interface PipelineStage {
  id: number
  pipeline_id: number
  stage_name: string
  stage_label: string
  stage_order: number
  probability: number
  is_active: boolean
  is_closed: boolean
  is_won: boolean
  stage_color: string
}

export default function PipelinesSettingsPage() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [stages, setStages] = useState<PipelineStage[]>([])
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [usingDefaults, setUsingDefaults] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showStagesDialog, setShowStagesDialog] = useState(false)
  const [showCreateStageDialog, setShowCreateStageDialog] = useState(false)
  const [showEditStageDialog, setShowEditStageDialog] = useState(false)
  const [editingPipeline, setEditingPipeline] = useState<Pipeline | null>(null)
  const [editingStage, setEditingStage] = useState<PipelineStage | null>(null)
  const [newPipeline, setNewPipeline] = useState({
    pipeline_name: "",
    pipeline_label: "",
    pipeline_description: "",
    is_default: false,
  })
  const [newStage, setNewStage] = useState({
    stage_name: "",
    stage_label: "",
    probability: 0,
    is_closed: false,
    is_won: false,
    stage_color: "#3B82F6",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchPipelines()
  }, [])

  const fetchPipelines = async () => {
    try {
      const response = await fetch("/api/settings/pipelines")
      const data = await response.json()

      if (data.success) {
        setPipelines(data.data)
        setUsingDefaults(data.usingDefaults)
      }
    } catch (error) {
      console.error("Error fetching pipelines:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los pipelines",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStages = async (pipelineId: number) => {
    try {
      const response = await fetch(`/api/settings/pipeline-stages?pipeline_id=${pipelineId}`)
      const data = await response.json()

      if (data.success) {
        setStages(data.data)
      }
    } catch (error) {
      console.error("Error fetching stages:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las etapas",
        variant: "destructive",
      })
    }
  }

  const handleCreatePipeline = async () => {
    try {
      const response = await fetch("/api/settings/pipelines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPipeline),
      })

      const data = await response.json()

      if (data.success) {
        await fetchPipelines()
        setShowCreateDialog(false)
        setNewPipeline({
          pipeline_name: "",
          pipeline_label: "",
          pipeline_description: "",
          is_default: false,
        })
        toast({
          title: "Éxito",
          description: "Pipeline creado correctamente",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Error al crear el pipeline",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating pipeline:", error)
      toast({
        title: "Error",
        description: "Error al crear el pipeline",
        variant: "destructive",
      })
    }
  }

  const handleUpdatePipeline = async () => {
    if (!editingPipeline) return

    try {
      const response = await fetch(`/api/settings/pipelines/${editingPipeline.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPipeline),
      })

      const data = await response.json()

      if (data.success) {
        await fetchPipelines()
        setShowEditDialog(false)
        setEditingPipeline(null)
        toast({
          title: "Éxito",
          description: "Pipeline actualizado correctamente",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Error al actualizar el pipeline",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating pipeline:", error)
      toast({
        title: "Error",
        description: "Error al actualizar el pipeline",
        variant: "destructive",
      })
    }
  }

  const handleDeletePipeline = async (pipeline: Pipeline) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el pipeline "${pipeline.pipeline_label}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/settings/pipelines/${pipeline.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        await fetchPipelines()
        toast({
          title: "Éxito",
          description: "Pipeline eliminado correctamente",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Error al eliminar el pipeline",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting pipeline:", error)
      toast({
        title: "Error",
        description: "Error al eliminar el pipeline",
        variant: "destructive",
      })
    }
  }

  const handleCreateStage = async () => {
    if (!selectedPipeline) return

    try {
      const response = await fetch("/api/settings/pipeline-stages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newStage,
          pipeline_id: selectedPipeline.id,
        }),
      })

      const data = await response.json()

      if (data.success) {
        await fetchStages(selectedPipeline.id)
        await fetchPipelines() // Refresh to update stage count
        setShowCreateStageDialog(false)
        setNewStage({
          stage_name: "",
          stage_label: "",
          probability: 0,
          is_closed: false,
          is_won: false,
          stage_color: "#3B82F6",
        })
        toast({
          title: "Éxito",
          description: "Etapa creada correctamente",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Error al crear la etapa",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating stage:", error)
      toast({
        title: "Error",
        description: "Error al crear la etapa",
        variant: "destructive",
      })
    }
  }

  const handleUpdateStage = async () => {
    if (!editingStage) return

    try {
      const response = await fetch(`/api/settings/pipeline-stages/${editingStage.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingStage),
      })

      const data = await response.json()

      if (data.success) {
        await fetchStages(editingStage.pipeline_id)
        setShowEditStageDialog(false)
        setEditingStage(null)
        toast({
          title: "Éxito",
          description: "Etapa actualizada correctamente",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Error al actualizar la etapa",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating stage:", error)
      toast({
        title: "Error",
        description: "Error al actualizar la etapa",
        variant: "destructive",
      })
    }
  }

  const handleDeleteStage = async (stage: PipelineStage) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la etapa "${stage.stage_label}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/settings/pipeline-stages/${stage.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        await fetchStages(stage.pipeline_id)
        await fetchPipelines() // Refresh to update stage count
        toast({
          title: "Éxito",
          description: "Etapa eliminada correctamente",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Error al eliminar la etapa",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting stage:", error)
      toast({
        title: "Error",
        description: "Error al eliminar la etapa",
        variant: "destructive",
      })
    }
  }

  const openStagesDialog = (pipeline: Pipeline) => {
    setSelectedPipeline(pipeline)
    fetchStages(pipeline.id)
    setShowStagesDialog(true)
  }

  const openEditDialog = (pipeline: Pipeline) => {
    setEditingPipeline({ ...pipeline })
    setShowEditDialog(true)
  }

  const openEditStageDialog = (stage: PipelineStage) => {
    setEditingStage({ ...stage })
    setShowEditStageDialog(true)
  }

  if (isLoading) {
    return (
      <main className="px-6 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Embudos</h1>
          <p className="text-gray-600">Define etapas, probabilidades y flujos de tu pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={usingDefaults ? "secondary" : "default"} className="flex items-center gap-1">
            {usingDefaults ? <MemoryStick className="h-3 w-3" /> : <Database className="h-3 w-3" />}
            {usingDefaults ? "Memoria" : "Base de datos"}
          </Badge>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Pipeline
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Pipeline</DialogTitle>
                <DialogDescription>Define un nuevo pipeline para organizar tu proceso de ventas</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pipeline_name">Nombre del Pipeline</Label>
                  <Input
                    id="pipeline_name"
                    value={newPipeline.pipeline_name}
                    onChange={(e) => setNewPipeline({ ...newPipeline, pipeline_name: e.target.value })}
                    placeholder="ej: ventas_corporativas"
                  />
                </div>
                <div>
                  <Label htmlFor="pipeline_label">Etiqueta</Label>
                  <Input
                    id="pipeline_label"
                    value={newPipeline.pipeline_label}
                    onChange={(e) => setNewPipeline({ ...newPipeline, pipeline_label: e.target.value })}
                    placeholder="ej: Ventas Corporativas"
                  />
                </div>
                <div>
                  <Label htmlFor="pipeline_description">Descripción</Label>
                  <Textarea
                    id="pipeline_description"
                    value={newPipeline.pipeline_description}
                    onChange={(e) => setNewPipeline({ ...newPipeline, pipeline_description: e.target.value })}
                    placeholder="Describe el propósito de este pipeline"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_default"
                    checked={newPipeline.is_default}
                    onCheckedChange={(checked) => setNewPipeline({ ...newPipeline, is_default: checked })}
                  />
                  <Label htmlFor="is_default">Pipeline por defecto</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreatePipeline}>Crear Pipeline</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {pipelines.map((pipeline) => (
          <Card key={pipeline.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {pipeline.pipeline_label}
                    {pipeline.is_default && <Badge variant="default">Por defecto</Badge>}
                  </CardTitle>
                  <CardDescription>{pipeline.pipeline_description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openStagesDialog(pipeline)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    Ver Etapas ({pipeline.stage_count || 0})
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(pipeline)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePipeline(pipeline)}
                    disabled={pipeline.is_default}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                <p>
                  Nombre: <code className="bg-gray-100 px-1 rounded">{pipeline.pipeline_name}</code>
                </p>
                <p>Orden: {pipeline.pipeline_order}</p>
                <p>Estado: {pipeline.is_active ? "Activo" : "Inactivo"}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Pipeline Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Pipeline</DialogTitle>
            <DialogDescription>Modifica la configuración del pipeline</DialogDescription>
          </DialogHeader>
          {editingPipeline && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit_pipeline_name">Nombre del Pipeline</Label>
                <Input
                  id="edit_pipeline_name"
                  value={editingPipeline.pipeline_name}
                  onChange={(e) => setEditingPipeline({ ...editingPipeline, pipeline_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_pipeline_label">Etiqueta</Label>
                <Input
                  id="edit_pipeline_label"
                  value={editingPipeline.pipeline_label}
                  onChange={(e) => setEditingPipeline({ ...editingPipeline, pipeline_label: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_pipeline_description">Descripción</Label>
                <Textarea
                  id="edit_pipeline_description"
                  value={editingPipeline.pipeline_description || ""}
                  onChange={(e) => setEditingPipeline({ ...editingPipeline, pipeline_description: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit_is_default"
                  checked={editingPipeline.is_default}
                  onCheckedChange={(checked) => setEditingPipeline({ ...editingPipeline, is_default: checked })}
                />
                <Label htmlFor="edit_is_default">Pipeline por defecto</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdatePipeline}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stages Dialog */}
      <Dialog open={showStagesDialog} onOpenChange={setShowStagesDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Etapas del Pipeline: {selectedPipeline?.pipeline_label}</DialogTitle>
            <DialogDescription>Gestiona las etapas y probabilidades de este pipeline</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Etapas Configuradas</h3>
              <Dialog open={showCreateStageDialog} onOpenChange={setShowCreateStageDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Nueva Etapa
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Etapa</DialogTitle>
                    <DialogDescription>Añade una nueva etapa al pipeline</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="stage_name">Nombre de la Etapa</Label>
                      <Input
                        id="stage_name"
                        value={newStage.stage_name}
                        onChange={(e) => setNewStage({ ...newStage, stage_name: e.target.value })}
                        placeholder="ej: demo_producto"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stage_label">Etiqueta</Label>
                      <Input
                        id="stage_label"
                        value={newStage.stage_label}
                        onChange={(e) => setNewStage({ ...newStage, stage_label: e.target.value })}
                        placeholder="ej: Demo del Producto"
                      />
                    </div>
                    <div>
                      <Label htmlFor="probability">Probabilidad (%)</Label>
                      <Input
                        id="probability"
                        type="number"
                        min="0"
                        max="100"
                        value={newStage.probability}
                        onChange={(e) =>
                          setNewStage({ ...newStage, probability: Number.parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="stage_color">Color</Label>
                      <Input
                        id="stage_color"
                        type="color"
                        value={newStage.stage_color}
                        onChange={(e) => setNewStage({ ...newStage, stage_color: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_closed"
                          checked={newStage.is_closed}
                          onCheckedChange={(checked) => setNewStage({ ...newStage, is_closed: checked })}
                        />
                        <Label htmlFor="is_closed">Etapa cerrada</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_won"
                          checked={newStage.is_won}
                          onCheckedChange={(checked) => setNewStage({ ...newStage, is_won: checked })}
                        />
                        <Label htmlFor="is_won">Etapa ganada</Label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCreateStageDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateStage}>Crear Etapa</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-3">
              {stages.map((stage) => (
                <div
                  key={stage.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: stage.stage_color }} />
                    <div>
                      <p className="font-medium">{stage.stage_label}</p>
                      <p className="text-sm text-gray-600">
                        {stage.probability}% probabilidad
                        {stage.is_closed && (
                          <Badge variant={stage.is_won ? "default" : "secondary"} className="ml-2">
                            {stage.is_won ? "Ganada" : "Perdida"}
                          </Badge>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-500">Orden: {stage.stage_order}</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditStageDialog(stage)}
                      className="flex items-center gap-1"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteStage(stage)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStagesDialog(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Stage Dialog */}
      <Dialog open={showEditStageDialog} onOpenChange={setShowEditStageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Etapa</DialogTitle>
            <DialogDescription>Modifica la configuración de la etapa</DialogDescription>
          </DialogHeader>
          {editingStage && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit_stage_name">Nombre de la Etapa</Label>
                <Input
                  id="edit_stage_name"
                  value={editingStage.stage_name}
                  onChange={(e) => setEditingStage({ ...editingStage, stage_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_stage_label">Etiqueta</Label>
                <Input
                  id="edit_stage_label"
                  value={editingStage.stage_label}
                  onChange={(e) => setEditingStage({ ...editingStage, stage_label: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_probability">Probabilidad (%)</Label>
                <Input
                  id="edit_probability"
                  type="number"
                  min="0"
                  max="100"
                  value={editingStage.probability}
                  onChange={(e) =>
                    setEditingStage({ ...editingStage, probability: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit_stage_color">Color</Label>
                <Input
                  id="edit_stage_color"
                  type="color"
                  value={editingStage.stage_color}
                  onChange={(e) => setEditingStage({ ...editingStage, stage_color: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit_is_closed"
                    checked={editingStage.is_closed}
                    onCheckedChange={(checked) => setEditingStage({ ...editingStage, is_closed: checked })}
                  />
                  <Label htmlFor="edit_is_closed">Etapa cerrada</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit_is_won"
                    checked={editingStage.is_won}
                    onCheckedChange={(checked) => setEditingStage({ ...editingStage, is_won: checked })}
                  />
                  <Label htmlFor="edit_is_won">Etapa ganada</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditStageDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateStage}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
