import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { put } from "@vercel/blob"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const proposalId = Number.parseInt(params.id)
    const { signatureData, signerName, signerEmail, signedAt } = await request.json()

    if (!signatureData || !signerName) {
      return NextResponse.json({ error: "Signature data and signer name are required" }, { status: 400 })
    }

    // Get proposal data
    const proposalResult = await sql`
      SELECT * FROM proposals WHERE id = ${proposalId}
    `

    if (proposalResult.length === 0) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    const proposal = proposalResult[0]

    // Convert base64 signature to buffer
    const signatureBuffer = Buffer.from(signatureData.replace(/^data:image\/\w+;base64,/, ""), "base64")

    // Upload signature to Vercel Blob
    const signatureFilename = `signature-${proposalId}-${Date.now()}.png`
    const signatureBlob = await put(signatureFilename, signatureBuffer, {
      access: "public",
      contentType: "image/png",
    })

    // Create digital signature record
    const signatureRecord = {
      proposalId,
      signerName,
      signerEmail: signerEmail || proposal.contact_email,
      signatureUrl: signatureBlob.url,
      signedAt: signedAt || new Date().toISOString(),
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    }

    // Update proposal status and signature URL
    await sql`
      UPDATE proposals 
      SET status = 'signed', 
          digital_signature_url = ${signatureBlob.url}, 
          signed_at = ${signatureRecord.signedAt},
          updated_at = NOW()
      WHERE id = ${proposalId}
    `

    // Log the signature event
    await sql`
      INSERT INTO proposal_communications (
        proposal_id, contact_id, communication_type, recipient, subject, message, 
        status, sent_at, created_at
      ) VALUES (
        ${proposalId}, ${proposal.contact_id}, 'signature', ${signerEmail || proposal.contact_email},
        'Propuesta firmada digitalmente', 
        ${`Propuesta firmada por ${signerName} el ${new Date(signatureRecord.signedAt).toLocaleString("es-ES")}`},
        'delivered', NOW(), NOW()
      )
    `

    return NextResponse.json({
      success: true,
      signatureUrl: signatureBlob.url,
      signedAt: signatureRecord.signedAt,
      status: "signed",
    })
  } catch (error) {
    console.error("Error processing digital signature:", error)
    return NextResponse.json(
      {
        error: "Failed to process digital signature",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const proposalId = Number.parseInt(params.id)

    const result = await sql`
      SELECT digital_signature_url, signed_at, status
      FROM proposals 
      WHERE id = ${proposalId}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    return NextResponse.json({
      signatureUrl: result[0].digital_signature_url,
      signedAt: result[0].signed_at,
      status: result[0].status,
      isSigned: result[0].status === "signed",
    })
  } catch (error) {
    console.error("Error fetching signature:", error)
    return NextResponse.json({ error: "Failed to fetch signature" }, { status: 500 })
  }
}
