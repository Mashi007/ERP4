import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import PipelineFieldsStorage from "@/lib/pipeline-fields-storage"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "ID de pipeline inválido" }, { status: 400 })
    }

    if (sql) {
      try {
        const result = await sql`
          SELECT 
            p.*,
            COUNT(s.id) as stage_count
          FROM pipelines p
          LEFT JOIN pipeline_stages s ON p.id = s.pipeline_id
          WHERE p.id = ${id}
          GROUP BY p.id
        `

        if (result.length === 0) {
          return NextResponse.json({ success: false, error: "Pipeline no encontrado" }, { status: 404 })
        }

        return NextResponse.json({
          success: true,
          data: result[0],
        })
      } catch (dbError) {
        console.log("Database error, using in-memory storage:", dbError)
        const storage = PipelineFieldsStorage.getInstance()
        const pipeline = storage.getPipelineById(id)

        if (!pipeline) {
          return NextResponse.json({ success: false, error: "Pipeline no encontrado" }, { status: 404 })
        }

        return NextResponse.json({
          success: true,
          data: pipeline,
        })
      }
    } else {
      const storage = PipelineFieldsStorage.getInstance()
      const pipeline = storage.getPipelineById(id)

      if (!pipeline) {
        return NextResponse.json({ success: false, error: "Pipeline no encontrado" }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: pipeline,
      })
    }
  } catch (error) {
    console.error("Error fetching pipeline:", error)
    return NextResponse.json({ success: false, error: "Error al obtener el pipeline" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "ID de pipeline inválido" }, { status: 400 })
    }

    if (sql) {
      try {
        // If setting as default, remove default from others
        if (body.is_default) {
          await sql`UPDATE pipelines SET is_default = false WHERE id != ${id}`
        }

        const result = await sql`
          UPDATE pipelines 
          SET 
            pipeline_name = ${body.pipeline_name},
            pipeline_label = ${body.pipeline_label},
            pipeline_description = ${body.pipeline_description || ""},
            is_default = ${body.is_default || false},
            is_active = ${body.is_active !== undefined ? body.is_active : true},
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${id}
          RETURNING *
        `

        if (result.length === 0) {
          return NextResponse.json({ success: false, error: "Pipeline no encontrado" }, { status: 404 })
        }

        // Get stage count
        const stageCount = await sql`
          SELECT COUNT(*) as count FROM pipeline_stages WHERE pipeline_id = ${id}
        `

        return NextResponse.json({
          success: true,
          data: { ...result[0], stage_count: stageCount[0].count },
        })
      } catch (dbError) {
        console.log("Database error, using in-memory storage:", dbError)
        const storage = PipelineFieldsStorage.getInstance()

        if (body.is_default) {
          storage.setDefaultPipeline(id)
        }

        const pipeline = storage.updatePipeline(id, body)

        if (!pipeline) {
          return NextResponse.json({ success: false, error: "Pipeline no encontrado" }, { status: 404 })
        }

        return NextResponse.json({
          success: true,
          data: pipeline,
        })
      }
    } else {
      const storage = PipelineFieldsStorage.getInstance()

      if (body.is_default) {
        storage.setDefaultPipeline(id)
      }

      const pipeline = storage.updatePipeline(id, body)

      if (!pipeline) {
        return NextResponse.json({ success: false, error: "Pipeline no encontrado" }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: pipeline,
      })
    }
  } catch (error) {
    console.error("Error updating pipeline:", error)
    return NextResponse.json({ success: false, error: "Error al actualizar el pipeline" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "ID de pipeline inválido" }, { status: 400 })
    }

    if (sql) {
      try {
        // Check if pipeline has stages
        const stageCount = await sql`
          SELECT COUNT(*) as count FROM pipeline_stages WHERE pipeline_id = ${id}
        `

        if (stageCount[0].count > 0) {
          return NextResponse.json(
            { success: false, error: "No se puede eliminar un pipeline que contiene etapas" },
            { status: 400 },
          )
        }

        // Check if it's the default pipeline
        const pipeline = await sql`
          SELECT is_default FROM pipelines WHERE id = ${id}
        `

        if (pipeline.length > 0 && pipeline[0].is_default) {
          return NextResponse.json(
            { success: false, error: "No se puede eliminar el pipeline por defecto" },
            { status: 400 },
          )
        }

        const result = await sql`
          DELETE FROM pipelines WHERE id = ${id} RETURNING *
        `

        if (result.length === 0) {
          return NextResponse.json({ success: false, error: "Pipeline no encontrado" }, { status: 404 })
        }

        return NextResponse.json({
          success: true,
          message: "Pipeline eliminado correctamente",
        })
      } catch (dbError) {
        console.log("Database error, using in-memory storage:", dbError)
        const storage = PipelineFieldsStorage.getInstance()

        try {
          const success = storage.deletePipeline(id)

          if (!success) {
            return NextResponse.json({ success: false, error: "Pipeline no encontrado" }, { status: 404 })
          }

          return NextResponse.json({
            success: true,
            message: "Pipeline eliminado correctamente",
          })
        } catch (storageError: any) {
          return NextResponse.json({ success: false, error: storageError.message }, { status: 400 })
        }
      }
    } else {
      const storage = PipelineFieldsStorage.getInstance()

      try {
        const success = storage.deletePipeline(id)

        if (!success) {
          return NextResponse.json({ success: false, error: "Pipeline no encontrado" }, { status: 404 })
        }

        return NextResponse.json({
          success: true,
          message: "Pipeline eliminado correctamente",
        })
      } catch (storageError: any) {
        return NextResponse.json({ success: false, error: storageError.message }, { status: 400 })
      }
    }
  } catch (error) {
    console.error("Error deleting pipeline:", error)
    return NextResponse.json({ success: false, error: "Error al eliminar el pipeline" }, { status: 500 })
  }
}
