import { NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET() {
  try {
    let formConfig = null

    if (sql) {
      const result = await sql`
        SELECT * FROM form_configurations 
        WHERE form_type = 'funnel' AND is_visible = true
        ORDER BY created_at DESC
        LIMIT 1
      `
      formConfig = result[0] || null
    }

    // Default funnel form fields if no configuration exists
    const defaultFields = [
      { name: "title", type: "text", label: "Título de la Oportunidad", required: true, visible: true },
      { name: "value", type: "number", label: "Valor Estimado", required: true, visible: true },
      {
        name: "stage",
        type: "select",
        label: "Etapa",
        required: true,
        visible: true,
        options: ["Nuevo", "Calificación", "Propuesta", "Negociación", "Cierre", "Ganado", "Perdido"],
      },
      { name: "probability", type: "number", label: "Probabilidad (%)", required: false, visible: true },
      { name: "expected_close_date", type: "date", label: "Cierre Esperado", required: false, visible: true },
      { name: "notes", type: "textarea", label: "Notas de la Oportunidad", required: false, visible: true },
      { name: "contact_name", type: "text", label: "Nombre del Contacto", required: true, visible: true },
      { name: "contact_email", type: "email", label: "Email del Contacto", required: true, visible: true },
      { name: "contact_phone", type: "text", label: "Teléfono", required: false, visible: true },
      { name: "company", type: "text", label: "Empresa", required: false, visible: true },
      { name: "job_title", type: "text", label: "Cargo", required: false, visible: true },
      {
        name: "lead_source",
        type: "select",
        label: "Fuente del Lead",
        required: false,
        visible: true,
        options: [
          "Website",
          "Referido",
          "Redes Sociales",
          "Email Marketing",
          "Evento",
          "Llamada Fría",
          "Cliente Existente",
          "Otro",
        ],
      },
      { name: "industry", type: "text", label: "Industria", required: false, visible: true },
      {
        name: "company_size",
        type: "select",
        label: "Tamaño de Empresa",
        required: false,
        visible: true,
        options: ["1-10", "11-50", "51-200", "201-1000", "1000+"],
      },
      {
        name: "budget_range",
        type: "select",
        label: "Rango de Presupuesto",
        required: false,
        visible: true,
        options: ["< $1,000", "$1,000 - $5,000", "$5,000 - $25,000", "$25,000 - $100,000", "$100,000+"],
      },
      {
        name: "decision_timeline",
        type: "select",
        label: "Timeline de Decisión",
        required: false,
        visible: true,
        options: ["Inmediato", "1-3 meses", "3-6 meses", "6-12 meses", "12+ meses"],
      },
      { name: "pain_points", type: "textarea", label: "Puntos de Dolor", required: false, visible: true },
      { name: "competitors", type: "text", label: "Competidores", required: false, visible: true },
      { name: "next_steps", type: "textarea", label: "Próximos Pasos", required: false, visible: true },
    ]

    const activeFields = formConfig?.fields || defaultFields

    return NextResponse.json({
      success: true,
      fields: activeFields,
      source: formConfig ? "configuration" : "default",
    })
  } catch (error) {
    console.error("Error fetching funnel active fields:", error)
    return NextResponse.json({ success: false, error: "Error al obtener campos activos del embudo" }, { status: 500 })
  }
}
