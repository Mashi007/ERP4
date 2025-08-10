"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, TrendingUp, Users, DollarSign, BarChart3, Lightbulb, FileText, Sparkles, RefreshCw, Download, AlertCircle, Database } from 'lucide-react'
import { getPipelineData, generatePipelineReport, type PipelineData } from "@/lib/ai-reports"

export default function ReportsPage() {
  const [pipelineData, setPipelineData] = useState<PipelineData | null>(null)
  const [aiReport, setAiReport] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPipelineData()
  }, [])

  const loadPipelineData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getPipelineData()
      setPipelineData(data)
    } catch (error) {
      console.error('Error loading pipeline data:', error)
      setError('Error al cargar los datos del pipeline. Usando datos de ejemplo.')
    } finally {
      setIsLoading(false)
    }
  }

  const generateReport = async () => {
    if (!pipelineData) return

    try {
      setIsGenerating(true)
      setError(null)
      const report = await generatePipelineReport(pipelineData)
      setAiReport(report)
    } catch (error) {
      console.error('Error generating report:', error)
      setError('Error al generar el informe. Verifique la configuración de xAI.')
    } finally {
      setIsGenerating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando datos del pipeline...</p>
        </div>
      </div>
    )
  }

  const isDatabaseConnected = !!process.env.DATABASE_URL
  const isAIConnected = !!process.env.XAI_API_KEY

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Brain className="mr-3 h-8 w-8 text-blue-600" />
              Informes Inteligentes con IA
            </h1>
            <p className="text-gray-600">Análisis avanzado de tu pipeline de ventas con Grok AI</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={loadPipelineData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar Datos
            </Button>
            <Button onClick={generateReport} disabled={isGenerating}>
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {isGenerating ? 'Generando...' : 'Generar Informe IA'}
            </Button>
          </div>
        </div>

        {/* Status Alerts */}
        <div className="space-y-4 mb-6">
          {!isDatabaseConnected && (
            <Alert>
              <Database className="h-4 w-4" />
              <AlertDescription>
                Base de datos no configurada. Usando datos de ejemplo. 
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
                xAI (Grok) no configurado. Los informes usarán análisis básico.
                <Button variant="link" className="p-0 h-auto ml-2 text-blue-600">
                  Configurar xAI
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="ai-insights">Insights IA</TabsTrigger>
            <TabsTrigger value="predictions">Predicciones</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Métricas Principales */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Oportunidades</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pipelineData?.totalDeals || 0}</div>
                  <p className="text-xs text-muted-foreground">Activas en el pipeline</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${pipelineData?.totalValue.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">En oportunidades activas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tasa Conversión</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">67%</div>
                  <p className="text-xs text-muted-foreground">Promedio del pipeline</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Deals Ganados</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {pipelineData?.stageDistribution.find(s => s.stage === 'Ganado')?.count || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Este período</p>
                </CardContent>
              </Card>
            </div>

            {/* Distribución por Etapa */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución del Pipeline por Etapa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pipelineData?.stageDistribution.map((stage, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{stage.stage}</Badge>
                        <span className="text-sm text-gray-600">{stage.count} deals</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${stage.value.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">
                          {((stage.value / (pipelineData?.totalValue || 1)) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-6">
            {/* Top Deals */}
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Oportunidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pipelineData?.topDeals.map((deal, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{deal.title}</h4>
                        <p className="text-sm text-gray-600">{deal.company}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">${deal.value.toLocaleString()}</div>
                        <Badge variant="secondary">{deal.stage}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tasas de Conversión */}
            <Card>
              <CardHeader>
                <CardTitle>Tasas de Conversión por Etapa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pipelineData?.conversionRates.map((rate, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{rate.stage}</span>
                        <span className="font-medium">{rate.rate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${rate.rate}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-6">
            {/* Informe de IA */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-blue-600" />
                  Análisis Inteligente del Pipeline
                </CardTitle>
                <div className="flex space-x-2">
                  <Button onClick={generateReport} disabled={isGenerating} size="sm">
                    {isGenerating ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    {isGenerating ? 'Generando...' : 'Generar Nuevo Análisis'}
                  </Button>
                  {aiReport && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar PDF
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {aiReport ? (
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {aiReport}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Haz clic en "Generar Nuevo Análisis" para obtener insights inteligentes sobre tu pipeline
                    </p>
                    <p className="text-sm text-gray-500">
                      {isAIConnected ? 'Powered by Grok AI - Análisis avanzado en tiempo real' : 'Análisis básico disponible sin configuración de IA'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            {/* Tendencias Mensuales */}
            <Card>
              <CardHeader>
                <CardTitle>Tendencias Mensuales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pipelineData?.monthlyTrends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{trend.month}</h4>
                        <p className="text-sm text-gray-600">{trend.deals} deals cerrados</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${trend.value.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Ingresos</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Predicciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5 text-yellow-600" />
                  Predicciones y Recomendaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Predicción de Ingresos</h4>
                    <p className="text-sm text-blue-800">
                      Basado en las tendencias actuales, se proyectan ingresos de $75,000 para el próximo mes.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Oportunidades de Mejora</h4>
                    <p className="text-sm text-green-800">
                      Enfócate en la etapa de "Demo" - tiene la mayor oportunidad de mejora en conversión.
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">Alerta de Riesgo</h4>
                    <p className="text-sm text-yellow-800">
                      3 deals grandes están en riesgo de perderse. Requieren atención inmediata.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
