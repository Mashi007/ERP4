"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PenTool, Trash2, CheckCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface DigitalSignatureProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  proposalId: number
  proposalTitle: string
  contactName: string
  contactEmail: string
  onSignatureComplete: (signatureData: any) => void
}

export default function DigitalSignature({
  open,
  onOpenChange,
  proposalId,
  proposalTitle,
  contactName,
  contactEmail,
  onSignatureComplete,
}: DigitalSignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signerName, setSignerName] = useState(contactName)
  const [signerEmail, setSignerEmail] = useState(contactEmail)
  const [signing, setSigning] = useState(false)

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const handleSign = async () => {
    const canvas = canvasRef.current
    if (!canvas || !signerName.trim()) {
      toast({
        title: "Error",
        description: "Por favor, ingrese su nombre y firme en el área designada",
        variant: "destructive",
      })
      return
    }

    try {
      setSigning(true)

      // Get signature as base64
      const signatureData = canvas.toDataURL("image/png")

      // Check if canvas is empty (just white)
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const isEmpty = imageData.data.every((value, index) => {
        // Check if pixel is white or transparent
        return index % 4 === 3 ? value === 0 : value === 255
      })

      if (isEmpty) {
        toast({
          title: "Error",
          description: "Por favor, firme en el área designada",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`/api/proposals/${proposalId}/signature`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signatureData,
          signerName: signerName.trim(),
          signerEmail: signerEmail.trim(),
          signedAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        const result = await response.json()
        onSignatureComplete(result)
        onOpenChange(false)
        toast({
          title: "Propuesta firmada",
          description: "La propuesta ha sido firmada digitalmente con éxito",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Error al procesar la firma")
      }
    } catch (error) {
      console.error("Error signing proposal:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo procesar la firma digital",
        variant: "destructive",
      })
    } finally {
      setSigning(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            Firma Digital
          </DialogTitle>
          <DialogDescription>Firme digitalmente para aceptar la propuesta</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Proposal Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Propuesta a Firmar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{proposalTitle}</p>
              <p className="text-sm text-gray-600 mt-1">ID: {proposalId}</p>
            </CardContent>
          </Card>

          {/* Signer Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="signer-name">Nombre Completo *</Label>
              <Input
                id="signer-name"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="Ingrese su nombre completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signer-email">Email</Label>
              <Input
                id="signer-email"
                type="email"
                value={signerEmail}
                onChange={(e) => setSignerEmail(e.target.value)}
                placeholder="su@email.com"
              />
            </div>
          </div>

          <Separator />

          {/* Signature Canvas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Área de Firma *</Label>
              <Button variant="outline" size="sm" onClick={clearSignature}>
                <Trash2 className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            </div>
            <Card>
              <CardContent className="p-4">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={200}
                  className="border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair w-full"
                  style={{ touchAction: "none" }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Haga clic y arrastre para firmar en el área de arriba
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Legal Notice */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">Declaración Legal</p>
                  <p className="text-blue-800">
                    Al firmar este documento, confirmo que he leído, entendido y acepto todos los términos y condiciones
                    establecidos en esta propuesta. Esta firma digital tiene la misma validez legal que una firma
                    manuscrita.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={signing}>
            Cancelar
          </Button>
          <Button
            onClick={handleSign}
            disabled={signing || !signerName.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            {signing ? (
              <>
                <PenTool className="mr-2 h-4 w-4 animate-pulse" />
                Procesando Firma...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Firmar Propuesta
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
