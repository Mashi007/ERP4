"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, ChevronUp, ChevronDown, MoreHorizontal, X } from "lucide-react"

export default function GestNormasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [itemsPerPage, setItemsPerPage] = useState("25")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [sortField, setSortField] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    consultores: "",
    presupuestos: "",
  })

  const [normas] = useState([
    // Empty array to show "No hay isos registradas" state as shown in image
  ])

  const [consultantUsers, setConsultantUsers] = useState<Array<{ id: string; name: string; role: string }>>([])
  const [loadingConsultants, setLoadingConsultants] = useState(false)

  useEffect(() => {
    const loadConsultantUsers = async () => {
      setLoadingConsultants(true)
      try {
        const response = await fetch("/api/users")
        if (response.ok) {
          const users = await response.json()
          const consultants = users.filter(
            (user: any) =>
              user.role &&
              (user.role.toLowerCase().includes("consultor") || user.role.toLowerCase().includes("consultores")),
          )
          setConsultantUsers(consultants)
        } else {
          setConsultantUsers([
            { id: "consultor-1", name: "Consultor Principal", role: "Consultor" },
            { id: "consultor-2", name: "Consultor Senior", role: "Consultor Senior" },
            { id: "consultor-3", name: "Consultor Especialista", role: "Consultor Especialista" },
          ])
        }
      } catch (error) {
        console.error("Error loading consultant users:", error)
        setConsultantUsers([
          { id: "consultor-1", name: "Consultor Principal", role: "Consultor" },
          { id: "consultor-2", name: "Consultor Senior", role: "Consultor Senior" },
          { id: "consultor-3", name: "Consultor Especialista", role: "Consultor Especialista" },
        ])
      } finally {
        setLoadingConsultants(false)
      }
    }

    loadConsultantUsers()
  }, [])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(normas.map((norma) => norma.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id])
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id))
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    console.log("Saving norma:", formData)
    setIsDialogOpen(false)
    setFormData({ nombre: "", consultores: "", presupuestos: "" })
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
    setFormData({ nombre: "", consultores: "", presupuestos: "" })
  }

  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-[#1A4F7A] transition-colors"
    >
      {children}
      {sortField === field &&
        (sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
    </button>
  )

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Mostrar</span>
            <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">isos por página</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Buscar:</span>
            <div className="relative">
              <Input
                placeholder=""
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#6366f1] hover:bg-[#5b5bd6] text-white">
                <Plus className="mr-2 h-4 w-4" />
                Crear Norma
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader className="flex flex-row items-center justify-between">
                <DialogTitle className="text-[#6366f1] text-lg font-medium">Crear Norma</DialogTitle>
                <Button variant="ghost" size="sm" onClick={handleCancel} className="h-6 w-6 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                      Nombre <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nombre"
                      placeholder="Nombre de la ISO"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange("nombre", e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="consultores" className="text-sm font-medium text-gray-700">
                      Consultores
                    </Label>
                    <Select
                      value={formData.consultores}
                      onValueChange={(value) => handleInputChange("consultores", value)}
                      disabled={loadingConsultants}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={loadingConsultants ? "Cargando consultores..." : "Seleccionar consultores"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {consultantUsers.map((consultant) => (
                          <SelectItem key={consultant.id} value={consultant.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{consultant.name}</span>
                              <span className="text-xs text-muted-foreground">{consultant.role}</span>
                            </div>
                          </SelectItem>
                        ))}
                        {consultantUsers.length === 0 && !loadingConsultants && (
                          <SelectItem value="" disabled>
                            No hay consultores disponibles
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="presupuestos" className="text-sm font-medium text-gray-700">
                    Presupuestos
                  </Label>
                  <Textarea
                    id="presupuestos"
                    placeholder="Detalles del presupuesto..."
                    value={formData.presupuestos}
                    onChange={(e) => handleInputChange("presupuestos", e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>

                <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                  Los campos marcados con <span className="font-medium">*</span> son obligatorios
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={handleCancel} className="px-6 bg-transparent">
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!formData.nombre.trim()}
                  className="bg-[#6366f1] hover:bg-[#5b5bd6] text-white px-6"
                >
                  Guardar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedItems.length === normas.length && normas.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>
                <SortButton field="fechaCreacion">FECHA CREACIÓN</SortButton>
              </TableHead>
              <TableHead>NOMBRE</TableHead>
              <TableHead>
                <SortButton field="consultores">CONSULTORES ASOCIADOS</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="presupuestos">PRESUPUESTOS ASOCIADOS</SortButton>
              </TableHead>
              <TableHead>DOCUMENTOS ASOCIADOS</TableHead>
              <TableHead>ACCIONES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {normas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No se ha encontrado ninguna iso
                </TableCell>
              </TableRow>
            ) : (
              normas.map((norma) => (
                <TableRow key={norma.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(norma.id)}
                      onCheckedChange={(checked) => handleSelectItem(norma.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>{norma.fechaCreacion}</TableCell>
                  <TableCell className="font-medium">{norma.nombre}</TableCell>
                  <TableCell>{norma.consultores}</TableCell>
                  <TableCell>{norma.presupuestos}</TableCell>
                  <TableCell>{norma.documentos}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">No hay isos registradas</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Primero
          </Button>
          <Button variant="outline" size="sm" disabled>
            Anterior
          </Button>
          <Button variant="outline" size="sm" disabled>
            Siguiente
          </Button>
          <Button variant="outline" size="sm" disabled>
            Último
          </Button>
        </div>
      </div>
    </div>
  )
}
