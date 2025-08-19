import { NextResponse } from "next/server"
import { sql } from "@/lib/database"

// Default fields when database is not configured
const DEFAULT_FIELDS = [
  {
    field_name: "name",
    field_label: "Nombre",
    field_type: "text",
    is_required: true,
    field_group: "general",
    help_text: "Nombre completo",
  },
  {
    field_name: "company",
    field_label: "Empresa",
    field_type: "text",
    is_required: false,
    field_group: "business",
    help_text: "Nombre de la empresa",
  },
  {
    field_name: "job_title",
    field_label: "Cargo",
    field_type: "text",
    is_required: false,
    field_group: "business",
    help_text: "Título del puesto",
  },
  {
    field_name: "nif",
    field_label: "NIF",
    field_type: "text",
    is_required: false,
    field_group: "business",
    help_text: "Número de identificación fiscal",
  },
  {
    field_name: "email",
    field_label: "Email",
    field_type: "email",
    is_required: false,
    field_group: "contact_info",
    help_text: "correo@empresa.com",
  },
  {
    field_name: "phone",
    field_label: "Teléfono",
    field_type: "phone",
    is_required: false,
    field_group: "contact_info",
    help_text: "+1 234 567 8900",
  },
  {
    field_name: "status",
    field_label: "Estado",
    field_type: "select",
    is_required: false,
    field_group: "general",
    help_text: "Estado actual del contacto",
    field_options: [
      { value: "Nuevo", label: "Nuevo" },
      { value: "Calificado", label: "Calificado" },
      { value: "Ganado", label: "Ganado" },
      { value: "Perdido", label: "Perdido" },
    ],
  },
]

const DEFAULT_GROUPS = [
  {
    group_name: "general",
    group_label: "Información General",
    group_order: 1,
    is_collapsible: false,
  },
  {
    group_name: "business",
    group_label: "Información Empresarial",
    group_order: 2,
    is_collapsible: false,
  },
  {
    group_name: "contact_info",
    group_label: "Información de Contacto",
    group_order: 3,
    is_collapsible: false,
  },
]

export async function GET() {
  try {
    if (!sql) {
      return NextResponse.json({
        fields: DEFAULT_FIELDS,
        groups: DEFAULT_GROUPS,
        source: "default_fallback",
        message: "Database not configured, using default fields",
      })
    }

    // Try to fetch from form_configurations table first
    const formConfigResult = await sql`
      SELECT *
      FROM form_configurations
      WHERE form_type = 'contacts' AND is_visible = true
      ORDER BY field_order
    `

    if (formConfigResult.length > 0) {
      const fields = formConfigResult.map((field) => ({
        field_name: field.field_name,
        field_label: field.field_label,
        field_type: field.field_type,
        is_required: field.is_required,
        field_group: field.field_group || "general",
        help_text: field.placeholder_text || "",
        field_options: field.field_options || [],
      }))

      return NextResponse.json({
        fields,
        groups: DEFAULT_GROUPS,
        source: "form_configurations",
      })
    }

    // Try to fetch from legacy contact_field_configs table
    const [fieldsResult, groupsResult] = await Promise.all([
      sql`
        SELECT 
          cf.*,
          cg.group_label,
          cg.group_description
        FROM contact_field_configs cf
        LEFT JOIN contact_field_groups cg ON cf.field_group = cg.group_name
        WHERE cf.is_active = true
        ORDER BY cg.group_order, cf.field_order
      `,
      sql`
        SELECT *
        FROM contact_field_groups
        WHERE is_active = true
        ORDER BY group_order
      `,
    ])

    // Process field options
    const fields = fieldsResult.map((field) => ({
      ...field,
      field_options:
        typeof field.field_options === "string" ? JSON.parse(field.field_options) : field.field_options || [],
    }))

    return NextResponse.json({
      fields,
      groups: groupsResult,
      source: "database",
    })
  } catch (error) {
    console.error("Error fetching active contact fields:", error)

    return NextResponse.json({
      fields: DEFAULT_FIELDS,
      groups: DEFAULT_GROUPS,
      source: "default_fallback",
      error: "Error loading contact configuration. Using default configuration.",
    })
  }
}
