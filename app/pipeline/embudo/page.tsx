"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

import { Search, Plus, DollarSign, TrendingUp, User, Building, Edit, Save, X } from "lucide-react"
import { createOpportunityWithContact, updateOpportunity, deleteOpportunity, updateDealStage } from "../actions"
import type { Contact } from "@/lib/database"
import ProposalTable from "@/components/pipeline/proposal-table"
import {
  loadDealsFromStorage,
  mergeUniqueById,
  publishNewOpportunity,
  upsertDealToStorage,
  type PipelineDeal,
} from "@/lib/pipeline-sync"
import { formatEUR } from "@/lib/currency"
import { useCurrency } from "@/components/providers/currency-provider"
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
    notes: d.notes || null,
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

export default function EmbudoPage() {
  const { code } = useCurrency()
  const currencySymbol = code === "EUR" ? "€" : "$"
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Edit dialog state
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // View (details) dialog state
  const [viewingDeal, setViewingDeal] = useState<Deal | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [viewingStage, setViewingStage] = useState<string | null>(null)

  // Contact search state for "Nueva Oportunidad"
  const [contactQuery, setContactQuery] = useState("")
  const [contactResults, setContactResults] = useState<Contact[]>([])
  const [contactOpen, setContactOpen] = useState(false)
  const contactSearchRef = useRef<HTMLDivElement | null>(null)
  const contactAbort = useRef<AbortController | null>(null)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

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

  const [formFields, setFormFields] = useState<any[]>([])
  const [isLoadingFields, setIsLoadingFields] = useState(true)

  const [newOpportunity, setNewOpportunity] = useState({
    // Datos de la Oportunidad
    title: "",
    value: "",
    stage: "Nuevo",
    probability: "25",
    expected_close_date: "",
    notes: "",

    // Datos del Contacto
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    company: "",
    job_title: "",
    contact_notes: "",

    // Datos Adicionales
    lead_source: "",
    industry: "",
    company_size: "",
    budget_range: "",
    decision_timeline: "",
    pain_points: "",
    competitors: "",
    next_steps: "",
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

  // Contact search logic
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
        const res = await fetch(`/api/contacts/search?q=${encodeURIComponent(q)}&by=any`, {
          signal: contactAbort.current.signal,
        })
        const data = (await res.json()) as { results: Contact[] }
        setContactResults(data.results || [])
        setContactOpen(true)
      } catch (e) {
        if ((e as any).name !== "AbortError") {
          console.error("Search contacts failed", e)
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
      contact_name: c.name,
      contact_email: c.email || "",
      contact_phone: c.phone || "",
      company: c.company || "",
      job_title: c.job_title || "",
    }))
    setContactQuery(c.name)
    setContactOpen(false)
  }

  useEffect(() => {
    const loadFormFields = async () => {
      try {
        const response = await fetch("/api/settings/funnel/active-fields")
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

    if (!newOpportunity.contact_email) {
      toast({
        title: "Falta el email del contacto",
        description: "Selecciona un contacto existente o ingresa el email manualmente.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const result = await createOpportunityWithContact(newOpportunity)

      if (result.success) {
        const newDeal: Deal = {
          id: result.deal.id,
          title: result.deal.title,
          company: result.deal.company,
          contact_name: result.contact.name,
          contact_email: result.contact.email || undefined,
          contact_phone: result.contact.phone || undefined,
          value: result.deal.value,
          stage: result.deal.stage,
          probability: result.deal.probability,
          expected_close_date: result.deal.expected_close_date,
          notes: result.deal.notes,
          contact_id: result.contact.id,
          lead_source: result.deal.lead_source || undefined,
          industry: result.deal.industry || undefined,
          company_size: result.deal.company_size || undefined,
          budget_range: result.deal.budget_range || undefined,
          decision_timeline: result.deal.decision_timeline || undefined,
          pain_points: result.deal.pain_points || undefined,
          competitors: result.deal.competitors || undefined,
          next_steps: result.deal.next_steps || undefined,
        }

        setDeals([newDeal, ...deals])

        const newForPipeline: PipelineDeal = { ...toPipelineDeal(newDeal), stage: "Nuevo" }
        upsertDealToStorage(newForPipeline)
        publishNewOpportunity(newForPipeline)

        // Resetear formulario y estados de búsqueda
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
        })
        setSelectedContact(null)
        setContactQuery("")
        setContactResults([])
        setIsDialogOpen(false)

        toast({
          title: "¡Oportunidad creada!",
          description: `Se creó "${result.deal.title}" y se ${result.contactCreated ? "creó" : "vinculó"} el contacto "${result.contact.name}".`,
        })
      } else {
        toast({
          title: "Error al crear oportunidad",
          description: result.error || "Ha ocurrido un error inesperado.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creando oportunidad:", error)
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

  const handleView = (deal: Deal) => {
    setViewingDeal(deal)
    setViewingStage(deal.stage)
    setIsViewDialogOpen(true)
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
          title: "¡Oportunidad actualizada!",
          description: `La oportunidad "${result.deal.title}" fue actualizada.`,
        })
      } else {
        toast({
          title: "Error al actualizar oportunidad",
          description: result.error || "Ha ocurrido un error inesperado.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error actualizando oportunidad:", error)
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
        toast({ title: "Oportunidad eliminada", description: "La oportunidad ha sido eliminada." })
      } else {
        toast({
          title: "Error al eliminar oportunidad",
          description: result.error || "Ha ocurrido un error inesperado.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error eliminando oportunidad:", error)
      toast({
        title: "Error al eliminar oportunidad",
        description: "Ha ocurrido un error inesperado.",
        variant: "destructive",
      })
    }
  }

  async function handleChangeStage(dealId: number, newStage: string) {
    // Optimistic updates
    setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d)))
    setViewingDeal((vd) => (vd && vd.id === dealId ? { ...vd, stage: newStage } : vd))

    const res = await updateDealStage(dealId, newStage)
    if (res?.success && res.deal) {
      setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, ...res.deal } : d)))
      setViewingDeal((vd) => (vd && vd.id === dealId ? { ...vd, ...res.deal } : vd))
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

  // Organizar deals por etapa para el pipeline
  const pipelineStages = stages.map((stageName) => {
    const stageDeals = deals.filter((deal) => deal.stage === stageName)
    const stageValue = stageDeals.reduce((sum, deal) => sum + (deal.value * deal.probability) / 100, 0)

    return {
      name: stageName,
      count: stageDeals.length,
      weightedValue: stageValue,
      deals: stageDeals,
    }
  })

  useEffect(() => {
    const stored = loadDealsFromStorage()
    if (stored.length) {
      setDeals((prev) => {
        const merged = mergeUniqueById(prev.map(toPipelineDeal), stored)
        return merged as unknown as Deal[]
      })
    }

    function onNew(e: Event) {
      const ce = e as CustomEvent<{ deal: PipelineDeal }>
      const incoming = ce.detail?.deal
      if (!incoming) return
      const incomingEmbudo: Deal = { ...(incoming as unknown as Deal), stage: "Nuevo" }
      setDeals((prev) => {
        const exists = prev.some((p) => p.id === incomingEmbudo.id)
        return exists
          ? prev.map((p) => (p.id === incomingEmbudo.id ? { ...p, ...incomingEmbudo } : p))
          : [incomingEmbudo, ...prev]
      })
    }

    window.addEventListener("pipeline:new-opportunity", onNew)
    return () => window.removeEventListener("pipeline:new-opportunity", onNew)
  }, [])

  return (
    <div>
      {/* CTA (título vive en el layout) */}
      <div className="flex justify-end items-center mb-6">
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
              setContactQuery("")
              setContactResults([])
              setSelectedContact(null)
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

          <DialogContent className="w-[95vw] sm:max-w-[900px] md:max-w-[1100px] lg:max-w-[1200px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Oportunidad</DialogTitle>
              <DialogDescription>
                Completa la información de la oportunidad y selecciona el contacto. Se sincronizará automáticamente con
                el módulo de Oportunidades.
              </DialogDescription>
            </DialogHeader>

            {/* Formulario de creación */}
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 py-4">
                {/* Información de la Oportunidad */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Información de la Oportunidad</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título de la Oportunidad *</Label>
                      <Input
                        id="title"
                        value={newOpportunity.title}
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, title: e.target.value })}
                        placeholder="ej. Implementación CRM Enterprise"
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
                  </div>

                  <div className="grid grid-cols-3 gap-4">
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

                {/* Información del Contacto con búsqueda */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold">Información del Contacto</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2" ref={contactSearchRef}>
                      <Label htmlFor="contact_name">Nombre del contacto</Label>
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
                                  <AvatarImage src={c.avatar_url || ""} alt={c.name} />
                                  <AvatarFallback>
                                    {(c.name || "?")
                                      .split(" ")
                                      .map((s) => s[0])
                                      .slice(0, 2)
                                      .join("")
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">{c.name}</div>
                                  <div className="text-xs text-gray-600 break-words">{c.company || "Sin empresa"}</div>
                                  {c.email && <div className="text-xs text-gray-500 break-words">{c.email}</div>}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_email">Email del contacto *</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={newOpportunity.contact_email}
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, contact_email: e.target.value })}
                        placeholder="correo@empresa.com"
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
                    <Label htmlFor="company">Empresa</Label>
                    <Input
                      id="company"
                      value={newOpportunity.company}
                      onChange={(e) => setNewOpportunity({ ...newOpportunity, company: e.target.value })}
                      placeholder="Nombre de la empresa"
                    />
                  </div>
                </div>

                {/* Información Adicional */}
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
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, lead_source: e.target.value })}
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
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, company_size: e.target.value })}
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
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, budget_range: e.target.value })}
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
                      onChange={(e) => setNewOpportunity({ ...newOpportunity, decision_timeline: e.target.value })}
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar oportunidades por título, empresa o contacto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tablero Pipeline */}
      <div className="flex space-x-6 overflow-x-auto pb-6">
        {pipelineStages.map((stage, stageIndex) => (
          <div key={stageIndex} className="flex-shrink-0 w-80">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-sm font-medium text-gray-700">{stage.name}</CardTitle>
                    <Badge className={`${getStageColor(stage.name)} text-xs`}>{stage.count}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Valor ponderado</span>
                  <span className="font-medium">{formatEUR(stage.weightedValue)}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {stage.deals.length > 0 ? (
                  stage.deals.map((deal) => (
                    <Card
                      key={deal.id}
                      className="border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer"
                      title="Doble clic para ver el detalle"
                      onDoubleClick={() => handleView(deal)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="text-sm font-medium text-blue-600 hover:underline cursor-pointer flex-1">
                              {deal.title}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(deal)}
                              className="h-6 w-6 p-0 ml-2"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold">{formatEUR(deal.value)}</span>
                            <span className="text-xs text-gray-500">
                              {deal.expected_close_date
                                ? `Cierra ${formatDateEs(deal.expected_close_date)}`
                                : "Sin fecha"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-blue-600 hover:underline cursor-pointer">{deal.company}</span>
                          </div>
                          {deal.contact_name && (
                            <div className="flex items-center space-x-2">
                              <User className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{deal.contact_name}</span>
                            </div>
                          )}
                          {deal.lead_source && <div className="text-xs text-gray-500">Fuente: {deal.lead_source}</div>}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-gray-500">Probabilidad: {deal.probability}%</span>
                            </div>
                            <Progress value={deal.probability} className="h-1 w-16" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar oportunidad
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Detalle - ahora persiste inmediatamente al cambiar la etapa */}
      <Dialog
        open={isViewDialogOpen}
        onOpenChange={(open) => {
          setIsViewDialogOpen(open)
        }}
      >
        <DialogContent className="w-[95vw] sm:max-w-[900px] md:max-w-[1100px] lg:max-w-[1200px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle de la Oportunidad</DialogTitle>
            <DialogDescription>Selecciona una etapa y se guardará inmediatamente.</DialogDescription>
          </DialogHeader>

          {viewingDeal && (
            <div className="grid gap-6 py-2">
              {/* Resumen superior editable: Título (solo lectura) + Etapa (select) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label>Título</Label>
                  <Input value={viewingDeal.title} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Etapa</Label>
                  <Select
                    value={viewingStage ?? viewingDeal.stage}
                    onValueChange={(v) => {
                      setViewingStage(v)
                      if (viewingDeal) {
                        void handleChangeStage(viewingDeal.id, v)
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

              {/* Datos de solo lectura abajo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Probabilidad</Label>
                  <Input value={`${viewingDeal.probability}%`} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Cierre esperado</Label>
                  <Input value={formatDateEs(viewingDeal.expected_close_date)} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Valor</Label>
                  <Input value={formatEUR(viewingDeal.value)} readOnly />
                </div>
              </div>

              {/* Contacto */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre</Label>
                    <Input value={viewingDeal.contact_name || ""} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={viewingDeal.contact_email || ""} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <Input value={viewingDeal.contact_phone || ""} readOnly />
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Información adicional</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Fuente del lead</Label>
                    <Input value={viewingDeal.lead_source || ""} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Industria</Label>
                    <Input value={viewingDeal.industry || ""} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Tamaño de empresa</Label>
                    <Input value={viewingDeal.company_size || ""} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Presupuesto</Label>
                    <Input value={viewingDeal.budget_range || ""} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Timeline de decisión</Label>
                    <Input value={viewingDeal.decision_timeline || ""} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Competidores</Label>
                    <Input value={viewingDeal.competitors || ""} readOnly />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Puntos de dolor</Label>
                  <Textarea value={viewingDeal.pain_points || ""} readOnly rows={2} />
                </div>

                <div className="space-y-2">
                  <Label>Próximos pasos</Label>
                  <Textarea value={viewingDeal.next_steps || ""} readOnly rows={2} />
                </div>

                <div className="space-y-2">
                  <Label>Notas</Label>
                  <Textarea value={viewingDeal.notes || ""} readOnly rows={3} />
                </div>
              </div>

              {/* Propuesta y acciones */}
              <ProposalTable
                deal={{
                  id: viewingDeal.id,
                  title: viewingDeal.title,
                  contact_email: viewingDeal.contact_email,
                  contact_id: viewingDeal.contact_id,
                  company: viewingDeal.company,
                }}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Cerrar
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    setEditingDeal(viewingDeal!)
                    setIsEditDialogOpen(true)
                  }}
                >
                  Editar
                </Button>
                {viewingDeal && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      setIsViewDialogOpen(false)
                      void handleDelete(viewingDeal.id)
                    }}
                  >
                    Eliminar
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Editar */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[900px] md:max-w-[1100px] lg:max-w-[1200px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Oportunidad</DialogTitle>
            <DialogDescription>
              Modifica la información de la oportunidad. Los cambios se sincronizarán automáticamente con el módulo de
              Oportunidades.
            </DialogDescription>
          </DialogHeader>
          {editingDeal && (
            <form onSubmit={handleUpdateDeal}>
              <div className="grid gap-6 py-4">
                {/* Información Básica */}
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

                {/* Información Adicional */}
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
                        onChange={(e) => setEditingDeal({ ...editingDeal, lead_source: e.target.value })}
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
                    handleDelete(editingDeal.id)
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
