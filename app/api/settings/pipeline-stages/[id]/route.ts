import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import PipelineFieldsStorage from "@/lib/pipeline-fields-storage"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "ID de etapa inválido" }, { status: 400 })
    }

    if (sql) {
      try {
        const result = await sql`
          SELECT * FROM pipeline_stages WHERE id = ${id}
        `

        if (result.length === 0) {
          return NextResponse.json({ success: false, error: "Etapa no encontrada" }, { status: 404 })
        }

        return NextResponse.json({
          success: true,
          data: result[0],
        })
      } catch (dbError) {
        console.log("Database error, using in-memory storage:", dbError)
        const storage = PipelineFieldsStorage.getInstance()
        const stage = storage.getStageById(id)

        if (!stage) {
          return NextResponse.json({ success: false, error: "Etapa no encontrada" }, { status: 404 })
        }

        return NextResponse.json({
          success: true,
          data: stage,
        })
      }
    } else {
      const storage = PipelineFieldsStorage.getInstance()
      const stage = storage.getStageById(id)

      if (!stage) {
        return NextResponse.json({ success: false, error: "Etapa no encontrada" }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: stage,
      })
    }
  } catch (error) {
    console.error("Error fetching pipeline stage:", error)
    return NextResponse.json({ success: false, error: "Error al obtener la etapa" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "ID de etapa inválido" }, { status: 400 })
    }

    if (sql) {
      try {
        const result = await sql`
          UPDATE pipeline_stages 
          SET 
            stage_name = ${body.stage_name},
            stage_label = ${body.stage_label},
            probability = ${body.probability || 0},
            is_closed = ${body.is_closed || false},
            is_won = ${body.is_won || false},
            stage_color = ${body.stage_color || "#3B82F6"},
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${id}
          RETURNING *
        `

        if (result.length === 0) {
          return NextResponse.json({ success: false, error: "Etapa no encontrada" }, { status: 404 })
        }

        return NextResponse.json({
          success: true,
          data: result[0],
        })
      } catch (dbError) {
        console.log("Database error, using in-memory storage:", dbError)
        const storage = PipelineFieldsStorage.getInstance()
        const stage = storage.updateStage(id, body)

        if (!stage) {
          return NextResponse.json({ success: false, error: "Etapa no encontrada" }, { status: 404 })
        }

        return NextResponse.json({
          success: true,
          data: stage,
        })
      }
    } else {
      const storage = PipelineFieldsStorage.getInstance()
      const stage = storage.updateStage(id, body)

      if (!stage) {
        return NextResponse.json({ success: false, error: "Etapa no encontrada" }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: stage,
      })
    }
  } catch (error) {
    console.error("Error updating pipeline stage:", error)
    return NextResponse.json({ success: false, error: "Error al actualizar la etapa" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "ID de etapa inválido" }, { status: 400 })
    }

    if (sql) {
      try {
        const result = await sql`
          DELETE FROM pipeline_stages WHERE id = ${id} RETURNING *
        `

        if (result.length === 0) {
          return NextResponse.json({ success: false, error: "Etapa no encontrada" }, { status: 404 })
        }

        return NextResponse.json({
          success: true,
          message: "Etapa eliminada correctamente",
        })
      } catch (dbError) {
        console.log("Database error, using in-memory storage:", dbError)
        const storage = PipelineFieldsStorage.getInstance()
        const success = storage.deleteStage(id)

        if (!success) {
          return NextResponse.json({ success: false, error: "Etapa no encontrada" }, { status: 404 })
        }

        return NextResponse.json({
          success: true,
          message: "Etapa eliminada correctamente",
        })
      }
    } else {
      const storage = PipelineFieldsStorage.getInstance()
      const success = storage.deleteStage(id)

      if (!success) {
        return NextResponse.json({ success: false, error: "Etapa no encontrada" }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        message: "Etapa eliminada correctamente",
      })
    }
  } catch (error) {
    console.error("Error deleting pipeline stage:", error)
    return NextResponse.json({ success: false, error: "Error al eliminar la etapa" }, { status: 500 })
  }
}
