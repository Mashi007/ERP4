"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, FileText, Download, Send, Mail, MessageCircle, ChevronDown } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Service {
  id: number
  name: string
  description: string
  base_price: number
  currency: string
}

interface ProposalTemplate {
  id: string
  name: string
  description: string
  type: string
}

export default function ClientPropuestasPage({ params }: { params: { id: string } }) {
  const [services, setServices] = useState<Service[]>([])
  const [proposalTemplates, setProposalTemplates] = useState<ProposalTemplate[]>([])
  const [selectedService, setSelectedService] = useState<string>("")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [generatedProposal, setGeneratedProposal] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [clientName, setClientName] = useState<string>("")
  const [proposalTitle, setProposalTitle] = useState<string>("")

  useEffect(() => {
    loadServices()
    loadProposalTemplates()
    loadClientInfo()
  }, [params.id])

  const loadServices = async () => {
    try {
      const response = await fetch("/api/services")
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch (error) {
      console.error("Error loading services:", error)
    }
  }

  const loadProposalTemplates = () => {
    const templates = [
      {
        id: "comercial",
        name: "Propuesta Comercial Estándar",
        description: "Propuesta formal para servicios comerciales",
        type: "comercial",
      },
      {
        id: "consultoria",
        name: "Propuesta de Consultoría",
        description: "Propuesta especializada en servicios de consultoría",
        type: "consultoria",
      },
      {
        id: "proyecto",
        name: "Propuesta de Proyecto",
        description: "Propuesta detallada para proyectos específicos",
        type: "proyecto",
      },
      {
        id: "mantenimiento",
        name: "Propuesta de Mantenimiento",
        description: "Propuesta para servicios de mantenimiento continuo",
        type: "mantenimiento",
      },
    ]
    setProposalTemplates(templates)
  }

  const loadClientInfo = async () => {
    try {
      const response = await fetch(`/api/contacts/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setClientName(data.contact?.name || "Cliente")
      }
    } catch (error) {
      console.error("Error loading client info:", error)
    }
  }

  const generateProposal = async () => {
    if (!selectedService || !selectedTemplate) {
      toast({
        title: "Selección incompleta",
        description: "Por favor selecciona un servicio y un tipo de propuesta.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const selectedServiceData = services.find((s) => s.id.toString() === selectedService)
      const selectedTemplateData = proposalTemplates.find((t) => t.id === selectedTemplate)

      const response = await fetch("/api/proposals/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: params.id,
          clientName,
          service: selectedServiceData,
          template: selectedTemplateData,
          proposalTitle: proposalTitle || `Propuesta ${selectedTemplateData?.name}`,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedProposal(data.proposal)
        toast({
          title: "Propuesta generada",
          description: "La propuesta ha sido creada exitosamente con IA.",
        })
      } else {
        throw new Error("Error generating proposal")
      }
    } catch (error) {
      console.error("Error generating proposal:", error)
      toast({
        title: "Error",
        description: "No se pudo generar la propuesta. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadProposal = () => {
    if (!generatedProposal) return

    const blob = new Blob([generatedProposal], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `propuesta-${clientName}-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const sendProposalByEmail = async () => {
    if (!generatedProposal) return

    try {
      const response = await fetch("/api/proposals/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: params.id,
          clientName,
          proposal: generatedProposal,
          method: "email",
          title: proposalTitle || "Propuesta Comercial",
        }),
      })

      if (response.ok) {
        toast({
          title: "Propuesta enviada",
          description: "La propuesta ha sido enviada por email exitosamente.",
        })
      } else {
        throw new Error("Error sending email")
      }
    } catch (error) {
      console.error("Error sending proposal by email:", error)
      toast({
        title: "Error",
        description: "No se pudo enviar la propuesta por email.",
        variant: "destructive",
      })
    }
  }

  const sendProposalByWhatsApp = async () => {
    if (!generatedProposal) return

    try {
      const response = await fetch("/api/proposals/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: params.id,
          clientName,
          proposal: generatedProposal,
          method: "whatsapp",
          title: proposalTitle || "Propuesta Comercial",
        }),
      })

      if (response.ok) {
        toast({
          title: "Propuesta enviada",
          description: "La propuesta ha sido enviada por WhatsApp exitosamente.",
        })
      } else {
        throw new Error("Error sending WhatsApp")
      }
    } catch (error) {
      console.error("Error sending proposal by WhatsApp:", error)
      toast({
        title: "Error",
        description: "No se pudo enviar la propuesta por WhatsApp.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Propuestas para {clientName}</h1>
        <p className="text-sm text-muted-foreground">Genera propuestas comerciales personalizadas usando IA</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Catálogo de Servicios
            </CardTitle>
            <CardDescription>Selecciona el servicio que deseas incluir en la propuesta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar servicio..." />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-medium">{service.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {service.base_price} {service.currency}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedService && (
              <div className="p-3 bg-muted rounded-lg">
                {(() => {
                  const service = services.find((s) => s.id.toString() === selectedService)
                  return service ? (
                    <div>
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                      <Badge variant="secondary" className="mt-2">
                        {service.base_price} {service.currency}
                      </Badge>
                    </div>
                  ) : null
                })()}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Tipo de Propuesta
            </CardTitle>
            <CardDescription>Selecciona el formato de propuesta más adecuado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo de propuesta..." />
              </SelectTrigger>
              <SelectContent>
                {proposalTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{template.name}</span>
                      <span className="text-sm text-muted-foreground">{template.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedTemplate && (
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  {(() => {
                    const template = proposalTemplates.find((t) => t.id === selectedTemplate)
                    return template ? (
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                        <Badge variant="outline" className="mt-2">
                          {template.type}
                        </Badge>
                      </div>
                    ) : null
                  })()}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proposal-title">Título de la Propuesta</Label>
                  <Input
                    id="proposal-title"
                    placeholder="Ej: Propuesta de Servicios de Consultoría"
                    value={proposalTitle}
                    onChange={(e) => setProposalTitle(e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generar Propuesta con IA</CardTitle>
          <CardDescription>
            La inteligencia artificial creará una propuesta personalizada combinando el servicio y tipo seleccionados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={generateProposal}
            disabled={!selectedService || !selectedTemplate || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando propuesta...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generar Propuesta
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedProposal && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Propuesta Generada
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={downloadProposal}>
                  <Download className="mr-2 h-4 w-4" />
                  Descargar
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm">
                      <Send className="mr-2 h-4 w-4" />
                      Enviar
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={sendProposalByEmail}>
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={sendProposalByWhatsApp}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generatedProposal}
              onChange={(e) => setGeneratedProposal(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
              placeholder="La propuesta generada aparecerá aquí..."
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
