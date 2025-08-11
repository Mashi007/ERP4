"use client"

import { useMemo, useState } from "react"
import { Edit, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useCurrency } from "@/components/providers/currency-provider"
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

type Service = {
  id: string
  name: string
  description: string
  amount: number
  taxPct: number
  total: number
  createdAt: string // ISO
}

function formatDateEs(value: string | number | Date) {
  const date = new Date(value)
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export default function ServiciosClient() {
  const { format } = useCurrency()

  // List state
  const [items, setItems] = useState<Service[]>(() => {
    const now = new Date().toISOString()
    return [
      {
        id: "srv-1",
        name: "Implementación CRM",
        description: "Puesta en marcha, configuración inicial y capacitación.",
        amount: 1200,
        taxPct: 12,
        total: 1200 * 1.12,
        createdAt: now,
      },
    ]
  })

  const totalGeneral = useMemo(() => items.reduce((acc, s) => acc + (s.total || 0), 0), [items])

  // Create dialog state
  const [openCreate, setOpenCreate] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState<string>("")
  const [taxPct, setTaxPct] = useState<string>("12")
  const computedTotal = useMemo(() => {
    const amt = Number(amount) || 0
    const tax = Number(taxPct) || 0
    return amt * (1 + tax / 100)
  }, [amount, taxPct])

  function resetCreateForm() {
    setName("")
    setDescription("")
    setAmount("")
    setTaxPct("12")
  }

  function addService() {
    if (!name.trim()) return
    const amt = Number(amount) || 0
    const tax = Number(taxPct) || 0
    const newItem: Service = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      amount: amt,
      taxPct: tax,
      total: amt * (1 + tax / 100),
      createdAt: new Date().toISOString(),
    }
    setItems((prev) => [newItem, ...prev])
    setOpenCreate(false)
    resetCreateForm()
  }

  // Edit dialog state
  const [openEdit, setOpenEdit] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [eName, setEName] = useState("")
  const [eDescription, setEDescription] = useState("")
  const [eAmount, setEAmount] = useState<string>("")
  const [eTaxPct, setETaxPct] = useState<string>("")
  const eComputedTotal = useMemo(() => {
    const amt = Number(eAmount) || 0
    const tax = Number(eTaxPct) || 0
    return amt * (1 + tax / 100)
  }, [eAmount, eTaxPct])

  function openEditDialog(item: Service) {
    setEditingId(item.id)
    setEName(item.name)
    setEDescription(item.description)
    setEAmount(String(item.amount))
    setETaxPct(String(item.taxPct))
    setOpenEdit(true)
  }

  function saveEdit() {
    if (!editingId) return
    setItems((prev) =>
      prev.map((s) =>
        s.id === editingId
          ? {
              ...s,
              name: eName.trim(),
              description: eDescription.trim(),
              amount: Number(eAmount) || 0,
              taxPct: Number(eTaxPct) || 0,
              total: (Number(eAmount) || 0) * (1 + (Number(eTaxPct) || 0) / 100),
            }
          : s,
      ),
    )
    setOpenEdit(false)
    setEditingId(null)
  }

  // Delete confirm dialog state
  const [deleting, setDeleting] = useState<Service | null>(null)

  function confirmDelete(item: Service) {
    setDeleting(item)
  }

  function performDelete() {
    if (!deleting) return
    setItems((prev) => prev.filter((s) => s.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header and create button */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {items.length} {"servicio(s) · Total general: "}
          <span className="font-medium">{format(totalGeneral)}</span>
        </div>

        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {"Nuevo Servicio"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{"Agregar Nuevo Servicio"}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              {/* Nombre del Servicio */}
              <div className="grid gap-2">
                <Label htmlFor="srv-name">{"Nombre del Servicio"}</Label>
                <Input
                  id="srv-name"
                  placeholder="Nombre del servicio"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Descripción */}
              <div className="grid gap-2">
                <Label htmlFor="srv-desc">{"Descripción"}</Label>
                <Textarea
                  id="srv-desc"
                  placeholder="Redacción manual de la descripción del servicio"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Importe */}
              <div className="grid gap-2">
                <Label htmlFor="srv-amount">{"Importe"}</Label>
                <Input
                  id="srv-amount"
                  inputMode="decimal"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              {/* Impuesto (%) */}
              <div className="grid gap-2">
                <Label htmlFor="srv-tax">{"Impuesto (%)"}</Label>
                <Input
                  id="srv-tax"
                  inputMode="decimal"
                  placeholder="0"
                  value={taxPct}
                  onChange={(e) => setTaxPct(e.target.value)}
                />
              </div>

              {/* Valor total (solo lectura) */}
              <div className="grid gap-2">
                <Label htmlFor="srv-total">{"Valor total"}</Label>
                <Input id="srv-total" readOnly value={format(computedTotal)} aria-readonly />
              </div>
            </div>

            <DialogFooter>
              <Button variant="secondary" onClick={() => setOpenCreate(false)}>
                {"Cancelar"}
              </Button>
              <Button onClick={addService} disabled={!name.trim()}>
                {"Guardar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla de servicios */}
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[22%]">{"Servicio"}</TableHead>
              <TableHead className="w-[28%]">{"Descripción"}</TableHead>
              <TableHead className="w-[12%]">{"Importe"}</TableHead>
              <TableHead className="w-[12%]">{"Impuesto (%)"}</TableHead>
              <TableHead className="w-[12%]">{"Valor total"}</TableHead>
              <TableHead className="w-[10%]">{"Fecha"}</TableHead>
              <TableHead className="w-[8%]" aria-label="Acciones">
                {"Acciones"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell className="text-muted-foreground">{s.description || "—"}</TableCell>
                <TableCell className="tabular-nums">{format(s.amount)}</TableCell>
                <TableCell className="tabular-nums">{s.taxPct}%</TableCell>
                <TableCell className="tabular-nums font-medium">{format(s.total)}</TableCell>
                <TableCell className="tabular-nums">{formatDateEs(s.createdAt)}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Editar servicio ${s.name}`}
                    onClick={() => openEditDialog(s)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Eliminar servicio ${s.name}`}
                        onClick={() => confirmDelete(s)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{"Eliminar servicio"}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {`¿Seguro que deseas eliminar "${deleting?.name ?? s.name}"? Esta acción no se puede deshacer.`}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleting(null)}>{"Cancelar"}</AlertDialogCancel>
                        <AlertDialogAction onClick={performDelete} className="bg-red-600 hover:bg-red-700">
                          {"Eliminar"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">
                  {"No hay servicios aún."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{"Editar Servicio"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* Nombre del Servicio */}
            <div className="grid gap-2">
              <Label htmlFor="edit-name">{"Nombre del Servicio"}</Label>
              <Input
                id="edit-name"
                placeholder="Nombre del servicio"
                value={eName}
                onChange={(e) => setEName(e.target.value)}
              />
            </div>

            {/* Descripción */}
            <div className="grid gap-2">
              <Label htmlFor="edit-desc">{"Descripción"}</Label>
              <Textarea
                id="edit-desc"
                placeholder="Redacción manual de la descripción del servicio"
                value={eDescription}
                onChange={(e) => setEDescription(e.target.value)}
              />
            </div>

            {/* Importe */}
            <div className="grid gap-2">
              <Label htmlFor="edit-amount">{"Importe"}</Label>
              <Input
                id="edit-amount"
                inputMode="decimal"
                placeholder="0"
                value={eAmount}
                onChange={(e) => setEAmount(e.target.value)}
              />
            </div>

            {/* Impuesto (%) */}
            <div className="grid gap-2">
              <Label htmlFor="edit-tax">{"Impuesto (%)"}</Label>
              <Input
                id="edit-tax"
                inputMode="decimal"
                placeholder="0"
                value={eTaxPct}
                onChange={(e) => setETaxPct(e.target.value)}
              />
            </div>

            {/* Valor total (solo lectura) */}
            <div className="grid gap-2">
              <Label htmlFor="edit-total">{"Valor total"}</Label>
              <Input id="edit-total" readOnly value={format(eComputedTotal)} aria-readonly />
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpenEdit(false)}>
              {"Cancelar"}
            </Button>
            <Button onClick={saveEdit} disabled={!eName.trim()}>
              {"Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
