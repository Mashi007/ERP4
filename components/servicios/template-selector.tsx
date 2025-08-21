"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, X, Search, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Template {
  id: number
  name: string
  content: string
  category: string
  variables?: string[]
  description?: string
}

interface TemplateSelectorProps {
  isOpen: boolean
  onClose: () => void
  onTemplateSelect: (template: Template) => void
  serviceId?: number
}

export default function TemplateSelector({ isOpen, onClose, onTemplateSelect, serviceId }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchTemplates()
    }
  }, [isOpen, serviceId])

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/templates/proposals")
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      } else {
        console.error("Error fetching templates:", response.statusText)
      }
    } catch (error) {
      console.error("Error fetching templates:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
  }

  const handleConfirmSelection = () => {
    if (selectedTemplate) {
      onTemplateSelect(selectedTemplate)
      setSelectedTemplate(null)
      setSearchTerm("")
    }
  }

  const handleClose = () => {
    setSelectedTemplate(null)
    setSearchTerm("")
    onClose()
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "comercial":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "técnica":
        return "bg-green-100 text-green-800 border-green-300"
      case "marketing":
        return "bg-purple-100 text-purple-800 border-purple-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Catálogo de Plantillas</DialogTitle>
                <DialogDescription className="text-sm text-gray-600">
                  Selecciona una plantilla para generar una propuesta personalizada
                </DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose} className="rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Search Bar */}
          <div className="flex-shrink-0 p-4 border-b bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar plantillas por nombre o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent"></div>
              </div>
            ) : filteredTemplates.length > 0 ? (
              <div className="grid gap-4">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedTemplate?.id === template.id
                        ? "border-purple-500 bg-purple-50 shadow-md"
                        : "border-gray-200 hover:border-purple-300 bg-white"
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-gray-900 truncate">{template.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className={`text-xs font-medium ${getCategoryColor(template.category)}`}
                              >
                                {template.category}
                              </Badge>
                              {template.variables && template.variables.length > 0 && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Sparkles className="h-3 w-3" />
                                  <span>{template.variables.length} variables</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {template.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                        )}

                        <div className="bg-gray-50 rounded-lg p-3 border">
                          <p className="text-xs text-gray-500 mb-1 font-medium">Vista previa del contenido:</p>
                          <div className="text-xs text-gray-700 max-h-16 overflow-hidden">
                            <div className="line-clamp-3">
                              {template.content.substring(0, 200)}
                              {template.content.length > 200 && "..."}
                            </div>
                          </div>
                        </div>

                        {template.variables && template.variables.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-2 font-medium">Variables disponibles:</p>
                            <div className="flex flex-wrap gap-1">
                              {template.variables.slice(0, 6).map((variable, index) => (
                                <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                                  {variable}
                                </Badge>
                              ))}
                              {template.variables.length > 6 && (
                                <Badge variant="secondary" className="text-xs px-2 py-1">
                                  +{template.variables.length - 6} más
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex-shrink-0">
                        {selectedTemplate?.id === template.id ? (
                          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        ) : (
                          <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <FileText className="h-12 w-12 mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">
                  {searchTerm ? "No se encontraron plantillas" : "No hay plantillas disponibles"}
                </p>
                <p className="text-sm text-center max-w-md">
                  {searchTerm
                    ? "Intenta con otros términos de búsqueda o revisa la ortografía"
                    : "Las plantillas aparecerán aquí cuando estén disponibles en el módulo de servicios"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t bg-gray-50 p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {filteredTemplates.length > 0 && (
                <span>
                  {filteredTemplates.length} plantilla{filteredTemplates.length !== 1 ? "s" : ""}
                  {searchTerm && " encontrada(s)"}
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="px-6 bg-transparent">
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmSelection}
                disabled={!selectedTemplate}
                className="px-6 bg-purple-600 hover:bg-purple-700 text-white"
              >
                Seleccionar Plantilla
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
