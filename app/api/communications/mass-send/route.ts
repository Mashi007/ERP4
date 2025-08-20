import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { type, contacts, message, subject } = await request.json()

    // Log the mass communication
    for (const contact of contacts) {
      const processedMessage = message.replace(/{nombre}/g, contact.name).replace(/{empresa}/g, contact.company)

      await sql`
        INSERT INTO communications (
          contact_id,
          type,
          subject,
          message,
          status,
          sent_at
        ) VALUES (
          ${contact.id},
          ${type},
          ${subject || ""},
          ${processedMessage},
          'sent',
          NOW()
        )
      `
    }

    return NextResponse.json({
      success: true,
      message: `${type === "email" ? "Emails" : "Mensajes de WhatsApp"} enviados exitosamente`,
      count: contacts.length,
    })
  } catch (error) {
    console.error("Error sending mass communication:", error)
    return NextResponse.json({ error: "Error al enviar los mensajes" }, { status: 500 })
  }
}
