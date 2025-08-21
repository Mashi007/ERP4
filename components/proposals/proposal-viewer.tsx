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
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Download, Send, Eye, CheckCircle, Clock, DollarSign, Calendar } from "lucide-react"
import { toast } from "@/hooks/use-toast"

type Proposal = {
  id: number
  contact_id: number
  service_id: number
  title: string
  content: string
  total_amount: number
  currency: string
  status: string
  pdf_url?: string
  expires_at: string
  sent_at?: string
  viewed_at?: string
  signed_at?: string
  created_at: string
  contact_name?: string
  contact_email?: string
  service_name?: string
}

interface ProposalViewerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  proposal: Proposal | null
  onStatusUpdate?: (proposalId: number, newStatus: string) => void
}

export default function ProposalViewer({ open, onOpenChange, proposal, onStatusUpdate }: ProposalViewerProps) {
  const [updating, setUpdating] = useState(false)

  if (!proposal) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "sent":
        return "bg-blue-100 text-blue-800"
      case "viewed":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <FileText className="h-4 w-4" />
      case "sent":
        return <Send className="h-4 w-4" />
      case "viewed":
        return <Eye className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <Clock className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setUpdating(true)
      const response = await fetch("/api/proposals", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: proposal.id,
          status: newStatus,
        }),
      })

      if (response.ok) {
        onStatusUpdate?.(proposal.id, newStatus)
        toast({
          title: "Estado actualizado",
          description: `La propuesta se marcó como ${newStatus}`,
        })
      } else {
        throw new Error("Error al actualizar estado")
      }
    } catch (error) {
      console.error("Error updating proposal status:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la propuesta",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isExpired = new Date(proposal.expires_at) < new Date()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{proposal.title}</DialogTitle>
              <DialogDescription className="mt-1">
                Cliente: {proposal.contact_name} • Servicio: {proposal.service_name}
              </DialogDescription>
            </div>
            <Badge className={getStatusColor(proposal.status)}>
              {getStatusIcon(proposal.status)}
              <span className="ml-1 capitalize">{proposal.status}</span>
            </Badge>
          </div>
        </DialogHeader>

        {/* Proposal Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Valor</p>
                  <p className="font-semibold">
                    {proposal.total_amount.toFixed(2)} {proposal.currency}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Creada</p>
                  <p className="font-semibold text-sm">{formatDate(proposal.created_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Expira</p>
                  <p className={`font-semibold text-sm ${isExpired ? "text-red-600" : ""}`}>
                    {formatDate(proposal.expires_at)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Última vista</p>
                  <p className="font-semibold text-sm">
                    {proposal.viewed_at ? formatDate(proposal.viewed_at) : "No vista"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Proposal Content */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Contenido de la Propuesta</h3>
          <Card>
            <CardContent className="p-6">
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: proposal.content }} />
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>

          {proposal.status === "draft" && (
            <Button
              onClick={() => handleStatusUpdate("sent")}
              disabled={updating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="mr-2 h-4 w-4" />
              Marcar como Enviada
            </Button>
          )}

          {proposal.status === "sent" && (
            <Button onClick={() => handleStatusUpdate("viewed")} disabled={updating} variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Marcar como Vista
            </Button>
          )}

          {(proposal.status === "viewed" || proposal.status === "sent") && (
            <>
              <Button
                onClick={() => handleStatusUpdate("accepted")}
                disabled={updating}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Marcar como Aceptada
              </Button>
              <Button onClick={() => handleStatusUpdate("rejected")} disabled={updating} variant="destructive">
                Marcar como Rechazada
              </Button>
            </>
          )}

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
