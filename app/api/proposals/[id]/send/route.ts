import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const proposalId = Number.parseInt(params.id)
    const { method, customMessage } = await request.json()

    if (!method || !["email", "whatsapp"].includes(method)) {
      return NextResponse.json({ error: "Invalid sending method" }, { status: 400 })
    }

    // Get proposal with contact information
    const proposalResult = await sql`
      SELECT p.*, c.name as contact_name, c.email as contact_email, c.phone as contact_phone,
             c.company as contact_company, s.name as service_name
      FROM proposals p
      LEFT JOIN contacts c ON p.contact_id = c.id
      LEFT JOIN services s ON p.service_id = s.id
      WHERE p.id = ${proposalId}
    `

    if (proposalResult.length === 0) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    const proposal = proposalResult[0]

    if (method === "email") {
      if (!proposal.contact_email) {
        return NextResponse.json({ error: "Contact email not found" }, { status: 400 })
      }

      // Generate PDF if not exists
      let pdfUrl = proposal.pdf_url
      if (!pdfUrl) {
        const pdfResponse = await fetch(`${request.url.replace("/send", "/pdf")}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })

        if (pdfResponse.ok) {
          const pdfData = await pdfResponse.json()
          pdfUrl = pdfData.pdfUrl
        }
      }

      const emailContent =
        customMessage ||
        `
        Estimado/a ${proposal.contact_name},

        Espero que se encuentre bien. Me complace enviarle la propuesta para ${proposal.service_name}.

        ${proposal.content.replace(/<[^>]*>/g, "").substring(0, 500)}...

        Puede revisar la propuesta completa en el documento adjunto. Si tiene alguna pregunta o necesita aclaraciones, no dude en contactarme.

        Quedo atento a sus comentarios.

        Saludos cordiales,
        Equipo de NormaPymes CRM
      `

      // Here you would integrate with your email service (SendGrid, Resend, etc.)
      console.log(`Sending proposal email to ${proposal.contact_email}:`, {
        to: proposal.contact_email,
        subject: `Propuesta: ${proposal.title}`,
        body: emailContent,
        attachment: pdfUrl,
      })

      // Log email communication
      await sql`
        INSERT INTO proposal_communications (
          proposal_id, contact_id, communication_type, recipient, subject, message, 
          status, sent_at, created_at
        ) VALUES (
          ${proposalId}, ${proposal.contact_id}, 'email', ${proposal.contact_email},
          ${`Propuesta: ${proposal.title}`}, ${emailContent}, 'sent', NOW(), NOW()
        )
      `

      // Update proposal status
      await sql`
        UPDATE proposals 
        SET status = 'sent', sent_at = NOW(), updated_at = NOW()
        WHERE id = ${proposalId}
      `

      return NextResponse.json({
        success: true,
        method: "email",
        recipient: proposal.contact_email,
        message: "Propuesta enviada por email exitosamente",
      })
    } else if (method === "whatsapp") {
      if (!proposal.contact_phone) {
        return NextResponse.json({ error: "Contact phone not found" }, { status: 400 })
      }

      const whatsappMessage =
        customMessage ||
        `
Hola ${proposal.contact_name} 👋

Te envío la propuesta para *${proposal.service_name}*

📋 *${proposal.title}*
💰 Inversión: ${proposal.total_amount.toFixed(2)} ${proposal.currency}

${proposal.pdf_url ? `📄 Documento: ${proposal.pdf_url}` : ""}

¿Te parece si coordinamos una llamada para revisar los detalles?

Saludos! 🚀
      `.trim()

      // Here you would integrate with WhatsApp Business API
      console.log(`Sending proposal WhatsApp to ${proposal.contact_phone}:`, {
        to: proposal.contact_phone,
        message: whatsappMessage,
      })

      // Log WhatsApp communication
      await sql`
        INSERT INTO proposal_communications (
          proposal_id, contact_id, communication_type, recipient, subject, message, 
          status, sent_at, created_at
        ) VALUES (
          ${proposalId}, ${proposal.contact_id}, 'whatsapp', ${proposal.contact_phone},
          ${`Propuesta WhatsApp: ${proposal.title}`}, ${whatsappMessage}, 'sent', NOW(), NOW()
        )
      `

      // Update proposal status
      await sql`
        UPDATE proposals 
        SET status = 'sent', sent_at = NOW(), updated_at = NOW()
        WHERE id = ${proposalId}
      `

      return NextResponse.json({
        success: true,
        method: "whatsapp",
        recipient: proposal.contact_phone,
        message: "Propuesta enviada por WhatsApp exitosamente",
      })
    }
  } catch (error) {
    console.error("Error sending proposal:", error)
    return NextResponse.json(
      {
        error: "Failed to send proposal",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
