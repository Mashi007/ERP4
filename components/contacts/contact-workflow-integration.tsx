"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Package, Sparkles, User, CheckCircle } from "lucide-react"
import ServiceSelector from "@/components/servicios/service-selector"
import ProposalGenerator from "@/components/proposals/proposal-generator"
import { toast } from "@/hooks/use-toast"

interface ContactWorkflowIntegrationProps {
  contact: {
    id: number
    name: string
    email: string
    phone?: string
    company?: string
    job_title?: string
  }
}

export default function ContactWorkflowIntegration({ contact }: ContactWorkflowIntegrationProps) {
  const [currentStep, setCurrentStep] = useState<"contact" | "service" | "proposal" | "complete">("contact")
  const [selectedService, setSelectedService] = useState<any>(null)
  const [generatedProposal, setGeneratedProposal] = useState<any>(null)
  const [servicesSelectorOpen, setServicesSelectorOpen] = useState(false)
  const [proposalGeneratorOpen, setProposalGeneratorOpen] = useState(false)

  const handleServiceSelect = (service: any) => {
    setSelectedService(service)
    setCurrentStep("service")
    toast({
      title: "Servicio seleccionado",
      description: `${service.name} seleccionado para ${contact.name}`,
    })
  }

  const handleGenerateProposal = () => {
    if (!selectedService) {
      setServicesSelectorOpen(true)
      return
    }
    setProposalGeneratorOpen(true)
  }

  const handleProposalGenerated = (proposal: any) => {
    setGeneratedProposal(proposal)
    setCurrentStep("complete")
    toast({
      title: "Flujo completado",
      description: "Propuesta generada exitosamente para el contacto",
    })
  }

  const resetWorkflow = () => {
    setCurrentStep("contact")
    setSelectedService(null)
    setGeneratedProposal(null)
  }

  const getStepStatus = (step: string) => {
    const steps = ["contact", "service", "proposal", "complete"]
    const currentIndex = steps.indexOf(currentStep)
    const stepIndex = steps.indexOf(step)

    if (stepIndex < currentIndex) return "completed"
    if (stepIndex === currentIndex) return "current"
    return "pending"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Flujo de Trabajo: Contacto → Servicio → Propuesta
        </CardTitle>
        <CardDescription>Proceso completo desde el contacto hasta la propuesta personalizada con IA</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Workflow Steps */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                getStepStatus("contact") === "completed"
                  ? "bg-green-500 text-white"
                  : getStepStatus("contact") === "current"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
              }`}
            >
              {getStepStatus("contact") === "completed" ? <CheckCircle className="h-4 w-4" /> : "1"}
            </div>
            <span className="font-medium">Contacto</span>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />

          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                getStepStatus("service") === "completed"
                  ? "bg-green-500 text-white"
                  : getStepStatus("service") === "current"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
              }`}
            >
              {getStepStatus("service") === "completed" ? <CheckCircle className="h-4 w-4" /> : "2"}
            </div>
            <span className="font-medium">Servicio</span>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />

          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                getStepStatus("proposal") === "completed"
                  ? "bg-green-500 text-white"
                  : getStepStatus("proposal") === "current"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
              }`}
            >
              {getStepStatus("proposal") === "completed" ? <CheckCircle className="h-4 w-4" /> : "3"}
            </div>
            <span className="font-medium">Propuesta</span>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Información del Contacto</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <strong>Nombre:</strong> {contact.name}
            </div>
            <div>
              <strong>Email:</strong> {contact.email}
            </div>
            {contact.company && (
              <div>
                <strong>Empresa:</strong> {contact.company}
              </div>
            )}
            {contact.job_title && (
              <div>
                <strong>Cargo:</strong> {contact.job_title}
              </div>
            )}
          </div>
        </div>

        {/* Selected Service */}
        {selectedService && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Servicio Seleccionado
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{selectedService.name}</p>
                <p className="text-sm text-gray-600">{selectedService.description}</p>
              </div>
              <Badge variant="secondary">
                {selectedService.base_price.toFixed(2)} {selectedService.currency}
              </Badge>
            </div>
          </div>
        )}

        {/* Generated Proposal */}
        {generatedProposal && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Propuesta Generada
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{generatedProposal.title}</p>
                <p className="text-sm text-gray-600">
                  {generatedProposal.total_amount.toFixed(2)} {generatedProposal.currency}
                </p>
              </div>
              <Badge variant="default">Completado</Badge>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!selectedService && (
            <Button onClick={() => setServicesSelectorOpen(true)} className="bg-green-600 hover:bg-green-700">
              <Package className="mr-2 h-4 w-4" />
              Seleccionar Servicio
            </Button>
          )}

          {selectedService && !generatedProposal && (
            <Button onClick={handleGenerateProposal} className="bg-blue-600 hover:bg-blue-700">
              <Sparkles className="mr-2 h-4 w-4" />
              Generar Propuesta
            </Button>
          )}

          {generatedProposal && (
            <Button onClick={resetWorkflow} variant="outline">
              Nuevo Flujo
            </Button>
          )}
        </div>

        {/* Service Selector Dialog */}
        <ServiceSelector
          open={servicesSelectorOpen}
          onOpenChange={setServicesSelectorOpen}
          onServiceSelect={handleServiceSelect}
          contactId={contact.id}
        />

        {/* Proposal Generator Dialog */}
        {selectedService && (
          <ProposalGenerator
            open={proposalGeneratorOpen}
            onOpenChange={setProposalGeneratorOpen}
            contact={contact}
            service={selectedService}
            onProposalGenerated={handleProposalGenerated}
          />
        )}
      </CardContent>
    </Card>
  )
}
