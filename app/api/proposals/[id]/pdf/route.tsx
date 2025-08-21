import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { put } from "@vercel/blob"
import puppeteer from "puppeteer"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const proposalId = Number.parseInt(params.id)

    // Get proposal data
    const proposalResult = await sql`
      SELECT p.*, c.name as contact_name, c.email as contact_email, c.company as contact_company,
             s.name as service_name, s.category as service_category
      FROM proposals p
      LEFT JOIN contacts c ON p.contact_id = c.id
      LEFT JOIN services s ON p.service_id = s.id
      WHERE p.id = ${proposalId}
    `

    if (proposalResult.length === 0) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    const proposal = proposalResult[0]

    // Create HTML template for PDF
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${proposal.title}</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 20px;
                background: white;
            }
            .header {
                text-align: center;
                border-bottom: 3px solid #2563eb;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .header h1 {
                color: #2563eb;
                font-size: 28px;
                margin: 0;
            }
            .header .subtitle {
                color: #6b7280;
                font-size: 16px;
                margin-top: 10px;
            }
            .meta-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 30px;
                padding: 20px;
                background: #f8fafc;
                border-radius: 8px;
            }
            .meta-item {
                display: flex;
                flex-direction: column;
            }
            .meta-label {
                font-weight: 600;
                color: #374151;
                font-size: 14px;
                margin-bottom: 4px;
            }
            .meta-value {
                color: #6b7280;
                font-size: 14px;
            }
            .content {
                margin-bottom: 40px;
            }
            .content h1, .content h2, .content h3 {
                color: #1f2937;
                margin-top: 30px;
                margin-bottom: 15px;
            }
            .content h1 {
                font-size: 24px;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 10px;
            }
            .content h2 {
                font-size: 20px;
                color: #2563eb;
            }
            .content h3 {
                font-size: 18px;
            }
            .content p {
                margin-bottom: 15px;
                text-align: justify;
            }
            .content ul, .content ol {
                margin-bottom: 15px;
                padding-left: 25px;
            }
            .content li {
                margin-bottom: 8px;
            }
            .price-section {
                background: #f0f9ff;
                border: 2px solid #2563eb;
                border-radius: 8px;
                padding: 20px;
                margin: 30px 0;
                text-align: center;
            }
            .price-amount {
                font-size: 32px;
                font-weight: bold;
                color: #2563eb;
                margin-bottom: 10px;
            }
            .price-label {
                color: #6b7280;
                font-size: 16px;
            }
            .footer {
                border-top: 2px solid #e5e7eb;
                padding-top: 20px;
                margin-top: 40px;
                text-align: center;
                color: #6b7280;
                font-size: 14px;
            }
            .signature-section {
                margin-top: 50px;
                padding: 30px;
                border: 2px dashed #d1d5db;
                border-radius: 8px;
                text-align: center;
                background: #fafafa;
            }
            .signature-title {
                font-weight: 600;
                color: #374151;
                margin-bottom: 20px;
                font-size: 18px;
            }
            .signature-line {
                border-bottom: 2px solid #374151;
                width: 300px;
                margin: 20px auto;
                height: 40px;
            }
            .signature-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
                margin-top: 30px;
            }
            .signature-field {
                text-align: center;
            }
            .signature-field label {
                display: block;
                font-weight: 600;
                color: #374151;
                margin-bottom: 10px;
            }
            .signature-field .line {
                border-bottom: 1px solid #374151;
                height: 30px;
                margin-bottom: 5px;
            }
            @media print {
                body { margin: 0; padding: 20px; }
                .signature-section { page-break-inside: avoid; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>${proposal.title}</h1>
            <div class="subtitle">Propuesta Comercial Generada con IA</div>
        </div>

        <div class="meta-info">
            <div class="meta-item">
                <span class="meta-label">Cliente:</span>
                <span class="meta-value">${proposal.contact_name}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Email:</span>
                <span class="meta-value">${proposal.contact_email}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Empresa:</span>
                <span class="meta-value">${proposal.contact_company || "No especificada"}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Servicio:</span>
                <span class="meta-value">${proposal.service_name}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Fecha:</span>
                <span class="meta-value">${new Date(proposal.created_at).toLocaleDateString("es-ES")}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Válida hasta:</span>
                <span class="meta-value">${new Date(proposal.expires_at).toLocaleDateString("es-ES")}</span>
            </div>
        </div>

        <div class="content">
            ${proposal.content}
        </div>

        <div class="price-section">
            <div class="price-amount">${proposal.total_amount.toFixed(2)} ${proposal.currency}</div>
            <div class="price-label">Inversión Total</div>
        </div>

        <div class="signature-section">
            <div class="signature-title">Aceptación de Propuesta</div>
            <p>Al firmar este documento, acepto los términos y condiciones establecidos en esta propuesta.</p>
            
            <div class="signature-info">
                <div class="signature-field">
                    <label>Firma del Cliente:</label>
                    <div class="line"></div>
                    <small>Nombre: ${proposal.contact_name}</small>
                </div>
                <div class="signature-field">
                    <label>Fecha:</label>
                    <div class="line"></div>
                    <small>DD/MM/AAAA</small>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>Este documento fue generado automáticamente el ${new Date().toLocaleDateString("es-ES")} a las ${new Date().toLocaleTimeString("es-ES")}</p>
            <p>Propuesta ID: ${proposal.id} | Estado: ${proposal.status}</p>
        </div>
    </body>
    </html>
    `

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "15mm",
        bottom: "20mm",
        left: "15mm",
      },
    })

    await browser.close()

    // Upload PDF to Vercel Blob
    const filename = `proposal-${proposalId}-${Date.now()}.pdf`
    const blob = await put(filename, pdfBuffer, {
      access: "public",
      contentType: "application/pdf",
    })

    // Update proposal with PDF URL
    await sql`
      UPDATE proposals 
      SET pdf_url = ${blob.url}, updated_at = NOW()
      WHERE id = ${proposalId}
    `

    return NextResponse.json({
      success: true,
      pdfUrl: blob.url,
      filename,
      size: pdfBuffer.length,
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
