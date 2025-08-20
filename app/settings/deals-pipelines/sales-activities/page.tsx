"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Phone, Calendar, Mail, CheckSquare, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type ActivityType = {
  id: number
  name: string
  description: string
  icon: string
  color: string
  is_active: boolean
  requires_outcome: boolean
}

type ActivityOutcome = {
  id: number
  activity_type_id: number
  name: string
  description: string
  is_positive: boolean
  next_activity_suggestion: string
}

const iconOptions = [
  { value: "phone", label: "Teléfono", icon: Phone },
  { value: "calendar", label: "Calendario", icon: Calendar },
  { value: "mail", label: "Email", icon: Mail },
  { value: "check-square", label: "Tarea", icon: CheckSquare },
  { value: "file-text", label: "Nota", icon: FileText },
]

const colorOptions = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#6B7280", "#EC4899", "#14B8A6"]

export default function SalesActivitiesSettingsPage() {
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([])
  const [outcomes, setOutcomes] = useState<ActivityOutcome[]>([])
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false)
  const [isOutcomeDialogOpen, setIsOutcomeDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<ActivityType | null>(null)
  const [editingOutcome, setEditingOutcome] = useState<ActivityOutcome | null>(null)
  const [typeFormData, setTypeFormData] = useState({
    name: "",
    description: "",
    icon: "phone",
    color: "#3B82F6",
    is_active: true,
    requires_outcome: false,
  })
  const [outcomeFormData, setOutcomeFormData] = useState({
    activity_type_id: 0,
    name: "",
    description: "",
    is_positive: true,
    next_activity_suggestion: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    // Simular carga de datos
    const mockTypes: ActivityType[] = [
      {
        id: 1,
        name: "Llamada",
        description: "Llamada telefónica",
        icon: "phone",
        color: "#3B82F6",
        is_active: true,
        requires_outcome: true,
      },
      {
        id: 2,
        name: "Reunión",
        description: "Reunión presencial o virtual",
        icon: "calendar",
        color: "#10B981",
        is_active: true,
        requires_outcome: true,
      },
      {
        id: 3,
        name: "Email",
        description: "Correo electrónico",
        icon: "mail",
        color: "#8B5CF6",
        is_active: true,
        requires_outcome: false,
      },
      {
        id: 4,
        name: "Tarea",
        description: "Tarea o seguimiento",
        icon: "check-square",
        color: "#F59E0B",
        is_active: true,
        requires_outcome: false,
      },
    ]

    const mockOutcomes: ActivityOutcome[] = [
      {
        id: 1,
        activity_type_id: 1,
        name: "Contactado",
        description: "Se logró contactar al cliente",
        is_positive: true,
        next_activity_suggestion: "Reunión",
      },
      {
        id: 2,
        activity_type_id: 1,
        name: "No contesta",
        description: "No se logró contactar",
        is_positive: false,
        next_activity_suggestion: "Llamada",
      },
      {
        id: 3,
        activity_type_id: 2,
        name: "Reunión exitosa",
        description: "Reunión productiva",
        is_positive: true,
        next_activity_suggestion: "Propuesta",
      },
      {
        id: 4,
        activity_type_id: 2,
        name: "Reunión cancelada",
        description: "Cliente canceló la reunión",
        is_positive: false,
        next_activity_suggestion: "Llamada",
      },
    ]

    setActivityTypes(mockTypes)
    setOutcomes(mockOutcomes)
  }

  const handleTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingType) {
        setActivityTypes(
          activityTypes.map((t) =>
            t.id === editingType.id ? ({ ...typeFormData, id: editingType.id } as ActivityType) : t,
          ),
        )
        toast({ title: "Tipo de actividad actualizado correctamente" })
      } else {
        const newType: ActivityType = { ...typeFormData, id: Date.now() } as ActivityType
        setActivityTypes([...activityTypes, newType])
        toast({ title: "Tipo de actividad creado correctamente" })
      }

      resetTypeForm()
      setIsTypeDialogOpen(false)
    } catch (error) {
      toast({ title: "Error al guardar el tipo de actividad", variant: "destructive" })
    }
  }

  const handleOutcomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingOutcome) {
        setOutcomes(
          outcomes.map((o) =>
            o.id === editingOutcome.id ? ({ ...outcomeFormData, id: editingOutcome.id } as ActivityOutcome) : o,
          ),
        )
        toast({ title: "Resultado actualizado correctamente" })
      } else {
        const newOutcome: ActivityOutcome = { ...outcomeFormData, id: Date.now() } as ActivityOutcome
        setOutcomes([...outcomes, newOutcome])
        toast({ title: "Resultado creado correctamente" })
      }

      resetOutcomeForm()
      setIsOutcomeDialogOpen(false)
    } catch (error) {
      toast({ title: "Error al guardar el resultado", variant: "destructive" })
    }
  }

  const resetTypeForm = () => {
    setTypeFormData({
      name: "",
      description: "",
      icon: "phone",
      color: "#3B82F6",
      is_active: true,
      requires_outcome: false,
    })
    setEditingType(null)
  }

  const resetOutcomeForm = () => {
    setOutcomeFormData({
      activity_type_id: 0,
      name: "",
      description: "",
      is_positive: true,
      next_activity_suggestion: "",
    })
    setEditingOutcome(null)
  }

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find((opt) => opt.value === iconName)
    return iconOption ? iconOption.icon : Phone
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Actividades de Ventas</h1>
        <p className="text-muted-foreground">Configura tipos de actividad, resultados y su seguimiento</p>
      </div>

      <Tabs defaultValue="types" className="space-y-4">
        <TabsList>
          <TabsTrigger value="types">Tipos de Actividad</TabsTrigger>
          <TabsTrigger value="outcomes">Resultados</TabsTrigger>
        </TabsList>

        <TabsContent value="types" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Tipos de Actividad</h2>
            <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetTypeForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Tipo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingType ? "Editar Tipo de Actividad" : "Nuevo Tipo de Actividad"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleTypeSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={typeFormData.name}
                      onChange={(e) => setTypeFormData({ ...typeFormData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={typeFormData.description}
                      onChange={(e) => setTypeFormData({ ...typeFormData, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Icono</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {iconOptions.map((option) => {
                          const IconComponent = option.icon
                          return (
                            <Button
                              key={option.value}
                              type="button"
                              variant={typeFormData.icon === option.value ? "default" : "outline"}
                              className="h-12"
                              onClick={() => setTypeFormData({ ...typeFormData, icon: option.value })}
                            >
                              <IconComponent className="h-4 w-4" />
                            </Button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <Label>Color</Label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {colorOptions.map((color) => (
                          <Button
                            key={color}
                            type="button"
                            className="h-8 w-8 p-0 rounded-full"
                            style={{ backgroundColor: color }}
                            variant={typeFormData.color === color ? "default" : "outline"}
                            onClick={() => setTypeFormData({ ...typeFormData, color })}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={typeFormData.is_active}
                        onCheckedChange={(checked) => setTypeFormData({ ...typeFormData, is_active: checked })}
                      />
                      <Label htmlFor="is_active">Activo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="requires_outcome"
                        checked={typeFormData.requires_outcome}
                        onCheckedChange={(checked) => setTypeFormData({ ...typeFormData, requires_outcome: checked })}
                      />
                      <Label htmlFor="requires_outcome">Requiere resultado</Label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsTypeDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">{editingType ? "Actualizar" : "Crear"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Requiere Resultado</TableHead>
                    <TableHead className="w-32">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityTypes.map((type) => {
                    const IconComponent = getIconComponent(type.icon)
                    return (
                      <TableRow key={type.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: `${type.color}20`, color: type.color }}
                            >
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{type.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{type.description}</TableCell>
                        <TableCell>
                          <Badge variant={type.is_active ? "default" : "secondary"}>
                            {type.is_active ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {type.requires_outcome ? (
                            <Badge variant="outline">Sí</Badge>
                          ) : (
                            <Badge variant="secondary">No</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingType(type)
                                setTypeFormData({
                                  name: type.name,
                                  description: type.description,
                                  icon: type.icon,
                                  color: type.color,
                                  is_active: type.is_active,
                                  requires_outcome: type.requires_outcome,
                                })
                                setIsTypeDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setActivityTypes(activityTypes.filter((t) => t.id !== type.id))
                                toast({ title: "Tipo de actividad eliminado" })
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Resultados de Actividades</h2>
            <Dialog open={isOutcomeDialogOpen} onOpenChange={setIsOutcomeDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetOutcomeForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Resultado
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingOutcome ? "Editar Resultado" : "Nuevo Resultado"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleOutcomeSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="activity_type">Tipo de Actividad</Label>
                    <select
                      id="activity_type"
                      className="w-full p-2 border rounded-md"
                      value={outcomeFormData.activity_type_id}
                      onChange={(e) =>
                        setOutcomeFormData({ ...outcomeFormData, activity_type_id: Number(e.target.value) })
                      }
                      required
                    >
                      <option value={0}>Seleccionar tipo</option>
                      {activityTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="outcome_name">Nombre del Resultado</Label>
                    <Input
                      id="outcome_name"
                      value={outcomeFormData.name}
                      onChange={(e) => setOutcomeFormData({ ...outcomeFormData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="outcome_description">Descripción</Label>
                    <Textarea
                      id="outcome_description"
                      value={outcomeFormData.description}
                      onChange={(e) => setOutcomeFormData({ ...outcomeFormData, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="next_activity">Siguiente Actividad Sugerida</Label>
                    <Input
                      id="next_activity"
                      value={outcomeFormData.next_activity_suggestion}
                      onChange={(e) =>
                        setOutcomeFormData({ ...outcomeFormData, next_activity_suggestion: e.target.value })
                      }
                      placeholder="ej: Reunión, Llamada de seguimiento"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_positive"
                      checked={outcomeFormData.is_positive}
                      onCheckedChange={(checked) => setOutcomeFormData({ ...outcomeFormData, is_positive: checked })}
                    />
                    <Label htmlFor="is_positive">Resultado positivo</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsOutcomeDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">{editingOutcome ? "Actualizar" : "Crear"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo de Actividad</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Siguiente Actividad</TableHead>
                    <TableHead className="w-32">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outcomes.map((outcome) => {
                    const activityType = activityTypes.find((t) => t.id === outcome.activity_type_id)
                    return (
                      <TableRow key={outcome.id}>
                        <TableCell>
                          <Badge variant="outline">{activityType?.name}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{outcome.name}</div>
                            <div className="text-sm text-muted-foreground">{outcome.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={outcome.is_positive ? "default" : "destructive"}>
                            {outcome.is_positive ? "Positivo" : "Negativo"}
                          </Badge>
                        </TableCell>
                        <TableCell>{outcome.next_activity_suggestion || "-"}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingOutcome(outcome)
                                setOutcomeFormData({
                                  activity_type_id: outcome.activity_type_id,
                                  name: outcome.name,
                                  description: outcome.description,
                                  is_positive: outcome.is_positive,
                                  next_activity_suggestion: outcome.next_activity_suggestion,
                                })
                                setIsOutcomeDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setOutcomes(outcomes.filter((o) => o.id !== outcome.id))
                                toast({ title: "Resultado eliminado" })
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
