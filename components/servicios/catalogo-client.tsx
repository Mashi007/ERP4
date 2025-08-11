"use client"

import { useMemo, useState } from "react"
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
import { Pencil, Plus, Trash2 } from "lucide-react"

type Servicio = {
  id: string
  nombre: string
  descripcion: string
  importe: number
  impuesto: number // porcentaje
  total: number
  creadoEl: string // dd/MM/yyyy HH:mm (es)
}

function formatDateEs(date: Date) {
  return date.toLocaleString("es-ES", {
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
  const [openNew, setOpenNew] = useState(false)

  // Form state for "Nuevo Servicio"
  const [nNombre, setNNombre] = useState("")
  const [nDesc, setNDesc] = useState("")
  const [nImporte, setNImporte] = useState<number | "">("")
  const [nImpuesto, setNImpuesto] = useState<number | "">("")

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
  }

  function handleAdd() {
    const importe = typeof nImporte === "number" ? nImporte : Number.parseFloat(`${nImporte}`)
    const impuesto = typeof nImpuesto === "number" ? nImpuesto : Number.parseFloat(`${nImpuesto}`)
    if (!nNombre.trim() || isNaN(importe)) return

    const nuevo: Servicio = {
      id: crypto.randomUUID(),
      nombre: nNombre.trim(),
      descripcion: nDesc.trim(),
      importe: Math.round(importe * 100) / 100,
      impuesto: isNaN(impuesto) ? 0 : Math.round(impuesto * 100) / 100,
      total: calcTotal(importe, isNaN(impuesto) ? 0 : impuesto),
      creadoEl: formatDateEs(new Date()),
    }
    setItems((prev) => [nuevo, ...prev])
    resetNewForm()
    setOpenNew(false)
  }

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false)
  const [editRow, setEditRow] = useState<Servicio | null>(null)
  const [eNombre, setENombre] = useState("")
  const [eDesc, setEDesc] = useState("")
  const [eImporte, setEImporte] = useState<number | "">("")
  const [eImpuesto, setEImpuesto] = useState<number | "">("")

  const eTotal = useMemo(() => {
    const imp = typeof eImporte === "number" ? eImporte : Number.parseFloat(`${eImporte}`)
    const iva = typeof eImpuesto === "number" ? eImpuesto : Number.parseFloat(`${eImpuesto}`)
    if (isNaN(imp)) return 0
    return calcTotal(imp, isNaN(iva) ? 0 : iva)
  }, [eImporte, eImpuesto])

  function openEdit(row: Servicio) {
    setEditRow(row)
    setENombre(row.nombre)
    setEDesc(row.descripcion)
    setEImporte(row.importe)
    setEImpuesto(row.impuesto)
    setEditOpen(true)
  }

  function saveEdit() {
    if (!editRow) return
    const importe = typeof eImporte === "number" ? eImporte : Number.parseFloat(`${eImporte}`)
    const impuesto = typeof eImpuesto === "number" ? eImpuesto : Number.parseFloat(`${eImpuesto}`)
    if (!eNombre.trim() || isNaN(importe)) return

    setItems((prev) =>
      prev.map((it) =>
        it.id === editRow.id
          ? {
              ...it,
              nombre: eNombre.trim(),
              descripcion: eDesc.trim(),
              importe: Math.round(importe * 100) / 100,
              impuesto: isNaN(impuesto) ? 0 : Math.round(impuesto * 100) / 100,
              total: calcTotal(importe, isNaN(impuesto) ? 0 : impuesto),
            }
          : it,
      ),
    )
    setEditOpen(false)
    setEditRow(null)
  }

  function deleteRow(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id))
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

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="n-importe">
                    Importe <span className="text-red-600">*</span>
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
              </div>

              <div className="grid gap-2">
                <Label htmlFor="n-total">Valor total</Label>
                <Input id="n-total" readOnly value={nTotal.toFixed(2)} />
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
                <TableHead className="text-right">Importe</TableHead>
                <TableHead className="text-right">Impuesto %</TableHead>
                <TableHead className="text-right">Valor total</TableHead>
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
                    <TableCell className="font-medium">{it.nombre}</TableCell>
                    <TableCell className="max-w-[360px] truncate">{it.descripcion}</TableCell>
                    <TableCell className="text-right">{it.importe.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{it.impuesto.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{it.total.toFixed(2)}</TableCell>
                    <TableCell>{it.creadoEl}</TableCell>
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
                                Esta acción no se puede deshacer. ¿Deseas eliminar “{it.nombre}”?
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

      {/* Editar Servicio */}
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

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="e-importe">
                  Importe <span className="text-red-600">*</span>
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
            </div>

            <div className="grid gap-2">
              <Label htmlFor="e-total">Valor total</Label>
              <Input id="e-total" readOnly value={eTotal.toFixed(2)} />
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
