import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { provider } = await request.json()

    console.log(`Connecting to ${provider}`)

    // Simulate OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newCalendar = {
      id: Date.now(),
      name: provider,
      email: `user@${provider.toLowerCase().replace(" ", "")}.com`,
      provider: provider.toLowerCase(),
      status: "connected",
      lastSync: "Ahora mismo",
      eventsCount: 0,
      syncDirection: "bidirectional",
    }

    return NextResponse.json(newCalendar)
  } catch (error) {
    return NextResponse.json({ error: "Error al conectar el calendario" }, { status: 500 })
  }
}
