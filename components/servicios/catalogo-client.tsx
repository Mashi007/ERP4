"use client"

import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

type Servicio = {
  id: number
  name: string
  description: string
  base_price: number
  currency: string
  tax_rate: number
  is_active: boolean
  created_at: string
}

function formatDateEs(dateString: string) {
  return new Date(dateString).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function calcTotal(importe: number, impuestoPct: number) {
  const total = importe + (importe * (isNaN(impuestoPct) ? 0 : impuestoPct)) / 100
  return Math.round(total * 100) / 100
}

export default function CatalogoClient() {
  const [items, setItems] = useState<Servicio[]>([])
  const [loading, setLoading] = useState(true)
  const [openNew, setOpenNew] = useState(false)

  // Form state for "Nuevo Servicio"
  const [nNombre, setNNombre] = useState("")
  const [nDesc, setNDesc] = useState("")
  const [nImporte, setNImporte] = useState<number | "">("")
  const [nImpuesto, setNImpuesto] = useState<number | "">("")
  const [nMoneda, setNMoneda] = useState("EUR")

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/services")
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar los servicios",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading services:", error)
      toast({
        title: "Error",
        description: "Error de conexión al cargar servicios",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const nTotal = useMemo(() => {
    const imp = typeof nImporte === "number" ? nImporte : Number.parseFloat(`${nImporte}`)
    const iva = typeof nImpuesto === "number" ? nImpuesto : Number.parseFloat(`${nImpuesto}`)
    if (isNaN(imp)) return 0
    return calcTotal(imp, isNaN(iva) ? 0 : iva)
  }, [nImporte, nImpuesto])

  function resetNewForm() {
    setNNombre("")
    setNDesc("")
    setNImporte("")
    setNImpuesto("")
    setNMoneda("EUR")
  }

  async function handleAdd() {
    const importe = typeof nImporte === "number" ? nImporte : Number.parseFloat(`${nImporte}`)
    const impuesto = typeof nImpuesto === "number" ? nImpuesto : Number.parseFloat(`${nImpuesto}`)
    if (!nNombre.trim() || isNaN(importe)) return

    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nNombre.trim(),
          description: nDesc.trim(),
          base_price: Math.round(importe * 100) / 100,
          currency: nMoneda,
          tax_rate: isNaN(impuesto) ? 0 : Math.round(impuesto * 100) / 100,
          is_service: true,
          is_active: true,
        }),
      })

      if (response.ok) {
        const newService = await response.json()
        setItems((prev) => [newService, ...prev])
        resetNewForm()
        setOpenNew(false)
        toast({
          title: "Servicio agregado",
          description: "El servicio se guardó correctamente en la base de datos",
        })
      } else {
        throw new Error("Error al guardar el servicio")
      }
    } catch (error) {
      console.error("Error adding service:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el servicio",
        variant: "destructive",
      })
    }
  }

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false)
  const [editRow, setEditRow] = useState<Servicio | null>(null)
  const [eNombre, setENombre] = useState("")
  const [eDesc, setEDesc] = useState("")
  const [eImporte, setEImporte] = useState<number | "">("")
  const [eImpuesto, setEImpuesto] = useState<number | "">("")
  const [eMoneda, setEMoneda] = useState("EUR")

  const eTotal = useMemo(() => {
    const imp = typeof eImporte === "number" ? eImporte : Number.parseFloat(`${eImporte}`)
    const iva = typeof eImpuesto === "number" ? eImpuesto : Number.parseFloat(`${eImpuesto}`)
    if (isNaN(imp)) return 0
    return calcTotal(imp, isNaN(iva) ? 0 : iva)
  }, [eImporte, eImpuesto])

  function openEdit(row: Servicio) {
    setEditRow(row)
    setENombre(row.name)
    setEDesc(row.description)
    setEImporte(row.base_price)
    setEImpuesto(row.tax_rate)
    setEMoneda(row.currency)
    setEditOpen(true)
  }

  async function saveEdit() {
    if (!editRow) return
    const importe = typeof eImporte === "number" ? eImporte : Number.parseFloat(`${eImporte}`)
    const impuesto = typeof eImpuesto === "number" ? eImpuesto : Number.parseFloat(`${eImpuesto}`)
    if (!eNombre.trim() || isNaN(importe)) return

    try {
      const response = await fetch(`/api/services/${editRow.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: eNombre.trim(),
          description: eDesc.trim(),
          base_price: Math.round(importe * 100) / 100,
          currency: eMoneda,
          tax_rate: isNaN(impuesto) ? 0 : Math.round(impuesto * 100) / 100,
        }),
      })

      if (response.ok) {
        const updatedService = await response.json()
        setItems((prev) => prev.map((it) => (it.id === editRow.id ? updatedService : it)))
        setEditOpen(false)
        setEditRow(null)
        toast({
          title: "Servicio actualizado",
          description: "Los cambios se guardaron correctamente",
        })
      } else {
        throw new Error("Error al actualizar el servicio")
      }
    } catch (error) {
      console.error("Error updating service:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el servicio",
        variant: "destructive",
      })
    }
  }

  async function deleteRow(id: number) {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setItems((prev) => prev.filter((it) => it.id !== id))
        toast({
          title: "Servicio eliminado",
          description: "El servicio se eliminó correctamente",
        })
      } else {
        throw new Error("Error al eliminar el servicio")
      }
    } catch (error) {
      console.error("Error deleting service:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el servicio",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Catálogo</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando servicios...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Catálogo</CardTitle>
        <Dialog open={openNew} onOpenChange={setOpenNew}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Servicio
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Nuevo Servicio</DialogTitle>
              <DialogDescription>
                Completa la información. Los campos requeridos están marcados con *.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="n-nombre">
                  Nombre del Servicio <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="n-nombre"
                  placeholder="Nombre"
                  value={nNombre}
                  onChange={(e) => setNNombre(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="n-desc">Descripción</Label>
                <Textarea
                  id="n-desc"
                  placeholder="Descripción del servicio"
                  value={nDesc}
                  onChange={(e) => setNDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="n-importe">
                    Precio <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="n-importe"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={nImporte}
                    onChange={(e) => {
                      const v = e.target.value
                      setNImporte(v === "" ? "" : Number(v))
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="n-impuesto">Impuesto %</Label>
                  <Input
                    id="n-impuesto"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0"
                    value={nImpuesto}
                    onChange={(e) => {
                      const v = e.target.value
                      setNImpuesto(v === "" ? "" : Number(v))
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="n-moneda">Moneda</Label>
                  <Input id="n-moneda" placeholder="EUR" value={nMoneda} onChange={(e) => setNMoneda(e.target.value)} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="n-total">Valor total</Label>
                <Input id="n-total" readOnly value={`${nTotal.toFixed(2)} ${nMoneda}`} />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenNew(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAdd}>Agregar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Servicio</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Impuesto %</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead className="w-[120px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No hay servicios aún.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((it) => (
                  <TableRow key={it.id}>
                    <TableCell className="font-medium">{it.name}</TableCell>
                    <TableCell className="max-w-[360px] truncate">{it.description}</TableCell>
                    <TableCell className="text-right">
                      {it.base_price.toFixed(2)} {it.currency}
                    </TableCell>
                    <TableCell className="text-right">{it.tax_rate.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      {calcTotal(it.base_price, it.tax_rate).toFixed(2)} {it.currency}
                    </TableCell>
                    <TableCell>{formatDateEs(it.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* Edit */}
                        <Button variant="outline" size="icon" onClick={() => openEdit(it)} aria-label="Editar">
                          <Pencil className="h-4 w-4" />
                        </Button>

                        {/* Delete */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" aria-label="Eliminar">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Eliminar servicio</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. ¿Deseas eliminar "{it.name}"?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteRow(it.id)}>Eliminar</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Servicio</DialogTitle>
            <DialogDescription>Actualiza los datos del servicio.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="e-nombre">
                Nombre del Servicio <span className="text-red-600">*</span>
              </Label>
              <Input id="e-nombre" placeholder="Nombre" value={eNombre} onChange={(e) => setENombre(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="e-desc">Descripción</Label>
              <Textarea
                id="e-desc"
                placeholder="Descripción del servicio"
                value={eDesc}
                onChange={(e) => setEDesc(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="e-importe">
                  Precio <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="e-importe"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={eImporte}
                  onChange={(e) => {
                    const v = e.target.value
                    setEImporte(v === "" ? "" : Number(v))
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="e-impuesto">Impuesto %</Label>
                <Input
                  id="e-impuesto"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                  value={eImpuesto}
                  onChange={(e) => {
                    const v = e.target.value
                    setEImpuesto(v === "" ? "" : Number(v))
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="e-moneda">Moneda</Label>
                <Input id="e-moneda" placeholder="EUR" value={eMoneda} onChange={(e) => setEMoneda(e.target.value)} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="e-total">Valor total</Label>
              <Input id="e-total" readOnly value={`${eTotal.toFixed(2)} ${eMoneda}`} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveEdit}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
