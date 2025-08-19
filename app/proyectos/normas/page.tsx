"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, ChevronUp, ChevronDown, MoreHorizontal } from "lucide-react"

export default function GestNormasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [itemsPerPage, setItemsPerPage] = useState("25")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [sortField, setSortField] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const [normas] = useState([
    // Empty array to show "No hay isos registradas" state as shown in image
  ])

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
          <Button className="bg-[#6366f1] hover:bg-[#5b5bd6] text-white">
            <Plus className="mr-2 h-4 w-4" />
            Crear Norma
          </Button>
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
