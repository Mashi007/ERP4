"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, MoreHorizontal, Reply, Forward, Archive, Star, Clock, Paperclip } from 'lucide-react'

export default function ConversationsPage() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1)

  const conversations = [
    {
      id: 1,
      contact: "Juan Pérez",
      company: "Tech Solutions Inc.",
      subject: "Propuesta de implementación CRM",
      preview: "Hola, he revisado la propuesta que enviaste y me parece muy interesante...",
      time: "10:30 AM",
      unread: true,
      starred: true,
      hasAttachment: true,
      avatar: "/professional-man.png"
    },
    {
      id: 2,
      contact: "María García",
      company: "Marketing Pro",
      subject: "Re: Consultoría Marketing Digital",
      preview: "Perfecto, podemos programar una reunión para la próxima semana...",
      time: "9:15 AM",
      unread: false,
      starred: false,
      hasAttachment: false,
      avatar: "/professional-woman-diverse.png"
    },
    {
      id: 3,
      contact: "Carlos López",
      company: "StartupXYZ",
      subject: "Presupuesto desarrollo web",
      preview: "Necesitamos ajustar algunos puntos del presupuesto inicial...",
      time: "Ayer",
      unread: true,
      starred: false,
      hasAttachment: true,
      avatar: "/young-entrepreneur-casual.png"
    }
  ]

  const selectedConv = conversations.find(c => c.id === selectedConversation)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Conversations List */}
        <div className="w-96 bg-white border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Conversaciones</h2>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar conversaciones..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedConversation === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.contact} />
                    <AvatarFallback>
                      {conversation.contact.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium truncate ${
                        conversation.unread ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {conversation.contact}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {conversation.starred && (
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        )}
                        {conversation.hasAttachment && (
                          <Paperclip className="h-3 w-3 text-gray-400" />
                        )}
                        <span className="text-xs text-gray-500">{conversation.time}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-1">{conversation.company}</p>
                    
                    <h4 className={`text-sm truncate mb-1 ${
                      conversation.unread ? 'font-medium text-gray-900' : 'text-gray-700'
                    }`}>
                      {conversation.subject}
                    </h4>
                    
                    <p className="text-xs text-gray-500 truncate">
                      {conversation.preview}
                    </p>
                    
                    {conversation.unread && (
                      <div className="flex justify-end mt-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                          Nuevo
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation Detail */}
        <div className="flex-1">
          {selectedConv ? (
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConv.avatar || "/placeholder.svg"} alt={selectedConv.contact} />
                      <AvatarFallback>
                        {selectedConv.contact.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-lg font-semibold">{selectedConv.contact}</h2>
                      <p className="text-sm text-gray-600">{selectedConv.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4">
                  {/* Sample message */}
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={selectedConv.avatar || "/placeholder.svg"} alt={selectedConv.contact} />
                          <AvatarFallback className="text-xs">
                            {selectedConv.contact.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{selectedConv.contact}</span>
                        <span className="text-xs text-gray-500">hace 2 horas</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <h3 className="font-medium mb-2">{selectedConv.subject}</h3>
                    <div className="text-sm text-gray-700 leading-relaxed">
                      <p>Hola,</p>
                      <p className="mt-2">
                        He revisado la propuesta que enviaste y me parece muy interesante. 
                        Los puntos que más me llaman la atención son:
                      </p>
                      <ul className="mt-2 ml-4 list-disc">
                        <li>La integración con nuestros sistemas actuales</li>
                        <li>El soporte 24/7 que ofrecen</li>
                        <li>La escalabilidad de la solución</li>
                      </ul>
                      <p className="mt-2">
                        ¿Podríamos programar una reunión para discutir los detalles técnicos?
                      </p>
                      <p className="mt-2">Saludos,<br />Juan Pérez</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reply Section */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Button variant="outline" size="sm">
                    <Reply className="h-4 w-4 mr-2" />
                    Responder
                  </Button>
                  <Button variant="outline" size="sm">
                    <Forward className="h-4 w-4 mr-2" />
                    Reenviar
                  </Button>
                </div>
                
                <div className="border rounded-lg p-3">
                  <Input
                    placeholder="Escribe tu respuesta..."
                    className="border-0 p-0 focus-visible:ring-0"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecciona una conversación
                </h3>
                <p className="text-gray-600">
                  Elige una conversación de la lista para ver los detalles
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
