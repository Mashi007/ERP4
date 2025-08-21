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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, MessageCircle, Send, User, Package, DollarSign, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

type Proposal = {
  id: number
  title: string
  total_amount: number
  currency: string
  contact_name: string
  contact_email: string
  contact_phone: string
  contact_company: string
  service_name: string
  status: string
}

interface ProposalSenderProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  proposal: Proposal
  onSent: (method: string) => void
}

export default function ProposalSender({ open, onOpenChange, proposal, onSent }: ProposalSenderProps) {
  const [sendMethod, setSendMethod] = useState<"email" | "whatsapp">("email")
  const [customMessage, setCustomMessage] = useState("")
  const [sending, setSending] = useState(false)

  const getDefaultMessage = (method: "email" | "whatsapp") => {
    if (method === "email") {
      return `Estimado/a ${proposal.contact_name},

Espero que se encuentre bien. Me complace enviarle la propuesta para ${proposal.service_name}.

He preparado una propuesta detallada que incluye todos los aspectos que discutimos. La inversión total es de ${proposal.total_amount.toFixed(2)} ${proposal.currency}.

Puede revisar la propuesta completa en el documento adjunto. Si tiene alguna pregunta o necesita aclaraciones, no dude en contactarme.

Quedo atento a sus comentarios.

Saludos cordiales,
Equipo de NormaPymes CRM`
    } else {
      return `Hola ${proposal.contact_name} 👋

Te envío la propuesta para *${proposal.service_name}*

📋 *${proposal.title}*
💰 Inversión: ${proposal.total_amount.toFixed(2)} ${proposal.currency}

¿Te parece si coordinamos una llamada para revisar los detalles?

Saludos! 🚀`
    }
  }

  const handleSend = async () => {
    try {
      setSending(true)

      const response = await fetch(`/api/proposals/${proposal.id}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: sendMethod,
          customMessage: customMessage.trim() || undefined,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        onSent(sendMethod)
        onOpenChange(false)
        setCustomMessage("")
        toast({
          title: "Propuesta enviada",
          description: result.message,
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Error al enviar propuesta")
      }
    } catch (error) {
      console.error("Error sending proposal:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo enviar la propuesta",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const canSendEmail = proposal.contact_email && proposal.contact_email.trim() !== ""
  const canSendWhatsApp = proposal.contact_phone && proposal.contact_phone.trim() !== ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Enviar Propuesta
          </DialogTitle>
          <DialogDescription>Selecciona el método de envío y personaliza el mensaje</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Proposal Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" />
                Resumen de la Propuesta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{proposal.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">Servicio: {proposal.service_name}</p>
                </div>
                <Badge variant="secondary">{proposal.status}</Badge>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{proposal.contact_name}</span>
                  {proposal.contact_company && <span>• {proposal.contact_company}</span>}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-semibold">
                    {proposal.total_amount.toFixed(2)} {proposal.currency}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Send Method Selection */}
          <div className="space-y-3">
            <Label>Método de Envío</Label>
            <RadioGroup value={sendMethod} onValueChange={(value) => setSendMethod(value as "email" | "whatsapp")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" disabled={!canSendEmail} />
                <Label htmlFor="email" className={`flex items-center gap-2 ${!canSendEmail ? "opacity-50" : ""}`}>
                  <Mail className="h-4 w-4" />
                  Email
                  {proposal.contact_email && <span className="text-sm text-gray-500">({proposal.contact_email})</span>}
                  {!canSendEmail && <Badge variant="destructive">No disponible</Badge>}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="whatsapp" id="whatsapp" disabled={!canSendWhatsApp} />
                <Label htmlFor="whatsapp" className={`flex items-center gap-2 ${!canSendWhatsApp ? "opacity-50" : ""}`}>
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                  {proposal.contact_phone && <span className="text-sm text-gray-500">({proposal.contact_phone})</span>}
                  {!canSendWhatsApp && <Badge variant="destructive">No disponible</Badge>}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Message Customization */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="custom-message">Mensaje Personalizado</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCustomMessage(getDefaultMessage(sendMethod))}
                type="button"
              >
                Usar Plantilla
              </Button>
            </div>
            <Textarea
              id="custom-message"
              placeholder={`Mensaje ${sendMethod === "email" ? "de email" : "de WhatsApp"} personalizado...`}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={sendMethod === "email" ? 8 : 6}
            />
            {!customMessage && (
              <p className="text-xs text-gray-500">
                Si no personalizas el mensaje, se usará la plantilla predeterminada
              </p>
            )}
          </div>

          {/* Preview */}
          {customMessage && (
            <Card className="bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Vista Previa del Mensaje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm whitespace-pre-wrap bg-white p-3 rounded border">{customMessage}</div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>
            Cancelar
          </Button>
          <Button
            onClick={handleSend}
            disabled={
              sending || (!canSendEmail && sendMethod === "email") || (!canSendWhatsApp && sendMethod === "whatsapp")
            }
            className={sendMethod === "email" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}
          >
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                {sendMethod === "email" ? (
                  <Mail className="mr-2 h-4 w-4" />
                ) : (
                  <MessageCircle className="mr-2 h-4 w-4" />
                )}
                Enviar por {sendMethod === "email" ? "Email" : "WhatsApp"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
