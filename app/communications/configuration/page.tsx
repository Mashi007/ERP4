"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import {
  Mail,
  Calendar,
  Users,
  Settings,
  Phone,
  Bell,
  Code,
  MoreHorizontal,
  Check,
  X,
  Star,
  Zap,
  Globe,
  Edit,
  Plus,
} from "lucide-react"

export default function CommunicationsConfiguration() {
  const [activeTab, setActiveTab] = useState("connect-email")
  const [isLoading, setIsLoading] = useState(false)

  const [conferenceProviders, setConferenceProviders] = useState([
    {
      id: "zoom",
      name: "Zoom",
      icon: "🎥",
      status: "disconnected",
      account: null,
      isFavorite: false,
      color: "bg-blue-50 border-blue-200",
    },
    {
      id: "google-meet",
      name: "Google Meet",
      icon: "📹",
      status: "connected",
      account: "gd.casanas@gmail.com",
      isFavorite: true,
      color: "bg-green-50 border-green-200",
    },
    {
      id: "microsoft-teams",
      name: "Microsoft Teams",
      icon: "💼",
      status: "disconnected",
      account: null,
      isFavorite: false,
      color: "bg-purple-50 border-purple-200",
    },
  ])

  const [providers, setProviders] = useState({
    email: [
      {
        id: "gmail",
        name: "Gmail",
        icon: "📧",
        status: "connected",
        account: "gd.casanas@gmail.com",
        isFavorite: true,
        color: "bg-red-50 border-red-200",
      },
      {
        id: "outlook",
        name: "Microsoft Outlook",
        icon: "📮",
        status: "disconnected",
        account: null,
        isFavorite: false,
        color: "bg-blue-50 border-blue-200",
      },
      {
        id: "zoho",
        name: "Zoho Mail",
        icon: "📬",
        status: "disconnected",
        account: null,
        isFavorite: false,
        color: "bg-orange-50 border-orange-200",
      },
    ],
    calendar: [
      {
        id: "google-calendar",
        name: "Google Calendar",
        icon: "📅",
        status: "connected",
        account: "gd.casanas@gmail.com",
        isFavorite: true,
        color: "bg-green-50 border-green-200",
      },
      {
        id: "outlook-calendar",
        name: "Outlook Calendar",
        icon: "📆",
        status: "disconnected",
        account: null,
        isFavorite: false,
        color: "bg-blue-50 border-blue-200",
      },
      {
        id: "apple-calendar",
        name: "Apple Calendar",
        icon: "🗓️",
        status: "disconnected",
        account: null,
        isFavorite: false,
        color: "bg-gray-50 border-gray-200",
      },
    ],
    phone: [
      {
        id: "twilio",
        name: "Twilio",
        icon: "📞",
        status: "disconnected",
        account: null,
        isFavorite: false,
        color: "bg-purple-50 border-purple-200",
      },
      {
        id: "vonage",
        name: "Vonage",
        icon: "☎️",
        status: "disconnected",
        account: null,
        isFavorite: false,
        color: "bg-indigo-50 border-indigo-200",
      },
    ],
  })

  const [settings, setSettings] = useState({
    emailSignature: "Saludos,\nDaniel Casañas\nCRM Pro\n📧 gd.casanas@gmail.com",
    emailTracking: true,
    autoResponses: false,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    notificationFrequency: "daily",
    timezone: "america/mexico_city",
    language: "es",
    darkMode: false,
    phoneNumber: "",
    callRecording: false,
    contactSyncGoogle: true,
    contactSyncOutlook: false,
    bidirectionalSync: true,
  })

  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [providerConfigs, setProviderConfigs] = useState({
    zoom: {
      defaultDuration: 60,
      autoRecord: true,
      waitingRoom: true,
      muteOnEntry: false,
      allowScreenShare: true,
      maxParticipants: 100,
      meetingPassword: true,
      chatEnabled: true,
    },
    "google-meet": {
      defaultDuration: 60,
      autoRecord: false,
      allowExternalGuests: true,
      muteOnEntry: true,
      allowScreenShare: true,
      maxParticipants: 250,
      chatEnabled: true,
      liveStreamEnabled: false,
    },
    "microsoft-teams": {
      defaultDuration: 60,
      autoRecord: true,
      waitingRoom: true,
      muteOnEntry: false,
      allowScreenShare: true,
      maxParticipants: 300,
      chatEnabled: true,
      allowAnonymous: false,
    },
  })

  const openConfigDialog = (providerId: string) => {
    setSelectedProvider(providerId)
    setConfigDialogOpen(true)
  }

  const saveProviderConfig = (providerId: string, config: any) => {
    setProviderConfigs((prev) => ({
      ...prev,
      [providerId]: config,
    }))
    toast({
      title: "Configuración guardada",
      description: `La configuración de ${conferenceProviders.find((p) => p.id === providerId)?.name} se guardó correctamente`,
    })
    setConfigDialogOpen(false)
  }

  const handleProviderConnect = async (type: string, providerId: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setProviders((prev) => ({
        ...prev,
        [type]: prev[type as keyof typeof prev].map((provider) =>
          provider.id === providerId ? { ...provider, status: "connected", account: "user@example.com" } : provider,
        ),
      }))

      toast({
        title: "Proveedor conectado",
        description: "La conexión se estableció correctamente",
      })
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar el proveedor",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleProviderDisconnect = async (type: string, providerId: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setProviders((prev) => ({
        ...prev,
        [type]: prev[type as keyof typeof prev].map((provider) =>
          provider.id === providerId ? { ...provider, status: "disconnected", account: null } : provider,
        ),
      }))

      toast({
        title: "Proveedor desconectado",
        description: "La conexión se cerró correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo desconectar el proveedor",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleFavorite = (type: string, providerId: string) => {
    setProviders((prev) => ({
      ...prev,
      [type]: prev[type as keyof typeof prev].map((provider) =>
        provider.id === providerId ? { ...provider, isFavorite: !provider.isFavorite } : provider,
      ),
    }))

    toast({
      title: "Favorito actualizado",
      description: "La configuración se guardó correctamente",
    })
  }

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))

    toast({
      title: "Configuración guardada",
      description: "Los cambios se aplicaron correctamente",
    })
  }

  const handleConferenceConnect = async (providerId: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setConferenceProviders((prev) =>
        prev.map((provider) =>
          provider.id === providerId ? { ...provider, status: "connected", account: "user@example.com" } : provider,
        ),
      )

      toast({
        title: "Plataforma conectada",
        description: `${conferenceProviders.find((p) => p.id === providerId)?.name} se conectó correctamente`,
      })
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar la plataforma de conferencias",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConferenceDisconnect = async (providerId: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setConferenceProviders((prev) =>
        prev.map((provider) =>
          provider.id === providerId ? { ...provider, status: "disconnected", account: null } : provider,
        ),
      )

      toast({
        title: "Plataforma desconectada",
        description: "La conexión se cerró correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo desconectar la plataforma",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConferenceToggleFavorite = (providerId: string) => {
    setConferenceProviders((prev) =>
      prev.map((provider) =>
        provider.id === providerId ? { ...provider, isFavorite: !provider.isFavorite } : provider,
      ),
    )

    toast({
      title: "Favorito actualizado",
      description: "La configuración se guardó correctamente",
    })
  }

  const ProviderCard = ({ provider, type, onToggleFavorite, onConnect, onDisconnect }: any) => (
    <Card className={`relative transition-all duration-200 hover:shadow-lg ${provider.color} border-2 overflow-hidden`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4 gap-3">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="text-2xl sm:text-3xl flex-shrink-0">{provider.icon}</div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{provider.name}</h3>
              {provider.account && (
                <p className="text-xs sm:text-sm text-gray-600 font-medium truncate mt-1">{provider.account}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2 flex-shrink-0">
            {provider.isFavorite && (
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs whitespace-nowrap">
                <Star className="h-3 w-3 mr-1" />
                Favorito
              </Badge>
            )}
            <Badge
              variant={provider.status === "connected" ? "default" : "secondary"}
              className={`text-xs whitespace-nowrap ${
                provider.status === "connected"
                  ? "bg-green-100 text-green-800 border-green-300"
                  : "bg-gray-100 text-gray-600 border-gray-300"
              }`}
            >
              {provider.status === "connected" ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Conectado
                </>
              ) : (
                <>
                  <X className="h-3 w-3 mr-1" />
                  Desconectado
                </>
              )}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 min-w-0">
            <Switch
              checked={provider.isFavorite}
              onCheckedChange={() => onToggleFavorite(type, provider.id)}
              className="flex-shrink-0"
            />
            <Label className="text-xs sm:text-sm font-medium text-gray-700 truncate">Proveedor favorito</Label>
          </div>

          <div className="flex-shrink-0 w-full sm:w-auto">
            {provider.status === "connected" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDisconnect(type, provider.id)}
                disabled={isLoading}
                className="w-full sm:w-auto border-red-300 text-red-700 hover:bg-red-50 text-xs sm:text-sm"
              >
                {isLoading ? "Desconectando..." : "Desconectar"}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => onConnect(type, provider.id)}
                disabled={isLoading}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
              >
                {isLoading ? "Conectando..." : "Conectar"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8 bg-white rounded-xl shadow-sm border p-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
            <div className="bg-blue-100 p-2 rounded-lg mr-4">
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
            Configuración de Comunicaciones
          </h1>
          <p className="text-gray-600 text-lg">Configura tus proveedores favoritos y integraciones</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-white rounded-xl shadow-sm border mb-6 p-2">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-1 bg-gray-50 p-1 rounded-lg">
              <TabsTrigger
                value="connect-email"
                className="text-xs lg:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Mail className="h-4 w-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Conectar email</span>
                <span className="sm:hidden">Email</span>
              </TabsTrigger>
              <TabsTrigger
                value="sync-contacts"
                className="text-xs lg:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Users className="h-4 w-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Sincronizar</span>
                <span className="sm:hidden">Sync</span>
              </TabsTrigger>
              <TabsTrigger
                value="calendar"
                className="text-xs lg:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Calendar className="h-4 w-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Calendario</span>
                <span className="sm:hidden">Cal</span>
              </TabsTrigger>
              <TabsTrigger
                value="email"
                className="text-xs lg:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Mail className="h-4 w-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Email Config</span>
                <span className="sm:hidden">Config</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="text-xs lg:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Bell className="h-4 w-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Notificaciones</span>
                <span className="sm:hidden">Notif</span>
              </TabsTrigger>
              <TabsTrigger
                value="api"
                className="text-xs lg:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Code className="h-4 w-4 mr-1 lg:mr-2" />
                <span>API</span>
              </TabsTrigger>
              <TabsTrigger
                value="other"
                className="text-xs lg:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <MoreHorizontal className="h-4 w-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Otros</span>
                <span className="sm:hidden">Más</span>
              </TabsTrigger>
              <TabsTrigger
                value="phone"
                className="text-xs lg:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Phone className="h-4 w-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Teléfono</span>
                <span className="sm:hidden">Tel</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Connect Email Tab */}
          <TabsContent value="connect-email" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="flex items-center text-xl">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  Proveedores de Correo Electrónico
                </CardTitle>
                <p className="text-gray-600 ml-12">
                  Conecta y configura tus proveedores de correo electrónico favoritos
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                  {providers.email.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      type="email"
                      onToggleFavorite={handleToggleFavorite}
                      onConnect={handleProviderConnect}
                      onDisconnect={handleProviderDisconnect}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sync Contacts Tab */}
          <TabsContent value="sync-contacts" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <CardTitle className="flex items-center text-xl">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  Sincronización de Contactos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border-2 border-green-100 rounded-xl bg-green-50">
                    <div>
                      <h4 className="font-semibold text-green-900">Google Contacts</h4>
                      <p className="text-sm text-green-700">Sincronizar contactos de Google</p>
                    </div>
                    <Switch
                      checked={settings.contactSyncGoogle}
                      onCheckedChange={(checked) => handleSettingChange("contactSyncGoogle", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border-2 border-blue-100 rounded-xl bg-blue-50">
                    <div>
                      <h4 className="font-semibold text-blue-900">Outlook Contacts</h4>
                      <p className="text-sm text-blue-700">Sincronizar contactos de Outlook</p>
                    </div>
                    <Switch
                      checked={settings.contactSyncOutlook}
                      onCheckedChange={(checked) => handleSettingChange("contactSyncOutlook", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border-2 border-purple-100 rounded-xl bg-purple-50">
                    <div>
                      <h4 className="font-semibold text-purple-900">Sincronización bidireccional</h4>
                      <p className="text-sm text-purple-700">Mantener contactos actualizados en ambas direcciones</p>
                    </div>
                    <Switch
                      checked={settings.bidirectionalSync}
                      onCheckedChange={(checked) => handleSettingChange("bidirectionalSync", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                <CardTitle className="flex items-center text-xl">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  Calendario y Conferencias
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
                  {providers.calendar.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      type="calendar"
                      onToggleFavorite={handleToggleFavorite}
                      onConnect={handleProviderConnect}
                      onDisconnect={handleProviderDisconnect}
                    />
                  ))}
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-100">
                  <h4 className="font-semibold text-blue-900 mb-6 flex items-center text-lg">
                    <Zap className="h-5 w-5 mr-2" />
                    Configuración de Conferencias
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {conferenceProviders.map((provider) => (
                      <Card
                        key={provider.id}
                        className={`transition-all duration-200 hover:shadow-md ${provider.color} border-2`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3 min-w-0 flex-1">
                              <div className="text-2xl flex-shrink-0">{provider.icon}</div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-gray-900 text-sm truncate">{provider.name}</h3>
                                {provider.account && (
                                  <p className="text-xs text-gray-600 font-medium truncate mt-1">{provider.account}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                              {provider.isFavorite && (
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Favorito
                                </Badge>
                              )}
                              <Badge
                                variant={provider.status === "connected" ? "default" : "secondary"}
                                className={`text-xs ${
                                  provider.status === "connected"
                                    ? "bg-green-100 text-green-800 border-green-300"
                                    : "bg-gray-100 text-gray-600 border-gray-300"
                                }`}
                              >
                                {provider.status === "connected" ? (
                                  <>
                                    <Check className="h-3 w-3 mr-1" />
                                    Conectado
                                  </>
                                ) : (
                                  <>
                                    <X className="h-3 w-3 mr-1" />
                                    Desconectado
                                  </>
                                )}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex flex-col space-y-3">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={provider.isFavorite}
                                onCheckedChange={() => handleConferenceToggleFavorite(provider.id)}
                                className="flex-shrink-0"
                              />
                              <Label className="text-xs font-medium text-gray-700 truncate">Plataforma favorita</Label>
                            </div>

                            {provider.status === "connected" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openConfigDialog(provider.id)}
                                className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 text-xs mb-2"
                              >
                                <Settings className="h-3 w-3 mr-1" />
                                Configurar
                              </Button>
                            )}

                            <div className="w-full">
                              {provider.status === "connected" ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleConferenceDisconnect(provider.id)}
                                  disabled={isLoading}
                                  className="w-full border-red-300 text-red-700 hover:bg-red-50 text-xs"
                                >
                                  {isLoading ? "Desconectando..." : "Desconectar"}
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => handleConferenceConnect(provider.id)}
                                  disabled={isLoading}
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-xs"
                                >
                                  {isLoading ? "Conectando..." : "Conectar"}
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-blue-200">
                    <h5 className="font-medium text-blue-900 mb-3">Configuraciones Adicionales</h5>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                        <div>
                          <Label className="font-medium text-gray-900 text-sm">Auto-grabación</Label>
                          <p className="text-xs text-gray-600">Grabar reuniones automáticamente</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                        <div>
                          <Label className="font-medium text-gray-900 text-sm">Sala de espera</Label>
                          <p className="text-xs text-gray-600">Activar sala de espera por defecto</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings Tab */}
          <TabsContent value="email" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
                <CardTitle className="flex items-center text-xl">
                  <div className="bg-orange-100 p-2 rounded-lg mr-3">
                    <Mail className="h-6 w-6 text-orange-600" />
                  </div>
                  Configuración de Correo Electrónico
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label htmlFor="signature" className="text-base font-semibold">
                    Firma de correo electrónico
                  </Label>
                  <Textarea
                    id="signature"
                    className="mt-3 border-2 border-gray-200 focus:border-blue-400 rounded-lg"
                    rows={4}
                    placeholder="Tu firma de correo electrónico..."
                    value={settings.emailSignature}
                    onChange={(e) => handleSettingChange("emailSignature", e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border-2 border-blue-100 rounded-xl bg-blue-50">
                  <div>
                    <Label className="font-semibold text-blue-900">Tracking de emails</Label>
                    <p className="text-sm text-blue-700">Seguimiento de correos electrónicos</p>
                  </div>
                  <Switch
                    checked={settings.emailTracking}
                    onCheckedChange={(checked) => handleSettingChange("emailTracking", checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border-2 border-green-100 rounded-xl bg-green-50">
                  <div>
                    <Label className="font-semibold text-green-900">Auto-respuestas</Label>
                    <p className="text-sm text-green-700">Respuestas automáticas</p>
                  </div>
                  <Switch
                    checked={settings.autoResponses}
                    onCheckedChange={(checked) => handleSettingChange("autoResponses", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
                <CardTitle className="flex items-center text-xl">
                  <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                    <Bell className="h-6 w-6 text-yellow-600" />
                  </div>
                  Configuración de Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 border-2 border-blue-100 rounded-xl bg-blue-50">
                  <div>
                    <Label className="font-semibold text-blue-900">Notificaciones por email</Label>
                    <p className="text-sm text-blue-700">Recibir notificaciones por correo electrónico</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border-2 border-green-100 rounded-xl bg-green-50">
                  <div>
                    <Label className="font-semibold text-green-900">Notificaciones push</Label>
                    <p className="text-sm text-green-700">Notificaciones en el navegador</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border-2 border-purple-100 rounded-xl bg-purple-50">
                  <div>
                    <Label className="font-semibold text-purple-900">Notificaciones SMS</Label>
                    <p className="text-sm text-purple-700">Alertas importantes por SMS</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
                  />
                </div>
                <div className="p-4 border-2 border-gray-100 rounded-xl bg-gray-50">
                  <Label htmlFor="notification-frequency" className="text-base font-semibold">
                    Frecuencia de resumen
                  </Label>
                  <Select
                    value={settings.notificationFrequency}
                    onValueChange={(value) => handleSettingChange("notificationFrequency", value)}
                  >
                    <SelectTrigger className="mt-3 border-2 border-gray-200 focus:border-blue-400">
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
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                <CardTitle className="flex items-center text-xl">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <Code className="h-6 w-6 text-indigo-600" />
                  </div>
                  Configuración de API
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border-2 border-green-100 rounded-xl bg-green-50">
                    <div>
                      <h4 className="font-semibold text-green-900">Webhooks</h4>
                      <p className="text-sm text-green-700">Recibir notificaciones en tiempo real</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-green-600">
                        <span>Endpoints: 2</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        <Check className="h-3 w-3 mr-1" />
                        Activo
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border-2 border-blue-100 rounded-xl bg-blue-50">
                    <div>
                      <h4 className="font-semibold text-blue-900">REST API</h4>
                      <p className="text-sm text-blue-700">Acceso programático a datos del CRM</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-blue-600">
                        <span>API Keys: 1</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                        <Check className="h-3 w-3 mr-1" />
                        Activo
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl bg-gray-50">
                    <div>
                      <h4 className="font-semibold text-gray-900">Zapier</h4>
                      <p className="text-sm text-gray-700">Automatización con miles de apps</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
                        <span>Conexiones: 0</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-300">
                        <X className="h-3 w-3 mr-1" />
                        Inactivo
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Nueva API Key
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other Tab */}
          <TabsContent value="other" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
                <CardTitle className="flex items-center text-xl">
                  <div className="bg-gray-100 p-2 rounded-lg mr-3">
                    <Globe className="h-6 w-6 text-gray-600" />
                  </div>
                  Otras Configuraciones
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="p-4 border-2 border-blue-100 rounded-xl bg-blue-50">
                  <Label htmlFor="timezone" className="text-base font-semibold text-blue-900">
                    Zona horaria
                  </Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange("timezone", value)}>
                    <SelectTrigger className="mt-3 border-2 border-blue-200 focus:border-blue-400 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america/mexico_city">América/Ciudad de México</SelectItem>
                      <SelectItem value="america/new_york">América/Nueva York</SelectItem>
                      <SelectItem value="europe/madrid">Europa/Madrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-4 border-2 border-green-100 rounded-xl bg-green-50">
                  <Label htmlFor="language" className="text-base font-semibold text-green-900">
                    Idioma
                  </Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                    <SelectTrigger className="mt-3 border-2 border-green-200 focus:border-green-400 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 border-2 border-purple-100 rounded-xl bg-purple-50">
                  <div>
                    <Label className="font-semibold text-purple-900">Modo oscuro</Label>
                    <p className="text-sm text-purple-700">Tema oscuro para la interfaz</p>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => handleSettingChange("darkMode", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Phone Tab */}
          <TabsContent value="phone" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 border-b">
                <CardTitle className="flex items-center text-xl">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  Configuración de Teléfono
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2 mb-6">
                  {providers.phone.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      type="phone"
                      onToggleFavorite={handleToggleFavorite}
                      onConnect={handleProviderConnect}
                      onDisconnect={handleProviderDisconnect}
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="p-4 border-2 border-blue-100 rounded-xl bg-blue-50">
                    <Label htmlFor="phone-number" className="text-base font-semibold text-blue-900">
                      Número de teléfono principal
                    </Label>
                    <Input
                      id="phone-number"
                      placeholder="+52 55 1234 5678"
                      className="mt-3 border-2 border-blue-200 focus:border-blue-400 bg-white"
                      value={settings.phoneNumber}
                      onChange={(e) => handleSettingChange("phoneNumber", e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border-2 border-green-100 rounded-xl bg-green-50">
                    <div>
                      <Label className="font-semibold text-green-900">Grabación de llamadas</Label>
                      <p className="text-sm text-green-700">Grabar llamadas automáticamente</p>
                    </div>
                    <Switch
                      checked={settings.callRecording}
                      onCheckedChange={(checked) => handleSettingChange("callRecording", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>
                  Configurar {selectedProvider && conferenceProviders.find((p) => p.id === selectedProvider)?.name}
                </span>
              </DialogTitle>
              <DialogDescription>Personaliza la configuración de tu plataforma de conferencias</DialogDescription>
            </DialogHeader>

            {selectedProvider && (
              <div className="space-y-6 py-4">
                {/* Zoom Configuration */}
                {selectedProvider === "zoom" && (
                  <ZoomConfigForm
                    config={providerConfigs.zoom}
                    onSave={(config) => saveProviderConfig("zoom", config)}
                    onCancel={() => setConfigDialogOpen(false)}
                  />
                )}

                {/* Google Meet Configuration */}
                {selectedProvider === "google-meet" && (
                  <GoogleMeetConfigForm
                    config={providerConfigs["google-meet"]}
                    onSave={(config) => saveProviderConfig("google-meet", config)}
                    onCancel={() => setConfigDialogOpen(false)}
                  />
                )}

                {/* Microsoft Teams Configuration */}
                {selectedProvider === "microsoft-teams" && (
                  <TeamsConfigForm
                    config={providerConfigs["microsoft-teams"]}
                    onSave={(config) => saveProviderConfig("microsoft-teams", config)}
                    onCancel={() => setConfigDialogOpen(false)}
                  />
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

function ZoomConfigForm({
  config,
  onSave,
  onCancel,
}: { config: any; onSave: (config: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState(config)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Duración por defecto (minutos)</Label>
          <Input
            type="number"
            value={formData.defaultDuration}
            onChange={(e) => setFormData({ ...formData, defaultDuration: Number.parseInt(e.target.value) })}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Máximo de participantes</Label>
          <Input
            type="number"
            value={formData.maxParticipants}
            onChange={(e) => setFormData({ ...formData, maxParticipants: Number.parseInt(e.target.value) })}
            className="mt-1"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <Label className="font-medium">Auto-grabación</Label>
            <p className="text-xs text-gray-600">Grabar reuniones automáticamente</p>
          </div>
          <Switch
            checked={formData.autoRecord}
            onCheckedChange={(checked) => setFormData({ ...formData, autoRecord: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <Label className="font-medium">Sala de espera</Label>
            <p className="text-xs text-gray-600">Activar sala de espera por defecto</p>
          </div>
          <Switch
            checked={formData.waitingRoom}
            onCheckedChange={(checked) => setFormData({ ...formData, waitingRoom: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <Label className="font-medium">Silenciar al entrar</Label>
            <p className="text-xs text-gray-600">Silenciar participantes automáticamente</p>
          </div>
          <Switch
            checked={formData.muteOnEntry}
            onCheckedChange={(checked) => setFormData({ ...formData, muteOnEntry: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <Label className="font-medium">Compartir pantalla</Label>
            <p className="text-xs text-gray-600">Permitir compartir pantalla</p>
          </div>
          <Switch
            checked={formData.allowScreenShare}
            onCheckedChange={(checked) => setFormData({ ...formData, allowScreenShare: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <Label className="font-medium">Contraseña de reunión</Label>
            <p className="text-xs text-gray-600">Requerir contraseña para unirse</p>
          </div>
          <Switch
            checked={formData.meetingPassword}
            onCheckedChange={(checked) => setFormData({ ...formData, meetingPassword: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <Label className="font-medium">Chat habilitado</Label>
            <p className="text-xs text-gray-600">Permitir chat durante la reunión</p>
          </div>
          <Switch
            checked={formData.chatEnabled}
            onCheckedChange={(checked) => setFormData({ ...formData, chatEnabled: checked })}
          />
        </div>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button onClick={onCancel} variant="outline" className="flex-1 bg-transparent">
          Cancelar
        </Button>
        <Button onClick={() => onSave(formData)} className="flex-1">
          Guardar Configuración
        </Button>
      </div>
    </div>
  )
}

function GoogleMeetConfigForm({
  config,
  onSave,
  onCancel,
}: { config: any; onSave: (config: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState(config)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Duración por defecto (minutos)</Label>
          <Input
            type="number"
            value={formData.defaultDuration}
            onChange={(e) => setFormData({ ...formData, defaultDuration: Number.parseInt(e.target.value) })}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Máximo de participantes</Label>
          <Input
            type="number"
            value={formData.maxParticipants}
            onChange={(e) => setFormData({ ...formData, maxParticipants: Number.parseInt(e.target.value) })}
            className="mt-1"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <Label className="font-medium">Auto-grabación</Label>
            <p className="text-xs text-gray-600">Grabar reuniones automáticamente</p>
          </div>
          <Switch
            checked={formData.autoRecord}
            onCheckedChange={(checked) => setFormData({ ...formData, autoRecord: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <Label className="font-medium">Invitados externos</Label>
            <p className="text-xs text-gray-600">Permitir invitados fuera de la organización</p>
          </div>
          <Switch
            checked={formData.allowExternalGuests}
            onCheckedChange={(checked) => setFormData({ ...formData, allowExternalGuests: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <Label className="font-medium">Silenciar al entrar</Label>
            <p className="text-xs text-gray-600">Silenciar participantes automáticamente</p>
          </div>
          <Switch
            checked={formData.muteOnEntry}
            onCheckedChange={(checked) => setFormData({ ...formData, muteOnEntry: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <Label className="font-medium">Compartir pantalla</Label>
            <p className="text-xs text-gray-600">Permitir compartir pantalla</p>
          </div>
          <Switch
            checked={formData.allowScreenShare}
            onCheckedChange={(checked) => setFormData({ ...formData, allowScreenShare: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <Label className="font-medium">Chat habilitado</Label>
            <p className="text-xs text-gray-600">Permitir chat durante la reunión</p>
          </div>
          <Switch
            checked={formData.chatEnabled}
            onCheckedChange={(checked) => setFormData({ ...formData, chatEnabled: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <Label className="font-medium">Transmisión en vivo</Label>
            <p className="text-xs text-gray-600">Habilitar transmisión en vivo</p>
          </div>
          <Switch
            checked={formData.liveStreamEnabled}
            onCheckedChange={(checked) => setFormData({ ...formData, liveStreamEnabled: checked })}
          />
        </div>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button onClick={onCancel} variant="outline" className="flex-1 bg-transparent">
          Cancelar
        </Button>
        <Button onClick={() => onSave(formData)} className="flex-1">
          Guardar Configuración
        </Button>
      </div>
    </div>
  )
}

function TeamsConfigForm({
  config,
  onSave,
  onCancel,
}: { config: any; onSave: (config: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState(config)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Duración por defecto (minutos)</Label>
          <Input
            type="number"
            value={formData.defaultDuration}
            onChange={(e) => setFormData({ ...formData, defaultDuration: Number.parseInt(e.target.value) })}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Máximo de participantes</Label>
          <Input
            type="number"
            value={formData.maxParticipants}
            onChange={(e) => setFormData({ ...formData, maxParticipants: Number.parseInt(e.target.value) })}
            className="mt-1"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <Label className="font-medium">Auto-grabación</Label>
            <p className="text-xs text-gray-600">Grabar reuniones automáticamente</p>
          </div>
          <Switch
            checked={formData.autoRecord}
            onCheckedChange={(checked) => setFormData({ ...formData, autoRecord: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <Label className="font-medium">Sala de espera</Label>
            <p className="text-xs text-gray-600">Activar sala de espera por defecto</p>
          </div>
          <Switch
            checked={formData.waitingRoom}
            onCheckedChange={(checked) => setFormData({ ...formData, waitingRoom: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <Label className="font-medium">Silenciar al entrar</Label>
            <p className="text-xs text-gray-600">Silenciar participantes automáticamente</p>
          </div>
          <Switch
            checked={formData.muteOnEntry}
            onCheckedChange={(checked) => setFormData({ ...formData, muteOnEntry: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <Label className="font-medium">Compartir pantalla</Label>
            <p className="text-xs text-gray-600">Permitir compartir pantalla</p>
          </div>
          <Switch
            checked={formData.allowScreenShare}
            onCheckedChange={(checked) => setFormData({ ...formData, allowScreenShare: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <Label className="font-medium">Chat habilitado</Label>
            <p className="text-xs text-gray-600">Permitir chat durante la reunión</p>
          </div>
          <Switch
            checked={formData.chatEnabled}
            onCheckedChange={(checked) => setFormData({ ...formData, chatEnabled: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <Label className="font-medium">Usuarios anónimos</Label>
            <p className="text-xs text-gray-600">Permitir usuarios sin cuenta</p>
          </div>
          <Switch
            checked={formData.allowAnonymous}
            onCheckedChange={(checked) => setFormData({ ...formData, allowAnonymous: checked })}
          />
        </div>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button onClick={onCancel} variant="outline" className="flex-1 bg-transparent">
          Cancelar
        </Button>
        <Button onClick={() => onSave(formData)} className="flex-1">
          Guardar Configuración
        </Button>
      </div>
    </div>
  )
}
