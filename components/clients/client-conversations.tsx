"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, MessageSquare, ChevronDown, MessageCircle, Save } from "lucide-react"
import { WhatsAppChatLink } from "@/components/communications/whatsapp-chat-link"

type ClientConversationsProps = {
  clientId: string
  defaultWhatsAppPhone?: string
}

export default function ClientConversations({
  clientId,
  defaultWhatsAppPhone = "593983000700",
}: ClientConversationsProps) {
  const [channel, setChannel] = useState<"email" | "call" | "sms" | "whatsapp" | "note" | "task" | "meeting">("email")
  const [text, setText] = useState("")

  const labelByChannel: Record<typeof channel, string> = {
    email: "EMAIL",
    call: "CALL",
    sms: "SMS",
    whatsapp: "WHATSAPP",
    note: "NOTE",
    task: "TASK",
    meeting: "MEETING",
  }

  return (
    <section aria-labelledby="conversaciones-title">
      <h2 id="conversaciones-title" className="text-lg font-semibold mb-4">
        Conversaciones
      </h2>

      <Card>
        <CardContent className="p-4">
          {/* Toolbar de canales */}
          <div className="flex flex-wrap items-center gap-2">
            <Button variant={channel === "email" ? "default" : "outline"} size="sm" onClick={() => setChannel("email")}>
              <Mail className="h-4 w-4 mr-2" />
              Email
              <ChevronDown className="h-4 w-4 ml-2 opacity-60" />
            </Button>

            <Button variant={channel === "call" ? "default" : "outline"} size="sm" onClick={() => setChannel("call")}>
              <Phone className="h-4 w-4 mr-2" />
              Call
              <ChevronDown className="h-4 w-4 ml-2 opacity-60" />
            </Button>

            <Button variant={channel === "sms" ? "default" : "outline"} size="sm" onClick={() => setChannel("sms")}>
              <MessageSquare className="h-4 w-4 mr-2" />
              SMS
              <ChevronDown className="h-4 w-4 ml-2 opacity-60" />
            </Button>

            {/* WhatsApp con menú de acciones, incluyendo el enlace exacto solicitado */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={channel === "whatsapp" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChannel("whatsapp")}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                  <ChevronDown className="h-4 w-4 ml-2 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <div className="px-2 py-1.5 text-xs text-muted-foreground">Acciones</div>
                <DropdownMenuItem asChild>
                  {/* Exact anchor per user request */}
                  <WhatsAppChatLink
                    phone={defaultWhatsAppPhone}
                    message="Hola, vi su sitio web y quisiera más información."
                  >
                    Contáctanos por WhatsApp
                  </WhatsAppChatLink>
                </DropdownMenuItem>
                {/* Puedes agregar más acciones aquí, p.ej. Vincular teléfono (QR) */}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Otros atajos opcionales */}
            <Button variant={channel === "note" ? "default" : "outline"} size="sm" onClick={() => setChannel("note")}>
              Note
            </Button>
            <Button variant={channel === "task" ? "default" : "outline"} size="sm" onClick={() => setChannel("task")}>
              Task
            </Button>
            <Button
              variant={channel === "meeting" ? "default" : "outline"}
              size="sm"
              onClick={() => setChannel("meeting")}
            >
              Meeting
            </Button>
          </div>

          {/* Composer */}
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="secondary">{labelByChannel[channel]}</Badge>
            <Input
              placeholder={
                channel === "email"
                  ? "Escribe nota de Email (Bandeja de entrada)..."
                  : channel === "sms"
                    ? "Escribe nota de SMS..."
                    : channel === "whatsapp"
                      ? "Escribe nota o resumen del chat de WhatsApp..."
                      : "Escribe una nota..."
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>

          <Separator className="my-4" />

          {/* Timeline vacío (mock) */}
          <p className="text-sm text-muted-foreground">No conversations yet.</p>
        </CardContent>
      </Card>
    </section>
  )
}
