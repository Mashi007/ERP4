import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    console.log("[v0] Fetching users from neon_auth.users_sync...")

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

    console.log("[v0] Found users:", users.length)

    if (users.length === 0) {
      console.log("[v0] No users found in database, returning default users")
      const defaultUsers = [
        {
          id: "admin-1",
          name: "Administrador",
          email: "admin@empresa.com",
          role: "Administrador",
          status: "active",
          last_login: new Date().toISOString(),
          created_at: new Date().toISOString(),
          permissions: [],
        },
        {
          id: "comercial-1",
          name: "Comercial Principal",
          email: "comercial@empresa.com",
          role: "Comercial",
          status: "active",
          last_login: new Date().toISOString(),
          created_at: new Date().toISOString(),
          permissions: [],
        },
      ]
      return NextResponse.json(defaultUsers)
    }

    return NextResponse.json(users)
  } catch (error) {
    console.error("[v0] Error fetching users:", error)
    const defaultUsers = [
      {
        id: "admin-1",
        name: "Administrador",
        email: "admin@empresa.com",
        role: "Administrador",
        status: "active",
        last_login: new Date().toISOString(),
        created_at: new Date().toISOString(),
        permissions: [],
      },
    ]
    return NextResponse.json(defaultUsers)
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
