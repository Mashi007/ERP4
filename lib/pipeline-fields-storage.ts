// In-memory storage for pipeline configuration when database is not available
interface PipelineStage {
  id: number
  stage_name: string
  stage_label: string
  stage_order: number
  probability: number
  is_active: boolean
  is_closed: boolean
  is_won: boolean
  stage_color: string
  pipeline_id: number
  created_at: string
  updated_at: string
}

interface Pipeline {
  id: number
  pipeline_name: string
  pipeline_label: string
  pipeline_description?: string
  is_active: boolean
  is_default: boolean
  pipeline_order: number
  stage_count?: number
  created_at: string
  updated_at: string
}

interface PipelineFlow {
  id: number
  from_stage_id: number
  to_stage_id: number
  flow_name: string
  flow_description?: string
  is_automatic: boolean
  conditions: any
  actions: any
  created_at: string
  updated_at: string
}

class PipelineFieldsStorage {
  private static instance: PipelineFieldsStorage
  private pipelines: Pipeline[] = []
  private stages: PipelineStage[] = []
  private flows: PipelineFlow[] = []
  private nextPipelineId = 1
  private nextStageId = 1
  private nextFlowId = 1

  private constructor() {
    this.initializeDefaults()
  }

  static getInstance(): PipelineFieldsStorage {
    if (!PipelineFieldsStorage.instance) {
      PipelineFieldsStorage.instance = new PipelineFieldsStorage()
    }
    return PipelineFieldsStorage.instance
  }

