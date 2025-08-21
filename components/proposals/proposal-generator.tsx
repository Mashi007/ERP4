"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, User, Package } from "lucide-react"
import { toast } from "@/hooks/use-toast"

type Contact = {
  id: number
  name: string
  email: string
  phone?: string
  company?: string
  job_title?: string
}

type Service = {
  id: number
  name: string
  description: string
  category: string
  base_price: number
  currency: string
  duration_hours: number
  features: string[]
  deliverables: string[]
}

type Proposal = {
  id: number
  title: string
  content: string
  total_amount: number
  currency: string
  status: string
  created_at: string
}

interface ProposalGeneratorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact: Contact
  service: Service
  onProposalGenerated: (proposal: Proposal) => void
}

export default function ProposalGenerator({
  open,
  onOpenChange,
  contact,
  service,
  onProposalGenerated,
}: ProposalGeneratorProps) {
  const [generating, setGenerating] = useState(false)
  const [customRequirements, setCustomRequirements] = useState("")

  const handleGenerateProposal = async () => {
    try {
      setGenerating(true)

      const response = await fetch("/api/proposals/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactId: contact.id,
          serviceId: service.id,
          customRequirements: customRequirements.trim() || undefined,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        onProposalGenerated(data.proposal)
        onOpenChange(false)
        setCustomRequirements("")
        toast({
          title: "Propuesta generada",
          description: `Propuesta creada exitosamente con IA en ${data.generationTime}ms`,
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Error al generar propuesta")
      }
    } catch (error) {
      console.error("Error generating proposal:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo generar la propuesta",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Generar Propuesta con IA
          </DialogTitle>
          <DialogDescription>
            La IA creará una propuesta personalizada combinando la información del cliente y el servicio seleccionado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Nombre:</span> {contact.name}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {contact.email}
                </div>
                {contact.company && (
                  <div>
                    <span className="font-medium">Empresa:</span> {contact.company}
                  </div>
                )}
                {contact.job_title && (
                  <div>
                    <span className="font-medium">Cargo:</span> {contact.job_title}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Service Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" />
                Servicio Seleccionado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{service.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                </div>
                <Badge variant="secondary">{service.category}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Precio:</span> {service.base_price.toFixed(2)} {service.currency}
                </div>
                <div>
                  <span className="font-medium">Duración:</span> {service.duration_hours}h
                </div>
              </div>

              {service.features && service.features.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Características:</p>
                  <div className="flex flex-wrap gap-1">
                    {service.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Custom Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements">Requisitos Adicionales (Opcional)</Label>
            <Textarea
              id="requirements"
              placeholder="Describe cualquier requisito específico, preferencias del cliente, o información adicional que la IA debería considerar al generar la propuesta..."
              value={customRequirements}
              onChange={(e) => setCustomRequirements(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={generating}>
            Cancelar
          </Button>
          <Button onClick={handleGenerateProposal} disabled={generating} className="bg-blue-600 hover:bg-blue-700">
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando con IA...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generar Propuesta
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
