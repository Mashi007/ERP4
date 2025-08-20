import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM company_settings 
      ORDER BY updated_at DESC 
      LIMIT 1
    `

    if (result.length === 0) {
      // Return default company data structure
      return NextResponse.json({
        name: "",
        legal_name: "",
        tax_id: "",
        phone: "",
        mobile: "",
        email: "",
        website: "",
        address: "",
        city: "",
        state: "",
        postal_code: "",
        country: "México",
        description: "",
        logo_url: "",
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: "",
        youtube: "",
      })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching company data:", error)
    return NextResponse.json({ error: "Failed to fetch company data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Check if company settings exist
    const existing = await sql`
      SELECT id FROM company_settings 
      ORDER BY updated_at DESC 
      LIMIT 1
    `

    if (existing.length === 0) {
      // Insert new company settings
      await sql`
        INSERT INTO company_settings (
          name, legal_name, tax_id, phone, mobile, email, website,
          address, city, state, postal_code, country, description,
          logo_url, facebook, twitter, linkedin, instagram, youtube,
          created_at, updated_at
        ) VALUES (
          ${data.name}, ${data.legal_name}, ${data.tax_id}, ${data.phone}, 
          ${data.mobile}, ${data.email}, ${data.website}, ${data.address}, 
          ${data.city}, ${data.state}, ${data.postal_code}, ${data.country}, 
          ${data.description}, ${data.logo_url}, ${data.facebook}, 
          ${data.twitter}, ${data.linkedin}, ${data.instagram}, ${data.youtube},
          NOW(), NOW()
        )
      `
    } else {
      // Update existing company settings
      await sql`
        UPDATE company_settings SET
          name = ${data.name},
          legal_name = ${data.legal_name},
          tax_id = ${data.tax_id},
          phone = ${data.phone},
          mobile = ${data.mobile},
          email = ${data.email},
          website = ${data.website},
          address = ${data.address},
          city = ${data.city},
          state = ${data.state},
          postal_code = ${data.postal_code},
          country = ${data.country},
          description = ${data.description},
          logo_url = ${data.logo_url},
          facebook = ${data.facebook},
          twitter = ${data.twitter},
          linkedin = ${data.linkedin},
          instagram = ${data.instagram},
          youtube = ${data.youtube},
          updated_at = NOW()
        WHERE id = ${existing[0].id}
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving company data:", error)
    return NextResponse.json({ error: "Failed to save company data" }, { status: 500 })
  }
}
