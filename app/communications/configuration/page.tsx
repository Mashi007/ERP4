"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Mail, Users, Calendar, Bell, Code, MoreHorizontal, Phone, GroupIcon as Teams, CheckCircle, AlertCircle, Plus, Trash2, Edit } from 'lucide-react'

export default function ConfigurationPage() {
  const [activeTab, setActiveTab] = useState("connect-email")

  const emailProviders = [
    {
      id: 'gmail',
      name: 'Gmail',
      icon: '📧',
      status: 'connected',
      account: 'gd.casanas@gmail.com',
      isFavorite: true
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      icon: '📮',
      status: 'disconnected',
      account: null,
      isFavorite: false
    },
    {
      id: 'zoho',
      name: 'Zoho Mail',
      icon: '📬',
      status: 'disconnected',
      account: null,
      isFavorite: false
    }
  ]

  const calendarProviders = [
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      icon: '📅',
      status: 'connected',
      account: 'gd.casanas@gmail.com',
      isFavorite: true
    },
    {
      id: 'outlook-calendar',
      name: 'Outlook Calendar',
      icon: '📆',
      status: 'disconnected',
      account: null,
      isFavorite: false
    },
    {
      id: 'apple-calendar',
      name: 'Apple Calendar',
      icon: '🗓️',
      status: 'disconnected',
      account: null,
      isFavorite: false
    }
  ]

  const phoneProviders = [
    {
      id: 'twilio',
      name: 'Twilio',
      icon: '📞',
      status: 'disconnected',
      account: null,
      isFavorite: false
    },
    {
      id: 'vonage',
      name: 'Vonage',
      icon: '☎️',
      status: 'disconnected',
      account: null,
      isFavorite: false
    }
  ]

  const apiIntegrations = [
    {
      id: 'webhooks',
      name: 'Webhooks',
      description: 'Recibir notificaciones en tiempo real',
      status: 'active',
      endpoints: 2
    },
    {
      id: 'rest-api',
      name: 'REST API',
      description: 'Acceso programático a datos del CRM',
      status: 'active',
      keys: 1
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automatización con miles de apps',
      status: 'inactive',
      connections: 0
    }
  ]

  const ProviderCard = ({ provider, onToggleFavorite, onConnect, onDisconnect }: any) => (
    <Card className="relative">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{provider.icon}</div>
            <div>
              <h3 className="font-medium">{provider.name}</h3>
              {provider.account && (
                <p className="text-sm text-gray-600">{provider.account}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {provider.isFavorite && (
              <Badge className="bg-yellow-100 text-yellow-800">Favorito</Badge>
            )}
            <Badge variant={provider.status === 'connected' ? 'default' : 'secondary'}>
              {provider.status === 'connected' ? 'Conectado' : 'Desconectado'}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              checked={provider.isFavorite}
              onCheckedChange={() => onToggleFavorite(provider.id)}
            />
            <Label className="text-sm">Proveedor favorito</Label>
          </div>
          
          <div className="flex space-x-2">
            {provider.status === 'connected' ? (
              <Button variant="outline" size="sm" onClick={() => onDisconnect(provider.id)}>
                Desconectar
              </Button>
            ) : (
              <Button size="sm" onClick={() => onConnect(provider.id)}>
                Conectar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Settings className="mr-3 h-8 w-8 text-blue-600" />
            Configuración de Comunicaciones
          </h1>
          <p className="text-gray-600">Configura tus proveedores favoritos y integraciones</p>
        </div>

        {/* Configuration Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 mb-6">
            <TabsTrigger value="connect-email" className="text-sm">
              Conectar email
            </TabsTrigger>
            <TabsTrigger value="sync-contacts" className="text-sm">
              Sincronizar contactos
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-sm">
              Calendario y Conferencias
            </TabsTrigger>
            <TabsTrigger value="email" className="text-sm">
              Email
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-sm">
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="api" className="text-sm">
              API
            </TabsTrigger>
            <TabsTrigger value="other" className="text-sm">
              Otros
            </TabsTrigger>
            <TabsTrigger value="phone" className="text-sm">
              Teléfono
            </TabsTrigger>
          </TabsList>

          {/* Connect Email Tab */}
          <TabsContent value="connect-email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-blue-600" />
                  Proveedores de Correo Electrónico
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Conecta y configura tus proveedores de correo electrónico favoritos
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {emailProviders.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      onToggleFavorite={(id: string) => console.log('Toggle favorite:', id)}
                      onConnect={(id: string) => console.log('Connect:', id)}
                      onDisconnect={(id: string) => console.log('Disconnect:', id)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sync Contacts Tab */}
          <TabsContent value="sync-contacts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-green-600" />
                  Sincronización de Contactos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Google Contacts</h4>
                      <p className="text-sm text-gray-600">Sincronizar contactos de Google</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Outlook Contacts</h4>
                      <p className="text-sm text-gray-600">Sincronizar contactos de Outlook</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Sincronización bidireccional</h4>
                      <p className="text-sm text-gray-600">Mantener contactos actualizados en ambas direcciones</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-purple-600" />
                  Calendario y Conferencias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {calendarProviders.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      onToggleFavorite={(id: string) => console.log('Toggle favorite:', id)}
                      onConnect={(id: string) => console.log('Connect:', id)}
                      onDisconnect={(id: string) => console.log('Disconnect:', id)}
                    />
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Configuración de Conferencias</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Zoom</span>
                      <Button variant="outline" size="sm">Conectar</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Google Meet</span>
                      <Badge variant="default">Conectado</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Microsoft Teams</span>
                      <Button variant="outline" size="sm">Conectar</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings Tab */}
          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Correo Electrónico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="signature">Firma de correo electrónico</Label>
                  <textarea
                    id="signature"
                    className="w-full mt-2 p-3 border rounded-lg"
                    rows={4}
                    placeholder="Tu firma de correo electrónico..."
                    defaultValue="Saludos,&#10;Daniel Casañas&#10;CRM Pro&#10;📧 gd.casanas@gmail.com"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Tracking de emails</Label>
                    <p className="text-sm text-gray-600">Seguimiento de correos electrónicos</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-respuestas</Label>
                    <p className="text-sm text-gray-600">Respuestas automáticas</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5 text-yellow-600" />
                  Configuración de Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificaciones por email</Label>
                    <p className="text-sm text-gray-600">Recibir notificaciones por correo electrónico</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificaciones push</Label>
                    <p className="text-sm text-gray-600">Notificaciones en el navegador</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificaciones SMS</Label>
                    <p className="text-sm text-gray-600">Alertas importantes por SMS</p>
                  </div>
                  <Switch />
                </div>
                <div>
                  <Label htmlFor="notification-frequency">Frecuencia de resumen</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Tiempo real</SelectItem>
                      <SelectItem value="hourly">Cada hora</SelectItem>
                      <SelectItem value="daily">Diario</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="mr-2 h-5 w-5 text-indigo-600" />
                  Configuración de API
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiIntegrations.map((integration) => (
                    <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          {integration.endpoints && <span>Endpoints: {integration.endpoints}</span>}
                          {integration.keys && <span>API Keys: {integration.keys}</span>}
                          {integration.connections !== undefined && <span>Conexiones: {integration.connections}</span>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={integration.status === 'active' ? 'default' : 'secondary'}>
                          {integration.status === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Nueva API Key
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other Tab */}
          <TabsContent value="other" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MoreHorizontal className="mr-2 h-5 w-5 text-gray-600" />
                  Otras Configuraciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="timezone">Zona horaria</Label>
                  <Select defaultValue="america/mexico_city">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america/mexico_city">América/Ciudad de México</SelectItem>
                      <SelectItem value="america/new_york">América/Nueva York</SelectItem>
                      <SelectItem value="europe/madrid">Europa/Madrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Idioma</Label>
                  <Select defaultValue="es">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Modo oscuro</Label>
                    <p className="text-sm text-gray-600">Tema oscuro para la interfaz</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Phone Tab */}
          <TabsContent value="phone" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="mr-2 h-5 w-5 text-green-600" />
                  Configuración de Teléfono
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {phoneProviders.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      onToggleFavorite={(id: string) => console.log('Toggle favorite:', id)}
                      onConnect={(id: string) => console.log('Connect:', id)}
                      onDisconnect={(id: string) => console.log('Disconnect:', id)}
                    />
                  ))}
                </div>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="phone-number">Número de teléfono principal</Label>
                    <Input
                      id="phone-number"
                      placeholder="+52 55 1234 5678"
                      className="mt-2"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Grabación de llamadas</Label>
                      <p className="text-sm text-gray-600">Grabar llamadas automáticamente</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
