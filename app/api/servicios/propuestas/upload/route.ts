import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Falta el archivo 'file' en el FormData." }, { status: 400 })
    }

    const now = Date.now()
    // Guardar dentro de una carpeta propuestas/ con un prefijo de timestamp para evitar colisiones
    const key = `propuestas/${now}-${file.name}`

    const { url, pathname } = await put(key, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return NextResponse.json({
      url,
      pathname,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      filename: file.name,
    })
  } catch (err) {
    console.error("[Propuestas Upload] Error:", err)
    return NextResponse.json({ error: "Error al subir el documento." }, { status: 500 })
  }
}
