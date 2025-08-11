"use client"

import { useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from "qrcode.react"
import { Copy } from "lucide-react"

type Props = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  seed?: string
  clientId?: string
}

export function WhatsappPairDialog({ open = false, onOpenChange = () => {}, seed = "", clientId = "0" }: Props) {
  // Construimos un “deep-link” ficticio para demo. En una integración real,
  // aquí iría el token/URL que devuelve tu backend de WhatsApp Business API.
  const link = useMemo(() => {
    const url = new URL("https://crm.local/whatsapp/pair")
    url.searchParams.set("seed", seed || crypto.randomUUID())
    url.searchParams.set("clientId", clientId)
    return url.toString()
  }, [seed, clientId])

  const [copied, setCopied] = useState(false)

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Vincular WhatsApp</DialogTitle>
          <DialogDescription>
            Escanea el código desde tu teléfono en WhatsApp {">"} Dispositivos vinculados {">"} Vincular dispositivo.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">
          <div className="rounded-lg border p-4 bg-white">
            <QRCodeSVG value={link} size={192} includeMargin />
          </div>
          <div className="w-full break-all rounded-md bg-muted p-2 text-xs text-muted-foreground">{link}</div>
        </div>

        <DialogFooter className="flex items-center justify-between gap-2 sm:justify-between">
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={copyToClipboard}>
              <Copy className="mr-2 h-4 w-4" />
              {copied ? "Copiado" : "Copiar enlace"}
            </Button>
            {/* El botón de refrescar debe originar un nuevo seed desde el padre mediante onOpenChange + props controladas */}
          </div>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>

        <div className="mt-2 text-xs text-muted-foreground">
          Nota: Esta es una demostración visual del flujo de vinculación. Integra tu backend para emitir tokens de
          emparejamiento válidos (WhatsApp Business/Cloud API) y confirmar el estado en tiempo real.
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WhatsappPairDialog
