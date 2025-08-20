import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import PipelineFieldsStorage from "@/lib/pipeline-fields-storage"

export async function GET(request: NextRequest) {
  try {
    if (sql) {
      try {
        const pipelines = await sql`
          SELECT 
            p.*,
            COUNT(s.id) as stage_count
          FROM pipelines p
          LEFT JOIN pipeline_stages s ON p.id = s.pipeline_id
          GROUP BY p.id
          ORDER BY p.pipeline_order ASC
        `

        return NextResponse.json({
          success: true,
          data: pipelines,
          usingDefaults: false,
        })
      } catch (dbError) {
        console.log("Database error, using in-memory storage:", dbError)
        const storage = PipelineFieldsStorage.getInstance()
        const pipelines = storage.getPipelines()

        return NextResponse.json({
          success: true,
          data: pipelines,
          usingDefaults: true,
        })
      }
    } else {
      const storage = PipelineFieldsStorage.getInstance()
      const pipelines = storage.getPipelines()

      return NextResponse.json({
        success: true,
        data: pipelines,
        usingDefaults: true,
      })
    }
  } catch (error) {
    console.error("Error fetching pipelines:", error)
    return NextResponse.json({ success: false, error: "Error al obtener los pipelines" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pipeline_name, pipeline_label, pipeline_description, is_default } = body

    if (!pipeline_name || !pipeline_label) {
      return NextResponse.json(
        { success: false, error: "Nombre y etiqueta del pipeline son requeridos" },
        { status: 400 },
      )
    }

    if (sql) {
      try {
        // If setting as default, remove default from others
        if (is_default) {
          await sql`UPDATE pipelines SET is_default = false`
        }

        const result = await sql`
          INSERT INTO pipelines (
            pipeline_name, pipeline_label, pipeline_description, 
            is_default, is_active, pipeline_order
          )
          VALUES (
            ${pipeline_name}, ${pipeline_label}, ${pipeline_description || ""},
            ${is_default || false}, true,
            (SELECT COALESCE(MAX(pipeline_order), 0) + 1 FROM pipelines)
          )
          RETURNING *
        `

        return NextResponse.json({
          success: true,
          data: { ...result[0], stage_count: 0 },
        })
      } catch (dbError) {
        console.log("Database error, using in-memory storage:", dbError)
        const storage = PipelineFieldsStorage.getInstance()

        if (is_default) {
          // Set all pipelines to not default
          const allPipelines = storage.getPipelines()
          allPipelines.forEach((p) => {
            storage.updatePipeline(p.id, { is_default: false })
          })
        }

        const pipeline = storage.createPipeline({
          pipeline_name,
          pipeline_label,
          pipeline_description: pipeline_description || "",
          is_default: is_default || false,
          is_active: true,
          pipeline_order: 0, // Will be set automatically
        })

        return NextResponse.json({
          success: true,
          data: pipeline,
        })
      }
    } else {
      const storage = PipelineFieldsStorage.getInstance()

      if (is_default) {
        // Set all pipelines to not default
        const allPipelines = storage.getPipelines()
        allPipelines.forEach((p) => {
          storage.updatePipeline(p.id, { is_default: false })
        })
      }

      const pipeline = storage.createPipeline({
        pipeline_name,
        pipeline_label,
        pipeline_description: pipeline_description || "",
        is_default: is_default || false,
        is_active: true,
        pipeline_order: 0, // Will be set automatically
      })

      return NextResponse.json({
        success: true,
        data: pipeline,
      })
    }
  } catch (error) {
    console.error("Error creating pipeline:", error)
    return NextResponse.json({ success: false, error: "Error al crear el pipeline" }, { status: 500 })
  }
}
