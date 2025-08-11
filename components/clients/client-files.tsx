"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UploadCloud, FileText } from "lucide-react"

type FileMeta = {
  id: string
  name: string
  size: number
  at: number // timestamp (ms)
  description?: string
}

type Props = {
  clientId?: string
}

function formatDateEs(timestamp: number) {
  const d = new Date(timestamp)
  // dd/MM/yyyy HH:mm (24h) en español
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d)
}

export function ClientFiles({ clientId = "1" }: Props) {
  const storageKey = useMemo(() => `client:${clientId}:files`, [clientId])
  const [files, setFiles] = useState<FileMeta[]>([])
  const addInputRef = useRef<HTMLInputElement | null>(null)

  // Cargar desde localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) setFiles(JSON.parse(raw))
    } catch {}
  }, [storageKey])

  // Persistir en localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(files))
  }, [storageKey, files])

  // Subir NUEVO documento
  function onAddFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const meta: FileMeta = {
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      at: Date.now(),
      description: "",
    }
    setFiles((prev) => [meta, ...prev])
    e.currentTarget.value = ""
  }

  // Reemplazar archivo de una fila existente (actualiza nombre, tamaño y fecha)
  function onReplaceFile(id: string, e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: f.name, size: f.size, at: Date.now() } : item)),
    )
    e.currentTarget.value = ""
  }

  // Editar descripción
  function onChangeDescription(id: string, value: string) {
    setFiles((prev) => prev.map((item) => (item.id === id ? { ...item, description: value } : item)))
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <CardTitle>Archivos del cliente</CardTitle>

        <div className="flex items-center gap-2">
          <input ref={addInputRef} type="file" className="hidden" onChange={onAddFile} />
          <Button
            type="button"
            variant="default"
            onClick={() => addInputRef.current?.click()}
            className="gap-2"
            title="Subir nuevo documento"
          >
            <UploadCloud className="h-4 w-4" />
            Subir Documento
          </Button>
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[220px]">Archivo</TableHead>
              <TableHead className="min-w-[160px]">Fecha</TableHead>
              <TableHead className="min-w-[160px]">Subir Documento</TableHead>
              <TableHead className="min-w-[260px]">Descripción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-sm text-gray-500">
                  No hay archivos. Usa “Subir Documento” para agregar uno nuevo.
                </TableCell>
              </TableRow>
            )}

            {files.map((file) => {
              const replaceInputId = `replace-input-${file.id}`
              return (
                <TableRow key={file.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <div className="flex flex-col">
                        <span className="font-medium">{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm">{formatDateEs(file.at)}</span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <input
                        id={replaceInputId}
                        type="file"
                        className="hidden"
                        onChange={(e) => onReplaceFile(file.id, e)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2 bg-transparent"
                        onClick={() => document.getElementById(replaceInputId)?.click()}
                        title="Reemplazar archivo"
                      >
                        <UploadCloud className="h-4 w-4" />
                        Reemplazar
                      </Button>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Input
                      value={file.description ?? ""}
                      onChange={(e) => onChangeDescription(file.id, e.currentTarget.value)}
                      placeholder="Añade una descripción del documento"
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default ClientFiles
