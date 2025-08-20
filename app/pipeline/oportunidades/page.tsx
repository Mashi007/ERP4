"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Plus,
  DollarSign,
  TrendingUp,
  User,
  Building,
  Mail,
  Phone,
  Edit,
  Save,
  X,
  Briefcase,
} from "lucide-react"
import { createOpportunityWithContact, updateOpportunity, deleteOpportunity, updateDealStage } from "../actions"
import { toast } from "@/hooks/use-toast"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import ProposalTable from "@/components/pipeline/proposal-table"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  loadDealsFromStorage,
  mergeUniqueById,
  publishNewOpportunity,
  upsertDealToStorage,
  type PipelineDeal,
} from "@/lib/pipeline-sync"
import { formatEUR } from "@/lib/currency"
import { useCurrency } from "@/components/providers/currency-provider"
import { cn } from "@/lib/utils"
import type { Contact } from "@/lib/database"
import { formatDateEs } from "@/lib/date"

interface Deal {
  id: number
  title: string
  company: string
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  value: number
  stage: string
  probability: number
  expected_close_date: string | null
  notes: string | null
  contact_id?: number
  lead_source?: string
  industry?: string
  company_size?: string
  budget_range?: string
  decision_timeline?: string
  pain_points?: string
  competitors?: string
  next_steps?: string
  responsible_user_id?: string
}

function toPipelineDeal(d: Deal): PipelineDeal {
  return {
    id: d.id,
    title: d.title,
    company: d.company,
    value: d.value,
    stage: d.stage || "Nuevo",
    probability: d.probability,
    expected_close_date: d.expected_close_date,
    notes: d.notes,
    contact_name: d.contact_name,
    contact_email: d.contact_email,
    contact_phone: d.contact_phone,
    contact_id: d.contact_id,
    lead_source: d.lead_source,
    industry: d.industry,
    company_size: d.company_size,
    budget_range: d.budget_range,
    decision_timeline: d.decision_timeline,
    pain_points: d.pain_points,
    competitors: d.competitors,
    next_steps: d.next_steps,
  }
}

function initials(name?: string) {
  if (!name) return "?"
  const parts = name.trim().split(" ")
  const a = parts[0]?.[0] ?? ""
  const b = parts[1]?.[0] ?? ""
  return (a + b).toUpperCase()
}

