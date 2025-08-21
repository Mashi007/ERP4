"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package, Clock, Euro } from "lucide-react"
import { toast } from "@/hooks/use-toast"

type Service = {
  id: number
  name: string
  description: string
  category: string
  base_price: number
  currency: string
  duration_hours: number
  features: string[]
  requirements: string[]
  deliverables: string[]
  is_active: boolean
  created_at: string
}

interface ServiceSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onServiceSelect: (service: Service) => void
  contactId?: number
}

export default function ServiceSelector({ open, onOpenChange, onServiceSelect, contactId }: ServiceSelectorProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  useEffect(() => {
    if (open) {
      loadServices()
    }
  }, [open])

  const loadServices = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/services")
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar los servicios",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading services:", error)
      toast({
        title: "Error",
        description: "Error de conexión al cargar servicios",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleServiceSelect = () => {
    if (selectedService) {
      onServiceSelect(selectedService)
      onOpenChange(false)
      setSelectedService(null)
    }
  }

  // Group services by category
  const servicesByCategory = services.reduce(
    (acc, service) => {
      const category = service.category || "General"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(service)
      return acc
    },
    {} as Record<string, Service[]>,
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Catálogo de Servicios
          </DialogTitle>
          <DialogDescription>Selecciona un servicio para generar una propuesta personalizada</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Cargando servicios...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-3 text-blue-600">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryServices.map((service) => (
                    <Card
                      key={service.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedService?.id === service.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedService(service)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">{service.name}</CardTitle>
                          <Badge variant="secondary" className="ml-2">
                            {service.category}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm">{service.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Euro className="h-4 w-4" />
                            <span className="font-semibold">
                              {service.base_price.toFixed(2)} {service.currency}
                            </span>
                          </div>
                          {service.duration_hours > 0 && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{service.duration_hours}h</span>
                            </div>
                          )}
                        </div>

                        {service.features && service.features.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-700">Características:</p>
                            <div className="flex flex-wrap gap-1">
                              {service.features.slice(0, 3).map((feature, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                              {service.features.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{service.features.length - 3} más
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleServiceSelect} disabled={!selectedService} className="bg-blue-600 hover:bg-blue-700">
            Seleccionar Servicio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
