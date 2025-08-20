import { NextResponse } from "next/server"

export async function GET() {
  try {
    const formsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/forms/config`)

    if (formsResponse.ok) {
      const formsData = await formsResponse.json()
      const appointmentForm = formsData.forms?.find((form: any) => form.form_name === "appointments")

      if (appointmentForm && appointmentForm.fields?.length > 0) {
        const activeFields = appointmentForm.fields.filter((field: any) => field.is_active)

        return NextResponse.json({
          fields: activeFields,
          source: "forms_configuration",
        })
      }
    }

    // Fallback to default appointment fields
    const defaultFields = [
      {
        id: "1",
        field_name: "title",
        field_label: "Título",
        field_type: "text",
        is_required: true,
        field_group: "general",
        help_text: "Título de la cita",
        is_active: true,
        field_order: 1,
      },
      {
        id: "2",
        field_name: "appointment_date",
        field_label: "Fecha",
        field_type: "date",
        is_required: true,
        field_group: "general",
        help_text: "Fecha de la cita",
        is_active: true,
        field_order: 2,
      },
      {
        id: "3",
        field_name: "duration",
        field_label: "Duración (minutos)",
        field_type: "number",
        is_required: false,
        field_group: "general",
        help_text: "Duración en minutos",
        default_value: "60",
        is_active: true,
        field_order: 3,
      },
    ]

    return NextResponse.json({
      fields: defaultFields,
      source: "default_fallback",
    })
  } catch (error) {
    console.error("Error fetching active appointment fields:", error)
    return NextResponse.json({ error: "Failed to fetch active appointment fields" }, { status: 500 })
  }
}
