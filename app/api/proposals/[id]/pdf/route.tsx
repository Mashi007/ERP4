import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { put } from "@vercel/blob"
import puppeteer from "puppeteer"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request, { params }: { params: { id: string } }) {
  let browser = null

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

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>${proposal.title}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
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
            .meta-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 30px;
                padding: 20px;
                background: #f8fafc;
                border-radius: 8px;
            }
            .content {
                margin-bottom: 40px;
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
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>${proposal.title}</h1>
        </div>

        <div class="meta-info">
            <div><strong>Cliente:</strong> ${proposal.contact_name}</div>
            <div><strong>Email:</strong> ${proposal.contact_email}</div>
            <div><strong>Empresa:</strong> ${proposal.contact_company || "No especificada"}</div>
            <div><strong>Servicio:</strong> ${proposal.service_name}</div>
            <div><strong>Fecha:</strong> ${new Date(proposal.created_at).toLocaleDateString("es-ES")}</div>
            <div><strong>Válida hasta:</strong> ${new Date(proposal.expires_at).toLocaleDateString("es-ES")}</div>
        </div>

        <div class="content">
            ${proposal.content}
        </div>

        <div class="price-section">
            <div class="price-amount">${proposal.total_amount.toFixed(2)} ${proposal.currency}</div>
            <div>Inversión Total</div>
        </div>
    </body>
    </html>
    `

    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu",
      ],
      timeout: 30000, // 30 second timeout
    })

    const page = await browser.newPage()

    page.setDefaultTimeout(20000)
    page.setDefaultNavigationTimeout(20000)

    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" })

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "15mm",
        bottom: "20mm",
        left: "15mm",
      },
      timeout: 20000, // 20 second timeout for PDF generation
    })

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
  } finally {
    if (browser) {
      try {
        await browser.close()
      } catch (closeError) {
        console.error("Error closing browser:", closeError)
      }
    }
  }
}
