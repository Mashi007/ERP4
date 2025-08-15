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
import {
  Megaphone,
  Bot,
  Users,
  Send,
  Plus,
  Search,
  Filter,
  BarChart3,
  Mail,
  Eye,
  MousePointer,
  Sparkles,
  Settings,
  Play,
  Edit,
  Trash2,
  Copy,
  Loader2,
} from "lucide-react"
import EmailMarketingSection from "@/components/marketing/email-marketing-section"

export default function MarketingPage() {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)
  const [customPrompt, setCustomPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCampaign, setGeneratedCampaign] = useState<any>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [marketingLists, setMarketingLists] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCampaigns()
    fetchMarketingLists()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("/api/marketing/campaigns")
      const data = await response.json()
      setCampaigns(data)
    } catch (error) {
      console.error("Error fetching campaigns:", error)
      toast.error("Error al cargar campañas")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMarketingLists = async () => {
    try {
      const response = await fetch("/api/marketing/lists")
      const data = await response.json()
      setMarketingLists(data)
    } catch (error) {
      console.error("Error fetching lists:", error)
      toast.error("Error al cargar listas")
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Megaphone className="mr-3 h-8 w-8 text-blue-600" />
              Centro de Marketing
            </h1>
            <p className="text-gray-600">Gestiona tus campañas y estrategias de marketing con IA</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => window.open("/analytics", "_blank")}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Analíticas
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
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
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campañas Activas</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaigns.filter((c) => c.status === "active").length}</div>
              <p className="text-xs text-muted-foreground">En ejecución</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contactos Totales</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {marketingLists.reduce((total, list) => total + (list.contact_count || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">En todas las listas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Apertura</CardTitle>
              <Eye className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">39.3%</div>
              <p className="text-xs text-muted-foreground">Promedio mensual</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Clics</CardTitle>
              <MousePointer className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">11.5%</div>
              <p className="text-xs text-muted-foreground">Promedio mensual</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="assistant" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl bg-white border border-gray-200 rounded-xl p-1.5 shadow-sm mb-8">
            <TabsTrigger
              value="assistant"
              className="flex items-center justify-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-200/50 transition-all duration-300 rounded-lg px-4 py-3 text-sm font-semibold hover:bg-gray-50 data-[state=active]:hover:from-blue-700 data-[state=active]:hover:to-blue-800 text-gray-600 data-[state=active]:text-white border-0"
            >
              <Bot className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Asistente IA</span>
            </TabsTrigger>
            <TabsTrigger
              value="email-marketing"
              className="flex items-center justify-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-200/50 transition-all duration-300 rounded-lg px-4 py-3 text-sm font-semibold hover:bg-gray-50 data-[state=active]:hover:from-blue-700 data-[state=active]:hover:to-blue-800 text-gray-600 data-[state=active]:text-white border-0"
            >
              <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Email Marketing</span>
            </TabsTrigger>
            <TabsTrigger
              value="contacts"
              className="flex items-center justify-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-200/50 transition-all duration-300 rounded-lg px-4 py-3 text-sm font-semibold hover:bg-gray-50 data-[state=active]:hover:from-blue-700 data-[state=active]:hover:to-blue-800 text-gray-600 data-[state=active]:text-white border-0"
            >
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Contactos</span>
            </TabsTrigger>
            <TabsTrigger
              value="campaigns"
              className="flex items-center justify-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-200/50 transition-all duration-300 rounded-lg px-4 py-3 text-sm font-semibold hover:bg-gray-50 data-[state=active]:hover:from-blue-700 data-[state=active]:hover:to-blue-800 text-gray-600 data-[state=active]:text-white border-0"
            >
              <Send className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Campañas</span>
            </TabsTrigger>
          </TabsList>

          {/* Campaign Assistant Tab */}
          <TabsContent value="assistant" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Assistant Interface */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bot className="mr-2 h-6 w-6 text-blue-600" />
                      Asistente de Campañas con Grok IA
                      <Badge className="ml-2 bg-blue-100 text-blue-800">Grok-4</Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600">Utiliza Grok IA para crear campañas de marketing efectivas</p>
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
                            <Button
                              key={prompt.id}
                              variant="outline"
                              className="w-full text-left justify-start p-4 h-auto hover:bg-blue-50 hover:border-blue-300 bg-transparent overflow-hidden"
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
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Rendimiento Reciente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Emails enviados</span>
                      <span className="font-medium">2,230</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tasa de apertura</span>
                      <span className="font-medium text-green-600">39.3%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Clics totales</span>
                      <span className="font-medium">245</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Conversiones</span>
                      <span className="font-medium text-blue-600">34</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Acciones Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-transparent"
                      onClick={() => window.open("/communications", "_blank")}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Crear Email
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-transparent"
                      onClick={() => document.querySelector('[value="contacts"]')?.click()}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Gestionar Listas
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-transparent"
                      onClick={() => window.open("/analytics", "_blank")}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Ver Reportes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-transparent"
                      onClick={() => window.open("/settings", "_blank")}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configuración
                    </Button>
                  </CardContent>
                </Card>
              </div>
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
              <CardContent>
                <div className="space-y-4">
                  {marketingLists.map((list) => (
                    <div
                      key={list.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{list.name}</h3>
                          <p className="text-sm text-gray-600">
                            {(list.contact_count || 0).toLocaleString()} contactos
                          </p>
                          <p className="text-xs text-gray-500">Actualizado {list.updated_at || "recientemente"}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex flex-wrap gap-1">
                          {(list.tags || []).map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Badge className={`${getStatusColor(list.status)} border text-xs`}>
                          {getStatusLabel(list.status)}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => toast.info("Función de edición próximamente")}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Todas las Campañas</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input placeholder="Buscar campañas..." className="pl-10 w-64" />
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Campaña
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Mail className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                              <p className="text-sm text-gray-600">
                                {campaign.type} • Creada el {campaign.created_at}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Badge className={`${getStatusColor(campaign.status)} border text-xs`}>
                              {getStatusLabel(campaign.status)}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toast.info("Función de copia próximamente")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toast.info("Función de edición próximamente")}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toast.info("Función de eliminación próximamente")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {campaign.status !== "draft" && (
                          <div className="grid grid-cols-4 gap-4 mt-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900">
                                {(campaign.sent_count || 0).toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">Enviados</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">
                                {(campaign.opened_count || 0).toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">Abiertos ({campaign.open_rate || 0}%)</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-600">
                                {(campaign.clicked_count || 0).toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">Clics ({campaign.click_rate || 0}%)</div>
                            </div>
                            <div className="text-center">
                              {campaign.scheduled_at ? (
                                <>
                                  <div className="text-sm font-medium text-yellow-600">{campaign.scheduled_at}</div>
                                  <div className="text-xs text-gray-500">Programada</div>
                                </>
                              ) : (
                                <>
                                  <div className="text-lg font-bold text-purple-600">
                                    {Math.round(
                                      ((campaign.clicked_count || 0) / (campaign.sent_count || 1)) * 100 * 2.5,
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500">Conversiones</div>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {campaign.status === "draft" && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">Esta campaña está en borrador</p>
                            <div className="flex space-x-2">
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </Button>
                              <Button size="sm" variant="outline">
                                <Play className="h-4 w-4 mr-2" />
                                Enviar Prueba
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
