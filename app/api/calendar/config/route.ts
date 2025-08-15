import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const configData = await request.json()

    // In a real implementation, this would save to your database
    console.log("Saving calendar configuration:", configData)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "Configuración guardada exitosamente",
    })
  } catch (error) {
    return NextResponse.json({ error: "Error al guardar la configuración" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const config = {
      syncEnabled: true,
      reminderEnabled: true,
      defaultDuration: "30",
      reminderTime: "15",
      timezone: "america/mexico_city",
      workingHours: {
        monday: { enabled: true, start: "09:00", end: "17:00" },
        tuesday: { enabled: true, start: "09:00", end: "17:00" },
        wednesday: { enabled: true, start: "09:00", end: "17:00" },
        thursday: { enabled: true, start: "09:00", end: "17:00" },
        friday: { enabled: true, start: "09:00", end: "17:00" },
        saturday: { enabled: false, start: "09:00", end: "17:00" },
        sunday: { enabled: false, start: "09:00", end: "17:00" },
      },
    }

    return NextResponse.json(config)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener la configuración" }, { status: 500 })
  }
}
