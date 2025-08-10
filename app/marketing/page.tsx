"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Megaphone, Bot, Users, Send, Plus, Search, Filter, BarChart3, Mail, Eye, MousePointer, TrendingUp, Calendar, Target, Sparkles, MessageSquare, Settings, Play, Pause, Edit, Trash2, Copy } from 'lucide-react'

export default function MarketingPage() {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)

  const campaignPrompts = [
    {
      id: 1,
      text: "Crear una campaña de email que promocione el lanzamiento de un nuevo producto y ofrezca un descuento exclusivo de pre-orden",
      category: "Lanzamiento de Producto",
      icon: "🚀"
    },
    {
      id: 2,
      text: "Crear una campaña de email promocionando envío gratuito en todos los pedidos por tiempo limitado",
      category: "Promoción",
      icon: "🚚"
    },
    {
      id: 3,
      text: "Crear una campaña de email con un programa de referidos que recompense a los clientes por referir amigos",
      category: "Referidos",
      icon: "👥"
    },
    {
      id: 4,
      text: "Crear una campaña de email ofreciendo un descuento por tiempo limitado para nuevos suscriptores",
      category: "Adquisición",
      icon: "💰"
    },
    {
      id: 5,
      text: "Crear una campaña de email para contactar clientes que realizaron una compra recientemente",
      category: "Retención",
      icon: "🔄"
    }
  ]

  const marketingContacts = [
    {
      id: 1,
      name: "Lista Principal",
      count: 1250,
      status: "active",
      lastUpdated: "Hace 2 horas",
      tags: ["Clientes", "Activos"]
    },
    {
      id: 2,
      name: "Nuevos Suscriptores",
      count: 340,
      status: "active",
      lastUpdated: "Hace 1 día",
      tags: ["Nuevos", "Suscriptores"]
    },
    {
      id: 3,
      name: "Clientes VIP",
      count: 89,
      status: "active",
      lastUpdated: "Hace 3 días",
      tags: ["VIP", "Premium"]
    },
    {
      id: 4,
      name: "Inactivos",
      count: 567,
      status: "inactive",
      lastUpdated: "Hace 1 semana",
      tags: ["Inactivos", "Re-engagement"]
    }
  ]

  const campaigns = [
    {
      id: 1,
      name: "Lanzamiento Producto Q1",
      type: "Email",
      status: "active",
      sent: 1250,
      opened: 456,
      clicked: 89,
      openRate: 36.5,
      clickRate: 7.1,
      created: "2024-01-10",
      scheduled: "2024-01-15 10:00"
    },
    {
      id: 2,
      name: "Promoción Envío Gratis",
      type: "Email",
      status: "completed",
      sent: 980,
      opened: 412,
      clicked: 156,
      openRate: 42.0,
      clickRate: 15.9,
      created: "2024-01-05",
      scheduled: "2024-01-08 14:30"
    },
    {
      id: 3,
      name: "Programa Referidos",
      type: "Email",
      status: "draft",
      sent: 0,
      opened: 0,
      clicked: 0,
      openRate: 0,
      clickRate: 0,
      created: "2024-01-12",
      scheduled: null
    },
    {
      id: 4,
      name: "Descuento Nuevos Usuarios",
      type: "Email",
      status: "scheduled",
      sent: 0,
      opened: 0,
      clicked: 0,
      openRate: 0,
      clickRate: 0,
      created: "2024-01-11",
      scheduled: "2024-01-20 09:00"
    }
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
            <p className="text-gray-600">Gestiona tus campañas y estrategias de marketing</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analíticas
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Campaña
            </Button>
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
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">En ejecución</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contactos Totales</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">2,246</div>
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
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="assistant" className="flex items-center">
              <Bot className="h-4 w-4 mr-2" />
              Asistente Campañas
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Contactos
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center">
              <Send className="h-4 w-4 mr-2" />
              Campañas
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
                      Asistente de Campañas IA
                      <Badge className="ml-2 bg-blue-100 text-blue-800">Beta</Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Utiliza IA para crear campañas de marketing efectivas
                    </p>
                  </CardHeader>
                  <CardContent>
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
                            className="w-full text-left justify-start p-4 h-auto hover:bg-blue-50 hover:border-blue-300"
                            onClick={() => setSelectedPrompt(prompt.text)}
                          >
                            <div className="flex items-start space-x-3">
                              <span className="text-lg">{prompt.icon}</span>
                              <div className="flex-1 text-left">
                                <p className="text-sm font-medium text-gray-900">{prompt.text}</p>
                                <Badge variant="secondary" className="mt-1 text-xs">
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
                          />
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generar
                          </Button>
                        </div>
                      </div>
                    </div>
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
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Crear Email
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Gestionar Listas
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Ver Reportes
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Configuración
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
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
                      <Input
                        placeholder="Buscar listas..."
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Lista
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketingContacts.map((list) => (
                    <div key={list.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{list.name}</h3>
                          <p className="text-sm text-gray-600">{list.count.toLocaleString()} contactos</p>
                          <p className="text-xs text-gray-500">Actualizado {list.lastUpdated}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex flex-wrap gap-1">
                          {list.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Badge className={`${getStatusColor(list.status)} border text-xs`}>
                          {getStatusLabel(list.status)}
                        </Badge>
                        <Button variant="ghost" size="sm">
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
                      <Input
                        placeholder="Buscar campañas..."
                        className="pl-10 w-64"
                      />
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
                            <p className="text-sm text-gray-600">{campaign.type} • Creada el {campaign.created}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getStatusColor(campaign.status)} border text-xs`}>
                            {getStatusLabel(campaign.status)}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {campaign.status !== 'draft' && (
                        <div className="grid grid-cols-4 gap-4 mt-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">{campaign.sent.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">Enviados</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{campaign.opened.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">Abiertos ({campaign.openRate}%)</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">{campaign.clicked.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">Clics ({campaign.clickRate}%)</div>
                          </div>
                          <div className="text-center">
                            {campaign.scheduled ? (
                              <>
                                <div className="text-sm font-medium text-yellow-600">{campaign.scheduled}</div>
                                <div className="text-xs text-gray-500">Programada</div>
                              </>
                            ) : (
                              <>
                                <div className="text-lg font-bold text-purple-600">
                                  {Math.round((campaign.clicked / campaign.sent) * 100 * 2.5)}
                                </div>
                                <div className="text-xs text-gray-500">Conversiones</div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {campaign.status === 'draft' && (
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
