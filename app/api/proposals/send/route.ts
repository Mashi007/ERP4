import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const isDatabaseAvailable = !!process.env.DATABASE_URL
const sql = isDatabaseAvailable ? neon(process.env.DATABASE_URL!) : null

export async function POST(request: NextRequest) {
  try {
    const { clientId, clientName, proposal, method, title } = await request.json()

    if (!clientId || !proposal || !method) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get client contact information
    let clientEmail = ""
    let clientPhone = ""

    if (sql) {
      try {
        const contacts = await sql`
          SELECT email, phone 
          FROM contacts 
          WHERE id = ${clientId}
          LIMIT 1
        `

        if (contacts.length > 0) {
          clientEmail = contacts[0].email || ""
          clientPhone = contacts[0].phone || ""
        }
      } catch (error) {
        console.error("Database error:", error)
      }
    }

    if (method === "email") {
      // Send proposal by email
      if (!clientEmail) {
        return NextResponse.json({ error: "No se encontró email del cliente" }, { status: 400 })
      }

      // Here you would integrate with your email service (SendGrid, Resend, etc.)
      // For now, we'll simulate the email sending
      console.log(`Sending proposal to ${clientEmail}:`, {
        to: clientEmail,
        subject: `${title} - ${clientName}`,
        body: proposal,
      })

      // Log the email sending activity
      if (sql) {
        try {
          await sql`
            INSERT INTO activities (contact_id, type, description, created_at)
            VALUES (${clientId}, 'email', ${"Propuesta enviada por email: " + title}, NOW())
          `
        } catch (error) {
          console.error("Error logging email activity:", error)
        }
      }

      return NextResponse.json({
        success: true,
        message: "Propuesta enviada por email exitosamente",
        method: "email",
        recipient: clientEmail,
      })
    } else if (method === "whatsapp") {
      // Send proposal by WhatsApp
      if (!clientPhone) {
        return NextResponse.json({ error: "No se encontró teléfono del cliente" }, { status: 400 })
      }

      // Here you would integrate with WhatsApp Business API
      // For now, we'll simulate the WhatsApp sending
      console.log(`Sending proposal to WhatsApp ${clientPhone}:`, {
        to: clientPhone,
        message: `Hola ${clientName}, te envío la propuesta: ${title}\n\n${proposal}`,
      })

      // Log the WhatsApp sending activity
      if (sql) {
        try {
          await sql`
            INSERT INTO activities (contact_id, type, description, created_at)
            VALUES (${clientId}, 'whatsapp', ${"Propuesta enviada por WhatsApp: " + title}, NOW())
          `
        } catch (error) {
          console.error("Error logging WhatsApp activity:", error)
        }
      }

      return NextResponse.json({
        success: true,
        message: "Propuesta enviada por WhatsApp exitosamente",
        method: "whatsapp",
        recipient: clientPhone,
      })
    } else {
      return NextResponse.json({ error: "Método de envío no válido" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error sending proposal:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
