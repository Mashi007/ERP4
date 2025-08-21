import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { content, variables, sampleData } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Simple variable substitution for preview
    let preview = content

    // Replace contact variables
    if (sampleData.contact) {
      preview = preview.replace(/\{\{contact\.name\}\}/g, sampleData.contact.name || "")
      preview = preview.replace(/\{\{contact\.email\}\}/g, sampleData.contact.email || "")
      preview = preview.replace(/\{\{contact\.company\}\}/g, sampleData.contact.company || "")
      preview = preview.replace(/\{\{contact\.phone\}\}/g, sampleData.contact.phone || "")
    }

    // Replace service variables
    if (sampleData.service) {
      preview = preview.replace(/\{\{service\.name\}\}/g, sampleData.service.name || "")
      preview = preview.replace(/\{\{service\.description\}\}/g, sampleData.service.description || "")
      preview = preview.replace(/\{\{service\.base_price\}\}/g, sampleData.service.base_price?.toString() || "")
      preview = preview.replace(/\{\{service\.currency\}\}/g, sampleData.service.currency || "")
    }

    // Replace other variables
    preview = preview.replace(/\{\{current_date\}\}/g, sampleData.current_date || "")

    // Convert markdown-style formatting to HTML
    preview = preview
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/^\* (.*$)/gm, "<li>$1</li>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/^(?!<[h|l])/gm, "<p>")
      .replace(/(?<![>])$/gm, "</p>")

    return NextResponse.json({ preview })
  } catch (error) {
    console.error("Error generating preview:", error)
    return NextResponse.json({ error: "Failed to generate preview" }, { status: 500 })
  }
}
