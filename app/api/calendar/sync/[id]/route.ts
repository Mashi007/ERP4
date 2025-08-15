import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const calendarId = params.id

    console.log(`Synchronizing calendar ${calendarId}`)

    // Simulate sync process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return NextResponse.json({
      success: true,
      message: "Calendario sincronizado exitosamente",
      lastSync: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Error al sincronizar el calendario" }, { status: 500 })
  }
}
