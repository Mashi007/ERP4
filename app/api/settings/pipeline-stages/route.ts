import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import PipelineFieldsStorage from "@/lib/pipeline-fields-storage"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pipelineId = searchParams.get("pipeline_id")

    if (sql) {
      try {
        let stages
        if (pipelineId) {
          stages = await sql`
            SELECT * FROM pipeline_stages 
            WHERE pipeline_id = ${Number.parseInt(pipelineId)}
            ORDER BY stage_order ASC
          `
        } else {
          stages = await sql`
            SELECT * FROM pipeline_stages 
            ORDER BY pipeline_id ASC, stage_order ASC
          `
        }

        return NextResponse.json({
          success: true,
          data: stages,
          usingDefaults: false,
        })
      } catch (dbError) {
        console.log("Database error, using in-memory storage:", dbError)
        const storage = PipelineFieldsStorage.getInstance()
        let stages

        if (pipelineId) {
          stages = storage.getStagesByPipeline(Number.parseInt(pipelineId))
        } else {
          stages = storage.getStages()
        }

        return NextResponse.json({
          success: true,
          data: stages,
          usingDefaults: true,
        })
      }
    } else {
      const storage = PipelineFieldsStorage.getInstance()
      let stages

      if (pipelineId) {
        stages = storage.getStagesByPipeline(Number.parseInt(pipelineId))
      } else {
        stages = storage.getStages()
      }

      return NextResponse.json({
        success: true,
        data: stages,
        usingDefaults: true,
      })
    }
  } catch (error) {
    console.error("Error fetching pipeline stages:", error)
    return NextResponse.json({ success: false, error: "Error al obtener las etapas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pipeline_id, stage_name, stage_label, probability, is_closed, is_won, stage_color } = body

    if (!pipeline_id || !stage_name || !stage_label) {
      return NextResponse.json(
        { success: false, error: "Pipeline ID, nombre y etiqueta son requeridos" },
        { status: 400 },
      )
    }

    if (sql) {
      try {
        const result = await sql`
          INSERT INTO pipeline_stages (
            pipeline_id, stage_name, stage_label, probability,
            is_closed, is_won, stage_color, stage_order
          )
          VALUES (
            ${pipeline_id}, ${stage_name}, ${stage_label}, ${probability || 0},
            ${is_closed || false}, ${is_won || false}, ${stage_color || "#3B82F6"},
            (SELECT COALESCE(MAX(stage_order), 0) + 1 FROM pipeline_stages WHERE pipeline_id = ${pipeline_id})
          )
          RETURNING *
        `

        return NextResponse.json({
          success: true,
          data: result[0],
        })
      } catch (dbError) {
        console.log("Database error, using in-memory storage:", dbError)
        const storage = PipelineFieldsStorage.getInstance()
        const stage = storage.createStage({
          pipeline_id,
          stage_name,
          stage_label,
          probability: probability || 0,
          is_active: true,
          is_closed: is_closed || false,
          is_won: is_won || false,
          stage_color: stage_color || "#3B82F6",
          stage_order: 0, // Will be set automatically
        })

        return NextResponse.json({
          success: true,
          data: stage,
        })
      }
    } else {
      const storage = PipelineFieldsStorage.getInstance()
      const stage = storage.createStage({
        pipeline_id,
        stage_name,
        stage_label,
        probability: probability || 0,
        is_active: true,
        is_closed: is_closed || false,
        is_won: is_won || false,
        stage_color: stage_color || "#3B82F6",
        stage_order: 0, // Will be set automatically
      })

      return NextResponse.json({
        success: true,
        data: stage,
      })
    }
  } catch (error) {
    console.error("Error creating pipeline stage:", error)
    return NextResponse.json({ success: false, error: "Error al crear la etapa" }, { status: 500 })
  }
}
