"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
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
  Key,
  User,
  Server,
  Video,
  Copy,
  Trash2,
  Webhook,
} from "lucide-react"

export default function CommunicationsConfiguration() {
  const [activeTab, setActiveTab] = useState("connect-email")
  const [isLoading, setIsLoading] = useState(false)

  const [credentialDialog, setCredentialDialog] = useState({
    isOpen: false,
    providerId: null,
    providerType: null,
    providerName: "",
  })

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    apiKey: "",
    clientId: "",
    clientSecret: "",
    serverUrl: "",
    port: "",
  })

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

  const [showWebhookConfig, setShowWebhookConfig] = useState(false)
  const [showRestApiConfig, setShowRestApiConfig] = useState(false)
  const [showZapierConfig, setShowZapierConfig] = useState(false)
  const [webhookConfig, setWebhookConfig] = useState({
    endpoints: [
      { url: "https://api.example.com/webhook/contacts", events: ["contact.created", "contact.updated"], active: true },
      { url: "https://api.example.com/webhook/deals", events: ["deal.created", "deal.won"], active: true },
    ],
    retryAttempts: 3,
    timeout: 30,
  })
  const [restApiConfig, setRestApiConfig] = useState({
    keys: [
      { name: "Production Key", key: "sk-prod-abc123...", permissions: ["read", "write"], lastUsed: "2025-01-14" },
    ],
    rateLimits: { requestsPerMinute: 1000, requestsPerHour: 10000 },
    allowedIPs: ["192.168.1.1", "10.0.0.1"],
  })
  const [zapierConfig, setZapierConfig] = useState({
    connections: [],
    availableApps: ["Gmail", "Slack", "Trello", "Google Sheets", "HubSpot"],
    webhookUrl: "https://hooks.zapier.com/hooks/catch/123456/abcdef/",
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

  const openCredentialDialog = (providerId, providerType, providerName) => {
    setCredentialDialog({
      isOpen: true,
      providerId,
      providerType,
      providerName,
    })
    // Load existing credentials if any
    setCredentials({
      username: "",
      password: "",
      apiKey: "",
      clientId: "",
      clientSecret: "",
      serverUrl: "",
      port: "",
    })
  }

  const saveCredentials = async () => {
    try {
      setIsLoading(true)

      // Simulate API call to save credentials
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Credenciales guardadas",
        description: `Configuración de ${credentialDialog.providerName} actualizada correctamente.`,
      })

      setCredentialDialog({ isOpen: false, providerId: null, providerType: null, providerName: "" })
      setCredentials({
        username: "",
        password: "",
        apiKey: "",
        clientId: "",
        clientSecret: "",
        serverUrl: "",
        port: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron guardar las credenciales.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const ProviderCard = ({ provider, type, onToggleFavorite, onConnect, onDisconnect }) => (
    <Card className={`transition-all duration-200 hover:shadow-md ${provider.color} border-2`}>
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
              onCheckedChange={() => onToggleFavorite(provider.id, type)}
              className="flex-shrink-0"
            />
            <Label className="text-xs font-medium text-gray-700 truncate">Proveedor favorito</Label>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => openCredentialDialog(provider.id, type, provider.name)}
            className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 text-xs mb-2"
          >
            <Key className="h-3 w-3 mr-1" />
            Configurar Credenciales
          </Button>

          <div className="w-full">
            {provider.status === "connected" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDisconnect(provider.id, type)}
                disabled={isLoading}
                className="w-full border-red-300 text-red-700 hover:bg-red-50 text-xs"
              >
                {isLoading ? "Desconectando..." : "Desconectar"}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => onConnect(provider.id, type)}
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

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openCredentialDialog(provider.id, "conference", provider.name)}
                              className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 text-xs mb-2"
                            >
                              <Key className="h-3 w-3 mr-1" />
                              Configurar Credenciales
                            </Button>

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
                        <span>Endpoints: {webhookConfig.endpoints.length}</span>
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
                        onClick={() => setShowWebhookConfig(true)}
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
                        <span>API Keys: {restApiConfig.keys.length}</span>
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
                        onClick={() => setShowRestApiConfig(true)}
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
                        <span>Conexiones: {zapierConfig.connections.length}</span>
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
                        onClick={() => setShowZapierConfig(true)}
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

        <Dialog
          open={credentialDialog.isOpen}
          onOpenChange={(open) =>
            !open && setCredentialDialog({ isOpen: false, providerId: null, providerType: null, providerName: "" })
          }
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center text-xl">
                <Key className="h-5 w-5 mr-2 text-purple-600" />
                Configurar Credenciales - {credentialDialog.providerName}
              </DialogTitle>
              <DialogDescription>
                Configure las credenciales y parámetros de conexión para {credentialDialog.providerName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Basic Authentication */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Autenticación Básica
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username" className="text-sm font-medium">
                      Usuario/Email
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="usuario@ejemplo.com"
                      value={credentials.username}
                      onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-sm font-medium">
                      Contraseña
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={credentials.password}
                      onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* API Configuration */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Code className="h-4 w-4 mr-2" />
                  Configuración API
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="apiKey" className="text-sm font-medium">
                      API Key
                    </Label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="sk-..."
                      value={credentials.apiKey}
                      onChange={(e) => setCredentials((prev) => ({ ...prev, apiKey: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientId" className="text-sm font-medium">
                      Client ID
                    </Label>
                    <Input
                      id="clientId"
                      type="text"
                      placeholder="client_id_123"
                      value={credentials.clientId}
                      onChange={(e) => setCredentials((prev) => ({ ...prev, clientId: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="clientSecret" className="text-sm font-medium">
                      Client Secret
                    </Label>
                    <Input
                      id="clientSecret"
                      type="password"
                      placeholder="••••••••••••••••"
                      value={credentials.clientSecret}
                      onChange={(e) => setCredentials((prev) => ({ ...prev, clientSecret: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Server Configuration */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Server className="h-4 w-4 mr-2" />
                  Configuración del Servidor
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="serverUrl" className="text-sm font-medium">
                      URL del Servidor
                    </Label>
                    <Input
                      id="serverUrl"
                      type="url"
                      placeholder="https://api.ejemplo.com"
                      value={credentials.serverUrl}
                      onChange={(e) => setCredentials((prev) => ({ ...prev, serverUrl: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="port" className="text-sm font-medium">
                      Puerto
                    </Label>
                    <Input
                      id="port"
                      type="number"
                      placeholder="443"
                      value={credentials.port}
                      onChange={(e) => setCredentials((prev) => ({ ...prev, port: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Provider-specific settings */}
              {credentialDialog.providerType === "email" && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Configuración de Email
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="smtp-ssl" />
                      <Label htmlFor="smtp-ssl" className="text-sm">
                        Usar SSL/TLS
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-sync" />
                      <Label htmlFor="auto-sync" className="text-sm">
                        Sincronización automática
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {credentialDialog.providerType === "calendar" && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Configuración de Calendario
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="sync-events" />
                      <Label htmlFor="sync-events" className="text-sm">
                        Sincronizar eventos
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="notifications" />
                      <Label htmlFor="notifications" className="text-sm">
                        Notificaciones
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {credentialDialog.providerType === "conference" && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <Video className="h-4 w-4 mr-2" />
                    Configuración de Conferencias
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-record" />
                      <Label htmlFor="auto-record" className="text-sm">
                        Grabación automática
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="waiting-room" />
                      <Label htmlFor="waiting-room" className="text-sm">
                        Sala de espera
                      </Label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() =>
                  setCredentialDialog({ isOpen: false, providerId: null, providerType: null, providerName: "" })
                }
              >
                Cancelar
              </Button>
              <Button onClick={saveCredentials} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                {isLoading ? "Guardando..." : "Guardar Credenciales"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showWebhookConfig} onOpenChange={setShowWebhookConfig}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Webhook className="h-5 w-5 mr-2 text-green-600" />
                Configuración de Webhooks
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-4">Endpoints Configurados</h4>
                <div className="space-y-3">
                  {webhookConfig.endpoints.map((endpoint, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <Input
                          value={endpoint.url}
                          onChange={(e) => {
                            const newEndpoints = [...webhookConfig.endpoints]
                            newEndpoints[index].url = e.target.value
                            setWebhookConfig((prev) => ({ ...prev, endpoints: newEndpoints }))
                          }}
                          placeholder="https://api.example.com/webhook"
                          className="flex-1 mr-2"
                        />
                        <Switch
                          checked={endpoint.active}
                          onCheckedChange={(checked) => {
                            const newEndpoints = [...webhookConfig.endpoints]
                            newEndpoints[index].active = checked
                            setWebhookConfig((prev) => ({ ...prev, endpoints: newEndpoints }))
                          }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {endpoint.events.map((event, eventIndex) => (
                          <Badge key={eventIndex} variant="secondary" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="mt-3 bg-transparent"
                  onClick={() => {
                    setWebhookConfig((prev) => ({
                      ...prev,
                      endpoints: [...prev.endpoints, { url: "", events: ["contact.created"], active: true }],
                    }))
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Endpoint
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Intentos de Reintento</Label>
                  <Input
                    type="number"
                    value={webhookConfig.retryAttempts}
                    onChange={(e) =>
                      setWebhookConfig((prev) => ({ ...prev, retryAttempts: Number.parseInt(e.target.value) }))
                    }
                    min="1"
                    max="10"
                  />
                </div>
                <div>
                  <Label>Timeout (segundos)</Label>
                  <Input
                    type="number"
                    value={webhookConfig.timeout}
                    onChange={(e) =>
                      setWebhookConfig((prev) => ({ ...prev, timeout: Number.parseInt(e.target.value) }))
                    }
                    min="5"
                    max="300"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowWebhookConfig(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  toast.success("Configuración de webhooks guardada")
                  setShowWebhookConfig(false)
                }}
              >
                Guardar Configuración
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showRestApiConfig} onOpenChange={setShowRestApiConfig}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Code className="h-5 w-5 mr-2 text-blue-600" />
                Configuración REST API
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-4">API Keys</h4>
                <div className="space-y-3">
                  {restApiConfig.keys.map((apiKey, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50">
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <Label>Nombre</Label>
                          <Input
                            value={apiKey.name}
                            onChange={(e) => {
                              const newKeys = [...restApiConfig.keys]
                              newKeys[index].name = e.target.value
                              setRestApiConfig((prev) => ({ ...prev, keys: newKeys }))
                            }}
                          />
                        </div>
                        <div>
                          <Label>Último Uso</Label>
                          <Input value={apiKey.lastUsed} disabled />
                        </div>
                      </div>
                      <div className="mb-3">
                        <Label>API Key</Label>
                        <div className="flex items-center space-x-2">
                          <Input type="password" value={apiKey.key} disabled className="flex-1" />
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {apiKey.permissions.map((permission, permIndex) => (
                          <Badge key={permIndex} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="mt-3 bg-transparent"
                  onClick={() => {
                    const newKey = `sk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                    setRestApiConfig((prev) => ({
                      ...prev,
                      keys: [
                        ...prev.keys,
                        {
                          name: "Nueva API Key",
                          key: newKey,
                          permissions: ["read"],
                          lastUsed: "Nunca",
                        },
                      ],
                    }))
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Generar Nueva API Key
                </Button>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Límites de Velocidad</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Requests por Minuto</Label>
                    <Input
                      type="number"
                      value={restApiConfig.rateLimits.requestsPerMinute}
                      onChange={(e) =>
                        setRestApiConfig((prev) => ({
                          ...prev,
                          rateLimits: { ...prev.rateLimits, requestsPerMinute: Number.parseInt(e.target.value) },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Requests por Hora</Label>
                    <Input
                      type="number"
                      value={restApiConfig.rateLimits.requestsPerHour}
                      onChange={(e) =>
                        setRestApiConfig((prev) => ({
                          ...prev,
                          rateLimits: { ...prev.rateLimits, requestsPerHour: Number.parseInt(e.target.value) },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">IPs Permitidas</h4>
                <div className="space-y-2">
                  {restApiConfig.allowedIPs.map((ip, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={ip}
                        onChange={(e) => {
                          const newIPs = [...restApiConfig.allowedIPs]
                          newIPs[index] = e.target.value
                          setRestApiConfig((prev) => ({ ...prev, allowedIPs: newIPs }))
                        }}
                        placeholder="192.168.1.1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newIPs = restApiConfig.allowedIPs.filter((_, i) => i !== index)
                          setRestApiConfig((prev) => ({ ...prev, allowedIPs: newIPs }))
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setRestApiConfig((prev) => ({
                        ...prev,
                        allowedIPs: [...prev.allowedIPs, ""],
                      }))
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar IP
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowRestApiConfig(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  toast.success("Configuración REST API guardada")
                  setShowRestApiConfig(false)
                }}
              >
                Guardar Configuración
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showZapierConfig} onOpenChange={setShowZapierConfig}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-orange-600" />
                Configuración de Zapier
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-4">URL del Webhook</h4>
                <div className="flex items-center space-x-2">
                  <Input
                    value={zapierConfig.webhookUrl}
                    onChange={(e) => setZapierConfig((prev) => ({ ...prev, webhookUrl: e.target.value }))}
                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">Esta URL se usa para enviar datos desde tu CRM a Zapier</p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Conexiones Activas</h4>
                {zapierConfig.connections.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Zap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No hay conexiones activas</p>
                    <p className="text-sm">Conecta tu CRM con aplicaciones en Zapier</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {zapierConfig.connections.map((connection, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium">{connection.name}</h5>
                            <p className="text-sm text-gray-600">{connection.description}</p>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Activo
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-semibold mb-4">Aplicaciones Disponibles</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {zapierConfig.availableApps.map((app, index) => (
                    <div key={index} className="p-3 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
                      <div className="text-2xl mb-2">📱</div>
                      <p className="text-sm font-medium">{app}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">¿Cómo conectar con Zapier?</h5>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Copia la URL del webhook de arriba</li>
                  <li>2. Ve a Zapier y crea un nuevo Zap</li>
                  <li>3. Selecciona "Webhooks by Zapier" como trigger</li>
                  <li>4. Pega la URL del webhook</li>
                  <li>5. Configura la aplicación de destino</li>
                </ol>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowZapierConfig(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  toast.success("Configuración de Zapier guardada")
                  setShowZapierConfig(false)
                }}
              >
                Guardar Configuración
              </Button>
            </div>
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
