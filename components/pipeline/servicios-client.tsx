"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useCurrency } from "@/components/providers/currency-provider"

type Servicio = {
  id: string
  nombre: string
  cliente?: string
  estado: "nuevo" | "en-proceso" | "completado"
  importe: number
  createdAt: string
}

const ESTADOS: Record<Servicio["estado"], { label: string; variant: "secondary" | "default" | "outline" }> = {
  nuevo: { label: "Nuevo", variant: "secondary" },
  "en-proceso": { label: "En proceso", variant: "default" },
  completado: { label: "Completado", variant: "outline" },
}

export default function ServiciosClient() {
  const [rows, setRows] = useState<Servicio[]>([])
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState("")
  const [cliente, setCliente] = useState("")
  const [estado, setEstado] = useState<Servicio["estado"]>("nuevo")
  const [importe, setImporte] = useState<number>(0)
  const { format } = useCurrency?.() ?? {
    format: (v: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD" }).format(v),
  }

  const canSave = useMemo(() => nombre.trim().length > 0, [nombre])

  function resetForm() {
    setNombre("")
    setCliente("")
    setEstado("nuevo")
    setImporte(0)
  }

  function addRow() {
    const now = new Date().toISOString()
    const nuevo: Servicio = {
      id: Math.random().toString(36).slice(2),
      nombre,
      cliente: cliente || undefined,
      estado,
      importe: Number.isFinite(importe) ? importe : 0,
      createdAt: now,
    }
    setRows((prev) => [nuevo, ...prev])
    setOpen(false)
    resetForm()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Registra servicios ofrecidos y su estado.</div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Nuevo Servicio</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Nuevo Servicio</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre del servicio"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Input
                  id="cliente"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  placeholder="Cliente asociado (opcional)"
                />
              </div>
              <div className="grid gap-2">
                <Label>Estado</Label>
                <Select value={estado} onValueChange={(v: Servicio["estado"]) => setEstado(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nuevo">Nuevo</SelectItem>
                    <SelectItem value="en-proceso">En proceso</SelectItem>
                    <SelectItem value="completado">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="importe">Importe</Label>
                <Input
                  id="importe"
                  type="number"
                  inputMode="decimal"
                  value={Number.isNaN(importe) ? "" : String(importe)}
                  onChange={(e) => setImporte(Number.parseFloat(e.target.value))}
                  placeholder="0"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => {
                  setOpen(false)
                  resetForm()
                }}
              >
                Cancelar
              </Button>
              <Button disabled={!canSave} onClick={addRow}>
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className={cn("overflow-x-auto rounded-md border")}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Servicio</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Importe</TableHead>
              <TableHead>Creado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  No hay servicios aún.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.nombre}</TableCell>
                  <TableCell>{r.cliente ?? "-"}</TableCell>
                  <TableCell>
                    <Badge variant={ESTADOS[r.estado].variant}>{ESTADOS[r.estado].label}</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{format(r.importe)}</TableCell>
                  <TableCell>
                    {new Date(r.createdAt).toLocaleString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
