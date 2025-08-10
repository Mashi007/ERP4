"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MessageCircle, Send, Bot, User, Sparkles, RefreshCw, Trash2, Copy, ThumbsUp, ThumbsDown, Brain, Database, AlertCircle, TrendingUp } from 'lucide-react'
import { generateChatResponse, type ChatMessage } from "@/lib/chat-ai"
import { useChat } from '@ai-sdk/react'

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de CRM inteligente. Puedo ayudarte con análisis de contactos, oportunidades, actividades y métricas de tu pipeline. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
      type: 'text'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await generateChatResponse(inputMessage, messages)
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        type: 'text'
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        timestamp: new Date(),
        type: 'text'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: '¡Hola! Soy tu asistente de CRM inteligente. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date(),
        type: 'text'
      }
    ])
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const isDatabaseConnected = !!process.env.DATABASE_URL
  const isAIConnected = !!process.env.XAI_API_KEY

  const suggestedQuestions = [
    "¿Cuáles son mis mejores oportunidades?",
    "¿Qué contactos necesitan seguimiento?",
    "Analiza mi pipeline de ventas",
    "¿Qué actividades tengo pendientes?",
    "Dame insights sobre mis deals",
    "¿Cómo está mi tasa de conversión?"
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <MessageCircle className="mr-3 h-8 w-8 text-blue-600" />
              Chat IA - Asistente CRM
            </h1>
            <p className="text-gray-600">Consulta inteligente sobre tu pipeline y contactos</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={clearChat}>
              <Trash2 className="h-4 w-4 mr-2" />
              Limpiar Chat
            </Button>
          </div>
        </div>

        {/* Status Alerts */}
        <div className="space-y-4 mb-6">
          {!isDatabaseConnected && (
            <Alert>
              <Database className="h-4 w-4" />
              <AlertDescription>
                Base de datos no configurada. Usando datos de ejemplo para el chat.
                <Button variant="link" className="p-0 h-auto ml-2 text-blue-600">
                  Configurar Neon
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          {!isAIConnected && (
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertDescription>
                xAI (Grok) no configurado. El chat usará respuestas básicas.
                <Button variant="link" className="p-0 h-auto ml-2 text-blue-600">
                  Configurar xAI
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center">
                  <Bot className="mr-2 h-5 w-5 text-blue-600" />
                  Asistente CRM
                  <Badge variant="secondary" className="ml-2">
                    {isAIConnected ? 'Grok AI' : 'Básico'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.role === 'assistant' && (
                          <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                        )}
                        {message.role === 'user' && (
                          <User className="h-4 w-4 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.content}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                                onClick={() => copyMessage(message.content)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              {message.role === 'assistant' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                                  >
                                    <ThumbsUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                                  >
                                    <ThumbsDown className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </CardContent>
              
              {/* Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Pregunta sobre tu CRM..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggested Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Preguntas Sugeridas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start text-xs h-auto py-2 px-3"
                    onClick={() => setInputMessage(question)}
                  >
                    {question}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setInputMessage("Muéstrame un resumen de mi pipeline")}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Resumen Pipeline
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setInputMessage("¿Qué contactos necesitan seguimiento urgente?")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Seguimiento Urgente
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setInputMessage("Analiza mis mejores oportunidades de venta")}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Top Oportunidades
                </Button>
              </CardContent>
            </Card>

            {/* Chat Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Estadísticas del Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Mensajes:</span>
                    <span className="font-medium">{messages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estado IA:</span>
                    <Badge variant={isAIConnected ? "default" : "secondary"}>
                      {isAIConnected ? "Activo" : "Básico"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Base de Datos:</span>
                    <Badge variant={isDatabaseConnected ? "default" : "secondary"}>
                      {isDatabaseConnected ? "Conectada" : "Mock"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
