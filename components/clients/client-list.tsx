"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import type { Client } from "@/app/clientes/queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

type Props = {
  clients: Client[]
}

function normalize(text: string | null | undefined) {
  return (text ?? "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

export default function ClientList({ clients }: Props) {
  const [nameQ, setNameQ] = useState("")
  const [companyQ, setCompanyQ] = useState("")
  const [titleQ, setTitleQ] = useState("")
  const [emailQ, setEmailQ] = useState("")
  const [statusQ, setStatusQ] = useState<string>("all")
  const [isPending, startTransition] = useTransition()

  const filtered = useMemo(() => {
    const n = normalize(nameQ)
    const co = normalize(companyQ)
    const ti = normalize(titleQ)
    const em = normalize(emailQ)
    const st = statusQ

    return clients.filter((c) => {
      const okName = !n || normalize(c.name).includes(n)
      const okCompany = !co || normalize(c.company).includes(co)
      const okTitle = !ti || normalize(c.title).includes(ti)
      const okEmail = !em || normalize(c.email).includes(em)
      const okStatus = st === "all" || normalize(c.status).includes(normalize(st))
      return okName && okCompany && okTitle && okEmail && okStatus
    })
  }, [clients, nameQ, companyQ, titleQ, emailQ, statusQ])

  function clearFilters() {
    startTransition(() => {
      setNameQ("")
      setCompanyQ("")
      setTitleQ("")
      setEmailQ("")
      setStatusQ("all")
    })
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between space-y-0">
        <CardTitle>Listado</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={clearFilters} aria-label="Limpiar filtros">
            <X className="h-4 w-4 mr-1" /> Limpiar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[180px]">Nombre</TableHead>
                <TableHead className="min-w-[160px]">Empresa</TableHead>
                <TableHead className="min-w-[160px]">Cargo</TableHead>
                <TableHead className="min-w-[200px]">Email</TableHead>
                <TableHead className="min-w-[120px]">Status</TableHead>
              </TableRow>
              <TableRow>
                <TableHead>
                  <Input
                    value={nameQ}
                    onChange={(e) => setNameQ(e.target.value)}
                    placeholder="Buscar nombre..."
                    className="h-8"
                    aria-label="Buscar por nombre"
                  />
                </TableHead>
                <TableHead>
                  <Input
                    value={companyQ}
                    onChange={(e) => setCompanyQ(e.target.value)}
                    placeholder="Empresa..."
                    className="h-8"
                    aria-label="Buscar por empresa"
                  />
                </TableHead>
                <TableHead>
                  <Input
                    value={titleQ}
                    onChange={(e) => setTitleQ(e.target.value)}
                    placeholder="Cargo..."
                    className="h-8"
                    aria-label="Buscar por cargo"
                  />
                </TableHead>
                <TableHead>
                  <Input
                    type="email"
                    value={emailQ}
                    onChange={(e) => setEmailQ(e.target.value)}
                    placeholder="Email..."
                    className="h-8"
                    aria-label="Buscar por email"
                  />
                </TableHead>
                <TableHead>
                  <Select value={statusQ} onValueChange={setStatusQ}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody aria-busy={isPending}>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">
                    <Link href={`/clientes/${c.id}`} className="text-blue-600 hover:underline">
                      {c.name}
                    </Link>
                  </TableCell>
                  <TableCell>{c.company ?? "—"}</TableCell>
                  <TableCell>{c.title ?? "—"}</TableCell>
                  <TableCell>{c.email ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{c.status ?? "Activo"}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-gray-500 py-6">
                    No se encontraron clientes con los filtros actuales.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
