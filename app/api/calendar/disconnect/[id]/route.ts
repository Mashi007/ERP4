import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const calendarId = params.id

    console.log(`Disconnecting calendar ${calendarId}`)

    // Simulate disconnection process
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "Calendario desconectado exitosamente",
    })
  } catch (error) {
    return NextResponse.json({ error: "Error al desconectar el calendario" }, { status: 500 })
  }
}