  private initializeDefaults() {
    // Default pipelines
    this.pipelines = [
      {
        id: 1,
        pipeline_name: "ventas_principal",
        pipeline_label: "Pipeline Principal de Ventas",
        pipeline_description: "Pipeline estándar para el proceso de ventas",
        is_active: true,
        is_default: true,
        pipeline_order: 1,
        stage_count: 6,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        pipeline_name: "ventas_corporativas",
        pipeline_label: "Ventas Corporativas",
        pipeline_description: "Pipeline especializado para clientes corporativos",
        is_active: true,
        is_default: false,
        pipeline_order: 2,
        stage_count: 8,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        pipeline_name: "renovaciones",
        pipeline_label: "Renovaciones y Upselling",
        pipeline_description: "Pipeline para renovaciones de contratos existentes",
        is_active: true,
        is_default: false,
        pipeline_order: 3,
        stage_count: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    // Default stages for main sales pipeline
    this.stages = [
      {
        id: 1,
        stage_name: "nuevo",
        stage_label: "Nuevo",
        stage_order: 1,
        probability: 10,
        is_active: true,
        is_closed: false,
        is_won: false,
        stage_color: "#3B82F6",
        pipeline_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        stage_name: "calificacion",
        stage_label: "Calificación",
        stage_order: 2,
        probability: 25,
        is_active: true,
        is_closed: false,
        is_won: false,
        stage_color: "#8B5CF6",
        pipeline_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        stage_name: "propuesta",
        stage_label: "Propuesta",
        stage_order: 3,
        probability: 50,
        is_active: true,
        is_closed: false,
        is_won: false,
        stage_color: "#F59E0B",
        pipeline_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 4,
        stage_name: "negociacion",
        stage_label: "Negociación",
        stage_order: 4,
        probability: 75,
        is_active: true,
        is_closed: false,
        is_won: false,
        stage_color: "#EF4444",
        pipeline_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 5,
        stage_name: "ganado",
        stage_label: "Ganado",
        stage_order: 5,
        probability: 100,
        is_active: true,
        is_closed: true,
        is_won: true,
        stage_color: "#10B981",
        pipeline_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 6,
        stage_name: "perdido",
        stage_label: "Perdido",
        stage_order: 6,
        probability: 0,
        is_active: true,
        is_closed: true,
        is_won: false,
        stage_color: "#6B7280",
        pipeline_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      // Corporate sales pipeline stages
      {
        id: 7,
        stage_name: "prospecto",
        stage_label: "Prospecto",
        stage_order: 1,
        probability: 5,
        is_active: true,
        is_closed: false,
        is_won: false,
        stage_color: "#3B82F6",
        pipeline_id: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 8,
        stage_name: "contacto_inicial",
        stage_label: "Contacto Inicial",
        stage_order: 2,
        probability: 15,
        is_active: true,
        is_closed: false,
        is_won: false,
        stage_color: "#6366F1",
        pipeline_id: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 9,
        stage_name: "reunion_descubrimiento",
        stage_label: "Reunión de Descubrimiento",
        stage_order: 3,
        probability: 30,
        is_active: true,
        is_closed: false,
        is_won: false,
        stage_color: "#8B5CF6",
        pipeline_id: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 10,
        stage_name: "demo_tecnica",
        stage_label: "Demo Técnica",
        stage_order: 4,
        probability: 45,
        is_active: true,
        is_closed: false,
        is_won: false,
        stage_color: "#A855F7",
        pipeline_id: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 11,
        stage_name: "propuesta_comercial",
        stage_label: "Propuesta Comercial",
        stage_order: 5,
        probability: 60,
        is_active: true,
        is_closed: false,
        is_won: false,
        stage_color: "#F59E0B",
        pipeline_id: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 12,
        stage_name: "revision_legal",
        stage_label: "Revisión Legal",
        stage_order: 6,
        probability: 80,
        is_active: true,
        is_closed: false,
        is_won: false,
        stage_color: "#F97316",
        pipeline_id: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 13,
        stage_name: "ganado_corporativo",
        stage_label: "Ganado",
        stage_order: 7,
        probability: 100,
        is_active: true,
        is_closed: true,
        is_won: true,
        stage_color: "#10B981",
        pipeline_id: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 14,
        stage_name: "perdido_corporativo",
        stage_label: "Perdido",
        stage_order: 8,
        probability: 0,
        is_active: true,
        is_closed: true,
        is_won: false,
        stage_color: "#6B7280",
        pipeline_id: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      // Renewals pipeline stages
      {
        id: 15,
        stage_name: "renovacion_pendiente",
        stage_label: "Renovación Pendiente",
        stage_order: 1,
        probability: 70,
        is_active: true,
        is_closed: false,
        is_won: false,
        stage_color: "#3B82F6",
        pipeline_id: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 16,
        stage_name: "negociacion_renovacion",
        stage_label: "Negociación",
        stage_order: 2,
        probability: 85,
        is_active: true,
        is_closed: false,
        is_won: false,
        stage_color: "#F59E0B",
        pipeline_id: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 17,
        stage_name: "renovado",
        stage_label: "Renovado",
        stage_order: 3,
        probability: 100,
        is_active: true,
        is_closed: true,
        is_won: true,
        stage_color: "#10B981",
        pipeline_id: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 18,
        stage_name: "no_renovado",
        stage_label: "No Renovado",
        stage_order: 4,
        probability: 0,
        is_active: true,
        is_closed: true,
        is_won: false,
        stage_color: "#6B7280",
        pipeline_id: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    // Default flows
    this.flows = [
      {
        id: 1,
        from_stage_id: 1,
        to_stage_id: 2,
        flow_name: "nuevo_a_calificacion",
        flow_description: "Transición automática cuando se completa la información básica",
        is_automatic: false,
        conditions: {},
        actions: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        from_stage_id: 2,
        to_stage_id: 3,
        flow_name: "calificacion_a_propuesta",
        flow_description: "Cuando el lead está calificado y listo para propuesta",
        is_automatic: false,
        conditions: {},
        actions: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        from_stage_id: 3,
        to_stage_id: 4,
        flow_name: "propuesta_a_negociacion",
        flow_description: "Cuando la propuesta es aceptada y se inicia negociación",
        is_automatic: false,
        conditions: {},
        actions: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    this.nextPipelineId = Math.max(...this.pipelines.map((p) => p.id)) + 1
    this.nextStageId = Math.max(...this.stages.map((s) => s.id)) + 1
    this.nextFlowId = Math.max(...this.flows.map((f) => f.id)) + 1
  }

  // Pipeline operations
  getPipelines(): Pipeline[] {
    return this.pipelines.map((pipeline) => ({
      ...pipeline,
      stage_count: this.stages.filter((s) => s.pipeline_id === pipeline.id).length,
    }))
  }

  getPipelineById(id: number): Pipeline | undefined {
    const pipeline = this.pipelines.find((p) => p.id === id)
    if (pipeline) {
      return {
        ...pipeline,
        stage_count: this.stages.filter((s) => s.pipeline_id === pipeline.id).length,
      }
    }
    return undefined
  }

  createPipeline(pipelineData: Omit<Pipeline, "id" | "created_at" | "updated_at">): Pipeline {
    const newPipeline: Pipeline = {
      ...pipelineData,
      id: this.nextPipelineId++,
      pipeline_order: pipelineData.pipeline_order || this.pipelines.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.pipelines.push(newPipeline)
    return {
      ...newPipeline,
      stage_count: 0,
    }
  }

  updatePipeline(id: number, pipelineData: Partial<Pipeline>): Pipeline | null {
    const index = this.pipelines.findIndex((p) => p.id === id)
    if (index === -1) return null

    this.pipelines[index] = {
      ...this.pipelines[index],
      ...pipelineData,
      updated_at: new Date().toISOString(),
    }
    return {
      ...this.pipelines[index],
      stage_count: this.stages.filter((s) => s.pipeline_id === id).length,
    }
  }

  deletePipeline(id: number): boolean {
    const pipeline = this.getPipelineById(id)
    if (!pipeline) return false

    // Check if pipeline has stages
    const hasStages = this.stages.some((s) => s.pipeline_id === id)
    if (hasStages) {
      throw new Error("No se puede eliminar un pipeline que contiene etapas")
    }

    const index = this.pipelines.findIndex((p) => p.id === id)
    this.pipelines.splice(index, 1)
    return true
  }

  // Stage operations
  getStages(): PipelineStage[] {
    return [...this.stages]
  }

  getStagesByPipeline(pipelineId: number): PipelineStage[] {
    return this.stages.filter((s) => s.pipeline_id === pipelineId).sort((a, b) => a.stage_order - b.stage_order)
  }

  getStageById(id: number): PipelineStage | undefined {
    return this.stages.find((s) => s.id === id)
  }

  createStage(stageData: Omit<PipelineStage, "id" | "created_at" | "updated_at">): PipelineStage {
    const pipelineStages = this.stages.filter((s) => s.pipeline_id === stageData.pipeline_id)
    const maxOrder = Math.max(...pipelineStages.map((s) => s.stage_order), 0)

    const newStage: PipelineStage = {
      ...stageData,
      id: this.nextStageId++,
      stage_order: stageData.stage_order || maxOrder + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.stages.push(newStage)
    return newStage
  }

  updateStage(id: number, stageData: Partial<PipelineStage>): PipelineStage | null {
    const index = this.stages.findIndex((s) => s.id === id)
    if (index === -1) return null

    this.stages[index] = {
      ...this.stages[index],
      ...stageData,
      updated_at: new Date().toISOString(),
    }
    return this.stages[index]
  }

  deleteStage(id: number): boolean {
    const index = this.stages.findIndex((s) => s.id === id)
    if (index === -1) return false

    this.stages.splice(index, 1)
    return true
  }

  // Flow operations
  getFlows(): PipelineFlow[] {
    return [...this.flows]
  }

  getFlowsByPipeline(pipelineId: number): PipelineFlow[] {
    const pipelineStageIds = this.stages.filter((s) => s.pipeline_id === pipelineId).map((s) => s.id)
    return this.flows.filter(
      (f) => pipelineStageIds.includes(f.from_stage_id) || pipelineStageIds.includes(f.to_stage_id),
    )
  }

  createFlow(flowData: Omit<PipelineFlow, "id" | "created_at" | "updated_at">): PipelineFlow {
    const newFlow: PipelineFlow = {
      ...flowData,
      id: this.nextFlowId++,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.flows.push(newFlow)
    return newFlow
  }

  updateFlow(id: number, flowData: Partial<PipelineFlow>): PipelineFlow | null {
    const index = this.flows.findIndex((f) => f.id === id)
    if (index === -1) return null

    this.flows[index] = {
      ...this.flows[index],
      ...flowData,
      updated_at: new Date().toISOString(),
    }
    return this.flows[index]
  }

  deleteFlow(id: number): boolean {
    const index = this.flows.findIndex((f) => f.id === id)
    if (index === -1) return false

    this.flows.splice(index, 1)
    return true
  }

  // Utility methods
  reorderStages(pipelineId: number, stageIds: number[]): void {
    stageIds.forEach((id, index) => {
      const stage = this.getStageById(id)
      if (stage && stage.pipeline_id === pipelineId) {
        stage.stage_order = index + 1
      }
    })
  }

  reorderPipelines(pipelineIds: number[]): void {
    pipelineIds.forEach((id, index) => {
      const pipeline = this.getPipelineById(id)
      if (pipeline) {
        const pipelineIndex = this.pipelines.findIndex((p) => p.id === id)
        if (pipelineIndex !== -1) {
          this.pipelines[pipelineIndex].pipeline_order = index + 1
        }
      }
    })
  }

  getDefaultPipeline(): Pipeline | undefined {
    return this.pipelines.find((p) => p.is_default)
  }

  setDefaultPipeline(id: number): boolean {
    // Remove default from all pipelines
    this.pipelines.forEach((p) => {
      p.is_default = false
    })

    // Set new default
    const pipeline = this.pipelines.find((p) => p.id === id)
    if (pipeline) {
      pipeline.is_default = true
      return true
    }
    return false
  }
}

export default PipelineFieldsStorage
