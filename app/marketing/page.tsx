"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"
import {
  Megaphone,
  Bot,
  Users,
  Send,
  Plus,
  Search,
  Filter,
  Mail,
  Eye,
  MousePointer,
  Sparkles,
  Edit,
  Loader2,
} from "lucide-react"
import EmailMarketingSection from "@/components/marketing/email-marketing-section"
import { DateFilters } from "@/components/dashboard/date-filters"

export default function MarketingPage() {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)
  const [customPrompt, setCustomPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCampaign, setGeneratedCampaign] = useState<any>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [marketingLists, setMarketingLists] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingPrompt, setEditingPrompt] = useState<any>(null)
  const [editPromptText, setEditPromptText] = useState("")
  const [editPromptCategory, setEditPromptCategory] = useState("")
  const [editingTag, setEditingTag] = useState<any>(null)
  const [editTagName, setEditTagName] = useState("")
  const [editTagIcon, setEditTagIcon] = useState("")
  const [editTagDescription, setEditTagDescription] = useState("")
  const [editingList, setEditingList] = useState<any>(null)
  const [editListName, setEditListName] = useState("")
  const [editListDescription, setEditListDescription] = useState("")
  const [editListTags, setEditListTags] = useState("")
  const [filteredContacts, setFilteredContacts] = useState<any[]>([])

  const [industries, setIndustries] = useState<string[]>([])
  const [sources, setSources] = useState<string[]>([])
  const [responsibleUsers, setResponsibleUsers] = useState<Array<{ id: string; name: string }>>([])

  const searchParams = useSearchParams()

  useEffect(() => {
    fetchCampaigns()
    fetchMarketingLists()
    fetchFilterData()
    fetchContacts()
  }, [searchParams])

  const fetchFilterData = async () => {
    try {
      // Fetch industries
      const industriesResponse = await fetch("/api/contacts/industries")
      const industriesData = await industriesResponse.json()
      setIndustries(industriesData || [])

      // Fetch sources
      const sourcesResponse = await fetch("/api/contacts/sources")
      const sourcesData = await sourcesResponse.json()
      setSources(sourcesData || [])

      // Fetch responsible users
      const usersResponse = await fetch("/api/users")
      const usersData = await usersResponse.json()
      setResponsibleUsers(usersData || [])
    } catch (error) {
      console.error("Error fetching filter data:", error)
    }
  }

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("/api/marketing/campaigns")

      if (!response.ok) {
        console.error("API response not ok:", response.status)
        setCampaigns([])
        return
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Response is not JSON:", contentType)
        setCampaigns([])
        return
      }

      try {
        const data = await response.json()
        // Ensure data is an array
        setCampaigns(Array.isArray(data) ? data : [])
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError)
        setCampaigns([])
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error)
      setCampaigns([])
      toast.error("Error al cargar campañas")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMarketingLists = async () => {
    try {
      const response = await fetch("/api/marketing/lists")

      if (!response.ok) {
        console.error("API response not ok:", response.status, response.statusText)
        setMarketingLists([])
        return
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("API returned non-JSON response:", contentType)
        setMarketingLists([])
        return
      }

      let data
      try {
        data = await response.json()
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError)
        setMarketingLists([])
        return
      }

      if (Array.isArray(data)) {
        setMarketingLists(data)
      } else {
        console.error("API returned non-array data:", data)
        setMarketingLists([])
      }
    } catch (error) {
      console.error("Error fetching lists:", error)
      setMarketingLists([])
      toast.error("Error al cargar listas")
    }
  }

  const fetchContacts = async () => {
    try {
      const response = await fetch("/api/contacts")
      const data = await response.json()
      const contacts = Array.isArray(data) ? data : data.contacts || []

      // Apply filters to the fetched contacts
      const filtered = applyFilters(contacts)
      setFilteredContacts(filtered)
    } catch (error) {
      console.error("Error fetching contacts:", error)
      setFilteredContacts([])
    }
  }

  const applyFilters = (contacts: any[]) => {
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    const industry = searchParams.get("industry")
    const source = searchParams.get("source")
    const responsibleUser = searchParams.get("responsibleUser")

    return contacts.filter((contact) => {
      // Date range filter
      if (from && contact.created_at) {
        const contactDate = new Date(contact.created_at)
        const fromDate = new Date(from)
        if (contactDate < fromDate) return false
      }

      if (to && contact.created_at) {
        const contactDate = new Date(contact.created_at)
        const toDate = new Date(to)
        if (contactDate > toDate) return false
      }

      // Industry filter
      if (industry && industry !== "all" && contact.industry !== industry) {
        return false
      }

      // Source filter
      if (source && source !== "all" && contact.source !== source) {
        return false
      }

      // Responsible user filter
      if (responsibleUser && responsibleUser !== "all" && contact.sales_owner !== responsibleUser) {
        return false
      }

      return true
    })
  }

  const generateCampaignWithAI = async (prompt: string) => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/marketing/campaigns/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          audience: "clientes CRM",
          campaignType: "email marketing",
        }),
      })

      if (!response.ok) throw new Error("Error generating campaign")

      const reader = response.body?.getReader()
      let result = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          result += new TextDecoder().decode(value)
        }
      }

      try {
        const campaignData = JSON.parse(result)
        setGeneratedCampaign(campaignData)
        toast.success("Campaña generada con IA exitosamente")
      } catch {
        setGeneratedCampaign({
          title: "Campaña Generada",
          subject: "Asunto generado por IA",
          content: result,
          cta: "¡Actúa ahora!",
          segmentation: "Todos los contactos activos",
          metrics: ["Tasa de apertura", "Clics", "Conversiones"],
        })
      }
    } catch (error) {
      console.error("Error generating campaign:", error)
      toast.error("Error al generar campaña con IA")
    } finally {
      setIsGenerating(false)
    }
  }

  const createCampaign = async (campaignData: any) => {
    try {
      const response = await fetch("/api/marketing/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignData),
      })

      const result = await response.json()
      if (result.success) {
        toast.success("Campaña creada exitosamente")
        fetchCampaigns()
        setGeneratedCampaign(null)
      }
    } catch (error) {
      console.error("Error creating campaign:", error)
      toast.error("Error al crear campaña")
    }
  }

  const createMarketingList = async (listData: any) => {
    try {
      const response = await fetch("/api/marketing/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listData),
      })

      const result = await response.json()
      if (result.success) {
        toast.success("Lista creada exitosamente")
        fetchMarketingLists()
      }
    } catch (error) {
      console.error("Error creating list:", error)
      toast.error("Error al crear lista")
    }
  }

  const handleEditList = (list: any) => {
    setEditingList(list)
    setEditListName(list.name || "")
    setEditListDescription(list.description || "")
    setEditListTags((list.tags || []).join(", "))
  }

  const saveEditedList = async () => {
    if (!editingList) return

    try {
      const response = await fetch(`/api/marketing/lists/${editingList.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editListName.trim(),
          description: editListDescription.trim(),
          tags: editListTags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      })

      const result = await response.json()
      if (result.success) {
        toast.success("Lista actualizada exitosamente")
        fetchMarketingLists()
        setEditingList(null)
        setEditListName("")
        setEditListDescription("")
        setEditListTags("")
      } else {
        toast.error("Error al actualizar la lista")
      }
    } catch (error) {
      console.error("Error updating list:", error)
      toast.error("Error al actualizar la lista")
    }
  }

  const campaignPrompts = [
    {
      id: 1,
      text: "Crear una campaña de email que promocione el lanzamiento de un nuevo producto y ofrezca un descuento exclusivo de pre-orden",
      category: "Lanzamiento de Producto",
      icon: "🚀",
    },
    {
      id: 2,
      text: "Crear una campaña de email promocionando envío gratuito en todos los pedidos por tiempo limitado",
      category: "Promoción",
      icon: "🚚",
    },
    {
      id: 3,
      text: "Crear una campaña de email con un programa de referidos que recompense a los clientes por referir amigos",
      category: "Referidos",
      icon: "👥",
    },
    {
      id: 4,
      text: "Crear una campaña de email ofreciendo un descuento por tiempo limitado para nuevos suscriptores",
      category: "Adquisición",
      icon: "💰",
    },
    {
      id: 5,
      text: "Crear una campaña de email para contactar clientes que realizaron una compra recientemente",
      category: "Retención",
      icon: "🔄",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "scheduled":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Activa"
      case "completed":
        return "Completada"
      case "draft":
        return "Borrador"
      case "scheduled":
        return "Programada"
      case "inactive":
        return "Inactiva"
      default:
        return "Desconocido"
    }
  }

  const handleEditPrompt = (prompt: any) => {
    setEditingPrompt(prompt)
    setEditPromptText(prompt.text)
    setEditPromptCategory(prompt.category)
  }

  const saveEditedPrompt = () => {
    // Update the prompt in the campaignPrompts array
    const updatedPrompts = campaignPrompts.map((p) =>
      p.id === editingPrompt.id ? { ...p, text: editPromptText, category: editPromptCategory } : p,
    )
    // In a real app, you would save this to the database
    toast.success("Sugerencia actualizada exitosamente")
    setEditingPrompt(null)
    setEditPromptText("")
    setEditPromptCategory("")
  }

  const classificationTags = [
    {
      id: 1,
      name: "Lanzamiento",
      icon: "🚀",
      description: "Campañas para lanzamiento de nuevos productos o servicios",
      color: "blue",
    },
    {
      id: 2,
      name: "Promoción",
      icon: "🚚",
      description: "Ofertas especiales, descuentos y promociones limitadas",
      color: "green",
    },
    {
      id: 3,
      name: "Referidos",
      icon: "👥",
      description: "Programas de referidos y recompensas por recomendaciones",
      color: "purple",
    },
    {
      id: 4,
      name: "Adquisición",
      icon: "💰",
      description: "Campañas para atraer nuevos clientes y suscriptores",
      color: "yellow",
    },
    {
      id: 5,
      name: "Retención",
      icon: "🔄",
      description: "Estrategias para mantener y fidelizar clientes existentes",
      color: "indigo",
    },
  ]

  const handleEditTag = (tag: any) => {
    setEditingTag(tag)
    setEditTagName(tag.name)
    setEditTagIcon(tag.icon)
    setEditTagDescription(tag.description)
  }

  const saveEditedTag = () => {
    // In a real app, you would save this to the database
    toast.success("Etiqueta actualizada exitosamente")
    setEditingTag(null)
    setEditTagName("")
    setEditTagIcon("")
    setEditTagDescription("")
  }

  const getTagColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "hover:bg-blue-50 hover:border-blue-300"
      case "green":
        return "hover:bg-green-50 hover:border-green-300"
      case "purple":
        return "hover:bg-purple-50 hover:border-purple-300"
      case "yellow":
        return "hover:bg-yellow-50 hover:border-yellow-300"
      case "indigo":
        return "hover:bg-indigo-50 hover:border-indigo-300"
      default:
        return "hover:bg-gray-50 hover:border-gray-300"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <Megaphone className="h-6 w-6 text-white" />
              </div>
              Centro de Marketing
            </h1>
            <p className="text-gray-600 text-lg">Gestiona tus campañas y estrategias de marketing con IA</p>
          </div>
          <div className="flex items-center space-x-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 text-white font-semibold">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Campaña
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Campaña</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="campaign-name">Nombre de la Campaña</Label>
                    <Input id="campaign-name" placeholder="Ej: Promoción Primavera 2024" />
                  </div>
                  <div>
                    <Label htmlFor="campaign-subject">Asunto del Email</Label>
                    <Input id="campaign-subject" placeholder="Asunto atractivo para el email" />
                  </div>
                  <div>
                    <Label htmlFor="campaign-content">Contenido</Label>
                    <Textarea id="campaign-content" placeholder="Contenido de la campaña..." rows={6} />
                  </div>
                  <div>
                    <Label htmlFor="campaign-list">Lista de Contactos</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar lista" />
                      </SelectTrigger>
                      <SelectContent>
                        {marketingLists.map((list) => (
                          <SelectItem key={list.id} value={list.id.toString()}>
                            {list.name} ({list.contact_count} contactos)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Guardar Borrador</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">Crear Campaña</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="text-sm font-semibold text-gray-700">Campañas Activas</CardTitle>
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Send className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-blue-600">
                {campaigns.filter((c) => c.status === "active").length}
              </div>
              <p className="text-sm text-gray-500 mt-1">En ejecución</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-green-50 to-green-100">
              <CardTitle className="text-sm font-semibold text-gray-700">Contactos Totales</CardTitle>
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-green-600">
                {marketingLists.reduce((total, list) => total + (list.contact_count || 0), 0).toLocaleString()}
              </div>
              <p className="text-sm text-gray-500 mt-1">En todas las listas</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-purple-50 to-purple-100">
              <CardTitle className="text-sm font-semibold text-gray-700">Tasa de Apertura</CardTitle>
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Eye className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-purple-600">39.3%</div>
              <p className="text-sm text-gray-500 mt-1">Promedio mensual</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-orange-50 to-orange-100">
              <CardTitle className="text-sm font-semibold text-gray-700">Tasa de Clics</CardTitle>
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <MousePointer className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-orange-600">11.5%</div>
              <p className="text-sm text-gray-500 mt-1">Promedio mensual</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="assistant" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl bg-gradient-to-r from-gray-50 to-white border border-gray-200/50 shadow-2xl rounded-3xl p-3 mb-8 backdrop-blur-sm">
            <TabsTrigger
              value="assistant"
              className="group flex items-center justify-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-blue-700 data-[state=active]:to-blue-800 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-blue-300/40 data-[state=active]:scale-105 transition-all duration-500 ease-out rounded-2xl px-6 py-4 text-sm font-bold hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:shadow-lg hover:scale-102 data-[state=active]:hover:from-blue-700 data-[state=active]:hover:to-blue-900 text-gray-700 data-[state=active]:text-white border-0 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 data-[state=active]:opacity-0 transition-opacity duration-300"></div>
              <Bot className="h-5 w-5 mr-3 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 relative z-10" />
              <span className="truncate text-center relative z-10 tracking-wide">Asistente IA</span>
            </TabsTrigger>
            <TabsTrigger
              value="email-marketing"
              className="group flex items-center justify-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-blue-700 data-[state=active]:to-blue-800 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-blue-300/40 data-[state=active]:scale-105 transition-all duration-500 ease-out rounded-2xl px-6 py-4 text-sm font-bold hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:shadow-lg hover:scale-102 data-[state=active]:hover:from-blue-700 data-[state=active]:hover:to-blue-900 text-gray-700 data-[state=active]:text-white border-0 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 data-[state=active]:opacity-0 transition-opacity duration-300"></div>
              <Mail className="h-5 w-5 mr-3 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 relative z-10" />
              <span className="truncate text-center relative z-10 tracking-wide">Email Marketing</span>
            </TabsTrigger>
            <TabsTrigger
              value="contacts"
              className="group flex items-center justify-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-blue-700 data-[state=active]:to-blue-800 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-blue-300/40 data-[state=active]:scale-105 transition-all duration-500 ease-out rounded-2xl px-6 py-4 text-sm font-bold hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:shadow-lg hover:scale-102 data-[state=active]:hover:from-blue-700 data-[state=active]:hover:to-blue-900 text-gray-700 data-[state=active]:text-white border-0 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 data-[state=active]:opacity-0 transition-opacity duration-300"></div>
              <Users className="h-5 w-5 mr-3 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 relative z-10" />
              <span className="truncate text-center relative z-10 tracking-wide">Contactos</span>
            </TabsTrigger>
          </TabsList>

          {/* Campaign Assistant Tab */}
          <TabsContent value="assistant" className="mt-6">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Assistant Interface */}
              <div className="lg:col-span-2">
                <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                    <CardTitle className="flex items-center text-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      Asistente de Campañas con Grok IA
                      <Badge className="ml-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-sm">
                        Grok-4
                      </Badge>
                    </CardTitle>
                    <p className="text-gray-600 mt-2">Utiliza Grok IA para crear campañas de marketing efectivas</p>
                  </CardHeader>
                  <CardContent>
                    {!generatedCampaign ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Bot className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Bienvenido!</h3>
                        <p className="text-gray-600 mb-6">
                          Selecciona una sugerencia de campaña o escribe tu propia idea
                        </p>

                        <div className="space-y-3">
                          {campaignPrompts.map((prompt) => (
                            <div key={prompt.id} className="relative group">
                              <Button
                                variant="outline"
                                className="w-full text-left justify-start p-4 h-auto hover:bg-blue-50 hover:border-blue-300 bg-transparent overflow-hidden pr-12"
                                onClick={() => generateCampaignWithAI(prompt.text)}
                                disabled={isGenerating}
                              >
                                <div className="flex items-start space-x-3 w-full min-w-0 max-w-full">
                                  <span className="text-lg flex-shrink-0 mt-0.5">{prompt.icon}</span>
                                  <div className="flex-1 min-w-0 max-w-full text-left overflow-hidden">
                                    <p className="text-sm font-medium text-gray-900 break-words hyphens-auto leading-relaxed overflow-wrap-anywhere">
                                      {prompt.text}
                                    </p>
                                    <Badge variant="secondary" className="mt-2 text-xs inline-block">
                                      {prompt.category}
                                    </Badge>
                                  </div>
                                </div>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditPrompt(prompt)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 pt-4 border-t">
                          <div className="flex space-x-2">
                            <Input
                              placeholder="O escribe tu propia idea de campaña..."
                              className="flex-1"
                              value={customPrompt}
                              onChange={(e) => setCustomPrompt(e.target.value)}
                            />
                            <Button
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => generateCampaignWithAI(customPrompt)}
                              disabled={isGenerating || !customPrompt.trim()}
                            >
                              {isGenerating ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Sparkles className="h-4 w-4 mr-2" />
                              )}
                              Generar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Added generated campaign display and save functionality */
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Campaña Generada por Grok IA</h3>
                          <Button variant="outline" onClick={() => setGeneratedCampaign(null)}>
                            Nueva Campaña
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label>Título de la Campaña</Label>
                            <Input value={generatedCampaign.title} readOnly />
                          </div>
                          <div>
                            <Label>Asunto del Email</Label>
                            <Input value={generatedCampaign.subject} readOnly />
                          </div>
                          <div>
                            <Label>Contenido</Label>
                            <Textarea value={generatedCampaign.content} rows={8} readOnly />
                          </div>
                          <div>
                            <Label>Call to Action</Label>
                            <Input value={generatedCampaign.cta} readOnly />
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button variant="outline">Editar</Button>
                          <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() =>
                              createCampaign({
                                name: generatedCampaign.title,
                                type: "email",
                                subject: generatedCampaign.subject,
                                content: generatedCampaign.content,
                              })
                            }
                          >
                            Guardar Campaña
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}

              {/* Etiquetas de Clasificación */}
              <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-800">Etiquetas de Clasificación</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast.info("Agregar nueva etiqueta próximamente")}
                      className="hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="flex flex-wrap gap-3">
                    {classificationTags.map((tag) => (
                      <div key={tag.id} className="relative group">
                        <Badge
                          variant="outline"
                          className={`cursor-pointer transition-all duration-200 pr-8 hover:shadow-md ${getTagColorClasses(tag.color)} border-2`}
                          onClick={() => toast.info(`Filtrar por ${tag.name}`)}
                          title={tag.description}
                        >
                          {tag.icon} {tag.name}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-100"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditTag(tag)
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      Haz clic en una etiqueta para filtrar campañas por categoría
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Email Marketing Tab */}
          <TabsContent value="email-marketing" className="mt-6">
            <EmailMarketingSection />
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Listas de Contactos</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input placeholder="Buscar listas..." className="pl-10 w-64" />
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Nueva Lista
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Crear Nueva Lista</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="list-name">Nombre de la Lista</Label>
                            <Input id="list-name" placeholder="Ej: Clientes Premium" />
                          </div>
                          <div>
                            <Label htmlFor="list-description">Descripción</Label>
                            <Textarea id="list-description" placeholder="Descripción de la lista..." />
                          </div>
                          <div>
                            <Label htmlFor="list-tags">Etiquetas (separadas por comas)</Label>
                            <Input id="list-tags" placeholder="premium, activos, vip" />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline">Cancelar</Button>
                            <Button className="bg-blue-600 hover:bg-blue-700">Crear Lista</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>

              <div className="px-6 pb-4 border-b border-gray-200">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/50">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-blue-600" />
                    Filtros de Contactos
                  </h3>
                  <DateFilters industries={industries} sources={sources} responsibleUsers={responsibleUsers} />
                </div>
              </div>

              <CardContent>
                <div className="space-y-4">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{contact.name}</h3>
                          <p className="text-sm text-gray-600">{contact.email}</p>
                          <p className="text-xs text-gray-500">Actualizado {contact.updated_at || "recientemente"}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex flex-wrap gap-1">
                          {(contact.tags || []).map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Badge className={`${getStatusColor(contact.status)} border text-xs`}>
                          {getStatusLabel(contact.status)}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => handleEditList(contact)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!editingPrompt} onOpenChange={() => setEditingPrompt(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Edit className="h-5 w-5 mr-2" />
              Editar Sugerencia de Campaña
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label htmlFor="edit-prompt-text">Contenido de la Sugerencia</Label>
              <Textarea
                id="edit-prompt-text"
                value={editPromptText}
                onChange={(e) => setEditPromptText(e.target.value)}
                placeholder="Describe la campaña que quieres crear..."
                rows={4}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="edit-prompt-category">Categoría</Label>
              <Select value={editPromptCategory} onValueChange={setEditPromptCategory}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lanzamiento de Producto">🚀 Lanzamiento de Producto</SelectItem>
                  <SelectItem value="Promoción">🚚 Promoción</SelectItem>
                  <SelectItem value="Referidos">👥 Referidos</SelectItem>
                  <SelectItem value="Adquisición">💰 Adquisición</SelectItem>
                  <SelectItem value="Retención">🔄 Retención</SelectItem>
                  <SelectItem value="Educativo">📚 Educativo</SelectItem>
                  <SelectItem value="Evento">🎉 Evento</SelectItem>
                  <SelectItem value="Encuesta">📊 Encuesta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Vista Previa</h4>
              <div className="flex items-start space-x-3">
                <span className="text-lg">{editingPrompt?.icon || "📧"}</span>
                <div>
                  <p className="text-sm text-gray-700 break-words">
                    {editPromptText || "Contenido de la sugerencia..."}
                  </p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {editPromptCategory || "Sin categoría"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setEditingPrompt(null)}>
                Cancelar
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={saveEditedPrompt}
                disabled={!editPromptText.trim() || !editPromptCategory}
              >
                <Edit className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingTag} onOpenChange={() => setEditingTag(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Edit className="h-5 w-5 mr-2" />
              Editar Etiqueta de Clasificación
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-1">
            <div>
              <Label htmlFor="edit-tag-name">Nombre de la Etiqueta</Label>
              <Input
                id="edit-tag-name"
                value={editTagName}
                onChange={(e) => setEditTagName(e.target.value)}
                placeholder="Nombre de la etiqueta..."
                className="mt-2 w-full"
              />
            </div>

            <div>
              <Label htmlFor="edit-tag-icon">Icono/Emoji</Label>
              <div className="space-y-3 mt-2">
                <Input
                  id="edit-tag-icon"
                  value={editTagIcon}
                  onChange={(e) => setEditTagIcon(e.target.value)}
                  placeholder="🚀"
                  className="w-20 text-center"
                />
                <div className="grid grid-cols-5 gap-2 max-w-full">
                  {["🚀", "🚚", "👥", "💰", "🔄", "📧", "🎯", "📊", "🎉", "📚"].map((emoji) => (
                    <Button
                      key={emoji}
                      variant="outline"
                      size="sm"
                      className="w-10 h-10 p-0 bg-transparent flex-shrink-0"
                      onClick={() => setEditTagIcon(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-tag-description">Descripción</Label>
              <Textarea
                id="edit-tag-description"
                value={editTagDescription}
                onChange={(e) => setEditTagDescription(e.target.value)}
                placeholder="Describe el propósito y uso de esta etiqueta..."
                rows={3}
                className="mt-2 w-full resize-none"
              />
            </div>

            <div>
              <Label>Color de la Etiqueta</Label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                {[
                  { name: "Azul", value: "blue", class: "bg-blue-100 border-blue-300" },
                  { name: "Verde", value: "green", class: "bg-green-100 border-green-300" },
                  { name: "Púrpura", value: "purple", class: "bg-purple-100 border-purple-300" },
                  { name: "Amarillo", value: "yellow", class: "bg-yellow-100 border-yellow-300" },
                  { name: "Índigo", value: "indigo", class: "bg-indigo-100 border-indigo-300" },
                ].map((color) => (
                  <Button
                    key={color.value}
                    variant="outline"
                    size="sm"
                    className={`h-8 text-xs ${color.class} ${editingTag?.color === color.value ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
                    onClick={() => setEditingTag({ ...editingTag, color: color.value })}
                  >
                    {color.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Vista Previa</h4>
              <Badge
                variant="outline"
                className={`${getTagColorClasses(editingTag?.color || "blue")} cursor-pointer break-words`}
              >
                {editTagIcon || "🏷️"} {editTagName || "Nombre de etiqueta"}
              </Badge>
              <p className="text-sm text-gray-600 mt-2 break-words">
                {editTagDescription || "Descripción de la etiqueta..."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <Button variant="outline" onClick={() => setEditingTag(null)} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                onClick={saveEditedTag}
                disabled={!editTagName.trim() || !editTagIcon.trim()}
              >
                <Edit className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingList} onOpenChange={() => setEditingList(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Edit className="h-5 w-5 mr-2" />
              Editar Lista de Contactos
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label htmlFor="edit-list-name">Nombre de la Lista</Label>
              <Input
                id="edit-list-name"
                value={editListName}
                onChange={(e) => setEditListName(e.target.value)}
                placeholder="Nombre de la lista..."
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="edit-list-description">Descripción</Label>
              <Textarea
                id="edit-list-description"
                value={editListDescription}
                onChange={(e) => setEditListDescription(e.target.value)}
                placeholder="Descripción de la lista..."
                rows={3}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="edit-list-tags">Etiquetas (separadas por comas)</Label>
              <Input
                id="edit-list-tags"
                value={editListTags}
                onChange={(e) => setEditListTags(e.target.value)}
                placeholder="premium, activos, vip"
                className="mt-2"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Vista Previa</h4>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{editListName || "Nombre de la lista"}</h3>
                  <p className="text-sm text-gray-600">{editListDescription || "Descripción de la lista"}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {editListTags.split(",").map(
                      (tag, index) =>
                        tag.trim() && (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag.trim()}
                          </Badge>
                        ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setEditingList(null)}>
                Cancelar
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={saveEditedList}
                disabled={!editListName.trim()}
              >
                <Edit className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
