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

  const getFileTypeInfo = (filename: string) => {
    const ext = filename.toLowerCase().split(".").pop()
    switch (ext) {
      case "doc":
      case "docx":
        return { type: "word", color: "bg-blue-500", icon: "📄" }
      case "pdf":
        return { type: "pdf", color: "bg-red-500", icon: "📕" }
      case "png":
      case "jpg":
      case "jpeg":
        return { type: "image", color: "bg-green-500", icon: "🖼️" }
      default:
        return { type: "document", color: "bg-gray-500", icon: "📄" }
    }
  }

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
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Upload className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Propuestas</h2>
        </div>
        <p className="text-gray-600">
          Sube y gestiona plantillas de propuestas en formato Word, PDF o imágenes para tu catálogo de servicios.
        </p>
      </div>

      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Nueva Propuesta
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <label htmlFor="file" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="p-1 bg-blue-100 rounded">
                    <Upload className="h-4 w-4 text-blue-600" />
                  </div>
                  Documento (Plantilla)
                </label>
                <div className="relative">
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    ref={inputRef}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                  />
                  {file && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getFileTypeInfo(file.name).icon}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • {getFileTypeInfo(file.name).type.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700 font-medium mb-1">📋 Formatos Soportados:</p>
                  <div className="grid grid-cols-2 gap-1 text-xs text-blue-600">
                    <span>📄 Word (.doc, .docx)</span>
                    <span>📕 PDF (.pdf)</span>
                    <span>🖼️ Imágenes (.png, .jpg)</span>
                    <span>📏 Máximo 20 MB</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="descripcion" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="p-1 bg-green-100 rounded">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                  Descripción de la Plantilla
                </label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe el tipo de propuesta, servicios incluidos, características especiales..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                />
                <div className="text-xs text-gray-500">{description.length}/500 caracteres</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-700 mb-1">Estado del Formulario:</div>
                <div className="text-xs text-gray-600">
                  {!file && !description.trim() && "⚠️ Selecciona un archivo y agrega una descripción"}
                  {file && !description.trim() && "⚠️ Agrega una descripción para continuar"}
                  {!file && description.trim() && "⚠️ Selecciona un archivo para continuar"}
                  {canSave && !isUploading && "✅ Listo para guardar la plantilla"}
                  {isUploading && "⏳ Subiendo documento..."}
                </div>
              </div>
              <Button
                type="submit"
                disabled={!canSave || isUploading}
                className={`px-6 py-2 font-semibold transition-all duration-300 ${
                  canSave && !isUploading
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Subiendo Plantilla...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Guardar Plantilla
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <CardTitle className="text-xl font-semibold text-gray-800">Plantillas Guardadas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Documento</TableHead>
                  <TableHead className="font-semibold text-gray-700">Fecha</TableHead>
                  <TableHead className="font-semibold text-gray-700">Descripción</TableHead>
                  <TableHead className="font-semibold text-gray-700 w-[120px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-gray-100 rounded-full">
                          <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No hay plantillas guardadas</p>
                        <p className="text-sm text-gray-400">Sube tu primera plantilla de propuesta</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((it) => {
                    const fileInfo = getFileTypeInfo(it.filename)
                    return (
                      <TableRow key={it.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <TableCell>
                          <a
                            href={it.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          >
                            <div className={`p-2 ${fileInfo.color} rounded-lg text-white text-xs font-bold`}>
                              {fileInfo.type.toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium">{it.filename}</div>
                              <div className="text-xs text-gray-500">{(it.size / 1024 / 1024).toFixed(2)} MB</div>
                            </div>
                          </a>
                        </TableCell>
                        <TableCell className="text-gray-600">{formatDateTimeEs(it.createdAt)}</TableCell>
                        <TableCell className="max-w-[400px]">
                          <div className="line-clamp-3 whitespace-pre-wrap text-gray-700">{it.description}</div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Eliminar propuesta"
                            onClick={() => removeItem(it.id)}
                            title="Eliminar"
                            className="hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
