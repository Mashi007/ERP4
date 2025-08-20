"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Mail, Users, Send, Bot, Sparkles, Loader2, Search, CheckCircle, User, Building, AtSign } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Contact {
  id: number
  name: string
  email: string
  company?: string
  phone?: string
  status: string
  industry?: string
  source?: string
  sales_owner?: string
}

export default function EmailMarketingSection() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContacts, setSelectedContacts] = useState<number[]>([])
  const [emailSubject, setEmailSubject] = useState("")
  const [emailContent, setEmailContent] = useState("")
  const [isLoadingContacts, setIsLoadingContacts] = useState(true)
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("all")
  const [selectedSource, setSelectedSource] = useState("all")
  const [selectedResponsible, setSelectedResponsible] = useState("all")
  const [industries, setIndustries] = useState<string[]>([])
  const [sources, setSources] = useState<string[]>([])
  const [responsibleUsers, setResponsibleUsers] = useState<Array<{ id: string; name: string }>>([])

  useEffect(() => {
    fetchContacts()
    fetchFilterOptions()
  }, [selectedIndustry, selectedSource, selectedResponsible])

  const fetchFilterOptions = async () => {
    try {
      const [industriesRes, sourcesRes, usersRes] = await Promise.all([
        fetch("/api/contacts/industries"),
        fetch("/api/contacts/sources"),
        fetch("/api/users"),
      ])

      const industriesData = await industriesRes.json()
      const sourcesData = await sourcesRes.json()
      const usersData = await usersRes.json()

      setIndustries(industriesData.industries || [])
      setSources(sourcesData.sources || [])
      setResponsibleUsers(usersData.map((user: any) => ({ id: user.id.toString(), name: user.name })) || [])
    } catch (error) {
      console.error("Error fetching filter options:", error)
    }
  }

  const fetchContacts = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedIndustry !== "all") params.append("industry", selectedIndustry)
      if (selectedSource !== "all") params.append("source", selectedSource)
      if (selectedResponsible !== "all") params.append("responsible", selectedResponsible)

      const response = await fetch(`/api/contacts?${params.toString()}`)
      const data = await response.json()

      if (Array.isArray(data)) {
        setContacts(data)
      } else if (data && Array.isArray(data.contacts)) {
        setContacts(data.contacts)
      } else {
        console.error("API response is not an array:", data)
        setContacts([])
        toast.error("Error: formato de datos de contactos incorrecto")
      }
    } catch (error) {
      console.error("Error fetching contacts:", error)
      setContacts([])
      toast.error("Error al cargar contactos")
    } finally {
      setIsLoadingContacts(false)
    }
  }

  const generateEmailWithAI = async (prompt: string) => {
    setIsGeneratingEmail(true)
    try {
      const response = await fetch("/api/marketing/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          selectedContacts: selectedContacts.length,
          context: "email marketing campaign",
        }),
      })

      if (!response.ok) throw new Error("Error generating email")

      const reader = response.body?.getReader()
      let result = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          result += new TextDecoder().decode(value)
        }
      }

      try {
        const emailData = JSON.parse(result)
        setEmailSubject(emailData.subject || "Asunto generado por IA")
        setEmailContent(emailData.content || result)
      } catch {
        const lines = result.split("\n")
        const subjectLine = lines.find(
          (line) => line.toLowerCase().includes("asunto:") || line.toLowerCase().includes("subject:"),
        )
        if (subjectLine) {
          setEmailSubject(subjectLine.replace(/asunto:|subject:/i, "").trim())
          setEmailContent(
            lines
              .filter((line) => line !== subjectLine)
              .join("\n")
              .trim(),
          )
        } else {
          setEmailContent(result)
        }
      }

      toast.success("Email generado con Grok AI exitosamente")
    } catch (error) {
      console.error("Error generating email:", error)
      toast.error("Error al generar email con IA")
    } finally {
      setIsGeneratingEmail(false)
    }
  }

  const sendEmail = async () => {
    if (!emailSubject.trim() || !emailContent.trim()) {
      toast.error("Por favor completa el asunto y contenido del email")
      return
    }

    if (selectedContacts.length === 0) {
      toast.error("Por favor selecciona al menos un contacto")
      return
    }

    setIsSendingEmail(true)
    try {
      const response = await fetch("/api/marketing/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: emailSubject,
          content: emailContent,
          contactIds: selectedContacts,
        }),
      })

      const result = await response.json()
      if (result.success) {
        toast.success(`Email enviado exitosamente a ${selectedContacts.length} contactos`)
        setEmailSubject("")
        setEmailContent("")
        setSelectedContacts([])
      } else {
        throw new Error(result.error || "Error sending email")
      }
    } catch (error) {
      console.error("Error sending email:", error)
      toast.error("Error al enviar email")
    } finally {
      setIsSendingEmail(false)
    }
  }

  const toggleContactSelection = (contactId: number) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId],
    )
  }

  const selectAllContacts = () => {
    const filteredContacts = Array.isArray(contacts)
      ? contacts.filter(
          (contact) =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : []
    setSelectedContacts(filteredContacts.map((contact) => contact.id))
  }

  const clearSelection = () => {
    setSelectedContacts([])
  }

  const handleFilterChange = (filters: any) => {
    setSelectedIndustry(filters.industry || "all")
    setSelectedSource(filters.source || "all")
    setSelectedResponsible(filters.responsible || "all")
  }

  const filteredContacts = Array.isArray(contacts)
    ? contacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    : []

  const emailPrompts = [
    "Crear un email promocional para nuevos productos con descuento especial",
    "Redactar un email de seguimiento para clientes inactivos",
    "Escribir un email de agradecimiento post-compra con recomendaciones",
    "Crear un email informativo sobre actualizaciones de servicios",
    "Redactar un email de invitación a evento exclusivo para clientes VIP",
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Client Selection */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-600" />
                Seleccionar Clientes
              </span>
              <Badge variant="secondary">{selectedContacts.length} seleccionados</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="grid gap-3">
                  <div className="grid gap-1">
                    <Label>Industria</Label>
                    <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1">
                    <Label>Fuente</Label>
                    <Select value={selectedSource} onValueChange={setSelectedSource}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {sources.map((source) => (
                          <SelectItem key={source} value={source}>
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1">
                    <Label>Responsable Comercial</Label>
                    <Select value={selectedResponsible} onValueChange={setSelectedResponsible}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {responsibleUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar clientes..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={selectAllContacts} className="flex-1 bg-transparent">
                  Seleccionar Todos
                </Button>
                <Button variant="outline" size="sm" onClick={clearSelection} className="flex-1 bg-transparent">
                  Limpiar
                </Button>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {isLoadingContacts ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedContacts.includes(contact.id) ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50"
                      }`}
                      onClick={() => toggleContactSelection(contact.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedContacts.includes(contact.id)}
                          onChange={() => toggleContactSelection(contact.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <AtSign className="h-3 w-3 text-gray-400" />
                            <p className="text-xs text-gray-600 truncate">{contact.email}</p>
                          </div>
                          {contact.company && (
                            <div className="flex items-center space-x-2 mt-1">
                              <Building className="h-3 w-3 text-gray-400" />
                              <p className="text-xs text-gray-500 truncate">{contact.company}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Composition */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5 text-green-600" />
              Redactar Email con Grok AI
              <Badge className="ml-2 bg-green-100 text-green-800">Grok-4</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* AI Prompts */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Sugerencias de IA para redactar email:</Label>
                <div className="grid gap-2">
                  {emailPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto p-3 bg-transparent hover:bg-blue-50"
                      onClick={() => generateEmailWithAI(prompt)}
                      disabled={isGeneratingEmail}
                    >
                      <Bot className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm break-words">{prompt}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom AI Prompt */}
              <div className="flex space-x-2">
                <Input
                  placeholder="O escribe tu propia idea para el email..."
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      generateEmailWithAI(e.currentTarget.value)
                      e.currentTarget.value = ""
                    }
                  }}
                />
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement
                    if (input.value.trim()) {
                      generateEmailWithAI(input.value)
                      input.value = ""
                    }
                  }}
                  disabled={isGeneratingEmail}
                >
                  {isGeneratingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                </Button>
              </div>

              {/* Email Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email-subject">Asunto del Email</Label>
                  <Input
                    id="email-subject"
                    placeholder="Escribe el asunto del email..."
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="email-content">Contenido del Email</Label>
                  <Textarea
                    id="email-content"
                    placeholder="Escribe el contenido del email..."
                    rows={12}
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                  />
                </div>

                {/* Send Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    {selectedContacts.length > 0 ? (
                      <span className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                        {selectedContacts.length} contactos seleccionados
                      </span>
                    ) : (
                      <span className="text-gray-400">Selecciona contactos para enviar</span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEmailSubject("")
                        setEmailContent("")
                      }}
                    >
                      Limpiar
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700"
                      onClick={() =>
                        generateEmailWithAI("Crear un email profesional y atractivo para esta campaña de marketing")
                      }
                      disabled={isGeneratingEmail}
                    >
                      {isGeneratingEmail ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Bot className="h-4 w-4 mr-2" />
                      )}
                      Grok AI
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={sendEmail}
                      disabled={
                        isSendingEmail || selectedContacts.length === 0 || !emailSubject.trim() || !emailContent.trim()
                      }
                    >
                      {isSendingEmail ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Enviar Email
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
