import { NextResponse } from "next/server"

export const runtime = "nodejs" // ensure formdata streaming

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const to = String(form.get("to") || "")
    const subject = String(form.get("subject") || "")
    const text = String(form.get("text") || "")
    const file = form.get("attachment") as File | null

    // This is a stub. Integrate your email provider (Resend, SES, etc.)
    // You can stream the file content if needed:
    const attachmentMeta = file ? { name: file.name, type: file.type, size: file.size } : null

    // Simulate sending delay
    await new Promise((r) => setTimeout(r, 500))

    // Return a mock success response
    return NextResponse.json(
      {
        success: true,
        to,
        subject,
        textPreview: text.slice(0, 120),
        attachment: attachmentMeta,
        note: "Simulación de envío. Conecta tu proveedor real en este endpoint.",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("email/send error", error)
    return NextResponse.json({ success: false, error: "No se pudo enviar el email" }, { status: 500 })
  }
}
