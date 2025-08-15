import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { subject, content, contactIds } = await request.json()

    if (!subject || !content || !contactIds || contactIds.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get contact details
    let contacts = []
    if (sql) {
      contacts = await sql`
        SELECT id, name, email, company
        FROM contacts 
        WHERE id = ANY(${contactIds})
      `
    }

    // In a real implementation, you would integrate with an email service like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Resend

    // For now, we'll simulate sending and log the activity
    console.log(`[Email Marketing] Sending email to ${contacts.length} contacts:`)
    console.log(`Subject: ${subject}`)
    console.log(
      `Recipients:`,
      contacts.map((c) => `${c.name} <${c.email}>`),
    )

    // Log email activity in database
    if (sql) {
      try {
        await sql`
          INSERT INTO activities (
            contact_id, type, description, created_at
          ) 
          SELECT 
            id, 
            'email_sent',
            'Email enviado: ' || ${subject},
            CURRENT_TIMESTAMP
          FROM contacts 
          WHERE id = ANY(${contactIds})
        `
      } catch (error) {
        console.error("Error logging email activity:", error)
      }
    }

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: `Email sent to ${contacts.length} contacts`,
      sentCount: contacts.length,
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Error sending email" }, { status: 500 })
  }
}
