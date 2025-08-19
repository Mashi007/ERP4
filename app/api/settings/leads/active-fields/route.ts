import { NextResponse } from "next/server"

export async function GET() {
  try {
    const formsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/forms/config`)

    if (formsResponse.ok) {
      const formsData = await formsResponse.json()
      const leadForm = formsData.forms?.find((form: any) => form.form_name === "leads")

      if (leadForm && leadForm.fields?.length > 0) {
        const activeFields = leadForm.fields.filter((field: any) => field.is_active)

        return NextResponse.json({
          fields: activeFields,
          source: "forms_configuration",
        })
      }
    }

    // Fallback to default lead fields
    const defaultFields = [
      {
        id: "1",
        field_name: "lead_name",
        field_label: "Nombre del Lead",
        field_type: "text",
        is_required: true,
        field_group: "general",
        help_text: "Nombre del prospecto",
        is_active: true,
        field_order: 1,
      },
      {
        id: "2",
        field_name: "lead_source",
        field_label: "Fuente del Lead",
        field_type: "select",
        is_required: false,
        field_group: "general",
        help_text: "¿Cómo nos conoció?",
        field_options: [
          { value: "website", label: "Sitio web" },
          { value: "referral", label: "Referencia" },
          { value: "social_media", label: "Redes sociales" },
          { value: "advertising", label: "Publicidad" },
        ],
        is_active: true,
        field_order: 2,
      },
    ]

    return NextResponse.json({
      fields: defaultFields,
      source: "default_fallback",
    })
  } catch (error) {
    console.error("Error fetching active lead fields:", error)
    return NextResponse.json({ error: "Failed to fetch active lead fields" }, { status: 500 })
  }
}
