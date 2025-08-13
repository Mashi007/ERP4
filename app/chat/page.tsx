"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Trash2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Brain,
  Database,
  Target,
  Users,
  BarChart3,
  Clock,
  Lightbulb,
  PieChart,
} from "lucide-react"

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content:
          "¡Hola! Soy tu asistente de CRM inteligente potenciado por Claude AI. Puedo ayudarte con análisis detallados de contactos, oportunidades, actividades y métricas de tu pipeline. ¿En qué puedo ayudarte hoy?",
      },
    ],
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "¡Hola! Soy tu asistente de CRM inteligente potenciado por Claude AI. ¿En qué puedo ayudarte hoy?",
      },
    ])
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const isDatabaseConnected = !!process.env.DATABASE_URL
  const isClaudeConnected = !!(
    process.env.ANTHROPIC_API_KEY ||
    "sk-ant-api03-pkcVATxb7eZEivbkmYDuS5aGAO-_SKijFIOatODCCzwB9JTb4EIyR2I6AT-h0OXuGkjupKfxjtSsc7qpubBiQA"
  )
  const isXAIConnected = !!process.env.XAI_API_KEY

  const suggestedQuestions = [
    {
      question: "¿Cuáles son mis mejores oportunidades?",
      icon: Target,
      category: "Oportunidades",
    },
    {
      question: "¿Qué contactos necesitan seguimiento?",
      icon: Users,
      category: "Contactos",
    },
    {
      question: "Analiza mi pipeline de ventas",
      icon: BarChart3,
      category: "Pipeline",
    },
    {
      question: "¿Qué actividades tengo pendientes?",
      icon: Clock,
      category: "Actividades",
    },
    {
      question: "Dame insights sobre mis deals",
      icon: Lightbulb,
      category: "Insights",
    },
    {
      question: "¿Cómo está mi tasa de conversión?",
      icon: PieChart,
      category: "Métricas",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <MessageCircle className="mr-3 h-8 w-8 text-blue-600" />
              Chat IA - Asistente CRM con Claude
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

          {!isClaudeConnected && !isXAIConnected && (
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertDescription>
                Claude AI no configurado. El chat usará respuestas básicas.
                <Button variant="link" className="p-0 h-auto ml-2 text-blue-600">
                  Configurar Claude
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {isClaudeConnected && (
            <Alert className="border-green-200 bg-green-50">
              <Brain className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                ✅ Claude AI configurado y activo. Disfruta de respuestas inteligentes y detalladas.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <Brain className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">Error de conexión: {error.message}</AlertDescription>
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
                    {isClaudeConnected ? "Claude AI" : isXAIConnected ? "Grok AI" : "Básico"}
                  </Badge>
                </CardTitle>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.role === "assistant" && <Bot className="h-4 w-4 mt-1 flex-shrink-0" />}
                        {message.role === "user" && <User className="h-4 w-4 mt-1 flex-shrink-0" />}
                        <div className="flex-1">
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs opacity-70">
                              {message.createdAt
                                ? new Date(message.createdAt).toLocaleTimeString()
                                : new Date().toLocaleTimeString()}
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
                              {message.role === "assistant" && (
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
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input */}
              <div className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Pregunta sobre tu CRM..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading || !input.trim()} className="bg-blue-600 hover:bg-blue-700">
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </form>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Suggested Questions */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                  Preguntas Sugeridas
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">Consultas rápidas para tu CRM</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {suggestedQuestions.map((item, index) => {
                  const IconComponent = item.icon
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full text-left justify-start h-auto py-3 px-4 bg-white/70 hover:bg-white hover:shadow-md transition-all duration-200 border border-white/50 hover:border-blue-200 rounded-xl group"
                      onClick={() => handleInputChange({ target: { value: item.question } } as any)}
                    >
                      <div className="flex items-start space-x-3 w-full">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <IconComponent className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="text-sm font-medium text-gray-900 leading-tight mb-1 break-words hyphens-auto">
                            {item.question}
                          </div>
                          <div className="text-xs text-blue-600 font-medium truncate">{item.category}</div>
                        </div>
                      </div>
                    </Button>
                  )
                })}
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
                  className="w-full justify-start bg-transparent"
                  onClick={() => handleInputChange({ target: { value: "Muéstrame un resumen de mi pipeline" } } as any)}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Resumen Pipeline
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent"
                  onClick={() =>
                    handleInputChange({ target: { value: "¿Qué contactos necesitan seguimiento urgente?" } } as any)
                  }
                >
                  <Users className="h-4 w-4 mr-2" />
                  Seguimiento Urgente
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent"
                  onClick={() =>
                    handleInputChange({ target: { value: "Analiza mis mejores oportunidades de venta" } } as any)
                  }
                >
                  <Target className="h-4 w-4 mr-2" />
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
                    <Badge variant={isClaudeConnected ? "default" : isXAIConnected ? "secondary" : "outline"}>
                      {isClaudeConnected ? "Claude AI" : isXAIConnected ? "Grok AI" : "Básico"}
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