export default function OportunidadesPage() {
  const [formFields, setFormFields] = useState<any[]>([])
  const [isLoadingFields, setIsLoadingFields] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [detailDeal, setDetailDeal] = useState<Deal | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [detailStage, setDetailStage] = useState<string | null>(null)

  // Contact search state for "Crear Nueva Oportunidad"
  const [contactQuery, setContactQuery] = useState("")
  const [contactResults, setContactResults] = useState<Contact[]>([])
  const [contactOpen, setContactOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const contactSearchRef = useRef<HTMLDivElement | null>(null)
  const contactAbort = useRef<AbortController | null>(null)

  const { code } = useCurrency()
  const currencySymbol = code === "EUR" ? "€" : "$"

  function openDetail(deal: Deal) {
    setDetailDeal(deal)
    setDetailStage(deal.stage)
    setIsDetailOpen(true)
  }
  function closeDetail() {
    setIsDetailOpen(false)
    setTimeout(() => {
      setDetailDeal(null)
      setDetailStage(null)
    }, 200)
  }

  const [deals, setDeals] = useState<Deal[]>([
    {
      id: 1,
      title: "Renovación ECorp",
      company: "E Corp",
      contact_name: "Johnny Appleseed",
      contact_email: "johnny.appleseed@jetpropulsion.com",
      contact_phone: "+ Click to add",
      value: 4000.0,
      stage: "Nuevo",
      probability: 25,
      expected_close_date: "2024-08-15",
      notes: "Cliente muy interesado, esperando aprobación del presupuesto",
      contact_id: 1,
      lead_source: "Referido",
      industry: "Tecnología",
      company_size: "201-1000",
      budget_range: "$1,000 - $5,000",
      decision_timeline: "1-3 meses",
      pain_points: "Sistema actual obsoleto, necesitan modernización",
      competitors: "Salesforce, HubSpot",
      next_steps: "Enviar propuesta detallada la próxima semana",
    },
    {
      id: 2,
      title: "Implementación Widgetz.io",
      company: "Widgetz.io",
      contact_name: "Jane Sampleton",
      contact_email: "janesampleton@gmail.com",
      contact_phone: "+19266529503",
      value: 5600.0,
      stage: "Nuevo",
      probability: 30,
      expected_close_date: "2024-10-15",
      notes: "CRM - Plan Oro, necesidades específicas de integración",
      contact_id: 3,
      lead_source: "Website",
      industry: "Software",
      company_size: "51-200",
      budget_range: "$5,000 - $25,000",
      decision_timeline: "3-6 meses",
      pain_points: "Crecimiento rápido, necesitan escalabilidad",
      competitors: "Pipedrive, Zoho",
      next_steps: "Programar demo técnica con equipo de desarrollo",
    },
    {
      id: 3,
      title: "Consultoría Acme Inc",
      company: "Acme Inc",
      contact_name: "Spector Calista",
      contact_email: "spectorcalista@gmail.com",
      contact_phone: "+19266520001",
      value: 100.0,
      stage: "Calificación",
      probability: 15,
      expected_close_date: "2024-08-30",
      notes: "Startup pequeña, presupuesto limitado",
      contact_id: 2,
      lead_source: "Redes Sociales",
      industry: "Startup",
      company_size: "1-10",
      budget_range: "< $1,000",
      decision_timeline: "Inmediato",
      pain_points: "Presupuesto muy ajustado, buscan solución económica",
      competitors: "Herramientas gratuitas",
      next_steps: "Evaluar opciones de plan básico",
    },
    {
      id: 4,
      title: "Desarrollo Synth Corp",
      company: "Synth Corp",
      contact_name: "Syed Kareem",
      contact_email: "syedkareem@gmail.com",
      contact_phone: "+447456123456",
      value: 4100.0,
      stage: "Calificación",
      probability: 40,
      expected_close_date: "2024-08-20",
      notes: "Proyecto anual de desarrollo",
      contact_id: 7,
      lead_source: "Evento",
      industry: "Manufactura",
      company_size: "51-200",
      budget_range: "$1,000 - $5,000",
      decision_timeline: "1-3 meses",
      pain_points: "Procesos manuales ineficientes",
      competitors: "SAP, Oracle",
      next_steps: "Realizar análisis de procesos actuales",
    },
    {
      id: 5,
      title: "Soporte Técnico Techcave",
      company: "Techcave",
      contact_name: "Spector Calista",
      contact_email: "spectorcalista@gmail.com",
      contact_phone: "+19266520001",
      value: 3200.0,
      stage: "Negociación",
      probability: 75,
      expected_close_date: "2024-08-10",
      notes: "CRM - Plan Oro, renovación de contrato",
      contact_id: 2,
      lead_source: "Cliente Existente",
      industry: "Tecnología",
      company_size: "11-50",
      budget_range: "$1,000 - $5,000",
      decision_timeline: "Inmediato",
      pain_points: "Satisfechos con servicio actual, quieren expandir",
      competitors: "Ninguno identificado",
      next_steps: "Finalizar términos de renovación",
    },
    {
      id: 6,
      title: "Renovación Techcave",
      company: "Techcave",
      contact_name: "Spector Calista",
      contact_email: "spectorcalista@gmail.com",
      contact_phone: "+19266520001",
      value: 3000.0,
      stage: "Ganado",
      probability: 100,
      expected_close_date: "2024-08-10",
      notes: "CRM - Platinum, contrato cerrado",
      contact_id: 2,
      lead_source: "Cliente Existente",
      industry: "Tecnología",
      company_size: "11-50",
      budget_range: "$1,000 - $5,000",
      decision_timeline: "Inmediato",
      pain_points: "Upgrade a plan premium por crecimiento",
      competitors: "N/A",
      next_steps: "Implementar nuevas funcionalidades",
    },
    {
      id: 7,
      title: "Consultoría Optiscape",
      company: "Optiscape Inc",
      contact_name: "Martha Jackson",
      contact_email: "marthajackson@gmail.com",
      contact_phone: "+19266091164",
      value: 2100.0,
      stage: "Ganado",
      probability: 100,
      expected_close_date: "2024-08-05",
      notes: "Sin productos adicionales",
      contact_id: 5,
      lead_source: "Referido",
      industry: "Consultoría",
      company_size: "51-200",
      budget_range: "$1,000 - $5,000",
      decision_timeline: "Inmediato",
      pain_points: "Optimización de procesos de ventas",
      competitors: "N/A",
      next_steps: "Comenzar implementación",
    },
    {
      id: 8,
      title: "Marketing Digital Apex IQ",
      company: "Apex IQ",
      contact_name: "Kevin Jordan",
      contact_email: "kevinjordan@gmail.com",
      contact_phone: "+15898899911",
      value: 4200.0,
      stage: "Ganado",
      probability: 100,
      expected_close_date: "2024-07-15",
      notes: "CRM - Premium, proyecto completado",
      contact_id: 6,
      lead_source: "Email Marketing",
      industry: "Marketing",
      company_size: "51-200",
      budget_range: "$1,000 - $5,000",
      decision_timeline: "Inmediato",
      pain_points: "Integración con herramientas de marketing",
      competitors: "N/A",
      next_steps: "Proyecto completado exitosamente",
    },
    {
      id: 9,
      title: "Soluciones Globales",
      company: "Global Learning Solutions",
      contact_name: "Emily Dean",
      contact_email: "emily.dean@globallearning.com",
      contact_phone: "+ Click to add",
      value: 3000.0,
      stage: "Ganado",
      probability: 100,
      expected_close_date: "2024-06-20",
      notes: "Contrato anual firmado",
      contact_id: 4,
      lead_source: "Llamada Fría",
      industry: "Educación",
      company_size: "201-1000",
      budget_range: "$1,000 - $5,000",
      decision_timeline: "Inmediato",
      pain_points: "Gestión de estudiantes y cursos",
      competitors: "N/A",
      next_steps: "Renovación automática configurada",
    },
  ])

  const [newOpportunity, setNewOpportunity] = useState({
    title: "",
    value: "",
    stage: "Nuevo",
    probability: "25",
    expected_close_date: "",
    notes: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    company: "",
    job_title: "",
    contact_notes: "",
    lead_source: "",
    industry: "",
    company_size: "",
    budget_range: "",
    decision_timeline: "",
    pain_points: "",
    competitors: "",
    next_steps: "",
    responsible_user_id: "",
  })

  const stages = ["Nuevo", "Calificación", "Propuesta", "Negociación", "Cierre", "Ganado", "Perdido"]
  const leadSources = [
    "Website",
    "Referido",
    "Redes Sociales",
    "Email Marketing",
    "Evento",
    "Llamada Fría",
    "Cliente Existente",
    "Otro",
  ]
  const companySizes = ["1-10", "11-50", "51-200", "201-1000", "1000+"]
  const budgetRanges = ["< $1,000", "$1,000 - $5,000", "$5,000 - $25,000", "$25,000 - $100,000", "$100,000+"]
  const decisionTimelines = ["Inmediato", "1-3 meses", "3-6 meses", "6-12 meses", "12+ meses"]

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Ganado":
        return "bg-green-100 text-green-800"
      case "Cierre":
        return "bg-blue-100 text-blue-800"
      case "Negociación":
        return "bg-purple-100 text-purple-800"
      case "Propuesta":
        return "bg-yellow-100 text-yellow-800"
      case "Calificación":
        return "bg-orange-100 text-orange-800"
      case "Nuevo":
        return "bg-gray-100 text-gray-800"
      case "Perdido":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredDeals = deals.filter(
    (deal) =>
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (deal.contact_name && deal.contact_name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  useEffect(() => {
    const loadUsers = async () => {
      try {
        console.log("[v0] Loading users for opportunities...")
        const response = await fetch("/api/users")
        const data = await response.json()
        console.log("[v0] Users API response:", data)

        // Handle direct array response from users API
        if (Array.isArray(data)) {
          setUsers(data)
          console.log("[v0] Users loaded successfully:", data.length)
        } else if (data.success && data.users) {
          // Fallback for success/users format
          setUsers(data.users)
          console.log("[v0] Users loaded successfully:", data.users.length)
        } else {
          console.error("[v0] Failed to load users:", data.error || "Invalid response format")
          // Set empty array as fallback
          setUsers([])
        }
      } catch (error) {
        console.error("Error loading users:", error)
        setUsers([]) // Set empty array on error
      } finally {
        setIsLoadingUsers(false)
      }
    }

    loadUsers()
  }, [])

  useEffect(() => {
    const loadFormFields = async () => {
      try {
        const response = await fetch("/api/settings/opportunities/active-fields")
        const data = await response.json()
        if (data.success) {
          setFormFields(data.fields)
        }
      } catch (error) {
        console.error("Error loading form fields:", error)
      } finally {
        setIsLoadingFields(false)
      }
    }

    loadFormFields()
  }, [])

  useEffect(() => {
    const handler = setTimeout(async () => {
      const q = contactQuery.trim()
      if (q.length < 2) {
        setContactResults([])
        return
      }
      try {
        if (contactAbort.current) contactAbort.current.abort()
        contactAbort.current = new AbortController()

        const res = await fetch(`/api/clients?search=${encodeURIComponent(q)}`, {
          signal: contactAbort.current.signal,
        })
        const data = await res.json()

        // Transform clients data to match Contact interface
        const transformedResults = (data.clients || []).map((client: any) => ({
          id: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone,
          company: client.company || client.empresa,
          job_title: client.position || client.cargo,
          address: client.address || client.direccion,
          city: client.city || client.ciudad,
          country: client.country || client.pais,
          notes: client.notes || client.notas,
          avatar_url: null,
        }))

        setContactResults(transformedResults)
        setContactOpen(true)
      } catch (e) {
        if ((e as any).name !== "AbortError") {
          console.error("Search clients failed", e)
        }
      }
    }, 250)
    return () => clearTimeout(handler)
  }, [contactQuery])

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!contactSearchRef.current) return
      if (!contactSearchRef.current.contains(e.target as Node)) {
        setContactOpen(false)
      }
    }
    if (contactOpen) {
      document.addEventListener("mousedown", onClickOutside)
    }
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [contactOpen])

  const handleSelectContact = (c: Contact) => {
    setSelectedContact(c)
    setNewOpportunity((prev) => ({
      ...prev,
      contact_name: c.name || "",
      contact_email: c.email || "",
      contact_phone: c.phone || "",
      company: c.company || "",
      job_title: c.job_title || "",
      // Additional fields from clients database
      contact_address: c.address || "",
      contact_city: c.city || "",
      contact_country: c.country || "",
      notes: prev.notes ? `${prev.notes}\n\nContacto: ${c.notes || ""}` : c.notes || "",
    }))
    setContactQuery(c.name || "")
    setContactOpen(false)

    toast({
      title: "Cliente seleccionado",
      description: `Datos de ${c.name} copiados al formulario`,
    })
  }

  const isFieldVisible = (fieldName: string) => {
    const field = formFields.find((f) => f.name === fieldName)
    return field ? field.visible : true
  }

  const isFieldRequired = (fieldName: string) => {
    const field = formFields.find((f) => f.name === fieldName)
    return field ? field.required : false
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const result = await createOpportunityWithContact(newOpportunity)

      if (result.success) {
        const newDeal: Deal = {
          id: result.deal.id,
          title: result.deal.title,
          company: result.deal.company,
          contact_name: result.contact.name,
          contact_email: result.contact.email,
          contact_phone: result.contact.phone,
          value: result.deal.value,
          stage: result.deal.stage,
          probability: result.deal.probability,
          expected_close_date: result.deal.expected_close_date,
          notes: result.deal.notes,
          contact_id: result.contact.id,
          lead_source: result.deal.lead_source,
          industry: result.deal.industry,
          company_size: result.deal.company_size,
          budget_range: result.deal.budget_range,
          decision_timeline: result.deal.decision_timeline,
          pain_points: result.deal.pain_points,
          competitors: result.deal.competitors,
          next_steps: result.deal.next_steps,
          responsible_user_id: result.deal.responsible_user_id,
        }

        setDeals([newDeal, ...deals])

        const newForPipeline: PipelineDeal = { ...toPipelineDeal(newDeal), stage: "Nuevo" }
        upsertDealToStorage(newForPipeline)
        publishNewOpportunity(newForPipeline)

        // Reset form and contact search UI
        setNewOpportunity({
          title: "",
          value: "",
          stage: "Nuevo",
          probability: "25",
          expected_close_date: "",
          notes: "",
          contact_name: "",
          contact_email: "",
          contact_phone: "",
          company: "",
          job_title: "",
          contact_notes: "",
          lead_source: "",
          industry: "",
          company_size: "",
          budget_range: "",
          decision_timeline: "",
          pain_points: "",
          competitors: "",
          next_steps: "",
          responsible_user_id: "",
        })
        setSelectedContact(null)
        setContactQuery("")
        setContactResults([])
        setContactOpen(false)

        setIsDialogOpen(false)

        toast({
          title: "¡Oportunidad creada exitosamente!",
          description: `Se ha creado la oportunidad "${result.deal.title}" y ${
            result.contactCreated ? "se ha creado" : "se ha vinculado"
          } el contacto "${result.contact.name}". También está disponible en el Embudo de Ventas.`,
        })
      } else {
        toast({
          title: "Error al crear oportunidad",
          description: result.error || "Ha ocurrido un error inesperado.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating opportunity:", error)
      toast({
        title: "Error al crear oportunidad",
        description: "Ha ocurrido un error inesperado.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (deal: Deal) => {
    setEditingDeal(deal)
    setIsEditDialogOpen(true)
  }

  const handleUpdateDeal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDeal) return
    setIsSubmitting(true)
    try {
      const result = await updateOpportunity(editingDeal.id, editingDeal)
      if (result.success) {
        setDeals(deals.map((deal) => (deal.id === editingDeal.id ? { ...editingDeal, ...result.deal } : deal)))
        setIsEditDialogOpen(false)
        setEditingDeal(null)
        toast({
          title: "¡Oportunidad actualizada exitosamente!",
          description: `La oportunidad "${result.deal.title}" ha sido actualizada en todos los módulos.`,
        })
      } else {
        toast({
          title: "Error al actualizar oportunidad",
          description: result.error || "Ha ocurrido un error inesperado.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating opportunity:", error)
      toast({
        title: "Error al actualizar oportunidad",
        description: "Ha ocurrido un error inesperado.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (dealId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta oportunidad?")) return
    try {
      const result = await deleteOpportunity(dealId)
      if (result.success) {
        setDeals(deals.filter((deal) => deal.id !== dealId))
        toast({ title: "Oportunidad eliminada", description: "La oportunidad ha sido eliminada exitosamente." })
      } else {
        toast({
          title: "Error al eliminar oportunidad",
          description: result.error || "Ha ocurrido un error inesperado.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting opportunity:", error)
      toast({
        title: "Error al eliminar oportunidad",
        description: "Ha ocurrido un error inesperado.",
        variant: "destructive",
      })
    }
  }

  async function handleChangeStage(dealId: number, newStage: string) {
    // Optimistic local update
    setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d)))
    setDetailDeal((dd) => (dd && dd.id === dealId ? { ...dd, stage: newStage } : dd))

    const res = await updateDealStage(dealId, newStage)
    if (res?.success && res.deal) {
      setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, ...res.deal } : d)))
      setDetailDeal((dd) => (dd && dd.id === dealId ? { ...dd, ...res.deal } : dd))
      toast({
        title: "Etapa actualizada",
        description: `La oportunidad se movió a "${newStage}".`,
      })
    } else {
      toast({
        title: "No se pudo actualizar la etapa",
        description: res?.error || "Intenta nuevamente.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const stored = loadDealsFromStorage()
    if (stored.length) {
      setDeals((prev) => mergeUniqueById(prev, stored) as any)
    }

    function onNew(e: Event) {
      const ce = e as CustomEvent<{ deal: PipelineDeal }>
      const incoming = ce.detail?.deal
      if (!incoming) return
      setDeals((prev) => {
        const exists = prev.some((p) => p.id === incoming.id)
        const merged: Deal = exists
          ? { ...prev.find((p) => p.id === incoming.id)!, ...incoming }
          : ({ ...incoming } as Deal)
        const next = exists ? prev.map((p) => (p.id === incoming.id ? merged : p)) : [merged, ...prev]
        return next
      })
    }

    window.addEventListener("pipeline:new-opportunity", onNew)
    return () => window.removeEventListener("pipeline:new-opportunity", onNew)
  }, [])

  return (
    <div>
      {/* CTA */}
      <div className="flex justify-end items-center mb-6">
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
              // Reset contact search UI when closing
              setSelectedContact(null)
              setContactQuery("")
              setContactResults([])
              setContactOpen(false)
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Oportunidad
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Oportunidad</DialogTitle>
              <DialogDescription>
                Completa la información de la oportunidad y el contacto. Se sincronizará automáticamente con el Embudo
                de Ventas.
              </DialogDescription>
            </DialogHeader>
            {/* formulario de creación */}
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 py-4">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="h-5 w-5 text-orange-600" />
                    <h3 className="text-lg font-semibold text-orange-800">Responsable Comercial</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="responsible_user" className="text-orange-700 font-medium">
                        Asignar Responsable *
                      </Label>
                      {isLoadingUsers ? (
                        <div className="flex items-center gap-2 p-3 bg-white rounded-md border border-orange-300">
                          <span className="text-sm text-orange-600">Cargando usuarios...</span>
                        </div>
                      ) : (
                        <Select
                          value={newOpportunity.responsible_user_id || ""}
                          onValueChange={(value) => {
                            console.log("[v0] Selected commercial responsible:", value)
                            setNewOpportunity({ ...newOpportunity, responsible_user_id: value })
                          }}
                        >
                          <SelectTrigger className="w-full bg-white border-orange-300 focus:border-orange-500">
                            <SelectValue placeholder="Seleccionar responsable comercial" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.length === 0 ? (
                              <SelectItem value="no-users" disabled>
                                No hay usuarios disponibles
                              </SelectItem>
                            ) : (
                              users.map((user) => (
                                <SelectItem key={user.id} value={user.id.toString()}>
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-3 h-3 rounded-full ${
                                        user.role === "Comercial"
                                          ? "bg-blue-500"
                                          : user.role === "Administrador"
                                            ? "bg-green-500"
                                            : "bg-gray-500"
                                      }`}
                                    ></div>
                                    <div className="flex flex-col">
                                      <span className="font-medium">{user.name}</span>
                                      <span className="text-xs text-gray-500">
                                        {user.role || "Usuario"} • {user.email}
                                      </span>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      )}
                      <p className="text-xs text-orange-700">
                        Esta persona será responsable de gestionar y dar seguimiento a la oportunidad comercial.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Información de la Oportunidad</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Nombre de la Oportunidad *</Label>
                      <Input
                        id="title"
                        value={newOpportunity.title}
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, title: e.target.value })}
                        placeholder="Ej: Renovación de contrato"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="value">{`Valor Estimado (${currencySymbol}) *`}</Label>
                      <Input
                        id="value"
                        type="number"
                        value={newOpportunity.value}
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, value: e.target.value })}
                        placeholder="25000"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stage">Etapa</Label>
                      <Select
                        value={newOpportunity.stage}
                        onValueChange={(value) => setNewOpportunity({ ...newOpportunity, stage: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {stages.map((stage) => (
                            <SelectItem key={stage} value={stage}>
                              {stage}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="probability">Probabilidad (%)</Label>
                      <Input
                        id="probability"
                        type="number"
                        min="0"
                        max="100"
                        value={newOpportunity.probability}
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, probability: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expected_close_date">Cierre Esperado</Label>
                      <Input
                        id="expected_close_date"
                        type="date"
                        value={newOpportunity.expected_close_date}
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, expected_close_date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas de la Oportunidad</Label>
                    <Textarea
                      id="notes"
                      value={newOpportunity.notes}
                      onChange={(e) => setNewOpportunity({ ...newOpportunity, notes: e.target.value })}
                      placeholder="Detalles adicionales sobre la oportunidad..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Información del Contacto con búsqueda vinculada a Contactos */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold">Información del Contacto</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Campo con búsqueda de Contactos */}
                    <div className="space-y-2" ref={contactSearchRef}>
                      <Label htmlFor="contact_name">Nombre del Contacto *</Label>
                      <div className="relative">
                        <Input
                          id="contact_name"
                          value={contactQuery}
                          onChange={(e) => {
                            setContactQuery(e.target.value)
                            setNewOpportunity({ ...newOpportunity, contact_name: e.target.value })
                          }}
                          onFocus={() => contactResults.length > 0 && setContactOpen(true)}
                          placeholder="Escribe para buscar..."
                          required
                          autoComplete="off"
                        />
                        {selectedContact && (
                          <button
                            type="button"
                            aria-label="Limpiar contacto seleccionado"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => {
                              setSelectedContact(null)
                              setContactQuery("")
                              setNewOpportunity((p) => ({
                                ...p,
                                contact_name: "",
                                contact_email: "",
                                contact_phone: "",
                                company: "",
                                job_title: "",
                              }))
                              setContactOpen(false)
                              setContactResults([])
                            }}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        {contactOpen && contactResults.length > 0 && (
                          <div
                            className={cn(
                              "absolute left-0 right-0 top-full mt-1 z-50",
                              "rounded-md border bg-white shadow-md",
                              "max-h-60 overflow-y-auto overflow-x-hidden",
                            )}
                            role="listbox"
                            aria-label="Resultados de contactos"
                          >
                            {contactResults.map((c) => (
                              <button
                                type="button"
                                key={c.id}
                                onClick={() => handleSelectContact(c)}
                                className="w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-50 text-left"
                              >
                                <Avatar className="h-7 w-7">
                                  <AvatarImage src={c.avatar_url || ""} alt={c.name || "Contacto"} />
                                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                    {(c.name || "C").charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm truncate">{c.name}</div>
                                  <div className="text-xs text-gray-500 truncate">
                                    {c.email}
                                    {c.company && ` • ${c.company}`}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_email">Email *</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={newOpportunity.contact_email}
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, contact_email: e.target.value })}
                        placeholder="juan.perez@empresa.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact_phone">Teléfono</Label>
                      <Input
                        id="contact_phone"
                        value={newOpportunity.contact_phone}
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, contact_phone: e.target.value })}
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="job_title">Cargo</Label>
                      <Input
                        id="job_title"
                        value={newOpportunity.job_title}
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, job_title: e.target.value })}
                        placeholder="Director de Tecnología"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa *</Label>
                    <Input
                      id="company"
                      value={newOpportunity.company}
                      onChange={(e) => setNewOpportunity({ ...newOpportunity, company: e.target.value })}
                      placeholder="Nombre de la empresa"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold">Información Adicional</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lead_source">Fuente del Lead</Label>
                      <Select
                        value={newOpportunity.lead_source}
                        onChange={(e) =>
                          setNewOpportunity({ ...newOpportunity, lead_source: (e.target as HTMLSelectElement).value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar fuente" />
                        </SelectTrigger>
                        <SelectContent>
                          {leadSources.map((source) => (
                            <SelectItem key={source} value={source}>
                              {source}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industria</Label>
                      <Input
                        id="industry"
                        value={newOpportunity.industry}
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, industry: e.target.value })}
                        placeholder="Tecnología, Salud, Finanzas..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company_size">Tamaño de Empresa</Label>
                      <Select
                        value={newOpportunity.company_size}
                        onChange={(e) =>
                          setNewOpportunity({ ...newOpportunity, company_size: (e.target as HTMLSelectElement).value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tamaño" />
                        </SelectTrigger>
                        <SelectContent>
                          {companySizes.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size} empleados
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget_range">Rango de Presupuesto</Label>
                      <Select
                        value={newOpportunity.budget_range}
                        onChange={(e) =>
                          setNewOpportunity({ ...newOpportunity, budget_range: (e.target as HTMLSelectElement).value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar rango" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgetRanges.map((range) => (
                            <SelectItem key={range} value={range}>
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="decision_timeline">Timeline de Decisión</Label>
                    <Select
                      value={newOpportunity.decision_timeline}
                      onChange={(e) =>
                        setNewOpportunity({
                          ...newOpportunity,
                          decision_timeline: (e.target as HTMLSelectElement).value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="¿Cuándo planean decidir?" />
                      </SelectTrigger>
                      <SelectContent>
                        {decisionTimelines.map((timeline) => (
                          <SelectItem key={timeline} value={timeline}>
                            {timeline}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pain_points">Puntos de Dolor</Label>
                    <Textarea
                      id="pain_points"
                      value={newOpportunity.pain_points}
                      onChange={(e) => setNewOpportunity({ ...newOpportunity, pain_points: e.target.value })}
                      placeholder="¿Qué problemas están tratando de resolver?"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="competitors">Competidores</Label>
                    <Input
                      id="competitors"
                      value={newOpportunity.competitors}
                      onChange={(e) => setNewOpportunity({ ...newOpportunity, competitors: e.target.value })}
                      placeholder="¿Qué otras soluciones están considerando?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="next_steps">Próximos Pasos</Label>
                    <Textarea
                      id="next_steps"
                      value={newOpportunity.next_steps}
                      onChange={(e) => setNewOpportunity({ ...newOpportunity, next_steps: e.target.value })}
                      placeholder="¿Cuáles son los próximos pasos acordados?"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creando..." : "Crear Oportunidad"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar oportunidades por título, empresa o contacto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDeals.map((deal) => (
          <Card
            key={deal.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onDoubleClick={() => openDetail(deal)}
            onKeyDown={(e) => {
              if (e.key === "Enter") openDetail(deal)
            }}
            tabIndex={0}
            title="Doble clic para ver detalle"
            role="button"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{deal.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    {deal.company}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStageColor(deal.stage)}>{deal.stage}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => setEditingDeal(deal)} className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deal.contact_name && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">{deal.contact_name}</span>
                  </div>
                )}
                {deal.contact_email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>{deal.contact_email}</span>
                  </div>
                )}
                {deal.contact_phone && deal.contact_phone !== "+ Click to add" && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{deal.contact_phone}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Valor:</span>
                  <span className="text-lg font-bold text-green-600">{formatEUR(deal.value)}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Probabilidad:</span>
                    <span className="text-sm font-medium">{deal.probability}%</span>
                  </div>
                  <Progress value={deal.probability} className="h-2" />
                </div>
                {deal.expected_close_date && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cierre esperado:</span>
                    <span className="text-sm">{formatDateEs(deal.expected_close_date)}</span>
                  </div>
                )}
                {deal.lead_source && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Fuente:</span>
                    <span className="text-sm">{deal.lead_source}</span>
                  </div>
                )}
                {deal.notes && <p className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">{deal.notes}</p>}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Responsable comercial:</span>
                    <span className="text-sm font-medium text-gray-700">
                      {deal.responsible_user_id
                        ? users.find((u) => u.id === deal.responsible_user_id)?.name || "Usuario no encontrado"
                        : "No asignado"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDeals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron oportunidades que coincidan con tu búsqueda.</p>
        </div>
      )}

      {/* Detail Sheet */}
      <Sheet
        open={isDetailOpen}
        onOpenChange={(open) => {
          setIsDetailOpen(open)
          if (!open) closeDetail()
        }}
      >
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="sticky top-0 z-10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
            <div className="flex items-start justify-between py-3">
              <div className="min-w-0">
                <SheetTitle className="truncate">{detailDeal?.title || "Detalle de oportunidad"}</SheetTitle>
                {detailDeal?.company ? (
                  <SheetDescription className="mt-0.5 flex items-center gap-2">
                    <Building className="h-3.5 w-3.5" />
                    <span className="truncate">{detailDeal.company}</span>
                    {detailDeal?.stage && (
                      <Badge className={`ml-1 ${getStageColor(detailDeal.stage)}`}>{detailDeal.stage}</Badge>
                    )}
                  </SheetDescription>
                ) : (
                  <SheetDescription>Información de la oportunidad</SheetDescription>
                )}
              </div>
              {detailDeal && (
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Valor</div>
                  <div className="text-lg font-semibold text-green-600">{formatEUR(detailDeal.value)}</div>
                </div>
              )}
            </div>
          </SheetHeader>

          {detailDeal && (
            <div className="mt-4 space-y-6">
              {/* Controles superiores: Etapa editable */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-md border bg-white p-3 sm:col-span-2">
                  <div className="text-xs text-muted-foreground">Título</div>
                  <div className="text-sm font-semibold">{detailDeal.title}</div>
                </div>
                <div className="rounded-md border bg-white p-3">
                  <div className="text-xs text-muted-foreground mb-1">Etapa</div>
                  <Select
                    value={detailStage ?? detailDeal.stage}
                    onValueChange={(v) => {
                      setDetailStage(v)
                      if (detailDeal) {
                        void handleChangeStage(detailDeal.id, v)
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona etapa" />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((s) => (
                        <SelectItem value={s} key={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-md border bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 p-4">
                  <div className="mb-3 text-sm font-medium text-orange-700 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Responsable Comercial
                  </div>
                  {detailDeal.responsible_user_id ? (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <div className="min-w-0">
                        <div className="font-medium text-orange-800">
                          {users.find((u) => u.id.toString() === detailDeal.responsible_user_id?.toString())?.name ||
                            "Usuario no encontrado"}
                        </div>
                        <div className="text-sm text-orange-600">
                          {users.find((u) => u.id.toString() === detailDeal.responsible_user_id?.toString())?.role ||
                            "Comercial"}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-orange-600">No asignado</div>
                  )}
                </div>

                <div className="rounded-md border bg-white p-4">
                  <div className="mb-3 text-sm font-medium text-muted-foreground">Probabilidad</div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avance</span>
                    <span className="font-medium">{detailDeal.probability}%</span>
                  </div>
                  <Progress value={detailDeal.probability} className="h-2 mt-2" />
                  <Separator className="my-4" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fuente</span>
                      <span className="font-medium">{detailDeal.lead_source || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Industria</span>
                      <span className="font-medium">{detailDeal.industry || "—"}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border bg-white p-4">
                  <div className="mb-3 text-sm font-medium text-muted-foreground">Contacto</div>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{initials(detailDeal.contact_name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="font-medium">{detailDeal.contact_name || "—"}</div>
                      <div className="text-sm text-muted-foreground">{detailDeal.company}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground inline-flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email
                      </span>
                      {detailDeal.contact_email ? (
                        <a
                          className="font-medium text-primary underline-offset-2 hover:underline break-all"
                          href={`mailto:${detailDeal.contact_email}`}
                        >
                          {detailDeal.contact_email}
                        </a>
                      ) : (
                        <span className="font-medium">—</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground inline-flex items-center gap-2">
                        <Phone className="h-4 w-4" /> Teléfono
                      </span>
                      {detailDeal.contact_phone && detailDeal.contact_phone !== "+ Click to add" ? (
                        <a
                          className="font-medium text-primary underline-offset-2 hover:underline"
                          href={`tel:${detailDeal.contact_phone.replace(/\s+/g, "")}`}
                        >
                          {detailDeal.contact_phone}
                        </a>
                      ) : (
                        <span className="font-medium">—</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notas */}
              {detailDeal.notes && (
                <div className="rounded-md border bg-white">
                  <div className="px-4 pt-3 text-sm font-medium text-muted-foreground">Notas</div>
                  <div className="px-4 pb-4">
                    <div className="text-sm bg-gray-50 p-3 rounded">{detailDeal.notes}</div>
                  </div>
                </div>
              )}

              {/* Próximos pasos */}
              {detailDeal.next_steps && (
                <div className="rounded-md border bg-white">
                  <div className="px-4 pt-3 text-sm font-medium text-muted-foreground">Próximos pasos</div>
                  <div className="px-4 pb-4">
                    <div className="text-sm bg-gray-50 p-3 rounded">{detailDeal.next_steps}</div>
                  </div>
                </div>
              )}

              {/* Propuesta y acciones */}
              <div className="border rounded-md bg-white p-4">
                <h3 className="text-sm font-semibold mb-3">Propuesta y acciones</h3>
                <ProposalTable
                  deal={{
                    id: detailDeal.id,
                    title: detailDeal.title,
                    contact_email: detailDeal.contact_email,
                    contact_id: detailDeal.contact_id,
                    company: detailDeal.company,
                  }}
                />
              </div>

              <SheetFooter className="flex gap-2">
                <Button variant="outline" onClick={closeDetail}>
                  Cerrar
                </Button>
                <Button
                  onClick={() => {
                    setIsDetailOpen(false)
                    setIsEditDialogOpen(true)
                    setEditingDeal(detailDeal)
                  }}
                >
                  Editar
                </Button>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Editar */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Oportunidad</DialogTitle>
            <DialogDescription>
              Modifica la información de la oportunidad. El cambio de Etapa se guarda automáticamente.
            </DialogDescription>
          </DialogHeader>
          {editingDeal && (
            <form onSubmit={handleUpdateDeal}>
              <div className="grid gap-6 py-4">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="h-5 w-5 text-orange-600" />
                    <h3 className="text-lg font-semibold text-orange-800">Responsable Comercial</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="edit_responsible_user" className="text-orange-700 font-medium">
                        Asignar Responsable *
                      </Label>
                      {isLoadingUsers ? (
                        <div className="flex items-center gap-2 p-3 bg-white rounded-md border border-orange-300">
                          <span className="text-sm text-orange-600">Cargando usuarios...</span>
                        </div>
                      ) : (
                        <Select
                          value={editingDeal?.responsible_user_id?.toString() || ""}
                          onValueChange={(value) => {
                            console.log("[v0] Updated commercial responsible:", value)
                            if (editingDeal) {
                              setEditingDeal({ ...editingDeal, responsible_user_id: value })
                            }
                          }}
                        >
                          <SelectTrigger className="w-full bg-white border-orange-300 focus:border-orange-500">
                            <SelectValue placeholder="Seleccionar responsable comercial" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.length === 0 ? (
                              <SelectItem value="no-users" disabled>
                                No hay usuarios disponibles
                              </SelectItem>
                            ) : (
                              users.map((user) => (
                                <SelectItem key={user.id} value={user.id.toString()}>
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-3 h-3 rounded-full ${
                                        user.role === "Comercial"
                                          ? "bg-blue-500"
                                          : user.role === "Administrador"
                                            ? "bg-green-500"
                                            : "bg-gray-500"
                                      }`}
                                    ></div>
                                    <div className="flex flex-col">
                                      <span className="font-medium">{user.name}</span>
                                      <span className="text-xs text-gray-500">
                                        {user.role || "Usuario"} • {user.email}
                                      </span>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      )}
                      <p className="text-xs text-orange-700">
                        Esta persona será responsable de gestionar y dar seguimiento a la oportunidad comercial.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Información de la Oportunidad</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit_title">Título de la Oportunidad</Label>
                      <Input
                        id="edit_title"
                        value={editingDeal.title}
                        onChange={(e) => setEditingDeal({ ...editingDeal, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit_value">{`Valor Estimado (${currencySymbol})`}</Label>
                      <Input
                        id="edit_value"
                        type="number"
                        value={editingDeal.value}
                        onChange={(e) =>
                          setEditingDeal({ ...editingDeal, value: Number.parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit_stage">Etapa</Label>
                      <Select
                        value={editingDeal.stage}
                        onValueChange={(value) => {
                          void handleChangeStage(editingDeal.id, value)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {stages.map((stage) => (
                            <SelectItem key={stage} value={stage}>
                              {stage}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit_probability">Probabilidad (%)</Label>
                      <Input
                        id="edit_probability"
                        type="number"
                        min="0"
                        max="100"
                        value={editingDeal.probability}
                        onChange={(e) =>
                          setEditingDeal({ ...editingDeal, probability: Number.parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit_expected_close_date">Cierre Esperado</Label>
                      <Input
                        id="edit_expected_close_date"
                        type="date"
                        value={editingDeal.expected_close_date || ""}
                        onChange={(e) => setEditingDeal({ ...editingDeal, expected_close_date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit_notes">Notas</Label>
                    <Textarea
                      id="edit_notes"
                      value={editingDeal.notes || ""}
                      onChange={(e) => setEditingDeal({ ...editingDeal, notes: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold">Información Adicional</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit_lead_source">Fuente del Lead</Label>
                      <Select
                        value={editingDeal.lead_source || ""}
                        onChange={(e) =>
                          setEditingDeal({ ...editingDeal, lead_source: (e.target as HTMLSelectElement).value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar fuente" />
                        </SelectTrigger>
                        <SelectContent>
                          {leadSources.map((source) => (
                            <SelectItem key={source} value={source}>
                              {source}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit_industry">Industria</Label>
                      <Input
                        id="edit_industry"
                        value={editingDeal.industry || ""}
                        onChange={(e) => setEditingDeal({ ...editingDeal, industry: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit_next_steps">Próximos Pasos</Label>
                    <Textarea
                      id="edit_next_steps"
                      value={editingDeal.next_steps || ""}
                      onChange={(e) => setEditingDeal({ ...editingDeal, next_steps: e.target.value })}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    setIsEditDialogOpen(false)
                    if (editingDeal) {
                      deleteOpportunity(editingDeal.id)
                    }
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
