import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const users = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        'Usuario' as role,
        'active' as status,
        u.updated_at as last_login,
        u.created_at,
        '[]'::json as permissions
      FROM neon_auth.users_sync u
      WHERE u.deleted_at IS NULL
      ORDER BY u.created_at DESC
    `

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, roleId } = await request.json()

    // Note: In production, integrate with proper authentication system
    const user = {
      id: Date.now().toString(),
      name,
      email,
      role: "Usuario",
      status: "active",
      created_at: new Date().toISOString(),
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
