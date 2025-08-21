import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { htmlContent, contactId, proposalId } = await request.json()

    let cleanContent = htmlContent
    if (cleanContent.startsWith("```html")) {
      cleanContent = cleanContent.replace(/```html\n?/, "").replace(/\n?```$/, "")
    }

    const fullHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #1A4F7A; border-bottom: 2px solid #1A4F7A; padding-bottom: 10px; }
        h2 { color: #2563eb; margin-top: 30px; }
        ul { margin: 15px 0; }
        li { margin: 5px 0; }
        .footer { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px; }
      </style>
    </head>
    <body>
      ${cleanContent}
      <div class="footer">
        <p><strong>Documento generado:</strong> ${new Date().toLocaleDateString("es-ES")}</p>
        <p><strong>ID:</strong> ${proposalId}</p>
      </div>
    </body>
    </html>
    `

    const pdfDataUri = `data:text/html;charset=utf-8,${encodeURIComponent(fullHtml)}`

    return NextResponse.json({
      pdfUrl: pdfDataUri,
      htmlContent: fullHtml,
      status: "success",
    })
  } catch (error) {
    console.error("Error generando PDF:", error)
    return NextResponse.json(
      {
        error: error.message,
        status: "error",
      },
      { status: 500 },
    )
  }
}
