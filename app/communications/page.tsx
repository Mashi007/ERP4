"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, ChevronDown, ChevronRight, Phone, MessageSquare, Send, Target, Inbox, Users, BarChart3, Plus, Calendar, Settings } from 'lucide-react'
import { cn } from "@/lib/utils"

export default function CommunicationsPage() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['email'])
  const [selectedProvider, setSelectedProvider] = useState<string>('gmail')
  const [selectedCalendarProvider, setSelectedCalendarProvider] = useState<string>('google-calendar')

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const sidebarSections = [
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      items: ['Bandeja de entrada', 'Enviados', 'Borradores', 'Plantillas']
    },
    {
      id: 'bulk-email',
      name: 'Bulk Email',
      icon: Send,
      items: ['Campañas', 'Listas', 'Plantillas', 'Estadísticas']
    },
    {
      id: 'email-tracking',
      name: 'Email Tracking',
      icon: BarChart3,
      items: ['Abiertos', 'Clics', 'Respuestas', 'Rebotes']
    },
    {
      id: 'phone',
      name: 'Phone',
      icon: Phone,
      items: ['Llamadas', 'Grabaciones', 'Voicemail', 'Configuración']
    },
    {
      id: 'sms',
      name: 'SMS',
      icon: MessageSquare,
      items: ['Mensajes', 'Plantillas', 'Campañas', 'Estadísticas']
    },
    {
      id: 'chat',
      name: 'Chat',
      icon: MessageSquare,
      items: ['Conversaciones', 'Bots', 'Configuración', 'Reportes']
    },
    {
      id: 'calendar',
      name: 'Calendar',
      icon: Calendar,
      items: ['Eventos', 'Reuniones', 'Sincronización', 'Configuración']
    },
    {
      id: 'configuration',
      name: 'Configuración',
      icon: Settings,
      items: ['Proveedores', 'Integraciones', 'API', 'Preferencias']
    }
  ]

  const emailProviders = [
    {
      id: 'gmail',
      name: 'Gmail',
      icon: '📧',
      color: 'border-red-300 bg-red-50',
      recommended: true
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      icon: '📮',
      color: 'border-blue-300 bg-blue-50'
    },
    {
      id: 'zoho',
      name: 'Zoho',
      icon: '📬',
      color: 'border-orange-300 bg-orange-50'
    },
    {
      id: 'others',
      name: 'Others',
      icon: '📫',
      color: 'border-gray-300 bg-gray-50'
    }
  ]

  const calendarProviders = [
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      icon: '📅',
      color: 'border-blue-300 bg-blue-50',
      recommended: true,
      description: 'Sincroniza con Google Calendar'
    },
    {
      id: 'outlook-calendar',
      name: 'Outlook Calendar',
      icon: '📆',
      color: 'border-indigo-300 bg-indigo-50',
      description: 'Integración con Microsoft Outlook'
    },
    {
      id: 'apple-calendar',
      name: 'Apple Calendar',
      icon: '🗓️',
      color: 'border-gray-300 bg-gray-50',
      description: 'Sincronización con iCloud Calendar'
    },
    {
      id: 'caldav',
      name: 'CalDAV',
      icon: '📋',
      color: 'border-green-300 bg-green-50',
      description: 'Protocolo CalDAV estándar'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Comunicaciones</h2>
          </div>
          
          <div className="p-2">
            {sidebarSections.map((section) => {
              const isExpanded = expandedSections.includes(section.id)
              const Icon = section.icon
              
              return (
                <div key={section.id} className="mb-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-3 h-auto"
                    onClick={() => toggleSection(section.id)}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    <span className="flex-1 text-left">{section.name}</span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {isExpanded && (
                    <div className="ml-6 mt-1 space-y-1">
                      {section.items.map((item, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-sm text-gray-600 hover:text-gray-900"
                        >
                          {item}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-6">
            <Tabs defaultValue="conversations" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-lg">
                <TabsTrigger value="conversations" className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Conversations
                </TabsTrigger>
                <TabsTrigger value="sequences" className="flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Sales Sequences
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="conversations" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Conecta tu Bandeja de Entrada al CRM</CardTitle>
                    <p className="text-gray-600">
                      Gestiona tu email de trabajo en una bandeja privada que se mantiene sincronizada con tu proveedor de email. 
                      También puedes agregar bandejas de equipo más tarde.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Selecciona tu proveedor de email:</h3>
                      
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>gd.casanas@gmail.com</strong> está alojado por Gmail. Te recomendamos seleccionar este proveedor.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {emailProviders.map((provider) => (
                          <div
                            key={provider.id}
                            className={cn(
                              "relative p-6 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md",
                              selectedProvider === provider.id 
                                ? "border-blue-500 bg-blue-50" 
                                : provider.color
                            )}
                            onClick={() => setSelectedProvider(provider.id)}
                          >
                            {provider.recommended && (
                              <Badge className="absolute -top-2 -right-2 bg-green-500">
                                Recomendado
                              </Badge>
                            )}
                            <div className="text-center">
                              <div className="text-3xl mb-2">{provider.icon}</div>
                              <h4 className="font-medium text-sm">{provider.name}</h4>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        Paso 1 de 3: Seleccionar proveedor
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Continuar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sequences" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Secuencias de Ventas</CardTitle>
                    <p className="text-gray-600">
                      Automatiza tu proceso de seguimiento con secuencias personalizadas de emails y tareas.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Crea tu primera secuencia de ventas
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Las secuencias te ayudan a automatizar el seguimiento y aumentar tus tasas de conversión.
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Secuencia
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="calendar" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Conecta tu Calendario al CRM</CardTitle>
                    <p className="text-gray-600">
                      Sincroniza tu calendario para gestionar reuniones, citas y eventos directamente desde el CRM. 
                      Mantén todo organizado en un solo lugar.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Selecciona tu proveedor de calendario:</h3>
                      
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Recomendado:</strong> Google Calendar ofrece la mejor integración con nuestro CRM.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {calendarProviders.map((provider) => (
                          <div
                            key={provider.id}
                            className={cn(
                              "relative p-6 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md",
                              selectedCalendarProvider === provider.id 
                                ? "border-blue-500 bg-blue-50" 
                                : provider.color
                            )}
                            onClick={() => setSelectedCalendarProvider(provider.id)}
                          >
                            {provider.recommended && (
                              <Badge className="absolute -top-2 -right-2 bg-green-500">
                                Recomendado
                              </Badge>
                            )}
                            <div className="flex items-center space-x-4">
                              <div className="text-3xl">{provider.icon}</div>
                              <div className="flex-1">
                                <h4 className="font-medium text-sm mb-1">{provider.name}</h4>
                                <p className="text-xs text-gray-600">{provider.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Funcionalidades incluidas:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Sincronización bidireccional de eventos</li>
                        <li>• Programación automática de reuniones</li>
                        <li>• Recordatorios integrados</li>
                        <li>• Invitaciones desde el CRM</li>
                        <li>• Vista unificada de disponibilidad</li>
                      </ul>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        Paso 1 de 2: Seleccionar proveedor de calendario
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Calendar className="h-4 w-4 mr-2" />
                        Conectar Calendario
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
