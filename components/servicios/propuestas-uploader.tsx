"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, Trash2, Loader2 } from "lucide-react"
import { formatDateTimeEs } from "@/lib/date"

type ProposalItem = {
  id: string
  filename: string
  url: string
  description: string
  createdAt: string
  size: number
}

const STORAGE_KEY = "servicios-propuestas"

export default function PropuestasUploader() {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [items, setItems] = useState<ProposalItem[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw) as ProposalItem[]
        setItems(data)
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore
    }
  }, [items])

  const canSave = useMemo(() => !!file && description.trim().length > 0, [file, description])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return

    console.log("[v0] Guardar button clicked - File:", file?.name, "Description length:", description.trim().length)

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      console.log("[v0] Starting upload to /api/servicios/propuestas/upload")

      const res = await fetch("/api/servicios/propuestas/upload", { method: "POST", body: formData })
      const json = await res.json()

      console.log("[v0] Upload response:", { ok: res.ok, status: res.status, data: json })

      if (!res.ok) {
        throw new Error(json?.error || "No se pudo subir el documento.")
      }

      const item: ProposalItem = {
        id: crypto.randomUUID(),
        filename: json.filename || file.name,
        url: json.url,
        description: description.trim(),
        createdAt: json.uploadedAt || new Date().toISOString(),
        size: json.size || file.size,
      }

      setItems((prev) => [item, ...prev])
      setFile(null)
      setDescription("")

      if (inputRef.current) inputRef.current.value = ""

      toast({
        title: "Documento subido",
        description: "La propuesta se guardó correctamente.",
      })

      console.log("[v0] Document uploaded successfully:", item.filename)
    } catch (err: any) {
      console.error("[v0] Upload error:", err)
      toast({
        title: "Error al subir",
        description: err?.message || "Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((x) => x.id !== id))
    toast({
      title: "Eliminado",
      description: "La propuesta fue eliminada de la lista local.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Propuestas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-1">
            <label htmlFor="file" className="text-sm font-medium">
              Documento (cargar documento)
            </label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              ref={inputRef}
            />
            <p className="text-xs text-muted-foreground">
              Formatos admitidos: PDF, DOC, DOCX, imágenes. Tamaño recomendado menor a 20 MB.
            </p>
          </div>

          <div className="space-y-2 sm:col-span-1">
            <label htmlFor="descripcion" className="text-sm font-medium">
              Descripción (manual)
            </label>
            <Textarea
              id="descripcion"
              placeholder="Describe brevemente el documento de la propuesta..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="sm:col-span-2">
            <div className="space-y-2">
              <Button
                type="submit"
                disabled={!canSave || isUploading}
                className={`inline-flex items-center gap-2 transition-all duration-200 ${
                  canSave && !isUploading
                    ? "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Guardar
                  </>
                )}
              </Button>

              <div className="text-xs text-muted-foreground">
                {!file && !description.trim() && "Selecciona un archivo y agrega una descripción para activar el botón"}
                {file && !description.trim() && "Agrega una descripción para continuar"}
                {!file && description.trim() && "Selecciona un archivo para continuar"}
                {canSave && !isUploading && "✓ Listo para guardar"}
                {isUploading && "Subiendo documento..."}
              </div>
            </div>
          </div>
        </form>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Documento</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="w-[120px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                    No hay propuestas aún.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((it) => (
                  <TableRow key={it.id}>
                    <TableCell>
                      <a
                        href={it.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary underline-offset-4 hover:underline"
                      >
                        <FileText className="h-4 w-4" />
                        <span className="truncate">{it.filename}</span>
                      </a>
                    </TableCell>
                    <TableCell>{formatDateTimeEs(it.createdAt)}</TableCell>
                    <TableCell className="max-w-[400px]">
                      <div className="line-clamp-3 whitespace-pre-wrap">{it.description}</div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Eliminar propuesta"
                        onClick={() => removeItem(it.id)}
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
